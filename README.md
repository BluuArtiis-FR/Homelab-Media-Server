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

*(Ici, vous pourrez ajouter une capture d'écran du configurateur en action !)*

![image](https://github.com/user-attachments/assets/53213c6b-6b21-4f10-a24a-10ce6531a7c5)


## ✨ Fonctionnalités

- **Déploiement Facile** : Lancez un serveur média complet en quelques minutes.
- **Hautement Personnalisable** : Choisissez parmi une large sélection de services populaires.
- **Deux Workflows** : Une UI simple pour commencer, et une CLI puissante pour un contrôle total.
- **Basé sur Docker** : Chaque service est isolé, facile à maintenir et à mettre à jour.
- **Open Source** : Entièrement gratuit et modifiable.

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
