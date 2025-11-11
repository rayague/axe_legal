import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Users,
} from 'lucide-react';
import { getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember } from '@/lib/firebaseApi';

interface TeamMember {
  id?: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

const ROLES = [
  'Avocat Associé',
  'Avocat Senior',
  'Avocat',
  'Avocat Junior',
  'Juriste',
  'Paralegal',
  'Assistant juridique',
];

const SPECIALTIES = [
  'Droit des affaires',
  'Droit fiscal',
  'Droit immobilier',
  'Droit du travail',
  'Droit de la famille',
  'Droit pénal',
  'Droit administratif',
  'Contentieux',
  'Arbitrage',
];

const LANGUAGES = [
  'Français',
  'Anglais',
  'Espagnol',
  'Allemand',
  'Italien',
  'Portugais',
  'Arabe',
  'Chinois',
];

export default function TeamManagementPage() {
  const { toast } = useToast();

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    role: '',
    bio: '',
    image: '',
  });

  // Charger les membres
  const fetchMembers = async () => {
    try {
      const data = await getTeamMembers();
      setMembers(data as TeamMember[]);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les membres de l\'équipe',
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

  // Filtrer les membres
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      searchQuery === '' ||
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Créer un membre
  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTeamMember(formData as Omit<TeamMember, 'id'>);

      toast({
        title: 'Membre ajouté',
        description: 'Le membre a été ajouté avec succès',
      });

      setCreateDialogOpen(false);
      resetForm();
      fetchMembers();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter le membre',
        variant: 'destructive',
      });
    }
  };

  // Modifier un membre
  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    try {
      await updateTeamMember(selectedMember.id!, formData);

      toast({
        title: 'Membre modifié',
        description: 'Le membre a été modifié avec succès',
      });

      setEditDialogOpen(false);
      resetForm();
      fetchMembers();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le membre',
        variant: 'destructive',
      });
    }
  };

  // Supprimer un membre
  const deleteMember = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce membre ?')) return;

    try {
      await deleteTeamMember(id);

      setMembers((prev) => prev.filter((m) => m.id !== id));
      toast({
        title: 'Membre supprimé',
        description: 'Le membre a été supprimé avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le membre',
        variant: 'destructive',
      });
    }
  };

  // Ouvrir le dialog d'édition
  const openEditDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      image: member.image,
      education: member.education,
      experience: member.experience,
      email: member.email,
      phone: member.phone,
      linkedin: member.linkedin,
      imageUrl: member.imageUrl,
      isActive: member.isActive,
      order: member.order,
      languages: member.languages,
      certifications: member.certifications,
      achievements: member.achievements,
    });
    setEditDialogOpen(true);
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      title: '',
      bio: '',
      specialties: [],
      education: [],
      experience: '',
      email: '',
      phone: '',
      linkedin: '',
      imageUrl: '',
      isActive: true,
      order: 0,
      languages: [],
      certifications: [],
      achievements: [],
    });
    setSpecialtyInput('');
    setEducationInput('');
    setLanguageInput('');
    setCertificationInput('');
    setAchievementInput('');
    setSelectedMember(null);
  };

  // Ajouter une spécialité
  const addSpecialty = () => {
    if (specialtyInput.trim() && !formData.specialties?.includes(specialtyInput.trim())) {
      setFormData({
        ...formData,
        specialties: [...(formData.specialties || []), specialtyInput.trim()],
      });
      setSpecialtyInput('');
    }
  };

  // Ajouter une formation
  const addEducation = () => {
    if (educationInput.trim()) {
      setFormData({
        ...formData,
        education: [...(formData.education || []), educationInput.trim()],
      });
      setEducationInput('');
    }
  };

  // Ajouter une langue
  const addLanguage = () => {
    if (languageInput.trim() && !formData.languages?.includes(languageInput.trim())) {
      setFormData({
        ...formData,
        languages: [...(formData.languages || []), languageInput.trim()],
      });
      setLanguageInput('');
    }
  };

  // Ajouter une certification
  const addCertification = () => {
    if (certificationInput.trim()) {
      setFormData({
        ...formData,
        certifications: [...(formData.certifications || []), certificationInput.trim()],
      });
      setCertificationInput('');
    }
  };

  // Ajouter une réalisation
  const addAchievement = () => {
    if (achievementInput.trim()) {
      setFormData({
        ...formData,
        achievements: [...(formData.achievements || []), achievementInput.trim()],
      });
      setAchievementInput('');
    }
  };

  // Supprimer d'une liste
  const removeFromList = (
    list: 'specialties' | 'education' | 'languages' | 'certifications' | 'achievements',
    index: number
  ) => {
    const newList = [...(formData[list] || [])];
    newList.splice(index, 1);
    setFormData({ ...formData, [list]: newList });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'équipe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion de l'Équipe</h1>
          <p className="text-gray-600 mt-1">
            Gérez les membres de l'équipe affichés sur la page publique /equipe
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau membre
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total</p>
              <p className="text-3xl font-bold text-blue-900">{members.length}</p>
            </div>
            <Users className="h-10 w-10 text-blue-600 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Actifs</p>
              <p className="text-3xl font-bold text-green-900">
                {members.filter((m) => m.isActive).length}
              </p>
            </div>
            <Eye className="h-10 w-10 text-green-600 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Inactifs</p>
              <p className="text-3xl font-bold text-orange-900">
                {members.filter((m) => !m.isActive).length}
              </p>
            </div>
            <EyeOff className="h-10 w-10 text-orange-600 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Rôles</p>
              <p className="text-3xl font-bold text-purple-900">
                {new Set(members.map((m) => m.role)).size}
              </p>
            </div>
            <Award className="h-10 w-10 text-purple-600 opacity-80" />
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Rechercher un membre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger>
              <SelectValue placeholder="Rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les rôles</SelectItem>
              {ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="inactive">Inactifs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Team Members List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.length === 0 ? (
          <Card className="col-span-full p-12 text-center">
            <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun membre trouvé</h3>
            <p className="text-gray-600">
              {searchQuery || filterRole !== 'all' || filterStatus !== 'all'
                ? 'Aucun membre ne correspond à vos critères de recherche'
                : 'Commencez par ajouter votre premier membre'}
            </p>
          </Card>
        ) : (
          filteredMembers.map((member) => (
            <Card
              key={member.id}
              className={`p-6 hover:shadow-lg transition-shadow ${
                !member.isActive ? 'opacity-60 bg-gray-50' : ''
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {member.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                  <Badge variant="outline" className="mt-1">
                    {member.title}
                  </Badge>
                </div>
                {member.isActive ? (
                  <Badge className="bg-green-100 text-green-800">Actif</Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{member.bio}</p>

              {member.specialties && member.specialties.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Spécialités</p>
                  <div className="flex flex-wrap gap-1">
                    {member.specialties.slice(0, 3).map((spec, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {member.specialties.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{member.specialties.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                {member.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {member.email.substring(0, 20)}...
                  </span>
                )}
                {member.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {member.phone}
                  </span>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedMember(member);
                    setViewDialogOpen(true);
                  }}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Voir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(member)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleActive(member.id, member.isActive)}
                >
                  {member.isActive ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteMember(member.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog
        open={createDialogOpen || editDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCreateDialogOpen(false);
            setEditDialogOpen(false);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editDialogOpen ? 'Modifier le membre' : 'Ajouter un nouveau membre'}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations du membre. Les champs marqués d'un * sont obligatoires.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={editDialogOpen ? handleUpdateMember : handleCreateMember} className="space-y-6">
            {/* Informations personnelles */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Informations personnelles</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nom complet *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Jean Dupont"
                    required
                  />
                </div>

                <div>
                  <Label>Rôle *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Titre professionnel *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Expert en Droit des Affaires"
                  required
                />
              </div>

              <div>
                <Label>Biographie *</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Présentez le membre, son parcours et son expertise..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label>Expérience professionnelle</Label>
                <Textarea
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="Résumé de l'expérience professionnelle..."
                  rows={3}
                />
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Contact</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemple.com"
                    required
                  />
                </div>

                <div>
                  <Label>Téléphone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+229 XX XX XX XX"
                  />
                </div>
              </div>

              <div>
                <Label>LinkedIn</Label>
                <Input
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div>
                <Label>URL de la photo</Label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Spécialités */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Spécialités</h3>
              <div className="flex gap-2">
                <Select value={specialtyInput} onValueChange={setSpecialtyInput}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Sélectionnez une spécialité" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALTIES.filter(s => !formData.specialties?.includes(s)).map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={addSpecialty}>
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.specialties?.map((spec, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => removeFromList('specialties', index)}
                  >
                    {spec} ✕
                  </Badge>
                ))}
              </div>
            </div>

            {/* Formation */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Formation</h3>
              <div className="flex gap-2">
                <Input
                  value={educationInput}
                  onChange={(e) => setEducationInput(e.target.value)}
                  placeholder="Ex: Master en Droit des Affaires - Université..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addEducation();
                    }
                  }}
                />
                <Button type="button" onClick={addEducation}>
                  Ajouter
                </Button>
              </div>
              <ul className="space-y-1">
                {formData.education?.map((edu, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-red-50"
                    onClick={() => removeFromList('education', index)}
                  >
                    <span className="text-sm">{edu}</span>
                    <span className="text-red-500">✕</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Langues */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Langues</h3>
              <div className="flex gap-2">
                <Select value={languageInput} onValueChange={setLanguageInput}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Sélectionnez une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.filter(l => !formData.languages?.includes(l)).map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={addLanguage}>
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.languages?.map((lang, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => removeFromList('languages', index)}
                  >
                    {lang} ✕
                  </Badge>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Certifications</h3>
              <div className="flex gap-2">
                <Input
                  value={certificationInput}
                  onChange={(e) => setCertificationInput(e.target.value)}
                  placeholder="Ex: Certifié en Médiation Commerciale"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCertification();
                    }
                  }}
                />
                <Button type="button" onClick={addCertification}>
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.certifications?.map((cert, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => removeFromList('certifications', index)}
                  >
                    {cert} ✕
                  </Badge>
                ))}
              </div>
            </div>

            {/* Réalisations */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Réalisations notables</h3>
              <div className="flex gap-2">
                <Input
                  value={achievementInput}
                  onChange={(e) => setAchievementInput(e.target.value)}
                  placeholder="Ex: A représenté avec succès..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addAchievement();
                    }
                  }}
                />
                <Button type="button" onClick={addAchievement}>
                  Ajouter
                </Button>
              </div>
              <ul className="space-y-1">
                {formData.achievements?.map((achievement, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-red-50"
                    onClick={() => removeFromList('achievements', index)}
                  >
                    <span className="text-sm">{achievement}</span>
                    <span className="text-red-500">✕</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Paramètres */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Paramètres</h3>
              
              <div>
                <Label>Ordre d'affichage</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                  }
                  placeholder="0"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label>Membre actif (visible sur le site)</Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCreateDialogOpen(false);
                  setEditDialogOpen(false);
                  resetForm();
                }}
              >
                Annuler
              </Button>
              <Button type="submit">
                {editDialogOpen ? 'Modifier' : 'Ajouter'} le membre
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {selectedMember?.name}
            </DialogTitle>
            <DialogDescription>Informations complètes du membre</DialogDescription>
          </DialogHeader>

          {selectedMember && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Rôle</Label>
                  <p className="font-medium">{selectedMember.role}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Titre</Label>
                  <p className="font-medium">{selectedMember.title}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Email</Label>
                  <p className="font-medium">{selectedMember.email}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Téléphone</Label>
                  <p className="font-medium">{selectedMember.phone || 'Non renseigné'}</p>
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-500">Biographie</Label>
                <p className="text-sm mt-1 whitespace-pre-wrap">{selectedMember.bio}</p>
              </div>

              {selectedMember.experience && (
                <div>
                  <Label className="text-xs text-gray-500">Expérience</Label>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{selectedMember.experience}</p>
                </div>
              )}

              {selectedMember.specialties && selectedMember.specialties.length > 0 && (
                <div>
                  <Label className="text-xs text-gray-500">Spécialités</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedMember.specialties.map((spec, i) => (
                      <Badge key={i} variant="secondary">{spec}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedMember.education && selectedMember.education.length > 0 && (
                <div>
                  <Label className="text-xs text-gray-500">Formation</Label>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {selectedMember.education.map((edu, i) => (
                      <li key={i} className="text-sm">{edu}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedMember.languages && selectedMember.languages.length > 0 && (
                <div>
                  <Label className="text-xs text-gray-500">Langues</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedMember.languages.map((lang, i) => (
                      <Badge key={i} variant="outline">{lang}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedMember.certifications && selectedMember.certifications.length > 0 && (
                <div>
                  <Label className="text-xs text-gray-500">Certifications</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedMember.certifications.map((cert, i) => (
                      <Badge key={i} variant="secondary">{cert}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedMember.achievements && selectedMember.achievements.length > 0 && (
                <div>
                  <Label className="text-xs text-gray-500">Réalisations</Label>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {selectedMember.achievements.map((achievement, i) => (
                      <li key={i} className="text-sm">{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedMember.linkedin && (
                <div>
                  <Label className="text-xs text-gray-500">LinkedIn</Label>
                  <a
                    href={selectedMember.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Linkedin className="h-4 w-4" />
                    Voir le profil
                  </a>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                <div>
                  <Label className="text-xs text-gray-500">Créé le</Label>
                  <p>{new Date(selectedMember.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
                {selectedMember.updatedAt && (
                  <div>
                    <Label className="text-xs text-gray-500">Modifié le</Label>
                    <p>{new Date(selectedMember.updatedAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
