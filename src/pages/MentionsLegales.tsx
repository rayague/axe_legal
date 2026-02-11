import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trans, useTranslation } from "react-i18next";

const MentionsLegales = () => {
  const handlePrint = () => window.print();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2">{t("pages.mentions.title", { defaultValue: "Mentions Légales" })}</h1>
                <p className="text-muted-foreground">{t("pages.mentions.subtitle", { defaultValue: "Informations légales et administratives concernant AXE LEGAL" })}</p>
              </div>
              <div>
                <Button onClick={handlePrint}>{t("common.print_download", { defaultValue: "Imprimer / Télécharger" })}</Button>
              </div>
            </div>

            <nav className="mb-6">
              <ul className="flex gap-4 text-sm">
                <li><a href="#editeur" className="text-primary hover:underline">{t("pages.mentions.nav_editor", { defaultValue: "Éditeur" })}</a></li>
                <li><a href="#identifiants" className="text-primary hover:underline">{t("pages.mentions.nav_ids", { defaultValue: "Identifiants" })}</a></li>
                <li><a href="#hebergement" className="text-primary hover:underline">{t("pages.mentions.nav_hosting", { defaultValue: "Hébergement" })}</a></li>
                <li><a href="#propriete" className="text-primary hover:underline">{t("pages.mentions.nav_ip", { defaultValue: "Propriété" })}</a></li>
              </ul>
            </nav>

            <Card className="mb-6 p-6" id="editeur">
              <h2 className="text-2xl font-semibold mb-3">{t("pages.mentions.editor_title", { defaultValue: "Éditeur du site" })}</h2>
              <p className="text-muted-foreground">{t("pages.mentions.editor_text", { defaultValue: "AXE LEGAL - Cabinet d'affaires spécialisé dans l'accompagnement juridique des entreprises et particuliers au Bénin." })}</p>
            </Card>

            <Card className="mb-6 p-6" id="identifiants">
              <h2 className="text-2xl font-semibold mb-3">{t("pages.mentions.ids_title", { defaultValue: "Identifiants" })}</h2>
              <ul className="text-muted-foreground list-disc list-inside">
                <li>Registre du commerce : <strong>RB/ABC/20 B 3095</strong></li>
                <li>Identifiant fiscal : <strong>3202011436651</strong></li>
              </ul>
            </Card>

            <Card className="mb-6 p-6" id="hebergement">
              <h2 className="text-2xl font-semibold mb-3">{t("pages.mentions.hosting_title", { defaultValue: "Hébergement" })}</h2>
              <p className="text-muted-foreground">{t("pages.mentions.hosting_text", { defaultValue: "Le site est hébergé par le fournisseur de votre choix (hébergeur technique). Pour toute demande relative à l'hébergement, contactez l'éditeur via contact@axelegal.bj." })}</p>
            </Card>

            <Card className="mb-6 p-6" id="propriete">
              <h2 className="text-2xl font-semibold mb-3">{t("pages.mentions.ip_title", { defaultValue: "Propriété intellectuelle" })}</h2>
              <p className="text-muted-foreground">{t("pages.mentions.ip_text", { defaultValue: "L'ensemble des contenus présents sur ce site (textes, images, logos, icônes) est la propriété de AXE LEGAL ou est utilisé avec l'autorisation de leurs titulaires. Toute reproduction, représentation ou diffusion, totale ou partielle, est interdite sans autorisation préalable." })}</p>
            </Card>

            <Card className="mb-6 p-6">
              <h2 className="text-2xl font-semibold mb-3">{t("pages.mentions.liability_title", { defaultValue: "Responsabilité" })}</h2>
              <p className="text-muted-foreground">{t("pages.mentions.liability_text", { defaultValue: "Les informations publiées sont fournies à titre informatif. AXE LEGAL met tout en œuvre pour assurer l'exactitude des informations, mais ne peut garantir l'absence d'erreurs. L'utilisation des informations du site est sous la responsabilité de l'utilisateur." })}</p>
            </Card>

            <Card className="mb-6 p-6">
              <h2 className="text-2xl font-semibold mb-3">{t("pages.mentions.services_terms_title", { defaultValue: "Conditions de prestation" })}</h2>
              <p className="text-muted-foreground">{t("pages.mentions.services_terms_text", { defaultValue: "Nos prestations s'effectuent selon deux modes : prestations sous contrat (durée minimale : 3 mois) avec facturation mensuelle ou trimestrielle, ou prestations à la tâche/mission facturées à l'acte. Les conditions précises sont détaillées dans nos propositions et contrats." })}</p>
            </Card>

            <Card className="mb-6 p-6">
              <h2 className="text-2xl font-semibold mb-3">{t("pages.mentions.contact_title", { defaultValue: "Contact" })}</h2>
              <p className="text-muted-foreground">
                <Trans
                  i18nKey="pages.mentions.contact_text"
                  defaults="Pour toute question relative aux présentes mentions légales, contactez-nous : <1>contact@axelegal.bj</1> ou par téléphone au +229 01 97 74 75 93."
                  components={{
                    1: <a className="text-primary" href="mailto:contact@axelegal.bj" />,
                  }}
                />
              </p>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentionsLegales;
