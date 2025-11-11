const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'change_me_to_secure_value';

app.use(cors());
app.use(express.json());

// Simple in-memory user storage (for development)
const users = [];
const contactMessages = [];
const consultationRequests = [];
const appointments = [];
const cases = [];
const notifications = [];
const services = [];
const teamMembers = [];
const processes = [];
const testimonials = [];
const announcements = [];
let businessHours = null;

// Create default admin user
async function createDefaultAdmin() {
  const password = 'ChangeMe123!';
  const hash = await bcrypt.hash(password, 10);
  users.push({
    id: 1,
    email: 'admin@axe.local',
    password: hash,
    name: 'Admin',
    isAdmin: true
  });
  console.log('✅ Admin user created: admin@axe.local / ChangeMe123!');
}

// Create default services
function createDefaultServices() {
  const defaultServices = [
    {
      id: 1,
      title: "Droit des Affaires",
      slug: "droit-des-affaires",
      icon: "Briefcase",
      shortDescription: "Accompagnement stratégique et juridique complet des entreprises à chaque étape de leur développement.",
      fullDescription: "Accompagnement stratégique et juridique complet des entreprises à chaque étape de leur développement, de la création à la transmission, en passant par la croissance et la restructuration.",
      features: [
        "Création et immatriculation de sociétés (SARL, SA, SAS, SCI, GIE)",
        "Rédaction et révision des statuts juridiques",
        "Gouvernance d'entreprise et conseil aux dirigeants",
        "Opérations de fusions-acquisitions et due diligence",
        "Négociation et rédaction de contrats commerciaux complexes",
        "Pactes d'actionnaires et conventions de partenariat",
        "Restructuration et transmission d'entreprises",
        "Propriété intellectuelle et protection des marques",
        "Conformité réglementaire et mise en conformité OHADA",
        "Accompagnement dans les levées de fonds et augmentations de capital"
      ],
      benefits: [
        "Sécurisation juridique complète de vos opérations",
        "Optimisation de la structure juridique",
        "Accompagnement personnalisé par des experts"
      ],
      category: "Droit des affaires",
      price: "Sur devis",
      duration: "Variable selon le projet",
      isActive: true,
      order: 1,
      metadata: {
        seoTitle: "Droit des Affaires - Cabinet Axe Legal",
        seoDescription: "Expert en droit des affaires pour accompagner votre entreprise",
        keywords: ["droit des affaires", "création société", "fusion acquisition"]
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: "Fiscalité & Optimisation",
      slug: "fiscalite-optimisation",
      icon: "Calculator",
      shortDescription: "Conseil fiscal stratégique et défense active de vos intérêts face à l'administration fiscale.",
      fullDescription: "Conseil fiscal stratégique et défense active de vos intérêts face à l'administration fiscale, avec une approche proactive d'optimisation et de sécurisation fiscale.",
      features: [
        "Audit fiscal et diagnostic de la situation fiscale",
        "Optimisation fiscale des entreprises et des particuliers",
        "Conseil en fiscalité internationale et prix de transfert",
        "Assistance lors des contrôles fiscaux et douaniers",
        "Défense et représentation en cas de redressement fiscal",
        "Réclamations contentieuses et recours hiérarchiques",
        "Négociation de transactions avec l'administration",
        "Régularisation de situations fiscales complexes",
        "Conseils en TVA, impôt sur les sociétés et impôt sur le revenu",
        "Planification successorale et fiscalité des donations"
      ],
      benefits: [
        "Optimisation de votre charge fiscale",
        "Sécurisation face aux contrôles",
        "Expertise en fiscalité internationale"
      ],
      category: "Droit fiscal",
      price: "150€ - 300€/h",
      duration: "1h - plusieurs mois",
      isActive: true,
      order: 2,
      metadata: {
        seoTitle: "Fiscalité et Optimisation Fiscale - Axe Legal",
        seoDescription: "Optimisez votre fiscalité avec nos experts",
        keywords: ["fiscalité", "optimisation fiscale", "contrôle fiscal"]
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      title: "Droit Immobilier & Foncier",
      slug: "droit-immobilier-foncier",
      icon: "Home",
      shortDescription: "Sécurisation juridique complète de vos projets immobiliers et fonciers.",
      fullDescription: "Sécurisation juridique complète de vos projets immobiliers et fonciers, de l'acquisition à la cession, avec une expertise approfondie du droit foncier.",
      features: [
        "Vérification et purge des titres fonciers",
        "Due diligence immobilière et audits fonciers",
        "Rédaction d'actes authentiques de vente et d'acquisition",
        "Assistance lors des bornages et immatriculations foncières",
        "Négociation et rédaction de baux commerciaux et d'habitation",
        "Gestion des copropriétés et règlements de copropriété",
        "Contentieux fonciers et résolution des litiges de propriété",
        "Droit de l'urbanisme et permis de construire",
        "Montage juridique de projets immobiliers complexes",
        "Promotion immobilière et VEFA"
      ],
      benefits: [
        "Sécurisation de vos acquisitions",
        "Résolution des litiges fonciers",
        "Accompagnement de A à Z"
      ],
      category: "Droit immobilier",
      price: "Sur devis",
      duration: "2 semaines - 6 mois",
      isActive: true,
      order: 3,
      metadata: {
        seoTitle: "Droit Immobilier et Foncier - Axe Legal",
        seoDescription: "Expert en droit immobilier et foncier",
        keywords: ["droit immobilier", "droit foncier", "acquisition immobilière"]
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      title: "Droit du Travail & Relations Sociales",
      slug: "droit-travail-relations-sociales",
      icon: "Users",
      shortDescription: "Accompagnement complet en droit social pour optimiser la gestion des ressources humaines.",
      fullDescription: "Accompagnement complet en droit social pour optimiser la gestion des ressources humaines et prévenir les risques sociaux, tout en assurant la conformité avec le Code du Travail.",
      features: [
        "Rédaction et révision de contrats de travail (CDD, CDI, stages)",
        "Élaboration de règlements intérieurs et notes de service",
        "Conseil en gestion des relations individuelles et collectives",
        "Assistance dans les procédures disciplinaires et licenciements",
        "Négociation d'accords collectifs et conventions d'entreprise",
        "Conseil en restructuration et plans sociaux",
        "Représentation devant les juridictions du travail",
        "Audit social et mise en conformité avec la législation",
        "Gestion des relations avec l'Inspection du Travail",
        "Formation des DRH et managers aux obligations sociales"
      ],
      benefits: [
        "Conformité avec le Code du Travail",
        "Prévention des risques sociaux",
        "Défense de vos intérêts"
      ],
      category: "Droit du travail",
      price: "200€/h",
      duration: "1h - plusieurs semaines",
      isActive: true,
      order: 4,
      metadata: {
        seoTitle: "Droit du Travail - Cabinet Axe Legal",
        seoDescription: "Expert en droit du travail et relations sociales",
        keywords: ["droit du travail", "contrat de travail", "licenciement"]
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 5,
      title: "Recouvrement de Créances",
      slug: "recouvrement-creances",
      icon: "Coins",
      shortDescription: "Stratégie efficace et personnalisée de recouvrement de vos créances impayées.",
      fullDescription: "Stratégie efficace et personnalisée de recouvrement de vos créances impayées, privilégiant une approche amiable avant d'envisager les voies judiciaires.",
      features: [
        "Phase amiable : mises en demeure et négociations directes",
        "Élaboration de plans d'apurement et échéanciers de paiement",
        "Recouvrement judiciaire : injonctions de payer et référés-provision",
        "Procédures d'exécution forcée et saisies conservatoires",
        "Saisie-attribution, saisie-vente et saisie immobilière",
        "Recouvrement de créances commerciales, civiles et fiscales",
        "Contentieux des impayés et suivi des procédures collectives",
        "Négociation avec les débiteurs défaillants",
        "Constitution de garanties et sûretés",
        "Conseil en prévention des impayés et sécurisation des transactions"
      ],
      benefits: [
        "Récupération rapide de vos créances",
        "Approche amiable privilégiée",
        "Expertise judiciaire en dernier recours"
      ],
      category: "Contentieux",
      price: "Pourcentage sur créances récupérées",
      duration: "1 mois - 1 an",
      isActive: true,
      order: 5,
      metadata: {
        seoTitle: "Recouvrement de Créances - Axe Legal",
        seoDescription: "Récupérez vos créances impayées efficacement",
        keywords: ["recouvrement créances", "impayés", "contentieux"]
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 6,
      title: "Marchés Publics & Droit Administratif",
      slug: "marches-publics-droit-administratif",
      icon: "FileText",
      shortDescription: "Expertise pointue en droit des marchés publics et contentieux administratif.",
      fullDescription: "Expertise pointue en droit des marchés publics et contentieux administratif pour accompagner entreprises et collectivités dans leurs relations avec l'administration.",
      features: [
        "Conseil et assistance dans la préparation des offres publiques",
        "Analyse des dossiers d'appel d'offres (DAO) et des clauses",
        "Rédaction des mémoires techniques et offres financières",
        "Recours précontractuels et référés pré-contractuels",
        "Contestation des décisions d'attribution et recours en annulation",
        "Assistance dans l'exécution et le suivi des marchés publics",
        "Contentieux des pénalités et résiliation de marchés",
        "Conseil en droit administratif général et contentieux administratif",
        "Représentation devant les juridictions administratives",
        "Formation aux procédures de passation des marchés publics"
      ],
      benefits: [
        "Maximisation de vos chances de succès",
        "Conformité réglementaire garantie",
        "Défense de vos intérêts"
      ],
      category: "Droit administratif",
      price: "Sur devis",
      duration: "Variable",
      isActive: true,
      order: 6,
      metadata: {
        seoTitle: "Marchés Publics et Droit Administratif - Axe Legal",
        seoDescription: "Expert en marchés publics et droit administratif",
        keywords: ["marchés publics", "droit administratif", "appel d'offres"]
      },
      createdAt: new Date().toISOString()
    }
  ];

  services.push(...defaultServices);
  console.log(`✅ ${defaultServices.length} default services created`);
}

// Create default team members
function createDefaultTeamMembers() {
  const defaultMembers = [
    {
      id: 1,
      name: "Me. Alexandre KOFFI",
      role: "Avocat Associé",
      title: "Expert en Droit des Affaires et Fiscalité",
      bio: "Diplômé de l'Université Paris 1 Panthéon-Sorbonne, Me. Alexandre KOFFI possède plus de 15 ans d'expérience en droit des affaires et fiscalité. Il accompagne les entreprises dans leurs opérations complexes de restructuration, fusion-acquisition et optimisation fiscale.",
      specialties: ["Droit des affaires", "Droit fiscal", "Fusions-acquisitions"],
      education: [
        "Master 2 Droit des Affaires - Paris 1 Panthéon-Sorbonne",
        "CAPA - École de Formation des Barreaux de Paris",
        "Certificat en Fiscalité Internationale - HEC Paris"
      ],
      experience: "Plus de 15 ans d'expérience en conseil juridique et fiscal pour des entreprises multinationales et PME. Ancien collaborateur dans un cabinet Big Four.",
      email: "a.koffi@axelegal.com",
      phone: "+229 97 XX XX XX",
      linkedin: "https://linkedin.com/in/alexandre-koffi",
      imageUrl: "",
      isActive: true,
      order: 1,
      languages: ["Français", "Anglais", "Allemand"],
      certifications: [
        "Avocat inscrit au Barreau de Cotonou",
        "Médiateur certifié en droit commercial"
      ],
      achievements: [
        "Conseil de plus de 50 opérations de fusions-acquisitions",
        "Spécialiste reconnu en optimisation fiscale transfrontalière",
        "Auteur de plusieurs publications en droit OHADA"
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      name: "Me. Fatou DIALLO",
      role: "Avocat Associé",
      title: "Spécialiste en Droit Immobilier et Foncier",
      bio: "Me. Fatou DIALLO est une référence en droit immobilier et foncier avec une expertise particulière dans la sécurisation des titres fonciers et le contentieux immobilier. Elle a traité plus de 200 dossiers de purge de titres fonciers.",
      specialties: ["Droit immobilier", "Droit administratif", "Contentieux"],
      education: [
        "Master 2 Droit Immobilier - Université de Bordeaux",
        "CAPA - École des Avocats du Grand Ouest",
        "Formation en Droit Foncier Béninois - Université d'Abomey-Calavi"
      ],
      experience: "12 ans d'expérience en droit immobilier et foncier. Spécialisée dans les transactions immobilières complexes et le contentieux foncier.",
      email: "f.diallo@axelegal.com",
      phone: "+229 96 XX XX XX",
      linkedin: "https://linkedin.com/in/fatou-diallo",
      imageUrl: "",
      isActive: true,
      order: 2,
      languages: ["Français", "Anglais"],
      certifications: [
        "Avocat inscrit au Barreau de Cotonou",
        "Expert en évaluation immobilière"
      ],
      achievements: [
        "Plus de 200 dossiers de purge de titres fonciers traités",
        "Conseil dans des projets immobiliers de plus de 5 milliards FCFA",
        "Formatrice en droit foncier pour plusieurs promoteurs immobiliers"
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      name: "Me. Moussa TRAORE",
      role: "Avocat Senior",
      title: "Expert en Droit du Travail et Relations Sociales",
      bio: "Spécialisé en droit du travail et relations sociales, Me. Moussa TRAORE conseille aussi bien les entreprises que les salariés dans la gestion de leurs relations professionnelles et la résolution des conflits sociaux.",
      specialties: ["Droit du travail", "Droit de la famille", "Contentieux"],
      education: [
        "Master 2 Droit Social - Université Lyon 2",
        "CAPA - École des Avocats de Lyon",
        "Diplôme en Gestion des Ressources Humaines"
      ],
      experience: "10 ans d'expérience en droit social et conseil RH. Intervient régulièrement en formation auprès des DRH.",
      email: "m.traore@axelegal.com",
      phone: "+229 95 XX XX XX",
      linkedin: "https://linkedin.com/in/moussa-traore",
      imageUrl: "",
      isActive: true,
      order: 3,
      languages: ["Français", "Anglais"],
      certifications: [
        "Avocat inscrit au Barreau de Cotonou",
        "Formateur certifié en droit du travail"
      ],
      achievements: [
        "Conseil de plus de 100 entreprises en restructuration sociale",
        "Représentation réussie dans des litiges complexes devant les tribunaux du travail",
        "Auteur de guides pratiques en droit social"
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      name: "Me. Sophie MENSAH",
      role: "Avocat",
      title: "Spécialiste en Contentieux et Recouvrement",
      bio: "Me. Sophie MENSAH est spécialisée dans le contentieux civil et commercial ainsi que le recouvrement de créances. Son approche stratégique et sa ténacité font d'elle une redoutable plaidante.",
      specialties: ["Contentieux", "Droit commercial", "Arbitrage"],
      education: [
        "Master 2 Droit Processuel - Université de Nantes",
        "CAPA - École des Avocats de l'Ouest",
        "Formation en Arbitrage Commercial International"
      ],
      experience: "8 ans d'expérience en contentieux et recouvrement. Taux de réussite de 85% dans les dossiers de recouvrement.",
      email: "s.mensah@axelegal.com",
      phone: "+229 94 XX XX XX",
      linkedin: "https://linkedin.com/in/sophie-mensah",
      imageUrl: "",
      isActive: true,
      order: 4,
      languages: ["Français", "Anglais", "Espagnol"],
      certifications: [
        "Avocat inscrit au Barreau de Cotonou",
        "Arbitre accrédité à la CCJA"
      ],
      achievements: [
        "Recouvrement de plus de 2 milliards FCFA de créances",
        "Victoires dans des litiges commerciaux complexes",
        "Experte en procédures d'exécution forcée"
      ],
      createdAt: new Date().toISOString()
    }
  ];

  teamMembers.push(...defaultMembers);
  console.log(`✅ ${defaultMembers.length} default team members created`);
}

// Create default process steps
function createDefaultProcesses() {
  const defaultProcesses = [
    {
      id: 1,
      number: "01",
      title: "Premier Contact",
      description: "Contactez-nous par téléphone, email ou via notre formulaire en ligne. Nous vous répondons sous 24h pour une première prise de contact.",
      details: [
        "Prise de contact initiale rapide",
        "Écoute attentive de votre situation",
        "Évaluation préliminaire de vos besoins",
        "Orientation vers le bon expert"
      ],
      duration: "24h",
      icon: "Phone",
      color: "from-blue-500/10 to-blue-600/10",
      isActive: true,
      order: 1,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      number: "02",
      title: "Consultation Gratuite",
      description: "Bénéficiez d'une première consultation gratuite pour analyser votre cas en détail et identifier les meilleures solutions.",
      details: [
        "Rencontre sans engagement financier",
        "Analyse approfondie de votre dossier",
        "Conseils juridiques préliminaires",
        "Questions-réponses personnalisées"
      ],
      duration: "1h",
      icon: "MessageSquare",
      color: "from-purple-500/10 to-purple-600/10",
      isActive: true,
      order: 2,
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      number: "03",
      title: "Proposition de Service",
      description: "Nous vous présentons une proposition détaillée avec une stratégie claire et des honoraires transparents, sans surprises.",
      details: [
        "Stratégie juridique personnalisée",
        "Honoraires transparents et détaillés",
        "Délais estimés avec précision",
        "Plan d'action étape par étape"
      ],
      duration: "2-3 jours",
      icon: "FileText",
      color: "from-green-500/10 to-green-600/10",
      isActive: true,
      order: 3,
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      number: "04",
      title: "Action Juridique",
      description: "Notre équipe met en œuvre la stratégie définie avec rigueur, professionnalisme et une communication régulière.",
      details: [
        "Rédaction des actes juridiques",
        "Représentation légale complète",
        "Suivi régulier et points d'étape",
        "Communication transparente"
      ],
      duration: "Variable",
      icon: "Scale",
      color: "from-orange-500/10 to-orange-600/10",
      isActive: true,
      order: 4,
      createdAt: new Date().toISOString()
    },
    {
      id: 5,
      number: "05",
      title: "Résolution & Finalisation",
      description: "Nous assurons le suivi jusqu'à la résolution complète de votre dossier avec vérification minutieuse des résultats.",
      details: [
        "Finalisation complète du dossier",
        "Vérification des résultats obtenus",
        "Archivage sécurisé des documents",
        "Remise des documents finaux"
      ],
      duration: "1-2 semaines",
      icon: "CheckCircle",
      color: "from-teal-500/10 to-teal-600/10",
      isActive: true,
      order: 5,
      createdAt: new Date().toISOString()
    },
    {
      id: 6,
      number: "06",
      title: "Accompagnement Continu",
      description: "Nous restons à vos côtés pour tout besoin juridique futur et vous accompagnons dans la durée.",
      details: [
        "Suivi post-dossier personnalisé",
        "Conseil juridique continu",
        "Veille juridique et alertes",
        "Disponibilité permanente"
      ],
      duration: "En continu",
      icon: "Users",
      color: "from-indigo-500/10 to-indigo-600/10",
      isActive: true,
      order: 6,
      createdAt: new Date().toISOString()
    }
  ];

  processes.push(...defaultProcesses);
  console.log(`✅ ${defaultProcesses.length} default process steps created`);
}

// Create default testimonials
function createDefaultTestimonials() {
  const defaultTestimonials = [
    {
      id: 1,
      clientName: "Amadou SANKARA",
      clientRole: "Directeur Général",
      clientCompany: "SANKARA Industries SARL",
      clientImage: "",
      rating: 5,
      testimonial: "Un accompagnement juridique exceptionnel ! L'équipe d'Axe Legal a su gérer notre dossier de fusion-acquisition avec une expertise remarquable. Leur réactivité et leur professionnalisme nous ont permis de finaliser l'opération dans les délais impartis.",
      caseType: "Droit des Affaires - Fusion-Acquisition",
      date: "2024-10-15",
      isActive: true,
      isFeatured: true,
      order: 1,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      clientName: "Koffi MENSAH",
      clientRole: "Entrepreneur",
      clientCompany: "MENSAH Group",
      clientImage: "",
      rating: 5,
      testimonial: "Grâce à Axe Legal, j'ai pu optimiser ma fiscalité d'entreprise de manière légale et efficace. Leur expertise en intelligence fiscale m'a fait économiser des millions de FCFA tout en restant en conformité totale avec la législation.",
      caseType: "Droit Fiscal - Optimisation",
      date: "2024-09-20",
      isActive: true,
      isFeatured: true,
      order: 2,
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      clientName: "Marie-Claude ADJOBI",
      clientRole: "Promotrice Immobilière",
      clientCompany: "ADJOBI Promotion",
      clientImage: "",
      rating: 5,
      testimonial: "Cabinet sérieux et compétent ! Ils ont géré toutes les procédures d'acquisition de notre terrain commercial. De la vérification des titres fonciers à la finalisation de l'acte notarié, tout s'est déroulé sans accroc.",
      caseType: "Droit Immobilier",
      date: "2024-08-10",
      isActive: true,
      isFeatured: true,
      order: 3,
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      clientName: "Ibrahim TOURE",
      clientRole: "DRH",
      clientCompany: "TechCorp Africa",
      clientImage: "",
      rating: 5,
      testimonial: "Nous avons fait appel à Axe Legal pour restructurer nos contrats de travail et mettre à jour notre convention collective. Leur maîtrise du droit du travail béninois est impressionnante. Nos 150 employés sont désormais dans une situation légale parfaitement claire.",
      caseType: "Droit du Travail",
      date: "2024-07-25",
      isActive: true,
      isFeatured: false,
      order: 4,
      createdAt: new Date().toISOString()
    },
    {
      id: 5,
      clientName: "Fatou DIALLO",
      clientRole: "Présidente",
      clientCompany: "Association ESPOIR",
      clientImage: "",
      rating: 5,
      testimonial: "Excellente prestation ! Axe Legal nous a aidés à structurer juridiquement notre ONG et à obtenir notre reconnaissance d'utilité publique. Leur accompagnement a été précieux et leurs honoraires très raisonnables.",
      caseType: "Droit des Associations",
      date: "2024-06-30",
      isActive: true,
      isFeatured: false,
      order: 5,
      createdAt: new Date().toISOString()
    },
    {
      id: 6,
      clientName: "Serge AKPOVI",
      clientRole: "Chef d'Entreprise",
      clientCompany: "AKPOVI Consulting",
      clientImage: "",
      rating: 5,
      testimonial: "J'ai été très impressionné par leur capacité à résoudre un litige commercial complexe qui durait depuis 2 ans. En moins de 6 mois, grâce à leur stratégie juridique et leurs talents de négociation, nous avons obtenu un règlement favorable à l'amiable.",
      caseType: "Contentieux Commercial",
      date: "2024-05-18",
      isActive: true,
      isFeatured: false,
      order: 6,
      createdAt: new Date().toISOString()
    }
  ];

  testimonials.push(...defaultTestimonials);
  console.log(`✅ ${defaultTestimonials.length} default testimonials created`);
}

// Create default announcements
function createDefaultAnnouncements() {
  const defaultAnnouncements = [
    {
      id: '1',
      title: 'Consultation Juridique Offerte',
      description: 'Profitez d\'une consultation gratuite de 30 minutes pour analyser votre situation juridique',
      content: 'Nous offrons actuellement une consultation juridique gratuite de 30 minutes pour tous les nouveaux clients. Un de nos avocats expérimentés analysera votre situation et vous conseillera sur les meilleures options qui s\'offrent à vous. Cette offre est valable pour tous les domaines du droit.',
      type: 'promotion',
      icon: 'Gift',
      color: 'from-blue-500 to-blue-600',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      isActive: true,
      isFeatured: true,
      order: 1,
      link: '/consultation',
      imageUrl: '',
    },
    {
      id: '2',
      title: 'Nouveau Service: Droit des Affaires',
      description: 'Découvrez notre nouveau département spécialisé en droit des affaires et corporate',
      content: 'Nous sommes ravis d\'annoncer l\'ouverture de notre nouveau département de droit des affaires. Notre équipe d\'experts vous accompagne dans la création d\'entreprise, les contrats commerciaux, les fusions-acquisitions et tous les aspects juridiques de votre business.',
      type: 'news',
      icon: 'Briefcase',
      color: 'from-green-500 to-green-600',
      startDate: '2025-01-15',
      endDate: '2025-06-30',
      isActive: true,
      isFeatured: true,
      order: 2,
      link: '/services',
      imageUrl: '',
    },
    {
      id: '3',
      title: 'Webinaire: Protection des Données Personnelles',
      description: 'Participez à notre webinaire gratuit sur la conformité RGPD et la protection des données',
      content: 'Rejoignez-nous pour un webinaire exclusif sur la protection des données personnelles et la conformité RGPD. Nos experts vous expliqueront les obligations légales, les bonnes pratiques et répondront à toutes vos questions. Places limitées, inscription obligatoire.',
      type: 'event',
      icon: 'Calendar',
      color: 'from-purple-500 to-purple-600',
      startDate: '2025-02-01',
      endDate: '2025-02-28',
      isActive: true,
      isFeatured: true,
      order: 3,
      link: '/contact',
      imageUrl: '',
    },
    {
      id: '4',
      title: 'Tarifs Réduits pour les Startups',
      description: 'Profitez de tarifs préférentiels si vous êtes une startup ou une jeune entreprise',
      content: 'Nous soutenons l\'entrepreneuriat ! Les startups et jeunes entreprises (moins de 3 ans) bénéficient de tarifs réduits de 20% sur tous nos services juridiques. Accompagnement juridique complet pour développer votre projet en toute sérénité.',
      type: 'opportunity',
      icon: 'TrendingUp',
      color: 'from-orange-500 to-orange-600',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      isActive: true,
      isFeatured: false,
      order: 4,
      link: '/contact',
      imageUrl: '',
    },
    {
      id: '5',
      title: 'Nouveau Bureau à Cotonou',
      description: 'Ouverture de notre nouveau cabinet dans le quartier des affaires de Cotonou',
      content: 'Pour mieux vous servir, nous avons ouvert un nouveau bureau au cœur du quartier des affaires de Cotonou. Nos locaux modernes et accessibles vous accueillent du lundi au vendredi de 8h à 18h. Parking disponible pour les clients.',
      type: 'news',
      icon: 'Megaphone',
      color: 'from-teal-500 to-teal-600',
      startDate: '2025-01-10',
      endDate: '2025-03-31',
      isActive: true,
      isFeatured: false,
      order: 5,
      link: '/contact',
      imageUrl: '',
    },
    {
      id: '6',
      title: 'Programme de Parrainage',
      description: 'Parrainez un ami et recevez des avantages exclusifs sur nos services',
      content: 'Recommandez Axe Legal à vos proches et bénéficiez d\'avantages exclusifs ! Pour chaque client parrainé, recevez une réduction de 15% sur votre prochain service juridique. Votre filleul bénéficie également de 10% de réduction sur sa première prestation.',
      type: 'promotion',
      icon: 'Star',
      color: 'from-yellow-500 to-yellow-600',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      isActive: true,
      isFeatured: false,
      order: 6,
      link: '/contact',
      imageUrl: '',
    },
  ];

  announcements.push(...defaultAnnouncements);
  console.log(`✅ ${defaultAnnouncements.length} default announcements created`);
}

// Create default business hours
function createDefaultBusinessHours() {
  businessHours = {
    schedule: [
      { day: 'monday', isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { day: 'tuesday', isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { day: 'wednesday', isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { day: 'thursday', isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { day: 'friday', isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { day: 'saturday', isOpen: true, openTime: '09:00', closeTime: '13:00' },
      { day: 'sunday', isOpen: false, openTime: '00:00', closeTime: '00:00' },
    ],
    specialNote: '',
    holidayNote: 'Fermé les jours fériés nationaux',
  };
  console.log('✅ Default business hours created');
}

createDefaultAdmin();
createDefaultServices();
createDefaultTeamMembers();
createDefaultProcesses();
createDefaultTestimonials();
createDefaultAnnouncements();
createDefaultBusinessHours();

app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const payload = { id: user.id, email: user.email, isAdmin: !!user.isAdmin, name: user.name };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: payload });
});

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

app.get('/api/admin/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

app.get('/api/admin/dashboard', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  res.json({ 
    stats: { 
      users: 12, 
      clients: 500, 
      cases: cases.length,
      messages: contactMessages.length,
      consultations: consultationRequests.length,
      appointments: appointments.length,
      notifications: notifications.length,
      unreadNotifications: notifications.filter(n => n.status === 'unread').length
    }, 
    message: 'Welcome to the admin dashboard' 
  });
});

// Public endpoint to submit contact form
app.post('/api/contact', async (req, res) => {
  const { nom, email, telephone, sujet, message } = req.body || {};
  
  if (!nom || !email || !message) {
    return res.status(400).json({ message: 'Nom, email et message sont requis' });
  }

  const newMessage = {
    id: contactMessages.length + 1,
    nom,
    email,
    telephone: telephone || '',
    sujet: sujet || 'Sans sujet',
    message,
    date: new Date().toISOString(),
    read: false
  };

  contactMessages.push(newMessage);
  
  console.log(`📧 Nouveau message de contact reçu de ${nom} (${email})`);
  
  res.json({ 
    success: true, 
    message: 'Votre message a été envoyé avec succès',
    id: newMessage.id 
  });
});

// Get all contact messages (admin only)
app.get('/api/admin/messages', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  // Return messages sorted by date (newest first)
  const sortedMessages = [...contactMessages].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  res.json({ messages: sortedMessages });
});

// Mark message as read (admin only)
app.patch('/api/admin/messages/:id/read', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const messageId = parseInt(req.params.id);
  const message = contactMessages.find(m => m.id === messageId);
  
  if (!message) return res.status(404).json({ message: 'Message not found' });
  
  message.read = true;
  res.json({ success: true, message });
});

// Delete message (admin only)
app.delete('/api/admin/messages/:id', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const messageId = parseInt(req.params.id);
  const index = contactMessages.findIndex(m => m.id === messageId);
  
  if (index === -1) return res.status(404).json({ message: 'Message not found' });
  
  contactMessages.splice(index, 1);
  res.json({ success: true });
});

// ========== CONSULTATION ENDPOINTS ==========

// Public endpoint to submit consultation request
app.post('/api/consultation', async (req, res) => {
  const { nom, email, telephone, service, datePreferee, heurePreferee, message } = req.body || {};
  
  if (!nom || !email || !telephone) {
    return res.status(400).json({ message: 'Nom, email et téléphone sont requis' });
  }

  const newConsultation = {
    id: consultationRequests.length + 1,
    nom,
    email,
    telephone,
    service: service || 'Non spécifié',
    datePreferee: datePreferee || '',
    heurePreferee: heurePreferee || '',
    message: message || '',
    date: new Date().toISOString(),
    status: 'pending', // pending, confirmed, completed, cancelled
    read: false
  };

  consultationRequests.push(newConsultation);
  
  console.log(`📅 Nouvelle demande de consultation de ${nom} (${email})`);
  
  res.json({ 
    success: true, 
    message: 'Votre demande de consultation a été enregistrée avec succès',
    id: newConsultation.id 
  });
});

// Get all consultation requests (admin only)
app.get('/api/admin/consultations', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  // Return consultations sorted by date (newest first)
  const sortedConsultations = [...consultationRequests].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  res.json({ consultations: sortedConsultations });
});

// Mark consultation as read (admin only)
app.patch('/api/admin/consultations/:id/read', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const consultationId = parseInt(req.params.id);
  const consultation = consultationRequests.find(c => c.id === consultationId);
  
  if (!consultation) return res.status(404).json({ message: 'Consultation not found' });
  
  consultation.read = true;
  res.json({ success: true, consultation });
});

// Update consultation status (admin only)
app.patch('/api/admin/consultations/:id/status', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const consultationId = parseInt(req.params.id);
  const { status } = req.body;
  const consultation = consultationRequests.find(c => c.id === consultationId);
  
  if (!consultation) return res.status(404).json({ message: 'Consultation not found' });
  
  consultation.status = status;
  res.json({ success: true, consultation });
});

// Delete consultation (admin only)
app.delete('/api/admin/consultations/:id', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const consultationId = parseInt(req.params.id);
  const index = consultationRequests.findIndex(c => c.id === consultationId);
  
  if (index === -1) return res.status(404).json({ message: 'Consultation not found' });
  
  consultationRequests.splice(index, 1);
  res.json({ success: true });
});

// ========== APPOINTMENTS ROUTES ==========

// Get all appointments
app.get('/api/admin/appointments', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  res.json({ appointments });
});

// Create new appointment
app.post('/api/admin/appointments', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const { title, client, email, phone, date, startTime, endTime, type, status, notes } = req.body;
  
  if (!title || !client || !date || !startTime || !endTime) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const appointment = {
    id: appointments.length + 1,
    title,
    client,
    email: email || '',
    phone: phone || '',
    date,
    startTime,
    endTime,
    type: type || 'consultation',
    status: status || 'scheduled',
    notes: notes || '',
    createdAt: new Date().toISOString(),
  };

  appointments.push(appointment);
  res.status(201).json({ appointment });
});

