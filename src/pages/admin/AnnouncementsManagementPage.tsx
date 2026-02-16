import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Edit, Trash2, Search, Megaphone, Calendar as CalendarIcon, Link, Tag, X, AlertCircle, CheckCircle2, Info, Zap, PartyPopper } from 'lucide-react';
import { getAnnouncements, addAnnouncement, updateAnnouncement, deleteAnnouncement, type Announcement } from '@/lib/firebaseApi';
import { pickLocalizedString } from '@/lib/i18nFields';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function AnnouncementsManagementPage() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [editingLang, setEditingLang] = useState<'fr' | 'en'>('fr');
  const getFr = (field: any): string => pickLocalizedString(field, 'fr');
  const getLangValue = (field: any, lang: 'fr' | 'en'): string => pickLocalizedString(field, lang);
  const toLocalized = (nextValue: string, existing: any, lang: 'fr' | 'en') => {
    const base = existing && typeof existing === 'object' && existing !== null ? existing : { fr: '', en: '' };
    const prevFr = typeof base.fr === 'string' ? base.fr : '';
    const prevEn = typeof base.en === 'string' ? base.en : '';
    const fr = lang === 'fr' ? nextValue : (prevFr || nextValue);
    const en = lang === 'en' ? nextValue : (prevEn || nextValue);
    return { fr, en };
  };

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    type: 'info' as Announcement['type'],
    priority: 'medium' as Announcement['priority'],
    isActive: true,
    link: '',
    linkText: '',
    author: '',
    tags: [] as string[],
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
  });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const hydrateFormFromAnnouncement = (announcement: Announcement, lang: 'fr' | 'en') => {
    setFormData({
      title: getLangValue(announcement.title, lang),
      subtitle: announcement.subtitle ? getLangValue(announcement.subtitle, lang) : '',
      content: getLangValue(announcement.content, lang),
      type: announcement.type,
      priority: announcement.priority,
      isActive: announcement.isActive,
      link: announcement.link || '',
      linkText: announcement.linkText ? getLangValue(announcement.linkText, lang) : '',
      author: announcement.author || '',
      tags: announcement.tags || [],
      startDate: announcement.startDate,
      endDate: announcement.endDate,
    });
  };

  const fetchAnnouncements = async () => {
    try {
      const data = await getAnnouncements();
      setAnnouncements(data as Announcement[]);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les annonces',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements = announcements.filter((announcement) =>
    getFr(announcement.title)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getFr(announcement.content)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getFr(announcement.subtitle)?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    try {
      const existing = editingAnnouncement;
      const payloadRaw: Partial<Announcement> = {
        ...formData,
        title: toLocalized(formData.title, existing?.title, editingLang) as any,
        subtitle: formData.subtitle ? (toLocalized(formData.subtitle, existing?.subtitle, editingLang) as any) : undefined,
        content: toLocalized(formData.content, existing?.content, editingLang) as any,
        linkText: formData.linkText ? (toLocalized(formData.linkText, existing?.linkText, editingLang) as any) : undefined,
      };

      // Firestore n'accepte pas les champs `undefined`
      const payload = Object.fromEntries(
        Object.entries(payloadRaw).filter(([, value]) => value !== undefined)
      ) as Partial<Announcement>;

      if (editingAnnouncement) {
        await updateAnnouncement(editingAnnouncement.id!, payload);
        toast({ title: 'Succès', description: 'Annonce modifiée avec succès' });
      } else {
        await addAnnouncement(payload as Omit<Announcement, 'id'>);
        toast({ title: 'Succès', description: 'Annonce ajoutée avec succès' });
      }
      setDialogOpen(false);
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder l\'annonce', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette annonce ?')) return;
    try {
      await deleteAnnouncement(id);
      toast({ title: 'Succès', description: 'Annonce supprimée avec succès' });
      fetchAnnouncements();
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de supprimer l\'annonce', variant: 'destructive' });
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    hydrateFormFromAnnouncement(announcement, editingLang);
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingAnnouncement(null);
    setFormData({
      title: '',
      subtitle: '',
      content: '',
      type: 'info',
      priority: 'medium',
      isActive: true,
      link: '',
      linkText: '',
      author: '',
      tags: [],
      startDate: undefined,
      endDate: undefined,
    });
    setNewTag('');
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...(formData.tags || []), newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tag) });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      case 'success': return <CheckCircle2 className="h-4 w-4" />;
      case 'urgent': return <Zap className="h-4 w-4" />;
      case 'event': return <PartyPopper className="h-4 w-4" />;
      case 'promotion': return <Megaphone className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'event': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'promotion': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">Haute</Badge>;
      case 'medium': return <Badge variant="default">Moyenne</Badge>;
      case 'low': return <Badge variant="secondary">Basse</Badge>;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des Annonces</h1>
          <p className="text-muted-foreground">Gérez vos annonces et actualités juridiques</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Annonce
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une annonce..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredAnnouncements.map((announcement) => (
          <Card key={announcement.id} className={cn("border-l-4", !announcement.isActive && "opacity-60")}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn("p-1.5 rounded", getTypeColor(announcement.type))}>
                      {getTypeIcon(announcement.type)}
                    </div>
                    <CardTitle className="text-xl">{getFr(announcement.title)}</CardTitle>
                    {!announcement.isActive && <Badge variant="outline">Inactive</Badge>}
                  </div>
                  {announcement.subtitle && (
                    <CardDescription className="text-base font-medium mb-2">
                      {getFr(announcement.subtitle)}
                    </CardDescription>
                  )}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {getPriorityBadge(announcement.priority)}
                    <Badge variant="outline" className={getTypeColor(announcement.type)}>
                      {announcement.type}
                    </Badge>
                    {announcement.tags?.map(tag => (
                      <Badge key={tag} variant="secondary">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{getFr(announcement.content)}</p>
                  {announcement.link && (
                    <a href={announcement.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-2 inline-flex items-center gap-1">
                      <Link className="h-3 w-3" />
                      {announcement.linkText ? getFr(announcement.linkText) : 'En savoir plus'}
                    </a>
                  )}
                  <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                    {announcement.startDate && (
                      <span>Début: {format(new Date(announcement.startDate), 'dd MMM yyyy', { locale: fr })}</span>
                    )}
                    {announcement.endDate && (
                      <span>Fin: {format(new Date(announcement.endDate), 'dd MMM yyyy', { locale: fr })}</span>
                    )}
                    {announcement.author && <span>Par: {announcement.author}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(announcement)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Modifier
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(announcement.id!)}>
                    <Trash2 className="h-3 w-3 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {editingAnnouncement ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
            </DialogTitle>
            <DialogDescription>
              Remplissez tous les détails de l'annonce
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Langue</Label>
                <Select
                  value={editingLang}
                  onValueChange={(value) => {
                    const lang = value === 'en' ? 'en' : 'fr';
                    setEditingLang(lang);
                    if (editingAnnouncement) hydrateFormFromAnnouncement(editingAnnouncement, lang);
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

              <div className="grid gap-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Titre principal de l'annonce"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subtitle">Sous-titre</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Sous-titre ou résumé court"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">Contenu *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  placeholder="Contenu détaillé de l'annonce..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Information</SelectItem>
                      <SelectItem value="warning">Avertissement</SelectItem>
                      <SelectItem value="success">Succès</SelectItem>
                      <SelectItem value="promotion">Promotion</SelectItem>
                      <SelectItem value="event">Événement</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Priorité *</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Basse</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Haute</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Date de début</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("justify-start text-left font-normal", !formData.startDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(new Date(formData.startDate), 'dd MMM yyyy', { locale: fr }) : "Sélectionner"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate ? new Date(formData.startDate) : undefined}
                        onSelect={(date) => setFormData({ ...formData, startDate: date })}
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label>Date de fin</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("justify-start text-left font-normal", !formData.endDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(new Date(formData.endDate), 'dd MMM yyyy', { locale: fr }) : "Sélectionner"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate ? new Date(formData.endDate) : undefined}
                        onSelect={(date) => setFormData({ ...formData, endDate: date })}
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="link">Lien externe (optionnel)</Label>
                <Input
                  id="link"
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://exemple.com"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="linkText">Texte du lien</Label>
                <Input
                  id="linkText"
                  value={formData.linkText}
                  onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                  placeholder="En savoir plus"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="author">Auteur</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Nom de l'auteur"
                />
              </div>

              <div className="grid gap-2">
                <Label>Tags / Catégories</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Ajouter un tag"
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags?.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border rounded-lg p-4">
                <div className="space-y-0.5">
                  <Label>Annonce active</Label>
                  <p className="text-sm text-muted-foreground">
                    L'annonce sera visible sur le site public
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              {editingAnnouncement ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
