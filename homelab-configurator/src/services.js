// homelab-configurator/src/services.js

// Helper function to create a standard secret variable definition
const createSecret = (name, description, link_to = null) => ({
  name,
  description,
  type: 'secret',
  link_to: link_to || name, // Links to a variable in the main config state
  generator: true
});

export const SERVICE_GROUPS = {
  // CORE
  "gateway": { 
    name: "🌐 Portail & Accès",
    description: "Services qui servent de point d'entrée à votre stack (reverse proxy, authentification)."
  },
  "management": {
    name: "🛠️ Gestion & Monitoring",
    description: "Outils pour gérer votre stack, visualiser les logs et surveiller la disponibilité des services."
  },
  "security": {
    name: "🛡️ Sécurité",
    description: "Services dédiés à la sécurité de votre homelab (gestionnaires de mots de passe, VPNs...)."
  },
  
  // MEDIA
  "media_streaming": {
    name: "🎬 Média & Streaming",
    description: "Serveurs multimédias pour vos films, séries, musiques et livres audio."
  },
  "media_automation": {
    name: "⬇️ Automatisation de Média",
    description: "Les services 'Arr' et leurs compagnons pour automatiser le téléchargement et la gestion de contenu."
  },
  "content": {
    name: "📚 Contenu & Documents",
    description: "Services pour gérer vos photos, documents, notes et flux d'information."
  },
  
  // PRODUCTIVITY
  "file_cloud": {
    name: "☁️ Cloud & Fichiers",
    description: "Services pour héberger vos propres fichiers, calendriers et contacts."
  },
  "office": {
    name: "💼 Bureautique & Productivité",
    description: "Outils pour éditer des documents, gérer des PDF et collaborer."
  },
  "finance": {
    name: "💰 Finances Personnelles",
    description: "Services pour suivre vos budgets et gérer vos finances."
  },
  
  // SPECIALIZED
  "development": {
    name: "💻 Développement",
    description: "Outils pour les développeurs (gestion de code source, IDEs web...)."
  },
  "home_automation": {
    name: "🏠 Domotique",
    description: "Plateformes pour contrôler votre maison connectée."
  },
  "utilities": {
    name: "⚙️ Utilitaires & Automatisation",
    description: "Services variés pour automatiser des tâches, raccourcir des URLs, etc."
  },
};

