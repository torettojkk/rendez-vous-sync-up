
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, DollarSign, Calendar } from "lucide-react";

const CEODashboard = () => {
  // Dados de exemplo - em um app real, viriam da API
  const stats = [
    { 
      title: "Estabelecimentos", 
      value: 24, 
      icon: Building,
      change: "+3 este mês",
      color: "bg-teal/20 text-teal"
    },
    { 
      title: "Usuários Ativos", 
      value: 1243, 
      icon: Users,
      change: "+189 este mês",
      color: "bg-sky/20 text-sky" 
    },
    { 
      title: "Receita Mensal", 
      value: "R$ 4.920,00", 
      icon: DollarSign,
      change: "+12% vs. mês anterior",
      color: "bg-cream/20 text-cream" 
    },
    { 
      title: "Agendamentos", 
      value: 879, 
      icon: Calendar,
      change: "+156 esta semana",
      color: "bg-sky-light/20 text-sky-light" 
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cream">Dashboard</h1>
        <p className="text-cream/70">Bem-vindo ao painel de controle do administrador.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-navy-dark border-sky/10">
          <CardHeader>
            <CardTitle className="text-cream">Estabelecimentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b border-sky/10 pb-3 last:border-0">
                  <div>
                    <p className="text-cream">Estabelecimento {i}</p>
                    <p className="text-xs text-cream/70">Registrado há {i} dias</p>
                  </div>
                  <div className="text-cream/70">
                    {20 - i * 5} agendamentos
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-navy-dark border-sky/10">
          <CardHeader>
            <CardTitle className="text-cream">Status de Pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Confirmado", "Pendente", "Atrasado"].map((status, i) => (
                <div key={i} className="flex items-center justify-between border-b border-sky/10 pb-3 last:border-0">
                  <div>
                    <p className="text-cream">{status}</p>
                    <p className="text-xs text-cream/70">{5 - i} estabelecimentos</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium 
                    ${status === "Confirmado" ? "bg-green-600/20 text-green-400" : 
                      status === "Pendente" ? "bg-amber-600/20 text-amber-400" : 
                      "bg-red-600/20 text-red-400"}`}>
                    {status === "Confirmado" ? "R$ 1.250,00" : 
                      status === "Pendente" ? "R$ 750,00" : "R$ 250,00"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CEODashboard;
