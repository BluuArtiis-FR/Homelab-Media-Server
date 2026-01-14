# 🔧 Guide de Configuration

Toute la configuration de votre stack est gérée depuis un unique fichier : `.env`. Ce guide explique les variables clés et le fonctionnement du système de profils.

## Le Fichier `.env`

Ce fichier est le panneau de contrôle de votre serveur. Vous devez le modifier avant le premier lancement (`make up`).

### Variables Essentielles (À Modifier)

-   `DOMAIN`: Votre nom de domaine public.
-   `ACME_EMAIL`: Votre adresse e-mail pour les certificats SSL.
-   `*_SECRET_KEY` / `*_PASS`: **Toutes** les variables contenant `CHANGEME` doivent être remplacées par des valeurs sécurisées. Utilisez `openssl rand -base64 32` pour générer des chaînes de caractères aléatoires.
-   `VPN_USER` / `VPN_PASSWORD`: Vos identifiants VPN si vous activez le profil `download`.

### Permissions et Chemins

-   `PUID` / `PGID`: L'ID de l'utilisateur et du groupe qui posséderont les fichiers. Tapez `id` dans votre terminal pour obtenir les vôtres. `1000` est une valeur par défaut courante.
-   `CONFIG_PATH`, `MEDIA_PATH`, etc. : Les chemins vers vos dossiers sur la machine hôte. Il est recommandé de conserver les valeurs par défaut.

## 📦 Le Système de Profils Hybrides (`COMPOSE_PROFILES`)

Vous avez un contrôle total sur les services à démarrer grâce à la variable `COMPOSE_PROFILES`. Cette flexibilité est assurée par un système de "profils hybrides".

Chaque service appartient à deux profils :
1.  Un **profil de groupe** (ex: `download`).
2.  Un **profil individuel** (ex: `sonarr`).

Cela vous permet deux modes de sélection :

### Mode 1 : Sélection par Groupe (Simple)

C'est la méthode la plus simple. Vous listez les groupes de fonctionnalités que vous souhaitez.

**Profils de groupe disponibles :**
-   `media`: Services de streaming (Jellyfin, Tdarr...).
-   `download`: La suite de téléchargement (*arr, qBittorrent...).
-   `cloud`: Votre cloud personnel (Nextcloud, Duplicati...).
-   `office`: Suite bureautique et outils (OnlyOffice, Stirling PDF...).
-   `docs`: Prise de notes et documentation (Bookstack, Joplin...).
-   `monitoring`: Surveillance de la stack (Uptime Kuma, Glances...).
-   `management`: Outils de gestion (Portainer, code-server...).
-   `recipes`: Gestion de recettes (Mealie).
-   `photos`: Gestion de photos (Immich).
-   `home-automation`: Domotique (Home Assistant).
-   `utils`: Utilitaires divers (FreshRSS).
-   `finance`: Finances personnelles (Firefly III).
-   `security`: Outils de sécurité (Vaultwarden).

**Exemple :** Pour une stack orientée média et cloud.
```env
COMPOSE_PROFILES=media,download,cloud
```

### Mode 2 : Sélection à la Carte (Avancé)

Si vous ne voulez qu'un ou deux services d'un groupe, vous pouvez les lister par leur nom individuel.

**Exemple :** Vous ne voulez que Jellyfin pour le streaming, Sonarr pour les séries, et qBittorrent pour le téléchargement.
```env
# Note : Il faut aussi inclure les dépendances, comme le VPN (gluetun) pour les services de téléchargement.
COMPOSE_PROFILES=jellyfin,sonarr,prowlarr,qbittorrent,gluetun
```

Vous pouvez bien sûr mixer les deux modes :
```env
# Activer toute la suite de téléchargement, et y ajouter uniquement Jellyfin et Nextcloud.
COMPOSE_PROFILES=download,jellyfin,nextcloud
```

### Important
- Les services d'infrastructure (`Traefik`, `Authentik`) sont toujours activés.
- Après chaque modification du `.env`, lancez `make up` pour appliquer les changements.