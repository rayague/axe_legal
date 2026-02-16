import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Search, Star } from 'lucide-react';
import { getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial } from '@/lib/firebaseApi';
import { pickLocalizedString } from '@/lib/i18nFields';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Testimonial {
  id?: string;
  name: string;
  role: any;
  content: any;
  rating: number;
  image: string;
}

export default function TestimonialsManagementPage() {
  const { toast } = useToast();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [editingLang, setEditingLang] = useState<'fr' | 'en'>('fr');

  const getLangValue = (field: any, lang: 'fr' | 'en'): string => pickLocalizedString(field, lang);
  const toLocalized = (nextValue: string, existing: any, lang: 'fr' | 'en') => {
    const base = existing && typeof existing === 'object' && existing !== null ? existing : { fr: '', en: '' };
    const prevFr = typeof base.fr === 'string' ? base.fr : '';
    const prevEn = typeof base.en === 'string' ? base.en : '';
    const fr = lang === 'fr' ? nextValue : (prevFr || nextValue);
    const en = lang === 'en' ? nextValue : (prevEn || nextValue);
    return { fr, en };
  };

  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '',
    role: '',
    content: '',
    rating: 5,
    image: '',
  });

  const fetchTestimonials = async () => {
    try {
      const data = await getTestimonials();
      setTestimonials(data as Testimonial[]);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les témoignages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredTestimonials = testimonials.filter((testimonial) =>
    testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getLangValue(testimonial.content, 'fr').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payloadRaw = {
        ...formData,
        role: toLocalized(String(formData.role || ''), undefined, editingLang),
        content: toLocalized(String(formData.content || ''), undefined, editingLang),
      } as any;

      // Firestore n'accepte pas les champs `undefined`
      const payload = Object.fromEntries(
        Object.entries(payloadRaw).filter(([, value]) => value !== undefined)
      ) as any;

      await addTestimonial(payload as Omit<Testimonial, 'id'>);
      toast({ title: 'Succès', description: 'Témoignage ajouté avec succès' });
      setCreateDialogOpen(false);
      resetForm();
      fetchTestimonials();
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible d\'ajouter le témoignage', variant: 'destructive' });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTestimonial) return;

    try {
      const payloadRaw: Partial<Testimonial> = {
        ...formData,
        role: toLocalized(String(formData.role || ''), selectedTestimonial.role, editingLang) as any,
        content: toLocalized(String(formData.content || ''), selectedTestimonial.content, editingLang) as any,
      };

      // Firestore n'accepte pas les champs `undefined`
      const payload = Object.fromEntries(
        Object.entries(payloadRaw).filter(([, value]) => value !== undefined)
      ) as Partial<Testimonial>;

      await updateTestimonial(selectedTestimonial.id!, payload as any);
      toast({ title: 'Succès', description: 'Témoignage modifié avec succès' });
      setEditDialogOpen(false);
      resetForm();
      fetchTestimonials();
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de modifier le témoignage', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce témoignage ?')) return;

    try {
      await deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      toast({ title: 'Succès', description: 'Témoignage supprimé avec succès' });
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de supprimer le témoignage', variant: 'destructive' });
    }
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      role: getLangValue(testimonial.role, editingLang),
      content: getLangValue(testimonial.content, editingLang),
      rating: testimonial.rating,
      image: testimonial.image,
    });
    setEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', role: '', content: '', rating: 5, image: '' });
    setSelectedTestimonial(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestion des Témoignages</h1>
        <p className="text-muted-foreground">Gérez les témoignages clients</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un témoignage..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un témoignage
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4 flex-1">
                {testimonial.image && (
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold">{testimonial.name}</h3>
                    <span className="text-sm text-muted-foreground">• {getLangValue(testimonial.role, 'fr')}</span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{getLangValue(testimonial.content, 'fr')}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(testimonial)}>
                  <Edit className="h-3 w-3 mr-1" />
                  Modifier
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(testimonial.id!)}>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Supprimer
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un témoignage</DialogTitle>
            <DialogDescription>Ajoutez un nouveau témoignage client</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-4">
              <div>
                <Label>Langue</Label>
                <Select value={editingLang} onValueChange={(value) => setEditingLang(value === 'en' ? 'en' : 'fr')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">FR</SelectItem>
                    <SelectItem value="en">EN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Nom</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Rôle</Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Contenu</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label>Note (1-5)</Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label>URL de l'image</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le témoignage</DialogTitle>
            <DialogDescription>Modifiez le témoignage</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="space-y-4">
              <div>
                <Label>Langue</Label>
                <Select
                  value={editingLang}
                  onValueChange={(value) => {
                    const lang = value === 'en' ? 'en' : 'fr';
                    setEditingLang(lang);
                    if (selectedTestimonial) {
                      setFormData({
                        ...formData,
                        role: getLangValue(selectedTestimonial.role, lang),
                        content: getLangValue(selectedTestimonial.content, lang),
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">FR</SelectItem>
                    <SelectItem value="en">EN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Nom</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Rôle</Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Contenu</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label>Note (1-5)</Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label>URL de l'image</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
