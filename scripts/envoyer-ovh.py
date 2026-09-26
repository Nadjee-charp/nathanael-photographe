"""
Envoie le site sur l'hébergement OVH depuis cet ordinateur, comme un `git push`.

Le mot de passe FTP n'est jamais écrit dans le dépôt, ni tapé, ni affiché par ce script :
il est rangé une fois pour toutes dans le Gestionnaire d'identifiants de Windows, par la
personne qui le connaît, avec cette commande (Windows le demande sans l'afficher) :

    cmdkey /generic:ovh-nathanael /user:IDENTIFIANT_FTP /pass

Le serveur FTP et le dossier du site sont dans scripts/ovh.json (rien de secret).

    python scripts/envoyer-ovh.py essai            connexion et état du serveur, rien n'est modifié
    python scripts/envoyer-ovh.py bascule          1re mise en ligne : tout part dans www-nouveau,
                                                   hors ligne ; l'ancien site reste en place
    python scripts/envoyer-ovh.py bascule --oui    puis l'échange : www devient ancien-site-wordpress-…,
                                                   www-nouveau devient www (rien n'est supprimé)
    python scripts/envoyer-ovh.py maj              mises à jour : seulement ce qui a changé, dans www
    python scripts/envoyer-ovh.py retour --oui     remet l'ancien site en place

Toujours préparer le dossier avant : npm run ovh
"""
from __future__ import annotations

import ctypes
import ctypes.wintypes as wt
import datetime as dt
import ftplib
import io
import json
import posixpath
import queue
import ssl
import sys
import threading
import time
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

PROJET = Path(__file__).resolve().parent.parent
LIVRAISON = PROJET / 'livraison-ovh'
CONF = json.loads((PROJET / 'scripts' / 'ovh.json').read_text(encoding='utf-8'))
SERVEUR = CONF.get('serveur', '').strip()
RACINE = CONF.get('racine', 'www').strip('/')
NOUVEAU = RACINE + '-nouveau'
CIBLE = CONF.get('identifiant_windows', 'ovh-nathanael')
ANCIEN = 'ancien-site-wordpress'
CONNEXIONS = 4
# Fichiers dont le contenu peut changer sans que la taille change : toujours renvoyés.
# Les images, scripts et feuilles de style d'Astro portent une empreinte dans leur nom.
TOUJOURS = ('.html', '.xml', '.txt', '.php', '.htaccess', '.json', '.webmanifest', '.svg', '.ico')

verrou = threading.RLock()


def dire(*a):
    with verrou:
        print(*a, flush=True)


def stop(msg: str):
    print('\nARRÊT : ' + msg, file=sys.stderr, flush=True)
    sys.exit(1)


# ————— identifiants Windows —————
class _CRED(ctypes.Structure):
    _fields_ = [
        ('Flags', wt.DWORD), ('Type', wt.DWORD), ('TargetName', wt.LPWSTR), ('Comment', wt.LPWSTR),
        ('LastWritten', wt.FILETIME), ('CredentialBlobSize', wt.DWORD),
        ('CredentialBlob', ctypes.POINTER(ctypes.c_ubyte)), ('Persist', wt.DWORD),
        ('AttributeCount', wt.DWORD), ('Attributes', ctypes.c_void_p),
        ('TargetAlias', wt.LPWSTR), ('UserName', wt.LPWSTR),
    ]


def identifiants() -> tuple[str, str]:
    adv = ctypes.WinDLL('advapi32', use_last_error=True)
    lire = adv.CredReadW
    lire.argtypes = [wt.LPCWSTR, wt.DWORD, wt.DWORD, ctypes.POINTER(ctypes.POINTER(_CRED))]
    lire.restype = wt.BOOL
    adv.CredFree.argtypes = [ctypes.c_void_p]
    p = ctypes.POINTER(_CRED)()
    if not lire(CIBLE, 1, 0, ctypes.byref(p)):  # 1 = identifiant générique
        stop(f'aucun identifiant « {CIBLE} » dans Windows. À faire une fois, dans un terminal :\n'
             f'    cmdkey /generic:{CIBLE} /user:IDENTIFIANT_FTP /pass')
    try:
        c = p.contents
        mdp = ctypes.string_at(c.CredentialBlob, c.CredentialBlobSize).decode('utf-16-le')
        return c.UserName, mdp
    finally:
        adv.CredFree(p)