// Update appointment
app.put('/api/admin/appointments/:id', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const appointmentId = parseInt(req.params.id);
  const index = appointments.findIndex(a => a.id === appointmentId);
  
  if (index === -1) return res.status(404).json({ message: 'Appointment not found' });

  const { title, client, email, phone, date, startTime, endTime, type, status, notes } = req.body;
  
  appointments[index] = {
    ...appointments[index],
    title: title || appointments[index].title,
    client: client || appointments[index].client,
    email: email !== undefined ? email : appointments[index].email,
    phone: phone !== undefined ? phone : appointments[index].phone,
    date: date || appointments[index].date,
    startTime: startTime || appointments[index].startTime,
    endTime: endTime || appointments[index].endTime,
    type: type || appointments[index].type,
    status: status || appointments[index].status,
    notes: notes !== undefined ? notes : appointments[index].notes,
  };

  res.json({ appointment: appointments[index] });
});

// Update appointment status
app.patch('/api/admin/appointments/:id/status', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const appointmentId = parseInt(req.params.id);
  const { status } = req.body;
  const index = appointments.findIndex(a => a.id === appointmentId);
  
  if (index === -1) return res.status(404).json({ message: 'Appointment not found' });
  
  appointments[index].status = status;
  res.json({ appointment: appointments[index] });
});

