
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    
    if (isAuthenticated && user) {
      // Redirecionar com base no tipo de usuário
      switch (user.role) {
        case "ceo":
          navigate("/ceo/dashboard");
          break;
        case "establishment":
          navigate("/establishment/dashboard");
          break;
        case "client":
          navigate("/dashboard");
          break;
        default:
          navigate("/dashboard");
      }
    } else {
      // Se não estiver autenticado, redirecionar para o login
      navigate("/");
    }
  }, [navigate, isAuthenticated, user, loading]);

  return null;
};

export default Index;
