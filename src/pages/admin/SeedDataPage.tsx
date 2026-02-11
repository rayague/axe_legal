import { useState } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Trash2, RefreshCw, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { migrateLocalizedContent } from '@/migrateLocalizedContent';

export default function SeedDataPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ services: 0, team: 0, testimonials: 0, processes: 0, announcements: 0 });

  const migrateI18n = async () => {
    setLoading(true);
    try {
      const summary = await migrateLocalizedContent();
      toast({
        title: 'Succès',
        description: `Migration i18n terminée (services: ${summary.services?.updated ?? 0}, team: ${summary.team?.updated ?? 0}, testimonials: ${summary.testimonials?.updated ?? 0}, processes: ${summary.processes?.updated ?? 0}, announcements: ${summary.announcements?.updated ?? 0}, legalCategories: ${summary.legalCategories?.updated ?? 0})`,
      });
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de migrer les contenus i18n', variant: 'destructive' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const checkData = async () => {
    try {
      const collections = ['services', 'team', 'testimonials', 'processes', 'announcements'];
      const newStats: Record<string, number> = {};
      
      for (const collectionName of collections) {
        const snapshot = await getDocs(collection(db, collectionName));
        newStats[collectionName] = snapshot.size;
      }
      
      setStats(newStats as typeof stats);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const seedData = async () => {
    setLoading(true);
    try {
      // Services
      const services = [
        { title: 'Droit des Affaires', description: 'Conseil juridique pour entreprises', icon: 'Briefcase', createdAt: Timestamp.now() },
        { title: 'Droit Fiscal', description: 'Optimisation fiscale et conformité', icon: 'DollarSign', createdAt: Timestamp.now() },
        { title: 'Droit Immobilier', description: 'Transactions immobilières', icon: 'Home', createdAt: Timestamp.now() },
        { title: 'Droit du Travail', description: 'Contrats et litiges du travail', icon: 'Users', createdAt: Timestamp.now() },
        { title: 'Droit de la Famille', description: 'Divorces, successions, tutelles', icon: 'Heart', createdAt: Timestamp.now() }
      ];

      for (const service of services) {
        await addDoc(collection(db, 'services'), service);
      }

      await setDoc(doc(db, 'services', 'droit-de-la-famille-successions'), {
        title: 'Droit de la Famille & Successions',
        slug: 'droit-de-la-famille-successions',
        icon: 'Heart',
        category: 'Droit de la famille',
        shortDescription: 'Accompagnement juridique personnalisé pour la protection des personnes, des biens et des liens familiaux, dans le respect du droit béninois.',
        description: 'Accompagnement juridique personnalisé pour la protection des personnes, des biens et des liens familiaux, dans le respect du droit béninois.',
        features: [
          'Conseil et assistance en matière de mariage (régimes matrimoniaux, droits et obligations des époux)',
          'Divorce et séparation : accompagnement juridique et conseil à la protection des intérêts des parties',
          'Successions : assistance à l’ouverture, l’organisation et le règlement successoral',
          'Assistance dans les démarches administratives et judiciaires liées au droit de la famille'
        ],
        benefits: [],
        pricing: 'Sur devis',
        duration: 'Variable selon le dossier',
        order: 50,
        createdAt: Timestamp.now()
      }, { merge: true });

      // Équipe
      const team = [
        { name: 'Me Jean Dupont', role: 'Juriste Senior', bio: '15 ans d\'expérience en droit des affaires', image: 'https://ui-avatars.com/api/?name=Jean+Dupont&size=200&background=1e40af&color=fff', createdAt: Timestamp.now() },
        { name: 'Me Sophie Martin', role: 'Juriste Fiscaliste', bio: 'Experte en fiscalité d\'entreprise', image: 'https://ui-avatars.com/api/?name=Sophie+Martin&size=200&background=7c3aed&color=fff', createdAt: Timestamp.now() },
        { name: 'Me Pierre Kouassi', role: 'Juriste Immobilier', bio: 'Spécialiste en droit foncier', image: 'https://ui-avatars.com/api/?name=Pierre+Kouassi&size=200&background=ea580c&color=fff', createdAt: Timestamp.now() }
      ];

      for (const member of team) {
        await addDoc(collection(db, 'team'), member);
      }

      // Témoignages
      const testimonials = [
        { name: 'Amadou Bah', role: 'CEO, ABC Sarl', content: 'Service excellent et professionnel !', rating: 5, image: 'https://ui-avatars.com/api/?name=Amadou+Bah&size=200', createdAt: Timestamp.now() },
        { name: 'Fatou Traoré', role: 'Entrepreneure', content: 'Très satisfaite de leur accompagnement.', rating: 5, image: 'https://ui-avatars.com/api/?name=Fatou+Traore&size=200', createdAt: Timestamp.now() }
      ];

      for (const testimonial of testimonials) {
        await addDoc(collection(db, 'testimonials'), testimonial);
      }

      // Processus
      const processes = [
        { title: 'Consultation', description: 'Première rencontre', order: 1, createdAt: Timestamp.now() },
        { title: 'Analyse', description: 'Étude du dossier', order: 2, createdAt: Timestamp.now() },
        { title: 'Stratégie', description: 'Plan d\'action', order: 3, createdAt: Timestamp.now() },
        { title: 'Exécution', description: 'Mise en œuvre', order: 4, createdAt: Timestamp.now() }
      ];

      for (const process of processes) {
        await addDoc(collection(db, 'processes'), process);
      }

      // Annonces
      const announcements = [
        { title: 'Bienvenue', content: 'Notre cabinet vous accueille !', type: 'success', createdAt: Timestamp.now() }
      ];

      for (const announcement of announcements) {
        await addDoc(collection(db, 'announcements'), announcement);
      }

      toast({ title: 'Succès !', description: 'Données ajoutées avec succès' });
      await checkData();
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible d\'ajouter les données', variant: 'destructive' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer TOUTES les données ?')) return;
    
    setLoading(true);
    try {
      const collections = ['services', 'team', 'testimonials', 'processes', 'announcements', 'messages', 'consultations'];
      
      for (const collectionName of collections) {
        const snapshot = await getDocs(collection(db, collectionName));
        for (const document of snapshot.docs) {
          await deleteDoc(doc(db, collectionName, document.id));
        }
      }
      
      toast({ title: 'Succès', description: 'Toutes les données ont été supprimées' });
      await checkData();
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de supprimer les données', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Gestion des Données</h2>
        <p className="text-muted-foreground">Ajouter ou supprimer des données de test</p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.services}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Équipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.team}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Témoignages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.testimonials}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Processus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.processes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Annonces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.announcements}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Gérer les données de la base de données</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={checkData} variant="outline" disabled={loading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Rafraîchir
            </Button>
            <Button onClick={seedData} disabled={loading}>
              <Database className="mr-2 h-4 w-4" />
              {loading ? 'Ajout en cours...' : 'Ajouter Données de Test'}
            </Button>
            <Button onClick={migrateI18n} variant="secondary" disabled={loading}>
              <Check className="mr-2 h-4 w-4" />
              Migrer i18n (FR→EN)
            </Button>
            <Button onClick={clearAll} variant="destructive" disabled={loading}>
              <Trash2 className="mr-2 h-4 w-4" />
              Tout Supprimer
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">ℹ️ Instructions</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Cliquez sur "Ajouter Données de Test" pour remplir la base avec des exemples</li>
              <li>• Utilisez "Rafraîchir" pour voir l'état actuel des données</li>
              <li>• "Tout Supprimer" efface toutes les données (irréversible !)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
