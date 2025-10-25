import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useParams } from 'react-router-dom';
import { 
  mockProyectos, 
  mockFinanzas, 
  mockInventarioObra, 
  mockEmpleados,
  mockPlanos,
  mockSolicitudesMateriales,
  mockSolicitudesDinero
} from '@/data/mockData';
import { MapPin, DollarSign, Users, Package, FileText } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ProyectoDetalle = () => {
  const { id } = useParams();
  const proyectoId = parseInt(id || '0');
  const proyecto = mockProyectos.find(p => p.id === proyectoId);

  if (!proyecto) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground">Proyecto no encontrado</h2>
        </div>
      </DashboardLayout>
    );
  }

  const finanzasProyecto = mockFinanzas.filter(f => f.proyectoId === proyectoId);
  const inventarioProyecto = mockInventarioObra.filter(i => i.proyectoId === proyectoId);
  const empleadosProyecto = mockEmpleados.filter(e => e.proyectoAsignadoId === proyectoId);
  const planosProyecto = mockPlanos.filter(p => p.proyectoId === proyectoId);
  const solicitudesMaterialesProyecto = mockSolicitudesMateriales.filter(s => s.proyectoId === proyectoId);
  const solicitudesDineroProyecto = mockSolicitudesDinero.filter(s => s.proyectoId === proyectoId);

  const totalIngresos = finanzasProyecto.filter(f => f.tipo === 'Ingreso').reduce((sum, f) => sum + f.monto, 0);
  const totalCostos = finanzasProyecto.filter(f => f.tipo === 'Costo').reduce((sum, f) => sum + f.monto, 0);

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

        {/* Tabs con Información del Proyecto */}
        <Tabs defaultValue="resumen" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="finanzas">Finanzas</TabsTrigger>
            <TabsTrigger value="inventario">Inventario</TabsTrigger>
            <TabsTrigger value="rrhh">RRHH</TabsTrigger>
            <TabsTrigger value="planos">Planos</TabsTrigger>
            <TabsTrigger value="solicitudes">Solicitudes</TabsTrigger>
          </TabsList>

          <TabsContent value="resumen" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-success">
                    ${(totalIngresos - totalCostos).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Empleados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">{empleadosProyecto.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Items en Stock
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">{inventarioProyecto.length}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="finanzas" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Movimientos Financieros</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {finanzasProyecto.map((f) => (
                      <TableRow key={f.id}>
                        <TableCell>
                          <Badge variant={f.tipo === 'Ingreso' ? 'default' : 'secondary'}>
                            {f.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell>{f.descripcion}</TableCell>
                        <TableCell>{f.categoria || '-'}</TableCell>
                        <TableCell className="text-right font-bold">
                          <span className={f.tipo === 'Ingreso' ? 'text-success' : 'text-destructive'}>
                            ${f.monto.toLocaleString()}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventario" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventario del Proyecto</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Unidad</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventarioProyecto.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.item}</TableCell>
                        <TableCell>{item.unidad}</TableCell>
                        <TableCell className="text-right font-bold">{item.stock}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rrhh" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Empleados Asignados</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Puesto</TableHead>
                      <TableHead className="text-right">Salario</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {empleadosProyecto.map((emp) => (
                      <TableRow key={emp.id}>
                        <TableCell className="font-medium">{emp.nombre}</TableCell>
                        <TableCell>{emp.puesto}</TableCell>
                        <TableCell className="text-right">${emp.salario.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="planos" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Planos del Proyecto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {planosProyecto.map((plano) => (
                    <div key={plano.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{plano.nombre}</p>
                          <p className="text-sm text-muted-foreground">{plano.categoria}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{plano.fecha}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="solicitudes" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Solicitudes de Materiales</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Solicitante</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {solicitudesMaterialesProyecto.map((sol) => (
                      <TableRow key={sol.id}>
                        <TableCell className="font-medium">{sol.item}</TableCell>
                        <TableCell>{sol.cantidad}</TableCell>
                        <TableCell>{sol.solicitante}</TableCell>
                        <TableCell>
                          <Badge variant={
                            sol.estado === 'Pendiente' ? 'default' : 
                            sol.estado === 'Aprobada' ? 'default' : 'destructive'
                          }>
                            {sol.estado}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Solicitudes de Dinero</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Solicitante</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {solicitudesDineroProyecto.map((sol) => (
                      <TableRow key={sol.id}>
                        <TableCell className="font-medium">{sol.motivo}</TableCell>
                        <TableCell>${sol.monto.toLocaleString()}</TableCell>
                        <TableCell>{sol.solicitante}</TableCell>
                        <TableCell>
                          <Badge variant={
                            sol.estado === 'Pendiente' ? 'default' : 
                            sol.estado === 'Aprobada' ? 'default' : 'destructive'
                          }>
                            {sol.estado}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ProyectoDetalle;
