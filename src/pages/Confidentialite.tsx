import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Confidentialite = () => {
  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2">Politique de Confidentialité</h1>
                <p className="text-muted-foreground">Comment nous collectons, utilisons et protégeons vos données personnelles.</p>
              </div>
              <div>
                <Button onClick={handlePrint}>Imprimer / Télécharger</Button>
              </div>
            </div>

            <nav className="mb-6">
              <ul className="flex gap-4 text-sm">
                <li><a href="#donnees" className="text-primary hover:underline">Données collectées</a></li>
                <li><a href="#finalites" className="text-primary hover:underline">Finalités</a></li>
                <li><a href="#cookies" className="text-primary hover:underline">Cookies</a></li>
              </ul>
            </nav>

            <Card className="mb-6 p-6" id="donnees">
              <h2 className="text-2xl font-semibold mb-3">Données collectées</h2>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>Informations de contact (nom, email, téléphone) lorsque vous remplissez un formulaire.</li>
                <li>Données de navigation (cookies, adresses IP, pages consultées).</li>
                <li>Échanges et documents communiqués dans le cadre d'une prestation.</li>
              </ul>
            </Card>

            <Card className="mb-6 p-6" id="finalites">
              <h2 className="text-2xl font-semibold mb-3">Finalités</h2>
              <p className="text-muted-foreground">Les données sont utilisées pour :</p>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>Répondre à vos demandes et vous fournir des services juridiques.</li>
                <li>Gérer les missions et la facturation.</li>
                <li>Envoyer des communications commerciales si vous y avez consenti.</li>
                <li>Améliorer notre site et nos services.</li>
              </ul>
            </Card>

            <Card className="mb-6 p-6" id="cookies">
              <h2 className="text-2xl font-semibold mb-3">Cookies</h2>
              <p className="text-muted-foreground">Notre site utilise des cookies techniques et analytiques. Vous pouvez gérer vos préférences via votre navigateur. Les cookies permettant le fonctionnement du site sont nécessaires et ne peuvent être désactivés sans affecter certaines fonctionnalités.</p>
            </Card>

            <Card className="mb-6 p-6">
              <h2 className="text-2xl font-semibold mb-3">Partage et destinataires</h2>
              <p className="text-muted-foreground">Nous ne vendons pas vos données. Elles peuvent être partagées avec des prestataires techniques (hébergement, outils d'emailing) soumis à des engagements de confidentialité.</p>
            </Card>

            <Card className="mb-6 p-6">
              <h2 className="text-2xl font-semibold mb-3">Sécurité</h2>
              <p className="text-muted-foreground">Nous mettons en place des mesures techniques et organisationnelles pour protéger vos données contre la perte, l'altération ou l'accès non autorisé.</p>
            </Card>

            <Card className="mb-6 p-6">
              <h2 className="text-2xl font-semibold mb-3">Vos droits</h2>
              <p className="text-muted-foreground">Conformément à la réglementation applicable, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité. Pour exercer vos droits, contactez-nous à <a className="text-primary" href="mailto:contact@axelegal.bj">contact@axelegal.bj</a>.</p>
            </Card>

            <Card className="mb-6 p-6">
              <h2 className="text-2xl font-semibold mb-3">Durée de conservation</h2>
              <p className="text-muted-foreground">Les données sont conservées pendant la durée nécessaire aux finalités. Les délais peuvent varier selon la nature des données et les obligations légales.</p>
            </Card>

            <Card className="mb-6 p-6">
              <h2 className="text-2xl font-semibold mb-3">Contact</h2>
              <p className="text-muted-foreground">Pour toute question relative à la confidentialité : <a className="text-primary" href="mailto:contact@axelegal.bj">contact@axelegal.bj</a>.</p>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Confidentialite;
