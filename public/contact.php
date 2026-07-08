<?php
// Formulaire de contact natif — hebergement Apache/PHP classique.
// Anti-spam : champ piege "site" (honeypot) + verifications minimales.
declare(strict_types=1);

$destinataire = 'contact@nathanaelcharpentier.com'; // adresse a confirmer avant mise en ligne

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /contact/', true, 303);
    exit;
}

// Honeypot rempli => robot : on fait comme si tout allait bien
if (!empty($_POST['site'] ?? '')) {
    header('Location: /merci/', true, 303);
    exit;
}

$nom = trim((string)($_POST['nom'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$projet = trim((string)($_POST['projet'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

if ($nom === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: /contact/?erreur=1', true, 303);
    exit;
}

$nom = mb_substr($nom, 0, 200);
$projet = mb_substr($projet, 0, 300);
$message = mb_substr($message, 0, 8000);

$sujet = '=?UTF-8?B?' . base64_encode("Site — nouvelle demande de $nom") . '?=';
$corps = "Nom : $nom\nEmail : $email\nProjet : $projet\n\n$message\n";
$entetes = [
    'From' => 'site@nathanaelcharpentier.com',
    'Reply-To' => $email,
    'Content-Type' => 'text/plain; charset=UTF-8',
    'X-Mailer' => 'site-nathanaelcharpentier',
];

mail($destinataire, $sujet, $corps, $entetes);

header('Location: /merci/', true, 303);
exit;
