
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Clock, Calendar, Check, X, PlusCircle, MinusCircle } from "lucide-react";
import { AvailableHour, Establishment } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";

const daysOfWeek = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda" },
  { value: 2, label: "Terça" },
  { value: 3, label: "Quarta" },
  { value: 4, label: "Quinta" },
  { value: 5, label: "Sexta" },
  { value: 6, label: "Sábado" }
];

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const establishmentId = user?.establishmentId || "est1";

  // Mocked establishment data
  const [establishment, setEstablishment] = useState<Establishment>({
    id: establishmentId,
    name: "Salão de Beleza Exemplo",
    description: "O melhor salão da cidade",
    ownerId: user?.id || "",
    appointmentsCount: 32,
    isPremium: false,
    createdAt: new Date(),
    address: "Rua Exemplo, 123",
    phone: "(11) 98765-4321",
    services: [],
    availableHours: [
      { id: "1", establishmentId, day: 1, startTime: "09:00", endTime: "18:00", interval: 30 },
      { id: "2", establishmentId, day: 2, startTime: "09:00", endTime: "18:00", interval: 30 },
      { id: "3", establishmentId, day: 3, startTime: "09:00", endTime: "18:00", interval: 30 },
      { id: "4", establishmentId, day: 4, startTime: "09:00", endTime: "18:00", interval: 30 },
      { id: "5", establishmentId, day: 5, startTime: "09:00", endTime: "18:00", interval: 30 },
    ],
    cancellationPolicy: "Cancelamento com pelo menos 24 horas de antecedência para reembolso total."
  });

  const [availableHours, setAvailableHours] = useState<AvailableHour[]>(
    establishment.availableHours
  );

  const [generalSettings, setGeneralSettings] = useState({
    name: establishment.name,
    description: establishment.description,
    address: establishment.address || "",
    phone: establishment.phone || "",
    cancellationPolicy: establishment.cancellationPolicy || ""
  });

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveGeneralSettings = () => {
    setEstablishment(prev => ({
      ...prev,
      ...generalSettings
    }));
    
    toast({
      title: "Configurações atualizadas",
      description: "As configurações gerais foram salvas com sucesso."
    });
  };

  const handleAvailabilityChange = (id: string, field: keyof AvailableHour, value: any) => {
    setAvailableHours(prev => 
      prev.map(hour => 
        hour.id === id ? { ...hour, [field]: value } : hour
      )
    );
  };

  const addAvailability = (day: number) => {
    const existingForDay = availableHours.find(hour => hour.day === day);
    
    if (!existingForDay) {
      const newAvailability: AvailableHour = {
        id: `avail-${Date.now()}`,
        establishmentId,
        day,
        startTime: "09:00",
        endTime: "18:00",
        interval: 30
      };
      
      setAvailableHours(prev => [...prev, newAvailability]);
    }
  };

  const removeAvailability = (id: string) => {
    setAvailableHours(prev => prev.filter(hour => hour.id !== id));
  };

  const saveAvailability = () => {
    setEstablishment(prev => ({
      ...prev,
      availableHours
    }));
    
    toast({
      title: "Horários atualizados",
      description: "Os horários de disponibilidade foram salvos com sucesso."
    });
  };

  const handleUpgradeToPremium = () => {
    // This would initiate the payment process in a real app
    toast({
      title: "Iniciar upgrade para Premium",
      description: "Esta funcionalidade conectaria ao gateway de pagamento em um app real."
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cream">Configurações</h1>
        <p className="text-cream/70">Gerencie as configurações do seu estabelecimento.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-navy-dark border-b border-sky/10 w-full justify-start rounded-none p-0">
          <TabsTrigger 
            value="general"
            className="data-[state=active]:border-b-2 data-[state=active]:border-teal data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-2 text-cream/70 data-[state=active]:text-cream"
          >
            Geral
          </TabsTrigger>
          <TabsTrigger 
            value="availability"
            className="data-[state=active]:border-b-2 data-[state=active]:border-teal data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-2 text-cream/70 data-[state=active]:text-cream"
          >
            Horários
          </TabsTrigger>
          <TabsTrigger 
            value="subscription"
            className="data-[state=active]:border-b-2 data-[state=active]:border-teal data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-2 text-cream/70 data-[state=active]:text-cream"
          >
            Assinatura
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="pt-6">
          <Card className="bg-navy-dark border-sky/10">
            <CardHeader>
              <CardTitle className="text-cream">Informações do Estabelecimento</CardTitle>
              <CardDescription className="text-cream/70">
                Atualize as informações básicas do seu estabelecimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-cream/70 block mb-1">Nome</label>
                <Input 
                  name="name"
                  value={generalSettings.name}
                  onChange={handleGeneralSettingsChange}
                  className="bg-navy border-sky/20 text-cream"
                />
              </div>
              <div>
                <label className="text-sm text-cream/70 block mb-1">Descrição</label>
                <Textarea 
                  name="description"
                  value={generalSettings.description}
                  onChange={handleGeneralSettingsChange}
                  className="bg-navy border-sky/20 text-cream min-h-24"
                />
              </div>
              <div>
                <label className="text-sm text-cream/70 block mb-1">Endereço</label>
                <Input 
                  name="address"
                  value={generalSettings.address}
                  onChange={handleGeneralSettingsChange}
                  className="bg-navy border-sky/20 text-cream"
                />
              </div>
              <div>
                <label className="text-sm text-cream/70 block mb-1">Telefone</label>
                <Input 
                  name="phone"
                  value={generalSettings.phone}
                  onChange={handleGeneralSettingsChange}
                  className="bg-navy border-sky/20 text-cream"
                />
              </div>
              <div>
                <label className="text-sm text-cream/70 block mb-1">Política de Cancelamento</label>
                <Textarea 
                  name="cancellationPolicy"
                  value={generalSettings.cancellationPolicy}
                  onChange={handleGeneralSettingsChange}
                  className="bg-navy border-sky/20 text-cream"
                  placeholder="Ex: Cancelamento com 24h de antecedência para reembolso total."
                />
              </div>
              <Button 
                onClick={saveGeneralSettings}
                className="bg-teal hover:bg-teal-light text-cream mt-4"
              >
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="availability" className="pt-6">
          <Card className="bg-navy-dark border-sky/10">
            <CardHeader>
              <CardTitle className="text-cream">Horários Disponíveis</CardTitle>
              <CardDescription className="text-cream/70">
                Configure os dias e horários em que seu estabelecimento estará disponível para agendamentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {daysOfWeek.map(day => {
                  const dayAvailability = availableHours.find(h => h.day === day.value);
                  
                  return (
                    <div key={day.value} className="p-4 border border-sky/10 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-cream">{day.label}</h3>
                        {!dayAvailability ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => addAvailability(day.value)}
                            className="border-teal/20 text-teal hover:bg-teal/10"
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Adicionar Disponibilidade
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeAvailability(dayAvailability.id)}
                            className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                          >
                            <MinusCircle className="h-4 w-4 mr-2" />
                            Remover
                          </Button>
                        )}
                      </div>
                      
                      {dayAvailability && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm text-cream/70 block mb-1">Horário Inicial</label>
                            <Input 
                              type="time"
                              value={dayAvailability.startTime}
                              onChange={(e) => handleAvailabilityChange(dayAvailability.id, 'startTime', e.target.value)}
                              className="bg-navy border-sky/20 text-cream"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-cream/70 block mb-1">Horário Final</label>
                            <Input 
                              type="time"
                              value={dayAvailability.endTime}
                              onChange={(e) => handleAvailabilityChange(dayAvailability.id, 'endTime', e.target.value)}
                              className="bg-navy border-sky/20 text-cream"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-cream/70 block mb-1">Intervalo (min)</label>
                            <Input 
                              type="number"
                              min="15"
                              step="5"
                              value={dayAvailability.interval}
                              onChange={(e) => handleAvailabilityChange(dayAvailability.id, 'interval', parseInt(e.target.value))}
                              className="bg-navy border-sky/20 text-cream"
                            />
                          </div>
                        </div>
                      )}
                      
                      {!dayAvailability && (
                        <div className="text-cream/50 italic text-sm">
                          Estabelecimento fechado neste dia
                        </div>
                      )}
                    </div>
                  );
                })}
                
                <Button 
                  onClick={saveAvailability}
                  className="bg-teal hover:bg-teal-light text-cream mt-4"
                >
                  Salvar Horários
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscription" className="pt-6">
          <Card className="bg-navy-dark border-sky/10">
            <CardHeader>
              <CardTitle className="text-cream">Plano de Assinatura</CardTitle>
              <CardDescription className="text-cream/70">
                Gerencie seu plano e assinatura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col text-center items-center p-6 border border-sky/10 rounded-lg">
                  <div className="h-20 w-20 rounded-full bg-navy flex items-center justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-teal/20 border-4 border-teal flex items-center justify-center">
                      <span className="text-lg font-bold text-cream">{establishment.appointmentsCount}/50</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-cream mb-2">
                    {establishment.isPremium ? "Plano Premium" : "Plano Gratuito"}
                  </h3>
                  
                  {!establishment.isPremium && (
                    <>
                      <p className="text-cream/70 mb-6">
                        Você utilizou {establishment.appointmentsCount} de 50 agendamentos disponíveis no plano gratuito. 
                        Faça upgrade para o plano premium para agendamentos ilimitados.
                      </p>
                      
                      <div className="bg-navy/60 p-4 rounded-lg w-full mb-6">
                        <h4 className="text-lg font-medium text-cream mb-2">Plano Premium</h4>
                        <ul className="space-y-2 mb-4 text-left">
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-teal mr-2 shrink-0 mt-0.5" />
                            <span className="text-cream/70">Agendamentos ilimitados</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-teal mr-2 shrink-0 mt-0.5" />
                            <span className="text-cream/70">Notificações automáticas para seus clientes</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-teal mr-2 shrink-0 mt-0.5" />
                            <span className="text-cream/70">Relatórios detalhados de agendamentos</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-teal mr-2 shrink-0 mt-0.5" />
                            <span className="text-cream/70">Suporte prioritário</span>
                          </li>
                        </ul>
                        <div className="text-center text-2xl font-bold text-cream mb-4">
                          R$ 49,90 <span className="text-sm font-normal text-cream/70">/mês</span>
                        </div>
                        <Button 
                          onClick={handleUpgradeToPremium}
                          className="w-full bg-teal hover:bg-teal-light text-cream"
                        >
                          Fazer Upgrade para Premium
                        </Button>
                      </div>
                    </>
                  )}
                  
                  {establishment.isPremium && (
                    <>
                      <div className="flex items-center justify-center mb-6">
                        <div className="px-3 py-1 rounded-full bg-green-600/20 text-green-400 text-sm">
                          Assinatura Ativa
                        </div>
                      </div>
                      
                      <div className="bg-navy/60 p-4 rounded-lg w-full mb-6">
                        <h4 className="text-lg font-medium text-cream mb-4">Detalhes da Assinatura</h4>
                        <ul className="space-y-3 mb-4">
                          <li className="flex justify-between">
                            <span className="text-cream/70">Plano:</span>
                            <span className="text-cream">Premium</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-cream/70">Preço:</span>
                            <span className="text-cream">R$ 49,90/mês</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-cream/70">Próxima cobrança:</span>
                            <span className="text-cream">15/06/2025</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-cream/70">Método de pagamento:</span>
                            <span className="text-cream">Cartão de crédito ****1234</span>
                          </li>
                        </ul>
                        <div className="flex justify-center">
                          <Button 
                            variant="outline" 
                            className="border-sky/20 text-cream hover:bg-navy"
                          >
                            Gerenciar Assinatura
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                  
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
