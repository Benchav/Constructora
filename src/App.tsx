import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Proyectos from "./pages/Proyectos";
import ProyectoDetalle from "./pages/ProyectoDetalle";
import GestionUsuarios from "./pages/GestionUsuarios";
import GestionInventario from "./pages/GestionInventario";
import GestionFinanzas from "./pages/GestionFinanzas";
import GestionRRHH from "./pages/GestionRRHH";
import GestionLicitaciones from "./pages/GestionLicitaciones";
import GestionPlanos from "./pages/GestionPlanos";
import GestionReportes from "./pages/GestionReportes";
import MiProyecto from "./pages/MiProyecto";
import InventarioTotal from "./pages/InventarioTotal";
import Solicitudes from "./pages/Solicitudes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/proyectos" element={<ProtectedRoute><Proyectos /></ProtectedRoute>} />
            <Route path="/proyecto/:id" element={<ProtectedRoute><ProyectoDetalle /></ProtectedRoute>} />
            <Route path="/mi-proyecto" element={<ProtectedRoute><MiProyecto /></ProtectedRoute>} />
            <Route path="/usuarios" element={<ProtectedRoute><GestionUsuarios /></ProtectedRoute>} />
            <Route path="/inventario" element={<ProtectedRoute><GestionInventario /></ProtectedRoute>} />
            <Route path="/inventario-total" element={<ProtectedRoute><InventarioTotal /></ProtectedRoute>} />
            <Route path="/finanzas" element={<ProtectedRoute><GestionFinanzas /></ProtectedRoute>} />
            <Route path="/rrhh" element={<ProtectedRoute><GestionRRHH /></ProtectedRoute>} />
            <Route path="/licitaciones" element={<ProtectedRoute><GestionLicitaciones /></ProtectedRoute>} />
            <Route path="/planos" element={<ProtectedRoute><GestionPlanos /></ProtectedRoute>} />
            <Route path="/reportes" element={<ProtectedRoute><GestionReportes /></ProtectedRoute>} />
            <Route path="/solicitudes" element={<ProtectedRoute><Solicitudes /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
