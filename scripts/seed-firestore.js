import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc, Timestamp } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDPdKaODMcfT8YsHR1G2i8JP47v2vF2NZA",
  authDomain: "axe-legal-f91cd.firebaseapp.com",
  projectId: "axe-legal-f91cd",
  storageBucket: "axe-legal-f91cd.firebasestorage.app",
  messagingSenderId: "164833152543",
  appId: "1:164833152543:web:5ba9acf19a2242126bcf2a",
  measurementId: "G-LT2697MYWX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Données initiales
const seedData = {
  services: [
    {
      title: "Droit des Affaires",
      description: "Accompagnement juridique complet pour vos entreprises : création, restructuration, contrats commerciaux, fusions-acquisitions.",
      icon: "briefcase",
      createdAt: Timestamp.now()
    },
    {
      title: "Droit Immobilier",
      description: "Conseil et assistance dans vos transactions immobilières, baux commerciaux et résidentiels, copropriété.",
      icon: "home",
      createdAt: Timestamp.now()
    },
    {
      title: "Droit du Travail",
      description: "Défense de vos droits en matière de contrats de travail, licenciement, harcèlement et conflits collectifs.",
      icon: "users",
      createdAt: Timestamp.now()
    },
    {
      title: "Droit Fiscal",
      description: "Optimisation fiscale, contentieux fiscal, déclarations et conseils en matière de fiscalité des entreprises et particuliers.",
      icon: "calculator",
      createdAt: Timestamp.now()
    }
  ],

  team: [
    {
      name: "Me. Jean-Baptiste ADJIBI",
      role: "Associé Principal - Droit des Affaires",
      bio: "Plus de 15 ans d'expérience en droit des affaires et corporate. Diplômé de l'Université Paris 1 Panthéon-Sorbonne.",
      image: "/assets/images/team-leader.jpg",
      createdAt: Timestamp.now()
    },
    {
      name: "Me. Marie KOSSOU",
      role: "Avocate Associée - Droit Immobilier",
      bio: "Spécialiste en droit immobilier avec une expertise reconnue en transactions complexes et contentieux.",
      image: "/assets/images/team-legal.jpg",
      createdAt: Timestamp.now()
    },
    {
      name: "Me. Serge HOUNKANRIN",
      role: "Avocat - Droit du Travail",
      bio: "Expert en droit social et relations collectives du travail. Formé à l'École des Avocats de Paris.",
      image: "/assets/images/team-fiscal.jpg",
      createdAt: Timestamp.now()
    },
    {
      name: "Me. Claudine AGOSSOU",
      role: "Avocate - Droit Fiscal",
      bio: "Spécialiste en fiscalité d'entreprise et contentieux fiscal. Master 2 Droit Fiscal - Université de Bordeaux.",
      image: "/assets/images/team-finance.jpg",
      createdAt: Timestamp.now()
    }
  ],

  process: [
    {
      title: "Consultation Initiale",
      description: "Analyse de votre situation et évaluation de vos besoins juridiques lors d'un entretien confidentiel.",
      order: 1,
      createdAt: Timestamp.now()
    },
    {
      title: "Étude du Dossier",
      description: "Examen approfondi des documents et recherches juridiques nécessaires à votre affaire.",
      order: 2,
      createdAt: Timestamp.now()
    },
    {
      title: "Stratégie Juridique",
      description: "Élaboration d'une stratégie adaptée et présentation des options disponibles avec leurs implications.",
      order: 3,
      createdAt: Timestamp.now()
    },
    {
      title: "Mise en Œuvre",
      description: "Exécution des actions juridiques : rédaction, négociation, représentation devant les juridictions.",
      order: 4,
      createdAt: Timestamp.now()
    },
    {
      title: "Suivi et Accompagnement",
      description: "Suivi régulier de l'évolution de votre dossier et ajustements si nécessaire jusqu'à sa conclusion.",
      order: 5,
      createdAt: Timestamp.now()
    }
  ],

  testimonials: [
    {
      name: "Sophie MENSAH",
      role: "Directrice Générale, SARL TechBénin",
      content: "Axe Legal nous a accompagnés dans la restructuration de notre entreprise avec professionnalisme et réactivité. Leur expertise en droit des affaires est remarquable.",
      rating: 5,
      createdAt: Timestamp.now()
    },
    {
      name: "Ibrahim TOURÉ",
      role: "Promoteur Immobilier",
      content: "Grâce à Me. KOSSOU, notre transaction immobilière complexe s'est déroulée sans encombre. Un service juridique de qualité exceptionnelle.",
      rating: 5,
      createdAt: Timestamp.now()
    },
    {
      name: "Marie-Claire DOSSOU",
      role: "Salariée",
      content: "Me. HOUNKANRIN a défendu mes droits avec acharnement lors de mon litige prud'homal. Je recommande vivement ce cabinet.",
      rating: 5,
      createdAt: Timestamp.now()
    },
    {
      name: "Patrick AKPO",
      role: "Chef d'Entreprise",
      content: "L'équipe d'Axe Legal a optimisé notre fiscalité d'entreprise tout en respectant scrupuleusement la réglementation. Des experts de confiance.",
      rating: 5,
      createdAt: Timestamp.now()
    }
  ],

  announcements: [
    {
      title: "Nouveau: Service de Médiation",
      content: "Axe Legal propose désormais des services de médiation pour résoudre vos conflits à l'amiable, de manière rapide et confidentielle.",
      type: "info",
      createdAt: Timestamp.now()
    },
    {
      title: "Consultation Gratuite - Mois de Décembre",
      content: "Profitez d'une consultation gratuite de 30 minutes pour toute nouvelle demande reçue avant le 31 décembre 2025.",
      type: "success",
      createdAt: Timestamp.now()
    }
  ],

  settings: {
    business_hours: {
      weekdays: "08:00 - 18:00",
      saturday: "09:00 - 13:00",
      sunday: "Fermé"
    }
  }
};

