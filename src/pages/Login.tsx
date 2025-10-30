// Copiar y pegar todo el contenido
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Importar los datos necesarios para la lógica de redirección inmediata
import { mockUsuarios } from '@/data/mockData'; // Contiene la lista actual de usuarios
import { Usuario } from '@/data/models'; // Contiene la interfaz Usuario

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Función de lógica de redirección basada en el rol
  const getRedirectPath = (rol: string): string => {
    switch (rol) {
      // ROLES GERENCIALES / EJECUTIVOS (Redirigen al Dashboard general)
      case 'CEO':
      case 'Gerente General':
      case 'Director de Proyectos':
      case 'Director Finanzas':
      case 'Director Comercial':
      case 'Jefe Oficina Tecnica':
        return '/dashboard';
      
      // ROLES DE CAMPO (Redirigen a su proyecto o herramienta principal)
      case 'Jefe de Obra':
      case 'Maestro de Obra':
        return '/mi-proyecto';
      
      case 'Bodeguero':
        return '/inventario'; // Inventario Mi Obra
      
      case 'Jefe de Logística':
        return '/compras'; // Órdenes de Compra
      
      // ROLES DE SOPORTE ADMINISTRATIVO
      case 'RRHH':
        return '/rrhh';
      case 'Asistente Administrativo':
        return '/finanzas'; // Gestión Financiera
        
      // ROLES OPERATIVOS (Redirigen a Planos según el requerimiento)
      case 'Albañil':
      case 'Operador de Maquinaria':
        return '/planos';
      
      default:
        return '/dashboard'; 
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // 1. Intenta iniciar sesión (esto actualiza el estado del contexto)
    const success = login(username, password);

    if (success) {
      // 2. Si el login fue exitoso, buscamos el usuario directamente en el mock
      //    para obtener el rol inmediatamente y realizar la redirección.
      const foundUser = mockUsuarios.find(
        (u: Usuario) => u.username === username && u.password === password
      );
      
      if (foundUser) {
        const path = getRedirectPath(foundUser.rol);
        navigate(path);
      } else {
        // Fallback de seguridad, aunque la función login ya confirmó la existencia
        navigate('/dashboard'); 
      }
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary flex items-center justify-center">
            <Building2 className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">ConstructERP</CardTitle>
          <CardDescription className="text-base">
            Sistema de Gestión para Constructoras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="Ingrese su usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" size="lg">
              Ingresar
            </Button>
          </form>

          {/* LISTA DE USUARIOS DE PRUEBA ORGANIZADA POR JERARQUÍA */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-xs font-semibold mb-2 text-muted-foreground">Usuarios de prueba (Jerarquía):</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              {/* Nivel 1: Dirección Ejecutiva */}
              <li>• CEO: <code className="text-foreground">ceo</code> / <code className="text-foreground">123</code> (Dirección General)</li>
              <li>• Gerente General: <code className="text-foreground">gerente.luis</code> / <code className="text-foreground">123</code> (Operaciones)</li>
              
              {/* Nivel 2: Directores de Área */}
              <li>• Director Proyectos: <code className="text-foreground">dir.proyectos</code> / <code className="text-foreground">123</code></li>
              <li>• Director Finanzas: <code className="text-foreground">dir.finanzas</code> / <code className="text-foreground">123</code></li>
              <li>• Director Comercial: <code className="text-foreground">dir.comercial</code> / <code className="text-foreground">123</code></li>
              
              {/* Nivel 3: Jefes y Soporte Administrativo */}
              <li>• Jefe Oficina Técnica: <code className="text-foreground">jefe.tecnica</code> / <code className="text-foreground">123</code></li>
              <li>• Jefe de Logística: <code className="text-foreground">jefe.logistica</code> / <code className="text-foreground">123</code> (Compras)</li>
              <li>• RRHH: <code className="text-foreground">rrhh.lucia</code> / <code className="text-foreground">123</code></li>
              <li>• Asistente Adm: <code className="text-foreground">asist.sara</code> / <code className="text-foreground">123</code></li>
              
              {/* Nivel 4: Supervisión de Campo */}
              <li>• Jefe de Obra: <code className="text-foreground">jefe.juan</code> / <code className="text-foreground">123</code></li>
              <li>• Maestro de Obra: <code className="text-foreground">maestro.elena</code> / <code className="text-foreground">123</code></li>

              {/* Nivel 5: Roles Operativos */}
              <li>• Bodeguero: <code className="text-foreground">bodega.pedro</code> / <code className="text-foreground">123</code></li>
              <li>• Operativo (Albañil): <code className="text-foreground">david.p</code> / <code className="text-foreground">123</code></li>
              <li>• Operador Maquinaria: <code className="text-foreground">op.ernesto</code> / <code className="text-foreground">123</code></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;