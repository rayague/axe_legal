import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import { 
  Scale,
  Heart,
  Home,
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  Car,
  Building,
  CreditCard,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  ChevronRight,
  Info
} from "lucide-react";
import heroLegal from "@/assets/hero-legal.jpg";

const legalCategories = [
  {
    id: "family",
    icon: Heart,
    title: "Droit de la Famille",
    description: "Divorce, garde d'enfants, pension alimentaire",
    color: "from-pink-500/10 to-pink-600/10",
    borderColor: "hover:border-pink-500/50"
  },
  {
    id: "real-estate",
    icon: Home,
    title: "Droit Immobilier",
    description: "Achat, vente, location, litiges fonciers",
    color: "from-blue-500/10 to-blue-600/10",
    borderColor: "hover:border-blue-500/50"
  },
  {
    id: "business",
    icon: Briefcase,
    title: "Droit des Affaires",
    description: "Création d'entreprise, contrats commerciaux",
    color: "from-purple-500/10 to-purple-600/10",
    borderColor: "hover:border-purple-500/50"
  },
  {
    id: "labor",
    icon: Users,
    title: "Droit du Travail",
    description: "Licenciement, contrat de travail, conflits",
    color: "from-green-500/10 to-green-600/10",
    borderColor: "hover:border-green-500/50"
  },
  {
    id: "contracts",
    icon: FileText,
    title: "Droit des Contrats",
    description: "Rédaction, rupture, litiges contractuels",
    color: "from-orange-500/10 to-orange-600/10",
    borderColor: "hover:border-orange-500/50"
  },
  {
    id: "succession",
    icon: TrendingUp,
    title: "Succession & Héritage",
    description: "Testament, partage, droits de succession",
    color: "from-yellow-500/10 to-yellow-600/10",
    borderColor: "hover:border-yellow-500/50"
  },
  {
    id: "accident",
    icon: Car,
    title: "Accidents & Préjudices",
    description: "Indemnisation, responsabilité civile",
    color: "from-red-500/10 to-red-600/10",
    borderColor: "hover:border-red-500/50"
  },
  {
    id: "construction",
    icon: Building,
    title: "Droit de la Construction",
    description: "Malfaçons, retards, garanties",
    color: "from-teal-500/10 to-teal-600/10",
    borderColor: "hover:border-teal-500/50"
  },
  {
    id: "debt",
    icon: CreditCard,
    title: "Recouvrement de Créances",
    description: "Dettes impayées, procédures de recouvrement",
    color: "from-indigo-500/10 to-indigo-600/10",
    borderColor: "hover:border-indigo-500/50"
  }
];

// Base de connaissances juridiques avec toutes les démarches
const legalGuidance: Record<string, {
  title: string;
  steps: { title: string; description: string; }[];
  documents: string[];
  timeline: string;
  cost: string;
  warning?: string;
}> = {
  family: {
    title: "Divorce et Droit de la Famille",
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
    warning: "La garde des enfants et leur intérêt supérieur sont prioritaires dans toute décision."
  },
  "real-estate": {
    title: "Droit Immobilier",
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
    warning: "Toujours faire vérifier le titre de propriété par un professionnel avant tout engagement."
  },
  business: {
    title: "Droit des Affaires",
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
    warning: "Le choix de la forme juridique a des implications fiscales et juridiques importantes."
  },
  labor: {
    title: "Droit du Travail",
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
    warning: "Respectez les délais de prescription pour agir en justice (généralement 2 ans)."
  },
  contracts: {
    title: "Droit des Contrats",
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
    warning: "Vérifiez les clauses de résolution et les juridictions compétentes dans votre contrat."
  },
  succession: {
    title: "Succession et Héritage",
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
    warning: "Les droits de succession doivent être payés dans les 6 mois pour éviter les pénalités."
  },
  accident: {
    title: "Accidents et Préjudices",
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
    warning: "Ne signez aucune transaction avec l'assurance sans l'avis d'un avocat."
  },
  construction: {
    title: "Droit de la Construction",
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
    warning: "Les garanties ont des délais : parfait achèvement (1 an), biennale (2 ans), décennale (10 ans)."
  },
  debt: {
    title: "Recouvrement de Créances",
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
    warning: "La prescription est de 5 ans pour les créances commerciales."
  }
};

