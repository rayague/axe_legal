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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Bell,
  BellOff,
  Check,
  Clock,
  Eye,
  Info,
  Mail,
  Search,
  Settings,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  MailOpen,
  Archive,
} from 'lucide-react';

// Types de notifications
type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'message' | 'system';
type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';
type NotificationStatus = 'unread' | 'read' | 'archived';

interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  title: string;
  message: string;
  recipient?: string; // email ou "all" pour tous les utilisateurs
  sender?: string;
  link?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  readAt?: string;
  archivedAt?: string;
}

interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  archived: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
}

export default function NotificationsPage() {
  const { token } = useAuth();
  const { toast } = useToast();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    read: 0,
    archived: 0,
    byType: { info: 0, success: 0, warning: 0, error: 0, message: 0, system: 0 },
    byPriority: { low: 0, normal: 0, high: 0, urgent: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    type: 'info' as NotificationType,
    priority: 'normal' as NotificationPriority,
    title: '',
    message: '',
    recipient: 'all',
    link: '',
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    soundEnabled: true,
    autoMarkAsRead: false,
    groupByType: false,
  });

  // Charger les notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Erreur lors du chargement');
      const data = await response.json();
      setNotifications(data.notifications || []);
      setStats(data.stats || stats);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les notifications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  // Filtrer les notifications
  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      searchQuery === '' ||
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (notif.recipient && notif.recipient.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || notif.status === filterStatus;
    const matchesType = filterType === 'all' || notif.type === filterType;
    const matchesPriority = filterPriority === 'all' || notif.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  // Créer une notification
  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/admin/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Erreur lors de la création');

      toast({
        title: 'Notification créée',
        description: 'La notification a été envoyée avec succès',
      });

      setCreateDialogOpen(false);
      setFormData({
        type: 'info',
        priority: 'normal',
        title: '',
        message: '',
        recipient: 'all',
        link: '',
      });
      fetchNotifications();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la notification',
        variant: 'destructive',
      });
    }
  };

  // Marquer comme lu
  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Erreur');

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, status: 'read', readAt: new Date().toISOString() } : n
        )
      );
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de marquer comme lu',
        variant: 'destructive',
      });
    }
  };

  // Marquer comme non lu
  const markAsUnread = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/notifications/${id}/unread`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Erreur');

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: 'unread', readAt: undefined } : n))
      );
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de marquer comme non lu',
        variant: 'destructive',
      });
    }
  };

  // Archiver une notification
  const archiveNotification = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/notifications/${id}/archive`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Erreur');

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, status: 'archived', archivedAt: new Date().toISOString() } : n
        )
      );

      toast({
        title: 'Notification archivée',
        description: 'La notification a été archivée',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'archiver la notification',
        variant: 'destructive',
      });
    }
  };

  // Supprimer une notification
  const deleteNotification = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette notification ?')) return;

    try {
      const response = await fetch(`http://localhost:4000/api/admin/notifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Erreur');

      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast({
        title: 'Notification supprimée',
        description: 'La notification a été supprimée avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la notification',
        variant: 'destructive',
      });
    }
  };

  // Actions groupées
  const markAllAsRead = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/notifications/mark-all-read', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Erreur');

      fetchNotifications();
      toast({
        title: 'Succès',
        description: 'Toutes les notifications ont été marquées comme lues',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de marquer toutes les notifications comme lues',
        variant: 'destructive',
      });
    }
  };

  const deleteSelected = async () => {
    if (selectedNotifications.length === 0) {
      toast({
        title: 'Aucune sélection',
        description: 'Veuillez sélectionner au moins une notification',
        variant: 'destructive',
      });
      return;
    }

    if (!confirm(`Voulez-vous vraiment supprimer ${selectedNotifications.length} notification(s) ?`))
      return;

    try {
      await Promise.all(
        selectedNotifications.map((id) =>
          fetch(`http://localhost:4000/api/admin/notifications/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      setNotifications((prev) => prev.filter((n) => !selectedNotifications.includes(n.id)));
      setSelectedNotifications([]);
      toast({
        title: 'Notifications supprimées',
        description: `${selectedNotifications.length} notification(s) supprimée(s)`,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer les notifications sélectionnées',
        variant: 'destructive',
      });
    }
  };

  // Toggle selection
  const toggleSelection = (id: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
  };

  // Icônes par type
  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'message':
        return <Mail className="h-5 w-5 text-purple-500" />;
      case 'system':
        return <Settings className="h-5 w-5 text-gray-500" />;
    }
  };

  // Badge couleur par priorité
  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Ouvrir la notification
  const viewNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setViewDialogOpen(true);
    if (notification.status === 'unread') {
      markAsRead(notification.id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Gérez toutes les notifications de l'application</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSettingsDialogOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Bell className="h-4 w-4 mr-2" />
            Nouvelle notification
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total</p>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <Bell className="h-10 w-10 text-blue-600 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Non lues</p>
              <p className="text-3xl font-bold text-orange-900">{stats.unread}</p>
            </div>
            <MailOpen className="h-10 w-10 text-orange-600 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Lues</p>
              <p className="text-3xl font-bold text-green-900">{stats.read}</p>
            </div>
            <Check className="h-10 w-10 text-green-600 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Archivées</p>
              <p className="text-3xl font-bold text-gray-900">{stats.archived}</p>
            </div>
            <Archive className="h-10 w-10 text-gray-600 opacity-80" />
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Rechercher une notification..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="unread">Non lues</SelectItem>
              <SelectItem value="read">Lues</SelectItem>
              <SelectItem value="archived">Archivées</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="info">Information</SelectItem>
              <SelectItem value="success">Succès</SelectItem>
              <SelectItem value="warning">Avertissement</SelectItem>
              <SelectItem value="error">Erreur</SelectItem>
              <SelectItem value="message">Message</SelectItem>
              <SelectItem value="system">Système</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes priorités</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">Élevée</SelectItem>
              <SelectItem value="normal">Normale</SelectItem>
              <SelectItem value="low">Faible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedNotifications.length} notification(s) sélectionnée(s)
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={deleteSelected}>
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={toggleSelectAll}>
          {selectedNotifications.length === filteredNotifications.length
            ? 'Tout désélectionner'
            : 'Tout sélectionner'}
        </Button>
        <Button variant="outline" size="sm" onClick={markAllAsRead}>
          <Check className="h-4 w-4 mr-2" />
          Tout marquer comme lu
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center">
            <BellOff className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune notification</h3>
            <p className="text-gray-600">
              {searchQuery || filterStatus !== 'all' || filterType !== 'all' || filterPriority !== 'all'
                ? 'Aucune notification ne correspond à vos critères de recherche'
                : 'Vous n\'avez aucune notification pour le moment'}
            </p>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 ${
                notification.status === 'unread'
                  ? 'bg-blue-50 border-l-blue-500'
                  : notification.status === 'archived'
                  ? 'bg-gray-50 border-l-gray-400'
                  : 'border-l-transparent'
              }`}
              onClick={() => viewNotification(notification)}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <Checkbox
                  checked={selectedNotifications.includes(notification.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedNotifications([...selectedNotifications, notification.id]);
                    } else {
                      setSelectedNotifications(selectedNotifications.filter((id) => id !== notification.id));
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                />

                {/* Icon */}
                <div className="flex-shrink-0 mt-1">{getTypeIcon(notification.type)}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={`text-sm font-semibold ${
                            notification.status === 'unread' ? 'text-gray-900' : 'text-gray-600'
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <Badge className={getPriorityColor(notification.priority)}>
                          {notification.priority === 'urgent' && 'Urgent'}
                          {notification.priority === 'high' && 'Élevée'}
                          {notification.priority === 'normal' && 'Normale'}
                          {notification.priority === 'low' && 'Faible'}
                        </Badge>
                        {notification.status === 'unread' && (
                          <Badge variant="default" className="bg-blue-600">
                            Nouveau
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{notification.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(notification.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {notification.recipient && notification.recipient !== 'all' && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {notification.recipient}
                          </span>
                        )}
                        {notification.recipient === 'all' && (
                          <Badge variant="outline" className="text-xs">
                            Tous les utilisateurs
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {notification.status === 'unread' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          title="Marquer comme lu"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      ) : notification.status === 'read' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsUnread(notification.id)}
                          title="Marquer comme non lu"
                        >
                          <MailOpen className="h-4 w-4" />
                        </Button>
                      ) : null}

                      {notification.status !== 'archived' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => archiveNotification(notification.id)}
                          title="Archiver"
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedNotification && getTypeIcon(selectedNotification.type)}
              {selectedNotification?.title}
            </DialogTitle>
            <DialogDescription>Détails de la notification</DialogDescription>
          </DialogHeader>

          {selectedNotification && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Type</Label>
                  <p className="text-sm font-medium capitalize">{selectedNotification.type}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Priorité</Label>
                  <Badge className={getPriorityColor(selectedNotification.priority)}>
                    {selectedNotification.priority === 'urgent' && 'Urgent'}
                    {selectedNotification.priority === 'high' && 'Élevée'}
                    {selectedNotification.priority === 'normal' && 'Normale'}
                    {selectedNotification.priority === 'low' && 'Faible'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Statut</Label>
                  <p className="text-sm font-medium capitalize">{selectedNotification.status}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Destinataire</Label>
                  <p className="text-sm font-medium">
                    {selectedNotification.recipient === 'all'
                      ? 'Tous les utilisateurs'
                      : selectedNotification.recipient}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-500">Message</Label>
                <p className="text-sm mt-1 whitespace-pre-wrap">{selectedNotification.message}</p>
              </div>

              {selectedNotification.link && (
                <div>
                  <Label className="text-xs text-gray-500">Lien</Label>
                  <a
                    href={selectedNotification.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline block"
                  >
                    {selectedNotification.link}
                  </a>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                <div>
                  <Label className="text-xs text-gray-500">Créée le</Label>
                  <p>
                    {new Date(selectedNotification.createdAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {selectedNotification.readAt && (
                  <div>
                    <Label className="text-xs text-gray-500">Lue le</Label>
                    <p>
                      {new Date(selectedNotification.readAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
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

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer une notification</DialogTitle>
            <DialogDescription>Envoyez une notification aux utilisateurs</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateNotification} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: NotificationType) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Information</SelectItem>
                    <SelectItem value="success">Succès</SelectItem>
                    <SelectItem value="warning">Avertissement</SelectItem>
                    <SelectItem value="error">Erreur</SelectItem>
                    <SelectItem value="message">Message</SelectItem>
                    <SelectItem value="system">Système</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Priorité *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: NotificationPriority) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                    <SelectItem value="normal">Normale</SelectItem>
                    <SelectItem value="low">Faible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Titre *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Titre de la notification"
                required
              />
            </div>

            <div>
              <Label>Message *</Label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Contenu de la notification"
                rows={4}
                required
              />
            </div>

            <div>
              <Label>Destinataire</Label>
              <Input
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                placeholder="Email du destinataire ou 'all' pour tous"
              />
              <p className="text-xs text-gray-500 mt-1">
                Laissez "all" pour envoyer à tous les utilisateurs
              </p>
            </div>

            <div>
              <Label>Lien (optionnel)</Label>
              <Input
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">Envoyer la notification</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paramètres de notification</DialogTitle>
            <DialogDescription>Configurez vos préférences de notification</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notifications par email</Label>
                <p className="text-xs text-gray-500">Recevoir les notifications par email</p>
              </div>
              <Checkbox
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) =>
                  setNotificationSettings({ ...notificationSettings, emailNotifications: !!checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Notifications push</Label>
                <p className="text-xs text-gray-500">Recevoir des notifications push</p>
              </div>
              <Checkbox
                checked={notificationSettings.pushNotifications}
                onCheckedChange={(checked) =>
                  setNotificationSettings({ ...notificationSettings, pushNotifications: !!checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Son activé</Label>
                <p className="text-xs text-gray-500">Jouer un son pour les nouvelles notifications</p>
              </div>
              <Checkbox
                checked={notificationSettings.soundEnabled}
                onCheckedChange={(checked) =>
                  setNotificationSettings({ ...notificationSettings, soundEnabled: !!checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Marquer automatiquement comme lu</Label>
                <p className="text-xs text-gray-500">Marquer comme lu lors de la visualisation</p>
              </div>
              <Checkbox
                checked={notificationSettings.autoMarkAsRead}
                onCheckedChange={(checked) =>
                  setNotificationSettings({ ...notificationSettings, autoMarkAsRead: !!checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Grouper par type</Label>
                <p className="text-xs text-gray-500">Grouper les notifications par type</p>
              </div>
              <Checkbox
                checked={notificationSettings.groupByType}
                onCheckedChange={(checked) =>
                  setNotificationSettings({ ...notificationSettings, groupByType: !!checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setSettingsDialogOpen(false)}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
