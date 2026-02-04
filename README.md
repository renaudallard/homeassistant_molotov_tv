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
*   **📼 Enregistrements :** Visualisez et lisez vos enregistrements dans le cloud (Bookmarks).
*   **🔍 Recherche avancée :**
    *   **Entité Texte :** Tapez votre recherche directement depuis le tableau de bord.
    *   **Clavier virtuel :** Naviguez et recherchez directement dans le navigateur de médias.
*   **📲 Casting :** Castez en toute fluidité vers les appareils Chromecast avec prise en charge de :
    *   **Récepteur officiel :** Utilise le récepteur natif de Molotov pour une prise en charge complète des DRM (TV en direct).
    *   **Récepteur Arnor :** Une option de récepteur personnalisé et léger (expérimental).
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
*   **Onglet Ce soir :** Guide des programmes de la soirée (20h-24h) par chaîne avec indicateur de direct.
*   **Onglet Enregistrements :** Accédez à vos bookmarks avec affichage de tous les épisodes disponibles pour chaque émission.
*   **Replay par chaîne :** Cliquez sur le bouton "Replay" d'une chaîne pour voir et lire les programmes disponibles en replay.
*   **Recherche intégrée :** Barre de recherche pour trouver du contenu avec affichage des épisodes disponibles.
*   **Sélecteur Chromecast :** Choisissez la cible de lecture (cet appareil ou un Chromecast) directement depuis l'en-tête.
*   **Lecture intégrée :** Cliquez sur une chaîne pour lancer la lecture directement dans le panneau.
*   **Contrôles Chromecast :** Pendant le casting, le panneau affiche les contrôles de lecture (play/pause, barre de progression, volume, avance/retour rapide).
*   **Mode plein écran :** Utilisez le bouton plein écran pour une expérience immersive (la barre latérale se masque automatiquement).
*   **Navigation libre :** Vous pouvez naviguer dans Home Assistant pendant la lecture ; le panneau conserve la vidéo.

### Multi-utilisateurs
La lecture locale est isolée par session de navigateur :
*   **Lecture privée :** Lorsqu'un utilisateur lance une lecture locale, seul son navigateur/appareil affiche le lecteur vidéo.
*   **Pas d'interférence :** Les autres utilisateurs connectés à Home Assistant ne voient pas la lecture en cours des autres.
*   **Chromecast partagé :** La lecture sur Chromecast reste visible par tous les utilisateurs (le Chromecast étant un appareil partagé).

### Limitations sur mobile
La lecture locale n'est **pas disponible** sur les appareils mobiles (Android/iOS) via l'application Home Assistant Companion :
*   **Raison :** Les WebViews mobiles ne prennent pas en charge Widevine DRM, nécessaire pour décrypter les flux Molotov.
*   **Solution :** Sur mobile, utilisez le **Chromecast** pour regarder le contenu. Sélectionnez un Chromecast dans le menu déroulant du panneau.
*   **Détection automatique :** L'option "Cet appareil" est automatiquement désactivée sur mobile pour éviter les erreurs de lecture.

### Casting
Depuis le navigateur de médias, lorsque vous sélectionnez un programme, vous verrez une liste de cibles :
*   **Lire sur cet appareil :** Lit localement dans votre navigateur (via le panneau latéral).
*   **📺 Récepteur Officiel :** Caste en utilisant l'application officielle Molotov. **À utiliser pour la TV en direct et le contenu crypté.**
*   **🏰 Récepteur Arnor :** Caste en utilisant le récepteur personnalisé de l'intégration. Utile pour le contenu non crypté ou le débogage.

### Fiabilité de connexion Chromecast
L'intégration surveille automatiquement la connexion avec votre Chromecast pendant la lecture :
*   **Vérification périodique :** La connexion est vérifiée toutes les 30 secondes.
*   **Reconnexion automatique :** En cas de perte de connexion, l'intégration tente de se reconnecter automatiquement (jusqu'à 3 tentatives).
*   **Détection de prise de contrôle :** Si une autre application (YouTube, Netflix, etc.) prend le contrôle du Chromecast, la session Molotov se termine proprement sans tentative de reconnexion inutile.
*   **Arrêt intelligent :** Si le Chromecast est éteint ou inaccessible, l'intégration arrête automatiquement les tentatives de connexion après les échecs de reconnexion.
*   **Attributs d'état :** Les attributs suivants sont exposés pendant le casting :
    *   `cast_target` : L'adresse IP du Chromecast actif.
    *   `cast_connected` : `true` si la connexion est active, `false` sinon.
    *   `cast_error` : Message d'erreur en cas de problème de connexion.

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

## 🛠️ Avancé

### Développement du panneau
Le panneau utilise LitElement et est bundlé avec esbuild.

```bash
cd panel
npm install
npm run build
```

Le fichier bundlé est généré dans `custom_components/molotov_tv/www/molotov-panel.js`.

### Hébergement du récepteur personnalisé
Le "Récepteur Arnor" utilise un récepteur web hébergé. Le code source est disponible dans le répertoire `receiver/` de ce dépôt. Les utilisateurs avancés peuvent héberger leur propre version en modifiant `const.py` et en enregistrant un nouvel App ID auprès de Google.

## ⚠️ Clause de non-responsabilité

Ce projet est une intégration non officielle et n'est **pas affilié à, approuvé par, ou associé à Molotov TV**. Tous les noms de produits, logos et marques sont la propriété de leurs détenteurs respectifs.

## 📄 Licence

Ce projet est sous licence BSD 2-Clause. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
