
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Establishment } from "@/types/user";

const EstablishmentsPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  
  // Mock data - em um app real, seria carregado da API
  const establishments: Establishment[] = [
    {
      id: "1",
      name: "Salão de Beleza Encanto",
      description: "Especializado em tratamentos capilares e design de unhas",
      ownerId: "user1",
      appointmentsCount: 32,
      isPremium: true,
      createdAt: new Date("2023-01-15"),
      phone: "(11) 98765-4321",
      services: [],
      availableHours: []
    },
    {
      id: "2",
      name: "Oficina Mecânica Rápida",
      description: "Serviços automotivos com agilidade e qualidade",
      ownerId: "user2",
      appointmentsCount: 48,
      isPremium: false,
      createdAt: new Date("2023-03-22"),
      phone: "(11) 91234-5678",
      services: [],
      availableHours: []
    },
    {
      id: "3",
      name: "Clínica Fisioterapia Bem Estar",
      description: "Tratamentos especializados em fisioterapia e reabilitação",
      ownerId: "user3",
      appointmentsCount: 16,
      isPremium: true,
      createdAt: new Date("2023-05-07"),
      phone: "(11) 97890-1234",
      services: [],
      availableHours: []
    }
  ];

  const handleNewEstablishment = () => {
    setSelectedEstablishment(null);
    setDialogOpen(true);
  };

  const handleEditEstablishment = (establishment: Establishment) => {
    setSelectedEstablishment(establishment);
    setDialogOpen(true);
  };

  const filteredEstablishments = establishments.filter(est => 
    est.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-cream">Estabelecimentos</h1>
          <p className="text-cream/70">Gerencie os estabelecimentos cadastrados no sistema.</p>
        </div>
        <Button 
          onClick={handleNewEstablishment}
          className="bg-teal hover:bg-teal-light text-cream"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Estabelecimento
        </Button>
      </div>

      <Card className="bg-navy-dark border-sky/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-cream">Lista de Estabelecimentos</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cream/50" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-navy border-sky/20 text-cream"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-sky/10 hover:bg-transparent">
                <TableHead className="text-cream/70">Nome</TableHead>
                <TableHead className="text-cream/70">Status</TableHead>
                <TableHead className="text-cream/70">Agendamentos</TableHead>
                <TableHead className="text-cream/70">Data de Cadastro</TableHead>
                <TableHead className="text-cream/70">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEstablishments.map((establishment) => (
                <TableRow 
                  key={establishment.id}
                  className="border-sky/10 hover:bg-navy/60"
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-cream">{establishment.name}</p>
                      <p className="text-xs text-cream/70">{establishment.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${
                      establishment.isPremium 
                        ? "bg-green-600/20 text-green-400" 
                        : "bg-amber-600/20 text-amber-400"
                    }`}>
                      {establishment.isPremium ? "Premium" : "Gratuito"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-cream">
                      {establishment.appointmentsCount}
                      {!establishment.isPremium && (
                        <span className="text-xs text-cream/50 ml-1">
                          / 50
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-cream/70">
                    {establishment.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => handleEditEstablishment(establishment)}
                        className="hover:bg-sky/20 hover:text-cream"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        className="hover:bg-red-600/20 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-navy-dark border-sky/10 text-cream">
          <DialogHeader>
            <DialogTitle>
              {selectedEstablishment ? "Editar Estabelecimento" : "Novo Estabelecimento"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-cream/70">Nome</label>
              <Input 
                defaultValue={selectedEstablishment?.name || ""} 
                className="bg-navy border-sky/20 text-cream"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-cream/70">Descrição</label>
              <Input 
                defaultValue={selectedEstablishment?.description || ""} 
                className="bg-navy border-sky/20 text-cream"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-cream/70">Telefone</label>
              <Input 
                defaultValue={selectedEstablishment?.phone || ""} 
                className="bg-navy border-sky/20 text-cream"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-cream/70">Email do Proprietário</label>
              <Input 
                type="email"
                placeholder="email@exemplo.com"
                className="bg-navy border-sky/20 text-cream"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              className="border-sky/20 text-cream hover:bg-navy"
            >
              Cancelar
            </Button>
            <Button 
              className="bg-teal hover:bg-teal-light text-cream"
            >
              {selectedEstablishment ? "Salvar Alterações" : "Criar Estabelecimento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EstablishmentsPage;
