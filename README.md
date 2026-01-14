<div align="center">

# Homelab-Media-Server

**Un outil pour déployer facilement un serveur média personnel avec Docker, via une UI web ou en CLI.**

</div>

<p align="center">
  <a href="https://github.com/BluuArtiis-FR/Homelab-Media-Server/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/BluuArtiis-FR/Homelab-Media-Server?style=for-the-badge" alt="Licence">
  </a>
  <a href="https://github.com/BluuArtiis-FR/Homelab-Media-Server/actions/workflows/pages/pages-build-deployment">
    <img src="https://img.shields.io/github/actions/workflow/status/BluuArtiis-FR/Homelab-Media-Server/pages/pages-build-deployment?label=D%C3%A9ploiement&style=for-the-badge" alt="Statut du Déploiement">
  </a>
</p>

---

**Homelab-Media-Server** est un projet conçu pour simplifier radicalement le déploiement et la gestion d'un serveur personnel (homelab) grâce à Docker. Il offre deux approches pour s'adapter à tous les niveaux de compétence.

## 🚀 Accéder au Configurateur Web

La méthode la plus simple pour commencer : [**Accéder au Configurateur →**](https://bluuartiis-fr.github.io/Homelab-Media-Server/)

## 📸 Aperçu

![image](https://github.com/user-attachments/assets/53213c6b-6b21-4f10-a24a-10ce6531a7c5)

## 📦 Services Disponibles

<details>
<summary>Cliquez pour voir la liste complète des services</summary>

> La liste suivante est générée à partir du manifeste de services du projet. Les icônes sont fournies par la communauté via le dépôt [walkxcode/dashboard-icons](https://github.com/walkxcode/dashboard-icons).

<table>
  <thead>
    <tr>
      <th align="center">Icône</th>
      <th>Service</th>
      <th>Catégorie</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td colspan=4 align="center"><b>⬇️ Téléchargement & Automatisation</b></td></tr>
    <tr>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/gluetun.png" alt="Gluetun" width="24"></td>
      <td>Gluetun (VPN)</td>
      <td>Téléchargement</td>
      <td>Container VPN essentiel pour anonymiser le trafic.</td>
    </tr>
    <tr>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/qbittorrent.png" alt="qBittorrent" width="24"></td>
      <td>qBittorrent</td>
      <td>Téléchargement</td>
      <td>Client BitTorrent.</td>
    </tr>
    <tr>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/prowlarr.png" alt="Prowlarr" width="24"></td>
      <td>Prowlarr</td>
      <td>Téléchargement</td>
      <td>Gestionnaire d'indexers pour les *arr.</td>
    </tr>
    <tr>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/sonarr.png" alt="Sonarr" width="24"></td>
      <td>Sonarr</td>
      <td>Téléchargement</td>
      <td>Gestion automatique de séries TV.</td>
    </tr>
    <tr>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/radarr.png" alt="Radarr" width="24"></td>
      <td>Radarr</td>
      <td>Téléchargement</td>
      <td>Gestion automatique de films.</td>
    </tr>
    <tr>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/lidarr.png" alt="Lidarr" width="24"></td>
      <td>Lidarr</td>
      <td>Téléchargement</td>
      <td>Gestion automatique de musique.</td>
    </tr>
    <tr>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/bazarr.png" alt="Bazarr" width="24"></td>
      <td>Bazarr</td>
      <td>Téléchargement</td>
      <td>Gestion de sous-titres.</td>
    </tr>
    <tr>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/unpackerr.png" alt="Unpackerr" width="24"></td>
      <td>Unpackerr</td>
      <td>Téléchargement</td>
      <td>Décompresse automatiquement les archives.</td>
    </tr>
    <tr><td colspan=4 align="center"><b>🎬 Média & Streaming</b></td></tr>
    <tr>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/jellyfin.png" alt="Jellyfin" width="24"></td>
      <td>Jellyfin</td>
      <td>Média</td>
      <td>Serveur de streaming multimédia.</td>
    </tr>
    <tr>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/jellyseerr.png" alt="Jellyseerr" width="24"></td>
      <td>Jellyseerr</td>
      <td>Média</td>
      <td>Demandes de contenu pour Jellyfin/Plex.</td>
    </tr>
    <tr>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/tdarr.png" alt="Tdarr" width="24"></td>
      <td>Tdarr</td>
      <td>Média</td>
      <td>Automatisation du transcodage.</td>
    </tr>
    <tr>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/jellystat.png" alt="Jellystat" width="24"></td>
      <td>Jellystat</td>
      <td>Média</td>
      <td>Statistiques et suivi d'activité pour Jellyfin.</td>
    </tr>
    <tr><td colspan=4 align="center"><b>☁️ Cloud Personnel & Fichiers</b></td></tr>
    <tr>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/nextcloud.png" alt="Nextcloud" width="24"></td>
      <td>Nextcloud</td>
      <td>Cloud</td>
      <td>Suite de cloud personnel.</td>
    </tr>
    <tr>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/duplicati.png" alt="Duplicati" width="24"></td>
      <td>Duplicati</td>
      <td>Cloud</td>
      <td>Logiciel de sauvegarde.</td>
    </tr>
    <tr>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/filebrowser.png" alt="FileBrowser" width="24"></td>
      <td>FileBrowser</td>
      <td>Cloud</td>
      <td>Interface simple de gestion de fichiers.</td>
    </tr>
    <tr><td colspan=4 align="center"><b>📚 Documentation & Prise de Notes</b></td></tr>
    <tr>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/bookstack.png" alt="Bookstack" width="24"></td>
      <td>Bookstack</td>
      <td>Docs</td>
      <td>Plateforme de documentation et de wiki.</td>
    </tr>
    <tr>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/paperless-ngx.png" alt="Paperless-ngx" width="24"></td>
      <td>Paperless-ngx</td>
      <td>Docs</td>
      <td>Archive numérique intelligente.</td>
    </tr>
    <tr><td colspan=4 align="center"><b>🛠️ Gestion & Monitoring</b></td></tr>
    <tr>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/portainer.png" alt="Portainer" width="24"></td>
      <td>Portainer</td>
      <td>Gestion</td>
      <td>Interface de gestion de conteneurs Docker.</td>
    </tr>
    <tr>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/dozzle.png" alt="Dozzle" width="24"></td>
      <td>Dozzle</td>
      <td>Gestion</td>
      <td>Visualiseur de logs Docker.</td>
    </tr>
    <tr>
      <td align="center"><img src="https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/nginx-proxy-manager.png" alt="Nginx Proxy Manager" width="24"></td>
      <td>Nginx Proxy Manager</td>
      <td>Gestion</td>
      <td>Interface graphique pour gérer le reverse proxy.</td>
    </tr>
    <tr><td colspan=4 align="center"><b>Et bien d'autres...</b></td></tr>
    <tr>
      <td align="center">🏠</td>
      <td>Home Assistant</td>
      <td>Domotique</td>
      <td>Plateforme de domotique.</td>
    </tr>
    <tr>
      <td align="center">🖼️</td>
      <td>Immich</td>
      <td>Photos</td>
      <td>Solution de sauvegarde de photos et vidéos.</td>
    </tr>
    <tr>
      <td align="center">💰</td>
      <td>Firefly III</td>
      <td>Finances</td>
      <td>Gestionnaire de finances personnelles.</td>
    </tr>
    <tr>
      <td align="center">🍲</td>
      <td>Mealie</td>
      <td>Recettes</td>
      <td>Gestionnaire de recettes de cuisine.</td>
    </tr>
    <tr>
      <td align="center">🛡️</td>
      <td>Vaultwarden</td>
      <td>Sécurité</td>
      <td>Gestionnaire de mots de passe.</td>
    </tr>
  </tbody>
</table>

</details>

## ✨ Fonctionnalités Clés

- **Déploiement Facile** : Lancez un serveur média complet en quelques minutes.
- **Hautement Personnalisable** : Choisissez parmi une large sélection de services populaires.
- **Deux Workflows** : Une UI simple pour commencer, et une CLI puissante pour un contrôle total.
- **Basé sur Docker** : Chaque service est isolé, facile à maintenir et à mettre à jour.
- **Open Source** : Entièrement gratuit et modifiable.

## 🛠️ Installation Avancée (CLI)

Cette méthode est recommandée pour les utilisateurs qui souhaitent cloner l'intégralité du projet et gérer leur configuration manuellement.

Pour des instructions détaillées sur l'installation, la configuration du fichier `.env` et l'utilisation des profils, consultez notre guide complet :

➡️ [**Consulter le Guide d'Utilisation Avancée**](./docs/GUIDE_AVANCE.md)