// Delete appointment
app.delete('/api/admin/appointments/:id', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const appointmentId = parseInt(req.params.id);
  const index = appointments.findIndex(a => a.id === appointmentId);
  
  if (index === -1) return res.status(404).json({ message: 'Appointment not found' });
  
  appointments.splice(index, 1);
  res.json({ success: true });
});

// ========== CASES ROUTES ==========

// Get all cases
app.get('/api/admin/cases', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  res.json({ cases });
});

// Create new case
app.post('/api/admin/cases', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const { title, client, email, phone, category, priority, status, assignedTo, description, notes } = req.body;
  
  if (!title || !client || !email || !description) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const caseNumber = `CASE-${new Date().getFullYear()}-${String(cases.length + 1).padStart(4, '0')}`;

  const newCase = {
    id: cases.length + 1,
    caseNumber,
    title,
    client,
    email,
    phone: phone || '',
    category: category || 'autre',
    priority: priority || 'medium',
    status: status || 'pending',
    assignedTo: assignedTo || '',
    description,
    dateOpened: new Date().toISOString().split('T')[0],
    dateClosed: null,
    documents: [],
    notes: notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  cases.push(newCase);
  res.status(201).json({ case: newCase });
});

// Update case
app.put('/api/admin/cases/:id', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const caseId = parseInt(req.params.id);
  const index = cases.findIndex(c => c.id === caseId);
  
  if (index === -1) return res.status(404).json({ message: 'Case not found' });

  const { title, client, email, phone, category, priority, status, assignedTo, description, notes } = req.body;
  
  // If status is being changed to closed or resolved, set dateClosed
  if ((status === 'closed' || status === 'resolved') && !cases[index].dateClosed) {
    cases[index].dateClosed = new Date().toISOString().split('T')[0];
  }

  cases[index] = {
    ...cases[index],
    title: title || cases[index].title,
    client: client || cases[index].client,
    email: email || cases[index].email,
    phone: phone !== undefined ? phone : cases[index].phone,
    category: category || cases[index].category,
    priority: priority || cases[index].priority,
    status: status || cases[index].status,
    assignedTo: assignedTo !== undefined ? assignedTo : cases[index].assignedTo,
    description: description || cases[index].description,
    notes: notes !== undefined ? notes : cases[index].notes,
    updatedAt: new Date().toISOString(),
  };

  res.json({ case: cases[index] });
});

