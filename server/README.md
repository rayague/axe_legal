# Serveur Backend - Axe Legal

Serveur Node.js simple avec authentification JWT et base SQLite.

## Installation

```bash
cd server
npm install
```

## Démarrage

```bash
npm start
```

Le serveur démarre sur http://localhost:4000

## Utilisateur Admin par défaut

Email: `admin@axe.local`  
Mot de passe: `ChangeMe123!`

⚠️ **IMPORTANT**: Changez ces identifiants en production.

## Endpoints

### POST /api/admin/login
Connexion admin.

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
  "user": {
    "id": 1,
    "email": "admin@axe.local",
    "name": "Admin",
    "isAdmin": true
  }
}
```

### GET /api/admin/me
Retourne l'utilisateur connecté (requiert Bearer token).

### GET /api/admin/dashboard
Retourne les stats du dashboard (requiert Bearer token et isAdmin=true).

## Variables d'environnement

- `PORT` (défaut: 4000)
- `JWT_SECRET` (défaut: 'change_me_to_secure_value' — **CHANGEZ EN PRODUCTION**)

## Base de données

SQLite (`server/data.sqlite`) créée automatiquement au démarrage.
