# Guide de configuration Firebase pour Axe Legal

## Étape 1 : Créer un projet Firebase

1. Allez sur https://console.firebase.google.com/
2. Cliquez sur **"Ajouter un projet"** ou **"Add project"**
3. Nom du projet : **axe-legal** (ou votre choix)
4. Désactivez Google Analytics (optionnel)
5. Cliquez sur **"Créer le projet"**

## Étape 2 : Configurer l'application Web

1. Dans la console Firebase, cliquez sur l'icône **Web** `</>`
2. Nom de l'application : **Axe Legal Web**
3. **NE PAS** cocher "Firebase Hosting" (on le configurera plus tard)
4. Cliquez sur **"Enregistrer l'application"**
5. **COPIEZ** les informations de configuration qui s'affichent :

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "axe-legal.firebaseapp.com",
  projectId: "axe-legal",
  storageBucket: "axe-legal.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Étape 3 : Activer Firestore Database

1. Dans le menu de gauche, cliquez sur **"Firestore Database"**
2. Cliquez sur **"Créer une base de données"**
3. Choisissez **"Commencer en mode production"** (les règles sont déjà prêtes)
4. Choisissez l'emplacement : **europe-west** (Europe) ou le plus proche
5. Cliquez sur **"Activer"**

## Étape 4 : Activer Authentication

1. Dans le menu de gauche, cliquez sur **"Authentication"**
2. Cliquez sur **"Commencer"** ou **"Get started"**
3. Dans l'onglet **"Sign-in method"**
4. Activez **"E-mail/Password"** (Email/Mot de passe)
5. Cliquez sur **"Enregistrer"**

## Étape 5 : Créer le premier utilisateur admin

1. Toujours dans **Authentication**, allez dans l'onglet **"Users"**
2. Cliquez sur **"Ajouter un utilisateur"**
3. Email : **admin@axelegal.bj**
4. Mot de passe : **admin123** (vous pourrez le changer plus tard)
5. Cliquez sur **"Ajouter un utilisateur"**
6. **COPIEZ l'UID** de l'utilisateur créé (exemple: `kR8vN2mP4qX...`)

## Étape 6 : Ajouter les données admin dans Firestore

1. Allez dans **"Firestore Database"**
2. Cliquez sur **"Commencer une collection"**
3. ID de la collection : **users**
4. Cliquez sur **"Suivant"**
5. ID du document : **COLLEZ l'UID** copié à l'étape 5
6. Ajoutez les champs suivants :

| Champ | Type | Valeur |
|-------|------|--------|
| email | string | admin@axelegal.bj |
| name | string | Administrateur |
| role | string | admin |
| createdAt | timestamp | (date du jour) |

7. Cliquez sur **"Enregistrer"**

## Étape 7 : Déployer les règles Firestore

Les règles de sécurité sont déjà prêtes dans le fichier `firestore.rules`.

Pour les déployer :
```bash
firebase deploy --only firestore:rules
```

## Étape 8 : Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec vos clés Firebase :

```env
VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=axe-legal.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=axe-legal
VITE_FIREBASE_STORAGE_BUCKET=axe-legal.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
```

## Étape 9 : Se connecter à Firebase CLI

```bash
firebase login
```

## Étape 10 : Initialiser Firebase dans le projet

```bash
firebase init
```

Sélectionnez :
- **Firestore** (règles et indexes)
- **Hosting** (pour le déploiement)

Utilisez les fichiers existants :
- Firestore rules: `firestore.rules`
- Firestore indexes: `firestore.indexes.json`
- Public directory: `dist`

## Étape 11 : Build et déploiement

```bash
npm run build
firebase deploy
```

Votre application sera disponible sur : `https://axe-legal.web.app`

---

## Résumé des commandes

```bash
# 1. Connexion Firebase
firebase login

# 2. Initialisation (si pas fait)
firebase init

# 3. Build de l'application
npm run build

# 4. Déploiement complet
firebase deploy

# 5. Déploiement hosting uniquement
firebase deploy --only hosting

# 6. Déploiement règles Firestore uniquement
firebase deploy --only firestore:rules
```

---

## Informations importantes

- **Console Firebase** : https://console.firebase.google.com/
- **Quotas gratuits Firestore** : 
  - 1 GB de stockage
  - 50,000 lectures/jour
  - 20,000 écritures/jour
  - 20,000 suppressions/jour

- **Identifiants admin par défaut** :
  - Email : admin@axelegal.bj
  - Mot de passe : admin123 (à changer après la première connexion)

---

## Prochaines étapes après configuration

Une fois Firebase configuré, l'agent mettra à jour les fichiers pour utiliser Firebase au lieu de l'API Express actuelle.