// Update case status
app.patch('/api/admin/cases/:id/status', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const caseId = parseInt(req.params.id);
  const { status } = req.body;
  const index = cases.findIndex(c => c.id === caseId);
  
  if (index === -1) return res.status(404).json({ message: 'Case not found' });
  
  // If status is being changed to closed or resolved, set dateClosed
  if ((status === 'closed' || status === 'resolved') && !cases[index].dateClosed) {
    cases[index].dateClosed = new Date().toISOString().split('T')[0];
  }

  cases[index].status = status;
  cases[index].updatedAt = new Date().toISOString();
  res.json({ case: cases[index] });
});

// Delete case
app.delete('/api/admin/cases/:id', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const caseId = parseInt(req.params.id);
  const index = cases.findIndex(c => c.id === caseId);
  
  if (index === -1) return res.status(404).json({ message: 'Case not found' });
  
  cases.splice(index, 1);
  res.json({ success: true });
});

// ===== NOTIFICATIONS ROUTES =====
// Get all notifications with stats
app.get('/api/admin/notifications', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => n.status === 'unread').length,
    read: notifications.filter(n => n.status === 'read').length,
    archived: notifications.filter(n => n.status === 'archived').length,
    byType: {
      info: notifications.filter(n => n.type === 'info').length,
      success: notifications.filter(n => n.type === 'success').length,
      warning: notifications.filter(n => n.type === 'warning').length,
      error: notifications.filter(n => n.type === 'error').length,
      message: notifications.filter(n => n.type === 'message').length,
      system: notifications.filter(n => n.type === 'system').length,
    },
    byPriority: {
      low: notifications.filter(n => n.priority === 'low').length,
      normal: notifications.filter(n => n.priority === 'normal').length,
      high: notifications.filter(n => n.priority === 'high').length,
      urgent: notifications.filter(n => n.priority === 'urgent').length,
    }
  };
  
  res.json({ notifications, stats });
});

