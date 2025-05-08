import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Search, Filter, Plus, Clock, User, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AppointmentForm from "@/components/AppointmentForm";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotificationConfig from "@/components/NotificationConfig";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Mock appointments data
const mockAppointments = [
  {
    id: 1,
    client: "Ana Silva",
    service: "Corte de cabelo",
    date: "2025-05-10",
    time: "10:00",
    duration: 60,
    status: "confirmed",
  },
  {
    id: 2,
    client: "Carlos Oliveira",
    service: "Barba",
    date: "2025-05-10",
    time: "11:30",
    duration: 30,
    status: "confirmed",
  },
  {
    id: 3,
    client: "Maria Santos",
    service: "Manicure",
    date: "2025-05-09",
    time: "14:00",
    duration: 45,
    status: "pending",
  },
  {
    id: 4,
    client: "João Pereira",
    service: "Corte e barba",
    date: "2025-05-12",
    time: "16:00",
    duration: 75,
    status: "cancelled",
  },
  {
    id: 5,
    client: "Luciana Alves",
    service: "Design de sobrancelhas",
    date: "2025-05-11",
    time: "09:00",
    duration: 30,
    status: "confirmed",
  },
];

const Appointments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("appointments"); // "appointments" or "settings"
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-700/30 text-green-300 border-green-700/50";
      case "pending":
        return "bg-amber-700/30 text-amber-300 border-amber-700/50";
      case "cancelled":
        return "bg-red-700/30 text-red-300 border-red-700/50";
      default:
        return "bg-sky/20 text-sky border-sky/40";
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado";
      case "pending":
        return "Pendente";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const filteredAppointments = mockAppointments.filter(appointment => 
    appointment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.service.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const upcomingAppointments = filteredAppointments.filter(a => 
    new Date(`${a.date}T${a.time}`) >= new Date() && a.status !== "cancelled"
  );
  
  const pastAppointments = filteredAppointments.filter(a => 
    new Date(`${a.date}T${a.time}`) < new Date() && a.status !== "cancelled"
  );
  
  const cancelledAppointments = filteredAppointments.filter(a => 
    a.status === "cancelled"
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cream flex items-center">
            <Clock className="mr-2 h-6 w-6" /> Compromissos
          </h1>
          <p className="text-cream/70">Gerencie todos os seus agendamentos</p>
        </div>
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline"
                className="border-sky/30 text-cream hover:bg-sky/10"
              >
                <Bell className="mr-2 h-4 w-4" /> Configurar Notificações
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-navy border-sky/20 w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle className="text-cream">Configurações de Notificações</SheetTitle>
                <SheetDescription className="text-cream/70">
                  Personalize quando e como seus clientes serão notificados sobre os agendamentos.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <NotificationConfig />
              </div>
            </SheetContent>
          </Sheet>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal hover:bg-teal-light text-cream">
                <Plus className="mr-2 h-4 w-4" /> Novo Agendamento
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-navy-light border-sky/20 text-cream">
              <DialogHeader>
                <DialogTitle className="text-cream">Novo Agendamento</DialogTitle>
              </DialogHeader>
              <AppointmentForm onClose={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div>
        <div className="mb-6 border-b border-sky/20">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("appointments")} 
              className={`pb-2 px-1 font-medium ${activeTab === "appointments" 
                ? "text-teal border-b-2 border-teal" 
                : "text-cream/70 hover:text-cream"}`}
            >
              Agendamentos
            </button>
            <button
              onClick={() => setActiveTab("settings")} 
              className={`pb-2 px-1 font-medium ${activeTab === "settings" 
                ? "text-teal border-b-2 border-teal" 
                : "text-cream/70 hover:text-cream"}`}
            >
              Configurações
            </button>
          </div>
        </div>
        
        {activeTab === "appointments" ? (
          <>
            {/* Search and filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cream/50 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar por cliente ou serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-navy-light border-sky/30 text-cream placeholder:text-cream/50"
                />
                {searchTerm && (
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cream/50 hover:text-cream"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button variant="outline" className="border-sky/30 text-cream hover:bg-sky/10">
                <Filter className="mr-2 h-4 w-4" /> Filtrar
              </Button>
              <Button variant="outline" className="border-sky/30 text-cream hover:bg-sky/10">
                <Calendar className="mr-2 h-4 w-4" /> Por data
              </Button>
            </div>

            {/* Appointment tabs */}
            <Tabs defaultValue="upcoming" className="w-full mt-6">
              <TabsList className="grid grid-cols-3 bg-navy-light">
                <TabsTrigger 
                  value="upcoming" 
                  className="data-[state=active]:bg-teal data-[state=active]:text-cream"
                >
                  Próximos ({upcomingAppointments.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="past" 
                  className="data-[state=active]:bg-teal data-[state=active]:text-cream"
                >
                  Passados ({pastAppointments.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="cancelled" 
                  className="data-[state=active]:bg-teal data-[state=active]:text-cream"
                >
                  Cancelados ({cancelledAppointments.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="mt-4">
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map(appointment => (
                      <AppointmentCard 
                        key={appointment.id} 
                        appointment={appointment} 
                        getStatusColor={getStatusColor}
                        getStatusText={getStatusText}
                        formatAppointmentDate={formatAppointmentDate}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="Não há agendamentos futuros." />
                )}
              </TabsContent>
              
              <TabsContent value="past" className="mt-4">
                {pastAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {pastAppointments.map(appointment => (
                      <AppointmentCard 
                        key={appointment.id} 
                        appointment={appointment} 
                        getStatusColor={getStatusColor}
                        getStatusText={getStatusText}
                        formatAppointmentDate={formatAppointmentDate}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="Não há agendamentos passados." />
                )}
              </TabsContent>
              
              <TabsContent value="cancelled" className="mt-4">
                {cancelledAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {cancelledAppointments.map(appointment => (
                      <AppointmentCard 
                        key={appointment.id} 
                        appointment={appointment} 
                        getStatusColor={getStatusColor}
                        getStatusText={getStatusText}
                        formatAppointmentDate={formatAppointmentDate}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="Não há agendamentos cancelados." />
                )}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NotificationConfig />
            
            {/* Counter for free appointments limit */}
            <Card className="bg-navy-light border-sky/20 h-fit">
              <CardContent className="p-5">
                <h3 className="text-lg font-medium text-cream mb-4">Uso do Plano Gratuito</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-cream/80">Agendamentos usados</span>
                    <span className="text-cream font-medium">28/50</span>
                  </div>
                  <div className="h-2 bg-navy rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal" 
                      style={{ width: "56%" }} 
                    />
                  </div>
                  <p className="text-xs text-cream/60 pt-1">
                    22 agendamentos restantes no plano gratuito
                  </p>
                  
                  <div className="mt-6 pt-4 border-t border-sky/20">
                    <Button 
                      className="w-full bg-teal hover:bg-teal-light text-cream"
                    >
                      Atualizar para Plano Premium
                    </Button>
                    <p className="text-center text-xs text-cream/60 mt-2">
                      R$ 49,90/mês • Agendamentos ilimitados
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

interface AppointmentCardProps {
  appointment: {
    id: number;
    client: string;
    service: string;
    date: string;
    time: string;
    duration: number;
    status: string;
  };
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  formatAppointmentDate: (date: string) => string;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment, 
  getStatusColor,
  getStatusText,
  formatAppointmentDate
}) => {
  return (
    <Card className="bg-navy-light border-sky/20 hover:border-sky/40 transition-all shadow-md">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex items-start space-x-3 mb-3 md:mb-0">
            <div className="bg-teal/20 p-2 rounded-full">
              <User className="h-5 w-5 text-teal" />
            </div>
            <div>
              <h3 className="font-medium text-cream">{appointment.client}</h3>
              <p className="text-cream/70 text-sm">{appointment.service}</p>
              <div className="flex items-center mt-1 text-xs text-cream/60">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{formatAppointmentDate(appointment.date)}</span>
                <Clock className="h-3 w-3 ml-3 mr-1" />
                <span>{appointment.time} ({appointment.duration} min)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Badge className={`${getStatusColor(appointment.status)} ml-auto`}>
              {getStatusText(appointment.status)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EmptyState = ({ message }: { message: string }) => {
  return (
    <Card className="bg-navy-light border-sky/20">
      <CardContent className="p-8 text-center">
        <p className="text-cream/70">{message}</p>
      </CardContent>
    </Card>
  );
};

export default Appointments;
