
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useEstablishments } from "@/hooks/use-establishments";
import { Establishment } from "@/types/user";
import EstablishmentTable from "@/components/ceo/EstablishmentTable";
import EstablishmentForm from "@/components/ceo/EstablishmentForm";
import InviteClientDialog from "@/components/ceo/InviteClientDialog";

const EstablishmentsPage = () => {
  const {
    establishments,
    loading,
    handleDeleteEstablishment,
    handleInviteClient,
    handleCreateEstablishment,
    handleCopyInviteLink,
  } = useEstablishments();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [inviteData, setInviteData] = useState({
    type: "email" as "email" | "phone",
    contact: ""
  });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone: "",
    ownerEmail: ""
  });

  const handleNewEstablishment = () => {
    setFormData({
      name: "",
      description: "",
      phone: "",
      ownerEmail: ""
    });
    setSelectedEstablishment(null);
    setDialogOpen(true);
  };

  const handleEditEstablishment = (establishment: Establishment) => {
    setFormData({
      name: establishment.name,
      description: establishment.description || "",
      phone: establishment.phone || "",
      ownerEmail: "" // Can't edit owner email once created
    });
    setSelectedEstablishment(establishment);
    setDialogOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpenInviteDialog = (establishment: Establishment) => {
    setSelectedEstablishment(establishment);
    setInviteDialogOpen(true);
  };

  const handleSendInvite = async () => {
    if (selectedEstablishment) {
      const success = await handleInviteClient(selectedEstablishment.id, inviteData);
      if (success) {
        setInviteDialogOpen(false);
        setInviteData({ type: "email", contact: "" });
      }
    }
  };

  const handleCreateOrUpdateEstablishment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEstablishment) {
      // Create new establishment
      const newEstablishment = await handleCreateEstablishment(formData);
      
      if (newEstablishment) {
        setDialogOpen(false);
      }
    } else {
      // Update establishment (feature not fully implemented yet)
      setDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-cream">Estabelecimentos</h1>
          <p className="text-cream/70">Gerencie os estabelecimentos cadastrados no sistema.</p>
        </div>
        <Button 
          onClick={handleNewEstablishment}
          className="bg-teal hover:bg-teal-light text-cream"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Estabelecimento
        </Button>
      </div>

      <Card className="bg-navy-dark border-sky/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-cream">Lista de Estabelecimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <EstablishmentTable 
            establishments={establishments}
            onEdit={handleEditEstablishment}
            onDelete={handleDeleteEstablishment}
            onInvite={handleOpenInviteDialog}
            onCopyInviteLink={handleCopyInviteLink}
          />
        </CardContent>
      </Card>

      {/* Establishment Form Dialog */}
      <EstablishmentForm 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedEstablishment={selectedEstablishment}
        onSubmit={handleCreateOrUpdateEstablishment}
        formData={formData}
        onFormChange={handleFormChange}
      />

      {/* Invite Dialog */}
      <InviteClientDialog 
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        inviteData={inviteData}
        setInviteData={setInviteData}
        onSendInvite={handleSendInvite}
      />
    </div>
  );
};

export default EstablishmentsPage;
