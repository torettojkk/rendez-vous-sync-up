
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Edit, Trash2, DollarSign, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Service } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";

// Form schema for service validation
const serviceSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, { message: "Preço não pode ser negativo" }),
  duration: z.coerce.number().min(15, { message: "Duração mínima é de 15 minutos" }),
  isActive: z.boolean().default(true)
});

const Services = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const establishmentId = user?.establishmentId || "est1";

  // Mocked service data - this would come from an API in a real app
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      establishmentId,
      name: "Corte de Cabelo",
      description: "Corte com tesoura ou máquina",
      duration: 30,
      price: 50,
      isActive: true
    },
    {
      id: "2",
      establishmentId,
      name: "Barba",
      description: "Barba com toalha quente",
      duration: 20,
      price: 35,
      isActive: true
    },
    {
      id: "3",
      establishmentId,
      name: "Hidratação",
      description: "Tratamento capilar com máscara",
      duration: 45,
      price: 70,
      isActive: true
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Setup form with react-hook-form
  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 30,
      isActive: true
    }
  });

  const handleNewService = () => {
    setEditingService(null);
    form.reset({
      name: "",
      description: "",
      price: 0,
      duration: 30,
      isActive: true
    });
    setDialogOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    form.reset({
      name: service.name,
      description: service.description || "",
      price: service.price,
      duration: service.duration,
      isActive: service.isActive
    });
    setDialogOpen(true);
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter(service => service.id !== serviceId));
    toast({
      title: "Serviço removido",
      description: "O serviço foi removido com sucesso."
    });
  };

  const onSubmit = (data: z.infer<typeof serviceSchema>) => {
    if (editingService) {
      // Update existing service
      setServices(services.map(service => 
        service.id === editingService.id ? { ...service, ...data } : service
      ));
      toast({
        title: "Serviço atualizado",
        description: "O serviço foi atualizado com sucesso."
      });
    } else {
      // Create new service
      const newService = {
        id: `service-${Date.now()}`,
        establishmentId,
        ...data
      };
      setServices([...services, newService]);
      toast({
        title: "Serviço criado",
        description: "O serviço foi criado com sucesso."
      });
    }
    setDialogOpen(false);
  };

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-cream">Serviços</h1>
          <p className="text-cream/70">Gerencie os serviços oferecidos pelo seu estabelecimento.</p>
        </div>
        <Button 
          onClick={handleNewService}
          className="bg-teal hover:bg-teal-light text-cream"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Serviço
        </Button>
      </div>

      <Card className="bg-navy-dark border-sky/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-cream">Lista de Serviços</CardTitle>
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
                <TableHead className="text-cream/70">Preço</TableHead>
                <TableHead className="text-cream/70">Duração</TableHead>
                <TableHead className="text-cream/70">Status</TableHead>
                <TableHead className="text-cream/70">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow 
                  key={service.id}
                  className="border-sky/10 hover:bg-navy/60"
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-cream">{service.name}</p>
                      <p className="text-xs text-cream/70">{service.description}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-cream">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-sky" />
                      R$ {service.price.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="text-cream">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-teal" />
                      {service.duration} min
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${
                      service.isActive 
                        ? "bg-green-600/20 text-green-400" 
                        : "bg-red-600/20 text-red-400"
                    }`}>
                      {service.isActive ? "Ativo" : "Inativo"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => handleEditService(service)}
                        className="hover:bg-sky/20 hover:text-cream"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => handleDeleteService(service.id)}
                        className="hover:bg-red-600/20 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredServices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-cream/70">
                    Nenhum serviço encontrado. Tente mudar o termo da busca ou criar um novo serviço.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-navy-dark border-sky/10 text-cream">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Editar Serviço" : "Novo Serviço"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-cream/70">Nome</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-navy border-sky/20 text-cream"
                        placeholder="Ex: Corte de Cabelo" 
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-cream/70">Descrição (opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-navy border-sky/20 text-cream"
                        placeholder="Ex: Corte com tesoura ou máquina" 
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-cream/70">Preço (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number"
                          min="0"
                          step="0.01"
                          className="bg-navy border-sky/20 text-cream"
                          placeholder="0.00" 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-cream/70">Duração (minutos)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number"
                          min="15"
                          step="5"
                          className="bg-navy border-sky/20 text-cream"
                          placeholder="30" 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-teal focus:ring-teal"
                      />
                    </FormControl>
                    <FormLabel className="text-cream/70">Serviço Ativo</FormLabel>
                  </FormItem>
                )}
              />
            <DialogFooter className="pt-4">
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
                {editingService ? "Salvar Alterações" : "Criar Serviço"}
              </Button>
            </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;