// Create new notification
app.post('/api/admin/notifications', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const { type, priority, title, message, recipient, link } = req.body || {};
  
  if (!title || !message) {
    return res.status(400).json({ message: 'Title and message are required' });
  }
  
  const newNotification = {
    id: String(Date.now()),
    type: type || 'info',
    priority: priority || 'normal',
    status: 'unread',
    title,
    message,
    recipient: recipient || 'all',
    sender: req.user.email,
    link: link || undefined,
    metadata: {},
    createdAt: new Date().toISOString(),
  };
  
  notifications.unshift(newNotification);
  res.status(201).json(newNotification);
});

// Mark notification as read
app.patch('/api/admin/notifications/:id/read', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const notification = notifications.find(n => n.id === req.params.id);
  if (!notification) return res.status(404).json({ message: 'Notification not found' });
  
  notification.status = 'read';
  notification.readAt = new Date().toISOString();
  
  res.json(notification);
});

// Mark notification as unread
app.patch('/api/admin/notifications/:id/unread', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const notification = notifications.find(n => n.id === req.params.id);
  if (!notification) return res.status(404).json({ message: 'Notification not found' });
  
  notification.status = 'unread';
  delete notification.readAt;
  
  res.json(notification);
});

// Archive notification
app.patch('/api/admin/notifications/:id/archive', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const notification = notifications.find(n => n.id === req.params.id);
  if (!notification) return res.status(404).json({ message: 'Notification not found' });
  
  notification.status = 'archived';
  notification.archivedAt = new Date().toISOString();
  
  res.json(notification);
});

