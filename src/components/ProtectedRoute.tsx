
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types/user";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ["ceo", "establishment", "client"] 
}) => {
  const { isAuthenticated, loading, user, hasRole } = useAuth();

  if (loading) {
    // Enquanto verificamos a autenticação, podemos mostrar um indicador de carregamento
    return (
      <div className="h-screen flex items-center justify-center bg-navy">
        <div className="text-cream">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirecionar para a página de login se não estiver autenticado
    return <Navigate to="/" replace />;
  }

  if (!hasRole(allowedRoles)) {
    // Redirecionar com base no papel do usuário se não tiver acesso
    switch (user?.role) {
      case "ceo":
        return <Navigate to="/ceo/dashboard" replace />;
      case "establishment":
        return <Navigate to="/establishment/dashboard" replace />;
      case "client":
        return <Navigate to="/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // Se estiver autenticado e tiver a permissão adequada
  return <>{children}</>;
};

export default ProtectedRoute;
