
import React from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "../contexts/AuthContext";

interface CEOLayoutProps {
  children: React.ReactNode;
}

const CEOLayout: React.FC<CEOLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-navy overflow-hidden">
      <Sidebar 
        userRole="ceo"
        userName={user?.name || "Administrador"}
      />
      <main className="flex-1 overflow-y-auto">
        <header className="bg-navy-dark p-4 text-cream border-b border-sky/10 flex justify-between items-center">
          <h1 className="text-xl font-bold">Painel do Administrador</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-cream/70">{user?.email}</span>
            <button 
              onClick={logout}
              className="text-cream/70 hover:text-cream text-sm"
            >
              Sair
            </button>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default CEOLayout;