# ————— connexion —————
class FTPS(ftplib.FTP_TLS):
    """FTPS explicite. La connexion de données reprend la session TLS de la connexion de
    contrôle : beaucoup de serveurs l'exigent, et ftplib ne le fait pas tout seul."""

    def ntransfercmd(self, cmd, rest=None):
        conn, taille = ftplib.FTP.ntransfercmd(self, cmd, rest)
        if self._prot_p:
            conn = self.context.wrap_socket(conn, server_hostname=self.host, session=self.sock.session)
        return conn, taille


MODE: str | None = None  # fixé par la première connexion, repris par les suivantes


def connecter(user: str, mdp: str) -> ftplib.FTP:
    global MODE
    derniere = None
    for mode in ([MODE] if MODE else ['ftps', 'ftps-certificat-non-verifie', 'ftp']):
        # 1. établir le canal (chiffré si possible) ; un échec ici fait passer au mode suivant
        try:
            if mode == 'ftp':
                f = ftplib.FTP(SERVEUR, timeout=120, encoding='utf-8')
            else:
                ctx = ssl.create_default_context()
                if mode != 'ftps':
                    ctx.check_hostname = False
                    ctx.verify_mode = ssl.CERT_NONE
                f = FTPS(SERVEUR, timeout=120, context=ctx, encoding='utf-8')
                f.auth()
        except (ssl.SSLError, OSError, EOFError, ftplib.Error) as e:
            derniere = e
            continue
        # 2. s'identifier : un refus ici est un refus du mot de passe, pas du chiffrement.
        #    On s'arrête net plutôt que de réessayer, et surtout pas en clair.
        try:
            f.login(user, mdp)
        except ftplib.error_perm as e:
            stop(f'OVH refuse l’identifiant ou le mot de passe FTP ({e}).\n'
                 f'Le ranger de nouveau : cmdkey /generic:{CIBLE} /user:IDENTIFIANT_FTP /pass')
        if mode != 'ftp':
            f.prot_p()
        f.set_pasv(True)
        f.voidcmd('TYPE I')
        if MODE is None:
            MODE = mode
            dire(f'Connecté à {SERVEUR} en {mode.upper()}' + (' (non chiffré : OVH ne propose pas mieux ici).' if mode == 'ftp' else '.'))
        return f
    stop(f'connexion impossible à {SERVEUR} : {derniere}')


# ————— lecture du serveur —————
def entrees(f: ftplib.FTP, chemin: str) -> list[tuple[str, str, int]]:
    """[(nom, 'dir' | 'file', taille)] d'un dossier, fichiers cachés compris si possible."""
    try:
        res = []
        for nom, faits in f.mlsd(chemin, facts=['type', 'size']):
            t = faits.get('type', '').lower()
            if nom in ('.', '..') or t in ('cdir', 'pdir'):
                continue
            res.append((nom, 'dir' if t == 'dir' else 'file', int(faits.get('size', -1) or -1)))
        return res
    except ftplib.error_perm:
        lignes: list[str] = []
        f.retrlines(f'LIST -a {chemin}', lignes.append)
        res = []
        for l in lignes:
            morceaux = l.split(None, 8)
            if len(morceaux) < 9 or morceaux[8] in ('.', '..'):
                continue
            n = int(morceaux[4]) if morceaux[4].isdigit() else -1
            res.append((morceaux[8], 'dir' if l.startswith('d') else 'file', n))
        return res


def est_dossier(f: ftplib.FTP, chemin: str) -> bool:
    ici = f.pwd()
    try:
        f.cwd(chemin)
        return True
    except ftplib.error_perm:
        return False
    finally:
        f.cwd(ici)


