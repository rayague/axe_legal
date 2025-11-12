import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDr4hhQF4LgfUYP2iWH1TFfb1z-98SAZ3I",
  authDomain: "axe-legal-f91cd.firebaseapp.com",
  projectId: "axe-legal-f91cd",
  storageBucket: "axe-legal-f91cd.firebasestorage.app",
  messagingSenderId: "646489210267",
  appId: "1:646489210267:web:9dc0ad6e73c5e618f28e87"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const legalCategories = [
  {
    categoryId: "family",
    iconName: "Heart",
    title: "Droit de la Famille",
    description: "Divorce, garde d'enfants, pension alimentaire",
    color: "from-pink-500/10 to-pink-600/10",
    borderColor: "hover:border-pink-500/50",
    order: 1,
    guidanceTitle: "Divorce et Droit de la Famille",
    steps: [
      {
        title: "1. Consultation juridique initiale",
        description: "Rencontrez un avocat spécialisé en droit de la famille pour évaluer votre situation (régime matrimonial, biens, enfants)."
      },
      {
        title: "2. Tentative de conciliation",
        description: "Selon la loi, une tentative de conciliation amiable peut être requise avant toute procédure contentieuse."
      },
      {
        title: "3. Constitution du dossier",
        description: "Rassemblez tous les documents nécessaires : acte de mariage, livret de famille, justificatifs de revenus, inventaire des biens."
      },
      {
        title: "4. Dépôt de la requête",
        description: "Votre avocat dépose une requête en divorce auprès du tribunal compétent avec toutes les pièces justificatives."
      },
      {
        title: "5. Négociation des modalités",
        description: "Discussions sur la garde des enfants, pension alimentaire, partage des biens et prestation compensatoire."
      },
      {
        title: "6. Audience et jugement",
        description: "Présentation devant le juge qui statuera sur toutes les mesures définitives du divorce."
      }
    ],
    documents: [
      "Acte de mariage",
      "Livret de famille",
      "Justificatifs de revenus (3 derniers mois)",
      "Justificatifs de domicile",
      "Liste des biens communs et personnels",
      "Relevés bancaires",
      "Certificats de scolarité (si enfants)"
    ],
    timeline: "6 à 18 mois selon la complexité et le type de divorce",
    cost: "Variable selon le type de divorce (amiable ou contentieux)",
    warning: "La garde des enfants et leur intérêt supérieur sont prioritaires dans toute décision.",
    isActive: true
  },
  {
    categoryId: "real-estate",
    iconName: "Home",
    title: "Droit Immobilier",
    description: "Achat, vente, location, litiges fonciers",
    color: "from-blue-500/10 to-blue-600/10",
    borderColor: "hover:border-blue-500/50",
    order: 2,
    guidanceTitle: "Droit Immobilier",
    steps: [
      {
        title: "1. Vérification juridique du bien",
        description: "Contrôle du titre de propriété, vérification au registre foncier, absence de charges ou hypothèques."
      },
      {
        title: "2. Promesse ou compromis de vente",
        description: "Signature d'un avant-contrat qui engage juridiquement les parties (vendeur et acheteur)."
      },
      {
        title: "3. Constitution du dossier de financement",
        description: "Si nécessaire, obtention d'un prêt bancaire avec toutes les garanties requises."
      },
      {
        title: "4. Acte authentique",
        description: "Passage chez le notaire pour la signature de l'acte de vente définitif en présence des deux parties."
      },
      {
        title: "5. Enregistrement et publicité foncière",
        description: "Inscription de l'acte au registre foncier pour opposabilité aux tiers et sécurité juridique."
      },
      {
        title: "6. Remise des clés",
        description: "Transfert effectif de la propriété après paiement intégral et accomplissement des formalités."
      }
    ],
    documents: [
      "Titre foncier ou certificat de propriété",
      "Attestation de non-hypothèque",
      "Plan cadastral",
      "Quittances de taxes foncières",
      "Pièces d'identité",
      "Certificat de domicile",
      "Attestation de résidence"
    ],
    timeline: "2 à 6 mois selon la complexité du dossier",
    cost: "Frais de notaire (environ 10-15% du prix) + droits d'enregistrement",
    warning: "Toujours faire vérifier le titre de propriété par un professionnel avant tout engagement.",
    isActive: true
  },
  {
    categoryId: "business",
    iconName: "Briefcase",
    title: "Droit des Affaires",
    description: "Création d'entreprise, contrats commerciaux",
    color: "from-purple-500/10 to-purple-600/10",
    borderColor: "hover:border-purple-500/50",
    order: 3,
    guidanceTitle: "Droit des Affaires",
    steps: [
      {
        title: "1. Choix de la forme juridique",
        description: "Déterminez la structure adaptée : SARL, SA, SAS, entreprise individuelle, selon votre activité et vos besoins."
      },
      {
        title: "2. Rédaction des statuts",
        description: "Élaboration des statuts de l'entreprise définissant les règles de fonctionnement et de gouvernance."
      },
      {
        title: "3. Dépôt du capital social",
        description: "Ouverture d'un compte bancaire professionnel et dépôt du capital minimum requis."
      },
      {
        title: "4. Enregistrement au RCCM",
        description: "Immatriculation au Registre du Commerce et du Crédit Mobilier pour obtenir votre numéro RCCM."
      },
      {
        title: "5. Obtention de l'IFU",
        description: "Inscription auprès des impôts pour l'obtention de votre Identifiant Fiscal Unique."
      },
      {
        title: "6. Autres formalités",
        description: "CNSS (sécurité sociale), assurances, autorisations sectorielles si nécessaire."
      }
    ],
    documents: [
      "Statuts de l'entreprise",
      "Procès-verbal de nomination des dirigeants",
      "Attestation de dépôt de capital",
      "Bail commercial ou titre de propriété",
      "Pièces d'identité des associés",
      "Certificat de domicile",
      "Demande d'immatriculation RCCM"
    ],
    timeline: "3 à 6 semaines pour une création complète",
    cost: "Variable selon la forme juridique (50 000 à 500 000 FCFA)",
    warning: "Le choix de la forme juridique a des implications fiscales et juridiques importantes.",
    isActive: true
  },
  {
    categoryId: "labor",
    iconName: "Users",
    title: "Droit du Travail",
    description: "Licenciement, contrat de travail, conflits",
    color: "from-green-500/10 to-green-600/10",
    borderColor: "hover:border-green-500/50",
    order: 4,
    guidanceTitle: "Droit du Travail",
    steps: [
      {
        title: "1. Consultation préalable",
        description: "Rencontrez un avocat spécialisé en droit du travail pour évaluer la situation et vos droits."
      },
      {
        title: "2. Mise en demeure",
        description: "Envoi d'une lettre recommandée à l'employeur pour tenter une résolution amiable du conflit."
      },
      {
        title: "3. Saisine de l'inspection du travail",
        description: "Si nécessaire, dépôt d'une plainte auprès de l'inspection du travail pour médiation."
      },
      {
        title: "4. Procédure de conciliation",
        description: "Tentative de règlement amiable devant l'inspecteur du travail ou un conciliateur."
      },
      {
        title: "5. Saisine du tribunal",
        description: "En cas d'échec de la conciliation, saisie du tribunal du travail pour jugement."
      },
      {
        title: "6. Exécution du jugement",
        description: "Application de la décision du tribunal (réintégration, indemnités, dommages et intérêts)."
      }
    ],
    documents: [
      "Contrat de travail",
      "Bulletins de salaire",
      "Attestation de travail",
      "Correspondances avec l'employeur",
      "Témoignages éventuels",
      "Preuves des manquements",
      "Certificat de travail"
    ],
    timeline: "3 à 12 mois selon la complexité",
    cost: "Honoraires d'avocat + frais de procédure",
    warning: "Respectez les délais de prescription pour agir en justice (généralement 2 ans).",
    isActive: true
  },
  {
    categoryId: "contracts",
    iconName: "FileText",
    title: "Droit des Contrats",
    description: "Rédaction, rupture, litiges contractuels",
    color: "from-orange-500/10 to-orange-600/10",
    borderColor: "hover:border-orange-500/50",
    order: 5,
    guidanceTitle: "Droit des Contrats",
    steps: [
      {
        title: "1. Analyse du contrat",
        description: "Examen approfondi du contrat litigieux par un avocat spécialisé pour identifier les clauses problématiques."
      },
      {
        title: "2. Tentative de règlement amiable",
        description: "Négociation directe avec l'autre partie pour trouver une solution sans procès."
      },
      {
        title: "3. Mise en demeure",
        description: "Envoi d'une lettre recommandée exigeant l'exécution ou la résolution du contrat."
      },
      {
        title: "4. Médiation ou arbitrage",
        description: "Si prévu au contrat, recours à un médiateur ou arbitre pour résoudre le différend."
      },
      {
        title: "5. Action en justice",
        description: "Saisine du tribunal compétent pour faire valoir vos droits et obtenir réparation."
      },
      {
        title: "6. Exécution forcée",
        description: "En cas de jugement favorable, procédure d'exécution pour obtenir le respect de vos droits."
      }
    ],
    documents: [
      "Contrat original signé",
      "Avenants et modifications",
      "Correspondances entre les parties",
      "Preuves d'exécution ou manquement",
      "Factures et paiements",
      "Expertises éventuelles",
      "Témoignages"
    ],
    timeline: "4 à 18 mois selon la complexité",
    cost: "Honoraires d'avocat + frais de justice",
    warning: "Vérifiez les clauses de résolution et les juridictions compétentes dans votre contrat.",
    isActive: true
  },
  {
    categoryId: "succession",
    iconName: "TrendingUp",
    title: "Succession & Héritage",
    description: "Testament, partage, droits de succession",
    color: "from-yellow-500/10 to-yellow-600/10",
    borderColor: "hover:border-yellow-500/50",
    order: 6,
    guidanceTitle: "Succession et Héritage",
    steps: [
      {
        title: "1. Déclaration de décès",
        description: "Obtention de l'acte de décès auprès de l'état civil dans les délais légaux."
      },
      {
        title: "2. Recherche du testament",
        description: "Vérification de l'existence d'un testament auprès du notaire ou dans les affaires du défunt."
      },
      {
        title: "3. Établissement de l'acte de notoriété",
        description: "Document établi par le notaire identifiant tous les héritiers légaux."
      },
      {
        title: "4. Inventaire des biens",
        description: "Recensement complet de tous les biens mobiliers et immobiliers de la succession."
      },
      {
        title: "5. Déclaration de succession",
        description: "Dépôt de la déclaration fiscale auprès des impôts dans les 6 mois suivant le décès."
      },
      {
        title: "6. Partage des biens",
        description: "Répartition des biens entre les héritiers selon la loi ou le testament."
      }
    ],
    documents: [
      "Acte de décès",
      "Testament (si existant)",
      "Livret de famille",
      "Titres de propriété",
      "Relevés bancaires",
      "Contrats d'assurance-vie",
      "Acte de notoriété"
    ],
    timeline: "6 à 24 mois selon la complexité de la succession",
    cost: "Frais de notaire + droits de succession",
    warning: "Les droits de succession doivent être payés dans les 6 mois pour éviter les pénalités.",
    isActive: true
  },
  {
    categoryId: "accident",
    iconName: "Car",
    title: "Accidents & Préjudices",
    description: "Indemnisation, responsabilité civile",
    color: "from-red-500/10 to-red-600/10",
    borderColor: "hover:border-red-500/50",
    order: 7,
    guidanceTitle: "Accidents et Préjudices",
    steps: [
      {
        title: "1. Constat et déclaration",
        description: "Établissement d'un constat amiable ou rapport de police/gendarmerie immédiatement après l'accident."
      },
      {
        title: "2. Soins médicaux et certificats",
        description: "Consultation médicale avec obtention de certificats détaillant les blessures et l'ITT (Incapacité Temporaire de Travail)."
      },
      {
        title: "3. Déclaration à l'assurance",
        description: "Notification à votre assurance et celle du responsable dans les délais contractuels (généralement 5 jours)."
      },
      {
        title: "4. Constitution du dossier",
        description: "Rassemblement de toutes les preuves : photos, témoignages, factures médicales, arrêts de travail."
      },
      {
        title: "5. Évaluation des préjudices",
        description: "Expertise médicale pour chiffrer les préjudices corporels, matériels et moraux."
      },
      {
        title: "6. Négociation ou action en justice",
        description: "Tentative de règlement amiable avec l'assurance ou action judiciaire pour obtenir l'indemnisation."
      }
    ],
    documents: [
      "Constat amiable ou procès-verbal",
      "Certificats médicaux",
      "Factures de soins",
      "Arrêts de travail",
      "Photos de l'accident",
      "Témoignages",
      "Expertises médicales"
    ],
    timeline: "6 mois à 3 ans selon la gravité et les négociations",
    cost: "Honoraires d'avocat (souvent au résultat) + frais d'expertise",
    warning: "Ne signez aucune transaction avec l'assurance sans l'avis d'un avocat.",
    isActive: true
  },
  {
    categoryId: "construction",
    iconName: "Building",
    title: "Droit de la Construction",
    description: "Malfaçons, retards, garanties",
    color: "from-teal-500/10 to-teal-600/10",
    borderColor: "hover:border-teal-500/50",
    order: 8,
    guidanceTitle: "Droit de la Construction",
    steps: [
      {
        title: "1. Constatation des désordres",
        description: "Documentation précise des malfaçons ou retards avec photos, vidéos et témoignages."
      },
      {
        title: "2. Mise en demeure de l'entrepreneur",
        description: "Courrier recommandé demandant la réparation des malfaçons dans un délai raisonnable."
      },
      {
        title: "3. Expertise technique",
        description: "Faire réaliser une expertise par un professionnel indépendant pour évaluer les désordres."
      },
      {
        title: "4. Activation des garanties",
        description: "Selon le cas : garantie de parfait achèvement, garantie biennale ou décennale."
      },
      {
        title: "5. Procédure de référé",
        description: "En cas d'urgence, saisine du tribunal en référé pour obtenir une expertise judiciaire."
      },
      {
        title: "6. Action au fond",
        description: "Si nécessaire, action en justice pour obtenir la réparation et/ou des dommages et intérêts."
      }
    ],
    documents: [
      "Contrat de construction",
      "Plans et devis",
      "Factures et paiements",
      "Photos des malfaçons",
      "Rapport d'expertise",
      "Correspondances avec l'entrepreneur",
      "Attestations d'assurance"
    ],
    timeline: "6 mois à 2 ans selon la gravité",
    cost: "Expertise + honoraires d'avocat",
    warning: "Les garanties ont des délais : parfait achèvement (1 an), biennale (2 ans), décennale (10 ans).",
    isActive: true
  },
  {
    categoryId: "debt",
    iconName: "CreditCard",
    title: "Recouvrement de Créances",
    description: "Dettes impayées, procédures de recouvrement",
    color: "from-indigo-500/10 to-indigo-600/10",
    borderColor: "hover:border-indigo-500/50",
    order: 9,
    guidanceTitle: "Recouvrement de Créances",
    steps: [
      {
        title: "1. Relances amiables",
        description: "Tentatives de contact (téléphone, email, courrier simple) pour obtenir le paiement à l'amiable."
      },
      {
        title: "2. Mise en demeure",
        description: "Envoi d'une lettre recommandée avec AR exigeant le paiement sous un délai précis (8 à 15 jours)."
      },
      {
        title: "3. Injonction de payer",
        description: "Procédure rapide devant le tribunal pour obtenir une ordonnance de paiement sans audience."
      },
      {
        title: "4. Signification de l'ordonnance",
        description: "Notification officielle de l'ordonnance au débiteur par huissier de justice."
      },
      {
        title: "5. Exécution forcée",
        description: "Si le débiteur ne paie pas, saisie des biens mobiliers ou immobiliers, saisie sur salaire."
      },
      {
        title: "6. Suivi du recouvrement",
        description: "Contrôle de l'exécution et récupération effective des sommes dues."
      }
    ],
    documents: [
      "Factures impayées",
      "Bons de commande",
      "Contrats",
      "Preuves de livraison",
      "Relevés de compte",
      "Correspondances de relance",
      "Mise en demeure"
    ],
    timeline: "2 à 12 mois selon la réactivité du débiteur",
    cost: "Frais d'huissier + honoraires d'avocat (souvent au résultat)",
    warning: "La prescription est de 5 ans pour les créances commerciales.",
    isActive: true
  }
];

async function seedLegalCategories() {
  console.log('🌱 Début du seeding des catégories juridiques...');
  
  try {
    for (const category of legalCategories) {
      const docRef = await addDoc(collection(db, 'legalCategories'), {
        ...category,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log(`✅ Catégorie ajoutée: ${category.title} (ID: ${docRef.id})`);
    }
    
    console.log('\n🎉 Seeding terminé avec succès!');
    console.log(`📊 Total: ${legalCategories.length} catégories juridiques ajoutées`);
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    throw error;
  }
}

seedLegalCategories()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
