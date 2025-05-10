
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Bell, Check, Clock, Calendar, Trash2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";

interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  type: 'appointment' | 'reminder' | 'system';
}

const Notifications = () => {
  const { toast } = useToast();
  
  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Agendamento Confirmado",
      message: "Seu agendamento para Corte de Cabelo foi confirmado para amanhã às 14:00.",
      date: new Date(2025, 4, 11, 10, 30),
      read: false,
      type: 'appointment'
    },
    {
      id: "2",
      title: "Lembrete de Compromisso",
      message: "Você tem um agendamento de Manicure hoje às 16:00.",
      date: new Date(2025, 4, 10, 9, 0),
      read: false,
      type: 'reminder'
    },
    {
      id: "3",
      title: "Agendamento Reagendado",
      message: "Seu agendamento de Hidratação foi reagendado para 15/05 às 11:00.",
      date: new Date(2025, 4, 9, 15, 45),
      read: true,
      type: 'appointment'
    },
    {
      id: "4",
      title: "Novo Estabelecimento Disponível",
      message: "Barbearia Moderna foi adicionada ao sistema. Confira os serviços disponíveis!",
      date: new Date(2025, 4, 8, 12, 15),
      read: true,
      type: 'system'
    }
  ]);
  
  const [preferences, setPreferences] = useState({
    email: true,
    whatsapp: true,
    reminderBefore24h: true,
    reminderBefore1h: true
  });
  
  const handleNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };
  
  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notificação removida",
      description: "A notificação foi removida com sucesso."
    });
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast({
      title: "Todas notificações lidas",
      description: "Todas as notificações foram marcadas como lidas."
    });
  };
  
  const handleTogglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast({
      title: "Preferências atualizadas",
      description: "Suas preferências de notificação foram atualizadas."
    });
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-5 w-5 text-teal" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-sky" />;
      case 'system':
      default:
        return <Bell className="h-5 w-5 text-cream" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cream">Notificações</h1>
        <p className="text-cream/70">Gerencie suas notificações e preferências.</p>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-navy-dark border-b border-sky/10 w-full justify-start rounded-none p-0">
          <TabsTrigger 
            value="all"
            className="data-[state=active]:border-b-2 data-[state=active]:border-teal data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-2 text-cream/70 data-[state=active]:text-cream"
          >
            Todas
          </TabsTrigger>
          <TabsTrigger 
            value="unread"
            className="data-[state=active]:border-b-2 data-[state=active]:border-teal data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-2 text-cream/70 data-[state=active]:text-cream"
          >
            Não Lidas {unreadCount > 0 && `(${unreadCount})`}
          </TabsTrigger>
          <TabsTrigger 
            value="preferences"
            className="data-[state=active]:border-b-2 data-[state=active]:border-teal data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-2 text-cream/70 data-[state=active]:text-cream"
          >
            Preferências
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-6">
          <Card className="bg-navy-dark border-sky/10">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-cream">Todas as Notificações</CardTitle>
                {notifications.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="border-sky/20 text-cream hover:bg-navy"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Marcar todas como lidas
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-cream/20 mx-auto mb-4" />
                  <h3 className="text-lg text-cream mb-1">Nenhuma notificação</h3>
                  <p className="text-cream/70">Você não tem notificações no momento.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-4 rounded-lg border ${notification.read ? 'border-sky/10 bg-navy/20' : 'border-teal/20 bg-navy/60'}`}
                    >
                      <div className="flex">
                        <div className="mr-4 pt-1">
                          <div className="p-2 rounded-full bg-navy/60">
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className={`font-medium ${notification.read ? 'text-cream/80' : 'text-cream'}`}>
                              {notification.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              {!notification.read && (
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-6 w-6 hover:bg-sky/10"
                                  onClick={() => handleNotificationRead(notification.id)}
                                >
                                  <Check className="h-4 w-4 text-teal" />
                                </Button>
                              )}
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-6 w-6 hover:bg-red-600/10"
                                onClick={() => handleDeleteNotification(notification.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-400" />
                              </Button>
                            </div>
                          </div>
                          <p className={`text-sm ${notification.read ? 'text-cream/60' : 'text-cream/80'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-cream/40 mt-2">
                            {formatDistanceToNow(notification.date, { addSuffix: true, locale: pt })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="unread" className="pt-6">
          <Card className="bg-navy-dark border-sky/10">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-cream">Notificações Não Lidas</CardTitle>
                {unreadCount > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="border-sky/20 text-cream hover:bg-navy"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Marcar todas como lidas
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {unreadCount === 0 ? (
                <div className="text-center py-8">
                  <Check className="h-12 w-12 text-cream/20 mx-auto mb-4" />
                  <h3 className="text-lg text-cream mb-1">Tudo em dia!</h3>
                  <p className="text-cream/70">Você não tem notificações não lidas.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications
                    .filter(notif => !notif.read)
                    .map(notification => (
                      <div 
                        key={notification.id} 
                        className="p-4 rounded-lg border border-teal/20 bg-navy/60"
                      >
                        <div className="flex">
                          <div className="mr-4 pt-1">
                            <div className="p-2 rounded-full bg-navy/60">
                              {getNotificationIcon(notification.type)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-cream">
                                {notification.title}
                              </h3>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-6 w-6 hover:bg-sky/10"
                                  onClick={() => handleNotificationRead(notification.id)}
                                >
                                  <Check className="h-4 w-4 text-teal" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-6 w-6 hover:bg-red-600/10"
                                  onClick={() => handleDeleteNotification(notification.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-400" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-cream/80">
                              {notification.message}
                            </p>
                            <p className="text-xs text-cream/40 mt-2">
                              {formatDistanceToNow(notification.date, { addSuffix: true, locale: pt })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="pt-6">
          <Card className="bg-navy-dark border-sky/10">
            <CardHeader>
              <div className="flex items-center">
                <Settings className="h-5 w-5 text-teal mr-2" />
                <CardTitle className="text-cream">Preferências de Notificação</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-cream">Métodos de Notificação</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-cream">Email</p>
                        <p className="text-sm text-cream/60">Receber notificações por email</p>
                      </div>
                      <Switch 
                        checked={preferences.email} 
                        onCheckedChange={() => handleTogglePreference('email')}
                        className="data-[state=checked]:bg-teal"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-cream">WhatsApp</p>
                        <p className="text-sm text-cream/60">Receber notificações por WhatsApp</p>
                      </div>
                      <Switch 
                        checked={preferences.whatsapp} 
                        onCheckedChange={() => handleTogglePreference('whatsapp')}
                        className="data-[state=checked]:bg-teal"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-sky/10">
                  <h3 className="text-lg font-medium text-cream mb-4">Lembretes de Compromissos</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-cream">24 horas antes</p>
                        <p className="text-sm text-cream/60">Receber lembrete 24h antes do compromisso</p>
                      </div>
                      <Switch 
                        checked={preferences.reminderBefore24h} 
                        onCheckedChange={() => handleTogglePreference('reminderBefore24h')}
                        className="data-[state=checked]:bg-teal"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-cream">1 hora antes</p>
                        <p className="text-sm text-cream/60">Receber lembrete 1h antes do compromisso</p>
                      </div>
                      <Switch 
                        checked={preferences.reminderBefore1h} 
                        onCheckedChange={() => handleTogglePreference('reminderBefore1h')}
                        className="data-[state=checked]:bg-teal"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
