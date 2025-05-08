
import React from "react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

// Colors used in the project:
// #213448 (Navy - Background) -> bg-navy
// #547792 (Sky - Primary Elements) -> bg-sky
// #94B4C1 (Teal - Secondary Elements) -> bg-teal
// #ECEFCA (Cream - Text, Icons) -> text-cream

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-navy overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
