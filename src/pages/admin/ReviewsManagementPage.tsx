import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { deleteReview, getPendingReviews, type Review, updateReviewStatus } from "@/lib/firebaseApi";
import { CheckCircle, EyeOff, Search, Star, Trash2 } from "lucide-react";

export default function ReviewsManagementPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPending = async () => {
    try {
      setLoading(true);
      const data = await getPendingReviews();
      setItems(data);
    } catch (error) {
      console.error("Error fetching pending reviews:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les avis en attente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter((r) => (r.name || "").toLowerCase().includes(q) || (r.comment || "").toLowerCase().includes(q));
  }, [items, searchQuery]);

  const handlePublish = async (id: string) => {
    try {
      await updateReviewStatus(id, "published");
      setItems((prev) => prev.filter((x) => x.id !== id));
      toast({ title: "Succès", description: "Avis publié" });
    } catch (error) {
      console.error("Error publishing review:", error);
      toast({ title: "Erreur", description: "Impossible de publier l'avis", variant: "destructive" });
    }
  };

  const handleHide = async (id: string) => {
    try {
      await updateReviewStatus(id, "hidden");
      setItems((prev) => prev.filter((x) => x.id !== id));
      toast({ title: "Succès", description: "Avis masqué" });
    } catch (error) {
      console.error("Error hiding review:", error);
      toast({ title: "Erreur", description: "Impossible de masquer l'avis", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet avis ?")) return;
    try {
      await deleteReview(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
      toast({ title: "Succès", description: "Avis supprimé" });
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({ title: "Erreur", description: "Impossible de supprimer l'avis", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestion des Avis</h1>
        <p className="text-muted-foreground">Validez et publiez les avis déposés par vos clients</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un avis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={fetchPending}>
          Actualiser
        </Button>
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">Aucun avis en attente.</Card>
        ) : (
          filtered.map((r) => (
            <Card key={r.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-bold text-foreground">{r.name}</div>
                      <div className="mt-2 flex gap-1">
                        {Array.from({ length: r.rating || 5 }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-muted-foreground whitespace-pre-line">{r.comment}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button size="sm" onClick={() => handlePublish(r.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Publier
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleHide(r.id)}>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Masquer
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(r.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
