
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Bell, Clock, Save } from "lucide-react";

const NotificationConfig = () => {
  const [config, setConfig] = useState({
    sendBefore: true,
    sendOnDay: true,
    beforeTime: "60", // minutes before appointment
    dayBefore: true,
    twoDaysBefore: false,
  });

  const handleToggleChange = (field: string) => {
    setConfig({
      ...config,
      [field]: !config[field as keyof typeof config],
    });
  };

  const handleBeforeTimeChange = (value: string) => {
    setConfig({
      ...config,
      beforeTime: value,
    });
  };

  const saveNotificationSettings = () => {
    // In a real app, this would save to the database
    console.log("Saving notification settings:", config);
    toast.success("Configurações de notificação salvas com sucesso!");
  };

  return (
    <div className="bg-navy-light border border-sky/20 rounded-lg p-5 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Bell className="text-teal h-5 w-5" />
        <h3 className="text-lg font-medium text-cream">Configurações de Notificações</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-sky/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-cream/70" />
              <Label htmlFor="send-before" className="text-cream">Notificação antes do compromisso</Label>
            </div>
            <p className="text-sm text-cream/60">Enviar lembrete minutos antes do horário marcado</p>
          </div>
          <Switch 
            id="send-before" 
            checked={config.sendBefore} 
            onCheckedChange={() => handleToggleChange("sendBefore")}
            className="bg-navy data-[state=checked]:bg-teal"
          />
        </div>

        {config.sendBefore && (
          <div className="pl-6 border-b border-sky/10 pb-4">
            <Label htmlFor="before-time" className="block mb-2 text-cream/80">
              Quanto tempo antes?
            </Label>
            <Select 
              value={config.beforeTime} 
              onValueChange={handleBeforeTimeChange}
            >
              <SelectTrigger id="before-time" className="w-full md:w-1/3 bg-navy border-sky/30 text-cream">
                <SelectValue placeholder="Selecione o tempo" />
              </SelectTrigger>
              <SelectContent className="bg-navy-light border-sky/30 text-cream">
                <SelectItem value="15">15 minutos</SelectItem>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="60">1 hora</SelectItem>
                <SelectItem value="120">2 horas</SelectItem>
                <SelectItem value="180">3 horas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center justify-between border-b border-sky/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-cream/70" />
              <Label htmlFor="day-before" className="text-cream">Notificação no dia anterior</Label>
            </div>
            <p className="text-sm text-cream/60">Enviar lembrete um dia antes do compromisso</p>
          </div>
          <Switch 
            id="day-before" 
            checked={config.dayBefore} 
            onCheckedChange={() => handleToggleChange("dayBefore")}
            className="bg-navy data-[state=checked]:bg-teal"
          />
        </div>

        <div className="flex items-center justify-between border-b border-sky/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-cream/70" />
              <Label htmlFor="two-days-before" className="text-cream">Notificação dois dias antes</Label>
            </div>
            <p className="text-sm text-cream/60">Enviar lembrete dois dias antes do compromisso</p>
          </div>
          <Switch 
            id="two-days-before" 
            checked={config.twoDaysBefore} 
            onCheckedChange={() => handleToggleChange("twoDaysBefore")}
            className="bg-navy data-[state=checked]:bg-teal"
          />
        </div>
      </div>

      <div className="pt-2">
        <Button 
          onClick={saveNotificationSettings} 
          className="bg-teal hover:bg-teal-light text-cream"
        >
          <Save className="mr-2 h-4 w-4" /> Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default NotificationConfig;
