import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Calendar, Trash2, Eye, RefreshCw } from "lucide-react";

type ContactMessage = {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  sujet: string;
  message: string;
  date: string;
  read: boolean;
};

export default function MessagesPage() {
  const { token } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, [token]);

  const fetchMessages = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.messages) setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    if (!token) return;
    try {
      await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/messages/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(messages.map(msg => msg.id === id ? { ...msg, read: true } : msg));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!token || !confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(messages.filter(msg => msg.id !== id));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Messages de Contact
              </CardTitle>
              <CardDescription>
                Messages reçus via le formulaire de contact du site web
              </CardDescription>
            </div>
            <Button
              onClick={fetchMessages}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Chargement des messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Aucun message pour le moment</p>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <Card 
                  key={msg.id} 
                  className={`border-2 ${!msg.read ? 'border-primary/50 bg-primary/5' : 'border-border'}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-lg">{msg.nom}</h3>
                          {!msg.read && (
                            <Badge variant="default" className="text-xs">Nouveau</Badge>
                          )}
                          {msg.sujet && (
                            <Badge variant="outline" className="text-xs">{msg.sujet}</Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <a href={`mailto:${msg.email}`} className="hover:text-primary">
                              {msg.email}
                            </a>
                          </div>
                          {msg.telephone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <a href={`tel:${msg.telephone}`} className="hover:text-primary">
                                {msg.telephone}
                              </a>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(msg.date)}</span>
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t">
                          <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {!msg.read && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsRead(msg.id)}
                            className="gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            Marquer lu
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMessage(msg.id)}
                          className="gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
