
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, UserRole } from "../types/user";
import { supabase, Tables } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  signUp: (email: string, password: string, name: string, inviteCode?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.name,
          email: session.user.email!,
          role: session.user.user_metadata.role as UserRole,
          establishmentId: session.user.user_metadata.establishmentId
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.name,
          email: session.user.email!,
          role: session.user.user_metadata.role as UserRole,
          establishmentId: session.user.user_metadata.establishmentId
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      const user = data.user;
      const role = user.user_metadata.role as UserRole;

      // Redirect based on user role
      switch (role) {
        case "ceo":
          navigate("/ceo/dashboard");
          break;
        case "establishment":
          navigate("/establishment/dashboard");
          break;
        case "client":
          navigate("/dashboard");
          break;
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, inviteCode?: string) => {
    try {
      setLoading(true);

      // If invite code exists, validate it first
      let establishmentId: string | undefined;
      if (inviteCode) {
        const { data: invite, error: inviteError } = await supabase
          .from('invites')
          .select('establishment_id')
          .eq('code', inviteCode)
          .eq('status', 'pending')
          .single();

        if (inviteError || !invite) {
          throw new Error('Invalid or expired invite code');
        }
        establishmentId = invite.establishment_id;
      }

      // Sign up user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'client',
            establishmentId
          }
        }
      });

      if (error) throw error;

      // If signing up with invite, create establishment-client relationship
      if (establishmentId && data.user) {
        const { error: relationError } = await supabase
          .from('establishment_clients')
          .insert({
            establishment_id: establishmentId,
            client_id: data.user.id,
            status: 'active'
          });

        if (relationError) throw relationError;

        // Update invite status
        await supabase
          .from('invites')
          .update({ status: 'accepted' })
          .eq('code', inviteCode);
      }

      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
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
      hasRole,
      signUp
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
