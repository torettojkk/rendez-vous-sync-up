
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Search, Plus, Edit, Trash2, Copy, Send } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
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
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/use-supabase";
import { Establishment } from "@/types/user";

const EstablishmentsPage = () => {
  const { toast } = useToast();
  const { createInvite, getAllEstablishments, createEstablishment, deleteEstablishment } = useSupabase();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteData, setInviteData] = useState({
    type: "email" as "email" | "phone",
    contact: ""
  });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone: "",
    ownerEmail: ""
  });

  useEffect(() => {
    fetchEstablishments();
  }, []);

  const fetchEstablishments = async () => {
    try {
      setLoading(true);
      const data = await getAllEstablishments();
      setEstablishments(data);
    } catch (error) {
      console.error('Error fetching establishments:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os estabelecimentos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewEstablishment = () => {
    setFormData({
      name: "",
      description: "",
      phone: "",
      ownerEmail: ""
    });
    setSelectedEstablishment(null);
    setDialogOpen(true);
  };

  const handleEditEstablishment = (establishment: Establishment) => {
    setFormData({
      name: establishment.name,
      description: establishment.description || "",
      phone: establishment.phone || "",
      ownerEmail: "" // Can't edit owner email once created
    });
    setSelectedEstablishment(establishment);
    setDialogOpen(true);
  };

  const handleDeleteEstablishment = async (id: string) => {
    try {
      await deleteEstablishment(id);
      setEstablishments(prev => prev.filter(est => est.id !== id));
      toast({
        title: "Estabelecimento removido",
        description: "O estabelecimento foi removido com sucesso."
      });
    } catch (error) {
      console.error('Error deleting establishment:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o estabelecimento.",
        variant: "destructive"
      });
    }
  };

  const handleInviteClient = async (establishmentId: string) => {
    try {
      if (!inviteData.contact) {
        toast({
          title: "Erro",
          description: "Insira um email ou telefone válido.",
          variant: "destructive"
        });
        return;
      }
      
      const { code } = await createInvite(
        establishmentId,
        inviteData.type,
        inviteData.contact
      );

      toast({
        title: "Convite enviado",
        description: `Código do convite: ${code}`
      });

      setInviteDialogOpen(false);
      setInviteData({ type: "email", contact: "" });
    } catch (error) {
      console.error('Error sending invite:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o convite.",
        variant: "destructive"
      });
    }
  };

  const handleCopyInviteLink = (establishment: Establishment) => {
    const inviteUrl = `${window.location.origin}/?invite=${establishment.slug}`;
    navigator.clipboard.writeText(inviteUrl);
    toast({
      title: "Link copiado",
      description: "Link de convite copiado para a área de transferência."
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateOrUpdateEstablishment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!formData.name) {
        toast({
          title: "Erro",
          description: "Nome do estabelecimento é obrigatório",
          variant: "destructive"
        });
        return;
      }
      
      if (!selectedEstablishment) {
        // Create new establishment
        const newEstablishment = await createEstablishment({
          name: formData.name,
          description: formData.description,
          phone: formData.phone,
          ownerEmail: formData.ownerEmail,
        });
        
        // Fix: Map unique_url to slug when creating a new establishment in the UI
        setEstablishments(prev => [
          {
            id: newEstablishment.id,
            name: newEstablishment.name,
            description: newEstablishment.description || '',
            slug: newEstablishment.unique_url || '', // Use unique_url as slug
            ownerId: newEstablishment.owner_id,
            appointmentsCount: newEstablishment.appointments_count || 0,
            isPremium: newEstablishment.is_premium || false,
            createdAt: new Date(newEstablishment.created_at),
            phone: newEstablishment.phone || undefined,
            services: [],
            availableHours: []
          }, 
          ...prev
        ]);
        
        toast({
          title: "Estabelecimento criado",
          description: "Estabelecimento criado com sucesso."
        });
      } else {
        // Update establishment (feature not fully implemented yet)
        toast({
          title: "Recurso em desenvolvimento",
          description: "A edição de estabelecimentos será implementada em breve."
        });
      }
      
      setDialogOpen(false);
    } catch (error) {
      console.error('Error creating/updating establishment:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o estabelecimento.",
        variant: "destructive"
      });
    }
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
                <TableHead className="text-cream/70">URL</TableHead>
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
                    <div className="flex items-center gap-2">
                      <span className="text-cream/70">{establishment.slug}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleCopyInviteLink(establishment)}
                        className="h-6 w-6 hover:bg-sky/10"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
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
                        onClick={() => {
                          setSelectedEstablishment(establishment);
                          setInviteDialogOpen(true);
                        }}
                        className="hover:bg-sky/20 hover:text-cream"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
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
                        onClick={() => handleDeleteEstablishment(establishment.id)}
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

      {/* Establishment Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-navy-dark border-sky/10 text-cream">
          <DialogHeader>
            <DialogTitle>
              {selectedEstablishment ? "Editar Estabelecimento" : "Novo Estabelecimento"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateOrUpdateEstablishment} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-cream/70">Nome</label>
              <Input 
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="bg-navy border-sky/20 text-cream"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-cream/70">Descrição</label>
              <Input 
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                className="bg-navy border-sky/20 text-cream"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-cream/70">Telefone</label>
              <Input 
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                className="bg-navy border-sky/20 text-cream"
              />
            </div>
            {!selectedEstablishment && (
              <div className="space-y-2">
                <label className="text-sm text-cream/70">Email do Proprietário</label>
                <Input 
                  type="email"
                  name="ownerEmail"
                  value={formData.ownerEmail}
                  onChange={handleFormChange}
                  placeholder="email@exemplo.com"
                  className="bg-navy border-sky/20 text-cream"
                />
              </div>
            )}
            <DialogFooter>
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setDialogOpen(false)}
                className="border-sky/20 text-cream hover:bg-navy"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-teal hover:bg-teal-light text-cream"
              >
                {selectedEstablishment ? "Salvar Alterações" : "Criar Estabelecimento"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="bg-navy-dark border-sky/10 text-cream">
          <DialogHeader>
            <DialogTitle>Convidar Cliente</DialogTitle>
            <CardDescription className="text-cream/70">
              Envie um convite para um cliente se juntar ao estabelecimento
            </CardDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-cream/70">Tipo de Convite</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={inviteData.type === "email" ? "default" : "outline"}
                  onClick={() => setInviteData({ ...inviteData, type: "email" })}
                  className={inviteData.type === "email" 
                    ? "bg-teal hover:bg-teal-light text-cream"
                    : "border-sky/20 text-cream hover:bg-navy"
                  }
                >
                  Email
                </Button>
                <Button
                  type="button"
                  variant={inviteData.type === "phone" ? "default" : "outline"}
                  onClick={() => setInviteData({ ...inviteData, type: "phone" })}
                  className={inviteData.type === "phone"
                    ? "bg-teal hover:bg-teal-light text-cream"
                    : "border-sky/20 text-cream hover:bg-navy"
                  }
                >
                  Telefone
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-cream/70">
                {inviteData.type === "email" ? "Email" : "Telefone"}
              </label>
              <Input
                type={inviteData.type === "email" ? "email" : "tel"}
                value={inviteData.contact}
                onChange={(e) => setInviteData({ ...inviteData, contact: e.target.value })}
                placeholder={inviteData.type === "email" 
                  ? "cliente@exemplo.com" 
                  : "(00) 00000-0000"
                }
                className="bg-navy border-sky/20 text-cream"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setInviteDialogOpen(false)}
              className="border-sky/20 text-cream hover:bg-navy"
            >
              Cancelar
            </Button>
            <Button 
              onClick={() => selectedEstablishment && handleInviteClient(selectedEstablishment.id)}
              className="bg-teal hover:bg-teal-light text-cream"
            >
              Enviar Convite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EstablishmentsPage;
