// src/contexts/AuthContext.tsx
import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api';
import { Usuario } from '@/data/models';
import { toast } from 'sonner';

export interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  login: (username: string, password: string) => Promise<Usuario | null>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  canAccess: (routeOrModule: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalize = (text?: string) =>
  (text || '').normalize?.('NFD')?.replace(/[\u0300-\u036f]/g, '')?.toLowerCase()?.trim?.() || '';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Lista de roles aceptados (normalizados). Manténla sincronizada con backend.
  const backendRoles = [
    'ceo',
    'gerente general',
    'director de proyectos',
    'director finanzas',
    'director comercial',
    'jefe oficina tecnica',
    'jefe de logistica',
    'jefe de obra',
    'maestro de obra',
    'bodeguero',
    'rrhh',
    'asistente administrativo',
    'operador de maquinaria',
    'albanil',
  ];

  // Mapeo módulos/permiso (coincide con la lógica en tu backend)
  const permisosMap: Record<string, string[]> = {
    'ceo': ['*'],
    'gerente general': ['proyectos', 'reportes', 'finanzas'],
    'director de proyectos': ['proyectos', 'reportes'],
    'director finanzas': ['finanzas', 'reportes'],
    'director comercial': ['ventas', 'reportes'],
    'jefe oficina tecnica': ['planos', 'reportes'],
    'jefe de logistica': ['compras', 'inventario'],
    'rrhh': ['personal'],
    'asistente administrativo': ['reportes', 'personal'],
    'jefe de obra': ['reportes', 'materiales'],
    'maestro de obra': ['reportes'],
    'bodeguero': ['inventario'],
    'albanil': ['planos'],
    'operador de maquinaria': ['planos'],
  };

  useEffect(() => {
    // Carga inicial desde localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        const parsedUser = JSON.parse(storedUser);
        parsedUser.rol = normalize(parsedUser.rol);
        setUser(parsedUser);
        // aseguramos que apiClient tenga el header por defecto
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<Usuario | null> => {
    try {
      const { data } = await apiClient.post<{ token: string; usuario: Usuario }>('/auth/login', {
        username,
        password,
      });

      const { token: newToken, usuario: userData } = data;

      if (!userData || !userData.rol) {
        toast.error('Usuario sin rol válido');
        return null;
      }

      const normalizedRole = normalize(userData.rol);
      if (!backendRoles.includes(normalizedRole)) {
        toast.error(`Rol "${userData.rol}" no reconocido`);
        return null;
      }

      const userToStore = { ...userData, rol: normalizedRole };

      // Guardar y setear
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userToStore));
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      setToken(newToken);
      setUser(userToStore);

      toast.success(`Bienvenido, ${userToStore.nombre || userToStore.username || ''}`);
      return userToStore;
    } catch (err: any) {
      console.error('Error login:', err?.response || err);
      const msg = err?.response?.data?.message || 'Error de autenticación';
      toast.error(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete apiClient.defaults.headers.common['Authorization'];
    toast.info('Sesión cerrada');
    window.location.href = '/';
  };

  const isAuthenticated = !!token && !!user;

  // Función pública para chequear si el usuario puede acceder a un módulo o ruta
  const canAccess = useCallback((routeOrModule: string) => {
    if (!user) return false;
    const userRole = normalize(user.rol);
   if (userRole === 'ceo' || userRole === 'gerente general') return true;
    const moduleKey = normalize(routeOrModule);

    // Si no existe la clave, no permitir.
    const allowed = permisosMap[userRole] || [];
    if (allowed.includes('*')) return true;
    return allowed.includes(moduleKey);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, loading, canAccess }}>
      {children}
    </AuthContext.Provider>
  );
};