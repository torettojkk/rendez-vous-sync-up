
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Establishment } from "@/types/user";

interface EstablishmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEstablishment: Establishment | null;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    name: string;
    description: string;
    phone: string;
    ownerEmail: string;
  };
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EstablishmentForm: React.FC<EstablishmentFormProps> = ({
  open,
  onOpenChange,
  selectedEstablishment,
  onSubmit,
  formData,
  onFormChange
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-navy-dark border-sky/10 text-cream">
        <DialogHeader>
          <DialogTitle>
            {selectedEstablishment ? "Editar Estabelecimento" : "Novo Estabelecimento"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm text-cream/70">Nome</label>
            <Input 
              name="name"
              value={formData.name}
              onChange={onFormChange}
              className="bg-navy border-sky/20 text-cream"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-cream/70">Descrição</label>
            <Input 
              name="description"
              value={formData.description}
              onChange={onFormChange}
              className="bg-navy border-sky/20 text-cream"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-cream/70">Telefone</label>
            <Input 
              name="phone"
              value={formData.phone}
              onChange={onFormChange}
              className="bg-navy border-sky/20 text-cream"
            />
          </div>
          {!selectedEstablishment && (
            <div className="space-y-2">
              <label className="text-sm text-cream/70">Email do Proprietário</label>
              <Input 
                type="email"
                name="ownerEmail"
                value={formData.ownerEmail}
                onChange={onFormChange}
                placeholder="email@exemplo.com"
                className="bg-navy border-sky/20 text-cream"
              />
            </div>
          )}
          <DialogFooter>
            <Button 
              type="button"
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-sky/20 text-cream hover:bg-navy"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-teal hover:bg-teal-light text-cream"
            >
              {selectedEstablishment ? "Salvar Alterações" : "Criar Estabelecimento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EstablishmentForm;
