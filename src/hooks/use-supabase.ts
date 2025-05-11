
import { useEffect, useState } from 'react';
import { supabase, EstablishmentType } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Establishment } from '@/types/user';

export function useSupabase() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Get establishment by slug/URL
  const getEstablishmentBySlug = async (slug: string): Promise<Establishment | null> => {
    try {
      const { data, error } = await supabase
        .from('establishments')
        .select('*')
        .eq('unique_url', slug)
        .single();

      if (error) throw error;
      
      if (!data) return null;
      
      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        slug: data.unique_url || '',
        ownerId: data.owner_id,
        appointmentsCount: data.appointments_count || 0,
        isPremium: data.is_premium || false,
        createdAt: new Date(data.created_at),
        address: data.address,
        phone: data.phone,
        logo: data.logo,
        services: [],
        availableHours: [],
        cancellationPolicy: data.cancellation_policy
      };
    } catch (error) {
      console.error("Error fetching establishment:", error);
      throw error;
    }
  };

  // Create invite for a client
  const createInvite = async (establishmentId: string, type: 'email' | 'phone', contact: string) => {
    try {
      // Generate a random 6-digit code
      const token = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
      
      const inviteData: any = {
        establishment_id: establishmentId,
        status: 'pending',
        token,
        expires_at: expiresAt.toISOString()
      };
      
      // Add either email or phone based on type
      inviteData[type] = contact;
      
      const { data, error } = await supabase
        .from('invites')
        .insert(inviteData)
        .select()
        .single();
        
      if (error) throw error;
      
      return { code: data?.token, id: data?.id };
    } catch (error) {
      console.error("Error creating invite:", error);
      throw error;
    }
  };

  // Accept an invite and create client-establishment relationship
  const acceptInvite = async (inviteCode: string, establishmentId: string) => {
    try {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Find the invite
      const { data: invite, error: inviteError } = await supabase
        .from('invites')
        .select('*')
        .eq('token', inviteCode)
        .eq('establishment_id', establishmentId)
        .eq('status', 'pending')
        .single();

      if (inviteError || !invite) throw new Error('Invalid or expired invite code');

      // Create relationship between client and establishment
      const { error: relationError } = await supabase
        .from('client_establishments')
        .insert({
          establishment_id: establishmentId,
          client_id: user.id,
          status: 'active'
        });

      if (relationError) throw relationError;

      // Update invite status to accepted
      await supabase
        .from('invites')
        .update({ status: 'accepted' })
        .eq('id', invite.id);

      return true;
    } catch (error) {
      console.error("Error accepting invite:", error);
      throw error;
    }
  };

  // Get user's associated establishments
  const getUserEstablishments = async () => {
    try {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('establishments')
        .select(`
          *,
          client_establishments!inner(*)
        `)
        .eq('client_establishments.client_id', user.id)
        .eq('client_establishments.status', 'active');

      if (error) throw error;
      
      return (data || []).map((item: EstablishmentType): Establishment => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        slug: item.unique_url || '',
        ownerId: item.owner_id,
        appointmentsCount: item.appointments_count || 0,
        isPremium: item.is_premium || false,
        createdAt: new Date(item.created_at),
        address: item.address || undefined,
        phone: item.phone || undefined,
        logo: item.logo || undefined,
        services: [],
        availableHours: [],
        cancellationPolicy: item.cancellation_policy || undefined
      }));
    } catch (error) {
      console.error("Error fetching user establishments:", error);
      throw error;
    }
  };

  // Get all establishments (CEO only)
  const getAllEstablishments = async () => {
    try {
      const { data, error } = await supabase
        .from('establishments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map((item: EstablishmentType): Establishment => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        slug: item.unique_url || '',
        ownerId: item.owner_id,
        appointmentsCount: item.appointments_count || 0,
        isPremium: item.is_premium || false,
        createdAt: new Date(item.created_at),
        address: item.address || undefined,
        phone: item.phone || undefined,
        logo: item.logo || undefined,
        services: [],
        availableHours: [],
        cancellationPolicy: item.cancellation_policy || undefined
      }));
    } catch (error) {
      console.error("Error fetching all establishments:", error);
      throw error;
    }
  };

  // Create new establishment
  const createEstablishment = async (data: {
    name: string;
    description?: string;
    phone?: string;
    ownerEmail?: string;
  }) => {
    try {
      if (!user?.id) throw new Error('User not authenticated');
      
      const establishmentData = {
        name: data.name,
        description: data.description,
        phone: data.phone,
        owner_id: user.id,
        is_premium: false,
        appointments_count: 0
      };
      
      const { data: newEstablishment, error } = await supabase
        .from('establishments')
        .insert(establishmentData)
        .select()
        .single();
        
      if (error) throw error;
      
      return newEstablishment;
    } catch (error) {
      console.error("Error creating establishment:", error);
      throw error;
    }
  };

  // Delete an establishment
  const deleteEstablishment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('establishments')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error("Error deleting establishment:", error);
      throw error;
    }
  };

  return {
    getEstablishmentBySlug,
    createInvite,
    acceptInvite,
    getUserEstablishments,
    getAllEstablishments,
    createEstablishment,
    deleteEstablishment,
    loading,
    error,
  };
}