const LegalTech = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showGuidance, setShowGuidance] = useState(false);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowGuidance(true);
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setShowGuidance(false);
  };

  const currentGuidance = selectedCategory ? legalGuidance[selectedCategory] : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageHero
          eyebrow="Assistant Juridique Intelligent"
          title={(
            <>
              Simulateur de <span className="text-yellow-400">Démarches</span><br />
              Juridiques
            </>
          )}
          subtitle={"Découvrez les démarches juridiques adaptées à votre situation en quelques clics. Notre système vous guide étape par étape dans la résolution de vos problèmes légaux."}
          ctaText="Commencer la simulation"
          ctaLink="#simulation"
          imageSrc={heroLegal}
          large
        />

        {!showGuidance && (
          <section className="py-16 bg-gradient-to-b from-background to-primary/5" id="simulation">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6 mb-12">
              <Badge className="mb-4" variant="outline">
                <Scale className="h-4 w-4 mr-2" />
                Simulation Gratuite
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Quelle est la <span className="text-primary">Nature</span> de Votre Problème ?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Sélectionnez la catégorie qui correspond le mieux à votre situation pour obtenir 
                un guide complet des démarches juridiques à entreprendre.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {legalCategories.map((category) => (
                  <Card
                    key={category.id}
                    className={`p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 ${category.borderColor} group bg-gradient-to-br ${category.color} hover:scale-[1.02]`}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <div className="space-y-4">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors group-hover:scale-110 duration-300">
                        <category.icon className="h-7 w-7 text-primary" />
                      </div>

                      <div>
                        <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {category.description}
                        </p>
                      </div>

                      <div className="flex items-center text-sm text-primary font-medium group-hover:translate-x-2 transition-transform">
                        Voir les démarches
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="max-w-4xl mx-auto mt-12">
              <Alert className="border-primary/50 bg-primary/5">
                <AlertCircle className="h-5 w-5 text-primary" />
                <AlertDescription>
                  <p className="font-semibold mb-2">Votre situation n'est pas listée ?</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Chaque cas juridique est unique. Si votre problème ne figure pas dans les catégories ci-dessus, 
                    nous vous invitons à contacter directement notre cabinet pour une consultation personnalisée.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm" asChild>
                      <Link to="/consultation">
                        <Phone className="h-4 w-4 mr-2" />
                        Demander une consultation
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/contact">
                        <Mail className="h-4 w-4 mr-2" />
                        Nous contacter
                      </Link>
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </section>
        )}

        {showGuidance && currentGuidance && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="mb-8"
                >
                  <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                  Choisir une autre catégorie
                </Button>

                <div className="mb-12">
                  <h2 className="text-4xl font-bold mb-6">{currentGuidance.title}</h2>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200">
                      <div className="text-sm text-muted-foreground mb-1">Délai estimé</div>
                      <div className="font-semibold">{currentGuidance.timeline}</div>
                    </Card>
                    <Card className="p-4 bg-green-50 dark:bg-green-950 border-green-200">
                      <div className="text-sm text-muted-foreground mb-1">Coût indicatif</div>
                      <div className="font-semibold">{currentGuidance.cost}</div>
                    </Card>
                    <Card className="p-4 bg-purple-50 dark:bg-purple-950 border-purple-200">
                      <div className="text-sm text-muted-foreground mb-1">Documents requis</div>
                      <div className="font-semibold">{currentGuidance.documents.length} pièces</div>
                    </Card>
                  </div>

                  {currentGuidance.warning && (
                    <Alert className="border-orange-500/50 bg-orange-50 dark:bg-orange-950">
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                      <AlertDescription className="text-orange-900 dark:text-orange-100">
                        <strong>Point d'attention :</strong> {currentGuidance.warning}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-6 w-6 text-primary" />
                      Les Étapes de la Procédure
                    </CardTitle>
                    <CardDescription>
                      Suivez ce processus étape par étape pour résoudre votre situation juridique
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {currentGuidance.steps.map((step, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary border-2 border-primary/20">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1 pb-6 border-b last:border-0">
                            <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-6 w-6 text-primary" />
                      Documents à Préparer
                    </CardTitle>
                    <CardDescription>
                      Liste complète des pièces justificatives nécessaires
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {currentGuidance.documents.map((doc, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-6 w-6 text-primary" />
                      Nos Recommandations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                      <p className="text-sm">
                        <strong>Ne tardez pas :</strong> Plus vous agissez rapidement, plus vos chances de succès sont élevées. 
                        Certaines actions juridiques sont soumises à des délais stricts.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                      <p className="text-sm">
                        <strong>Consultez un professionnel :</strong> Cette simulation est informative. Chaque situation est unique 
                        et mérite une analyse personnalisée par un avocat spécialisé.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                      <p className="text-sm">
                        <strong>Préparez votre dossier :</strong> Rassemblez tous les documents avant votre première consultation 
                        pour gagner du temps et faciliter le travail de votre avocat.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-12 p-8 bg-gradient-to-br from-primary via-primary/95 to-primary/90 rounded-xl text-white">
                  <div className="text-center space-y-6">
                    <h3 className="text-2xl md:text-3xl font-bold">
                      Besoin d'un Accompagnement Personnalisé ?
                    </h3>
                    <p className="text-white/90 max-w-2xl mx-auto">
                      Notre équipe d'avocats spécialisés est à votre disposition pour vous accompagner 
                      dans toutes vos démarches juridiques. Prenez rendez-vous dès maintenant pour une 
                      consultation adaptée à votre situation.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                        <Link to="/consultation">
                          <Phone className="mr-2 h-5 w-5" />
                          Prendre rendez-vous
                        </Link>
                      </Button>
                      <Button size="lg" className="bg-white/20 text-white border-2 border-white hover:bg-white hover:text-primary transition-all" asChild>
                        <Link to="/contact">
                          <Mail className="mr-2 h-5 w-5" />
                          Nous contacter
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {!showGuidance && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Une Assistance Juridique Complète
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                Notre simulateur vous offre un aperçu des démarches juridiques nécessaires. 
                Pour un accompagnement complet et personnalisé, notre équipe d'avocats est à votre disposition.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/consultation">
                    <Phone className="mr-2 h-5 w-5" />
                    Prendre rendez-vous
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">
                    <Mail className="mr-2 h-5 w-5" />
                    Nous contacter
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default LegalTech;
