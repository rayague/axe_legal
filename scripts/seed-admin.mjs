import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Initialiser Firebase Admin sans clé de service (utilise les credentials par défaut)
// Pour l'environnement local, utilisez: firebase emulators:start
// Ou connectez-vous avec: firebase login

const app = admin.initializeApp({
  projectId: 'axe-legal-f91cd'
});

const db = admin.firestore();
const auth = admin.auth();

// Données initiales
const seedData = {
  services: [
    {
      title: "Droit des Affaires",
      description: "Accompagnement juridique complet pour vos entreprises : création, restructuration, contrats commerciaux, fusions-acquisitions.",
      icon: "briefcase",
      createdAt: admin.firestore.Timestamp.now()
    },
    {
      title: "Droit Immobilier",
      description: "Conseil et assistance dans vos transactions immobilières, baux commerciaux et résidentiels, copropriété.",
      icon: "home",
      createdAt: admin.firestore.Timestamp.now()
    },
    {
      title: "Droit du Travail",
      description: "Défense de vos droits en matière de contrats de travail, licenciement, harcèlement et conflits collectifs.",
      icon: "users",
      createdAt: admin.firestore.Timestamp.now()
    },
    {
      title: "Droit Fiscal",
      description: "Optimisation fiscale, contentieux fiscal, déclarations et conseils en matière de fiscalité des entreprises et particuliers.",
      icon: "calculator",
      createdAt: admin.firestore.Timestamp.now()
    },
    {
      title: "Droit de la Famille & Successions",
      slug: "droit-de-la-famille-successions",
      icon: "Heart",
      category: "Droit de la famille",
      shortDescription: "Accompagnement juridique personnalisé pour la protection des personnes, des biens et des liens familiaux, dans le respect du droit béninois.",
      description: "Accompagnement juridique personnalisé pour la protection des personnes, des biens et des liens familiaux, dans le respect du droit béninois.",
      features: [
        "Conseil et assistance en matière de mariage (régimes matrimoniaux, droits et obligations des époux)",
        "Divorce et séparation : accompagnement juridique et conseil à la protection des intérêts des parties",
        "Successions : assistance à l’ouverture, l’organisation et le règlement successoral",
        "Assistance dans les démarches administratives et judiciaires liées au droit de la famille"
      ],
      benefits: [],
      pricing: "Sur devis",
      duration: "Variable selon le dossier",
      order: 50,
      createdAt: admin.firestore.Timestamp.now()
    }
  ],

  team: [
    {
      name: "Me. Jean-Baptiste ADJIBI",
      role: "Associé Principal - Droit des Affaires",
      bio: "Plus de 15 ans d'expérience en droit des affaires et corporate. Diplômé de l'Université Paris 1 Panthéon-Sorbonne.",
      image: "/assets/images/team-leader.jpg",
      createdAt: admin.firestore.Timestamp.now()
    },
    {
      name: "Me. Marie KOSSOU",
      role: "Avocate Associée - Droit Immobilier",
      bio: "Spécialiste en droit immobilier avec une expertise reconnue en transactions complexes et contentieux.",
      image: "/assets/images/team-legal.jpg",
      createdAt: admin.firestore.Timestamp.now()
    },
    {
      name: "Me. Serge HOUNKANRIN",
      role: "Avocat - Droit du Travail",
      bio: "Expert en droit social et relations collectives du travail. Formé à l'École des Avocats de Paris.",
      image: "/assets/images/team-fiscal.jpg",
      createdAt: admin.firestore.Timestamp.now()
    },
    {
      name: "Me. Claudine AGOSSOU",
      role: "Avocate - Droit Fiscal",
      bio: "Spécialiste en fiscalité d'entreprise et contentieux fiscal. Master 2 Droit Fiscal - Université de Bordeaux.",
      image: "/assets/images/team-finance.jpg",
      createdAt: admin.firestore.Timestamp.now()
    }
  ],

  process: [
    {
      title: "Consultation Initiale",
      description: "Analyse de votre situation et évaluation de vos besoins juridiques lors d'un entretien confidentiel.",
      order: 1,
      createdAt: admin.firestore.Timestamp.now()
    },
    {
      title: "Étude du Dossier",
      description: "Examen approfondi des documents et recherches juridiques nécessaires à votre affaire.",
      order: 2,
      createdAt: admin.firestore.Timestamp.now()
    },
    {
      title: "Stratégie Juridique",
      description: "Élaboration d'une stratégie adaptée et présentation des options disponibles avec leurs implications.",
      order: 3,
      createdAt: admin.firestore.Timestamp.now()
    },
    {
      title: "Mise en Œuvre",
      description: "Exécution des actions juridiques : rédaction, négociation, représentation devant les juridictions.",
      order: 4,
      createdAt: admin.firestore.Timestamp.now()
    },
    {
      title: "Suivi et Accompagnement",
      description: "Suivi régulier de l'évolution de votre dossier et ajustements si nécessaire jusqu'à sa conclusion.",
      order: 5,
      createdAt: admin.firestore.Timestamp.now()
    }
  ],

  testimonials: [
    {
      name: "Sophie MENSAH",
      role: "Directrice Générale, SARL TechBénin",
      content: "Axe Legal nous a accompagnés dans la restructuration de notre entreprise avec professionnalisme et réactivité. Leur expertise en droit des affaires est remarquable.",
      rating: 5,
      createdAt: admin.firestore.Timestamp.now()
    },
    {
      name: "Ibrahim TOURÉ",
      role: "Promoteur Immobilier",
      content: "Grâce à Me. KOSSOU, notre transaction immobilière complexe s'est déroulée sans encombre. Un service juridique de qualité exceptionnelle.",
      rating: 5,
      createdAt: admin.firestore.Timestamp.now()
    },
    {
      name: "Marie-Claire DOSSOU",
      role: "Salariée",
      content: "Me. HOUNKANRIN a défendu mes droits avec acharnement lors de mon litige prud'homal. Je recommande vivement ce cabinet.",
      rating: 5,
      createdAt: admin.firestore.Timestamp.now()
    },
    {
      name: "Patrick AKPO",
      role: "Chef d'Entreprise",
      content: "L'équipe d'Axe Legal a optimisé notre fiscalité d'entreprise tout en respectant scrupuleusement la réglementation. Des experts de confiance.",
      rating: 5,
      createdAt: admin.firestore.Timestamp.now()
    }
  ],

  announcements: [
    {
      title: "Nouveau: Service de Médiation",
      content: "Axe Legal propose désormais des services de médiation pour résoudre vos conflits à l'amiable, de manière rapide et confidentielle.",
      type: "info",
      createdAt: admin.firestore.Timestamp.now()
    },
    {
      title: "Consultation Gratuite - Mois de Décembre",
      content: "Profitez d'une consultation gratuite de 30 minutes pour toute nouvelle demande reçue avant le 31 décembre 2025.",
      type: "success",
      createdAt: admin.firestore.Timestamp.now()
    }
  ]
};

