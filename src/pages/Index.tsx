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

const Index = () => {
  return (
    <div className="min-h-screen">
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
                Nos Services
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Des solutions juridiques complètes adaptées à vos besoins
              </p>
            </div>
            <ServicesSection />
          </div>
        </section>
        
        <TeamSection />
        <TestimonialsSection />
        
        {/* Section Horaires d'ouverture */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
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
