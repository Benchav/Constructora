import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  Users, 
  AlertCircle, 
  TrendingUp,
  DollarSign,
  Package
} from 'lucide-react';
import { 
  mockProyectos, 
  mockEmpleados, 
  mockSolicitudesDinero, 
  mockSolicitudesMateriales,
  mockFinanzas
} from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const Dashboard = () => {
  const proyectosActivos = mockProyectos.filter(p => p.estado === 'En Curso').length;
  const totalEmpleados = mockEmpleados.length;
  const solicitudesDineroPendientes = mockSolicitudesDinero.filter(s => s.estado === 'Pendiente').length;
  const solicitudesMaterialesPendientes = mockSolicitudesMateriales.filter(s => s.estado === 'Pendiente').length;

  // Rentabilidad por proyecto
  const rentabilidadData = mockProyectos.map(proyecto => {
    const ingresos = mockFinanzas
      .filter(f => f.proyectoId === proyecto.id && f.tipo === 'Ingreso')
      .reduce((sum, f) => sum + f.monto, 0);
    const costos = mockFinanzas
      .filter(f => f.proyectoId === proyecto.id && f.tipo === 'Costo')
      .reduce((sum, f) => sum + f.monto, 0);
    return {
      nombre: proyecto.nombre,
      rentabilidad: ingresos - costos,
    };
  });

  // Distribución de empleados por proyecto
  const distribucionEmpleados = mockProyectos.map(proyecto => ({
    name: proyecto.nombre,
    value: mockEmpleados.filter(e => e.proyectoAsignadoId === proyecto.id).length
  }));

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

  // Flujo de caja simulado
  const flujoCaja = [
    { mes: 'Ago', ingresos: 120000, costos: 85000 },
    { mes: 'Sep', ingresos: 135000, costos: 92000 },
    { mes: 'Oct', ingresos: 150000, costos: 98000 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard General</h1>
          <p className="text-muted-foreground">Centro de comando ejecutivo</p>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Proyectos Activos
              </CardTitle>
              <Building2 className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{proyectosActivos}</div>
              <p className="text-xs text-success mt-1">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                En desarrollo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Empleados Totales
              </CardTitle>
              <Users className="h-5 w-5 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalEmpleados}</div>
              <p className="text-xs text-muted-foreground mt-1">Activos en proyectos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Solicitudes Dinero
              </CardTitle>
              <DollarSign className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{solicitudesDineroPendientes}</div>
              <p className="text-xs text-warning mt-1">
                <AlertCircle className="inline h-3 w-3 mr-1" />
                Pendientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Solicitudes Materiales
              </CardTitle>
              <Package className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{solicitudesMaterialesPendientes}</div>
              <p className="text-xs text-warning mt-1">
                <AlertCircle className="inline h-3 w-3 mr-1" />
                Pendientes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Rentabilidad por Proyecto</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={rentabilidadData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="nombre" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="rentabilidad" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribución de Empleados</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distribucionEmpleados}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {distribucionEmpleados.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Flujo de Caja */}
        <Card>
          <CardHeader>
            <CardTitle>Flujo de Caja Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={flujoCaja}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ingresos" stroke="hsl(var(--success))" strokeWidth={2} />
                <Line type="monotone" dataKey="costos" stroke="hsl(var(--destructive))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Solicitudes Críticas */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes Críticas Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Solicitudes de Dinero</h4>
                <div className="space-y-2">
                  {mockSolicitudesDinero.filter(s => s.estado === 'Pendiente').map(sol => (
                    <div key={sol.id} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{sol.motivo}</p>
                        <p className="text-xs text-muted-foreground">{sol.solicitante}</p>
                      </div>
                      <span className="font-bold text-warning">${sol.monto.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Solicitudes de Materiales</h4>
                <div className="space-y-2">
                  {mockSolicitudesMateriales.filter(s => s.estado === 'Pendiente').map(sol => (
                    <div key={sol.id} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{sol.item}</p>
                        <p className="text-xs text-muted-foreground">{sol.solicitante}</p>
                      </div>
                      <span className="font-bold text-accent">{sol.cantidad} unidades</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
