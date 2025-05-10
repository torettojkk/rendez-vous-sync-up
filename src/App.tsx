
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import CEOLayout from "./components/CEOLayout";
import EstablishmentLayout from "./components/EstablishmentLayout";

// Páginas
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Clients from "./pages/Clients";
import NotFound from "./pages/NotFound";

// Páginas do CEO
import CEODashboard from "./pages/ceo/Dashboard";
import EstablishmentsPage from "./pages/ceo/Establishments";

// Páginas do Estabelecimento
import EstablishmentDashboard from "./pages/establishment/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Rota de Login - Pública */}
            <Route path="/" element={<Login />} />
            
            {/* Rotas do Cliente */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/appointments" 
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <Layout><Appointments /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/clients" 
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <Layout><Clients /></Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas do CEO */}
            <Route 
              path="/ceo/dashboard" 
              element={
                <ProtectedRoute allowedRoles={["ceo"]}>
                  <CEOLayout><CEODashboard /></CEOLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ceo/establishments" 
              element={
                <ProtectedRoute allowedRoles={["ceo"]}>
                  <CEOLayout><EstablishmentsPage /></CEOLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ceo/users" 
              element={
                <ProtectedRoute allowedRoles={["ceo"]}>
                  <CEOLayout><NotFound /></CEOLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ceo/finance" 
              element={
                <ProtectedRoute allowedRoles={["ceo"]}>
                  <CEOLayout><NotFound /></CEOLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ceo/reports" 
              element={
                <ProtectedRoute allowedRoles={["ceo"]}>
                  <CEOLayout><NotFound /></CEOLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ceo/settings" 
              element={
                <ProtectedRoute allowedRoles={["ceo"]}>
                  <CEOLayout><NotFound /></CEOLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas do Estabelecimento */}
            <Route 
              path="/establishment/dashboard" 
              element={
                <ProtectedRoute allowedRoles={["establishment"]}>
                  <EstablishmentLayout><EstablishmentDashboard /></EstablishmentLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/establishment/appointments" 
              element={
                <ProtectedRoute allowedRoles={["establishment"]}>
                  <EstablishmentLayout><NotFound /></EstablishmentLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/establishment/clients" 
              element={
                <ProtectedRoute allowedRoles={["establishment"]}>
                  <EstablishmentLayout><NotFound /></EstablishmentLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/establishment/services" 
              element={
                <ProtectedRoute allowedRoles={["establishment"]}>
                  <EstablishmentLayout><NotFound /></EstablishmentLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/establishment/notifications" 
              element={
                <ProtectedRoute allowedRoles={["establishment"]}>
                  <EstablishmentLayout><NotFound /></EstablishmentLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/establishment/settings" 
              element={
                <ProtectedRoute allowedRoles={["establishment"]}>
                  <EstablishmentLayout><NotFound /></EstablishmentLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Rota para páginas não encontradas */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