// Mark all notifications as read
app.patch('/api/admin/notifications/mark-all-read', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const now = new Date().toISOString();
  notifications.forEach(n => {
    if (n.status === 'unread') {
      n.status = 'read';
      n.readAt = now;
    }
  });
  
  res.json({ success: true, message: 'All notifications marked as read' });
});

// Delete notification
app.delete('/api/admin/notifications/:id', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const index = notifications.findIndex(n => n.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Notification not found' });
  
  notifications.splice(index, 1);
  res.json({ success: true });
});

// ===== SERVICES ROUTES =====
// Get all services (public endpoint - only active services)
app.get('/api/services', (req, res) => {
  const activeServices = services
    .filter(s => s.isActive)
    .sort((a, b) => a.order - b.order);
  
  res.json({ services: activeServices });
});

// Get single service by slug (public endpoint)
app.get('/api/services/:slug', (req, res) => {
  const service = services.find(s => s.slug === req.params.slug && s.isActive);
  
  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }
  
  res.json(service);
});

// Get all services for admin (including inactive)
app.get('/api/admin/services', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const sortedServices = [...services].sort((a, b) => a.order - b.order);
  res.json({ services: sortedServices });
});

// Create new service
app.post('/api/admin/services', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const {
    title,
    slug,
    icon,
    shortDescription,
    fullDescription,
    features,
    benefits,
    category,
    price,
    duration,
    isActive,
    order,
    metadata
  } = req.body || {};
  
  if (!title || !slug || !shortDescription || !fullDescription || !category) {
    return res.status(400).json({ 
      message: 'Title, slug, shortDescription, fullDescription, and category are required' 
    });
  }
  
  // Check if slug already exists
  if (services.find(s => s.slug === slug)) {
    return res.status(400).json({ message: 'A service with this slug already exists' });
  }
  
  const newService = {
    id: services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1,
    title,
    slug,
    icon: icon || 'Briefcase',
    shortDescription,
    fullDescription,
    features: features || [],
    benefits: benefits || [],
    category,
    price: price || '',
    duration: duration || '',
    isActive: isActive !== undefined ? isActive : true,
    order: order || 0,
    metadata: metadata || {},
    createdAt: new Date().toISOString(),
  };
  
  services.push(newService);
  res.status(201).json(newService);
});

// Update service
app.put('/api/admin/services/:id', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const serviceId = parseInt(req.params.id);
  const index = services.findIndex(s => s.id === serviceId);
  
  if (index === -1) return res.status(404).json({ message: 'Service not found' });
  
  const {
    title,
    slug,
    icon,
    shortDescription,
    fullDescription,
    features,
    benefits,
    category,
    price,
    duration,
    isActive,
    order,
    metadata
  } = req.body || {};
  
  // Check if slug is being changed to one that already exists
  if (slug && slug !== services[index].slug && services.find(s => s.slug === slug)) {
    return res.status(400).json({ message: 'A service with this slug already exists' });
  }
  
  services[index] = {
    ...services[index],
    title: title || services[index].title,
    slug: slug || services[index].slug,
    icon: icon || services[index].icon,
    shortDescription: shortDescription || services[index].shortDescription,
    fullDescription: fullDescription || services[index].fullDescription,
    features: features || services[index].features,
    benefits: benefits || services[index].benefits,
    category: category || services[index].category,
    price: price !== undefined ? price : services[index].price,
    duration: duration !== undefined ? duration : services[index].duration,
    isActive: isActive !== undefined ? isActive : services[index].isActive,
    order: order !== undefined ? order : services[index].order,
    metadata: metadata || services[index].metadata,
    updatedAt: new Date().toISOString(),
  };
  
  res.json(services[index]);
});

// Toggle service active status
app.patch('/api/admin/services/:id/toggle', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const serviceId = parseInt(req.params.id);
  const service = services.find(s => s.id === serviceId);
  
  if (!service) return res.status(404).json({ message: 'Service not found' });
  
  service.isActive = req.body.isActive !== undefined ? req.body.isActive : !service.isActive;
  service.updatedAt = new Date().toISOString();
  
  res.json(service);
});

// Delete service
app.delete('/api/admin/services/:id', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const serviceId = parseInt(req.params.id);
  const index = services.findIndex(s => s.id === serviceId);
  
  if (index === -1) return res.status(404).json({ message: 'Service not found' });
  
  services.splice(index, 1);
  res.json({ success: true });
});

// ===== PROCESS ROUTES =====
// Get all process steps (public endpoint - only active steps)
app.get('/api/processes', (req, res) => {
  const activeProcesses = processes
    .filter(p => p.isActive)
    .sort((a, b) => a.order - b.order);
  
  res.json({ processes: activeProcesses });
});

// Get single process step by id (public endpoint)
app.get('/api/processes/:id', (req, res) => {
  const process = processes.find(p => p.id === parseInt(req.params.id) && p.isActive);
  
  if (!process) {
    return res.status(404).json({ message: 'Process step not found' });
  }
  
  res.json(process);
});

// Get all process steps for admin (including inactive)
app.get('/api/admin/processes', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const sortedProcesses = [...processes].sort((a, b) => a.order - b.order);
  res.json({ processes: sortedProcesses });
});

// Create new process step
app.post('/api/admin/processes', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const {
    number,
    title,
    description,
    details,
    duration,
    icon,
    color,
    isActive,
    order
  } = req.body || {};
  
  if (!number || !title || !description || !duration) {
    return res.status(400).json({ 
      message: 'Number, title, description, and duration are required' 
    });
  }
  
  const newProcess = {
    id: processes.length > 0 ? Math.max(...processes.map(p => p.id)) + 1 : 1,
    number,
    title,
    description,
    details: details || [],
    duration,
    icon: icon || 'Phone',
    color: color || 'from-blue-500/10 to-blue-600/10',
    isActive: isActive !== undefined ? isActive : true,
    order: order || 0,
    createdAt: new Date().toISOString(),
  };
  
  processes.push(newProcess);
  res.status(201).json(newProcess);
});

// Update process step
app.put('/api/admin/processes/:id', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const processId = parseInt(req.params.id);
  const index = processes.findIndex(p => p.id === processId);
  
  if (index === -1) return res.status(404).json({ message: 'Process step not found' });
  
  const {
    number,
    title,
    description,
    details,
    duration,
    icon,
    color,
    isActive,
    order
  } = req.body || {};
  
  processes[index] = {
    ...processes[index],
    number: number || processes[index].number,
    title: title || processes[index].title,
    description: description || processes[index].description,
    details: details || processes[index].details,
    duration: duration || processes[index].duration,
    icon: icon !== undefined ? icon : processes[index].icon,
    color: color !== undefined ? color : processes[index].color,
    isActive: isActive !== undefined ? isActive : processes[index].isActive,
    order: order !== undefined ? order : processes[index].order,
    updatedAt: new Date().toISOString(),
  };
  
  res.json(processes[index]);
});

