import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  CheckCircle,
  MessageSquare,
  Users,
  Calendar,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import contactHero from "@/assets/team-office.jpg";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { addMessage, getBusinessHours, type BusinessHours, type DaySchedule } from "@/lib/firebaseApi";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fallbackBusinessHours: BusinessHours = {
    monday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    tuesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    wednesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    thursday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    friday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    saturday: { isOpen: true, openTime: '09:00', closeTime: '13:00' },
    sunday: { isOpen: false },
    holidays: [],
    exceptionalClosure: [],
    timezone: 'Europe/Paris',
    lastUpdated: new Date(),
  };

  const [businessHours, setBusinessHours] = useState<BusinessHours>(fallbackBusinessHours);
  const [isBusinessHoursLoading, setIsBusinessHoursLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getBusinessHours()
      .then((data) => {
        if (!isMounted) return;
        if (data) setBusinessHours(data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des horaires:", error);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsBusinessHoursLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const formatSchedule = (schedule: DaySchedule) => {
    if (!schedule?.isOpen) return 'Fermé';

    let text = `${schedule.openTime || ''} - ${schedule.closeTime || ''}`.trim();
    if (schedule.breakStart && schedule.breakEnd) {
      text += ` (pause ${schedule.breakStart} - ${schedule.breakEnd})`;
    }
    if (schedule.note) {
      text += ` • ${schedule.note}`;
    }
    return text;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addMessage({
        name: formData.nom,
        email: formData.email,
        phone: formData.telephone,
        subject: formData.sujet,
        message: formData.message
      });

      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
      
      // Reset form
      setFormData({
        nom: "",
        email: "",
        telephone: "",
        sujet: "",
        message: ""
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <PageHero
          eyebrow="Contactez-Nous"
          title={(
            <>
              Parlons de Votre <span className="text-yellow-400">Projet Juridique</span>
            </>
          )}
          subtitle={"Notre équipe d'experts est à votre disposition pour répondre à vos questions et vous accompagner dans vos démarches juridiques. Première consultation offerte."}
          ctaText="Appeler maintenant"
          ctaLink="tel:+2290197747593"
          imageSrc={contactHero}
          large
        />

        {/* Quick Contact Stats */}
        {/*
        <section className="py-12 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 text-center border-2 hover:border-primary/50 transition-all">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                    <Clock className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Réponse Rapide</h3>
                  <p className="text-muted-foreground text-sm">Réponse garantie sous 24h</p>
                </Card>

                <Card className="p-6 text-center border-2 hover:border-primary/50 transition-all">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                    <MessageSquare className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Consultation Gratuite</h3>
                  <p className="text-muted-foreground text-sm">Premier rendez-vous offert</p>
                </Card>

                <Card className="p-6 text-center border-2 hover:border-primary/50 transition-all">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Équipe Dédiée</h3>
                  <p className="text-muted-foreground text-sm">Experts à votre service</p>
                </Card>
              </div>
            </div>
          </div>
        </section>
        */}

        {/* Main Contact Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div>
                  <div className="mb-8">
                    <Badge className="mb-4" variant="outline">
                      <Send className="h-4 w-4 mr-2" />
                      Formulaire de Contact
                    </Badge>
                    <h2 className="text-3xl font-bold mb-3">
                      Envoyez-nous un <span className="text-primary">Message</span>
                    </h2>
                    <p className="text-muted-foreground">
                      Remplissez le formulaire ci-dessous et nous vous recontacterons dans les plus brefs délais.
                    </p>
                  </div>

                  <Card className="p-8 border-2 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Nom complet <span className="text-destructive">*</span>
                          </label>
                          <Input 
                            placeholder="Jean Dupont" 
                            required
                            value={formData.nom}
                            onChange={(e) => setFormData({...formData, nom: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Email <span className="text-destructive">*</span>
                          </label>
                          <Input 
                            type="email" 
                            placeholder="jean@exemple.com" 
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Téléphone
                        </label>
                        <Input 
                          type="tel" 
                          placeholder="+229 XX XX XX XX" 
                          value={formData.telephone}
                          onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Objet de la demande
                        </label>
                        <Input 
                          placeholder="Ex: Consultation en droit des affaires" 
                          value={formData.sujet}
                          onChange={(e) => setFormData({...formData, sujet: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Votre message <span className="text-destructive">*</span>
                        </label>
                        <Textarea 
                          placeholder="Décrivez votre situation ou vos besoins juridiques..." 
                          rows={6}
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                        />
                      </div>

                      <Button className="w-full group" size="lg" type="submit" disabled={isSubmitting}>
                        <Send className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Envoi en cours..." : "Envoyer le Message"}
                        {!isSubmitting && <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        En soumettant ce formulaire, vous acceptez notre{" "}
                        <Link to="/confidentialite" className="text-primary hover:underline">
                          politique de confidentialité
                        </Link>
                      </p>
                    </form>
                  </Card>
                </div>

                {/* Contact Information */}
                <div className="space-y-8">
                  <div>
                    <Badge className="mb-4" variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      Coordonnées
                    </Badge>
                    <h2 className="text-3xl font-bold mb-3">
                      Nos <span className="text-primary">Coordonnées</span>
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Plusieurs moyens pour nous joindre facilement
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Card className="p-6 border-2 hover:border-primary/50 hover:shadow-lg transition-all group">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Phone className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">Téléphone</h3>
                          <div className="space-y-1">
                            <a
                              href="tel:+2290197747593"
                              className="block text-muted-foreground hover:text-primary transition-colors text-lg font-medium"
                            >
                              +229 01 97 74 75 93
                            </a>
                            <a
                              href="tel:+2290165656825"
                              className="block text-muted-foreground hover:text-primary transition-colors text-lg font-medium"
                            >
                              +229 01 65 65 68 25
                            </a>
                            <a
                              href="tel:+2290140666938"
                              className="block text-muted-foreground hover:text-primary transition-colors text-lg font-medium"
                            >
                              +229 01 40 66 69 38
                            </a>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Du lundi au vendredi, 8h - 18h
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 border-2 hover:border-primary/50 hover:shadow-lg transition-all group">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Mail className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">Email</h3>
                          <a 
                            href="mailto:contact@axelegal.bj" 
                            className="text-muted-foreground hover:text-primary transition-colors break-all"
                          >
                            contact@axelegal.bj
                          </a>
                          <p className="text-sm text-muted-foreground mt-1">
                            Réponse sous 24h
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 border-2 hover:border-primary/50 hover:shadow-lg transition-all group">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <MapPin className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">Adresse</h3>
                          <p className="text-muted-foreground">
                            Godomey échangeur, en direction Calavi-Cotonou, côté opposé à la mosquée.
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Sur rendez-vous uniquement
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 border-2 hover:border-primary/50 hover:shadow-lg transition-all group">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Clock className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">Horaires d'Ouverture</h3>
                          <div className="space-y-1 text-muted-foreground text-sm">
                            {isBusinessHoursLoading ? (
                              <p>Chargement...</p>
                            ) : (
                              <>
                                <p>
                                  <span className="font-medium">Lundi:</span> {formatSchedule(businessHours.monday)}
                                </p>
                                <p>
                                  <span className="font-medium">Mardi:</span> {formatSchedule(businessHours.tuesday)}
                                </p>
                                <p>
                                  <span className="font-medium">Mercredi:</span> {formatSchedule(businessHours.wednesday)}
                                </p>
                                <p>
                                  <span className="font-medium">Jeudi:</span> {formatSchedule(businessHours.thursday)}
                                </p>
                                <p>
                                  <span className="font-medium">Vendredi:</span> {formatSchedule(businessHours.friday)}
                                </p>
                                <p>
                                  <span className="font-medium">Samedi:</span> {formatSchedule(businessHours.saturday)}
                                </p>
                                <p>
                                  <span className="font-medium">Dimanche:</span> {formatSchedule(businessHours.sunday)}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Emergency Contact */}
                  {/*
                  <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
                    <div className="flex items-start gap-3 mb-3">
                      <Calendar className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-bold text-lg mb-2">Urgence Juridique ?</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Pour toute situation urgente nécessitant une intervention immédiate, 
                          contactez-nous directement par téléphone.
                        </p>
                        <Button variant="outline" className="w-full" asChild>
                          <a href="tel:+2290197747593">
                            <Phone className="h-4 w-4 mr-2" />
                            Appeler Maintenant
                          </a>
                        </Button>
                      </div>
                    </div>
                  </Card>
                  */}
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

export default Contact;
