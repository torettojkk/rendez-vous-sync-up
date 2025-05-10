import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

export function useSupabase() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch establishment by slug
  const getEstablishmentBySlug = async (slug: string) => {
    const { data, error } = await supabase
      .from('establishments')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  };

  // Create invite
  const createInvite = async (establishmentId: string, type: 'email' | 'phone', contact: string) => {
    const response = await fetch(`${supabase.supabaseUrl}/functions/v1/manage-invites`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabase.supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ establishmentId, type, contact }),
    });

    if (!response.ok) {
      throw new Error('Failed to create invite');
    }

    return response.json();
  };

  // Accept invite
  const acceptInvite = async (inviteCode: string, establishmentId: string) => {
    const { data: invite, error: inviteError } = await supabase
      .from('invites')
      .select('*')
      .eq('code', inviteCode)
      .eq('establishment_id', establishmentId)
      .single();

    if (inviteError || !invite) throw new Error('Invalid invite code');

    const { error: relationError } = await supabase
      .from('establishment_clients')
      .insert({
        establishment_id: establishmentId,
        client_id: user?.id,
        status: 'active',
      });

    if (relationError) throw relationError;

    // Update invite status
    await supabase
      .from('invites')
      .update({ status: 'accepted' })
      .eq('id', invite.id);

    return true;
  };

  // Get user's establishments
  const getUserEstablishments = async () => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('establishments')
      .select(`
        *,
        establishment_clients!inner(status)
      `)
      .eq('establishment_clients.client_id', user.id)
      .eq('establishment_clients.status', 'active');

    if (error) throw error;
    return data;
  };

  return {
    getEstablishmentBySlug,
    createInvite,
    acceptInvite,
    getUserEstablishments,
    loading,
    error,
  };
}