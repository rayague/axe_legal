import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t } = useTranslation();

  const faqs = [
    {
      question: t("faq.items.0.q", { defaultValue: "Combien coûte une consultation juridique ?" }),
      answer: t("faq.items.0.a", { defaultValue: "La première consultation est gratuite. Elle nous permet d'évaluer votre situation et de vous proposer un devis personnalisé adapté à vos besoins spécifiques. Nos tarifs sont transparents et compétitifs." })
    },
    {
      question: t("faq.items.1.q", { defaultValue: "Quels documents dois-je préparer pour ma première consultation ?" }),
      answer: t("faq.items.1.a", { defaultValue: "Pour optimiser notre rencontre, apportez tous les documents liés à votre affaire : contrats, courriers, preuves, jugements antérieurs, pièces d'identité, etc. Si vous n'avez pas tous les documents, ne vous inquiétez pas, nous vous guiderons." })
    },
    // {
    //   question: "Combien de temps dure une procédure juridique ?",
    //   answer: "La durée varie selon la complexité de l'affaire. Une procédure simple peut prendre 3 à 6 mois, tandis qu'un litige complexe peut s'étendre sur 12 à 24 mois. Nous vous tiendrons informé à chaque étape."
    // },
    {
      question: t("faq.items.2.q", { defaultValue: "Proposez-vous des facilités de paiement ?" }),
      answer: t("faq.items.2.a", { defaultValue: "Oui, nous comprenons que les frais juridiques peuvent représenter un investissement. Nous proposons des plans de paiement flexibles et des forfaits adaptés à votre budget. Contactez-nous pour discuter des options." })
    },
    {
      question: t("faq.items.3.q", { defaultValue: "Puis-je vous contacter en dehors des heures de bureau ?" }),
      answer: t("faq.items.3.a", { defaultValue: "Absolument ! Pour les urgences juridiques, nous offrons un service d'assistance 24/7. Vous pouvez nous joindre par téléphone, email ou WhatsApp. Nous nous engageons à répondre dans les plus brefs délais." })
    },
    {
      question: t("faq.items.4.q", { defaultValue: "Travaillez-vous avec des entreprises ou uniquement des particuliers ?" }),
      answer: t("faq.items.4.a", { defaultValue: "Nous accompagnons aussi bien les particuliers que les entreprises (PME, startups, grandes entreprises). Nos services couvrent le droit des affaires, le droit du travail, les contrats commerciaux et bien plus encore." })
    },
    {
      question: t("faq.items.5.q", { defaultValue: "Quelle est votre zone d'intervention géographique ?" }),
      answer: t("faq.items.5.a", { defaultValue: "Nous intervenons principalement au Bénin, avec un focus sur Cotonou et sa région. Toutefois, nous pouvons également traiter des dossiers dans d'autres villes du pays et même à l'international selon les besoins." })
    },
    {
      question: t("faq.items.6.q", { defaultValue: "Comment garantissez-vous la confidentialité de mes informations ?" }),
      answer: t("faq.items.6.a", { defaultValue: "Le secret professionnel est au cœur de notre métier. Toutes vos informations sont strictement confidentielles et protégées. Nous utilisons des systèmes sécurisés et ne partageons jamais vos données sans votre consentement explicite." })
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <HelpCircle className="h-5 w-5" />
            <span className="font-semibold">{t("faq.badge", { defaultValue: "Questions Fréquentes" })}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("faq.title", { defaultValue: "Vous Avez des Questions ?" })}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t("faq.subtitle", { defaultValue: "Retrouvez les réponses aux questions les plus fréquentes sur nos services juridiques" })}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="overflow-hidden border-2 hover:border-primary/30 transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-8">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="h-6 w-6 text-primary" />
                  ) : (
                    <ChevronDown className="h-6 w-6 text-gray-400" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 animate-fade-in">
                  <p className="text-gray-600 leading-relaxed border-t pt-4">
                    {faq.answer}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            {t("faq.bottom_text", { defaultValue: "Vous ne trouvez pas la réponse à votre question ?" })}
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold"
          >
            {t("common.contact_us", { defaultValue: "Contactez-nous" })}
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
