import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ServicesSection } from "@/components/ServicesSection";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Phone, Mail, Globe2, Download, FileText } from "lucide-react";
import servicesHero from "@/assets/business-law.jpg";
import { useTranslation } from "react-i18next";

const Services = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
  <Header />
  <main>
        <PageHero
          eyebrow={t("pages.services.hero_eyebrow", { defaultValue: "Nos Expertises" })}
          title={(
            <>
              {t("pages.services.hero_title_part1", { defaultValue: "Des" })}{" "}
              <span className="text-yellow-400">{t("pages.services.hero_title_highlight", { defaultValue: "Solutions" })}</span>{" "}
              {t("pages.services.hero_title_part2", { defaultValue: "Juridiques" })}
              <br />
              {t("pages.services.hero_title_part3", { defaultValue: "d'Excellence" })}
            </>
          )}
          subtitle={t("pages.services.hero_subtitle", { defaultValue: "Une gamme complète de services juridiques adaptés aux besoins des entreprises et des particuliers, avec une approche personnalisée et des résultats garantis." })}
          ctaText={t("common.contact_us", { defaultValue: "Contactez-nous" })}
          ctaLink="/contact"
          imageSrc={servicesHero}
          large
        />

        <section className="py-24 bg-background" id="services">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <div className="w-full rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Globe2 className="h-5 w-5" />
                    <span>{t("banners.english_available_title", { defaultValue: "Service disponible en anglais" })}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("banners.english_available_subtitle", { defaultValue: "English available for consultations & legal support" })}
                  </div>
                </div>
              </div>
            </div>
            <ServicesSection />

            <div className="mt-14 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-blue-50/40 p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl shrink-0">
                    <FileText className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                      {t("pages.services.usefulDocuments.title", { defaultValue: "Documents Utiles" })}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground mt-1 max-w-2xl">
                      {t("pages.services.usefulDocuments.subtitle", { defaultValue: "Téléchargez nos notes pour préparer votre consultation et gagner du temps le jour du rendez-vous." })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-primary/10 bg-background/70 p-5 hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Download className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-foreground">
                        {t("pages.services.usefulDocuments.doc1", { defaultValue: "Notes d'usage - Service juridique" })}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {t("pages.services.usefulDocuments.doc1_desc", { defaultValue: "Un guide clair pour comprendre le déroulement d'une consultation et préparer les informations clés." })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button size="sm" className="shadow-sm" asChild>
                      <a
                        href="/assets/documents/Notes_%20Usage%20Conseil%20Service%20Juridique-1.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        {t("pages.services.usefulDocuments.cta", { defaultValue: "Télécharger" })}
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl border border-primary/10 bg-background/70 p-5 hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Download className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-foreground">
                        {t("pages.services.usefulDocuments.doc2", { defaultValue: "Notes d'usage - Version 2.1" })}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {t("pages.services.usefulDocuments.doc2_desc", { defaultValue: "Version mise à jour avec des recommandations supplémentaires et des bonnes pratiques." })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="shadow-sm" asChild>
                      <a
                        href="/assets/documents/Notes_%20Usage%20Conseil%20Service%20Juridiq%20V2-1.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        {t("pages.services.usefulDocuments.cta_v2", { defaultValue: "Télécharger (V2.1)" })}
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Résumé avec Call to Action */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  {t("pages.services.cta_title_part1", { defaultValue: "Prêt à Bénéficier de Notre" })}{" "}
                  <span className="text-primary">{t("pages.services.cta_title_highlight", { defaultValue: "Expertise Juridique" })}</span>{" "}?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {t("pages.services.cta_paragraph", { defaultValue: "Que vous soyez une entreprise en quête de sécurité juridique ou un particulier face à un défi légal, notre cabinet met à votre disposition son expertise reconnue et son approche personnalisée pour vous accompagner vers le succès." })}
                </p>
              </div>

              <div className="bg-card border-2 border-primary/20 rounded-2xl p-8 shadow-lg">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-primary">6+</div>
                    <div className="text-sm text-muted-foreground">{t("pages.services.stats_expertise", { defaultValue: "Domaines d'Expertise" })}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-primary">100%</div>
                    <div className="text-sm text-muted-foreground">{t("pages.services.stats_personalized", { defaultValue: "Approche Personnalisée" })}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-muted-foreground">{t("pages.services.stats_availability", { defaultValue: "Disponibilité & Réactivité" })}</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="group" asChild>
                    <Link to="/contact">
                      {t("common.request_consultation", { defaultValue: "Demander une Consultation" })}
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="group" asChild>
                    <Link to="/contact">
                      <Phone className="mr-2 h-5 w-5" />
                      {t("common.call", { defaultValue: "Nous Appeler" })}
                    </Link>
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-primary/20">
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    {t("pages.services.response_24h", { defaultValue: "Réponse garantie sous 24h pour toute demande" })}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="bg-card/50 backdrop-blur rounded-xl p-6 border border-primary/10">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    {t("pages.services.why_choose", { defaultValue: "Pourquoi Nous Choisir ?" })}
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{t("pages.services.why_choose_item1", { defaultValue: "Une équipe composée de professionnels expérimentés et spécialisés" })}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{t("pages.services.why_choose_item2", { defaultValue: "Des solutions sur mesure adaptées à vos besoins" })}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{t("pages.services.why_choose_item3", { defaultValue: "Un accompagnement de A à Z dans vos démarches" })}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-card/50 backdrop-blur rounded-xl p-6 border border-primary/10">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    {t("pages.services.commitment", { defaultValue: "Notre Engagement" })}
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{t("pages.services.commitment_item1", { defaultValue: "Transparence et communication régulière" })}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{t("pages.services.commitment_item2", { defaultValue: "Excellence et rigueur dans chaque dossier" })}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{t("pages.services.commitment_item3", { defaultValue: "Résultats concrets et mesurables" })}</span>
                    </li>
                  </ul>
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

export default Services;
