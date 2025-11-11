import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MentionsLegales = () => {
  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2">Mentions Légales</h1>
                <p className="text-muted-foreground">Informations légales et administratives concernant AXE LEGAL</p>
              </div>
              <div>
                <Button onClick={handlePrint}>Imprimer / Télécharger</Button>
              </div>
            </div>

            <nav className="mb-6">
              <ul className="flex gap-4 text-sm">
                <li><a href="#editeur" className="text-primary hover:underline">Éditeur</a></li>
                <li><a href="#identifiants" className="text-primary hover:underline">Identifiants</a></li>
                <li><a href="#hebergement" className="text-primary hover:underline">Hébergement</a></li>
                <li><a href="#propriete" className="text-primary hover:underline">Propriété</a></li>
              </ul>
            </nav>

            <Card className="mb-6 p-6" id="editeur">
              <h2 className="text-2xl font-semibold mb-3">Éditeur du site</h2>
              <p className="text-muted-foreground">AXE LEGAL - Cabinet d'affaires spécialisé dans l'accompagnement juridique des entreprises et particuliers au Bénin.</p>
            </Card>

            <Card className="mb-6 p-6" id="identifiants">
              <h2 className="text-2xl font-semibold mb-3">Identifiants</h2>
              <ul className="text-muted-foreground list-disc list-inside">
                <li>Registre du commerce : <strong>RB/ABC/20 B 3095</strong></li>
                <li>Identifiant fiscal : <strong>3202011436651</strong></li>
              </ul>
            </Card>

            <Card className="mb-6 p-6" id="hebergement">
              <h2 className="text-2xl font-semibold mb-3">Hébergement</h2>
              <p className="text-muted-foreground">Le site est hébergé par le fournisseur de votre choix (hébergeur technique). Pour toute demande relative à l'hébergement, contactez l'éditeur via contact@axelegal.bj.</p>
            </Card>

            <Card className="mb-6 p-6" id="propriete">
              <h2 className="text-2xl font-semibold mb-3">Propriété intellectuelle</h2>
              <p className="text-muted-foreground">L'ensemble des contenus présents sur ce site (textes, images, logos, icônes) est la propriété de AXE LEGAL ou est utilisé avec l'autorisation de leurs titulaires. Toute reproduction, représentation ou diffusion, totale ou partielle, est interdite sans autorisation préalable.</p>
            </Card>

            <Card className="mb-6 p-6">
              <h2 className="text-2xl font-semibold mb-3">Responsabilité</h2>
              <p className="text-muted-foreground">Les informations publiées sont fournies à titre informatif. AXE LEGAL met tout en œuvre pour assurer l'exactitude des informations, mais ne peut garantir l'absence d'erreurs. L'utilisation des informations du site est sous la responsabilité de l'utilisateur.</p>
            </Card>

            <Card className="mb-6 p-6">
              <h2 className="text-2xl font-semibold mb-3">Conditions de prestation</h2>
              <p className="text-muted-foreground">Nos prestations s'effectuent selon deux modes : prestations sous contrat (durée minimale : 3 mois) avec facturation mensuelle ou trimestrielle, ou prestations à la tâche/mission facturées à l'acte. Les conditions précises sont détaillées dans nos propositions et contrats.</p>
            </Card>

            <Card className="mb-6 p-6">
              <h2 className="text-2xl font-semibold mb-3">Contact</h2>
              <p className="text-muted-foreground">Pour toute question relative aux présentes mentions légales, contactez-nous : <a className="text-primary" href="mailto:contact@axelegal.bj">contact@axelegal.bj</a> ou par téléphone au +229 01 97 74 75 93.</p>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentionsLegales;
