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
*   **💻 Lecture locale :** Regardez directement dans le navigateur de votre tableau de bord Home Assistant grâce à une carte vidéo personnalisée.
*   **🔄 Auto-découverte :** Trouve automatiquement les appareils Chromecast sur votre réseau.

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

### Casting
Lorsque vous sélectionnez un programme, vous verrez une liste de cibles :
*   **Lire sur cet appareil :** Lit localement dans votre navigateur.
*   **📺 Récepteur Officiel :** Caste en utilisant l'application officielle Molotov. **À utiliser pour la TV en direct et le contenu crypté.**
*   **🏰 Récepteur Arnor :** Caste en utilisant le récepteur personnalisé de l'intégration. Utile pour le contenu non crypté ou le débogage.

### Carte de tableau de bord
L'intégration enregistre automatiquement une carte frontend personnalisée. Lors d'une lecture locale, la carte fournit :
*   Des contrôles vidéo standards.
*   Des paramètres de mise en mémoire tampon améliorés pour la stabilité.
*   Des messages d'erreur directement sur la vidéo si la lecture échoue.

## 🛠️ Avancé

### Hébergement du récepteur personnalisé
Le "Récepteur Arnor" utilise un récepteur web hébergé. Le code source est disponible dans le répertoire `receiver/` de ce dépôt. Les utilisateurs avancés peuvent héberger leur propre version en modifiant `const.py` et en enregistrant un nouvel App ID auprès de Google.

## ⚠️ Clause de non-responsabilité

Ce projet est une intégration non officielle et n'est **pas affilié à, approuvé par, ou associé à Molotov TV**. Tous les noms de produits, logos et marques sont la propriété de leurs détenteurs respectifs.

## 📄 Licence

Ce projet est sous licence BSD 2-Clause. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
