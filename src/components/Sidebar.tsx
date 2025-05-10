
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Bell, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Building,
  DollarSign,
  FileBar
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { UserRole } from "../types/user";
import { useAuth } from "../contexts/AuthContext";

interface SidebarProps {
  userRole: UserRole;
  userName?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole, userName }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();

  // Menu items based on user role
  const getMenuItems = () => {
    switch (userRole) {
      case "ceo":
        return [
          { icon: Calendar, label: "Dashboard", path: "/ceo/dashboard" },
          { icon: Building, label: "Estabelecimentos", path: "/ceo/establishments" },
          { icon: Users, label: "Usuários", path: "/ceo/users" },
          { icon: DollarSign, label: "Financeiro", path: "/ceo/finance" },
          { icon: FileBar, label: "Relatórios", path: "/ceo/reports" },
          { icon: Settings, label: "Configurações", path: "/ceo/settings" },
        ];
      case "establishment":
        return [
          { icon: Calendar, label: "Dashboard", path: "/establishment/dashboard" },
          { icon: Clock, label: "Agendamentos", path: "/establishment/appointments" },
          { icon: Users, label: "Clientes", path: "/establishment/clients" },
          { icon: FileText, label: "Serviços", path: "/establishment/services" },
          { icon: Bell, label: "Notificações", path: "/establishment/notifications" },
          { icon: Settings, label: "Configurações", path: "/establishment/settings" },
        ];
      case "client":
      default:
        return [
          { icon: Calendar, label: "Agenda", path: "/dashboard" },
          { icon: Clock, label: "Compromissos", path: "/appointments" },
          { icon: Users, label: "Perfil", path: "/profile" },
          { icon: Bell, label: "Notificações", path: "/notifications" },
          { icon: Settings, label: "Configurações", path: "/settings" },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div
      className={cn(
        "h-screen bg-navy-dark border-r border-sky/10 flex flex-col transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-center">
        {!collapsed ? (
          <Logo />
        ) : (
          <div className="bg-teal rounded-lg p-2 shadow-lg mx-auto">
            <Calendar className="text-cream h-5 w-5" />
          </div>
        )}
      </div>

      {!collapsed && userName && (
        <div className="px-4 py-2">
          <div className="bg-navy/60 rounded-lg p-3">
            <p className="text-cream text-sm font-medium truncate">{userName}</p>
            <p className="text-cream/50 text-xs truncate">
              {userRole === "ceo" ? "Administrador" : 
               userRole === "establishment" ? "Estabelecimento" : "Cliente"}
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 px-2 flex-1 overflow-y-auto">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200",
                  "text-cream/70 hover:text-cream hover:bg-sky/10",
                  isActive && "bg-sky/20 text-cream font-medium"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-sky/10 mt-auto">
        <div 
          className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors duration-200 text-cream/70 hover:text-cream hover:bg-sky/10"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Sair</span>}
        </div>
      </div>

      <button
        className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-teal rounded-full p-1 text-cream shadow-md hover:bg-teal-light transition-colors"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};

export default Sidebar;
