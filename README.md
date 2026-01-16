# Homelab Media Server Configurator

Bienvenue sur le Homelab Media Server Configurator ! Cet outil vous aide à générer facilement un fichier `docker-compose.yml` personnalisé pour votre serveur multimédia auto-hébergé, en choisissant parmi une sélection de services populaires.

## Fonctionnalités

*   **Sélection de Services** : Choisissez les applications que vous souhaitez inclure dans votre stack.
*   **Configuration Personnalisable** : Ajustez les paramètres globaux (domaine, email SSL, PUID/PGID, fuseau horaire) et les variables spécifiques à chaque service.
*   **Génération de Mots de Passe** : Générez automatiquement des mots de passe sécurisés pour vos services.
*   **Gestion des Chemins** : Définissez des chemins personnalisés pour vos dossiers de configuration et de données.
*   **Mode Sombre** : Activez le mode sombre pour une meilleure expérience visuelle.
*   **Recherche et Filtrage** : Trouvez rapidement les services grâce à la barre de recherche et aux filtres par catégorie.
*   **Sauvegarde/Chargement de Configuration** : Sauvegardez votre configuration actuelle dans un fichier JSON et rechargez-la ultérieurement pour ne pas avoir à tout refaire.
*   **Génération de Fichiers** : Téléchargez un fichier ZIP contenant votre `docker-compose.yml` et un fichier `.env` avec toutes vos variables configurées, ainsi que des scripts de démarrage et d'arrêt.

## Services inclus (liste non exhaustive)

*   **Passerelle/Dashboard** : Homepage
*   **Gestion** : Portainer, Uptime Kuma
*   **Sécurité** : Gluetun (VPN), AdGuard Home, Vaultwarden (Bitwarden)
*   **Automatisation Média** : Sonarr, Radarr, Lidarr, Bazarr, Prowlarr, qBittorrent
*   **Streaming Média** : Jellyfin, Jellyseerr
*   **Cloud/Fichiers** : Nextcloud
*   *Et bien d'autres à venir !*

## Comment utiliser

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
