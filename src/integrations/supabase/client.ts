
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://mlnpfoleipbnsagepxgj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sbnBmb2xlaXBibnNhZ2VweGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MjIxMTgsImV4cCI6MjA2MjQ5ODExOH0.hJ6cu1Omc92XV02cryrlSk0jl9LcQ9EY-Knu1yxfnH8";

// Define database tables schema
export interface Database {
  public: {
    Tables: {
      establishments: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          slug: string;
          owner_id: string;
          is_premium: boolean;
          appointments_count: number;
          address: string | null;
          phone: string | null;
          logo_url: string | null;
          cancellation_policy: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          slug: string;
          owner_id: string;
          is_premium?: boolean;
          appointments_count?: number;
          address?: string | null;
          phone?: string | null;
          logo_url?: string | null;
          cancellation_policy?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          slug?: string;
          owner_id?: string;
          is_premium?: boolean;
          appointments_count?: number;
          address?: string | null;
          phone?: string | null;
          logo_url?: string | null;
          cancellation_policy?: string | null;
          updated_at?: string;
        };
      };
      invites: {
        Row: {
          id: string;
          establishment_id: string;
          type: 'email' | 'phone';
          email: string | null;
          phone: string | null;
          status: 'pending' | 'accepted' | 'expired';
          code: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          establishment_id: string;
          type: 'email' | 'phone';
          email?: string | null;
          phone?: string | null;
          status?: 'pending' | 'accepted' | 'expired';
          code: string;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          establishment_id?: string;
          type?: 'email' | 'phone';
          email?: string | null;
          phone?: string | null;
          status?: 'pending' | 'accepted' | 'expired';
          code?: string;
          expires_at?: string;
        };
      };
      establishment_clients: {
        Row: {
          id: string;
          establishment_id: string;
          client_id: string;
          status: 'active' | 'blocked';
          created_at: string;
        };
        Insert: {
          id?: string;
          establishment_id: string;
          client_id: string;
          status?: 'active' | 'blocked';
          created_at?: string;
        };
        Update: {
          id?: string;
          establishment_id?: string;
          client_id?: string;
          status?: 'active' | 'blocked';
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Helper types for cleaner code
export type Tables = Database['public']['Tables'];
export type EstablishmentRow = Tables['establishments']['Row'];
export type InviteRow = Tables['invites']['Row'];
export type EstablishmentClientRow = Tables['establishment_clients']['Row'];

// Map database row types to our application types
export interface EstablishmentType {
  id: string;
  name: string;
  description?: string;
  slug: string;
  owner_id: string;
  is_premium: boolean;
  phone?: string;
  address?: string;
  logo_url?: string;
  appointments_count: number;
  cancellation_policy?: string;
  created_at: string;
  updated_at: string;
}

export interface InviteType {
  id: string;
  establishment_id: string;
  type: 'email' | 'phone';
  email?: string;
  phone?: string;
  status: 'pending' | 'accepted' | 'expired';
  code: string;
  expires_at: string;
  created_at: string;
}

export interface EstablishmentClientType {
  id: string;
  establishment_id: string;
  client_id: string;
  status: 'active' | 'blocked';
  created_at: string;
}
