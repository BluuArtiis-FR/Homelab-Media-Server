# Homelab-Media-Server

**Homelab-Media-Server** est un projet conçu pour simplifier radicalement le déploiement et la gestion d'un serveur personnel (homelab) grâce à Docker. Il offre deux approches pour s'adapter à tous les niveaux de compétence :

1.  **Un Configurateur Web Intuitif** : Idéal pour les débutants, une interface web en React permet de sélectionner les services désirés (Jellyfin, Sonarr, Radarr, etc.), de personnaliser les ports et les volumes, puis de télécharger un package `docker-compose.yml` et `.env` prêt à l'emploi.
2.  **Une Configuration CLI Avancée** : Pour les utilisateurs expérimentés, le projet peut être cloné entièrement. Un `Makefile` et un `docker-compose.yml` principal utilisant les profils Docker permettent un contrôle total sur l'ensemble des services disponibles.

## ✨ Fonctionnalités

- **Déploiement Facile** : Lancez un serveur média complet en quelques minutes.
- **Hautement Personnalisable** : Choisissez parmi une large sélection de services populaires.
- **Deux Workflows** : Une UI simple pour commencer, et une CLI puissante pour un contrôle total.
- **Basé sur Docker** : Chaque service est isolé, facile à maintenir et à mettre à jour.
- **Open Source** : Entièrement gratuit et modifiable.

## 🚀 Démarrage Rapide (Configurateur Web)

La méthode la plus simple pour commencer est d'utiliser le configurateur web : [**Accéder au Configurateur →**](https://bluuartiis-fr.github.io/Homelab-Media-Server/)

1.  Accédez à l'URL du configurateur.
2.  Sélectionnez les services que vous souhaitez installer.
3.  Personnalisez les options de base (ports, chemins des fichiers).
4.  Cliquez sur "Générer & Télécharger" pour obtenir votre fichier `.zip`.
5.  Décompressez le fichier sur votre serveur, et lancez la commande `docker-compose up -d`.

## 🛠️ Installation Avancée (CLI)

Cette méthode est recommandée pour les utilisateurs qui souhaitent cloner l'intégralité du projet et gérer leur configuration manuellement.

```bash
# 1. Cloner le projet
git clone https://github.com/BluuArtiis-FR/Homelab-Media-Server.git
cd Homelab-Media-Server

# 2. Configurer les services
# Copiez le fichier d'exemple et modifiez-le pour activer les profils des services souhaités.
cp .env.example .env
nano .env

# 3. Lancer l'installation et le démarrage
make install
```

## 💻 Technologies

- **Backend** : Docker, Docker Compose, Makefile
- **Frontend** : React, Vite, Tailwind CSS

---
*Ce projet est géré et maintenu par la communauté. N'hésitez pas à contribuer !*
