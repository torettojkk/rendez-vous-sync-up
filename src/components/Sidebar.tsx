
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Calendar, Clock, Users, FileText, Bell, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: Calendar, label: "Agenda", path: "/dashboard" },
    { icon: Clock, label: "Compromissos", path: "/appointments" },
    { icon: Users, label: "Clientes", path: "/clients" },
    { icon: FileText, label: "Relatórios", path: "/reports" },
    { icon: Bell, label: "Notificações", path: "/notifications" },
    { icon: Settings, label: "Configurações", path: "/settings" },
  ];

  return (
    <div
      className={cn(
        "h-screen bg-navy-dark border-r border-sky/10 flex flex-col transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center">
        {!collapsed ? (
          <Logo />
        ) : (
          <div className="bg-teal rounded-lg p-2 shadow-lg mx-auto">
            <Calendar className="text-cream h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-6 px-2 flex-1 overflow-y-auto">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn("menu-item", isActive && "active")
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
          className="menu-item text-cream/70 hover:text-cream"
          onClick={() => {
            // In a real app would handle logout
            console.log("Logging out");
          }}
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
