import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  mockSolicitudesMateriales, 
  mockSolicitudesDinero, 
  updateSolicitudesMateriales,
  updateSolicitudesDinero,
  mockProyectos
} from '@/data/mockData';
import { CheckCircle, XCircle, Clock, Package, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const Solicitudes = () => {
  const [solicitudesMateriales, setSolicitudesMateriales] = useState(mockSolicitudesMateriales);
  const [solicitudesDinero, setSolicitudesDinero] = useState(mockSolicitudesDinero);

  const handleApprobarMaterial = (id: string) => {
    const updated = solicitudesMateriales.map(s => 
      s.id === id ? { ...s, estado: 'Aprobada' as const } : s
    );
    setSolicitudesMateriales(updated);
    updateSolicitudesMateriales(updated);
    toast.success('Solicitud de material aprobada');
  };

  const handleRechazarMaterial = (id: string) => {
    const updated = solicitudesMateriales.map(s => 
      s.id === id ? { ...s, estado: 'Rechazada' as const } : s
    );
    setSolicitudesMateriales(updated);
    updateSolicitudesMateriales(updated);
    toast.success('Solicitud de material rechazada');
  };

  const handleApprobarDinero = (id: string) => {
    const updated = solicitudesDinero.map(s => 
      s.id === id ? { ...s, estado: 'Aprobada' as const } : s
    );
    setSolicitudesDinero(updated);
    updateSolicitudesDinero(updated);
    toast.success('Solicitud de dinero aprobada');
  };

  const handleRechazarDinero = (id: string) => {
    const updated = solicitudesDinero.map(s => 
      s.id === id ? { ...s, estado: 'Rechazada' as const } : s
    );
    setSolicitudesDinero(updated);
    updateSolicitudesDinero(updated);
    toast.success('Solicitud de dinero rechazada');
  };

  const materialesPendientes = solicitudesMateriales.filter(s => s.estado === 'Pendiente').length;
  const dineroPendiente = solicitudesDinero.filter(s => s.estado === 'Pendiente').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestión de Solicitudes</h1>
          <p className="text-muted-foreground">Apruebe o rechace solicitudes de materiales y dinero</p>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Package className="h-4 w-4 text-accent" />
                Solicitudes de Materiales Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-warning">{materialesPendientes}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-success" />
                Solicitudes de Dinero Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-warning">{dineroPendiente}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="materiales">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="materiales" className="gap-2">
              <Package className="h-4 w-4" />
              Materiales
              {materialesPendientes > 0 && (
                <Badge variant="destructive" className="ml-2">{materialesPendientes}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="dinero" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Dinero
              {dineroPendiente > 0 && (
                <Badge variant="destructive" className="ml-2">{dineroPendiente}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="materiales" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Solicitudes de Materiales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Proyecto</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Solicitante</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {solicitudesMateriales.map((solicitud) => (
                        <TableRow key={solicitud.id}>
                          <TableCell>{solicitud.fecha || '-'}</TableCell>
                          <TableCell>
                            {mockProyectos.find(p => p.id === solicitud.proyectoId)?.nombre}
                          </TableCell>
                          <TableCell className="font-medium">{solicitud.item}</TableCell>
                          <TableCell className="font-bold">{solicitud.cantidad}</TableCell>
                          <TableCell>{solicitud.solicitante}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                solicitud.estado === 'Pendiente' ? 'default' : 
                                solicitud.estado === 'Aprobada' ? 'secondary' : 'destructive'
                              }
                              className={
                                solicitud.estado === 'Pendiente' ? 'bg-warning' :
                                solicitud.estado === 'Aprobada' ? 'bg-success' : ''
                              }
                            >
                              {solicitud.estado === 'Pendiente' && <Clock className="h-3 w-3 mr-1" />}
                              {solicitud.estado === 'Aprobada' && <CheckCircle className="h-3 w-3 mr-1" />}
                              {solicitud.estado === 'Rechazada' && <XCircle className="h-3 w-3 mr-1" />}
                              {solicitud.estado}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {solicitud.estado === 'Pendiente' && (
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1"
                                  onClick={() => handleApprobarMaterial(solicitud.id)}
                                >
                                  <CheckCircle className="h-3 w-3" />
                                  Aprobar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="gap-1"
                                  onClick={() => handleRechazarMaterial(solicitud.id)}
                                >
                                  <XCircle className="h-3 w-3" />
                                  Rechazar
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dinero" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Solicitudes de Dinero</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Proyecto</TableHead>
                        <TableHead>Motivo</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Solicitante</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {solicitudesDinero.map((solicitud) => (
                        <TableRow key={solicitud.id}>
                          <TableCell>{solicitud.fecha || '-'}</TableCell>
                          <TableCell>
                            {mockProyectos.find(p => p.id === solicitud.proyectoId)?.nombre}
                          </TableCell>
                          <TableCell className="font-medium">{solicitud.motivo}</TableCell>
                          <TableCell className="font-bold text-success">
                            ${solicitud.monto.toLocaleString()}
                          </TableCell>
                          <TableCell>{solicitud.solicitante}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                solicitud.estado === 'Pendiente' ? 'default' : 
                                solicitud.estado === 'Aprobada' ? 'secondary' : 'destructive'
                              }
                              className={
                                solicitud.estado === 'Pendiente' ? 'bg-warning' :
                                solicitud.estado === 'Aprobada' ? 'bg-success' : ''
                              }
                            >
                              {solicitud.estado === 'Pendiente' && <Clock className="h-3 w-3 mr-1" />}
                              {solicitud.estado === 'Aprobada' && <CheckCircle className="h-3 w-3 mr-1" />}
                              {solicitud.estado === 'Rechazada' && <XCircle className="h-3 w-3 mr-1" />}
                              {solicitud.estado}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {solicitud.estado === 'Pendiente' && (
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1"
                                  onClick={() => handleApprobarDinero(solicitud.id)}
                                >
                                  <CheckCircle className="h-3 w-3" />
                                  Aprobar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="gap-1"
                                  onClick={() => handleRechazarDinero(solicitud.id)}
                                >
                                  <XCircle className="h-3 w-3" />
                                  Rechazar
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Solicitudes;
