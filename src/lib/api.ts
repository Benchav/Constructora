// src/lib/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api-constructora.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Siempre leer token desde localStorage justo antes de enviar la request
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      } else if (config.headers?.Authorization) {
        delete config.headers.Authorization;
      }
    } catch (e) {
      // ignore
    }
    // DEBUG temporal -> verás en consola cada petición y si lleva token
    // Descomenta si lo quieres ver:
    // console.log('➡️ api request:', config.method?.toUpperCase(), config.url, 'Auth:', !!localStorage.getItem('token'));
    return config;
  },
  (err) => Promise.reject(err)
);

// Respuesta: no redirigir/limpiar automáticamente aquí (lo hacemos en AuthContext si queremos)
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    // opcional: log
    // console.warn('⬅️ api response error:', err.response?.status, err.config?.url);
    return Promise.reject(err);
  }
);

export default apiClient;