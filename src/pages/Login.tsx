import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = login(username, password);
    if (success) {
      navigate('/dashboard');
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

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-xs font-semibold mb-2 text-muted-foreground">Usuarios de prueba:</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• CEO: <code className="text-foreground">ceo</code> / <code className="text-foreground">123</code></li>
              <li>• Jefe de Obra: <code className="text-foreground">jefe.juan</code> / <code className="text-foreground">123</code></li>
              <li>• Bodeguero: <code className="text-foreground">bodega.pedro</code> / <code className="text-foreground">123</code></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
