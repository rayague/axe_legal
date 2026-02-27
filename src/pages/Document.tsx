import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useParams } from "react-router-dom";

type DocSection =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "numbered"; items: { title: string; bullets: string[] }[] };

type Doc = {
  slug: string;
  title: { fr: string; en: string };
  sections: { fr: DocSection[]; en: DocSection[] };
};

const docs: Doc[] = [
  {
    slug: "notes-usage-consultation-juridique",
    title: {
      fr: "CONSEILS POUR BIEN PROFITER DES SERVICES DE VOTRE JURISTE, AXE LEGAL",
      en: "TIPS TO MAKE THE MOST OF YOUR LEGAL ADVISOR’S SERVICES (AXE LEGAL)",
    },
    sections: {
      fr: [
        {
          type: "paragraph",
          text: "Engager AXE LEGAL peut être une étape cruciale pour résoudre des problèmes juridiques, pour obtenir des conseils avisés, pour bien s’orienter dans la gouvernance de vos affaires. Pour tirer le meilleur parti de cette collaboration, voici quelques conseils pratiques :",
        },
        {
          type: "numbered",
          items: [
            {
              title: "Justification du choix du cabinet juridique",
              bullets: [
                "Spécialisation : Une expertise juridique pertinente à votre situation (droit des affaires, fiscalité, droit foncier, droit du travail, etc.).",
                "Première consultation : Utilisez-la pour évaluer notre approche, notre communication et notre compréhension de vos besoins.",
              ],
            },
            {
              title: "Préparez-vous avant chaque rendez-vous",
              bullets: [
                "Rassemblez tous les documents : Collectez tous les documents pertinents (contrats, correspondances, preuves, rapports de réunion, etc.) et organisez-les de manière logique.",
                "Établissez une chronologie des faits : Notez les événements importants dans l'ordre de survenance. Cela aidera AXE LEGAL à comprendre rapidement la situation.",
                "Listez vos questions et objectifs : Préparez une liste claire de ce que vous attendez de notre expertise juridique et des questions que vous souhaitez poser.",
              ],
            },
            {
              title: "Communiquez efficacement",
              bullets: [
                "Soyez honnête et transparent : Ne cachez aucune information, même si elle vous semble défavorable. Le juriste a besoin de tous les éléments pour soigner au mieux vos intérêts.",
                "Soyez concis et précis : Exposez les faits clairement sans digressions inutiles.",
                "Posez des questions : N'hésitez pas à demander des clarifications si vous ne comprenez pas un terme juridique ou une procédure. Assurez-vous de bien comprendre les conseils donnés.",
                "Gardez une trace écrite : Confirmez les discussions importantes par e-mail pour avoir une trace des échanges et des décisions.",
                "La prévisibilité : Recherchez toujours le conseil juridique en amont ; le juriste ne peut être toujours un pompier. Plutôt le consulter avant la prise des décisions et, le cas échéant, avant exécution.",
                "Anticiper : Éviter de créer des urgences inutiles, c’est aider à gérer vos dossiers plus sereinement.",
              ],
            },
            {
              title: "Importance du prix",
              bullets: [
                "Une prospérité partagée : Soigner vos intérêts, c’est aussi s’épanouir dans son métier, pour le juriste ; votre prospérité et la sienne sont liées.",
                "Disponibilité et réactivité : Un juriste bien rémunéré est un partenaire disponible et réactif, capable de mobiliser tous les moyens propres et externes au profit de vos intérêts.",
                "Votre urgence : Elle a aussi un coût.",
              ],
            },
            {
              title: "Soyez patient et réaliste",
              bullets: [
                "Les procédures juridiques prennent du temps : Comprenez que les délais peuvent être longs et que les résultats ne sont pas toujours immédiats.",
                "Suivez les instructions : Respectez les délais et les demandes du juriste. Votre coopération est essentielle au succès de votre dossier.",
              ],
            },
            {
              title: "Soutenez une ligne morale professionnelle saine",
              bullets: [
                "Votre protection : Elle est gage de l’honnêteté et de l’intégrité que AXE LEGAL doit vouer à la relation que vous entretenez avec elle.",
                "La justice dans vos relations : Ne pas pousser AXE LEGAL, votre Conseil, à brimer les droits des autres et/ou à entretenir le faux et le flou. C’est aussi entretenir un environnement de respect des règlementations.",
              ],
            },
            {
              title: "Avant chaque choix, chaque décision",
              bullets: [
                "Quelles pourraient en être les avantages et inconvénients juridiques ?",
                "Quelles pourraient en être les suites en matière des impôts ?",
                "Quelles pourraient en être les impacts économiques sur vos affaires ?",
                "N’y aurait-il pas un encadrement juridique sur la question, un mécanisme de droit qui soigne au mieux nos intérêts ?",
                "Sommes-nous toujours dans les bons délais ?",
              ],
            },
          ],
        },
        {
          type: "callout",
          text: "En suivant ces conseils, vous optimiserez votre relation avec votre juriste et augmenterez vos chances d'obtenir un résultat favorable. N'hésitez pas si vous avez d'autres questions !",
        },
      ],
      en: [
        {
          type: "paragraph",
          text: "Working with AXE LEGAL can be a crucial step to resolve legal issues, obtain sound advice, and make better decisions in the governance of your business. To get the most out of this collaboration, here are practical recommendations:",
        },
        {
          type: "numbered",
          items: [
            {
              title: "Why you chose the firm",
              bullets: [
                "Specialization: Relevant legal expertise for your situation (business law, taxation, land law, labor law, etc.).",
                "First consultation: Use it to assess our approach, communication and understanding of your needs.",
              ],
            },
            {
              title: "Prepare before every meeting",
              bullets: [
                "Gather all documents: Collect and organize all relevant documents (contracts, correspondence, evidence, meeting minutes, etc.).",
                "Build a timeline: List key events in chronological order so AXE LEGAL can quickly understand the context.",
                "List your questions and objectives: Clearly define what you expect from our legal expertise and what you want to ask.",
              ],
            },
            {
              title: "Communicate effectively",
              bullets: [
                "Be honest and transparent: Do not hide information, even if it seems unfavorable. Your legal advisor needs every element to best protect your interests.",
                "Be concise and precise: Present facts clearly, without unnecessary digressions.",
                "Ask questions: Request clarification whenever a legal term or procedure is unclear. Make sure you understand the advice given.",
                "Keep written records: Confirm important discussions by email to keep track of exchanges and decisions.",
                "Predictability: Seek legal advice early; a legal advisor cannot always act as a firefighter. Consult before making decisions and, when applicable, before execution.",
                "Anticipate: Avoid creating unnecessary emergencies; it helps manage your matters more calmly.",
              ],
            },
            {
              title: "Why pricing matters",
              bullets: [
                "Shared prosperity: Protecting your interests is also professional fulfillment for the legal advisor; your prosperity and theirs are linked.",
                "Availability and responsiveness: A fairly compensated legal advisor can remain available and responsive, mobilizing the right resources for your interests.",
                "Urgency has a cost.",
              ],
            },
            {
              title: "Be patient and realistic",
              bullets: [
                "Legal procedures take time: Timelines can be long and results are not always immediate.",
                "Follow instructions: Respect deadlines and requests. Your cooperation is essential to the success of your matter.",
              ],
            },
            {
              title: "Support a healthy professional moral line",
              bullets: [
                "Your protection: It is a guarantee of the honesty and integrity AXE LEGAL must uphold in the relationship you maintain with us.",
                "Fairness in your relationships: Do not push your counsel to harm others’ rights or to maintain falsehood and ambiguity. It helps preserve an environment of compliance.",
              ],
            },
            {
              title: "Before each choice, each decision",
              bullets: [
                "What are the possible legal advantages and disadvantages?",
                "What could be the tax consequences?",
                "What could be the economic impact on your business?",
                "Is there a legal framework or mechanism that best protects our interests?",
                "Are we still within the right deadlines?",
              ],
            },
          ],
        },
        {
          type: "callout",
          text: "By following these recommendations, you will optimize your relationship with your legal advisor and increase your chances of a favorable outcome. Feel free to reach out if you have any questions.",
        },
      ],
    },
  },
  {
    slug: "notes-usage-conseil-service-juridiq-v2",
    title: {
      fr: "NE LAISSEZ RIEN HORS DE L’EXPERTISE JURIDIQUE DE AXE LEGAL",
      en: "LEAVE NOTHING OUTSIDE AXE LEGAL’S LEGAL EXPERTISE",
    },
    sections: {
      fr: [
        { type: "paragraph", text: "Vos affaires ont tout à y gagner :" },
        {
          type: "numbered",
          items: [
            {
              title: "Création et Structure d'Entreprise",
              bullets: [
                "Choix de la forme juridique, avantages et inconvénients de chaque forme en fonction de votre activité, l’intérêts des associés, du capital et de vos objectifs à long terme. Les régimes d’imposition et les avantages possibles.",
                "Statuts et formalités diverses : points essentiels à inclure, organisation des pouvoirs, clauses spécifiques utiles (agrément, exclusion…), formalités diverses.",
                "Autre accord entre sociétaires : quel associé/actionnaire peut faire quoi et comment ? ; clarifier la situation financière et juridique du dirigeant à la fois associé ou non ; définir le sort de ce que chacun apporte outre sa part dans le capital.",
              ],
            },
            {
              title: "Contrats Commerciaux",
              bullets: [
                "Rédaction et négociation de contrats : quel contrat convient à telle relation, la sécurité des intérêts, prévenir l’insolvabilité, la protection des parties lors des discussions d’avant contrat, etc.",
                "Gestion des litiges contractuels : conseils sur les recours possibles en cas de non-exécution ou de mauvaise exécution d'un contrat.",
              ],
            },
            {
              title: "Relation avec les salariés",
              bullets: [
                "Contrats de travail : CDI, CDD, temps partiel, clauses spécifiques, etc., lequel convient à vos besoins ? Durée minimale de service après une formation à vos frais ? Trouver les moyens de rupture sûrs. Tenir usage légal du contrat de prestation.",
                "Pouvoir d’employeur : obligation, contenu, procédure de mise en place d’un règlement intérieur légal. Gestion des procédures disciplinaires, licenciements (éviter-prévenir les conflits, procédures à respecter).",
                "Plan de réduction du personnel : anticiper les difficultés économiques. Réduire le personnel en évitant au possible le chômage, disposer de plan de retour ou de maintien des compétences à fort potentiel.",
              ],
            },
            {
              title: "Propriété intellectuelle",
              bullets: [
                "Protection diverses (marques, brevets, nom commercial, procédé technique) ; dépôt, surveillance, défense contre la contrefaçon, étendue de la protection.",
                "Droits d'auteur : protection des oeuvres, contrats de cession de droits.",
                "Protection des noms de domaine.",
              ],
            },
            {
              title: "Prévention des infractions économiques, numériques et blanchiment",
              bullets: [
                "Données personnelles : audit de conformité, mise en place des procédures, désignation d'un Délégué à la Protection des Données (DPO).",
                "Lutte contre la corruption et le blanchiment d'argent : prévenir, éviter, disposer de mesures de surveillance et de dissuasion des ordonnateurs et décideurs de l’entreprise ; mieux s’informer sur les choix de l’entreprise pouvant placer les dirigeants et associés sous poursuite pénale.",
                "Conformité dans votre secteur : réglementations spécifiques à votre domaine d'activité (numérique, restauration, énergie, finance, alimentaire, etc.).",
              ],
            },
            {
              title: "Financement et rentabilité des affaires",
              bullets: [
                "Exonérations d’impôts à long terme : se structurer pour être éligible aux régimes du code l’investissement béninois, faire le choix d’installation dans une zone économique spécialisée, ou s’organiser en quête des mesures d’incitation fiscale.",
                "Paiement du juste impôt : opérer des dépenses et produire du revenu, monter des contrats axés sur l’optimisation fiscale ; bien gérer le contrôle et le redressement fiscal, avoir une relation fiscale moins couteuse ; filiale et société mère, holding, quel montage ?",
                "Attraction du financement : mettre en place une gouvernance attractive. Du financeur institutionnel à l’apport individuel, apport des associés (anciens/nouveaux).",
                "Externaliser des fonctions : optimiser les coûts et charges diverses.",
              ],
            },
            {
              title: "Prévention et Gestion des Risques et des Litiges",
              bullets: [
                "Médiation et arbitrage : alternatives aux procédures judiciaires en règlement des conflits.",
                "Recouvrement de créances : procédures amiables et judiciaires. Responsabilité civile et pénale du dirigeant.",
                "Gestion des difficultés de l'entreprise : prévention, redressement judiciaire.",
              ],
            },
          ],
        },
        {
          type: "callout",
          text: "Tel l’être humain, la santé de vos affaires dépend des informations que vous soumettez à la lumière de votre Conseil",
        },
      ],
      en: [
        {
          type: "paragraph",
          text: "Your business has everything to gain:",
        },
        {
          type: "numbered",
          items: [
            {
              title: "Company creation and structure",
              bullets: [
                "Choice of legal form: advantages and drawbacks depending on your activity, partners’ interests, capital structure and long-term objectives. Tax regimes and possible benefits.",
                "Articles and formalities: key clauses to include, governance structure, useful specific clauses (approval, exclusion, etc.), and related formalities.",
                "Additional partner agreements: who can do what and how; clarify the financial and legal position of the manager (whether shareholder or not); define what happens to each party’s contributions beyond capital.",
              ],
            },
            {
              title: "Commercial contracts",
              bullets: [
                "Drafting and negotiation: choosing the right contract for each relationship, securing interests, preventing insolvency, protecting parties during pre-contract discussions, etc.",
                "Contract disputes: guidance on available remedies in case of non-performance or improper performance.",
              ],
            },
            {
              title: "Employment relations",
              bullets: [
                "Employment contracts: permanent, fixed-term, part-time, specific clauses, etc. Which fits your needs? Minimum service duration after training financed by the employer? Secure termination mechanisms. Proper use of service agreements.",
                "Employer powers: obligations, content and procedure to implement a compliant internal regulation. Managing disciplinary procedures and dismissals (preventing conflicts, required procedures).",
                "Workforce reduction plan: anticipate economic difficulties. Reduce staff while avoiding unemployment when possible, and set up retention/return plans for high-potential skills.",
              ],
            },
            {
              title: "Intellectual property",
              bullets: [
                "Various protections (trademarks, patents, trade name, technical processes): filing, monitoring, anti-counterfeiting defense, scope of protection.",
                "Copyright: protection of works and rights assignment agreements.",
                "Domain name protection.",
              ],
            },
            {
              title: "Prevention of economic, digital and money-laundering offences",
              bullets: [
                "Personal data: compliance audit, implementation of procedures, appointment of a Data Protection Officer (DPO).",
                "Anti-corruption and anti-money laundering: prevent and deter; set up monitoring measures for decision-makers; stay informed about choices that could expose executives and shareholders to criminal prosecution.",
                "Sector compliance: specific regulations for your industry (digital, food services, energy, finance, agri-food, etc.).",
              ],
            },
            {
              title: "Business financing and profitability",
              bullets: [
                "Long-term tax exemptions: structure to qualify for incentives under Benin’s investment code, choose installation in a specialized economic zone, or organize to benefit from tax incentive measures.",
                "Paying the right tax: manage expenses and revenues, build contracts aimed at tax optimization; handle audits and adjustments; reduce tax costs; subsidiary and parent company, holding structures—what setup fits best?",
                "Attracting financing: build attractive governance—from institutional financing to individual investment; contributions from existing/new partners.",
                "Outsourcing functions: optimize costs and various charges.",
              ],
            },
            {
              title: "Risk prevention and dispute management",
              bullets: [
                "Mediation and arbitration: alternatives to court proceedings for dispute resolution.",
                "Debt recovery: amicable and judicial procedures. Civil and criminal liability of executives.",
                "Business difficulties: prevention and judicial reorganization.",
              ],
            },
          ],
        },
        {
          type: "callout",
          text: "Like a human being, the health of your business depends on the information you bring to your counsel.",
        },
      ],
    },
  },
];