// Toggle process step active status
app.patch('/api/admin/processes/:id/toggle', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const processId = parseInt(req.params.id);
  const process = processes.find(p => p.id === processId);
  
  if (!process) return res.status(404).json({ message: 'Process step not found' });
  
  process.isActive = req.body.isActive !== undefined ? req.body.isActive : !process.isActive;
  process.updatedAt = new Date().toISOString();
  
  res.json(process);
});

// Delete process step
app.delete('/api/admin/processes/:id', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const processId = parseInt(req.params.id);
  const index = processes.findIndex(p => p.id === processId);
  
  if (index === -1) return res.status(404).json({ message: 'Process step not found' });
  
  processes.splice(index, 1);
  res.json({ success: true });
});

// ===== TEAM ROUTES =====
// Get all team members (public endpoint - only active members)
app.get('/api/team', (req, res) => {
  const activeMembers = teamMembers
    .filter(m => m.isActive)
    .sort((a, b) => a.order - b.order);
  
  res.json({ members: activeMembers });
});

// Get single team member by id (public endpoint)
app.get('/api/team/:id', (req, res) => {
  const member = teamMembers.find(m => m.id === parseInt(req.params.id) && m.isActive);
  
  if (!member) {
    return res.status(404).json({ message: 'Team member not found' });
  }
  
  res.json(member);
});

// Get all team members for admin (including inactive)
app.get('/api/admin/team', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const sortedMembers = [...teamMembers].sort((a, b) => a.order - b.order);
  res.json({ members: sortedMembers });
});

// Create new team member
app.post('/api/admin/team', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const {
    name,
    role,
    title,
    bio,
    specialties,
    education,
    experience,
    email,
    phone,
    linkedin,
    imageUrl,
    isActive,
    order,
    languages,
    certifications,
    achievements
  } = req.body || {};
  
  if (!name || !role || !title || !bio || !email) {
    return res.status(400).json({ 
      message: 'Name, role, title, bio, and email are required' 
    });
  }
  
  const newMember = {
    id: teamMembers.length > 0 ? Math.max(...teamMembers.map(m => m.id)) + 1 : 1,
    name,
    role,
    title,
    bio,
    specialties: specialties || [],
    education: education || [],
    experience: experience || '',
    email,
    phone: phone || '',
    linkedin: linkedin || '',
    imageUrl: imageUrl || '',
    isActive: isActive !== undefined ? isActive : true,
    order: order || 0,
    languages: languages || [],
    certifications: certifications || [],
    achievements: achievements || [],
    createdAt: new Date().toISOString(),
  };
  
  teamMembers.push(newMember);
  res.status(201).json(newMember);
});

// Update team member
app.put('/api/admin/team/:id', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const memberId = parseInt(req.params.id);
  const index = teamMembers.findIndex(m => m.id === memberId);
  
  if (index === -1) return res.status(404).json({ message: 'Team member not found' });
  
  const {
    name,
    role,
    title,
    bio,
    specialties,
    education,
    experience,
    email,
    phone,
    linkedin,
    imageUrl,
    isActive,
    order,
    languages,
    certifications,
    achievements
  } = req.body || {};
  
  teamMembers[index] = {
    ...teamMembers[index],
    name: name || teamMembers[index].name,
    role: role || teamMembers[index].role,
    title: title || teamMembers[index].title,
    bio: bio || teamMembers[index].bio,
    specialties: specialties || teamMembers[index].specialties,
    education: education || teamMembers[index].education,
    experience: experience !== undefined ? experience : teamMembers[index].experience,
    email: email || teamMembers[index].email,
    phone: phone !== undefined ? phone : teamMembers[index].phone,
    linkedin: linkedin !== undefined ? linkedin : teamMembers[index].linkedin,
    imageUrl: imageUrl !== undefined ? imageUrl : teamMembers[index].imageUrl,
    isActive: isActive !== undefined ? isActive : teamMembers[index].isActive,
    order: order !== undefined ? order : teamMembers[index].order,
    languages: languages || teamMembers[index].languages,
    certifications: certifications || teamMembers[index].certifications,
    achievements: achievements || teamMembers[index].achievements,
    updatedAt: new Date().toISOString(),
  };
  
  res.json(teamMembers[index]);
});

// Toggle team member active status
app.patch('/api/admin/team/:id/toggle', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const memberId = parseInt(req.params.id);
  const member = teamMembers.find(m => m.id === memberId);
  
  if (!member) return res.status(404).json({ message: 'Team member not found' });
  
  member.isActive = req.body.isActive !== undefined ? req.body.isActive : !member.isActive;
  member.updatedAt = new Date().toISOString();
  
  res.json(member);
});

// Delete team member
app.delete('/api/admin/team/:id', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const memberId = parseInt(req.params.id);
  const index = teamMembers.findIndex(m => m.id === memberId);
  
  if (index === -1) return res.status(404).json({ message: 'Team member not found' });
  
  teamMembers.splice(index, 1);
  res.json({ success: true });
});

// ===== TESTIMONIALS ROUTES =====
// Get all testimonials (public endpoint - only active testimonials)
app.get('/api/testimonials', (req, res) => {
  const activeTestimonials = testimonials
    .filter(t => t.isActive)
    .sort((a, b) => a.order - b.order);
  
  res.json({ testimonials: activeTestimonials });
});

// Get featured testimonials (public endpoint)
app.get('/api/testimonials/featured', (req, res) => {
  const featuredTestimonials = testimonials
    .filter(t => t.isActive && t.isFeatured)
    .sort((a, b) => a.order - b.order);
  
  res.json({ testimonials: featuredTestimonials });
});

// Get single testimonial by id (public endpoint)
app.get('/api/testimonials/:id', (req, res) => {
  const testimonial = testimonials.find(t => t.id === parseInt(req.params.id) && t.isActive);
  
  if (!testimonial) {
    return res.status(404).json({ message: 'Testimonial not found' });
  }
  
  res.json(testimonial);
});

// Get all testimonials for admin (including inactive)
app.get('/api/admin/testimonials', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const sortedTestimonials = [...testimonials].sort((a, b) => a.order - b.order);
  res.json({ testimonials: sortedTestimonials });
});

// Create new testimonial
app.post('/api/admin/testimonials', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const {
    clientName,
    clientRole,
    clientCompany,
    clientImage,
    rating,
    testimonial,
    caseType,
    date,
    isActive,
    isFeatured,
    order
  } = req.body || {};
  
  if (!clientName || !clientRole || !clientCompany || !testimonial || !caseType) {
    return res.status(400).json({ 
      message: 'Client name, role, company, testimonial, and case type are required' 
    });
  }
  
  const newTestimonial = {
    id: testimonials.length > 0 ? Math.max(...testimonials.map(t => t.id)) + 1 : 1,
    clientName,
    clientRole,
    clientCompany,
    clientImage: clientImage || '',
    rating: rating || 5,
    testimonial,
    caseType,
    date: date || new Date().toISOString().split('T')[0],
    isActive: isActive !== undefined ? isActive : true,
    isFeatured: isFeatured !== undefined ? isFeatured : false,
    order: order || 0,
    createdAt: new Date().toISOString(),
  };
  
  testimonials.push(newTestimonial);
  res.status(201).json(newTestimonial);
});

// Update testimonial
app.put('/api/admin/testimonials/:id', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const testimonialId = parseInt(req.params.id);
  const index = testimonials.findIndex(t => t.id === testimonialId);
  
  if (index === -1) return res.status(404).json({ message: 'Testimonial not found' });
  
  const {
    clientName,
    clientRole,
    clientCompany,
    clientImage,
    rating,
    testimonial,
    caseType,
    date,
    isActive,
    isFeatured,
    order
  } = req.body || {};
  
  testimonials[index] = {
    ...testimonials[index],
    clientName: clientName || testimonials[index].clientName,
    clientRole: clientRole || testimonials[index].clientRole,
    clientCompany: clientCompany || testimonials[index].clientCompany,
    clientImage: clientImage !== undefined ? clientImage : testimonials[index].clientImage,
    rating: rating !== undefined ? rating : testimonials[index].rating,
    testimonial: testimonial || testimonials[index].testimonial,
    caseType: caseType || testimonials[index].caseType,
    date: date || testimonials[index].date,
    isActive: isActive !== undefined ? isActive : testimonials[index].isActive,
    isFeatured: isFeatured !== undefined ? isFeatured : testimonials[index].isFeatured,
    order: order !== undefined ? order : testimonials[index].order,
    updatedAt: new Date().toISOString(),
  };
  
  res.json(testimonials[index]);
});

