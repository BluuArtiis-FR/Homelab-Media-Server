<div align="center">

# Homelab-Media-Server

**Un outil pour déployer facilement un serveur média personnel avec Docker, via une UI web ou en CLI.**

</div>

<p align="center">
  <a href="https://github.com/BluuArtiis-FR/Homelab-Media-Server/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/BluuArtiis-FR/Homelab-Media-Server?style=for-the-badge" alt="Licence">
  </a>
  <a href="https://github.com/BluuArtiis-FR/Homelab-Media-Server/actions/workflows/pages/pages-build-deployment">
    <img src="https://img.shields.io/github/actions/workflow/status/BluuArtiis-FR/Homelab-Media-Server/pages/pages-build-deployment?label=Déploiement&style=for-the-badge" alt="Statut du Déploiement">
  </a>
</p>

---

**Homelab-Media-Server** est un projet conçu pour simplifier radicalement le déploiement et la gestion d'un serveur personnel (homelab) grâce à Docker. Il offre deux approches pour s'adapter à tous les niveaux de compétence.

## 👨‍💻️ Deux Modes d'Utilisation

Choisissez l'approche qui correspond le mieux à votre niveau de confort technique.

| Mode Simple (Recommandé) | Mode Avancé |
| :--- | :--- |
| **Pour les débutants** et ceux qui veulent une installation rapide. | **Pour les utilisateurs expérimentés** qui veulent un contrôle total. |
| Utilisez notre **configurateur web** convivial pour choisir vos services. | **Clonez le dépôt** et gérez votre stack en ligne de commande. |
| Génère un package `.zip` **prêt à l'emploi** avec une configuration simplifiée. | Personnalisation fine via les **profils Docker** et le fichier `.env`. |
| [**🚀 Accéder au Configurateur Web →**](https://bluuartiis-fr.github.io/Homelab-Media-Server/) | [**➡️ Consulter le Guide d'Utilisation Avancée →**](./docs/GUIDE_AVANCE.md) |

## 📸 Aperçu du Configurateur Web

![image](https://github.com/user-attachments/assets/53213c6b-6b21-4f10-a24a-10ce6531a7c5)

## ✨ Fonctionnalités Clés

*   **Sélection de Services** : Choisissez les applications que vous souhaitez inclure dans votre stack.
*   **Configuration Personnalisable** : Ajustez les paramètres globaux (domaine, email SSL, PUID/PGID, fuseau horaire) et les variables spécifiques à chaque service.
*   **Génération de Mots de Passe** : Générez automatiquement des mots de passe sécurisés pour vos services.
*   **Gestion des Chemins** : Définissez des chemins personnalisés pour vos dossiers de configuration et de données.
*   **Mode Sombre** : Activez le mode sombre pour une meilleure expérience visuelle.
*   **Recherche et Filtrage** : Trouvez rapidement les services grâce à la barre de recherche et aux filtres par catégorie.
*   **Sauvegarde/Chargement de Configuration** : Sauvegardez votre configuration actuelle dans un fichier JSON et rechargez-la ultérieurement pour ne pas avoir à tout refaire.
*   **Génération de Fichiers** : Téléchargez un fichier ZIP contenant votre `docker-compose.yml` et un fichier `.env` avec toutes vos variables configurées, ainsi que des scripts de démarrage et d'arrêt.

## 📦 Services Disponibles

*   **Passerelle/Dashboard** : Homepage
*   **Gestion** : Portainer, Uptime Kuma
*   **Sécurité** : Gluetun (VPN), AdGuard Home, Vaultwarden (Bitwarden)
*   **Automatisation Média** : Sonarr, Radarr, Lidarr, Bazarr, Prowlarr, qBittorrent
*   **Streaming Média** : Jellyfin, Jellyseerr
*   **Cloud/Fichiers** : Nextcloud
*   *Et bien d'autres à venir !*

## Comment utiliser les fichiers générés

1.  **Choisissez vos services** : Cochez les services que vous souhaitez inclure dans votre stack.
2.  **Configurez les paramètres** : Remplissez les informations globales et ajustez les variables spécifiques à chaque service.
3.  **Générez votre stack** : Cliquez sur le bouton "Générer" pour télécharger un fichier ZIP.
4.  **Déployez** : Décompressez le fichier ZIP sur votre serveur et utilisez les scripts `start.sh` et `stop.sh` pour gérer votre stack Docker Compose.

## Développement

Ce projet utilise React, Vite et Tailwind CSS.

### Lancer en local

1.  Clonez le dépôt : `git clone https://github.com/BluuArtiis-FR/Homelab-Media-Server.git`
2.  Accédez au dossier `homelab-configurator` : `cd homelab-configurator`
3.  Installez les dépendances : `npm install`
4.  Lancez le serveur de développement : `npm run dev`

---

Développé avec ❤️ par BluuArtiis-FR.