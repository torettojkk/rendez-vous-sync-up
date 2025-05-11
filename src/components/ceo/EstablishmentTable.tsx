import React, { useState } from "react";
import { Search, Edit, Trash2, Copy, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Establishment } from "@/types/user";
import { useToast } from "@/hooks/use-toast";

interface EstablishmentTableProps {
  establishments: Establishment[];
  onEdit: (establishment: Establishment) => void;
  onDelete: (id: string) => void;
  onInvite: (establishment: Establishment) => void;
  onCopyInviteLink: (establishment: Establishment) => void;
}

const EstablishmentTable: React.FC<EstablishmentTableProps> = ({
  establishments,
  onEdit,
  onDelete,
  onInvite,
  onCopyInviteLink
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEstablishments = establishments.filter(est => 
    est.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-cream">Lista de Estabelecimentos</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cream/50" />
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-navy border-sky/20 text-cream"
          />
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow className="border-sky/10 hover:bg-transparent">
            <TableHead className="text-cream/70">Nome</TableHead>
            <TableHead className="text-cream/70">URL</TableHead>
            <TableHead className="text-cream/70">Status</TableHead>
            <TableHead className="text-cream/70">Agendamentos</TableHead>
            <TableHead className="text-cream/70">Data de Cadastro</TableHead>
            <TableHead className="text-cream/70">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEstablishments.map((establishment) => (
            <TableRow 
              key={establishment.id}
              className="border-sky/10 hover:bg-navy/60"
            >
              <TableCell>
                <div>
                  <p className="font-medium text-cream">{establishment.name}</p>
                  <p className="text-xs text-cream/70">{establishment.phone}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-cream/70">{establishment.slug}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onCopyInviteLink(establishment)}
                    className="h-6 w-6 hover:bg-sky/10"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <div className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${
                  establishment.isPremium 
                    ? "bg-green-600/20 text-green-400" 
                    : "bg-amber-600/20 text-amber-400"
                }`}>
                  {establishment.isPremium ? "Premium" : "Gratuito"}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-cream">
                  {establishment.appointmentsCount}
                  {!establishment.isPremium && (
                    <span className="text-xs text-cream/50 ml-1">
                      / 50
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-cream/70">
                {establishment.createdAt.toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => onInvite(establishment)}
                    className="hover:bg-sky/20 hover:text-cream"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => onEdit(establishment)}
                    className="hover:bg-sky/20 hover:text-cream"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => onDelete(establishment.id)}
                    className="hover:bg-red-600/20 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default EstablishmentTable;
