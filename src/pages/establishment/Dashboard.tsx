import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, FileText, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const EstablishmentDashboard = () => {
  // Dados de exemplo - em um app real, viriam da API
  const stats = [
    { 
      title: "Agendamentos Hoje", 
      value: 8, 
      icon: Clock,
      change: "Próximo em 30min",
      color: "bg-teal/20 text-teal"
    },
    { 
      title: "Clientes Ativos", 
      value: 124, 
      icon: Users,
      change: "+12 esta semana",
      color: "bg-sky/20 text-sky" 
    },
    { 
      title: "Serviços", 
      value: 15, 
      icon: FileText,
      change: "3 mais agendados",
      color: "bg-cream/20 text-cream" 
    },
    { 
      title: "Notificações", 
      value: 5, 
      icon: Bell,
      change: "3 não lidas",
      color: "bg-sky-light/20 text-sky-light" 
    }
  ];

  // Agendamentos fictícios para hoje
  const todaysAppointments = [
    { time: "09:00", client: "Maria Silva", service: "Corte de Cabelo", duration: "45min" },
    { time: "10:00", client: "João Pereira", service: "Barba", duration: "30min" },
    { time: "11:30", client: "Ana Oliveira", service: "Manicure", duration: "60min" },
    { time: "14:00", client: "Carlos Santos", service: "Corte e Barba", duration: "75min" },
    { time: "15:30", client: "Fernanda Lima", service: "Hidratação", duration: "60min" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cream">Dashboard</h1>
        <p className="text-cream/70">Bem-vindo ao seu painel de estabelecimento.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-navy-dark border-sky/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-cream/70">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cream">{stat.value}</div>
              <p className="text-xs text-cream/70 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-navy-dark border-sky/10 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-cream">Agendamentos de Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysAppointments.map((appointment, i) => (
                <div key={i} className="flex items-center justify-between border-b border-sky/10 pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="bg-sky/20 text-sky h-10 w-10 rounded-full flex items-center justify-center font-semibold">
                      {appointment.time.split(":")[0]}h
                    </div>
                    <div>
                      <p className="text-cream">{appointment.client}</p>
                      <p className="text-xs text-cream/70">{appointment.service}</p>
                    </div>
                  </div>
                  <div className="text-xs bg-navy/60 px-2 py-1 rounded text-cream/70">
                    {appointment.duration}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-navy-dark border-sky/10">
          <CardHeader>
            <CardTitle className="text-cream">Status da Conta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center text-center p-4 space-y-4">
              <div className="h-20 w-20 rounded-full bg-navy flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-teal/20 border-4 border-teal flex items-center justify-center">
                  <span className="text-lg font-bold text-cream">32/50</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cream">Plano Gratuito</h3>
                <p className="text-xs text-cream/70 mt-1">
                  18 agendamentos restantes antes do upgrade para o plano premium
                </p>
              </div>
              <Button className="bg-teal hover:bg-teal-light text-cream w-full">
                Fazer Upgrade para Premium
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EstablishmentDashboard;
