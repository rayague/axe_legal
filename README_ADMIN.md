# Axe Legal - Site Web & Système d'Administration

Site web du cabinet juridique Axe Legal avec système d'authentification admin et dashboard.

## Technologies

**Frontend:**
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

**Backend:**
- Node.js + Express
- SQLite (better-sqlite3)
- JWT pour l'authentification
- bcrypt pour le hachage des mots de passe

---

## Installation & Démarrage

### 1. Frontend (React + Vite)

```sh
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le frontend démarre sur http://localhost:5173

### 2. Backend (Express + SQLite)

```sh
# Aller dans le dossier server
cd server

# Installer les dépendances
npm install

# Lancer le serveur
npm start
```

Le backend démarre sur http://localhost:4000

---

## Connexion Admin

### Accès

L'interface admin est cachée au public. Seuls les administrateurs connectés peuvent y accéder.

**URL de connexion:** http://localhost:5173/admin/login

**Identifiants par défaut:**
- Email: `admin@axe.local`
- Mot de passe: `ChangeMe123!`

⚠️ **CHANGEZ CES IDENTIFIANTS EN PRODUCTION**

### Fonctionnalités

Une fois connecté, un bouton "Admin" apparaît dans le header (navbar) pour accéder au dashboard.

**Dashboard:** http://localhost:5173/admin/dashboard

Le dashboard affiche:
- Statistiques (utilisateurs, clients, dossiers)
- Interface d'administration réservée aux admins

---

## Endpoints API Backend

### POST /api/admin/login
Authentification admin

**Body:**
```json
{
  "email": "admin@axe.local",
  "password": "ChangeMe123!"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": { "id": 1, "email": "admin@axe.local", "isAdmin": true }
}
```

### GET /api/admin/me
Récupère l'utilisateur connecté (requiert Bearer token)

### GET /api/admin/dashboard
Récupère les stats du dashboard (requiert Bearer token + isAdmin=true)

---

## Variables d'environnement

### Backend (server/.env)

```
PORT=4000
JWT_SECRET=votre_secret_securise_ici
```

### Frontend (.env)

```
VITE_API_BASE=http://localhost:4000
```

---

## Déploiement

Pour déployer en production:

1. **Backend:** Hébergez le serveur Node.js (Heroku, Railway, Render, etc.) avec une vraie base SQLite ou migrez vers PostgreSQL
2. **Frontend:** Déployez sur Vercel, Netlify, ou via Lovable
3. **IMPORTANT:** Changez `JWT_SECRET` et les identifiants admin par défaut
4. Configurez `VITE_API_BASE` pour pointer vers votre serveur backend en production

---

## Lovable Project

**URL**: https://lovable.dev/projects/23270293-c2c5-4f91-8c0f-1112c108d64

## Éditer ce code

**Use Lovable:** [Lovable Project](https://lovable.dev/projects/23270293-c2c5-4f91-8c0f-1112c108d664)  
**Use votre IDE:** Clonez ce repo et poussez vos changements  
**GitHub Codespaces:** Lancez un Codespace depuis GitHub

## Domaine personnalisé

Vous pouvez connecter un domaine personnalisé via Lovable > Project > Settings > Domains.

[Documentation](https://docs.lovable.dev/features/custom-domain#custom-domain)