async function seedDatabase() {
  console.log('🌱 Début du seed de la base de données...\n');

  try {
    // 1. Créer l'utilisateur admin
    console.log('👤 Création de l\'utilisateur admin...');
    let adminUid;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        'admin@axelegal.bj',
        'admin123'
      );
      adminUid = userCredential.user.uid;
      console.log('✅ Utilisateur admin créé avec UID:', adminUid);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('ℹ️  Utilisateur admin existe déjà');
        // Si l'utilisateur existe, on suppose qu'il a déjà un UID
        // Pour le seed, on va créer le document users avec un ID générique
        adminUid = 'admin-user-id';
      } else {
        throw error;
      }
    }

    // Ajouter les données admin dans Firestore
    await setDoc(doc(db, 'users', adminUid), {
      email: 'admin@axelegal.bj',
      name: 'Administrateur',
      role: 'admin',
      createdAt: Timestamp.now()
    });
    console.log('✅ Données admin ajoutées dans Firestore\n');

    // 2. Services
    console.log('📋 Ajout des services...');
    for (const service of seedData.services) {
      await addDoc(collection(db, 'services'), service);
    }
    console.log(`✅ ${seedData.services.length} services ajoutés\n`);

    // 3. Équipe
    console.log('👥 Ajout des membres de l\'équipe...');
    for (const member of seedData.team) {
      await addDoc(collection(db, 'team'), member);
    }
    console.log(`✅ ${seedData.team.length} membres ajoutés\n`);

    // 4. Processus
    console.log('⚙️ Ajout des étapes du processus...');
    for (const step of seedData.process) {
      await addDoc(collection(db, 'process'), step);
    }
    console.log(`✅ ${seedData.process.length} étapes ajoutées\n`);

    // 5. Témoignages
    console.log('💬 Ajout des témoignages...');
    for (const testimonial of seedData.testimonials) {
      await addDoc(collection(db, 'testimonials'), testimonial);
    }
    console.log(`✅ ${seedData.testimonials.length} témoignages ajoutés\n`);

    // 6. Annonces
    console.log('📢 Ajout des annonces...');
    for (const announcement of seedData.announcements) {
      await addDoc(collection(db, 'announcements'), announcement);
    }
    console.log(`✅ ${seedData.announcements.length} annonces ajoutées\n`);

    // 7. Paramètres
    console.log('⚙️ Configuration des paramètres...');
    await setDoc(doc(db, 'settings', 'business_hours'), seedData.settings.business_hours);
    console.log('✅ Horaires d\'ouverture configurés\n');

    console.log('🎉 SEED TERMINÉ AVEC SUCCÈS !\n');
    console.log('📊 Résumé:');
    console.log(`   - 1 utilisateur admin`);
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
    process.exit(1);
  }
}

// Exécuter le seed
seedDatabase();
