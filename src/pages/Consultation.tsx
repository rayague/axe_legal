import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageHero from "@/components/PageHero";
import heroLegal from "@/assets/hero-legal.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  CheckCircle,
  Users,
  Shield,
  Award,
  ArrowRight,
  Briefcase,
  FileText,
  MessageSquare
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Consultation() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    service: "",
    datePreferee: "",
    heurePreferee: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/consultation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Demande envoyée !",
          description: "Nous vous contacterons bientôt pour confirmer votre consultation.",
        });
        // Reset form
        setFormData({
          nom: "",
          email: "",
          telephone: "",
          service: "",
          datePreferee: "",
          heurePreferee: "",
          message: "",
        });
      } else {
        throw new Error(data.message || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    "Droit des Affaires",
    "Fiscalité",
    "Droit Immobilier",
    "Droit du Travail",
    "Recouvrement",
    "Marchés Publics",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <PageHero
          eyebrow="Consultation Juridique"
          title={(
            <>
              Réservez Votre <span className="text-yellow-400">Consultation Gratuite</span>
            </>
          )}
          subtitle={"Bénéficiez d'une première consultation gratuite avec nos experts juridiques. Nous analysons votre situation et vous proposons des solutions adaptées à vos besoins."}
          ctaText="Réserver maintenant"
          ctaLink="#formulaire"
          imageSrc={heroLegal}
          large
        />

        {/* Benefits Section */}
        <section className="py-16 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="mb-4" variant="outline">
                  <Award className="h-4 w-4 mr-2" />
                  Avantages
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Pourquoi Choisir Notre <span className="text-primary">Consultation Gratuite</span> ?
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Un premier rendez-vous sans engagement pour évaluer votre situation juridique
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-8 text-center hover:shadow-2xl transition-all duration-500 animate-fade-in-up border-2 hover:border-primary/50 group">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                    <CheckCircle className="h-9 w-9 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">
                    100% Gratuit
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Première consultation entièrement gratuite et sans aucun engagement de votre part
                  </p>
                </Card>

                <Card className="p-8 text-center hover:shadow-2xl transition-all duration-500 animate-fade-in-up border-2 hover:border-primary/50 group" style={{ animationDelay: "100ms" }}>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                    <Clock className="h-9 w-9 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">
                    Réponse Sous 24h
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Nous vous recontactons rapidement pour confirmer votre rendez-vous et préparer votre dossier
                  </p>
                </Card>

                <Card className="p-8 text-center hover:shadow-2xl transition-all duration-500 animate-fade-in-up border-2 hover:border-primary/50 group" style={{ animationDelay: "200ms" }}>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                    <Users className="h-9 w-9 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">
                    Experts Dédiés
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Rencontrez un avocat spécialisé dans votre domaine pour des conseils adaptés
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* What to Expect Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Déroulement de la <span className="text-primary">Consultation</span>
                </h2>
                <p className="text-muted-foreground">
                  Voici comment se déroule votre première rencontre avec nos experts
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6 border-2 hover:border-primary/50 transition-all">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">1. Écoute Attentive</h3>
                      <p className="text-muted-foreground text-sm">
                        Nous prenons le temps d'écouter votre situation, vos préoccupations et vos objectifs
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-2 hover:border-primary/50 transition-all">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">2. Analyse Approfondie</h3>
                      <p className="text-muted-foreground text-sm">
                        Examen détaillé de votre dossier et identification des enjeux juridiques
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-2 hover:border-primary/50 transition-all">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">3. Solutions Personnalisées</h3>
                      <p className="text-muted-foreground text-sm">
                        Présentation des options juridiques disponibles et de nos recommandations
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-2 hover:border-primary/50 transition-all">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">4. Proposition Claire</h3>
                      <p className="text-muted-foreground text-sm">
                        Devis transparent avec honoraires détaillés et plan d'action précis
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Consultation Form */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10" id="formulaire">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="mb-4" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Formulaire de Réservation
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Réservez Votre <span className="text-primary">Rendez-vous</span>
                </h2>
                <p className="text-muted-foreground">
                  Remplissez le formulaire ci-dessous et nous vous contacterons rapidement
                </p>
              </div>

              <Card className="p-8 md:p-10 shadow-2xl animate-fade-in-up border-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        Nom complet <span className="text-destructive">*</span>
                      </label>
                      <Input
                        required
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        placeholder="Jean Dupont"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        Email <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jean@exemple.com"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        Téléphone <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="tel"
                        required
                        value={formData.telephone}
                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                        placeholder="+229 XX XX XX XX"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        Service concerné <span className="text-destructive">*</span>
                      </label>
                      <select
                        required
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full h-11 px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Sélectionnez un service</option>
                        {services.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        Date souhaitée <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="date"
                        required
                        value={formData.datePreferee}
                        onChange={(e) => setFormData({ ...formData, datePreferee: e.target.value })}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Heure préférée <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="time"
                        required
                        value={formData.heurePreferee}
                        onChange={(e) => setFormData({ ...formData, heurePreferee: e.target.value })}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">
                      Décrivez brièvement votre situation
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Expliquez en quelques mots votre besoin juridique..."
                      rows={5}
                      className="resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full group"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Réserver ma Consultation Gratuite
                    <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>

                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground text-center">
                      En soumettant ce formulaire, vous acceptez d'être contacté par notre équipe et notre{" "}
                      <Link to="/confidentialite" className="text-primary hover:underline">
                        politique de confidentialité
                      </Link>
                    </p>
                  </div>
                </form>
              </Card>

              {/* Contact Alternatives */}
              <div className="mt-12">
                <h3 className="text-xl font-bold mb-6 text-center">Ou contactez-nous directement</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Button variant="outline" size="lg" className="gap-2 h-14 group border-2" asChild>
                    <a href="tel:+22901977475">
                      <Phone className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <div className="text-xs text-muted-foreground">Appelez-nous</div>
                        <div className="font-semibold group-hover:text-primary transition-colors">+229 01 97 74 75</div>
                      </div>
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2 h-14 group border-2" asChild>
                    <a href="mailto:contact@axelegal.bj">
                      <Mail className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <div className="text-xs text-muted-foreground">Écrivez-nous</div>
                        <div className="font-semibold group-hover:text-primary transition-colors">contact@axelegal.bj</div>
                      </div>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ or Additional Info */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-12">
                Questions <span className="text-primary">Fréquentes</span>
              </h2>

              <div className="grid md:grid-cols-2 gap-6 text-left">
                <Card className="p-6 border-2">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    La consultation est-elle vraiment gratuite ?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Oui, absolument ! La première consultation est entièrement gratuite et sans engagement. 
                    C'est l'occasion d'évaluer votre situation et de déterminer comment nous pouvons vous aider.
                  </p>
                </Card>

                <Card className="p-6 border-2">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Combien de temps dure la consultation ?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    La consultation dure généralement entre 45 minutes et 1 heure. Nous prenons le temps 
                    nécessaire pour bien comprendre votre situation et vous conseiller efficacement.
                  </p>
                </Card>

                <Card className="p-6 border-2">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Dois-je apporter des documents ?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Si vous avez des documents pertinents (contrats, courriers, etc.), nous vous conseillons 
                    de les apporter. Cela nous aidera à mieux analyser votre dossier.
                  </p>
                </Card>

                <Card className="p-6 border-2">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    La consultation peut-elle se faire en ligne ?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Oui, nous proposons également des consultations par visioconférence pour plus de flexibilité. 
                    Indiquez votre préférence lors de la prise de rendez-vous.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
