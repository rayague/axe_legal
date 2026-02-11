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
import { Trans, useTranslation } from "react-i18next";

const Contact = () => {
  const { toast } = useToast();
  const { t } = useTranslation();

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
    if (!schedule?.isOpen) return t('business_hours.closed', { defaultValue: 'Fermé' });

    let text = `${schedule.openTime || ''} - ${schedule.closeTime || ''}`.trim();
    if (schedule.breakStart && schedule.breakEnd) {
      text += ` (${t('business_hours.break', { defaultValue: 'pause' })} ${schedule.breakStart} - ${schedule.breakEnd})`;
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
        title: t("pages.contact.toast_success_title", { defaultValue: "Message envoyé !" }),
        description: t("pages.contact.toast_success_desc", { defaultValue: "Nous vous répondrons dans les plus brefs délais." }),
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
        title: t("common.error", { defaultValue: "Erreur" }),
        description: t("common.try_again", { defaultValue: "Une erreur est survenue. Veuillez réessayer." }),
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
          eyebrow={t("pages.contact.hero_eyebrow", { defaultValue: "Contactez-Nous" })}
          title={(
            <>
              {t("pages.contact.hero_title_prefix", { defaultValue: "Parlons de Votre" })}{" "}
              <span className="text-yellow-400">{t("pages.contact.hero_title_highlight", { defaultValue: "Projet Juridique" })}</span>
            </>
          )}
          subtitle={t("pages.contact.hero_subtitle", { defaultValue: "Notre équipe d'experts est à votre disposition pour répondre à vos questions et vous accompagner dans vos démarches juridiques. Première consultation offerte." })}
          ctaText={t("pages.contact.hero_cta", { defaultValue: "Appeler maintenant" })}
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
                      {t("pages.contact.form_badge", { defaultValue: "Formulaire de Contact" })}
                    </Badge>
                    <h2 className="text-3xl font-bold mb-3">
                      {t("pages.contact.form_title_prefix", { defaultValue: "Envoyez-nous un" })}{" "}
                      <span className="text-primary">{t("pages.contact.form_title_highlight", { defaultValue: "Message" })}</span>
                    </h2>
                    <p className="text-muted-foreground">
                      {t("pages.contact.form_subtitle", { defaultValue: "Remplissez le formulaire ci-dessous et nous vous recontacterons dans les plus brefs délais." })}
                    </p>
                  </div>

                  <Card className="p-8 border-2 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            {t("pages.contact.field_full_name", { defaultValue: "Nom complet" })} <span className="text-destructive">*</span>
                          </label>
                          <Input 
                            placeholder={t("pages.contact.placeholder_full_name", { defaultValue: "Jean Dupont" })}
                            required
                            value={formData.nom}
                            onChange={(e) => setFormData({...formData, nom: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            {t("pages.contact.field_email", { defaultValue: "Email" })} <span className="text-destructive">*</span>
                          </label>
                          <Input 
                            type="email" 
                            placeholder={t("pages.contact.placeholder_email", { defaultValue: "jean@exemple.com" })}
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {t("pages.contact.field_phone", { defaultValue: "Téléphone" })}
                        </label>
                        <Input 
                          type="tel" 
                          placeholder={t("pages.contact.placeholder_phone", { defaultValue: "+229 XX XX XX XX" })}
                          value={formData.telephone}
                          onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {t("pages.contact.field_subject", { defaultValue: "Objet de la demande" })}
                        </label>
                        <Input 
                          placeholder={t("pages.contact.placeholder_subject", { defaultValue: "Ex: Consultation en droit des affaires" })}
                          value={formData.sujet}
                          onChange={(e) => setFormData({...formData, sujet: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {t("pages.contact.field_message", { defaultValue: "Votre message" })} <span className="text-destructive">*</span>
                        </label>
                        <Textarea 
                          placeholder={t("pages.contact.placeholder_message", { defaultValue: "Décrivez votre situation ou vos besoins juridiques..." })}
                          rows={6}
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                        />
                      </div>

                      <Button className="w-full group" size="lg" type="submit" disabled={isSubmitting}>
                        <Send className="h-4 w-4 mr-2" />
                        {isSubmitting
                          ? t("pages.contact.submitting", { defaultValue: "Envoi en cours..." })
                          : t("pages.contact.submit", { defaultValue: "Envoyer le Message" })}
                        {!isSubmitting && <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        <Trans
                          i18nKey="pages.contact.privacy_notice"
                          defaults="En soumettant ce formulaire, vous acceptez notre <1>politique de confidentialité</1>."
                          components={{
                            1: <Link to="/confidentialite" className="text-primary hover:underline" />,
                          }}
                        />
                      </p>
                    </form>
                  </Card>
                </div>

                {/* Contact Information */}
                <div className="space-y-8">
                  <div>
                    <Badge className="mb-4" variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      {t("pages.contact.info_badge", { defaultValue: "Coordonnées" })}
                    </Badge>
                    <h2 className="text-3xl font-bold mb-3">
                      {t("pages.contact.info_title_prefix", { defaultValue: "Nos" })}{" "}
                      <span className="text-primary">{t("pages.contact.info_title_highlight", { defaultValue: "Coordonnées" })}</span>
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {t("pages.contact.info_subtitle", { defaultValue: "Plusieurs moyens pour nous joindre facilement" })}
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
                          <h3 className="font-semibold text-lg mb-2">{t("pages.contact.card_phone_title", { defaultValue: "Téléphone" })}</h3>
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
                            {t("pages.contact.phone_availability", { defaultValue: "Du lundi au vendredi, 8h - 18h" })}
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
                          <h3 className="font-semibold text-lg mb-2">{t("pages.contact.card_email_title", { defaultValue: "Email" })}</h3>
                          <a 
                            href="mailto:contact@axelegal.bj" 
                            className="text-muted-foreground hover:text-primary transition-colors break-all"
                          >
                            contact@axelegal.bj
                          </a>
                          <p className="text-sm text-muted-foreground mt-1">
                            {t("pages.contact.email_response_time", { defaultValue: "Réponse sous 24h" })}
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
                          <h3 className="font-semibold text-lg mb-2">{t("pages.contact.card_address_title", { defaultValue: "Adresse" })}</h3>
                          <p className="text-muted-foreground">
                            {t("pages.contact.address_value", { defaultValue: "Godomey échangeur, en direction Calavi-Cotonou, côté opposé à la mosquée." })}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {t("pages.contact.by_appointment", { defaultValue: "Sur rendez-vous uniquement" })}
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
                          <h3 className="font-semibold text-lg mb-2">{t('business_hours.title', { defaultValue: "Horaires d'ouverture" })}</h3>
                          <div className="space-y-1 text-muted-foreground text-sm">
                            {isBusinessHoursLoading ? (
                              <p>{t('pages.contact.hours_loading', { defaultValue: 'Chargement...' })}</p>
                            ) : (
                              <>
                                <p>
                                  <span className="font-medium">{t('business_hours.days.monday', { defaultValue: 'Lundi' })}:</span> {formatSchedule(businessHours.monday)}
                                </p>
                                <p>
                                  <span className="font-medium">{t('business_hours.days.tuesday', { defaultValue: 'Mardi' })}:</span> {formatSchedule(businessHours.tuesday)}
                                </p>
                                <p>
                                  <span className="font-medium">{t('business_hours.days.wednesday', { defaultValue: 'Mercredi' })}:</span> {formatSchedule(businessHours.wednesday)}
                                </p>
                                <p>
                                  <span className="font-medium">{t('business_hours.days.thursday', { defaultValue: 'Jeudi' })}:</span> {formatSchedule(businessHours.thursday)}
                                </p>
                                <p>
                                  <span className="font-medium">{t('business_hours.days.friday', { defaultValue: 'Vendredi' })}:</span> {formatSchedule(businessHours.friday)}
                                </p>
                                <p>
                                  <span className="font-medium">{t('business_hours.days.saturday', { defaultValue: 'Samedi' })}:</span> {formatSchedule(businessHours.saturday)}
                                </p>
                                <p>
                                  <span className="font-medium">{t('business_hours.days.sunday', { defaultValue: 'Dimanche' })}:</span> {formatSchedule(businessHours.sunday)}
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