export const SERVICE_MANIFEST = {
  // --- GROUP: MANAGEMENT ---
  "portainer": {
    group: "management",
    name: "Portainer",
    description: "Interface de gestion de conteneurs Docker.",
    doc_url: "https://docs.portainer.io/",
    image: { name: "portainer/portainer-ce", tag: "latest" },
    restart: "unless-stopped",
    ports: [
      { host: 9000, container: 9000, description: "Web UI" },
      { host: 9443, container: 9443, description: "Web UI (HTTPS)" },
    ],
    volumes: [
      { host_path: "/var/run/docker.sock", container_path: "/var/run/docker.sock" },
      { host_path: "{CONFIG_PATH}/portainer", container_path: "/data", description: "Configuration de Portainer" }
    ],
    deployment: {
      expose: true,
      expose_port: 9000,
      default_subdomain: "portainer"
    }
  },
  "uptime-kuma": {
    group: "management",
    name: "Uptime Kuma",
    description: "Un outil de monitoring de disponibilité, simple et moderne.",
    doc_url: "https://uptime.kuma.pet/",
    image: { name: "louislam/uptime-kuma", tag: "latest" },
    restart: "unless-stopped",
    volumes: [
      { host_path: "{CONFIG_PATH}/uptime-kuma", container_path: "/app/data" }
    ],
    ports: [
      { host: 3001, container: 3001, description: "Web UI" }
    ],
    deployment: {
      expose: true,
      expose_port: 3001,
      default_subdomain: "status"
    }
  },

  // --- GROUP: GATEWAY ---
  "homepage": {
    group: "gateway",
    name: "Homepage",
    description: "Un tableau de bord moderne, rapide et hautement personnalisable.",
    doc_url: "https://gethomepage.dev/latest/",
    image: { name: "ghcr.io/gethomepage/homepage", tag: "latest" },
    restart: "unless-stopped",
    env_vars: [
      { name: "PUID", value: "{PUID}" },
      { name: "PGID", value: "{PGID}" },
    ],
    volumes: [
      { host_path: "{CONFIG_PATH}/homepage", container_path: "/app/config", description: "Configuration de Homepage" }
    ],
    deployment: {
      expose: true,
      expose_port: 3000,
      default_subdomain: "homepage"
    }
  },

  // --- GROUP: SECURITY ---
  "adguardhome": {
    group: "security",
    name: "AdGuard Home",
    description: "Bloqueur de pubs et traqueurs au niveau du réseau.",
    doc_url: "https://adguard.com/en/adguard-home/overview.html",
    image: { name: "adguard/adguardhome", tag: "latest" },
    restart: "unless-stopped",
    ports: [
      { host: 53, container: 53, protocol: "tcp", description: "DNS" },
      { host: 53, container: 53, protocol: "udp", description: "DNS" },
      { host: 80, container: 80, description: "Web UI" },
      { host: 443, container: 443, description: "HTTPS" },
    ],
    volumes: [
      { host_path: "{CONFIG_PATH}/adguardhome/work", container_path: "/opt/adguardhome/work" },
      { host_path: "{CONFIG_PATH}/adguardhome/conf", container_path: "/opt/adguardhome/conf" },
    ],
    env_vars: [
      { name: "TZ", value: "{TIMEZONE}" },
    ],
    deployment: {
      expose: true,
      expose_port: 80,
      default_subdomain: "adguard"
    }
  },
  "vaultwarden": {
    group: "security",
    name: "Vaultwarden (Bitwarden)",
    description: "Gestionnaire de mots de passe auto-hébergé compatible Bitwarden.",
    doc_url: "https://github.com/dani-garcia/vaultwarden/wiki",
    image: { name: "vaultwarden/server", tag: "latest" },
    restart: "unless-stopped",
    env_vars: [
      { name: "PUID", value: "{PUID}" },
      { name: "PGID", value: "{PGID}" },
      { name: "TZ", value: "{TIMEZONE}" },
      createSecret("ADMIN_TOKEN", "Jeton d'administration pour la page d'administration."),
    ],
    volumes: [
      { host_path: "{CONFIG_PATH}/vaultwarden", container_path: "/data" },
    ],
    ports: [
      { host: 80, container: 80, description: "Web UI" },
    ],
    deployment: {
      expose: true,
      expose_port: 80,
      default_subdomain: "vault"
    }
  },

  // --- GROUP: MEDIA AUTOMATION ---
  "gluetun": {
    group: "media_automation",
    name: "Gluetun (VPN)",
    description: "Container VPN essentiel pour anonymiser le trafic des autres services.",
    doc_url: "https://github.com/qdm12/gluetun/wiki",
    image: { name: "qmcgaw/gluetun", tag: "latest" },
    cap_add: ["NET_ADMIN"],
    restart: "unless-stopped",
    ports: [
      // Ports for other services to connect through
      { host: 8888, container: 8888, protocol: "tcp", description: "HTTP proxy" },
      { host: 8388, container: 8388, protocol: "tcp", description: "Shadowsocks" },
      { host: 8388, container: 8388, protocol: "udp", description: "Shadowsocks" },
    ],
    env_vars: [
      { name: "VPN_SERVICE_PROVIDER", description: "Votre fournisseur de service VPN.", type: "select", options: ['protonvpn', 'mullvad', 'nordvpn', 'custom'], default: "protonvpn" },
      { name: "VPN_TYPE", description: "Type de protocole VPN.", type: "select", options: ['openvpn', 'wireguard'], default: "wireguard" },
      { name: "WIREGUARD_PRIVATE_KEY", description: "Clé privée Wireguard.", type: "secret", link_to: "WIREGUARD_PRIVATE_KEY", condition: (config) => config.VPN_TYPE === 'wireguard' },
      { name: "WIREGUARD_ADDRESSES", description: "Adresse IP Wireguard.", type: "text", condition: (config) => config.VPN_TYPE === 'wireguard' },
      { name: "OPENVPN_USER", description: "Nom d'utilisateur OpenVPN.", type: "text", condition: (config) => config.VPN_TYPE === 'openvpn' },
      { name: "OPENVPN_PASSWORD", description: "Mot de passe OpenVPN.", type: "secret", link_to: "OPENVPN_PASSWORD", condition: (config) => config.VPN_TYPE === 'openvpn' },
      { name: "SERVER_COUNTRIES", description: "Pays des serveurs VPN (séparés par une virgule).", type: "text", default: "Switzerland,Netherlands" },
    ],
  },
  "prowlarr": {
    group: "media_automation",
    name: "Prowlarr",
    description: "Gestionnaire d'indexers pour Sonarr, Radarr, Lidarr, etc.",
    doc_url: "https://prowlarr.com/",
    image: { name: "lscr.io/linuxserver/prowlarr", tag: "latest" },
    dependencies: ["gluetun"],
    network_mode: "service:gluetun",
    restart: "unless-stopped",
    env_vars: [
      { name: "PUID", value: "{PUID}" },
      { name: "PGID", value: "{PGID}" },
      { name: "TZ", value: "{TIMEZONE}" },
      createSecret("PROWLARR_API_KEY", "Clé API pour Prowlarr."),
    ],
    volumes: [
      { host_path: "{CONFIG_PATH}/prowlarr", container_path: "/config" },
    ],
    deployment: {
      expose: true,
      expose_port: 9696,
      default_subdomain: "prowlarr"
    },
  },
  "sonarr": {
    group: "media_automation",
    name: "Sonarr",
    description: "Gestion automatique de séries TV.",
    doc_url: "https://sonarr.tv/",
    image: { name: "lscr.io/linuxserver/sonarr", tag: "latest" },
    dependencies: ["gluetun", "prowlarr"],
    network_mode: "service:gluetun",
    restart: "unless-stopped",
    env_vars: [
      { name: "PUID", value: "{PUID}" },
      { name: "PGID", value: "{PGID}" },
      { name: "TZ", value: "{TIMEZONE}" },
      createSecret("SONARR_API_KEY", "Clé API pour Sonarr."),
    ],
    volumes: [
      { host_path: "{CONFIG_PATH}/sonarr", container_path: "/config" },
      { host_path: "{DATA_PATH}/media/tv", container_path: "/tv" },
      { host_path: "{DATA_PATH}/downloads", container_path: "/downloads" },
    ],
    deployment: {
      expose: true,
      expose_port: 8989,
      default_subdomain: "sonarr"
    },
  },
  "radarr": {
    group: "media_automation",
    name: "Radarr",
    description: "Gestion automatique de films.",
    doc_url: "https://radarr.video/",
    image: { name: "lscr.io/linuxserver/radarr", tag: "latest" },
    dependencies: ["gluetun", "prowlarr"],
    network_mode: "service:gluetun",
    restart: "unless-stopped",
    env_vars: [
      { name: "PUID", value: "{PUID}" },
      { name: "PGID", value: "{PGID}" },
      { name: "TZ", value: "{TIMEZONE}" },
      createSecret("RADARR_API_KEY", "Clé API pour Radarr."),
    ],
    volumes: [
      { host_path: "{CONFIG_PATH}/radarr", container_path: "/config" },
      { host_path: "{DATA_PATH}/media/movies", container_path: "/movies" },
      { host_path: "{DATA_PATH}/downloads", container_path: "/downloads" },
    ],
    deployment: {
      expose: true,
      expose_port: 7878,
      default_subdomain: "radarr"
    },
  },
  "lidarr": {
    group: "media_automation",
    name: "Lidarr",
    description: "Gestion automatique de musique.",
    doc_url: "https://lidarr.audio/",
    image: { name: "lscr.io/linuxserver/lidarr", tag: "latest" },
    dependencies: ["gluetun", "prowlarr"],
    network_mode: "service:gluetun",
    restart: "unless-stopped",
    env_vars: [
      { name: "PUID", value: "{PUID}" },
      { name: "PGID", value: "{PGID}" },
      { name: "TZ", value: "{TIMEZONE}" },
      createSecret("LIDARR_API_KEY", "Clé API pour Lidarr."),
    ],
    volumes: [
      { host_path: "{CONFIG_PATH}/lidarr", container_path: "/config" },
      { host_path: "{DATA_PATH}/media/music", container_path: "/music" },
      { host_path: "{DATA_PATH}/downloads", container_path: "/downloads" },
    ],
    deployment: {
      expose: true,
      expose_port: 8686,
      default_subdomain: "lidarr"
    },
  },
  "bazarr": {
    group: "media_automation",
    name: "Bazarr",
    description: "Gestion de sous-titres pour Sonarr & Radarr.",
    doc_url: "https://www.bazarr.media/",
    image: { name: "lscr.io/linuxserver/bazarr", tag: "latest" },
    dependencies: ["sonarr", "radarr"],
    network_mode: "service:gluetun", // Assuming Bazarr also goes through VPN
    restart: "unless-stopped",
    env_vars: [
      { name: "PUID", value: "{PUID}" },
      { name: "PGID", value: "{PGID}" },
      { name: "TZ", value: "{TIMEZONE}" },
      createSecret("BAZARR_API_KEY", "Clé API pour Bazarr."),
    ],
    volumes: [
      { host_path: "{CONFIG_PATH}/bazarr", container_path: "/config" },
      { host_path: "{DATA_PATH}/media/tv", container_path: "/tv" },
      { host_path: "{DATA_PATH}/media/movies", container_path: "/movies" },
    ],
    deployment: {
      expose: true,
      expose_port: 6767,
      default_subdomain: "bazarr"
    },
  },
  "qbittorrent": {
    group: "media_automation",
    name: "qBittorrent",
    description: "Client BitTorrent.",
    doc_url: "https://www.qbittorrent.org/",
    image: { name: "lscr.io/linuxserver/qbittorrent", tag: "latest" },
    dependencies: ["gluetun"],
    network_mode: "service:gluetun",
    restart: "unless-stopped",
    env_vars: [
      { name: "PUID", value: "{PUID}" },
      { name: "PGID", value: "{PGID}" },
      { name: "TZ", value: "{TIMEZONE}" },
      { name: "WEBUI_PORT", value: "8080" },
    ],
    ports: [
      { host: 8080, container: 8080, description: "Web UI" },
      { host: 6881, container: 6881, protocol: "tcp", description: "BitTorrent" },
      { host: 6881, container: 6881, protocol: "udp", description: "BitTorrent" },
    ],
    volumes: [
      { host_path: "{CONFIG_PATH}/qbittorrent", container_path: "/config" },
      { host_path: "{DATA_PATH}/downloads", container_path: "/downloads" },
    ],
    deployment: {
      expose: true,
      expose_port: 8080,
      default_subdomain: "qbittorrent"
    },
  },

  // --- GROUP: MEDIA STREAMING ---
  "jellyfin": {
    group: "media_streaming",
    name: "Jellyfin",
    description: "Serveur de streaming multimédia.",
    doc_url: "https://jellyfin.org/docs/",
    image: { name: "lscr.io/linuxserver/jellyfin", tag: "latest" },
    restart: "unless-stopped",
    env_vars: [
      { name: "PUID", value: "{PUID}" },
      { name: "PGID", value: "{PGID}" },
      { name: "TZ", value: "{TIMEZONE}" },
    ],
    ports: [
      { host: 8096, container: 8096, description: "HTTP" },
      { host: 8920, container: 8920, description: "HTTPS" },
    ],
    volumes: [
      { host_path: "{CONFIG_PATH}/jellyfin", container_path: "/config" },
      { host_path: "{DATA_PATH}/media/tv", container_path: "/data/tvshows" },
      { host_path: "{DATA_PATH}/media/movies", container_path: "/data/movies" },
    ],
    deployment: {
      expose: true,
      expose_port: 8096,
      default_subdomain: "jellyfin"
    }
  },
  "jellyseerr": {
    group: "media_streaming",
    name: "Jellyseerr",
    description: "Demandes de contenu pour Jellyfin/Plex.",
    doc_url: "https://seerr.dev/",
    image: { name: "fallenbagel/jellyseerr", tag: "latest" },
    restart: "unless-stopped",
    dependencies: ["jellyfin"],
    env_vars: [
      { name: "PUID", value: "{PUID}" },
      { name: "PGID", value: "{PGID}" },
      { name: "TZ", value: "{TIMEZONE}" },
    ],
    ports: [
      { host: 5055, container: 5055, description: "Web UI" },
    ],
    volumes: [
      { host_path: "{CONFIG_PATH}/jellyseerr", container_path: "/app/config" },
    ],
    deployment: {
      expose: true,
      expose_port: 5055,
      default_subdomain: "jellyseerr"
    }
  },

  // --- GROUP: FILE CLOUD ---
  "nextcloud-db": {
    group: "file_cloud",
    name: "Nextcloud DB",
    internal: true,
    image: { name: "postgres", tag: "15" },
    restart: "unless-stopped",
    volumes: [
      { host_path: "{DATA_PATH}/nextcloud-db", container_path: "/var/lib/postgresql/data" }
    ],
    env_vars: [
      { name: "POSTGRES_USER", value: "nextcloud" },
      createSecret("POSTGRES_PASSWORD", "Mot de passe de l'utilisateur PostgreSQL pour Nextcloud", "NEXTCLOUD_DB_PASSWORD"),
      { name: "POSTGRES_DB", value: "nextcloud" }
    ]
  },
  "nextcloud": {
    group: "file_cloud",
    name: "Nextcloud",
    description: "Suite de cloud personnel (fichiers, contacts, calendriers...).",
    doc_url: "https://docs.nextcloud.com",
    image: { name: "nextcloud", tag: "latest" },
    dependencies: ["nextcloud-db"],
    restart: "unless-stopped",
    ports: [
      { host: 8080, container: 80 }
    ],
    volumes: [
      { host_path: "{CONFIG_PATH}/nextcloud", container_path: "/var/www/html/config" },
      { host_path: "{DATA_PATH}/nextcloud", container_path: "/var/www/html/data" }
    ],
    env_vars: [
      { name: "POSTGRES_HOST", value: "nextcloud-db" },
      { name: "POSTGRES_USER", value: "nextcloud" },
      createSecret("POSTGRES_PASSWORD", "Mot de passe de l'utilisateur PostgreSQL pour Nextcloud", "NEXTCLOUD_DB_PASSWORD"),
      { name: "POSTGRES_DB", value: "nextcloud" },
      { name: "NEXTCLOUD_ADMIN_USER", description: "Nom de l'administrateur Nextcloud.", type: "text", default: "admin" },
      createSecret("NEXTCLOUD_ADMIN_PASSWORD", "Mot de passe de l'administrateur Nextcloud."),
    ],
    deployment: {
      expose: true,
      expose_port: 80,
      default_subdomain: "nextcloud"
    }
  }
};
