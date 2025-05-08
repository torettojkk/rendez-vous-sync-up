
import React, { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Plus, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AppointmentForm from "@/components/AppointmentForm";

// Helper to get day names
const getDayName = (date: Date) => {
  return date.toLocaleDateString('pt-BR', { weekday: 'short' }).charAt(0).toUpperCase() + 
         date.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(1);
};

// Mock appointments data
const mockAppointments = [
  {
    id: 1,
    client: "Ana Silva",
    service: "Corte de cabelo",
    time: "10:00",
    duration: 60,
  },
  {
    id: 2,
    client: "Carlos Oliveira",
    service: "Barba",
    time: "11:30",
    duration: 30,
  },
  {
    id: 3,
    client: "Maria Santos",
    service: "Manicure",
    time: "14:00",
    duration: 45,
  },
  {
    id: 4,
    client: "João Pereira",
    service: "Corte e barba",
    time: "16:00",
    duration: 75,
  },
];

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [usedAppointments, setUsedAppointments] = useState(24); // Mock data: 24 out of 50 used
  const totalFreeAppointments = 50;
  
  // Calculate the percentage of used appointments
  const appointmentPercentage = (usedAppointments / totalFreeAppointments) * 100;

  // Generate an array of 7 days starting with the selected date
  const generateWeekDays = () => {
    const days = [];
    for (let i = -3; i <= 3; i++) {
      const day = new Date(selectedDate);
      day.setDate(selectedDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = generateWeekDays();

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleSelectDay = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-cream">Dashboard</h1>
          <p className="text-cream/70">Gerencie seus agendamentos</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-teal hover:bg-teal-light text-cream">
              <Plus className="mr-2 h-4 w-4" /> Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-navy-light border-sky/20 text-cream">
            <DialogHeader>
              <DialogTitle className="text-cream">Novo Agendamento</DialogTitle>
            </DialogHeader>
            <AppointmentForm onClose={() => {}} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Appointment limit progress */}
      <Card className="bg-navy-light border-sky/20 shadow-lg">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-cream">Agendamentos gratuitos</p>
            <p className="text-cream font-medium">{usedAppointments} de {totalFreeAppointments}</p>
          </div>
          <Progress value={appointmentPercentage} className="h-2 bg-navy" />
          {appointmentPercentage >= 80 && (
            <p className="text-xs mt-2 text-sky animate-pulse-light">
              Quase atingindo o limite! Considere fazer um upgrade para o plano premium.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Calendar navigation */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          className="border-sky/30 text-cream hover:bg-sky/10"
          onClick={handlePreviousDay}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
        </Button>
        <h2 className="text-cream font-medium">
          {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </h2>
        <Button 
          variant="outline" 
          className="border-sky/30 text-cream hover:bg-sky/10"
          onClick={handleNextDay}
        >
          Próximo <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Week day selector */}
      <div className="flex justify-between mb-6">
        {weekDays.map((day, index) => {
          const isSelected = day.toDateString() === selectedDate.toDateString();
          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <div
              key={index}
              className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all ${
                isSelected ? 'bg-teal text-cream' : 
                isToday ? 'bg-navy-light text-cream border border-sky/30' : 'hover:bg-navy-light'
              }`}
              onClick={() => handleSelectDay(day)}
            >
              <span className="text-xs font-medium mb-1">
                {getDayName(day)}
              </span>
              <span className={`text-lg font-bold ${isSelected ? 'text-cream' : isToday ? 'text-sky' : ''}`}>
                {day.getDate()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Appointments for the day */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-cream flex items-center">
          <Calendar className="mr-2 h-5 w-5" /> 
          Agendamentos do dia
        </h2>

        {mockAppointments.length > 0 ? (
          <div className="space-y-3">
            {mockAppointments.map((appointment) => (
              <Card key={appointment.id} className="bg-navy-light border-sky/20 hover:border-sky/40 transition-all shadow-md">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-teal/20 p-2 rounded-full mr-3">
                        <User className="h-5 w-5 text-teal" />
                      </div>
                      <div>
                        <h3 className="font-medium text-cream">{appointment.client}</h3>
                        <p className="text-cream/70 text-sm">{appointment.service}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-cream">
                      <Clock className="h-4 w-4 mr-1 text-sky" />
                      <span>
                        {appointment.time} ({appointment.duration} min)
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-navy-light border-sky/20 shadow-md">
            <CardContent className="p-8 text-center">
              <p className="text-cream/70">Não há agendamentos para este dia.</p>
              <Button className="mt-4 bg-teal hover:bg-teal-light text-cream">
                <Plus className="mr-2 h-4 w-4" /> Adicionar agendamento
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
