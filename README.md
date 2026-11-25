<p align="center">
  <img src="logo.png" alt="Molotov TV" width="300">
</p>

# Molotov TV pour Home Assistant

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![Validate](https://github.com/renaudallard/homeassistant_molotov_tv/actions/workflows/validate.yml/badge.svg)](https://github.com/renaudallard/homeassistant_molotov_tv/actions/workflows/validate.yml)
[![hassfest](https://github.com/renaudallard/homeassistant_molotov_tv/actions/workflows/hassfest.yml/badge.svg)](https://github.com/renaudallard/homeassistant_molotov_tv/actions/workflows/hassfest.yml)
[![License](https://img.shields.io/badge/License-BSD%202--Clause-blue.svg)](LICENSE)
[![Maintenance](https://img.shields.io/badge/Maintenu%3F-oui-green.svg)](https://github.com/renaudallard/homeassistant_molotov_tv)

Intégration personnalisée non officielle qui apporte **Molotov TV** dans le navigateur de médias de votre Home Assistant. Parcourez les chaînes, regardez la télévision en direct, accédez aux replays et castez du contenu directement sur vos appareils Chromecast.

---

## ✨ Fonctionnalités

*   **📺 TV en direct & EPG :** Parcourez toutes vos chaînes avec des guides de programmes en temps réel.
*   **▶️ En direct :** Accédez rapidement à ce qui est diffusé en ce moment.
*   **⏪ Replay & VOD :** Accédez à la télévision de rattrapage (Catch-up TV) et au contenu de vidéo à la demande associés à vos chaînes. Quand le programme en cours sur une chaîne est aussi disponible à la demande, la chaîne propose en tête « ⏮ Replay depuis le début », qui le lit depuis sa première minute, même s'il avait été commencé.
*   **📼 Enregistrements :** Visualisez et lisez vos enregistrements dans le cloud, rangés par émission comme dans « Mes vidéos », et programmez l'enregistrement d'un programme en direct depuis le navigateur (option « Programmer l'enregistrement », nécessite un quota DVR).
*   **🔒 Contenu réservé :** Les chaînes et programmes réservés à l'option payante « Molotov Extra » apparaissent grisés et non lisibles.
*   **🔍 Recherche avancée :**
    *   **Entité Texte :** Tapez votre recherche directement depuis le tableau de bord.
    *   **Clavier virtuel :** Naviguez et recherchez directement dans le navigateur de médias.
*   **📲 Casting :** Castez en toute fluidité vers les appareils Chromecast avec prise en charge de :
    *   **Récepteur officiel :** Utilise le récepteur natif de Molotov pour une prise en charge complète des DRM (TV en direct).
    *   **Récepteur Arnor :** Récepteur personnalisé de secours, utilisé uniquement si le streamer natif Molotov est indisponible. Un programme en cours choisi dans le guide y démarre depuis son début, celui où il a réellement commencé (dans la limite des quatre heures de rembobinage du direct), et sa barre de lecture montre le programme à l'écran, en direct comme depuis le début. Il cherche aussi les coupures publicitaires et affiche **Passer la pub : OK** sur le téléviseur : en différé sur une chaîne en direct, d'après les vignettes de la chaîne dont l'intégration lui donne l'adresse (pas sur les chaînes qui signalent leurs coupures, groupes TF1 et France Télévisions, ni sur celles sans publicité), et dans un enregistrement, que l'intégration lui signale comme tel.
*   **💻 Lecture locale :** Regardez directement dans Home Assistant via le panneau latéral dédié avec lecteur dash.js intégré.
*   **🔄 Auto-découverte :** Trouve automatiquement les appareils Chromecast sur votre réseau.
*   **🇫🇷 Audio en français :** La piste audio française (VF) est sélectionnée par défaut lorsqu'elle est disponible.

## 📋 Prérequis

*   **Home Assistant** (version 2025.10.0 ou ultérieure).
*   **Compte Molotov :** Un compte Molotov suffit pour les chaînes gratuites (France 2/3/4/5, Arte, BFMTV, CNEWS, LCP...). Certaines chaînes (TF1, etc.) nécessitent l'option payante « Molotov Extra », et les enregistrements (DVR) nécessitent un quota d'enregistrement.
*   **Adresse IP française :** Molotov 5.51 s'appuie sur le backend Fubo (`api-eu.fubo.tv`), où le marché de contenu suit l'IP de sortie de la requête. Home Assistant doit donc sortir sur une IP géolocalisée en France.
*   **Appareil Chromecast :** Requis pour caster du contenu sur votre téléviseur.

## 🚀 Installation

### Option 1 : HACS (Recommandé)

[![Ouvrir dans HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=renaudallard&repository=homeassistant_molotov_tv&category=integration)

Cette intégration n'est pas (encore) incluse par défaut dans HACS. Vous devez l'ajouter manuellement comme dépôt personnalisé.

1.  Ouvrez **HACS** dans Home Assistant.
2.  Cliquez sur les trois petits points (menu) en haut à droite.
3.  Sélectionnez **Dépôts personnalisés** (Custom repositories).
4.  Dans le champ "Dépôt", collez l'URL : `https://github.com/renaudallard/homeassistant_molotov_tv`
5.  Sélectionnez **Intégration** dans la liste déroulante "Catégorie".
6.  Cliquez sur **Ajouter**.
7.  Une fois ajouté, recherchez "Molotov TV" dans HACS et cliquez sur **Télécharger**.
8.  Redémarrez Home Assistant.

### Option 2 : Installation manuelle

1.  Téléchargez la dernière version.
2.  Copiez le dossier `custom_components/molotov_tv` dans le répertoire `config/custom_components/` de votre Home Assistant.
3.  Redémarrez Home Assistant.

## ⚙️ Configuration

1.  Allez dans **Paramètres** > **Appareils et services**.
2.  Cliquez sur **+ Ajouter une intégration** et recherchez **Molotov TV**.
3.  L'intégration affiche un **code** : sur **molotov.tv/tv** (ou dans etincelle : Paramètres > Connecter une TV), connectez-vous à votre compte Molotov et saisissez-le, comme pour relier un téléviseur. La page de Home Assistant continue d'elle-même une fois le code saisi ; un code non saisi à temps (cinq minutes) est remplacé par un nouveau à la demande.
    *   *Aucun mot de passe n'est demandé ni conservé : un compte qui exige un code reçu par email à chaque connexion se relie de la même façon. Si Molotov refuse le service depuis cette connexion (pays hors de sa zone, VPN ou abonnement), l'intégration le dit.*
    *   *Session : seul le jeton de rafraîchissement de la session est conservé, et l'intégration le renouvelle elle-même ; un redémarrage de Home Assistant ne demande donc rien. Si Molotov ne l'accepte plus, Home Assistant propose de relier le compte de nouveau avec un nouveau code, sans avoir à supprimer puis recréer l'intégration.*
    *   *Appareil déclaré : l'intégration s'annonce auprès du backend avec un identifiant d'appareil créé pour elle à la liaison et conservé ensuite. Il reste le même après un redémarrage, un rechargement ou une nouvelle liaison, donc le compte ne se remplit pas d'appareils. L'appareil est déclaré sous le nom « Home Assistant ».*
    *   *Une intégration configurée avant avec un email et un mot de passe continue de s'en servir ; si Molotov demande alors un code par email, elle propose de relier le compte par code, et le mot de passe est oublié.*

### Options & Ajustements

Cliquez sur **Configurer** sur l'entrée de l'intégration pour accéder aux paramètres :
*   **Cibles de cast :** Sélectionnez manuellement des entités `media_player` spécifiques si l'auto-découverte les manque.
*   **Hôtes de cast :** Ajoutez manuellement les adresses IP des appareils Chromecast (une par ligne) s'ils se trouvent sur un sous-réseau différent.

## 🎮 Utilisation

### Navigateur de médias
1.  Ouvrez l'onglet **Médias** dans Home Assistant.
2.  Sélectionnez **Molotov TV**.
3.  Naviguez parmi les dossiers principaux :
    *   **Recherche :** Utilisez la barre de recherche du navigateur de médias ou le clavier virtuel du dossier **Recherche** pour trouver du contenu.
    *   **En direct :** Voir les programmes en cours de diffusion.
    *   **Chaînes :** Parcourir la liste de toutes les chaînes.
    *   **Enregistrements :** Accéder à vos enregistrements, rangés par émission.
4.  Cliquez sur un programme pour voir les détails et les options de lecture.

### Recherche via Entité
Une entité `text.molotov_tv_recherche` (ou similaire selon le nom de votre configuration) est créée.
1.  Ajoutez cette entité à votre tableau de bord.
2.  Entrez votre recherche (ex: "Arte").
3.  Les résultats seront mis à jour dans le dossier **Recherche** du navigateur de médias.

### Panneau latéral Molotov TV
L'intégration ajoute automatiquement une entrée **Molotov TV** dans la barre latérale de Home Assistant. Ce panneau offre :
*   **Onglet Direct :** Liste des chaînes avec le programme en cours et les horaires (EPG).
*   **Onglet Ce soir :** Guide des programmes de la soirée par chaîne avec indicateur de direct. Affiche les programmes commençant entre 20h et minuit, ainsi que ceux commençant avant 20h s'ils se terminent après 21h. En journée, affiche les ~30 chaînes couvertes par l'EPG. Pendant le prime time (à partir de 20h), les programmes en cours de toutes les chaînes abonnées s'ajoutent automatiquement.
*   **Onglet Enregistrements :** Vos enregistrements, rangés par émission comme dans « Mes vidéos » : une émission s'ouvre sur ses épisodes enregistrés, un enregistrement seul se lit directement.
*   **Replay par chaîne :** Cliquez sur le bouton "Replay" d'une chaîne pour voir et lire les programmes disponibles en replay.
*   **Recherche intégrée :** Barre de recherche pour trouver du contenu avec affichage des épisodes disponibles.
*   **Sélecteur Chromecast :** Choisissez la cible de lecture (cet appareil ou un Chromecast) directement depuis l'en-tête.
*   **Lecture intégrée :** Cliquez sur une chaîne pour lancer la lecture directement dans le panneau.
*   **Contrôles de lecture :** En lecture locale ou Chromecast, le panneau affiche les contrôles complets : début, retour 30s, retour 10s, play/pause, avance 30s, saut de publicité (8 min), barre de progression et volume. Une bannière de chargement s'affiche lors du lancement d'un cast.
*   **Onglet En cours :** L'onglet "En cours" est toujours visible dans la barre d'onglets. Pendant la lecture, le bouton "Retour" ramène à la liste des chaînes tout en conservant le flux actif ; cliquez sur "En cours" pour revenir au lecteur. La barre d'onglets est défilable horizontalement pour rester accessible sur mobile.
*   **Mode plein écran :** Utilisez le bouton plein écran pour une expérience immersive (la barre latérale se masque automatiquement).
*   **Navigation libre :** Vous pouvez naviguer dans Home Assistant pendant la lecture ; le panneau conserve la vidéo.
*   **Lecture locale + Chromecast :** La lecture locale et le casting sur Chromecast fonctionnent simultanément et indépendamment. Arrêter la lecture locale ne coupe pas le Chromecast et inversement.
*   **Lecture automatique :** Lors de la lecture d'un épisode de série (enregistrements ou résultats de recherche), l'épisode suivant se lance automatiquement à la fin du précédent.

### Multi-utilisateurs
La lecture locale est isolée par session de navigateur grâce à un identifiant de session unique :
*   **Lecture privée :** Chaque onglet/navigateur génère un identifiant de session unique. La lecture locale n'affecte que la session qui l'a initiée.
*   **Pas d'interférence :** Plusieurs utilisateurs peuvent lire simultanément des contenus différents en local sans conflit, chacun avec son propre flux.
*   **Chromecast partagé :** La lecture sur Chromecast reste visible par tous les utilisateurs (le Chromecast étant un appareil partagé).
*   **Multi-comptes :** Si plusieurs comptes Molotov sont configurés, un sélecteur d'entité apparaît dans l'en-tête du panneau pour choisir le compte à utiliser.

### Limitations sur mobile
La lecture locale n'est **pas disponible** sur les appareils mobiles (Android/iOS) via l'application Home Assistant Companion :
*   **Raison :** Les WebViews mobiles ne prennent pas en charge Widevine DRM, nécessaire pour décrypter les flux Molotov.
*   **Solution :** Sur mobile, utilisez le **Chromecast** pour regarder le contenu. Sélectionnez un Chromecast dans le menu déroulant du panneau.
*   **Détection automatique :** L'option "Cet appareil" est automatiquement désactivée sur mobile pour éviter les erreurs de lecture.

### Casting
Depuis le navigateur de médias, lorsque vous sélectionnez un programme, vous verrez une liste de cibles :
*   **Lire sur cet appareil :** Lit localement dans votre navigateur (via le panneau latéral).
*   **📺 Récepteur Officiel :** Caste en utilisant l'application officielle Molotov. **À utiliser pour la TV en direct et le contenu crypté.**
*   **🏰 Récepteur Arnor :** Récepteur personnalisé de secours. À utiliser uniquement si le récepteur officiel Molotov est indisponible.

### Multi-Chromecast
L'intégration permet de diffuser simultanément sur plusieurs Chromecasts :
*   **Sessions indépendantes :** Lancez une émission sur un Chromecast et une autre sur un second, chaque session est indépendante.
*   **Contrôles par session :** Play/pause, volume, barre de progression fonctionnent indépendamment pour chaque Chromecast.
*   **Barre multi-cast :** Lorsque plusieurs casts sont actifs, une barre en bas du panneau affiche tous les casts en cours sous forme de chips cliquables.
*   **Changement de focus :** Cliquez sur un chip pour basculer les contrôles vers ce Chromecast. Vous pouvez aussi utiliser la sélection de source dans Home Assistant.
*   **Arrêt individuel :** Chaque cast peut être arrêté indépendamment sans affecter les autres.
*   **Attribut `active_casts` :** Un dictionnaire exposé dans les attributs d'état contenant l'état de chaque session active.

### Fiabilité de connexion Chromecast
L'intégration surveille automatiquement la connexion avec vos Chromecasts pendant la lecture :
*   **Vérification périodique :** La connexion est vérifiée toutes les 30 secondes pour chaque cast actif.
*   **Reconnexion automatique :** En cas de perte de connexion, l'intégration tente de se reconnecter automatiquement (jusqu'à 3 tentatives).
*   **Détection de prise de contrôle :** Si une autre application (YouTube, Netflix, etc.) prend le contrôle d'un Chromecast, la session Molotov correspondante se termine proprement sans tentative de reconnexion inutile.
*   **Arrêt intelligent :** Si un Chromecast est éteint ou inaccessible, l'intégration arrête automatiquement les tentatives de connexion après les échecs de reconnexion.
*   **Attributs d'état :** Les attributs suivants sont exposés pendant le casting :
    *   `cast_target` : L'adresse IP du Chromecast ayant le focus.
    *   `cast_connected` : `true` si la connexion du cast focalisé est active, `false` sinon.
    *   `cast_error` : Message d'erreur en cas de problème de connexion.
    *   `active_casts` : Dictionnaire de tous les casts actifs avec leur état (titre, position, volume, etc.).

### Changement de chaîne rapide (Zap)
Pendant la lecture sur Chromecast, vous pouvez changer de chaîne ou de programme instantanément :
*   **Pas de reconnexion :** Le changement réutilise la connexion existante.
*   **Détection automatique :** Si vous êtes déjà en train de caster, le système utilise automatiquement le changement rapide.
*   **Fallback :** En cas d'échec du changement rapide, une reconnexion complète est effectuée.

### Reprise de lecture (Continue Watching)
L'intégration mémorise automatiquement votre position pour le contenu VOD (replay, enregistrements) :
*   **Sauvegarde automatique :** La position est enregistrée lorsque vous arrêtez la lecture.
*   **Reprise automatique :** Lors du relancement du même contenu, la lecture reprend là où vous vous étiez arrêté.
*   **Critères de sauvegarde :**
    *   Position sauvegardée uniquement si > 60 secondes de visionnage.
    *   Position non sauvegardée si > 95% du contenu a été visionné.
    *   Position non sauvegardée si l'épisode est arrêté pendant son générique de fin, une fois l'épisode suivant annoncé : il compte comme vu.
*   **Expiration :** Les positions sont automatiquement supprimées après 30 jours.
*   **TV en direct :** La reprise ne s'applique pas au contenu en direct.
*   **Sur les autres appareils :** Avec le récepteur personnalisé, la position est aussi envoyée à Molotov pendant la lecture (replay, enregistrements), ce qui tient à jour « Continuer à regarder » dans l'application Molotov et sur vos autres appareils. Un épisode laissé dans son générique de fin y est indiqué comme vu, comme le fait l'application officielle.

## 🔒 Sécurité

*   **Encodage des entrées :** Les requêtes de recherche sont correctement encodées (URL-encoding) avant d'être envoyées à l'API pour éviter toute injection de paramètres.
*   **HTTPS uniquement :** Toutes les communications avec l'API Molotov utilisent HTTPS.
*   **Pas de mot de passe :** Le compte est relié par un code, comme un téléviseur ; l'intégration ne connaît pas le mot de passe (une intégration configurée avant par mot de passe le garde jusqu'à sa prochaine liaison par code).
*   **Jeton de session :** Le jeton de rafraîchissement de la session est conservé dans la configuration de l'intégration, dans le stockage de Home Assistant, pour rouvrir la session après un redémarrage sans rien demander ; le jeton d'accès reste en mémoire.
*   **Récepteur personnalisé :** Pour envoyer la position de lecture à Molotov, il reçoit le token d'accès de la session, et seulement pour une adresse de Molotov (fubo.tv ou molotov.tv). Il garde ce token, comme le jeton DRM, hors de l'état que le Chromecast donne aux autres appareils du réseau.

## 🏗️ Architecture

Le code suit une structure modulaire :
*   **`__init__.py`** : Configuration de l'intégration, enregistrement du panneau latéral et des plateformes.
*   **`const.py`** : Constantes, préfixes d'identifiants médias, chaîne user-agent.
*   **`models.py`** : Dataclasses partagées (`EpgProgram`, `EpgChannel`, `EpgData`, `BrowseAsset`).
*   **`config_flow.py`** : Flux de configuration (liaison par code + options).
*   **`api.py`** : Client HTTP Molotov avec retry automatique et gestion des tokens.
*   **`coordinator.py`** : Coordinateur HA pour les mises à jour EPG, parsing des données brutes. Le guide arrive par pages de 100 chaînes, toutes lues.
*   **`helpers.py`** : Identifiant d'appareil, parsing (timestamps, images, programmes EPG, assets) et découverte des cibles de cast.
*   **`browse.py`** : Construction de l'arborescence du navigateur de médias.
*   **`media_player.py`** : Entité media player HA, casting, lecture locale.
*   **`text.py`** : Entité de recherche textuelle.
*   **`chromecast.py`** : Connexion, contrôle et reconnexion Chromecast.
*   **`storage.py`** : Stockage persistant des positions de reprise de lecture.
*   **`translations/`** : Traductions du flux de configuration (français, anglais).
*   **`panel/src/molotov-panel.js`** : Panneau LitElement frontend.

## 🛠️ Avancé

### Développement du panneau
Le panneau utilise LitElement et est bundlé avec esbuild.

```bash
cd panel
npm install
npm run build
```

Le fichier bundlé est généré dans `custom_components/molotov_tv/www/molotov-panel.js`. Le cache du navigateur est invalidé automatiquement à chaque rebuild grâce à un hash du contenu du fichier.

### Hébergement du récepteur personnalisé
Le "Récepteur Arnor" est un récepteur web de secours, prévu uniquement comme fallback si le streamer natif Molotov est indisponible. Son code source vit dans un dépôt dédié : **[renaudallard/etincelle_receiver](https://github.com/renaudallard/etincelle_receiver)**. Les utilisateurs avancés peuvent héberger leur propre version (HTTPS), l'enregistrer comme récepteur personnalisé dans la [Google Cast SDK Console](https://cast.google.com/publish/), puis renseigner l'App ID obtenu dans `const.py`.

#### Contrôles à la télécommande
Quand le récepteur personnalisé est utilisé sur un appareil doté d'une télécommande (Chromecast avec Google TV, Android TV), la lecture se pilote directement avec les flèches :

*   **◄ / ►** : recul de 10 s / avance de 30 s. Maintenir la touche accélère le défilement (le pas grandit tant que la touche reste enfoncée, jusqu'à un maximum), et l'aperçu affiche la position cible ainsi que la vitesse (×N). Les appuis s'accumulent et le saut n'est appliqué qu'une seule fois, à l'arrêt des appuis. Sur une chaîne en direct, le saut reste borné à la fenêtre de différé disponible.
*   **▼** : ouvre le menu (recul, avance, redémarrer, piste audio). Les entrées de saut y restent disponibles en secours sur les télécommandes qui ne transmettent pas les flèches.
*   **▲ / Retour** : ferme le menu.
*   **OK** : ouvre le menu, ou valide l'élément sélectionné.

## ⚠️ Clause de non-responsabilité

Ce projet est une intégration non officielle et n'est **pas affilié à, approuvé par, ou associé à Molotov TV**. Tous les noms de produits, logos et marques sont la propriété de leurs détenteurs respectifs.

## 📄 Licence

Ce projet est sous licence BSD 2-Clause. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
