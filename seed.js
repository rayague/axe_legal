import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp, deleteDoc, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Configuration Firebase
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

async function clearCollection(collectionName) {
  const snapshot = await getDocs(collection(db, collectionName));
  for (const doc of snapshot.docs) {
    await deleteDoc(doc.ref);
  }
}

async function seedDatabase() {
  try {
    console.log('🔐 Connexion à Firebase...');
    await signInWithEmailAndPassword(auth, 'admin@axelegal.bj', 'admin123');
    console.log('✅ Connecté avec succès !\n');

    // Supprimer les anciennes données
    console.log('�️  Suppression des anciennes données...');
    await clearCollection('services');
    await clearCollection('team');
    await clearCollection('processes');
    await clearCollection('testimonials');
    await clearCollection('announcements');
    console.log('✅ Anciennes données supprimées\n');

    // Services
    console.log('📦 Ajout des services...');
    const services = [
      {
        title: 'Droit des Affaires',
        slug: 'droit-des-affaires',
        icon: 'Briefcase',
        shortDescription: 'Accompagnement stratégique et juridique complet des entreprises à chaque étape de leur développement.',
        description: 'Accompagnement stratégique et juridique complet des entreprises à chaque étape de leur développement, de la création à la transmission, en passant par la croissance.',
        features: [
          'Création et immatriculation de sociétés (SARL, SA, SAS, SCI, GIE)',
          'Rédaction et révision des statuts juridiques',
          'Gouvernance d\'entreprise et conseil aux dirigeants',
          'Opérations de fusions-acquisitions et due diligence',
          'Négociation et rédaction de contrats commerciaux complexes',
          'Pactes d\'actionnaires et conventions de partenariat',
          'Restructuration et transmission d\'entreprises',
          'Propriété intellectuelle et protection des marques',
          'Conformité réglementaire et mise en conformité OHADA',
          'Accompagnement dans les levées de fonds et augmentations de capital'
        ],
        benefits: [
          'Sécurisation juridique complète de vos opérations',
          'Optimisation de la structure juridique',
          'Accompagnement personnalisé par des experts'
        ],
        category: 'Droit des affaires',
        pricing: 'Sur devis',
        duration: 'Variable selon le projet',
        order: 1,
        seoTitle: 'Droit des Affaires - Cabinet Axe Legal',
        seoDescription: 'Expert en droit des affaires pour accompagner votre entreprise',
        keywords: ['droit des affaires', 'création société', 'fusion acquisition'],
        createdAt: Timestamp.now()
      },
      {
        title: 'Fiscalité & Optimisation',
        slug: 'fiscalite-optimisation',
        icon: 'Calculator',
        shortDescription: 'Conseil fiscal stratégique et défense active de vos intérêts face à l\'administration fiscale.',
        description: 'Conseil fiscal stratégique et défense active de vos intérêts face à l\'administration fiscale, avec une approche proactive d\'optimisation et de sécurisation fiscale.',
        features: [
          'Audit fiscal et diagnostic de la situation fiscale',
          'Optimisation fiscale des entreprises et des particuliers',
          'Conseil en fiscalité internationale et prix de transfert',
          'Assistance lors des contrôles fiscaux et douaniers',
          'Défense et représentation en cas de redressement fiscal',
          'Réclamations contentieuses et recours hiérarchiques',
          'Négociation de transactions avec l\'administration',
          'Régularisation de situations fiscales complexes',
          'Conseils en TVA, impôt sur les sociétés et impôt sur le revenu',
          'Planification successorale et fiscalité des donations'
        ],
        benefits: [
          'Optimisation de votre charge fiscale',
          'Sécurisation face aux contrôles',
          'Expertise en fiscalité internationale'
        ],
        category: 'Droit fiscal',
        pricing: '150€ - 300€/h',
        duration: '1h - plusieurs mois',
        order: 2,
        seoTitle: 'Fiscalité et Optimisation Fiscale - Axe Legal',
        seoDescription: 'Optimisez votre fiscalité avec nos experts',
        keywords: ['fiscalité', 'optimisation fiscale', 'contrôle fiscal'],
        createdAt: Timestamp.now()
      },
      {
        title: 'Droit Immobilier & Foncier',
        slug: 'droit-immobilier-foncier',
        icon: 'Home',
        shortDescription: 'Sécurisation juridique complète de vos projets immobiliers et fonciers.',
        description: 'Sécurisation juridique complète de vos projets immobiliers et fonciers, de l\'acquisition à la cession, avec une expertise approfondie du droit foncier.',
        features: [
          'Vérification et purge des titres fonciers',
          'Due diligence immobilière et audits fonciers',
          'Rédaction d\'actes authentiques de vente et d\'acquisition',
          'Assistance lors des bornages et immatriculations foncières',
          'Négociation et rédaction de baux commerciaux et d\'habitation',
          'Gestion des copropriétés et règlements de copropriété',
          'Contentieux fonciers et résolution des litiges de propriété',
          'Droit de l\'urbanisme et permis de construire',
          'Montage juridique de projets immobiliers complexes',
          'Promotion immobilière et VEFA'
        ],
        benefits: [
          'Sécurisation de vos acquisitions',
          'Résolution des litiges fonciers',
          'Accompagnement de A à Z'
        ],
        category: 'Droit immobilier',
        pricing: 'Sur devis',
        duration: '2 semaines - 6 mois',
        order: 3,
        seoTitle: 'Droit Immobilier et Foncier - Axe Legal',
        seoDescription: 'Expert en droits immobiliers et fonciers',
        keywords: ['droit immobilier', 'droit foncier', 'acquisition immobilière'],
        createdAt: Timestamp.now()
      },
      {
        title: 'Droit du Travail & Relations Sociales',
        slug: 'droit-travail-relations-sociales',
        icon: 'Users',
        shortDescription: 'Accompagnement complet en droit social pour optimiser la gestion des ressources humaines.',
        description: 'Accompagnement complet en droit social pour optimiser la gestion des ressources humaines et prévenir les risques sociaux, tout en assurant la conformité avec le Code du Travail.',
        features: [
          'Rédaction et révision de contrats de travail (CDD, CDI, stages)',
          'Élaboration de règlements intérieurs et notes de service',
          'Conseil en gestion des relations individuelles et collectives',
          'Assistance dans les procédures disciplinaires et licenciements',
          'Négociation d\'accords collectifs et conventions d\'entreprise',
          'Conseil en restructuration et plans sociaux',
          'Représentation devant les juridictions du travail',
          'Audit social et mise en conformité avec la législation',
          'Gestion des relations avec l\'Inspection du Travail',
          'Formation des DRH et managers aux obligations sociales'
        ],
        benefits: [
          'Conformité avec le Code du Travail',
          'Prévention des risques sociaux',
          'Défense de vos intérêts'
        ],
        category: 'Droit du travail',
        pricing: '200€/h',
        duration: '1h - plusieurs semaines',
        order: 4,
        seoTitle: 'Droit du Travail - Cabinet Axe Legal',
        seoDescription: 'Expert en droit du travail et relations sociales',
        keywords: ['droit du travail', 'contrat de travail', 'licenciement'],
        createdAt: Timestamp.now()
      },
      {
        title: 'Recouvrement de Créances',
        slug: 'recouvrement-creances',
        icon: 'Coins',
        shortDescription: 'Stratégie efficace et personnalisée de recouvrement de vos créances impayées.',
        description: 'Stratégie efficace et personnalisée de recouvrement de vos créances impayées, privilégiant une approche amiable avant d\'envisager les voies judiciaires.',
        features: [
          'Phase amiable : mises en demeure et négociations directes',
          'Élaboration de plans d\'apurement et échéanciers de paiement',
          'Recouvrement judiciaire : injonctions de payer et référés-provision',
          'Procédures d\'exécution forcée et saisies conservatoires',
          'Saisie-attribution, saisie-vente et saisie immobilière',
          'Recouvrement de créances commerciales, civiles et fiscales',
          'Contentieux des impayés et suivi des procédures collectives',
          'Négociation avec les débiteurs défaillants',
          'Constitution de garanties et sûretés',
          'Conseil en prévention des impayés et sécurisation des transactions'
        ],
        benefits: [
          'Récupération rapide de vos créances',
          'Approche amiable privilégiée',
          'Expertise judiciaire en dernier recours'
        ],
        category: 'Contentieux',
        pricing: 'Pourcentage sur créances récupérées',
        duration: '1 mois - 1 an',
        order: 5,
        seoTitle: 'Recouvrement de Créances - Axe Legal',
        seoDescription: 'Récupérez vos créances impayées efficacement',
        keywords: ['recouvrement créances', 'impayés', 'contentieux'],
        createdAt: Timestamp.now()
      },
      {
        title: 'Marchés Publics & Droit Administratif',
        slug: 'marches-publics-droit-administratif',
        icon: 'FileText',
        shortDescription: 'Expertise pointue en droit des marchés publics et contentieux administratif.',
        description: 'Expertise pointue en droit des marchés publics et contentieux administratif pour accompagner entreprises et collectivités dans leurs relations avec l\'administration.',
        features: [
          'Conseil et assistance dans la préparation des offres publiques',
          'Analyse des dossiers d\'appel d\'offres (DAO) et des clauses',
          'Rédaction des mémoires techniques et offres financières',
          'Recours précontractuels et référés pré-contractuels',
          'Contestation des décisions d\'attribution et recours en annulation',
          'Assistance dans l\'exécution et le suivi des marchés publics',
          'Contentieux des pénalités et résiliation de marchés',
          'Conseil en droit administratif général et contentieux administratif',
          'Représentation devant les juridictions administratives',
          'Formation aux procédures de passation des marchés publics'
        ],
        benefits: [
          'Maximisation de vos chances de succès',
          'Conformité réglementaire garantie',
          'Défense de vos intérêts'
        ],
        category: 'Droit administratif',
        pricing: 'Sur devis',
        duration: 'Variable',
        order: 6,
        seoTitle: 'Marchés Publics et Droit Administratif - Axe Legal',
        seoDescription: 'Expert en marchés publics et droit administratif',
        keywords: ['marchés publics', 'droit administratif', 'appel d\'offres'],
        createdAt: Timestamp.now()
      }
    ];

    for (const service of services) {
      const docRef = await addDoc(collection(db, 'services'), service);
      console.log(`  ✅ ${service.title}`);
    }

    // Équipe
    console.log('\n👥 Ajout des membres de l\'équipe...');
    const team = [
      {
        name: 'Me. Jean-Baptiste ADJIBI',
        role: 'Associé Principal - Droit des Affaires',
        bio: 'Plus de 15 ans d\'expérience en droit des affaires et corporate. Diplômé de l\'Université Paris 1 Panthéon-Sorbonne.',
        image: 'https://ui-avatars.com/api/?name=Jean+Baptiste+ADJIBI&size=400&background=1e40af&color=fff&bold=true',
        createdAt: Timestamp.now()
      },
      {
        name: 'Me. Marie KOSSOU',
        role: 'Juriste Associée - Droit Immobilier',
        bio: 'Spécialiste en droit immobilier avec une expertise reconnue en transactions complexes et contentieux.',
        image: 'https://ui-avatars.com/api/?name=Marie+KOSSOU&size=400&background=7c3aed&color=fff&bold=true',
        createdAt: Timestamp.now()
      },
      {
        name: 'Me. Serge HOUNKANRIN',
        role: 'Juriste - Droit du Travail',
        bio: 'Expert en droit social et relations collectives du travail. Formé en droit à Paris.',
        image: 'https://ui-avatars.com/api/?name=Serge+HOUNKANRIN&size=400&background=ea580c&color=fff&bold=true',
        createdAt: Timestamp.now()
      },
      {
        name: 'Me. Claudine AGOSSOU',
        role: 'Juriste - Droit Fiscal',
        bio: 'Spécialiste en fiscalité d\'entreprise et contentieux fiscal. Master 2 Droit Fiscal - Université de Bordeaux.',
        image: 'https://ui-avatars.com/api/?name=Claudine+AGOSSOU&size=400&background=059669&color=fff&bold=true',
        createdAt: Timestamp.now()
      }
    ];

    for (const member of team) {
      await addDoc(collection(db, 'team'), member);
      console.log(`  ✅ ${member.name}`);
    }

    // Processus
    console.log('\n� Ajout des étapes du processus...');
    const processes = [
      {
        title: 'Consultation Initiale',
        description: 'Analyse de votre situation et évaluation de vos besoins juridiques lors d\'un entretien confidentiel.',
        order: 1,
        createdAt: Timestamp.now()
      },
      {
        title: 'Étude du Dossier',
        description: 'Examen approfondi des documents et recherches juridiques nécessaires à votre affaire.',
        order: 2,
        createdAt: Timestamp.now()
      },
      {
        title: 'Stratégie Juridique',
        description: 'Élaboration d\'une stratégie adaptée et présentation des options disponibles avec leurs implications.',
        order: 3,
        createdAt: Timestamp.now()
      },
      {
        title: 'Mise en Œuvre',
        description: 'Exécution des actions juridiques : rédaction, négociation, représentation devant les juridictions.',
        order: 4,
        createdAt: Timestamp.now()
      },
      {
        title: 'Suivi et Accompagnement',
        description: 'Suivi régulier de l\'évolution de votre dossier et ajustements si nécessaire jusqu\'à sa conclusion.',
        order: 5,
        createdAt: Timestamp.now()
      }
    ];

    for (const process of processes) {
      await addDoc(collection(db, 'processes'), process);
      console.log(`  ✅ ${process.title}`);
    }

    // Témoignages
    console.log('\n� Ajout des témoignages...');
    const testimonials = [
      {
        name: 'Sophie MENSAH',
        role: 'Directrice Générale, SARL TechBénin',
        content: 'Axe Legal nous a accompagnés dans la restructuration de notre entreprise avec professionnalisme et réactivité. Leur expertise en droit des affaires est remarquable.',
        rating: 5,
        image: 'https://ui-avatars.com/api/?name=Sophie+MENSAH&size=200&background=3b82f6&color=fff',
        createdAt: Timestamp.now()
      },
      {
        name: 'Ibrahim TOURÉ',
        role: 'Promoteur Immobilier',
        content: 'Grâce à Me. KOSSOU, notre transaction immobilière complexe s\'est déroulée sans encombre. Un service juridique de qualité exceptionnelle.',
        rating: 5,
        image: 'https://ui-avatars.com/api/?name=Ibrahim+TOURE&size=200&background=ec4899&color=fff',
        createdAt: Timestamp.now()
      },
      {
        name: 'Marie-Claire DOSSOU',
        role: 'Salariée',
        content: 'Me. HOUNKANRIN a défendu mes droits avec acharnement lors de mon litige prud\'homal. Je recommande vivement ce cabinet.',
        rating: 5,
        image: 'https://ui-avatars.com/api/?name=Marie+Claire+DOSSOU&size=200&background=f59e0b&color=fff',
        createdAt: Timestamp.now()
      },
      {
        name: 'Patrick AKPO',
        role: 'Chef d\'Entreprise',
        content: 'L\'équipe d\'Axe Legal a optimisé notre fiscalité d\'entreprise tout en respectant scrupuleusement la réglementation. Des experts de confiance.',
        rating: 5,
        image: 'https://ui-avatars.com/api/?name=Patrick+AKPO&size=200&background=8b5cf6&color=fff',
        createdAt: Timestamp.now()
      }
    ];

    for (const testimonial of testimonials) {
      await addDoc(collection(db, 'testimonials'), testimonial);
      console.log(`  ✅ ${testimonial.name}`);
    }

    // Annonces
    console.log('\n📢 Ajout des annonces...');
    const announcements = [
      {
        title: 'Nouveau: Service de Médiation',
        content: 'Axe Legal propose désormais des services de médiation pour résoudre vos conflits à l\'amiable, de manière rapide et confidentielle.',
        type: 'info',
        createdAt: Timestamp.now()
      },
      {
        title: 'Consultation Gratuite - Mois de Décembre',
        content: 'Profitez d\'une consultation gratuite de 30 minutes pour toute nouvelle demande reçue avant le 31 décembre 2025.',
        type: 'success',
        createdAt: Timestamp.now()
      }
    ];

    for (const announcement of announcements) {
      await addDoc(collection(db, 'announcements'), announcement);
      console.log(`  ✅ ${announcement.title}`);
    }

    console.log('\n🎉 TERMINÉ ! Toutes les données complètes ont été ajoutées.');
    console.log('\n📊 Résumé:');
    console.log(`   ✅ ${services.length} services`);
    console.log(`   ✅ ${team.length} membres d\'équipe`);
    console.log(`   ✅ ${processes.length} étapes de processus`);
    console.log(`   ✅ ${testimonials.length} témoignages`);
    console.log(`   ✅ ${announcements.length} annonces`);
    console.log('\n🚀 Rafraîchissez votre application pour voir toutes les données !');

  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
  }
}

seedDatabase();