def taille(f: ftplib.FTP, chemin: str) -> int | None:
    try:
        return f.size(chemin)
    except ftplib.error_perm:
        return None


def inventaire(f: ftplib.FTP, dossier: str) -> dict[str, int]:
    """{chemin relatif: taille} de tous les fichiers sous `dossier`."""
    res: dict[str, int] = {}
    pile = ['']
    while pile:
        rel = pile.pop()
        for nom, t, n in entrees(f, posixpath.join(dossier, rel) if rel else dossier):
            r = posixpath.join(rel, nom) if rel else nom
            if t == 'dir':
                pile.append(r)
            else:
                res[r] = n
    return res


# ————— le dossier local —————
def local() -> dict[str, int]:
    if not (LIVRAISON / 'index.html').is_file() or not (LIVRAISON / '.htaccess').is_file():
        stop('livraison-ovh/ est absent ou incomplet. Le préparer d’abord : npm run ovh')
    if 'nathanael-photographe' in (LIVRAISON / 'index.html').read_text(encoding='utf-8'):
        stop('livraison-ovh/ contient la version de démonstration. Relancer : npm run ovh')
    return {p.relative_to(LIVRAISON).as_posix(): p.stat().st_size
            for p in LIVRAISON.rglob('*') if p.is_file()}


# ————— envoi —————
def creer_dossiers(f: ftplib.FTP, base: str, fichiers) -> None:
    dossiers = set()
    for r in fichiers:
        parties = r.split('/')[:-1]
        for i in range(1, len(parties) + 1):
            dossiers.add('/'.join(parties[:i]))
    for d in sorted(dossiers, key=lambda d: (d.count('/'), d)):
        try:
            f.mkd(posixpath.join(base, d))
        except ftplib.error_perm as e:
            if not str(e)[:3] in ('550', '521', '553'):  # « existe déjà »
                raise


def envoyer(user: str, mdp: str, base: str, fichiers: list[str], tailles: dict[str, int], titre: str) -> None:
    if not fichiers:
        return
    total, octets = len(fichiers), sum(tailles[r] for r in fichiers)
    dire(f'{titre} : {total} fichiers, {octets / 1048576:.0f} Mo, {CONNEXIONS} connexions en parallèle.')
    file_attente: queue.Queue[str] = queue.Queue()
    for r in fichiers:
        file_attente.put(r)
    avance = {'n': 0, 'o': 0}
    erreurs: list[tuple[str, str]] = []
    debut = time.time()

    def ouvrier():
        f = connecter(user, mdp)
        while True:
            try:
                r = file_attente.get_nowait()
            except queue.Empty:
                break
            for essai in range(3):
                try:
                    with open(LIVRAISON / r, 'rb') as h:
                        f.storbinary(f'STOR {posixpath.join(base, r)}', h, blocksize=1 << 16)
                    break
                except (ftplib.Error, OSError, EOFError) as e:
                    if essai == 2:
                        with verrou:
                            erreurs.append((r, str(e)))
                        break
                    try:
                        f.close()
                    except Exception:
                        pass
                    time.sleep(2 + 3 * essai)
                    f = connecter(user, mdp)
            with verrou:
                avance['n'] += 1
                avance['o'] += tailles[r]
                if avance['n'] % 100 == 0 or avance['n'] == total:
                    s = time.time() - debut
                    dire(f'  {avance["n"]}/{total} · {avance["o"] / 1048576:.0f}/{octets / 1048576:.0f} Mo · {s / 60:.1f} min')
        try:
            f.quit()
        except Exception:
            pass

    fils = [threading.Thread(target=ouvrier) for _ in range(min(CONNEXIONS, total))]
    for t in fils:
        t.start()
    for t in fils:
        t.join()
    if erreurs:
        for r, e in erreurs[:20]:
            dire(f'  échec : {r} ({e})')
        stop(f'{len(erreurs)} fichier(s) non envoyé(s). Relancer la même commande : elle reprend où elle s’est arrêtée.')


