// src/lib/api.ts
import axios from 'axios';
import { toast } from 'sonner';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api-constructora.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // <- Permite el envío automático de cookies HttpOnly
});

// Eliminado el interceptor que inyectaba el token desde localStorage
// Ahora el backend usa Cookies HttpOnly que se envían automáticamente

// Interceptor para enviar Bearer token como fallback si las cookies cross-site son bloqueadas por el navegador
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Respuesta: no redirigir/limpiar automáticamente aquí (lo hacemos en AuthContext si queremos)
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    // Si es un error de validación de Zod (status 400 y tiene la propiedad "errors" en el body)
    if (err.response?.status === 400 && err.response?.data?.errors) {
      // Iterar sobre los errores de Zod y mostrar un toast por cada uno
      err.response.data.errors.forEach((errorObj: any) => {
        toast.error(`Error en ${errorObj.path}: ${errorObj.message}`);
      });
    } else if (err.response?.status === 403) {
      toast.error('Acceso denegado. No tienes permisos para realizar esta acción.');
    } else if (err.response?.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        toast.error('Sesión no autorizada o expirada. Redirigiendo al login...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1200);
      }
      // Ignoramos el 401 aquí porque normalmente AuthContext cierra sesión o redirige
      // Opcionalmente: toast.error('Sesión expirada o inválida.');
    }

    return Promise.reject(err);
  }
);

export default apiClient;