
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { User, Pencil } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState({
    name: user?.name || "Cliente Teste",
    email: user?.email || "cliente@example.com",
    phone: "(11) 98765-4321",
    address: "Rua Exemplo, 123 - Bairro - Cidade/UF"
  });
  
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveProfile = () => {
    setProfile(formData);
    setEditing(false);
    
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso."
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cream">Meu Perfil</h1>
        <p className="text-cream/70">Visualize e edite suas informações pessoais.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-navy-dark border-sky/10 md:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-sky/20 flex items-center justify-center mb-4">
              <User className="h-16 w-16 text-cream/70" />
            </div>
            <h3 className="text-xl font-bold text-cream mb-1">{profile.name}</h3>
            <p className="text-cream/70 mb-4">{profile.email}</p>
            
            <div className="w-full border-t border-sky/10 pt-4 mt-2">
              <p className="text-sm text-cream/70">Tipo de conta:</p>
              <p className="text-cream">Cliente</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-navy-dark border-sky/10 md:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-cream">Informações Pessoais</CardTitle>
              
              {!editing && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditing(true)}
                  className="border-sky/20 text-cream hover:bg-navy flex items-center gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  <span>Editar</span>
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            {!editing ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm text-cream/70 mb-1">Nome</h4>
                  <p className="text-cream">{profile.name}</p>
                </div>
                <div>
                  <h4 className="text-sm text-cream/70 mb-1">Email</h4>
                  <p className="text-cream">{profile.email}</p>
                </div>
                <div>
                  <h4 className="text-sm text-cream/70 mb-1">Telefone</h4>
                  <p className="text-cream">{profile.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm text-cream/70 mb-1">Endereço</h4>
                  <p className="text-cream">{profile.address}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-cream/70 block mb-1">Nome</label>
                  <Input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-navy border-sky/20 text-cream"
                  />
                </div>
                <div>
                  <label className="text-sm text-cream/70 block mb-1">Email</label>
                  <Input 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-navy border-sky/20 text-cream"
                    disabled
                  />
                  <p className="text-xs text-cream/50 mt-1">O email não pode ser alterado</p>
                </div>
                <div>
                  <label className="text-sm text-cream/70 block mb-1">Telefone</label>
                  <Input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-navy border-sky/20 text-cream"
                  />
                </div>
                <div>
                  <label className="text-sm text-cream/70 block mb-1">Endereço</label>
                  <Input 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="bg-navy border-sky/20 text-cream"
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setFormData(profile);
                      setEditing(false);
                    }}
                    className="border-sky/20 text-cream hover:bg-navy"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSaveProfile}
                    className="bg-teal hover:bg-teal-light text-cream"
                  >
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
