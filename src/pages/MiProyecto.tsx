import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { mockProyectos, mockInventarioObra, mockEmpleados, mockPlanos } from '@/data/mockData';
import { MapPin, Users, Package, FileText, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const MiProyecto = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const proyectoId = user?.proyectoAsignadoId;
  
  const proyecto = mockProyectos.find(p => p.id === proyectoId);
  const inventarioProyecto = mockInventarioObra.filter(i => i.proyectoId === proyectoId);
  const empleadosProyecto = mockEmpleados.filter(e => e.proyectoAsignadoId === proyectoId);
  const planosProyecto = mockPlanos.filter(p => p.proyectoId === proyectoId);

  if (!proyecto) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground mb-2">No tiene proyecto asignado</h2>
          <p className="text-muted-foreground">Contacte al administrador para que le asigne un proyecto</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header del Proyecto */}
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{proyecto.nombre}</h1>
                <Badge variant={proyecto.estado === 'En Curso' ? 'default' : 'secondary'}>
                  {proyecto.estado}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{proyecto.ubicacion}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Avance</p>
                <p className="text-2xl font-bold text-primary">{proyecto.avance}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Presupuesto</p>
                <p className="text-2xl font-bold text-foreground">
                  ${(proyecto.presupuesto / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          </div>
          <Progress value={proyecto.avance} className="mt-4 h-3" />
        </div>

        {/* Resumen de Recursos */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Personal Asignado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{empleadosProyecto.length}</p>
              <p className="text-xs text-muted-foreground mt-1">empleados activos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Package className="h-4 w-4 text-accent" />
                Items en Inventario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{inventarioProyecto.length}</p>
              <p className="text-xs text-muted-foreground mt-1">tipos de materiales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-chart-3" />
                Planos Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{planosProyecto.length}</p>
              <p className="text-xs text-muted-foreground mt-1">documentos técnicos</p>
            </CardContent>
          </Card>
        </div>

        {/* Accesos Rápidos */}
        <Card>
          <CardHeader>
            <CardTitle>Accesos Rápidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => navigate('/inventario')}
              >
                <Package className="h-6 w-6 text-accent" />
                <span className="font-semibold">Inventario</span>
                <span className="text-xs text-muted-foreground">Gestionar materiales</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => navigate('/planos')}
              >
                <FileText className="h-6 w-6 text-primary" />
                <span className="font-semibold">Planos</span>
                <span className="text-xs text-muted-foreground">Ver documentación</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => navigate('/reportes')}
              >
                <TrendingUp className="h-6 w-6 text-success" />
                <span className="font-semibold">Reportes</span>
                <span className="text-xs text-muted-foreground">Registrar avances</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => navigate(`/proyecto/${proyectoId}`)}
              >
                <MapPin className="h-6 w-6 text-chart-4" />
                <span className="font-semibold">Ver Detalles</span>
                <span className="text-xs text-muted-foreground">Información completa</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Personal del Proyecto */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Asignado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {empleadosProyecto.map((empleado) => (
                <div key={empleado.id} className="p-4 bg-secondary rounded-lg">
                  <p className="font-semibold">{empleado.nombre}</p>
                  <p className="text-sm text-muted-foreground">{empleado.puesto}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MiProyecto;
