
export type UserRole = "ceo" | "establishment" | "client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  establishmentId?: string; // For establishment users
}

export interface Establishment {
  id: string;
  name: string;
  description: string;
  slug: string; // Using unique_url as slug
  ownerId: string;
  appointmentsCount: number;
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
  duration: number; // in minutes
  price: number;
  isActive: boolean;
}

export interface AvailableHour {
  id: string;
  establishmentId: string;
  day: number; // 0-6, where 0 is Sunday
  startTime: string; // format "HH:MM"
  endTime: string; // format "HH:MM"
  interval: number; // interval between appointments in minutes
}
