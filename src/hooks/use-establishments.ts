
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/use-supabase";
import { Establishment } from "@/types/user";

export function useEstablishments() {
  const { toast } = useToast();
  const { createInvite, getAllEstablishments, createEstablishment, deleteEstablishment } = useSupabase();
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEstablishments();
  }, []);

  const fetchEstablishments = async () => {
    try {
      setLoading(true);
      const data = await getAllEstablishments();
      setEstablishments(data);
    } catch (error) {
      console.error('Error fetching establishments:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os estabelecimentos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEstablishment = async (id: string) => {
    try {
      await deleteEstablishment(id);
      setEstablishments(prev => prev.filter(est => est.id !== id));
      toast({
        title: "Estabelecimento removido",
        description: "O estabelecimento foi removido com sucesso."
      });
    } catch (error) {
      console.error('Error deleting establishment:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o estabelecimento.",
        variant: "destructive"
      });
    }
  };

  const handleInviteClient = async (establishmentId: string, inviteData: { type: 'email' | 'phone'; contact: string }) => {
    try {
      if (!inviteData.contact) {
        toast({
          title: "Erro",
          description: "Insira um email ou telefone válido.",
          variant: "destructive"
        });
        return;
      }
      
      const { code } = await createInvite(
        establishmentId,
        inviteData.type,
        inviteData.contact
      );

      toast({
        title: "Convite enviado",
        description: `Código do convite: ${code}`
      });

      return true;
    } catch (error) {
      console.error('Error sending invite:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o convite.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleCreateEstablishment = async (formData: {
    name: string;
    description: string;
    phone: string;
    ownerEmail: string;
  }) => {
    try {
      if (!formData.name) {
        toast({
          title: "Erro",
          description: "Nome do estabelecimento é obrigatório",
          variant: "destructive"
        });
        return null;
      }
      
      const newEstablishment = await createEstablishment({
        name: formData.name,
        description: formData.description,
        phone: formData.phone,
        ownerEmail: formData.ownerEmail,
      });
      
      // Add new establishment to the list with proper mapping
      const mappedEstablishment: Establishment = {
        id: newEstablishment.id,
        name: newEstablishment.name,
        description: newEstablishment.description || '',
        slug: newEstablishment.unique_url || '', // Map unique_url to slug
        ownerId: newEstablishment.owner_id,
        appointmentsCount: newEstablishment.appointments_count || 0,
        isPremium: newEstablishment.is_premium || false,
        createdAt: new Date(newEstablishment.created_at),
        phone: newEstablishment.phone || undefined,
        services: [],
        availableHours: []
      };
      
      setEstablishments(prev => [mappedEstablishment, ...prev]);
      
      toast({
        title: "Estabelecimento criado",
        description: "Estabelecimento criado com sucesso."
      });
      
      return mappedEstablishment;
    } catch (error) {
      console.error('Error creating establishment:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o estabelecimento.",
        variant: "destructive"
      });
      
      return null;
    }
  };
  
  const handleCopyInviteLink = (establishment: Establishment) => {
    const inviteUrl = `${window.location.origin}/?invite=${establishment.slug}`;
    navigator.clipboard.writeText(inviteUrl);
    toast({
      title: "Link copiado",
      description: "Link de convite copiado para a área de transferência."
    });
  };

  return {
    establishments,
    loading,
    fetchEstablishments,
    handleDeleteEstablishment,
    handleInviteClient,
    handleCreateEstablishment,
    handleCopyInviteLink,
  };
}