function renderSection(section: DocSection, idx: number) {
  if (section.type === "paragraph") {
    return (
      <p key={idx} className="text-slate-700 leading-relaxed">
        {section.text}
      </p>
    );
  }

  if (section.type === "callout") {
    return (
      <div
        key={idx}
        className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 via-background to-blue-50/30 p-5 md:p-6"
      >
        <p className="text-slate-800 leading-relaxed font-medium">{section.text}</p>
      </div>
    );
  }

  if (section.type === "heading") {
    return (
      <h2 key={idx} className="text-xl md:text-2xl font-bold text-slate-900 mt-8">
        {section.text}
      </h2>
    );
  }

  if (section.type === "list") {
    return (
      <ul key={idx} className="list-disc pl-5 space-y-2 text-slate-700">
        {section.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <ol key={idx} className="space-y-5">
      {section.items.map((item, i) => (
        <li key={i} className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
              {i + 1}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg md:text-xl font-bold text-slate-900">{item.title}</h3>
              <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                {item.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

const Document = () => {
  const { i18n } = useTranslation();
  const { slug } = useParams();

  const lang = (i18n.language || "fr").toLowerCase().startsWith("fr") ? "fr" : "en";

  const doc = useMemo(() => docs.find((d) => d.slug === slug), [slug]);

  if (!slug || !doc) {
    return <Navigate to="/services" replace />;
  }

  const sections = lang === "fr" ? doc.sections.fr : doc.sections.en;
  const title = lang === "fr" ? doc.title.fr : doc.title.en;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <section className="border-b border-primary/10 bg-gradient-to-br from-primary/5 via-background to-blue-50/30">
          <div className="container mx-auto px-4 py-10">
            <div className="flex flex-col gap-6">
              <div className="flex justify-center sm:justify-start">
                <Button variant="outline" size="sm" asChild className="bg-white/70">
                  <Link to="/services">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {lang === "fr" ? "Retour" : "Back"}
                  </Link>
                </Button>
              </div>

              <div className="mx-auto max-w-4xl text-center">
                <h1 className="text-2xl md:text-4xl font-display font-bold tracking-tight text-slate-900 text-balance">
                  {title}
                </h1>
                <p className="mt-3 text-sm md:text-base text-slate-600">
                  {lang === "fr" ? "Document utile" : "Useful document"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
                <div className="space-y-6">{sections.map(renderSection)}</div>

                <div className="mt-10 pt-6 border-t border-slate-200">
                  <div className="text-sm text-slate-600">
                    {lang === "fr" ? "Responsable" : "Responsible"}
                  </div>
                  <div className="text-lg font-semibold text-slate-900">Gbênankpon Carnis Hounvou</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Document;
