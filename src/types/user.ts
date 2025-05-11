
export type UserRole = "ceo" | "establishment" | "client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  establishmentId?: string; // Para usuários do tipo "establishment"
}

export interface Establishment {
  id: string;
  name: string;
  description: string;
  slug: string; // Adding slug field
  ownerId: string; // ID do usuário que é o dono
  appointmentsCount: number; // Contador para o limite de 50 agendamentos
  isPremium: boolean;
  createdAt: Date;
  address?: string;
  phone?: string;
  logo?: string;
  services: Service[];
  availableHours: AvailableHour[];
  cancellationPolicy?: string;
}

export interface Service {
  id: string;
  establishmentId: string;
  name: string;
  description?: string;
  duration: number; // em minutos
  price: number;
  isActive: boolean;
}

export interface AvailableHour {
  id: string;
  establishmentId: string;
  day: number; // 0-6, onde 0 é domingo
  startTime: string; // formato "HH:MM"
  endTime: string; // formato "HH:MM"
  interval: number; // intervalo entre agendamentos em minutos
}
