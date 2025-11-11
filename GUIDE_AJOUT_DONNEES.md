# 📝 Guide Visuel - Ajouter les Données dans Firebase

## 🎯 Objectif
Ajouter rapidement du contenu dans votre base de données Firestore pour que le site affiche des informations.

---

## ✅ ÉTAPE PAR ÉTAPE (15 minutes max)

### 📋 Avant de commencer

1. Ouvrez ces 2 pages dans votre navigateur :
   - **Authentication** : https://console.firebase.google.com/project/axe-legal-f91cd/authentication/users
   - **Firestore** : https://console.firebase.google.com/project/axe-legal-f91cd/firestore/data

---

## 1️⃣ CRÉER L'UTILISATEUR ADMIN (2 min)

**Page : Authentication → Users**

1. Cliquez sur **"Add user"**
2. Remplissez :
   ```
   Email: admin@axelegal.bj
   Password: admin123
   ```
3. Cliquez **"Add user"**
4. ⚠️ **TRÈS IMPORTANT** : **COPIEZ L'UID** qui s'affiche
   - Il ressemble à : `kR8vN2mP4qXvZ2aB3cD4eF5g`
   - Collez-le dans un Notepad temporairement

---

## 2️⃣ CRÉER LE PROFIL ADMIN (3 min)

**Page : Firestore Database → Data**

1. Cliquez sur **"+ Start collection"**
2. Collection ID : `users`
3. Cliquez **"Next"**
4. Document ID : **COLLEZ L'UID** copié à l'étape 1
5. Ajoutez ces 4 champs (cliquez "+ Add field" pour chaque):

   | Field | Type | Value |
   |-------|------|-------|
   | `email` | string | `admin@axelegal.bj` |
   | `name` | string | `Administrateur` |
   | `role` | string | `admin` |
   | `createdAt` | timestamp | Cliquez sur l'icône horloge → "Now" |

6. Cliquez **"Save"**

✅ **Vous pouvez maintenant vous connecter à l'admin !**

---

## 3️⃣ AJOUTER UN SERVICE (exemple) (2 min)

Restez sur **Firestore Database → Data**

1. Cliquez sur **"+ Start collection"**
2. Collection ID : `services`
3. Cliquez **"Next"**
4. Document ID : Laissez vide (Auto-ID)
5. Ajoutez ces champs :

   | Field | Type | Value |
   |-------|------|-------|
   | `title` | string | `Droit des Affaires` |
   | `description` | string | `Accompagnement juridique complet pour vos entreprises : création, restructuration, contrats commerciaux.` |
   | `icon` | string | `briefcase` |
   | `createdAt` | timestamp | Now |

6. Cliquez **"Save"**

7. **Répétez pour ajouter plus de services** :
   - Cliquez sur la collection `services`
   - Cliquez **"+ Add document"**
   - Remplissez les champs
   - Save

**Services suggérés** :
- Droit Immobilier (icon: `home`)
- Droit du Travail (icon: `users`)
- Droit Fiscal (icon: `calculator`)

---

## 4️⃣ AJOUTER UN MEMBRE DE L'ÉQUIPE (2 min)

1. Cliquez sur **"+ Start collection"**
2. Collection ID : `team`
3. Cliquez **"Next"**
4. Document ID : Auto-ID
5. Ajoutez ces champs :

   | Field | Type | Value |
   |-------|------|-------|
   | `name` | string | `Me. Jean-Baptiste ADJIBI` |
   | `role` | string | `Associé Principal - Droit des Affaires` |
   | `bio` | string | `Plus de 15 ans d'expérience en droit des affaires et corporate.` |
   | `image` | string | `/assets/images/team-leader.jpg` |
   | `createdAt` | timestamp | Now |

6. **Save** et répétez pour d'autres membres

---

## 5️⃣ AJOUTER UN TÉMOIGNAGE (2 min)

1. **+ Start collection** → Collection ID : `testimonials`
2. Ajoutez ces champs :

   | Field | Type | Value |
   |-------|------|-------|
   | `name` | string | `Sophie MENSAH` |
   | `role` | string | `Directrice Générale, SARL TechBénin` |
   | `content` | string | `Axe Legal nous a accompagnés avec professionnalisme. Excellent service !` |
   | `rating` | number | `5` |
   | `createdAt` | timestamp | Now |

3. **Save**

---

## 6️⃣ AJOUTER UNE ANNONCE (2 min)

1. **+ Start collection** → Collection ID : `announcements`
2. Ajoutez ces champs :

   | Field | Type | Value |
   |-------|------|-------|
   | `title` | string | `Nouveau: Service de Médiation` |
   | `content` | string | `Axe Legal propose désormais des services de médiation.` |
   | `type` | string | `info` |
   | `createdAt` | timestamp | Now |

3. **Save**

---

## 7️⃣ VÉRIFIER (1 min)

1. Allez sur votre site : **https://axe-legal-f91cd.web.app**
2. Vous devriez voir les données ajoutées !
3. Allez sur l'admin : **https://axe-legal-f91cd.web.app/admin/login**
4. Connectez-vous : `admin@axelegal.bj` / `admin123`

---

## 🎯 RÉSUMÉ DES COLLECTIONS À CRÉER

| Collection | Combien ? | Obligatoire ? |
|------------|-----------|---------------|
| `users` | 1 document (admin) | ✅ OUI |
| `services` | 2-4 documents | ⭐ Recommandé |
| `team` | 2-4 documents | ⭐ Recommandé |
| `testimonials` | 2-3 documents | ⭐ Recommandé |
| `announcements` | 1-2 documents | 📌 Optionnel |
| `process` | 3-5 documents | 📌 Optionnel |

---

## 💡 ASTUCE

Une fois l'admin fonctionnel (étapes 1-2 terminées), vous pouvez **ajouter le reste depuis l'interface admin** au lieu de la console Firebase !

C'est beaucoup plus rapide et convivial ! 🎉

---

## 📊 Données complètes disponibles

Le fichier **`seed-data.json`** contient toutes les données prêtes à copier-coller si besoin.

---

## ✅ VOUS AVEZ TERMINÉ !

Votre site affiche maintenant du contenu professionnel ! 🚀

**Prochaine étape** : Personnalisez les données depuis l'admin !
