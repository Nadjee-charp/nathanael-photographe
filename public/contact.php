<?php
// Formulaire de contact — hebergement Apache/PHP (OVH).
// [N2-02] Anti-spam sans friction, validation serveur, en-tetes nettoyes.
// Compatible PHP 7.4 (version actuelle de l'hebergement) comme PHP 8.
declare(strict_types=1);

$destinataire = 'contact@nathanaelcharpentier.com';
$expediteur   = 'site@nathanaelcharpentier.com'; // doit exister et etre couvert par SPF/DKIM

function repartir(string $ou): void {
    header('Location: ' . $ou, true, 303);
    exit;
}

/** Envoie avec l'expediteur d'enveloppe du domaine (meilleure delivrabilite), sinon sans. */
function envoyer(string $a, string $sujet, string $corps, array $entetes, string $de): bool {
    if (@mail($a, $sujet, $corps, $entetes, '-f' . $de)) return true;
    return @mail($a, $sujet, $corps, $entetes);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') repartir('/contact/');

$en = (($_POST['langue'] ?? '') === 'en');
$retourErreur = $en ? '/en/contact/?erreur=1' : '/contact/?erreur=1';
$retourMerci  = $en ? '/en/thank-you/' : '/merci/';

// Toute suspicion de robot repart vers la page de remerciement : on ne lui dit rien.

// 1. Champ piege : invisible pour un visiteur, rempli par un robot.
if (!empty($_POST['site'] ?? '')) repartir($retourMerci);

// 2. Formulaire rempli en moins de trois secondes. Le delai est mesure par le navigateur
//    lui-meme (de l'ouverture de la page a l'envoi) : l'horloge du visiteur n'entre pas en jeu.
$delai = (string)($_POST['delai'] ?? '');
if ($delai !== '' && (int)$delai < 3000) repartir($retourMerci);

// 3. Envoi depuis un autre site : un vrai visiteur poste toujours depuis nos pages.
$origine = (string)($_SERVER['HTTP_ORIGIN'] ?? '');
$hote = strtolower((string)($_SERVER['HTTP_HOST'] ?? ''));
if ($origine !== '' && strtolower((string)parse_url($origine, PHP_URL_HOST)) !== $hote) repartir($retourMerci);

// 4. Limitation de debit : une demande par adresse IP toutes les 60 secondes.
$empreinte = hash('sha256', (string)($_SERVER['REMOTE_ADDR'] ?? 'inconnu'));
$verrou = sys_get_temp_dir() . '/nc-' . $empreinte;
if (is_file($verrou) && (time() - filemtime($verrou)) < 60) repartir($retourMerci);

$nom     = trim((string)($_POST['nom'] ?? ''));
$email   = trim((string)($_POST['email'] ?? ''));
$projet  = trim((string)($_POST['projet'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

if ($nom === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    repartir($retourErreur);
}

// 5. Le spam publicitaire vit de liens : un lien dans le nom, ou plus de deux dans le
//    message, et la demande est ecartee. Une vraie demande n'en contient presque jamais.
$liens = static function (string $t): int {
    return (int)preg_match_all('~(https?://|www\.|\[url|<a\s)~i', $t);
};
if ($liens($nom) > 0 || $liens($projet . ' ' . $message) > 2) repartir($retourMerci);

@touch($verrou);

// 6. Longueurs bornees.
$nom     = mb_substr($nom, 0, 200);
$projet  = mb_substr($projet, 0, 300);
$message = mb_substr($message, 0, 8000);

// 7. Rien de ce que l'utilisateur ecrit ne part dans un en-tete sans etre nettoye :
//    un retour a la ligne injecte permettrait d'ajouter un destinataire cache.
$propre = static function (string $v): string {
    return str_replace(["\r", "\n", "\0"], '', $v);
};
$email  = $propre($email);
$nomSujet = $propre($nom);

$sujet = '=?UTF-8?B?' . base64_encode("Site : nouvelle demande de $nomSujet") . '?=';
$corps = "Nom : $nom\nEmail : $email\nProjet : $projet\nLangue : " . ($en ? 'anglais' : 'francais') . "\n\n$message\n";
$entetes = [
    'From'         => 'Site Nathanael Charpentier <' . $expediteur . '>',
    'Reply-To'     => $email,
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
    'X-Mailer'     => 'site-nathanaelcharpentier',
];
if (!envoyer($destinataire, $sujet, $corps, $entetes, $expediteur)) repartir($retourErreur);

// 8. Accuse de reception : le visiteur sait que c'est parti.
$sujetAr = $en
    ? '=?UTF-8?B?' . base64_encode('Your message has arrived') . '?='
    : '=?UTF-8?B?' . base64_encode('Votre message est bien arrivé') . '?=';
$corpsAr = $en
    ? "Thank you, your message has arrived.\nI reply personally, within 48 hours.\n\nNathanaël Charpentier\nhttps://nathanaelcharpentier.com/en/\n"
    : "Merci, votre message est bien arrivé.\nJe réponds personnellement, sous 48 heures.\n\nNathanaël Charpentier\nhttps://nathanaelcharpentier.com\n";
envoyer($email, $sujetAr, $corpsAr, [
    'From'         => '=?UTF-8?B?' . base64_encode('Nathanaël Charpentier') . '?= <' . $expediteur . '>',
    'Reply-To'     => $destinataire,
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
], $expediteur);

repartir($retourMerci);
