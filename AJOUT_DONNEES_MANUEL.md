# 🚀 Guide Rapide - Ajout Manuel des Données

Puisque le seed automatique nécessite des configurations avancées, voici un guide pour ajouter rapidement les données essentielles via la console Firebase.

---

## 🎯 Étapes Simples

### Étape 1: Créer l'utilisateur admin (2 min)

1. **Allez sur**: https://console.firebase.google.com/project/axe-legal-f91cd/authentication/users
2. Cliquez sur **"Add user"**
3. Remplissez:
   - Email: `admin@axelegal.bj`
   - Password: `admin123`
4. Cliquez **"Add user"**
5. **COPIEZ l'UID** qui s'affiche (ex: `kR8vN2mP4qXvZ...`)

### Étape 2: Ajouter le profil admin dans Firestore (2 min)

1. **Allez sur**: https://console.firebase.google.com/project/axe-legal-f91cd/firestore/data
2. Cliquez sur **"Start collection"**
3. Collection ID: `users`
4. Cliquez **"Next"**
5. Document ID: **COLLEZ l'UID** copié ci-dessus
6. Ajoutez les champs:
   - `email` (string): `admin@axelegal.bj`
   - `name` (string): `Administrateur`
   - `role` (string): `admin`
   - `createdAt` (timestamp): Cliquez sur l'horloge, puis "Now"
7. Cliquez **"Save"**

---

## ✅ C'EST TOUT !

Vous pouvez maintenant:

1. Vous connecter à l'admin: https://axe-legal-f91cd.web.app/admin/login
   - Email: `admin@axelegal.bj`
   - Mot de passe: `admin123`

2. Ajouter vos contenus depuis l'interface admin:
   - Services
   - Membres de l'équipe
   - Témoignages
   - Annonces
   - etc.

---

## 📝 Optionnel: Ajouter des données de démonstration

Si vous voulez afficher du contenu immédiatement sur le site public, ajoutez ces données via l'admin:

### Services (4 exemples)

Une fois connecté, allez dans **Services** → **Ajouter**:

1. **Droit des Affaires**
   - Description: "Accompagnement juridique complet pour vos entreprises : création, restructuration, contrats commerciaux, fusions-acquisitions."

2. **Droit Immobilier**
   - Description: "Conseil et assistance dans vos transactions immobilières, baux commerciaux et résidentiels, copropriété."

3. **Droit du Travail**
   - Description: "Défense de vos droits en matière de contrats de travail, licenciement, harcèlement et conflits collectifs."

4. **Droit Fiscal**
   - Description: "Optimisation fiscale, contentieux fiscal, déclarations et conseils en matière de fiscalité."

### Membres de l'équipe (4 exemples)

Allez dans **Équipe** → **Ajouter**:

1. **Me. Jean-Baptiste ADJIBI**
   - Rôle: "Associé Principal - Droit des Affaires"
   - Bio: "Plus de 15 ans d'expérience en droit des affaires et corporate."

2. **Me. Marie KOSSOU**
   - Rôle: "Avocate Associée - Droit Immobilier"
   - Bio: "Spécialiste en droit immobilier avec une expertise reconnue."

3. **Me. Serge HOUNKANRIN**
   - Rôle: "Avocat - Droit du Travail"
   - Bio: "Expert en droit social et relations collectives du travail."

4. **Me. Claudine AGOSSOU**
   - Rôle: "Avocate - Droit Fiscal"
   - Bio: "Spécialiste en fiscalité d'entreprise et contentieux fiscal."

---

## 🎨 Interface Admin

L'interface admin vous permet de gérer facilement:

- ✅ Services juridiques
- ✅ Membres de l'équipe
- ✅ Étapes du processus
- ✅ Témoignages clients
- ✅ Annonces
- ✅ Messages reçus
- ✅ Consultations demandées
- ✅ Votre profil (changer mot de passe)

---

## 💡 Conseil

Commencez par ajouter 2-3 éléments de chaque catégorie pour tester, puis complétez progressivement avec vos vraies données.

---

**C'est beaucoup plus simple que le seed automatique et vous gardez le contrôle total !** 🎯
