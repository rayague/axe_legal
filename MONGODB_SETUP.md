# Configuration de la Base de Données MongoDB Atlas

## Étapes à suivre :

### 1. Créer un compte MongoDB Atlas (GRATUIT)
1. Allez sur : https://www.mongodb.com/cloud/atlas/register
2. Inscrivez-vous avec votre email (ou connectez-vous avec Google/GitHub)
3. Choisissez l'option **FREE** (M0 Sandbox - 512 MB gratuit)

### 2. Créer un cluster
1. Dans le dashboard, cliquez sur "Create" ou "Build a Database"
2. Choisissez **FREE** (M0)
3. Sélectionnez le provider : **AWS**
4. Région : Choisissez la plus proche (ex: **Frankfurt** pour l'Europe)
5. Nom du cluster : `axe-legal-cluster` (ou gardez le nom par défaut)
6. Cliquez sur "Create Deployment"

### 3. Configurer l'accès
1. **Username** : `axelegal_admin`
2. **Password** : Générez un mot de passe fort (NOTEZ-LE !)
3. Cliquez sur "Create Database User"

### 4. Configurer l'IP Whitelist
1. Choisissez "Add entries to your IP Access List"
2. Cliquez sur "Allow Access from Anywhere" (pour Vercel)
3. Confirmez avec "0.0.0.0/0"
4. Cliquez sur "Finish and Close"

### 5. Obtenir la chaîne de connexion
1. Cliquez sur "Connect" sur votre cluster
2. Choisissez "Connect your application"
3. Driver : **Node.js**, Version : **6.8 or later**
4. Copiez la chaîne de connexion (Connection String)
   - Elle ressemble à : `mongodb+srv://axelegal_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
5. **IMPORTANT** : Remplacez `<password>` par votre mot de passe

### 6. Créer la base de données
1. Dans Atlas, allez dans "Browse Collections"
2. Cliquez sur "Add My Own Data"
3. Database name : `axe_legal_db`
4. Collection name : `users`
5. Cliquez sur "Create"

## Configuration terminée ! ✅
Passez à l'étape suivante pour intégrer MongoDB dans votre application.