async function seedDatabase() {
  console.log('🌱 Début du seed de la base de données Firestore...\n');

  try {
    // 1. Créer l'utilisateur admin
    console.log('👤 Création de l\'utilisateur admin...');
    let adminUid;
    
    try {
      const userRecord = await auth.createUser({
        email: 'admin@axelegal.bj',
        password: 'admin123',
        displayName: 'Administrateur'
      });
      adminUid = userRecord.uid;
      console.log('✅ Utilisateur admin créé avec UID:', adminUid);
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log('ℹ️  Utilisateur admin existe déjà');
        const user = await auth.getUserByEmail('admin@axelegal.bj');
        adminUid = user.uid;
        console.log('   UID existant:', adminUid);
      } else {
        throw error;
      }
    }

    // Ajouter/Mettre à jour les données admin dans Firestore
    await db.collection('users').doc(adminUid).set({
      email: 'admin@axelegal.bj',
      name: 'Administrateur',
      role: 'admin',
      createdAt: admin.firestore.Timestamp.now()
    }, { merge: true });
    console.log('✅ Données admin ajoutées dans Firestore\n');

    // 2. Services
    console.log('📋 Ajout des services...');
    const batch1 = db.batch();
    seedData.services.forEach(service => {
      const docRef = service.slug
        ? db.collection('services').doc(service.slug)
        : db.collection('services').doc();
      batch1.set(docRef, service);
    });
    await batch1.commit();
    console.log(`✅ ${seedData.services.length} services ajoutés\n`);

    // 3. Équipe
    console.log('👥 Ajout des membres de l\'équipe...');
    const batch2 = db.batch();
    seedData.team.forEach(member => {
      const docRef = db.collection('team').doc();
      batch2.set(docRef, member);
    });
    await batch2.commit();
    console.log(`✅ ${seedData.team.length} membres ajoutés\n`);

    // 4. Processus
    console.log('⚙️ Ajout des étapes du processus...');
    const batch3 = db.batch();
    seedData.process.forEach(step => {
      const docRef = db.collection('process').doc();
      batch3.set(docRef, step);
    });
    await batch3.commit();
    console.log(`✅ ${seedData.process.length} étapes ajoutées\n`);

    // 5. Témoignages
    console.log('💬 Ajout des témoignages...');
    const batch4 = db.batch();
    seedData.testimonials.forEach(testimonial => {
      const docRef = db.collection('testimonials').doc();
      batch4.set(docRef, testimonial);
    });
    await batch4.commit();
    console.log(`✅ ${seedData.testimonials.length} témoignages ajoutés\n`);

    // 6. Annonces
    console.log('📢 Ajout des annonces...');
    const batch5 = db.batch();
    seedData.announcements.forEach(announcement => {
      const docRef = db.collection('announcements').doc();
      batch5.set(docRef, announcement);
    });
    await batch5.commit();
    console.log(`✅ ${seedData.announcements.length} annonces ajoutées\n`);

    // 7. Paramètres
    console.log('⚙️ Configuration des paramètres...');
    await db.collection('settings').doc('business_hours').set({
      weekdays: "08:00 - 18:00",
      saturday: "09:00 - 13:00",
      sunday: "Fermé"
    });
    console.log('✅ Horaires d\'ouverture configurés\n');

    console.log('🎉 SEED TERMINÉ AVEC SUCCÈS !\n');
    console.log('📊 Résumé:');
    console.log(`   - 1 utilisateur admin (UID: ${adminUid})`);
    console.log(`   - ${seedData.services.length} services`);
    console.log(`   - ${seedData.team.length} membres d'équipe`);
    console.log(`   - ${seedData.process.length} étapes de processus`);
    console.log(`   - ${seedData.testimonials.length} témoignages`);
    console.log(`   - ${seedData.announcements.length} annonces`);
    console.log(`   - Paramètres configurés`);
    console.log('\n✨ Vous pouvez maintenant vous connecter avec:');
    console.log('   Email: admin@axelegal.bj');
    console.log('   Mot de passe: admin123');
    console.log('\n🌐 URL: https://axe-legal-f91cd.web.app/admin/login');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    console.error('\n💡 Assurez-vous d\'être connecté à Firebase:');
    console.error('   firebase login');
    console.error('\n💡 Ou utilisez une clé de service (service account key)');
    process.exit(1);
  }
}

// Exécuter le seed
seedDatabase();
