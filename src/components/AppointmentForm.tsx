
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AppointmentFormProps {
  onClose: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    clientName: "",
    service: "",
    date: "",
    time: "",
    duration: "60",
    notes: "",
  });

  const services = [
    { id: "1", name: "Corte de cabelo", duration: "60" },
    { id: "2", name: "Barba", duration: "30" },
    { id: "3", name: "Corte e barba", duration: "90" },
    { id: "4", name: "Manicure", duration: "45" },
    { id: "5", name: "Pedicure", duration: "50" },
    { id: "6", name: "Design de sobrancelhas", duration: "30" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleServiceChange = (value: string) => {
    const selectedService = services.find(service => service.name === value);
    setFormData({
      ...formData,
      service: value,
      duration: selectedService?.duration || "60",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would save the appointment to the database
    console.log("Saving appointment:", formData);
    toast.success("Agendamento criado com sucesso!");
    onClose();
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="clientName">Nome do cliente</Label>
        <Input
          id="clientName"
          name="clientName"
          value={formData.clientName}
          onChange={handleChange}
          placeholder="Nome completo"
          className="bg-navy border-sky/30 text-cream placeholder:text-cream/50"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="service">Serviço</Label>
        <Select onValueChange={handleServiceChange} required>
          <SelectTrigger className="bg-navy border-sky/30 text-cream">
            <SelectValue placeholder="Selecione um serviço" />
          </SelectTrigger>
          <SelectContent className="bg-navy-light border-sky/30 text-cream">
            {services.map((service) => (
              <SelectItem key={service.id} value={service.name}>
                {service.name} ({service.duration} min)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            name="date"
            type="date"
            min={today}
            value={formData.date}
            onChange={handleChange}
            className="bg-navy border-sky/30 text-cream"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Horário</Label>
          <Input
            id="time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            className="bg-navy border-sky/30 text-cream"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duração (minutos)</Label>
        <Input
          id="duration"
          name="duration"
          type="number"
          min="15"
          step="15"
          value={formData.duration}
          onChange={handleChange}
          className="bg-navy border-sky/30 text-cream"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Informações adicionais sobre o agendamento"
          className="bg-navy border-sky/30 text-cream placeholder:text-cream/50 min-h-[80px]"
        />
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
          Salvar agendamento
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;
