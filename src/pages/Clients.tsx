
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, User, Phone, Mail, X, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock clients data
const mockClients = [
  { 
    id: 1, 
    name: "Ana Silva", 
    phone: "(11) 98765-4321", 
    email: "ana.silva@email.com",
    lastVisit: "2025-05-01",
    totalVisits: 8
  },
  { 
    id: 2, 
    name: "Carlos Oliveira", 
    phone: "(11) 91234-5678", 
    email: "carlos@email.com",
    lastVisit: "2025-04-27",
    totalVisits: 3
  },
  { 
    id: 3, 
    name: "Maria Santos", 
    phone: "(11) 99876-5432", 
    email: "maria@email.com",
    lastVisit: "2025-05-05",
    totalVisits: 12
  },
  { 
    id: 4, 
    name: "João Pereira", 
    phone: "(11) 98123-4567", 
    email: "joao@email.com",
    lastVisit: "2025-04-15",
    totalVisits: 5
  },
  { 
    id: 5, 
    name: "Luciana Alves", 
    phone: "(11) 97654-3210", 
    email: "luciana@email.com",
    lastVisit: "2025-05-03",
    totalVisits: 10
  },
];

const ClientForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save the client to the database
    console.log("Saving client:", formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-cream/90">Nome</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cream/50 h-5 w-5" />
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nome completo"
            className="pl-10 bg-navy border-sky/30 text-cream placeholder:text-cream/50"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-cream/90">Telefone</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cream/50 h-5 w-5" />
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(00) 00000-0000"
            className="pl-10 bg-navy border-sky/30 text-cream placeholder:text-cream/50"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-cream/90">E-mail</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cream/50 h-5 w-5" />
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="cliente@email.com"
            className="pl-10 bg-navy border-sky/30 text-cream placeholder:text-cream/50"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button 
          type="button" 
          variant="outline"
          className="border-sky/30 text-cream hover:bg-sky/10"
          onClick={onClose}
        >
          Cancelar
        </Button>
        <Button 
          type="submit"
          className="bg-teal hover:bg-teal-light text-cream"
        >
          Salvar cliente
        </Button>
      </div>
    </form>
  );
};

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  // Format date to Brazilian format (DD/MM/YYYY)
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cream flex items-center">
            <User className="mr-2 h-6 w-6" /> Clientes
          </h1>
          <p className="text-cream/70">Gerenciar todos os seus clientes</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal hover:bg-teal-light text-cream">
              <Plus className="mr-2 h-4 w-4" /> Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-navy-light border-sky/20 text-cream">
            <DialogHeader>
              <DialogTitle className="text-cream">Novo Cliente</DialogTitle>
            </DialogHeader>
            <ClientForm onClose={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cream/50 h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar clientes..."
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

      {/* Client list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <Card 
              key={client.id} 
              className="bg-navy-light border-sky/20 hover:border-sky/40 transition-all shadow-md"
            >
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="bg-teal/20 p-2 rounded-full">
                      <User className="h-5 w-5 text-teal" />
                    </div>
                    <div>
                      <h3 className="font-medium text-cream">{client.name}</h3>
                      <div className="flex items-center mt-1 text-sm text-cream/70">
                        <Phone className="h-3 w-3 mr-1" />
                        <span>{client.phone}</span>
                      </div>
                      <div className="flex items-center mt-1 text-sm text-cream/70">
                        <Mail className="h-3 w-3 mr-1" />
                        <span>{client.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="flex items-center justify-end text-cream/70 mb-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Última visita: {formatDate(client.lastVisit)}</span>
                    </div>
                    <p className="text-sky">Total: {client.totalVisits} visitas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-1 md:col-span-2 bg-navy-light border-sky/20">
            <CardContent className="p-8 text-center">
              <p className="text-cream/70">Nenhum cliente encontrado.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Clients;
