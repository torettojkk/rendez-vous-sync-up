import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, Lock, User } from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";

const Login = () => {
  const { login, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  });

  // Get invite code from URL if present
  const inviteCode = new URLSearchParams(location.search).get("invite");
  
  useEffect(() => {
    if (inviteCode) {
      setIsLogin(false); // Show signup form if invite code is present
    }
  }, [inviteCode]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success("Login realizado com sucesso!");
      } else {
        await signUp(formData.email, formData.password, formData.name, inviteCode);
        toast.success("Conta criada com sucesso! Faça login para continuar.");
        setIsLogin(true);
      }
    } catch (error) {
      console.error(error);
      toast.error(isLogin ? 
        "Falha no login. Verifique suas credenciais." : 
        "Falha no cadastro. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy p-4">
      <div className="card-container w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <Logo className="mb-2" />
          <h1 className="text-2xl font-bold text-cream">
            {isLogin ? "Bem-vindo de volta" : inviteCode ? "Complete seu cadastro" : "Crie sua conta"}
          </h1>
          <p className="text-cream/70 text-sm">
            {isLogin 
              ? "Faça login para gerenciar seus agendamentos" 
              : inviteCode
                ? "Você foi convidado para se juntar a um estabelecimento"
                : "Cadastre-se para começar a usar o sistema"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-cream/90">Nome</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cream/50 h-5 w-5" />
                <Input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-cream/90">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cream/50 h-5 w-5" />
              <Input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com" 
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-cream/90">Senha</label>
              {isLogin && (
                <button 
                  type="button"
                  className="text-xs text-sky hover:text-sky-light"
                >
                  Esqueceu a senha?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cream/50 h-5 w-5" />
              <Input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********" 
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-teal hover:bg-teal-light text-cream"
            disabled={loading}
          >
            {loading ? "Processando..." : isLogin ? "Entrar" : "Criar conta"}
          </Button>
        </form>

        {!inviteCode && (
          <div className="mt-5 text-center">
            <p className="text-sm text-cream/70">
              {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sky hover:text-sky-light font-medium"
              >
                {isLogin ? "Criar conta" : "Entrar"}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;