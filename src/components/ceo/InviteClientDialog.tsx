
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
import { CardDescription } from "@/components/ui/card";

interface InviteClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inviteData: {
    type: "email" | "phone";
    contact: string;
  };
  setInviteData: React.Dispatch<React.SetStateAction<{
    type: "email" | "phone";
    contact: string;
  }>>;
  onSendInvite: () => void;
}

const InviteClientDialog: React.FC<InviteClientDialogProps> = ({
  open,
  onOpenChange,
  inviteData,
  setInviteData,
  onSendInvite
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-navy-dark border-sky/10 text-cream">
        <DialogHeader>
          <DialogTitle>Convidar Cliente</DialogTitle>
          <CardDescription className="text-cream/70">
            Envie um convite para um cliente se juntar ao estabelecimento
          </CardDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm text-cream/70">Tipo de Convite</label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={inviteData.type === "email" ? "default" : "outline"}
                onClick={() => setInviteData({ ...inviteData, type: "email" })}
                className={inviteData.type === "email" 
                  ? "bg-teal hover:bg-teal-light text-cream"
                  : "border-sky/20 text-cream hover:bg-navy"
                }
              >
                Email
              </Button>
              <Button
                type="button"
                variant={inviteData.type === "phone" ? "default" : "outline"}
                onClick={() => setInviteData({ ...inviteData, type: "phone" })}
                className={inviteData.type === "phone"
                  ? "bg-teal hover:bg-teal-light text-cream"
                  : "border-sky/20 text-cream hover:bg-navy"
                }
              >
                Telefone
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-cream/70">
              {inviteData.type === "email" ? "Email" : "Telefone"}
            </label>
            <Input
              type={inviteData.type === "email" ? "email" : "tel"}
              value={inviteData.contact}
              onChange={(e) => setInviteData({ ...inviteData, contact: e.target.value })}
              placeholder={inviteData.type === "email" 
                ? "cliente@exemplo.com" 
                : "(00) 00000-0000"
              }
              className="bg-navy border-sky/20 text-cream"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-sky/20 text-cream hover:bg-navy"
          >
            Cancelar
          </Button>
          <Button 
            onClick={onSendInvite}
            className="bg-teal hover:bg-teal-light text-cream"
          >
            Enviar Convite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteClientDialog;
