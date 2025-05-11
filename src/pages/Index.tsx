
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    
    if (isAuthenticated && user) {
      // Redirect based on user role
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
      // If not authenticated, redirect to login
      navigate("/");
    }
  }, [navigate, isAuthenticated, user, loading]);

  return null;
};

export default Index;
