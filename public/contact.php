<?php
// Formulaire de contact — hebergement Apache/PHP (OVH).
// [N2-02] Anti-spam sans friction, validation serveur, en-tetes nettoyes.
declare(strict_types=1);

$destinataire = 'contact@nathanaelcharpentier.com';
$expediteur   = 'site@nathanaelcharpentier.com'; // doit exister et etre couvert par SPF/DKIM

function repartir(string $ou): never {
    header('Location: ' . $ou, true, 303);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') repartir('/contact/');

$en = (($_POST['langue'] ?? '') === 'en');
$retourErreur = $en ? '/en/contact/?erreur=1' : '/contact/?erreur=1';
$retourMerci  = $en ? '/en/thank-you/' : '/merci/';

// 1. Champ piege : rempli, donc robot. On ne le lui dit pas.
if (!empty($_POST['site'] ?? '')) repartir($retourMerci);

// 2. Formulaire renvoye en moins de trois secondes : robot.
$ouvert = (int)($_POST['ouvert'] ?? 0);
if ($ouvert > 0 && (microtime(true) * 1000 - $ouvert) < 3000) repartir($retourMerci);

// 3. Limitation de debit : une demande par IP toutes les 60 secondes.
$empreinte = hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'inconnu');
$verrou = sys_get_temp_dir() . '/nc-' . $empreinte;
if (is_file($verrou) && (time() - filemtime($verrou)) < 60) repartir($retourMerci);
@touch($verrou);

$nom     = trim((string)($_POST['nom'] ?? ''));
$email   = trim((string)($_POST['email'] ?? ''));
$projet  = trim((string)($_POST['projet'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

if ($nom === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    repartir($retourErreur);
}

// 4. Longueurs bornees.
$nom     = mb_substr($nom, 0, 200);
$projet  = mb_substr($projet, 0, 300);
$message = mb_substr($message, 0, 8000);

// 5. Rien de ce que l'utilisateur ecrit ne part dans un en-tete sans etre nettoye :
//    un retour a la ligne injecte permettrait d'ajouter un destinataire cache.
$propre = static fn (string $v): string => str_replace(["\r", "\n", "\0"], '', $v);
$email  = $propre($email);
$nomSujet = $propre($nom);

$sujet = '=?UTF-8?B?' . base64_encode("Site : nouvelle demande de $nomSujet") . '?=';
$corps = "Nom : $nom\nEmail : $email\nProjet : $projet\n\n$message\n";
$entetes = [
    'From'         => $expediteur,
    'Reply-To'     => $email,
    'Content-Type' => 'text/plain; charset=UTF-8',
    'X-Mailer'     => 'site-nathanaelcharpentier',
];
mail($destinataire, $sujet, $corps, $entetes);

// 6. Accuse de reception : le visiteur sait que c'est parti.
$sujetAr = $en
    ? '=?UTF-8?B?' . base64_encode('Your message has arrived') . '?='
    : '=?UTF-8?B?' . base64_encode('Votre message est bien arrive') . '?=';
$corpsAr = $en
    ? "Thank you, your message has arrived.\nI reply personally, within 48 hours.\n\nNathanael Charpentier\n"
    : "Merci, votre message est bien arrive.\nJe reponds personnellement, sous 48 heures.\n\nNathanael Charpentier\n";
mail($email, $sujetAr, $corpsAr, [
    'From'         => $expediteur,
    'Content-Type' => 'text/plain; charset=UTF-8',
]);

repartir($retourMerci);
