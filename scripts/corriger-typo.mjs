// Corrections typographiques : espaces manquants autour des liens + tirets longs en excès.
// Remplacements exacts uniquement : on signale tout motif introuvable plutôt que de deviner.
import { readFileSync, writeFileSync } from 'node:fs';

const P = 'D:/CLAUDE CODE/nathanael-site/src/';

/** [fichier, [ancien, nouveau]...] */
const lots = [
  ['pages/index.astro', [
    ['Photographe portraitiste — Portraitiste de France 2021 — co-fondateur du Studio NathSam',
     'Photographe portraitiste, Portraitiste de France 2021, co-fondateur du Studio NathSam'],
    ['Musicien — saxophoniste, guitariste, auteur-compositeur.',
     'Musicien : saxophoniste, guitariste, auteur-compositeur.'],
    ['Un portrait vécu garde la trace d’un moment réel — c’est exactement ce qu’aucune IA ne produira.',
     'Un portrait vécu garde la trace d’un moment réel : c’est exactement ce qu’aucune IA ne produira.'],
    ['reportage — depuis Gien, entre Sologne et châteaux de la Loire, à 1h30 de Paris.',
     'reportage, depuis Gien, entre Sologne et châteaux de la Loire, à 1h30 de Paris.'],
    ['Il photographie mariages et portraits en Val de Loire, à Paris, en Normandie — et en destination :',
     'Il photographie mariages et portraits en Val de Loire, à Paris, en Normandie, et en destination :'],
  ]],

  ['pages/portrait.astro', [
    ['Mon travail, c’est d’être prêt — et de vous accompagner.',
     'Mon travail, c’est d’être prêt, et de vous accompagner.'],
    ['m’ont appris à voir ce qui affleure — un geste, un relâchement, un silence — et\n        à photographier avec discrétion quand c’est le moment.',
     'm’ont appris à voir ce qui affleure : un geste, un relâchement, un silence. Et\n        à photographier avec discrétion quand c’est le moment.'],
    ['venant d’un photographe, vous ne les croiriez\n        pas — et vous auriez raison.',
     'venant d’un photographe, vous ne les croiriez\n        pas, et vous auriez raison.'],
    ['Vous repartez avec les deux — le tirage et le dessin.',
     'Vous repartez avec les deux : le tirage et le dessin.'],
  ]],

  ['pages/mariage.astro', [
    ['des passages écrits — la cérémonie, les discours — et tout\n        ce qui s’invente entre.',
     'des passages écrits, la cérémonie, les discours, et tout\n        ce qui s’invente entre.'],
    ['Je ne suis pas contrebassiste — mais c’est le rôle que je préfère dans ces moments-là :',
     'Je ne suis pas contrebassiste, mais c’est le rôle que je préfère dans ces moments-là :'],
    ['Guider en quelques mots — une main, une épaule, où poser\n        le regard — est un travail de portraitiste,',
     'Guider en quelques mots (une main, une épaule, où poser\n        le regard) est un travail de portraitiste,'],
    ['Vos photos pourront ressembler à celles d’un magazine — je soigne la lumière, les cadrages,\n        la matière des images.',
     'Vos photos pourront ressembler à celles d’un magazine : je soigne la lumière, les cadrages,\n        la matière des images.'],
    ['Je n’accompagne qu’un nombre limité de mariages par an — un seul par week-end.',
     'Je n’accompagne qu’un nombre limité de mariages par an, un seul par week-end.'],
    ['un reportage de mariage haut de gamme se situe entre 2 500 et 5 000 € pour une journée complète. Nathanaël Charpentier photographie les mariages à partir de 2 800 € — un seul mariage par week-end, pour s’investir pleinement dans chaque journée.',
     'un reportage de mariage haut de gamme se situe entre 2 500 et 5 000 € pour une journée complète. Nathanaël Charpentier photographie les mariages à partir de 2 800 €, avec un seul mariage par week-end, pour s’investir pleinement dans chaque journée.'],
    ['Non — les images d’un mariage qui comptent dans dix ans',
     'Non : les images d’un mariage qui comptent dans dix ans'],
    ['regardez si son portfolio contient des instants que personne ne pose — des regards, pas des alignements ;',
     'regardez si son portfolio contient des instants que personne ne pose (des regards, pas des alignements) ;'],
    ['En Val de Loire et en Sologne d’abord — châteaux et domaines à 1h30 de Paris — puis à Paris, en Normandie, et en destination :',
     'En Val de Loire et en Sologne d’abord, châteaux et domaines à 1h30 de Paris, puis à Paris, en Normandie, et en destination :'],
    ['Oui, lorsque la journée le demande — via le Studio NathSam, la maison dont Nathanaël est le regard photographique.',
     'Oui, lorsque la journée le demande, via le Studio NathSam, la maison dont Nathanaël est le regard photographique.'],
  ]],

  ['pages/a-propos.astro', [
    ['On m’ouvre des journées, des maisons, des visages — des moments intimes, des moments\n            privilégiés.',
     'On m’ouvre des journées, des maisons, des visages, des moments intimes, des moments\n            privilégiés.'],
    ['Ça se mérite. À force de silence,\n            d’attention, de temps laissé à l’autre.',
     'Ça se mérite : à force de silence,\n            d’attention, de temps laissé à l’autre.'],
    ['confidence qu’on s’autorise enfin — qu’on se fait d’abord à soi-même.',
     'confidence qu’on s’autorise enfin, qu’on se fait d’abord à soi-même.'],
    ['Ce que je fais est difficile à résumer — il m’arrive d’en parler sur scène, en\n            conférence, à des salles de photographes.',
     'Ce que je fais est difficile à résumer. Il m’arrive d’en parler sur scène, en\n            conférence, à des salles de photographes.'],
    ['Ce que\n            je laisse : des images aussi — une expérience, un moment partagé, et parfois un petit\n            morceau d’histoire commune,',
     'Ce que\n            je laisse : des images aussi, une expérience, un moment partagé, et parfois un petit\n            morceau d’histoire commune,'],
    ['Avant l’appareil, il y a eu la musique — le saxophone, la guitare, des chansons écrites\n          et composées.',
     'Avant l’appareil, il y a eu la musique : le saxophone, la guitare, des chansons écrites\n          et composées.'],
    ['photographie du\n        <a class="lien" href={SITE.studioUrl} rel="noopener">Studio NathSam</a> — la maison fondée\n        à Gien avec Samuel Dejours :',
     'photographie du <a class="lien" href={SITE.studioUrl} rel="noopener">Studio NathSam</a>, la maison fondée\n        à Gien avec Samuel Dejours :'],
    ['Family Photojournalist Association — Top 10 mondial 2020 · 3ᵉ européen · 1ᵉʳ français',
     'Family Photojournalist Association : Top 10 mondial 2020 · 3ᵉ européen · 1ᵉʳ français'],
    ['Co-fondateur et président du Collectif Carmin — premier collectif français de photographes d’accouchement',
     'Co-fondateur et président du Collectif Carmin, premier collectif français de photographes d’accouchement'],
    ['Conférence « La Pudeur de l’Intrus » — Cocktail The Conv, convention de photographes, Lyon, 2026',
     'Conférence « La Pudeur de l’Intrus », Cocktail The Conv, convention de photographes, Lyon, 2026'],
    ['Portraits officiels de Miss Loiret et Miss Centre-Val de Loire — comité Miss France',
     'Portraits officiels de Miss Loiret et Miss Centre-Val de Loire, comité Miss France'],
  ]],

  ['pages/contact.astro', [
    ['Si nous devons travailler ensemble, nous le saurons vite — ces choses-là\n          s’entendent dès le premier échange.',
     'Si nous devons travailler ensemble, nous le saurons vite : ces choses-là\n          s’entendent dès le premier échange.'],
    ['Ce que vous préparez <span class="optionnel">— portrait, mariage, une date si vous l’avez</span>',
     'Ce que vous préparez <span class="optionnel">(portrait, mariage, une date si vous l’avez)</span>'],
    ['{SITE.adresse.codePostal} {SITE.adresse.ville} — sur rendez-vous',
     '{SITE.adresse.codePostal} {SITE.adresse.ville}, sur rendez-vous'],
  ]],

  ['pages/404.astro', [
    ['La page que vous cherchez n’existe pas — ou n’existe plus.\n        <a class="lien" href={u(\'/\')}>Revenir à l’accueil</a>.',
     'La page que vous cherchez n’existe pas, ou n’existe plus. <a class="lien" href={u(\'/\')}>Revenir à l’accueil</a>.'],
  ]],

  ['pages/merci.astro', [
    ['Je vous répondrai personnellement, sous 48 heures. D’ici là, le\n        <a class="lien" href={u(\'/journal/\')}>Journal</a> vous attend.',
     'Je vous répondrai personnellement, sous 48 heures. D’ici là, le <a class="lien" href={u(\'/journal/\')}>Journal</a> vous attend.'],
  ]],

  ['pages/journal/index.astro', [
    ['Ce qu’un musicien apprend sur la place à tenir dans la journée des autres — extrait de la conférence « La Pudeur de l’Intrus ».',
     'Ce qu’un musicien apprend sur la place à tenir dans la journée des autres, extrait de la conférence « La Pudeur de l’Intrus ».'],
    ['Reportage au Domaine de Murtoli, dans le sud de la Corse : une journée gardée telle qu’elle a eu lieu.',
     'Reportage au Domaine de Murtoli, dans le sud de la Corse. Une journée gardée telle qu’elle a eu lieu.'],
    ['Save-the-date, cérémonie et séance du jour d’après : trois rendez-vous sur la côte normande.',
     'Save-the-date, cérémonie et séance du jour d’après. Trois rendez-vous sur la côte normande.'],
  ]],

  ['pages/journal/le-contrebassiste.astro', [
    ['Avant de photographier, j’ai joué — du saxophone, de la guitare, des chansons écrites pour\n    d’autres.',
     'Avant de photographier, j’ai joué : du saxophone, de la guitare, des chansons écrites pour\n    d’autres.'],
    ['Lui relie la mélodie et la\n    rythmique, tient tout le reste debout — et quand il s’arrête, la musique tombe.',
     'Lui relie la mélodie et la\n    rythmique, tient tout le reste debout. Et quand il s’arrête, la musique tombe.'],
    ['Et il sait la chose la plus difficile —\n    cesser de jouer.',
     'Et il sait la chose la plus difficile : cesser de jouer.'],
    ['Et pendant certains silences — une mère qui ferme les yeux, deux mains qui se\n    trouvent sous la table — on pose l’instrument.',
     'Et pendant certains silences (une mère qui ferme les yeux, deux mains qui se\n    trouvent sous la table) on pose l’instrument.'],
    ['Ce qu’on en garde n’est pas une image de plus : c’est la confiance qui permettra\n    la suivante.',
     'Ce qu’on en garde n’est pas une image de plus, mais la confiance qui permettra\n    la suivante.'],
  ]],

  ['pages/journal/mariage-domaine-de-murtoli-corse.astro', [
    ['des bergeries de pierre\n    dispersées dans le maquis, la vallée de l’Ortolo, et la mer au bout — l’un des domaines les\n    plus recherchés de Corse pour se marier.',
     'des bergeries de pierre\n    dispersées dans le maquis, la vallée de l’Ortolo, et la mer au bout. C’est l’un des domaines\n    les plus recherchés de Corse pour se marier.'],
    ['On repère la lumière — ici, elle tombe dure à midi sur la pierre claire, puis\n    devient dorée et rasante quand le maquis s’embrase en fin de journée.',
     'On repère la lumière : ici, elle tombe dure à midi sur la pierre claire, puis\n    devient dorée et rasante quand le maquis s’embrase en fin de journée.'],
    ['La poussière dorée levée par les danses, tard, quand plus personne ne pense aux\n    photos — c’est-à-dire au moment exact où elles deviennent vraies.',
     'La poussière dorée levée par les danses, tard, quand plus personne ne pense aux\n    photos, c’est-à-dire au moment exact où elles deviennent vraies.'],
    ['Le reste — la pierre, le maquis, la\n    lumière — travaille pour vous.',
     'Le reste, la pierre, le maquis, la lumière, travaille pour vous.'],
    ['Nathanaël Charpentier photographie des mariages en destination — Corse,\n    Andalousie, Bruxelles, Marrakech, île Maurice, Seychelles — et en\n    <a class="lien" href={u(\'/photographe-mariage-val-de-loire/\')}>Val de Loire</a>, son terrain\n    d’origine.',
     'Nathanaël Charpentier photographie des mariages en destination (Corse,\n    Andalousie, Bruxelles, Marrakech, île Maurice, Seychelles) et en <a class="lien" href={u(\'/photographe-mariage-val-de-loire/\')}>Val de Loire</a>, son terrain\n    d’origine.'],
  ]],

  ['pages/journal/mariage-deauville.astro', [
    ['puis —\n    quelques jours après — une dernière séance où la robe est entrée dans l’eau.',
     'puis,\n    quelques jours après, une dernière séance où la robe est entrée dans l’eau.'],
    ['Au troisième, on peut tout oser — y compris marcher dans les vagues en robe de\n    mariée,',
     'Au troisième, on peut tout oser, y compris marcher dans les vagues en robe de\n    mariée,'],
    ['<a class="lien" href={u(\'/photographe-mariage-normandie/\')}>Normandie</a> — Deauville, Honfleur,\n    Trouville.',
     '<a class="lien" href={u(\'/photographe-mariage-normandie/\')}>Normandie</a> : Deauville, Honfleur,\n    Trouville.'],
    ['<em class="italique">Voir les mariages photographiés en\n    <a class="lien"',
     '<em class="italique">Voir les mariages photographiés en <a class="lien"'],
  ]],

  ['pages/photographe-mariage-val-de-loire.astro', [
    ['Sully-sur-Loire à Tours, à 1h30 de Paris — et se déplace partout où la journée a lieu.',
     'Sully-sur-Loire à Tours, à 1h30 de Paris, et se déplace partout où la journée a lieu.'],
    ['des lieux classés\n          au patrimoine mondial, des domaines aux proportions de palais — et des journées qui\n          restent des journées de famille.',
     'des lieux classés\n          au patrimoine mondial, des domaines aux proportions de palais, et des journées qui\n          restent des journées de famille.'],
    ['et en\n        <a class="lien" href={u(\'/photographe-mariage-normandie/\')}>Normandie</a>.',
     'et en <a class="lien" href={u(\'/photographe-mariage-normandie/\')}>Normandie</a>.'],
    ['Nathanaël Charpentier photographie à partir de 2 800 €, de Gien à Tours en passant par la Sologne — un seul mariage par week-end.',
     'Nathanaël Charpentier photographie à partir de 2 800 €, de Gien à Tours en passant par la Sologne, avec un seul mariage par week-end.'],
    ['Un château, une grange, un jardin de famille — dites-moi où.',
     'Un château, une grange, un jardin de famille : dites-moi où.'],
  ]],

  ['pages/photographe-mariage-paris.astro', [
    ['les mariages intimistes, les\n          élopements et les séances de couple — du Palais-Royal aux ponts de la Seine.',
     'les mariages intimistes, les\n          élopements et les séances de couple, du Palais-Royal aux ponts de la Seine.'],
    ['C’est aussi ce qui la rend juste —\n          personne ne peut y faire semblant.',
     'C’est aussi ce qui la rend juste : personne ne peut y faire semblant.'],
    ['le pont de\n          Bir-Hakeim, ses colonnes et sa tour Eiffel au bout ; les arcades du Louvre, une pierre\n          qui prend la lumière du soir comme au château. Et un avantage discret : je viens de la\n          Loire, sans logistique parisienne à répercuter.',
     'le pont de\n          Bir-Hakeim, ses colonnes et sa tour Eiffel au bout ; les arcades du Louvre, une pierre\n          qui prend la lumière du soir comme au château. Et un avantage discret : je viens de la\n          Loire, sans logistique parisienne à répercuter.'],
    ['Voir <a class="lien" href={u(\'/mariage/\')}>l’approche du mariage en reportage</a>, les\n        mariages en <a class="lien" href={u(\'/photographe-mariage-val-de-loire/\')}>Val de Loire</a>\n        et en <a class="lien" href={u(\'/photographe-mariage-normandie/\')}>Normandie</a>.',
     'Voir <a class="lien" href={u(\'/mariage/\')}>l’approche du mariage en reportage</a>, les mariages en <a class="lien" href={u(\'/photographe-mariage-val-de-loire/\')}>Val de Loire</a> et en <a class="lien" href={u(\'/photographe-mariage-normandie/\')}>Normandie</a>.'],
    ['Une mairie, un jardin, une cérémonie à deux — écrivez-moi la date.',
     'Une mairie, un jardin, une cérémonie à deux : écrivez-moi la date.'],
    ['souvent sur une demi-journée, du Palais-Royal aux ponts de la Seine.',
     'souvent sur une demi-journée, du Palais-Royal aux ponts de la Seine.'],
  ]],

  ['pages/photographe-mariage-normandie.astro', [
    ['sur la côte normande —\n          Deauville, Honfleur, Trouville.',
     'sur la côte normande : Deauville, Honfleur, Trouville.'],
    ['Les jardins de Coppélia à\n          Honfleur, le port et ses voitures anciennes, les planches de Deauville — chaque lieu\n          impose son rythme,',
     'Les jardins de Coppélia à\n          Honfleur, le port et ses voitures anciennes, les planches de Deauville : chaque lieu\n          impose son rythme,'],
    ['Lire le récit de <a class="lien" href={u(\'/journal/mariage-deauville/\')}>Deauville</a>, voir\n        <a class="lien" href={u(\'/mariage/\')}>l’approche du mariage en reportage</a> ou les mariages\n        à <a class="lien" href={u(\'/photographe-mariage-paris/\')}>Paris</a>.',
     'Lire le récit de <a class="lien" href={u(\'/journal/mariage-deauville/\')}>Deauville</a>, voir <a class="lien" href={u(\'/mariage/\')}>l’approche du mariage en reportage</a> ou les mariages à <a class="lien" href={u(\'/photographe-mariage-paris/\')}>Paris</a>.'],
    ['La mer, un jardin, une maison de famille — écrivez-moi la date et le lieu.',
     'La mer, un jardin, une maison de famille : écrivez-moi la date et le lieu.'],
    ['Deauville, Honfleur, Trouville — commence à 2 800 € avec Nathanaël Charpentier.',
     'Deauville, Honfleur, Trouville, commence à 2 800 € avec Nathanaël Charpentier.'],
    ['souvent sur la plage : la robe a déjà eu sa journée, il ne reste que le jeu.',
     'souvent sur la plage : la robe a déjà eu sa journée, il ne reste que le jeu.'],
  ]],

  ['pages/portrait-art-orleans.astro', [
    ['reçoit pour des séances de portrait\n          d’art à 45 minutes d’Orléans — dans son atelier de Gien, chez vous, ou dans un lieu qui\n          compte pour vous.',
     'reçoit pour des séances de portrait\n          d’art à 45 minutes d’Orléans : dans son atelier de Gien, chez vous, ou dans un lieu qui\n          compte pour vous.'],
    ['Beaucoup viennent pour un cap :\n          un anniversaire qui compte, une reconstruction, une transmission. D’autres pour\n          quelqu’un : offrir une séance',
     'Beaucoup viennent pour un cap :\n          un anniversaire qui compte, une reconstruction, une transmission. D’autres pour\n          quelqu’un, car offrir une séance'],
    ['Cela demande du temps — la séance se déroule sur une journée, sans compter les heures — et une façon de travailler où rien n’est exigé.',
     'Cela demande du temps (la séance se déroule sur une journée, sans compter les heures) et une façon de travailler où rien n’est exigé.'],
  ]],

  ['components/Footer.astro', [
    ['{fr ? \'Photographe portraitiste, Gien · Val de Loire · Paris\' : \'Portrait & wedding photographer, Loire Valley · Paris\'}',
     '{fr ? \'Photographe portraitiste · Gien · Val de Loire · Paris\' : \'Portrait & wedding photographer · Loire Valley · Paris\'}'],
  ]],

  // ————— version anglaise —————
  ['pages/en/index.astro', [
    ['Based\n        in Gien, between the Sologne and the châteaux of the Loire, an hour and a half from Paris —\n        and wherever he is invited.',
     'Based\n        in Gien, between the Sologne and the châteaux of the Loire, an hour and a half from Paris,\n        and wherever he is invited.'],
  ]],
  ['pages/en/weddings.astro', [
    ['a jazz\n        set: written passages — the ceremony, the speeches — and everything that invents itself in\n        between.',
     'a jazz\n        set: written passages (the ceremony, the speeches) and everything that invents itself in\n        between.'],
    ['I am not a double bass player — but that is the role I like best on those days:',
     'I am not a double bass player, but that is the role I like best on those days:'],
    ['Guiding in a few words — a hand, a shoulder, where to rest your\n        gaze — is a portraitist’s craft,',
     'Guiding in a few words (a hand, a shoulder, where to rest your\n        gaze) is a portraitist’s craft,'],
    ['Your photographs may look like a magazine’s — I care about light, framing and the texture\n        of an image.',
     'Your photographs may look like a magazine’s: I care about light, framing and the texture\n        of an image.'],
    ['I take on a limited number of weddings each year — one per weekend.',
     'I take on a limited number of weddings each year, one per weekend.'],
    ['one wedding per weekend, documentary-first. Collections from €2,800.',
     'one wedding per weekend, documentary-first. Collections from €2,800.'],
    ['Yes — enough to make your guests smile and your grandmother comfortable.',
     'Yes, enough to make your guests smile and your grandmother comfortable.'],
    ['Seven countries so far — and wherever he is invited.',
     'Seven countries so far, and wherever he is invited.'],
  ]],
  ['pages/en/portraits.astro', [
    ['coming from a photographer, you would not believe them\n        — and you would be right.',
     'coming from a photographer, you would not believe them,\n        and you would be right.'],
    ['Nobody is “photogenic” in front of a photographer in a hurry. Feeling like yourself takes two things: time, and someone who demands nothing.',
     'Nobody is “photogenic” in front of a photographer in a hurry. Feeling like yourself takes two things: time, and someone who demands nothing.'],
  ]],
  ['pages/en/about.astro', [
    ['People open their\n            days, their homes, their faces to me — intimate moments, privileged ones.',
     'People open their\n            days, their homes, their faces to me: intimate moments, privileged ones.'],
    ['It has to be earned — through silence,\n            attention, and time left to the other person.',
     'It has to be earned, through silence,\n            attention, and time left to the other person.'],
    ['something\n            one finally allows oneself to say — first of all to oneself.',
     'something\n            one finally allows oneself to say, first of all to oneself.'],
    ['What I do is hard to summarise — I sometimes talk about it on stage, at photographers’\n            conventions.',
     'What I do is hard to summarise. I sometimes talk about it on stage, at photographers’\n            conventions.'],
    ['What I\n            leave behind: images too — an experience, a shared moment, and sometimes a small piece\n            of common history,',
     'What I\n            leave behind: images too, an experience, a shared moment, and sometimes a small piece\n            of common history,'],
    ['photographic eye of\n        <a class="lien" href={SITE.studioUrl} rel="noopener">Studio NathSam</a>, the house he',
     'photographic eye of <a class="lien" href={SITE.studioUrl} rel="noopener">Studio NathSam</a>, the house he'],
    ['Family Photojournalist Association — Top 10 worldwide 2020 · 3rd in Europe · 1st in France',
     'Family Photojournalist Association: Top 10 worldwide 2020 · 3rd in Europe · 1st in France'],
    ['Co-founder and president of Collectif Carmin — the first French collective of birth photographers',
     'Co-founder and president of Collectif Carmin, the first French collective of birth photographers'],
    ['Speaker, “La Pudeur de l’Intrus” — Cocktail The Conv photographers’ convention, Lyon, 2026',
     'Speaker, “La Pudeur de l’Intrus”, Cocktail The Conv photographers’ convention, Lyon, 2026'],
    ['Official portraits for Miss Loiret and Miss Centre-Val de Loire — Miss France committee',
     'Official portraits for Miss Loiret and Miss Centre-Val de Loire, Miss France committee'],
    ['Nearly twenty years in the craft, from reportage to introspective portraiture',
     'Nearly twenty years in the craft, from reportage to introspective portraiture'],
  ]],
  ['pages/en/contact.astro', [
    ['If we are meant to work together, we will both know quickly — these things\n          can be heard from the very first exchange.',
     'If we are meant to work together, we will both know quickly: these things\n          can be heard from the very first exchange.'],
    ['What you are planning <span class="optionnel">— a portrait, a wedding, a date if you have one</span>',
     'What you are planning <span class="optionnel">(a portrait, a wedding, a date if you have one)</span>'],
    ['{SITE.adresse.ville}, France — by appointment',
     '{SITE.adresse.ville}, France, by appointment'],
  ]],
  ['pages/en/loire-valley-wedding-photographer.astro', [
    ['based between the Sologne and\n          the Loire Valley — 1.5 hours from Paris, in the heart of château country.',
     'based between the Sologne and\n          the Loire Valley, 1.5 hours from Paris, in the heart of château country.'],
    ['Couples who compare notice something else — a comparable estate here costs 25 to 40% less\n          than in Provence,',
     'Couples who compare notice something else : a comparable estate here costs 25 to 40% less\n          than in Provence,'],
    ['See <a class="lien" href={u(\'/en/weddings/\')}>the wedding approach</a> or\n        <a class="lien" href={u(\'/en/pre-wedding-paris-loire-valley/\')}>pre-wedding sessions in\n        Paris and the Loire Valley</a>.',
     'See <a class="lien" href={u(\'/en/weddings/\')}>the wedding approach</a> or <a class="lien" href={u(\'/en/pre-wedding-paris-loire-valley/\')}>pre-wedding sessions in\n        Paris and the Loire Valley</a>.'],
    ['A château, a barn, a family garden — tell me where.',
     'A château, a barn, a family garden: tell me where.'],
    ['Yes — Paris elopements, Normandy, Corsica',
     'Yes: Paris elopements, Normandy, Corsica'],
  ]],
  ['pages/en/pre-wedding-paris-loire-valley.astro', [
    ['also known as hunshazhao (婚纱照)\n          — in Paris and in the châteaux of the Loire Valley,',
     'also known as hunshazhao (婚纱照),\n          in Paris and in the châteaux of the Loire Valley,'],
    ['he brings to these sessions\n          what he brings to every portrait: time, quiet guidance, and images made to last.',
     'he brings to these sessions\n          what he brings to every portrait: time, quiet guidance, and images made to last.'],
    ['Some moments are gently guided — a\n          hand, a shoulder, where to rest your gaze.',
     'Some moments are gently guided: a\n          hand, a shoulder, where to rest your gaze.'],
    ['châteaux with grand staircases and centuries-old parks, morning mist on the river, golden\n          evening light — and the calm to enjoy it.',
     'châteaux with grand staircases and centuries-old parks, morning mist on the river, golden\n          evening light, and the calm to enjoy it.'],
    ['A preview gallery is delivered within 48 hours — ready to share before you fly home.',
     'A preview gallery is delivered within 48 hours, ready to share before you fly home.'],
    ['See also <a class="lien" href={u(\'/en/weddings/\')}>wedding photography</a> and\n        <a class="lien" href={u(\'/en/loire-valley-wedding-photographer/\')}>Loire Valley châteaux</a>.',
     'See also <a class="lien" href={u(\'/en/weddings/\')}>wedding photography</a> and <a class="lien" href={u(\'/en/loire-valley-wedding-photographer/\')}>Loire Valley châteaux</a>.'],
    ['He knows the estates, their owners and their best light — mornings are reserved before visitors arrive.',
     'He knows the estates, their owners and their best light : mornings are reserved before visitors arrive.'],
    ['No — a pre-wedding session is a photography session, not a civil ceremony,',
     'No : a pre-wedding session is a photography session, not a civil ceremony,'],
  ]],
];

let ok = 0;
const manquants = [];
for (const [fichier, paires] of lots) {
  const chemin = P + fichier;
  let txt = readFileSync(chemin, 'utf8');
  for (const [avant, apres] of paires) {
    if (!txt.includes(avant)) { manquants.push(`${fichier} :: ${avant.slice(0, 68).replace(/\n/g, '\\n')}`); continue; }
    txt = txt.replace(avant, apres);
    ok++;
  }
  writeFileSync(chemin, txt);
}
console.log(`Remplacements appliqués : ${ok}`);
if (manquants.length) {
  console.log(`\nMOTIFS INTROUVABLES (${manquants.length}) — à vérifier à la main :`);
  manquants.forEach((m) => console.log('  ' + m));
}
