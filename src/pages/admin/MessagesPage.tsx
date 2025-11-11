import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Mail, Trash2, Calendar } from 'lucide-react';
import { getMessages, deleteMessage } from '@/lib/firebaseApi';

interface Message {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt?: Date;
}

export default function MessagesPage() {
  const { toast } = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMessages = async () => {
    try {
      const data = await getMessages();
      setMessages(data as Message[]);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les messages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredMessages = messages.filter((message) =>
    message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce message ?')) return;

    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast({ title: 'Succès', description: 'Message supprimé avec succès' });
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de supprimer le message', variant: 'destructive' });
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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Messages de Contact</h1>
        <p className="text-muted-foreground">Gérez les messages reçus via le formulaire de contact</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredMessages.length === 0 ? (
        <Card className="p-12 text-center">
          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Aucun message trouvé</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredMessages.map((message) => (
            <Card key={message.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold">{message.name}</h3>
                    <Badge variant="outline">{message.email}</Badge>
                    {message.phone && <Badge variant="secondary">{message.phone}</Badge>}
                  </div>
                  <h4 className="font-semibold text-primary mb-2">{message.subject}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{message.message}</p>
                  {message.createdAt && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(message.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`}
                  >
                    <Mail className="h-3 w-3 mr-1" />
                    Répondre
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(message.id!)}>
                    <Trash2 className="h-3 w-3 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