// Toggle testimonial active status
app.patch('/api/admin/testimonials/:id/toggle', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const testimonialId = parseInt(req.params.id);
  const testimonial = testimonials.find(t => t.id === testimonialId);
  
  if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
  
  testimonial.isActive = req.body.isActive !== undefined ? req.body.isActive : !testimonial.isActive;
  testimonial.updatedAt = new Date().toISOString();
  
  res.json(testimonial);
});

// Toggle testimonial featured status
app.patch('/api/admin/testimonials/:id/featured', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const testimonialId = parseInt(req.params.id);
  const testimonial = testimonials.find(t => t.id === testimonialId);
  
  if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
  
  testimonial.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : !testimonial.isFeatured;
  testimonial.updatedAt = new Date().toISOString();
  
  res.json(testimonial);
});

// Delete testimonial
app.delete('/api/admin/testimonials/:id', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const testimonialId = parseInt(req.params.id);
  const index = testimonials.findIndex(t => t.id === testimonialId);
  
  if (index === -1) return res.status(404).json({ message: 'Testimonial not found' });
  
  testimonials.splice(index, 1);
  res.json({ success: true });
});

// ===== ANNOUNCEMENTS ROUTES =====
// Get all announcements (public endpoint - only active announcements)
app.get('/api/announcements', (req, res) => {
  const activeAnnouncements = announcements
    .filter(a => a.isActive)
    .sort((a, b) => a.order - b.order);
  
  res.json(activeAnnouncements);
});

// Get featured announcements (public endpoint)
app.get('/api/announcements/featured', (req, res) => {
  const featuredAnnouncements = announcements
    .filter(a => a.isActive && a.isFeatured)
    .sort((a, b) => a.order - b.order);
  
  res.json(featuredAnnouncements);
});

// Get single announcement by id (public endpoint)
app.get('/api/announcements/:id', (req, res) => {
  const announcement = announcements.find(a => a.id === req.params.id && a.isActive);
  
  if (!announcement) {
    return res.status(404).json({ message: 'Announcement not found' });
  }
  
  res.json(announcement);
});

// Get all announcements for admin (including inactive)
app.get('/api/admin/announcements', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const sortedAnnouncements = [...announcements].sort((a, b) => a.order - b.order);
  res.json(sortedAnnouncements);
});

// Create new announcement
app.post('/api/admin/announcements', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const {
    title,
    description,
    content,
    type,
    icon,
    color,
    startDate,
    endDate,
    isActive,
    isFeatured,
    order,
    link,
    imageUrl
  } = req.body || {};
  
  if (!title || !description || !content || !type || !startDate || !endDate) {
    return res.status(400).json({ 
      message: 'Title, description, content, type, start date, and end date are required' 
    });
  }
  
  const newAnnouncement = {
    id: announcements.length > 0 ? String(Math.max(...announcements.map(a => parseInt(a.id))) + 1) : '1',
    title,
    description,
    content,
    type,
    icon: icon || 'Megaphone',
    color: color || 'from-blue-500 to-blue-600',
    startDate,
    endDate,
    isActive: isActive !== undefined ? isActive : true,
    isFeatured: isFeatured !== undefined ? isFeatured : false,
    order: order || 0,
    link: link || '',
    imageUrl: imageUrl || '',
    createdAt: new Date().toISOString(),
  };
  
  announcements.push(newAnnouncement);
  res.status(201).json(newAnnouncement);
});

// Update announcement
app.put('/api/admin/announcements/:id', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const announcementId = req.params.id;
  const index = announcements.findIndex(a => a.id === announcementId);
  
  if (index === -1) return res.status(404).json({ message: 'Announcement not found' });
  
  const {
    title,
    description,
    content,
    type,
    icon,
    color,
    startDate,
    endDate,
    isActive,
    isFeatured,
    order,
    link,
    imageUrl
  } = req.body || {};
  
  announcements[index] = {
    ...announcements[index],
    title: title || announcements[index].title,
    description: description || announcements[index].description,
    content: content || announcements[index].content,
    type: type || announcements[index].type,
    icon: icon !== undefined ? icon : announcements[index].icon,
    color: color !== undefined ? color : announcements[index].color,
    startDate: startDate || announcements[index].startDate,
    endDate: endDate || announcements[index].endDate,
    isActive: isActive !== undefined ? isActive : announcements[index].isActive,
    isFeatured: isFeatured !== undefined ? isFeatured : announcements[index].isFeatured,
    order: order !== undefined ? order : announcements[index].order,
    link: link !== undefined ? link : announcements[index].link,
    imageUrl: imageUrl !== undefined ? imageUrl : announcements[index].imageUrl,
    updatedAt: new Date().toISOString(),
  };
  
  res.json(announcements[index]);
});

// Toggle announcement active status
app.patch('/api/admin/announcements/:id/toggle', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const announcementId = req.params.id;
  const announcement = announcements.find(a => a.id === announcementId);
  
  if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
  
  announcement.isActive = req.body.isActive !== undefined ? req.body.isActive : !announcement.isActive;
  announcement.updatedAt = new Date().toISOString();
  
  res.json(announcement);
});

// Toggle announcement featured status
app.patch('/api/admin/announcements/:id/featured', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const announcementId = req.params.id;
  const announcement = announcements.find(a => a.id === announcementId);
  
  if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
  
  announcement.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : !announcement.isFeatured;
  announcement.updatedAt = new Date().toISOString();
  
  res.json(announcement);
});

// Delete announcement
app.delete('/api/admin/announcements/:id', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const announcementId = req.params.id;
  const index = announcements.findIndex(a => a.id === announcementId);
  
  if (index === -1) return res.status(404).json({ message: 'Announcement not found' });
  
  announcements.splice(index, 1);
  res.json({ success: true });
});

// ===== BUSINESS HOURS ROUTES =====

// Get business hours (public)
app.get('/api/business-hours', (req, res) => {
  res.json(businessHours);
});

// Update business hours (admin only)
app.put('/api/admin/business-hours', authMiddleware, (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const { schedule, specialNote, holidayNote } = req.body;
  
  if (!schedule || !Array.isArray(schedule)) {
    return res.status(400).json({ message: 'Schedule is required and must be an array' });
  }
  
  businessHours = {
    schedule,
    specialNote: specialNote || '',
    holidayNote: holidayNote || ''
  };
  
  res.json(businessHours);
});

// ===== PROFILE ROUTES =====

// Update admin profile
app.put('/api/admin/profile', authMiddleware, async (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  
  const { name, email, currentPassword, newPassword } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  // Vérifier si l'utilisateur existe
  const adminUser = users.find(u => u.id === req.user.id);
  if (!adminUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Si l'utilisateur veut changer le mot de passe
  if (currentPassword && newPassword) {
    const isValidPassword = await bcrypt.compare(currentPassword, adminUser.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    // Hash le nouveau mot de passe
    adminUser.password = await bcrypt.hash(newPassword, 10);
  }

  // Mettre à jour les informations
  adminUser.name = name;
  adminUser.email = email;

  res.json({ 
    message: 'Profile updated successfully',
    user: {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      isAdmin: adminUser.isAdmin
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Auth server listening on http://localhost:${PORT}`);
  console.log(`📧 Login with: admin@axe.local`);
  console.log(`🔑 Password: ChangeMe123!`);
});
