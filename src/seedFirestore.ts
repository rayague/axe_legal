/**
 * Script pour ajouter des données de test dans Firestore
 * 
 * COMMENT L'UTILISER :
 * 1. Ouvrez la console du navigateur (F12) sur votre page admin
 * 2. Copiez-collez tout ce code dans la console
 * 3. Appuyez sur Entrée
 * 4. Les données seront ajoutées automatiquement
 */

import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './lib/firebase';

export async function seedFirestoreData() {
  console.log('🌱 Démarrage du seed des données...');

  try {
    // ========== SERVICES ==========
    console.log('📦 Ajout des services...');
    const services = [
      {
        title: 'Droit des Affaires',
        description: 'Conseil et assistance juridique pour les entreprises, création de sociétés, contrats commerciaux',
        icon: 'Briefcase',
        createdAt: Timestamp.now()
      },
      {
        title: 'Droit Fiscal',
        description: 'Optimisation fiscale, contentieux fiscal, audits fiscaux et conformité',
        icon: 'DollarSign',
        createdAt: Timestamp.now()
      },
      {
        title: 'Droit Immobilier',
        description: 'Transactions immobilières, baux commerciaux, litiges fonciers',
        icon: 'Home',
        createdAt: Timestamp.now()
      },
      {
        title: 'Droit du Travail',
        description: 'Contrats de travail, licenciements, conflits employeur-employé',
        icon: 'Users',
        createdAt: Timestamp.now()
      },
      {
        title: 'Droit de la Famille',
        description: 'Divorces, successions, garde d\'enfants, régimes matrimoniaux',
        icon: 'Heart',
        createdAt: Timestamp.now()
      }
    ];

    for (const service of services) {
      await addDoc(collection(db, 'services'), service);
    }
    console.log('✅ Services ajoutés avec succès');

    // ========== ÉQUIPE ==========
    console.log('👥 Ajout des membres de l\'équipe...');
    const team = [
      {
        name: 'Me Jean Dupont',
        role: 'Juriste Senior - Droit des Affaires',
        bio: 'Plus de 15 ans d\'expérience en droit des affaires et fiscalité. Spécialisé dans les fusions-acquisitions.',
        image: 'https://ui-avatars.com/api/?name=Jean+Dupont&size=200&background=1e40af&color=fff',
        createdAt: Timestamp.now()
      },
      {
        name: 'Me Sophie Martin',
        role: 'Juriste - Droit Fiscal',
        bio: 'Experte en fiscalité des entreprises et optimisation fiscale. Diplômée HEC Paris.',
        image: 'https://ui-avatars.com/api/?name=Sophie+Martin&size=200&background=7c3aed&color=fff',
        createdAt: Timestamp.now()
      },
      {
        name: 'Me Pierre Kouassi',
        role: 'Juriste - Droit Immobilier',
        bio: 'Spécialiste en transactions immobilières et droit foncier depuis 10 ans.',
        image: 'https://ui-avatars.com/api/?name=Pierre+Kouassi&size=200&background=ea580c&color=fff',
        createdAt: Timestamp.now()
      },
      {
        name: 'Me Marie Diallo',
        role: 'Juriste - Droit du Travail',
        bio: 'Défense des droits des salariés et conseil aux entreprises en droit social.',
        image: 'https://ui-avatars.com/api/?name=Marie+Diallo&size=200&background=059669&color=fff',
        createdAt: Timestamp.now()
      }
    ];

    for (const member of team) {
      await addDoc(collection(db, 'team'), member);
    }
    console.log('✅ Équipe ajoutée avec succès');

    // ========== TÉMOIGNAGES ==========
    console.log('💬 Ajout des témoignages...');
    const testimonials = [
      {
        name: 'Amadou Bah',
        role: 'Directeur Général, ABC Sarl',
        content: 'Service exceptionnel ! L\'équipe a géré notre restructuration avec professionnalisme et efficacité. Je recommande vivement leurs services.',
        rating: 5,
        image: 'https://ui-avatars.com/api/?name=Amadou+Bah&size=200&background=3b82f6&color=fff',
        createdAt: Timestamp.now()
      },
      {
        name: 'Fatou Traoré',
        role: 'Entrepreneure',
        content: 'Excellents conseils pour la création de mon entreprise. Très à l\'écoute et disponibles. Un grand merci !',
        rating: 5,
        image: 'https://ui-avatars.com/api/?name=Fatou+Traore&size=200&background=ec4899&color=fff',
        createdAt: Timestamp.now()
      },
      {
        name: 'Ibrahim Sow',
        role: 'Propriétaire Immobilier',
        content: 'Mes litiges fonciers ont été résolus rapidement grâce à leur expertise. Service professionnel et résultats concrets.',
        rating: 5,
        image: 'https://ui-avatars.com/api/?name=Ibrahim+Sow&size=200&background=f59e0b&color=fff',
        createdAt: Timestamp.now()
      }
    ];

    for (const testimonial of testimonials) {
      await addDoc(collection(db, 'testimonials'), testimonial);
    }
    console.log('✅ Témoignages ajoutés avec succès');

    // ========== PROCESSUS ==========
    console.log('📋 Ajout des étapes du processus...');
    const processes = [
      {
        title: 'Consultation Initiale',
        description: 'Première rencontre pour comprendre vos besoins et analyser votre situation juridique',
        order: 1,
        createdAt: Timestamp.now()
      },
      {
        title: 'Analyse Approfondie',
        description: 'Étude détaillée de votre dossier et recherche de solutions juridiques adaptées',
        order: 2,
        createdAt: Timestamp.now()
      },
      {
        title: 'Stratégie Juridique',
        description: 'Élaboration d\'une stratégie sur-mesure et présentation des options disponibles',
        order: 3,
        createdAt: Timestamp.now()
      },
      {
        title: 'Mise en Œuvre',
        description: 'Exécution de la stratégie convenue avec un suivi régulier de l\'avancement',
        order: 4,
        createdAt: Timestamp.now()
      },
      {
        title: 'Suivi & Support',
        description: 'Accompagnement continu et support après la résolution de votre affaire',
        order: 5,
        createdAt: Timestamp.now()
      }
    ];

    for (const process of processes) {
      await addDoc(collection(db, 'processes'), process);
    }
    console.log('✅ Processus ajouté avec succès');

    // ========== ANNONCES ==========
    console.log('📢 Ajout des annonces...');
    const announcements = [
      {
        title: 'Nouvelle Ouverture',
        content: 'Notre cabinet ouvre ses portes ! Profitez de notre offre de lancement : première consultation gratuite.',
        type: 'success',
        createdAt: Timestamp.now()
      },
      {
        title: 'Horaires Spéciaux',
        content: 'Pendant les fêtes, nos horaires seront aménagés. Consultez notre page pour plus d\'informations.',
        type: 'info',
        createdAt: Timestamp.now()
      }
    ];

    for (const announcement of announcements) {
      await addDoc(collection(db, 'announcements'), announcement);
    }
    console.log('✅ Annonces ajoutées avec succès');

    console.log('🎉 SEED TERMINÉ ! Toutes les données ont été ajoutées avec succès.');
    console.log('📊 Résumé:');
    console.log(`   - ${services.length} services`);
    console.log(`   - ${team.length} membres d'équipe`);
    console.log(`   - ${testimonials.length} témoignages`);
    console.log(`   - ${processes.length} étapes de processus`);
    console.log(`   - ${announcements.length} annonces`);
    
    alert('✅ Données ajoutées avec succès ! Rafraîchissez la page.');

  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    alert('❌ Erreur lors de l\'ajout des données. Vérifiez la console.');
  }
}

// Auto-exécution si appelé directement
if (typeof window !== 'undefined') {
  console.log('Pour lancer le seed, tapez: seedFirestoreData()');
}
