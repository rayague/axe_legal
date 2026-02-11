import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CertificationsSection } from "@/components/CertificationsSection";
import { ServicesSection } from "@/components/ServicesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import TeamSection from "@/components/TeamSection";
import { AboutSection } from "@/components/AboutSection";
import { StatsSection } from "@/components/StatsSection";
import { Footer } from "@/components/Footer";
import AnnouncementsSection from "@/components/AnnouncementsSection";
import { BusinessHoursDisplay } from "@/components/BusinessHoursDisplay";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen">
      <Helmet>
        <html lang={i18n.language} />
        <title>
          {i18n.language === 'en' 
            ? 'Axe Legal - Premier Legal Advisory Firm in Benin'
            : 'Axe Legal - Cabinet de Conseil Juridique d\'Excellence au Bénin'
          }
        </title>
        <meta name="description" content={
          i18n.language === 'en'
            ? 'Leading legal advisory firm in Benin. Expertise in business law, taxation, real estate and personalized legal support since 2008.'
            : 'Cabinet de conseil juridique de référence au Bénin. Expertise en droit des affaires, fiscalité, immobilier et accompagnement juridique personnalisé depuis 2008.'
        } />
        <meta name="keywords" content={
          i18n.language === 'en'
            ? 'legal advisory Benin, law firm, business law, taxation, real estate law, Cotonou, legal experts Benin'
            : 'conseil juridique Bénin, cabinet d\'avocats, droit des affaires, fiscalité, droit immobilier, Cotonou, juristes Bénin'
        } />
        <meta name="author" content="Axe Legal" />
      </Helmet>
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <CertificationsSection />
        <StatsSection />
  <AnnouncementsSection />
        
        {/* Section Nos Services */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {t("pages.home.services_title", { defaultValue: "Nos Services" })}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t("pages.home.services_subtitle", { defaultValue: "Des solutions juridiques complètes adaptées à vos besoins" })}
              </p>
            </div>
            <ServicesSection />
          </div>
        </section>
        
        <WhyChooseUsSection />
        <TeamSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
        
        {/* Section Horaires d'ouverture */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {t("pages.home.hours_title", { defaultValue: "Nous Sommes à Votre Écoute" })}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t("pages.home.hours_subtitle", { defaultValue: "Notre équipe est disponible pour répondre à vos besoins juridiques. Consultez nos horaires d'ouverture." })}
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <BusinessHoursDisplay />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