def verifier(f: ftplib.FTP, dossier: str, loc: dict[str, int]) -> None:
    dist = inventaire(f, dossier)
    manquants = []
    for r, n in loc.items():
        vu = dist.get(r)
        if vu is None and posixpath.basename(r).startswith('.'):
            vu = taille(f, posixpath.join(dossier, r))  # un listing peut taire les fichiers cachés
        if vu != n:
            manquants.append(r)
    if manquants:
        for r in manquants[:20]:
            dire(f'  différent ou absent : {r}')
        stop(f'{len(manquants)} fichier(s) ne correspondent pas sur le serveur. Relancer la même commande.')
    dire(f'Vérifié sur le serveur : les {len(loc)} fichiers sont là, à l’octet près.')


def horodatage() -> str:
    return dt.datetime.now().strftime('%Y-%m-%d-%Hh%M')


# ————— les commandes —————
def essai() -> None:
    user, mdp = identifiants()
    f = connecter(user, mdp)
    base = f.pwd()
    dire(f'Dossier de départ sur le serveur : {base}')
    haut = entrees(f, base)
    dire('Contenu : ' + ', '.join(f'{n}/' if t == 'dir' else n for n, t, _ in sorted(haut)))
    R = posixpath.join(base, RACINE)
    if not est_dossier(f, R):
        stop(f'pas de dossier « {RACINE} » ici. Vérifier le dossier racine dans l’onglet Multisite d’OVH '
             f'et le reporter dans scripts/ovh.json.')
    dans_r = entrees(f, R)
    noms = {n for n, _, _ in dans_r}
    nature = 'le WordPress actuel' if 'wp-config.php' in noms else (
        'le nouveau site' if 'index.html' in noms and '_astro' in noms else 'contenu inconnu')
    dire(f'« {RACINE}/ » : {len(dans_r)} éléments, {nature}.')
    for special in ('.ovhconfig', '.htaccess', '.well-known'):
        if special in noms or taille(f, posixpath.join(R, special)) is not None:
            dire(f'  contient {special}')
    if est_dossier(f, posixpath.join(base, NOUVEAU)):
        dire(f'« {NOUVEAU}/ » existe déjà : un envoi précédent sera repris.')
    anciens = sorted(n for n, t, _ in haut if t == 'dir' and n.startswith(ANCIEN))
    if anciens:
        dire('Anciens sites mis de côté : ' + ', '.join(anciens))
    loc = local()
    dire(f'À envoyer depuis livraison-ovh/ : {len(loc)} fichiers, {sum(loc.values()) / 1048576:.0f} Mo.')
    f.quit()
    dire('Rien n’a été modifié.')


def bascule(oui: bool) -> None:
    loc = local()
    user, mdp = identifiants()
    f = connecter(user, mdp)
    base = f.pwd()
    R, N = posixpath.join(base, RACINE), posixpath.join(base, NOUVEAU)
    if not est_dossier(f, R):
        stop(f'pas de dossier « {RACINE} » sur le serveur : vérifier scripts/ovh.json.')
    if est_dossier(f, N):
        dist = inventaire(f, N)
        dire(f'« {NOUVEAU}/ » existe : reprise ({len(dist)} fichiers déjà envoyés).')
    else:
        f.mkd(N)
        dist = {}
    a_envoyer = sorted(r for r, n in loc.items() if dist.get(r) != n or r.endswith(TOUJOURS))
    creer_dossiers(f, N, a_envoyer)
    f.quit()
    envoyer(user, mdp, N, a_envoyer, loc, f'Envoi dans {NOUVEAU}/ (hors ligne, l’ancien site reste visible)')

    f = connecter(user, mdp)
    # Réglage PHP propre au dossier du site : il suit le site, sinon OVH retomberait sur son défaut.
    if taille(f, posixpath.join(R, '.ovhconfig')) is not None and taille(f, posixpath.join(N, '.ovhconfig')) is None:
        tampon = io.BytesIO()
        f.retrbinary(f'RETR {posixpath.join(R, ".ovhconfig")}', tampon.write)
        tampon.seek(0)
        f.storbinary(f'STOR {posixpath.join(N, ".ovhconfig")}', tampon)
        dire('.ovhconfig de l’ancien dossier recopié dans le nouveau.')
    verifier(f, N, loc)

    if not oui:
        dire(f'\nLe nouveau site est entier dans « {NOUVEAU}/ », hors ligne. Rien n’a changé pour les visiteurs.')
        dire('Pour basculer : python scripts/envoyer-ovh.py bascule --oui')
        f.quit()
        return

    A = f'{ANCIEN}-{horodatage()}'
    f.rename(R, posixpath.join(base, A))
    try:
        f.rename(N, R)
    except ftplib.Error as e:
        f.rename(posixpath.join(base, A), R)
        stop(f'échange impossible ({e}) : l’ancien site a été remis en place.')
    f.quit()
    dire(f'\nBasculé : « {RACINE}/ » est le nouveau site. L’ancien WordPress est intact dans « {A}/ », hors ligne.')
    dire('Retour arrière si besoin : python scripts/envoyer-ovh.py retour --oui')


