import { Link } from "react-router-dom";
import { useState } from "react";
import { Scale, Phone, Mail, MapPin, Facebook, Linkedin, CheckCircle, Briefcase, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Small inner component to render the logo image if available,
// otherwise fall back to the brand icon. Keeps a tiny local state
// so the fallback only shows when the image fails to load.
function Logo() {
  const [logoVisible, setLogoVisible] = useState(true);

  return logoVisible ? (
    <img
      src="/assets/images/logo.png"
      alt="Axe Legal logo"
      className="h-10 w-10 object-contain"
      onError={() => setLogoVisible(false)}
      onLoad={() => setLogoVisible(true)}
    />
  ) : (
    <Scale className="h-5 w-5 text-primary" aria-hidden />
  );
}

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0b1722] text-slate-300 border-t border-gray-800">
  <div className="container mx-auto px-4">
        {/* Main Footer Content */}
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 py-16">
          {/* AXE LEGAL column */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              {/* logo (use image if available else icon) */}
              {/** If you have a logo image in public/assets/images/logo.png it will be used, otherwise the Scale icon acts as logo */}
              {/* show image when it loads, otherwise fallback to icon */}
              <Logo />
              <h3 className="text-xl font-bold text-white">AXE LEGAL</h3>
            </div>
            <p className="text-slate-200 mt-4">Cabinet de conseils juridiques et d'assistance fiscale.</p>

            <h4 className="font-semibold mt-6 text-white">Composition de l'équipe :</h4>
            <ul className="mt-3 space-y-3 text-slate-200 text-sm">
              <li className="flex items-start gap-2">
                <Users className="h-5 w-5 text-primary mt-0.5 shrink-0" aria-hidden />
                <span>L'Associé-Gérant</span>
              </li>
              <li className="flex items-start gap-2">
                <Briefcase className="h-5 w-5 text-primary mt-0.5 shrink-0" aria-hidden />
                <span>La Cellule de l'Intelligence Fiscale</span>
              </li>
              <li className="flex items-start gap-2">
                <Scale className="h-5 w-5 text-primary mt-0.5 shrink-0" aria-hidden />
                <span>La Cellule des Actes Juridiques et de la Gouvernance d'Entreprise</span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-primary mt-0.5 shrink-0" aria-hidden />
                <span>La Cellule de Traitement de l'Information Financière</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Nos Prestations + Informations Légales */}
          <div className="space-y-8">
            {/* Nos Prestations */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Nos Prestations</h3>
              <p className="font-semibold text-sm mb-3">Nous travaillons sous :</p>
              <ul className="space-y-3 text-slate-200 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>Prestations sous contrat de trois mois au moins avec paiement mensuel ou trimestriel</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>Prestation instantanée avec paiement à la tâche ou par mission</span>
                </li>
              </ul>
            </div>

            {/* Informations Légales */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Informations Légales</h3>
              <ul className="text-slate-200 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-primary mt-0.5 shrink-0" aria-hidden />
                  <span>Registre du commerce : <strong>RB/ABC/20 B 3095</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-primary mt-0.5 shrink-0" aria-hidden />
                  <span>Identifiant fiscal : <strong>3202011436651</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" aria-hidden />
                  <a href="mailto:contact@axelegal.bj" className="hover:text-primary transition-colors">contact@axelegal.bj</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Contact */}
          <div className="flex flex-col h-full">
            <h3 className="font-bold text-lg mb-4 text-white">Contact</h3>
            <div className="text-slate-200 text-sm space-y-4">
              <div>
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Adresse
                </div>
                <p className="text-slate-300">Godomey échangeur, en direction Calavi-Cotonou, côté opposé à la mosquée.</p>
              </div>
              
              <div>
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Téléphone
                </div>
                <div className="space-y-1 text-slate-300">
                  <div>+229 01 97 74 75 93</div>
                  <div>+229 01 65 65 68 25</div>
                  <div>+229 01 40 66 69 38</div>
                </div>
              </div>

              <div>
                <a 
                  href="https://www.google.com/maps" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  Voir sur Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-12">
          <div className="flex justify-center">
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-[#1877F2] hover:bg-[#166FE5] transition-colors"
              >
                <Facebook className="h-5 w-5 text-white" aria-hidden />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-[#0A66C2] hover:bg-[#004182] transition-colors"
              >
                <Linkedin className="h-5 w-5 text-white" aria-hidden />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-200 text-center md:text-left">
              © {currentYear} AXE LEGAL - Cabinet d'Affaires. Tous droits réservés. | Développement web par Ray Ague
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/mentions-legales" className="text-slate-200 hover:text-primary transition-colors">
                Mentions Légales
              </Link>
              <Link to="/confidentialite" className="text-slate-200 hover:text-primary transition-colors">
                Confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
