// Copiar y pegar todo el contenido
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Building2, 
  DollarSign, 
  Users, 
  Package, 
  FileText, 
  Briefcase,
  HardHat,
  ClipboardList,
  FileStack,
  ShoppingCart,
  Wallet,
  UserCog,
  Truck, // Nuevo icono para Compras/Logística
  Shield, // Nuevo icono para Seguridad
  CheckCircle, // Nuevo icono para Calidad
  Clipboard
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['CEO', 'Gerente General', 'Director de Proyectos', 'Director Finanzas', 'Director Comercial'] },
  { label: 'Todos los Proyectos', path: '/proyectos', icon: Building2, roles: ['CEO', 'Gerente General', 'Director de Proyectos'] },
  { label: 'Mi Proyecto', path: '/mi-proyecto', icon: HardHat, roles: ['Jefe de Obra', 'Maestro de Obra'] },
  { label: 'Finanzas', path: '/finanzas', icon: DollarSign, roles: ['CEO', 'Gerente General', 'Director Finanzas', 'Asistente Administrativo'] }, // Asistente Adm. añadido
  
  // ===========================================================================================
  // MÓDULOS DE COMPRAS Y LOGÍSTICA
  // ===========================================================================================
  { label: 'Órdenes de Compra', path: '/compras', icon: Truck, roles: ['CEO', 'Gerente General', 'Jefe de Logística'] }, // NUEVO MÓDULO
  { label: 'Inventario Total', path: '/inventario-total', icon: Package, roles: ['CEO', 'Gerente General', 'Director de Proyectos', 'Jefe de Logística'] }, // Jefe Logística añadido
  { label: 'Inventario Mi Obra', path: '/inventario', icon: ShoppingCart, roles: ['Jefe de Obra', 'Bodeguero'] },
  
  // ===========================================================================================
  // MÓDULOS DE PROYECTOS/CONSTRUCCIÓN
  // ===========================================================================================
  { label: 'Reportes Diarios', path: '/reportes', icon: ClipboardList, roles: ['Jefe de Obra', 'Maestro de Obra'] },
  { label: 'Planos y Docs', path: '/planos', icon: FileText, roles: ['CEO', 'Gerente General', 'Director de Proyectos', 'Jefe Oficina Tecnica', 'Jefe de Obra', 'Maestro de Obra'] },
  { label: 'Control de Calidad', path: '/calidad', icon: CheckCircle, roles: ['Director de Proyectos', 'Jefe Oficina Tecnica', 'Jefe de Obra'] }, // NUEVO MÓDULO
  { label: 'Seguridad y EPP', path: '/seguridad', icon: Shield, roles: ['Director de Proyectos', 'Jefe de Obra', 'Maestro de Obra'] }, // NUEVO MÓDULO

  // ===========================================================================================
  // MÓDULOS COMERCIALES Y GENERALES
  // ===========================================================================================
  { label: 'Licitaciones', path: '/licitaciones', icon: Briefcase, roles: ['CEO', 'Gerente General', 'Director Comercial'] },
  { label: 'Solicitudes', path: '/solicitudes', icon: FileStack, roles: ['CEO', 'Gerente General', 'Director de Proyectos', 'Director Finanzas', 'Jefe de Obra'] },
  { label: 'Gestión de Personal', path: '/rrhh', icon: Users, roles: ['CEO', 'Gerente General', 'RRHH'] }, // Etiqueta actualizada
  { label: 'Gestión de Usuarios', path: '/usuarios', icon: UserCog, roles: ['CEO', 'Gerente General'] },
];

export const DynamicSidebar = () => {
  const { user } = useAuth();

  const filteredItems = navItems.filter(item => 
    item.roles.includes(user?.rol || '')
  );

  return (
    <aside className="h-full bg-sidebar border-r">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-sidebar-foreground mb-2">Navegación</h2>
        <p className="text-xs text-muted-foreground">{user?.rol}</p>
      </div>
      
      <nav className="px-3 pb-4">
        <ul className="space-y-1">
          {filteredItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};