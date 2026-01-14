# ⚙️ Guide d'Installation Détaillé

Ce document détaille le processus d'installation et les actions effectuées par le script `install.sh` lancé via `sudo make install`.

## Le Processus d'Installation

L'installation est conçue pour être aussi simple et non-intrusive que possible. Le processus se déroule en une seule commande :

```bash
sudo make install
```

Cette commande exécute le script `install.sh` avec les privilèges `sudo`, ce qui est nécessaire pour installer des paquets et configurer le système.

## Actions du Script d'Installation

Le script `install.sh` effectue les tâches suivantes pour préparer votre hôte :

### 1. Vérifications du Système
- **Privilèges Root** : S'assure que le script est bien lancé avec `sudo`.
- **Détection de l'OS** : Vérifie que le système est une distribution basée sur Debian (Ubuntu, Debian). Bien qu'il puisse fonctionner sur d'autres systèmes, le support officiel est concentré sur ces derniers.
- **Détection de l'Utilisateur** : Identifie l'utilisateur qui a lancé la commande `sudo` (via la variable `$SUDO_USER`) afin d'attribuer les bonnes permissions aux dossiers et fichiers créés.

### 2. Installation de Docker
- Le script vérifie si Docker et Docker Compose sont déjà installés.
- Si ce n'est pas le cas, il ajoute le dépôt officiel de Docker, puis installe les dernières versions de `docker-ce`, `docker-ce-cli`, `containerd.io`, et le plugin `docker-compose`.
- Il ajoute ensuite votre utilisateur au groupe `docker`, ce qui vous permet d'exécuter des commandes `docker` sans `sudo` (nécessite une déconnexion/reconnexion pour prendre effet).

### 3. Configuration du Pare-feu (UFW)
- Le script installe `UFW` (Uncomplicated Firewall) s'il n'est pas présent.
- Il configure un ensemble de règles par défaut sécurisées : tout le trafic entrant est refusé, et tout le trafic sortant est autorisé.
- Il ouvre ensuite les ports **essentiels** pour le fonctionnement de la stack :
  - `22/tcp` pour SSH (afin que vous ne perdiez pas l'accès à votre machine).
  - `80/tcp` pour Traefik (utilisé pour le challenge HTTP de Let's Encrypt).
  - `443/tcp` pour Traefik (le port principal pour tout votre trafic HTTPS).
- **Important** : Aucun autre port de service n'est ouvert. L'accès à tous vos services se fait via Traefik sur le port 443, ce qui centralise la sécurité.

### 4. Création de la Structure de Fichiers
- Le script crée les dossiers nécessaires au bon fonctionnement de la stack dans le répertoire courant du projet : `config/`, `data/`, `downloads/`, `media/`.
- Il attribue la propriété de ces dossiers à l'utilisateur qui a lancé l'installation, garantissant ainsi que les conteneurs n'auront pas de problèmes de permissions.

### 5. Création du Fichier `.env`
- Si un fichier `.env` n'existe pas déjà, le script copie le modèle `.env.example` pour créer un nouveau fichier `.env`.
- C'est ce fichier que vous devrez ensuite modifier pour personnaliser votre installation.

## Après l'Installation

Une fois le script terminé, votre système est prêt. Le script vous rappellera les prochaines étapes :

1.  **Modifier le fichier `.env`** pour y insérer votre configuration personnelle (domaine, mots de passe, profils de services).
2.  **Lancer la stack** avec la commande `make up`.