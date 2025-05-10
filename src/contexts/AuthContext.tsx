
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, UserRole } from "../types/user";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aqui verificaríamos se há um usuário salvo no localStorage
    // e validaríamos sua sessão com o backend
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulação de login - em um app real, faria uma chamada API
      setLoading(true);
      
      // Simulação de resposta de API
      // No futuro, isso viria do backend
      const mockUsers = [
        { id: "1", name: "Admin CEO", email: "admin@example.com", role: "ceo" as UserRole },
        { id: "2", name: "Salão Exemplo", email: "salao@example.com", role: "establishment" as UserRole, establishmentId: "est1" },
        { id: "3", name: "Cliente Teste", email: "cliente@example.com", role: "client" as UserRole }
      ];
      
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error("Usuário não encontrado");
      }
      
      // Em um app real, verificaríamos a senha aqui
      
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      
      // Redirecionar com base no tipo de usuário
      switch (foundUser.role) {
        case "ceo":
          navigate("/ceo/dashboard");
          break;
        case "establishment":
          navigate("/establishment/dashboard");
          break;
        case "client":
          navigate("/dashboard"); // ou uma rota específica para clientes
          break;
      }
      
    } catch (error) {
      console.error("Erro de login:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      loading,
      login,
      logout,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  
  return context;
};
