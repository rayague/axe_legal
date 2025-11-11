import { useState } from 'react';
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function TestFirestore() {
  const { toast } = useToast();
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testWrite = async () => {
    setLoading(true);
    setResult('Test en cours...');
    try {
      console.log('Tentative d\'ajout dans Firestore...');
      const docRef = await addDoc(collection(db, 'services'), {
        title: 'Test Service',
        description: 'Ceci est un test',
        icon: 'TestIcon',
        createdAt: Timestamp.now()
      });
      console.log('Document ajouté avec ID:', docRef.id);
      setResult(`✅ SUCCESS! Document ajouté avec ID: ${docRef.id}`);
      toast({ title: 'Succès', description: 'Document ajouté avec succès' });
    } catch (error: any) {
      console.error('Erreur complète:', error);
      setResult(`❌ ERREUR: ${error.message}\n\nCode: ${error.code}\n\nStack: ${error.stack}`);
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const testRead = async () => {
    setLoading(true);
    setResult('Lecture en cours...');
    try {
      console.log('Tentative de lecture depuis Firestore...');
      const querySnapshot = await getDocs(collection(db, 'services'));
      const count = querySnapshot.size;
      const services = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Services trouvés:', services);
      setResult(`✅ SUCCESS! ${count} document(s) trouvé(s):\n\n${JSON.stringify(services, null, 2)}`);
      toast({ title: 'Succès', description: `${count} document(s) trouvé(s)` });
    } catch (error: any) {
      console.error('Erreur complète:', error);
      setResult(`❌ ERREUR: ${error.message}\n\nCode: ${error.code}`);
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Test Firestore</h2>
        <p className="text-muted-foreground">Tester la connexion à Firestore</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actions de Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={testWrite} disabled={loading}>
              Test Écriture
            </Button>
            <Button onClick={testRead} disabled={loading} variant="outline">
              Test Lecture
            </Button>
          </div>

          {result && (
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap">{result}</pre>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p><strong>Ouvrez la console (F12)</strong> pour voir les logs détaillés</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
