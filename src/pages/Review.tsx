import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import heroLegal from "@/assets/hero-legal.jpg";
import { addReview } from "@/lib/firebaseApi";
import { Star, CheckCircle, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type ReviewFormData = {
  name: string;
  rating: number;
  comment: string;
  company: string; // honeypot
};

const clampRating = (value: number) => Math.max(1, Math.min(5, value));

const Review = () => {
  const { toast } = useToast();
  const { t } = useTranslation();

  const [formData, setFormData] = useState<ReviewFormData>({
    name: "",
    rating: 5,
    comment: "",
    company: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => {
    const next: Record<string, string> = {};

    const name = formData.name.trim();
    const comment = formData.comment.trim();

    if (name.length < 2) next.name = t("pages.review.errors.name", { defaultValue: "Veuillez renseigner votre nom." });
    if (comment.length < 20) next.comment = t("pages.review.errors.comment", { defaultValue: "Votre avis est trop court (min. 20 caractères)." });
    if (comment.length > 1200) next.comment = t("pages.review.errors.comment_max", { defaultValue: "Votre avis est trop long (max. 1200 caractères)." });

    const rating = clampRating(formData.rating);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      next.rating = t("pages.review.errors.rating", { defaultValue: "Veuillez choisir une note entre 1 et 5." });
    }

    return next;
  }, [formData.comment, formData.name, formData.rating, t]);

  const canSubmit = Object.keys(errors).length === 0 && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      await addReview({
        name: formData.name.trim(),
        rating: clampRating(formData.rating),
        comment: formData.comment.trim(),
        honeypot: formData.company,
      });

      setSubmitted(true);
      toast({
        title: t("pages.review.toast_success_title", { defaultValue: "Merci !" }),
        description: t("pages.review.toast_success_desc", { defaultValue: "Votre avis a été reçu. Il sera publié après validation." }),
      });

      setFormData({ name: "", rating: 5, comment: "", company: "" });
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'avis:", error);

      const isPermissionDenied =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as any).code === "permission-denied";

      toast({
        title: t("common.error", { defaultValue: "Erreur" }),
        description: isPermissionDenied
          ? t("pages.review.toast_permission_denied", {
              defaultValue:
                "Permission refusée. Vérifiez que les règles Firestore ont bien été déployées, puis réessayez.",
            })
          : t("common.try_again", { defaultValue: "Une erreur est survenue. Veuillez réessayer." }),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <PageHero
          eyebrow={t("pages.review.hero_eyebrow", { defaultValue: "Avis client" })}
          title={(
            <>
              {t("pages.review.hero_title_prefix", { defaultValue: "Laissez votre" })}{" "}
              <span className="text-yellow-400">{t("pages.review.hero_title_highlight", { defaultValue: "Avis" })}</span>
            </>
          )}
          subtitle={t("pages.review.hero_subtitle", { defaultValue: "Votre retour nous aide à améliorer nos services. Votre avis sera publié après validation." })}
          ctaText={t("pages.review.hero_cta", { defaultValue: "Déposer mon avis" })}
          ctaLink="#deposer"
          imageSrc={heroLegal}
          large
        />

        <section className="py-16" id="deposer">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <Card className="p-6 md:p-10 border-2 border-primary/10 shadow-sm">
                {submitted ? (
                  <div className="text-center py-10">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-5">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold">
                      {t("pages.review.thank_you_title", { defaultValue: "Merci pour votre avis" })}
                    </h2>
                    <p className="mt-3 text-muted-foreground">
                      {t("pages.review.thank_you_desc", { defaultValue: "Votre avis est en attente de validation et sera publié très bientôt." })}
                    </p>
                    <div className="mt-6">
                      <Button variant="outline" onClick={() => setSubmitted(false)}>
                        {t("pages.review.leave_another", { defaultValue: "Laisser un autre avis" })}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("pages.review.form.name", { defaultValue: "Nom" })}</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        placeholder={t("pages.contact.placeholder_full_name", { defaultValue: "Ifè DÉ" })}
                        required
                      />
                      {errors.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
                    </div>

                    {/* Honeypot (anti-bot) */}
                    <div className="hidden" aria-hidden="true">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        tabIndex={-1}
                        autoComplete="off"
                        value={formData.company}
                        onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{t("pages.review.form.rating", { defaultValue: "Note" })}</Label>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const value = i + 1;
                          const active = value <= formData.rating;
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setFormData((p) => ({ ...p, rating: value }))}
                              className="rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-primary/40"
                              aria-label={t("pages.review.form.rating_star", { defaultValue: "Étoile" }) + ` ${value}`}
                            >
                              <Star className={(active ? "fill-accent text-accent" : "text-muted-foreground") + " h-6 w-6"} />
                            </button>
                          );
                        })}
                        <span className="ml-2 text-sm text-muted-foreground">{formData.rating}/5</span>
                      </div>
                      {errors.rating ? <p className="text-sm text-destructive">{errors.rating}</p> : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="comment">{t("pages.review.form.comment", { defaultValue: "Votre avis" })}</Label>
                      <Textarea
                        id="comment"
                        value={formData.comment}
                        onChange={(e) => setFormData((p) => ({ ...p, comment: e.target.value }))}
                        placeholder={t("pages.contact.placeholder_message", {
                          defaultValue: "Décrivez votre situation ou vos besoins juridiques...",
                        })}
                        rows={6}
                        required
                      />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{t("pages.review.form.comment_hint", { defaultValue: "Merci d’être précis et respectueux." })}</span>
                        <span>{formData.comment.trim().length}/1200</span>
                      </div>
                      {errors.comment ? <p className="text-sm text-destructive">{errors.comment}</p> : null}
                    </div>

                    <div className="pt-2">
                      <Button type="submit" className="w-full" disabled={!canSubmit}>
                        <Send className="mr-2 h-4 w-4" />
                        {isSubmitting
                          ? t("pages.review.form.submitting", { defaultValue: "Envoi..." })
                          : t("pages.review.form.submit", { defaultValue: "Envoyer mon avis" })}
                      </Button>
                    </div>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Review;
