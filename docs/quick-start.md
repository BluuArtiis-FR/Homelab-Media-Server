# 🚀 Démarrage Rapide

Ce guide vous explique comment déployer votre serveur multimédia en quelques minutes.

## Prérequis

-   Un serveur sous **Ubuntu ou Debian**.
-   Un nom de domaine pointant vers l'IP de votre serveur (pour l'accès externe et le SSL).
-   `git` et `sudo` installés.

## Étape 1 : Cloner le Projet

Connectez-vous à votre serveur et clonez ce dépôt :

```bash
git clone https://github.com/BluuArtiis-FR/homelab-media-server.git
cd homelab-media-server
```

## Étape 2 : Lancer l'Installation de l'Hôte

Cette commande unique prépare votre système. Elle doit être exécutée avec `sudo`. Elle va :
- Installer Docker et Docker Compose.
- Configurer le pare-feu (UFW).
- Créer la structure de dossiers et le fichier de configuration `.env`.

```bash
sudo make install
```

## Étape 3 : Configurer le Fichier `.env`

Le script d'installation a créé un fichier `.env` à partir du modèle `env.example`. Vous devez maintenant le modifier pour y mettre vos propres informations.

```bash
nano .env
```

Les variables les plus importantes à modifier sont :
-   `DOMAIN` : Votre nom de domaine (ex: `mondomaine.com`).
-   `ACME_EMAIL` : Votre email pour les certificats SSL.
-   `AUTHENTIK_SECRET_KEY` et les autres mots de passe `CHANGEME`. Utilisez `openssl rand -base64 32` pour générer des chaînes sécurisées.
-   `COMPOSE_PROFILES` : La liste des groupes de services que vous souhaitez activer (ex: `media,download,cloud`).

## Étape 4 : Démarrer la Stack

Une fois votre fichier `.env` configuré, lancez tous les services :

```bash
make up
```

Votre serveur est maintenant en ligne ! Les services seront accessibles via leurs sous-domaines respectifs (ex: `https://jellyfin.mondomaine.com`).

## Gérer votre Serveur

Utilisez les commandes `make` pour gérer votre stack :
-   `make down` : Arrête tous les services.
-   `make logs` : Affiche les journaux en temps réel.
-   `make pull` : Met à jour les images de vos services.
-   `make ps` : Affiche le statut de vos conteneurs.

Consultez `make help` pour voir toutes les commandes disponibles.