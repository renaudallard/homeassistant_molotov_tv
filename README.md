<p align="center">
  <img src="logo.png" alt="Molotov TV" width="120">
</p>

# Molotov TV pour Home Assistant

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![License](https://img.shields.io/badge/License-BSD%202--Clause-blue.svg)](LICENSE)
[![Maintenance](https://img.shields.io/badge/Maintenu%3F-oui-green.svg)](https://github.com/renaudallard/homeassistant_molotov.tv)

Intégration personnalisée non officielle qui apporte **Molotov TV** dans le navigateur de médias de votre Home Assistant. Parcourez les chaînes, regardez la télévision en direct, accédez aux replays et castez du contenu directement sur vos appareils Chromecast.

---

## ✨ Fonctionnalités

*   **📺 TV en direct & EPG :** Parcourez toutes vos chaînes avec des guides de programmes en temps réel.
*   **▶️ En direct :** Accédez rapidement à ce qui est diffusé en ce moment.
*   **⏪ Replay & VOD :** Accédez à la télévision de rattrapage (Catch-up TV) et au contenu de vidéo à la demande associés à vos chaînes.
*   **📼 Enregistrements :** Visualisez et lisez uniquement vos enregistrements dans le cloud (les replays sont filtrés automatiquement).
*   **🔍 Recherche avancée :**
    *   **Entité Texte :** Tapez votre recherche directement depuis le tableau de bord.
    *   **Clavier virtuel :** Naviguez et recherchez directement dans le navigateur de médias.
*   **📲 Casting :** Castez en toute fluidité vers les appareils Chromecast avec prise en charge de :
    *   **Récepteur officiel :** Utilise le récepteur natif de Molotov pour une prise en charge complète des DRM (TV en direct).
    *   **Récepteur Arnor :** Récepteur personnalisé de secours, utilisé uniquement si le streamer natif Molotov est indisponible.
*   **💻 Lecture locale :** Regardez directement dans Home Assistant via le panneau latéral dédié avec lecteur dash.js intégré.
*   **🔄 Auto-découverte :** Trouve automatiquement les appareils Chromecast sur votre réseau.
*   **🇫🇷 Audio en français :** La piste audio française (VF) est sélectionnée par défaut lorsqu'elle est disponible.

## 📋 Prérequis

*   **Home Assistant** (version 2025.10.0 ou ultérieure).
*   **Compte Molotov Premium ou VIP :** Cette intégration nécessite un abonnement payant. Les comptes gratuits ne sont pas pris en charge.
*   **Appareil Chromecast :** Requis pour caster du contenu sur votre téléviseur.

## 🚀 Installation

### Option 1 : HACS (Recommandé)

Cette intégration n'est pas (encore) incluse par défaut dans HACS. Vous devez l'ajouter manuellement comme dépôt personnalisé.

1.  Ouvrez **HACS** dans Home Assistant.
2.  Cliquez sur les trois petits points (menu) en haut à droite.
3.  Sélectionnez **Dépôts personnalisés** (Custom repositories).
4.  Dans le champ "Dépôt", collez l'URL : `https://github.com/renaudallard/homeassistant_molotov.tv`
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
3.  Entrez votre **Email Molotov** et votre **Mot de passe**.
    *   *Note : Si votre compte n'est pas Premium/VIP, la configuration échouera avec un message d'erreur.*

### Options & Ajustements

Cliquez sur **Configurer** sur l'entrée de l'intégration pour accéder aux paramètres :
*   **Cibles de cast :** Sélectionnez manuellement des entités `media_player` spécifiques si l'auto-découverte les manque.
*   **Hôtes de cast :** Ajoutez manuellement les adresses IP des appareils Chromecast (une par ligne) s'ils se trouvent sur un sous-réseau différent.

## 🎮 Utilisation

### Navigateur de médias
1.  Ouvrez l'onglet **Médias** dans Home Assistant.
2.  Sélectionnez **Molotov TV**.
3.  Naviguez parmi les dossiers principaux :
    *   **Recherche :** Utilisez le clavier virtuel pour trouver du contenu.
    *   **En direct :** Voir les programmes en cours de diffusion.
    *   **Chaînes :** Parcourir la liste de toutes les chaînes.
    *   **Enregistrements :** Accéder à vos bookmarks.
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
*   **Onglet Enregistrements :** Accédez à vos bookmarks avec affichage de tous les épisodes disponibles pour chaque émission.
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
*   **Expiration :** Les positions sont automatiquement supprimées après 30 jours.
*   **TV en direct :** La reprise ne s'applique pas au contenu en direct.

## 🔒 Sécurité

*   **Encodage des entrées :** Les requêtes de recherche sont correctement encodées (URL-encoding) avant d'être envoyées à l'API pour éviter toute injection de paramètres.
*   **HTTPS uniquement :** Toutes les communications avec l'API Molotov utilisent HTTPS.
*   **Stockage sécurisé :** Les identifiants sont stockés via le système de configuration chiffré de Home Assistant.
*   **Tokens en mémoire :** Les tokens d'accès et de rafraîchissement sont conservés uniquement en mémoire et ne sont pas persistés sur le disque.

## 🏗️ Architecture

Le code suit une structure modulaire :
*   **`models.py`** : Dataclasses partagées (`EpgProgram`, `EpgChannel`, `EpgData`, `BrowseAsset`).
*   **`coordinator.py`** : Coordinateur HA pour les mises à jour EPG, parsing des données brutes.
*   **`helpers.py`** : Fonctions utilitaires de parsing (timestamps, images, programmes EPG, assets).
*   **`browse.py`** : Construction de l'arborescence du navigateur de médias.
*   **`api.py`** : Client HTTP Molotov avec retry automatique et gestion des tokens.
*   **`media_player.py`** : Entité media player HA, casting, lecture locale.
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
Le "Récepteur Arnor" est un récepteur web de secours, prévu uniquement comme fallback si le streamer natif Molotov est indisponible. Le code source est disponible dans le répertoire `receiver/` de ce dépôt. Les utilisateurs avancés peuvent héberger leur propre version en modifiant `const.py` et en enregistrant un nouvel App ID auprès de Google.

## ⚠️ Clause de non-responsabilité

Ce projet est une intégration non officielle et n'est **pas affilié à, approuvé par, ou associé à Molotov TV**. Tous les noms de produits, logos et marques sont la propriété de leurs détenteurs respectifs.

## 📄 Licence

Ce projet est sous licence BSD 2-Clause. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
