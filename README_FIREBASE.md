# 🔥 Axe Legal - Application Web Firebase

Application web moderne pour cabinet juridique avec Firebase Backend.

## 🏗️ Architecture

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build ultra-rapide
- **Tailwind CSS** + **Shadcn/ui** - Design moderne
- **React Router** - Navigation
- **React Query** - Gestion d'état

### Backend
- **Firebase Authentication** - Authentification sécurisée
- **Cloud Firestore** - Base de données NoSQL temps réel
- **Firebase Hosting** - Hébergement avec CDN global
- **Firebase Analytics** - Statistiques d'utilisation

## 📂 Structure du projet

```
axe_legal/
├── src/
│   ├── components/       # Composants React réutilisables
│   ├── pages/           # Pages de l'application
│   ├── lib/
│   │   ├── firebase.ts      # Configuration Firebase
│   │   ├── firebaseApi.ts   # API Firestore complète
│   │   ├── auth.tsx         # Context d'authentification
│   │   └── utils.ts         # Utilitaires
│   ├── hooks/           # Custom hooks React
│   └── assets/          # Images et ressources
├── public/              # Fichiers statiques
├── firestore.rules      # Règles de sécurité Firestore
├── firebase.json        # Configuration Firebase
└── .firebaserc         # Projet Firebase lié
```

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Firebase

### Installation

```bash
# Installer les dépendances
npm install

# Configurer Firebase (si pas déjà fait)
firebase login
firebase init
```

### Développement local

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Build production

```bash
npm run build
```

### Déploiement Firebase

```bash
# Déploiement complet (règles + hosting)
npm run firebase:deploy

# Déploiement hosting uniquement
npm run firebase:hosting
```

## 🔐 Configuration Firebase

Voir les guides détaillés :
- **FIREBASE_SETUP.md** - Configuration complète étape par étape
- **FIREBASE_QUICKSTART.md** - Guide de démarrage rapide
- **FIREBASE_MIGRATION_COMPLETE.md** - Résumé de la migration

### Configuration minimale requise

1. **Authentication Email/Password** activée
2. **Firestore Database** créée (mode production)
3. **Utilisateur admin** créé dans Authentication et Firestore

## 📋 Collections Firestore

| Collection | Description | Accès public |
|------------|-------------|--------------|
| `users` | Comptes administrateurs | ❌ Admin seulement |
| `services` | Services juridiques | ✅ Lecture publique |
| `team` | Membres de l'équipe | ✅ Lecture publique |
| `process` | Étapes du processus | ✅ Lecture publique |
| `testimonials` | Témoignages clients | ✅ Lecture publique |
| `announcements` | Annonces | ✅ Lecture publique |
| `messages` | Messages de contact | ✅ Création publique |
| `consultations` | Demandes de consultation | ✅ Création publique |
| `settings` | Configuration | ✅ Lecture publique |

## 🎯 Fonctionnalités

### Partie publique
- ✅ Page d'accueil avec hero section
- ✅ Présentation des services juridiques
- ✅ Équipe de juristes
- ✅ Processus de travail
- ✅ Témoignages clients
- ✅ **Simulateur juridique LegalTech** (9 catégories)
- ✅ Formulaire de contact
- ✅ Demande de consultation en ligne
- ✅ Footer complet

### Partie admin
- ✅ Connexion sécurisée (Firebase Auth)
- ✅ Dashboard administrateur
- ✅ Gestion des services
- ✅ Gestion de l'équipe
- ✅ Gestion des processus
- ✅ Gestion des témoignages
- ✅ Gestion des annonces
- ✅ Messages reçus
- ✅ Consultations reçues
- ✅ Profil admin (changement de mot de passe)

## 🔒 Sécurité

- ✅ Authentication Firebase avec JWT
- ✅ Règles Firestore côté serveur
- ✅ Vérification du rôle admin
- ✅ Protection des routes admin
- ✅ HTTPS automatique (Firebase Hosting)
- ✅ CORS configuré

## 🌐 URLs

### Développement
- Frontend: `http://localhost:5173`
- Admin: `http://localhost:5173/admin/login`

### Production
- Site public: `https://axe-legal-f91cd.web.app`
- Admin: `https://axe-legal-f91cd.web.app/admin/login`

## 👤 Identifiants admin par défaut

```
Email: admin@axelegal.bj
Password: admin123
```

⚠️ **Changez le mot de passe après la première connexion !**

## 📦 Scripts disponibles

```bash
npm run dev              # Développement local
npm run build            # Build production
npm run preview          # Preview du build
npm run lint             # Vérification du code
npm run firebase:deploy  # Déploiement Firebase complet
npm run firebase:hosting # Déploiement hosting uniquement
```

## 🔧 Technologies utilisées

### Frontend
- React 18.3
- TypeScript 5.8
- Vite 5.4
- Tailwind CSS 3.4
- Shadcn/ui
- React Router 6
- React Query
- Lucide Icons

### Backend
- Firebase 12.5
- Cloud Firestore
- Firebase Authentication
- Firebase Hosting
- Firebase Analytics

### Build Tools
- Vite (ESBuild)
- PostCSS
- Autoprefixer
- TypeScript Compiler

## 📊 Quotas gratuits Firebase

- **Firestore**: 1 GB stockage, 50K lectures/jour
- **Authentication**: 10K utilisateurs
- **Hosting**: 10 GB stockage, 360 MB/jour transfert
- **Analytics**: Illimité

## 🆘 Support & Documentation

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/ui](https://ui.shadcn.com)

## 📄 License

Propriétaire - Axe Legal © 2025

---

**Développé avec ❤️ pour Axe Legal**
