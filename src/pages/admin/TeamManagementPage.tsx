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
import { Plus, Edit, Trash2, Search, Users } from 'lucide-react';
import { getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember } from '@/lib/firebaseApi';
import { pickLocalizedString } from '@/lib/i18nFields';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TeamMember {
  id?: string;
  name: string;
  role: any;
  bio: any;
  image: string;
}

export default function TeamManagementPage() {
  const { toast } = useToast();

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

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

  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    role: '',
    bio: '',
    image: '',
  });

  const fetchMembers = async () => {
    try {
      const data = await getTeamMembers();
      setMembers(data as TeamMember[]);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les membres',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getLangValue(member.role, 'fr').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        role: toLocalized(String(formData.role || ''), undefined, editingLang),
        bio: toLocalized(String(formData.bio || ''), undefined, editingLang),
      } as any;
      await addTeamMember(payload as Omit<TeamMember, 'id'>);
      toast({ title: 'Succès', description: 'Membre ajouté avec succès' });
      setCreateDialogOpen(false);
      resetForm();
      fetchMembers();
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible d\'ajouter le membre', variant: 'destructive' });
    }
  };

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    try {
      const payload: Partial<TeamMember> = {
        ...formData,
        role: toLocalized(String(formData.role || ''), selectedMember.role, editingLang) as any,
        bio: toLocalized(String(formData.bio || ''), selectedMember.bio, editingLang) as any,
      };
      await updateTeamMember(selectedMember.id!, payload as any);
      toast({ title: 'Succès', description: 'Membre modifié avec succès' });
      setEditDialogOpen(false);
      resetForm();
      fetchMembers();
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de modifier le membre', variant: 'destructive' });
    }
  };

  const deleteMember = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce membre ?')) return;

    try {
      await deleteTeamMember(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      toast({ title: 'Succès', description: 'Membre supprimé avec succès' });
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de supprimer le membre', variant: 'destructive' });
    }
  };

  const openEditDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      role: getLangValue(member.role, editingLang),
      bio: getLangValue(member.bio, editingLang),
      image: member.image,
    });
    setEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', role: '', bio: '', image: '' });
    setSelectedMember(null);
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
        <h1 className="text-3xl font-bold mb-2">Gestion de l'Équipe</h1>
        <p className="text-muted-foreground">Gérez les membres de votre équipe</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un membre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un membre
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="p-6">
            <div className="flex items-start gap-4 mb-4">
              {member.image ? (
                <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-bold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{getLangValue(member.role, 'fr')}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{getLangValue(member.bio, 'fr')}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => openEditDialog(member)}>
                <Edit className="h-3 w-3 mr-1" />
                Modifier
              </Button>
              <Button variant="outline" size="sm" onClick={() => deleteMember(member.id!)}>
                <Trash2 className="h-3 w-3 mr-1" />
                Supprimer
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un membre</DialogTitle>
            <DialogDescription>Ajoutez un nouveau membre à l'équipe</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateMember}>
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
                <Label>Bio</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
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
            <DialogTitle>Modifier le membre</DialogTitle>
            <DialogDescription>Modifiez les informations du membre</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateMember}>
            <div className="space-y-4">
              <div>
                <Label>Langue</Label>
                <Select
                  value={editingLang}
                  onValueChange={(value) => {
                    const lang = value === 'en' ? 'en' : 'fr';
                    setEditingLang(lang);
                    if (selectedMember) {
                      setFormData({
                        ...formData,
                        role: getLangValue(selectedMember.role, lang),
                        bio: getLangValue(selectedMember.bio, lang),
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
                <Label>Bio</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
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