def maj() -> None:
    loc = local()
    user, mdp = identifiants()
    f = connecter(user, mdp)
    R = posixpath.join(f.pwd(), RACINE)
    if taille(f, posixpath.join(R, 'wp-config.php')) is not None:
        stop(f'« {RACINE}/ » contient encore le WordPress : la première mise en ligne se fait avec « bascule ».')
    dist = inventaire(f, R)
    a_envoyer = [r for r, n in loc.items() if dist.get(r) != n or r.endswith(TOUJOURS)]
    creer_dossiers(f, R, a_envoyer)
    f.quit()
    # Site en ligne : d'abord les images et les styles, puis les pages qui les appellent,
    # et le .htaccess en tout dernier. Un visiteur ne tombe jamais sur une page à moitié servie.
    pages = ('.html', '.xml', '.txt', '.php')
    ressources = sorted(r for r in a_envoyer if not r.endswith(pages) and r != '.htaccess')
    documents = sorted(r for r in a_envoyer if r.endswith(pages))
    envoyer(user, mdp, R, ressources, loc, 'Images, styles et scripts')
    envoyer(user, mdp, R, documents, loc, 'Pages')
    envoyer(user, mdp, R, ['.htaccess'] if '.htaccess' in a_envoyer else [], loc, 'Règles Apache')
    f = connecter(user, mdp)
    verifier(f, R, loc)
    f.quit()
    dire('Mise à jour en ligne.')


def retour(oui: bool) -> None:
    user, mdp = identifiants()
    f = connecter(user, mdp)
    base = f.pwd()
    anciens = sorted(n for n, t, _ in entrees(f, base) if t == 'dir' and n.startswith(ANCIEN))
    if not anciens:
        stop('aucun ancien site mis de côté sur le serveur.')
    A = anciens[-1]
    retire = f'{RACINE}-nouveau-site-retire-{horodatage()}'
    if not oui:
        dire(f'Retour prévu : « {RACINE}/ » deviendrait « {retire}/ », « {A}/ » redeviendrait « {RACINE}/ ».')
        dire('Pour le faire : python scripts/envoyer-ovh.py retour --oui')
        return
    R = posixpath.join(base, RACINE)
    f.rename(R, posixpath.join(base, retire))
    f.rename(posixpath.join(base, A), R)
    f.quit()
    dire(f'Ancien site remis en ligne. Le nouveau est gardé dans « {retire}/ ».')


if __name__ == '__main__':
    commande = sys.argv[1] if len(sys.argv) > 1 else ''
    oui = '--oui' in sys.argv[2:]
    if commande in ('essai', 'bascule', 'maj', 'retour') and not SERVEUR:
        stop('serveur FTP non renseigné dans scripts/ovh.json (onglet « FTP - SSH » de l’hébergement OVH).')
    if commande == 'essai':
        essai()
    elif commande == 'bascule':
        bascule(oui)
    elif commande == 'maj':
        maj()
    elif commande == 'retour':
        retour(oui)
    else:
        print(__doc__)
