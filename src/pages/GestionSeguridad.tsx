// Copiar y pegar todo el contenido
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// ====================================================================
// CORRECCIÓN: Importar la interfaz desde models.ts
import { IncidenteSeguridad } from '@/data/models'; 
// CORRECCIÓN: Importar datos y helpers mutables desde mockData.ts
import { mockIncidentesSeguridad, updateIncidentesSeguridad, mockProyectos } from '@/data/mockData';
// ====================================================================
import { Plus, Pencil, Trash2, Search, Shield, AlertTriangle, User, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const getProjectName = (proyectoId: number) => 
  mockProyectos.find(p => p.id === proyectoId)?.nombre || 'N/A';

const GestionSeguridad = () => {
  const [incidentes, setIncidentes] = useState(mockIncidentesSeguridad);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingIncidente, setEditingIncidente] = useState<IncidenteSeguridad | null>(null);
  const [formData, setFormData] = useState({
    proyectoId: '',
    fecha: new Date().toISOString().split('T')[0],
    tipo: 'Incidente',
    descripcion: '',
    responsable: '',
  });

  const filteredIncidentes = incidentes.filter(i => 
    i.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.responsable.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      proyectoId: '',
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'Incidente',
      descripcion: '',
      responsable: '',
    });
  };

  const handleCreateOpenChange = (open: boolean) => {
    if (open) resetForm();
    setIsCreateOpen(open);
  };

  const handleEditOpenChange = (open: boolean) => {
    if (!open) { setEditingIncidente(null); resetForm(); }
    setIsEditOpen(open);
  };

  const handleCreate = () => {
    if (!formData.proyectoId || !formData.descripcion || !formData.responsable) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    const newIncidente: IncidenteSeguridad = {
      id: 'is' + (Math.max(...incidentes.map(i => parseInt(i.id.substring(2)) || 0)) + 1),
      proyectoId: parseInt(formData.proyectoId),
      fecha: formData.fecha,
      tipo: formData.tipo as IncidenteSeguridad["tipo"],
      descripcion: formData.descripcion,
      responsable: formData.responsable,
    };

    const newIncidentes = [...incidentes, newIncidente];
    setIncidentes(newIncidentes);
    updateIncidentesSeguridad(newIncidentes);
    handleCreateOpenChange(false);
    toast.success('Registro de Seguridad creado exitosamente');
  };

  const handleEdit = (incidente: IncidenteSeguridad) => {
    setEditingIncidente(incidente);
    setFormData({
      proyectoId: incidente.proyectoId.toString(),
      fecha: incidente.fecha,
      tipo: incidente.tipo,
      descripcion: incidente.descripcion,
      responsable: incidente.responsable,
    });
    handleEditOpenChange(true);
  };

  const handleUpdate = () => {
    if (!editingIncidente || !formData.proyectoId || !formData.descripcion || !formData.responsable) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    const updatedIncidentes = incidentes.map(i =>
      i.id === editingIncidente.id
        ? {
            ...i,
            proyectoId: parseInt(formData.proyectoId),
            fecha: formData.fecha,
            tipo: formData.tipo as IncidenteSeguridad["tipo"],
            descripcion: formData.descripcion,
            responsable: formData.responsable,
          }
        : i
    );

    setIncidentes(updatedIncidentes);
    updateIncidentesSeguridad(updatedIncidentes);
    handleEditOpenChange(false);
    toast.success('Registro de Seguridad actualizado exitosamente');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este registro de seguridad?')) {
      const newIncidentes = incidentes.filter(i => i.id !== id);
      setIncidentes(newIncidentes);
      updateIncidentesSeguridad(newIncidentes);
      toast.success('Registro de Seguridad eliminado exitosamente');
    }
  };

  const accidentesCount = incidentes.filter(i => i.tipo === 'Accidente').length;
  const inspeccionesCount = incidentes.filter(i => i.tipo === 'Inspección').length;

  const renderTipoBadge = (tipo: IncidenteSeguridad['tipo']) => {
    let variant: 'default' | 'destructive' | 'secondary' = 'secondary';
    let icon: React.ReactNode;

    switch (tipo) {
      case 'Accidente':
        variant = 'destructive';
        icon = <AlertTriangle className="h-3 w-3 mr-1" />;
        break;
      case 'Incidente':
        variant = 'default';
        icon = <AlertTriangle className="h-3 w-3 mr-1" />;
        break;
      case 'Inspección':
        variant = 'secondary';
        icon = <ClipboardList className="h-3 w-3 mr-1" />;
        break;
    }
    return <Badge variant={variant}>{icon}{tipo}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Gestión de Seguridad Ocupacional</h1>
            <p className="text-muted-foreground">Registro de incidentes, accidentes e inspecciones de seguridad</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={handleCreateOpenChange}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Registro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Evento de Seguridad</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="proyecto">Proyecto</Label>
                  <Select value={formData.proyectoId} onValueChange={(value) => setFormData({ ...formData, proyectoId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione proyecto" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProyectos.map(p => (
                        <SelectItem key={p.id} value={p.id.toString()}>{p.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="fecha">Fecha</Label>
                        <Input
                            id="fecha"
                            type="date"
                            value={formData.fecha}
                            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="tipo">Tipo de Evento</Label>
                        <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Accidente">Accidente</SelectItem>
                                <SelectItem value="Incidente">Incidente</SelectItem>
                                <SelectItem value="Inspección">Inspección</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div>
                  <Label htmlFor="responsable">Reportado / Responsable</Label>
                  <Input
                    id="responsable"
                    value={formData.responsable}
                    onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                    placeholder="Ej: Jefe de Obra Juan Pérez"
                  />
                </div>
                <div>
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Detalle del evento, causas y acciones tomadas."
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => handleCreateOpenChange(false)}>Cancelar</Button>
                <Button onClick={handleCreate}>Registrar Evento</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Total Accidentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">{accidentesCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-primary" />
                Inspecciones Registradas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{inspeccionesCount}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Historial de Eventos de Seguridad</CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por descripción o responsable..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead className='w-1/3'>Descripción</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIncidentes.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell>{i.fecha}</TableCell>
                      <TableCell>{getProjectName(i.proyectoId)}</TableCell>
                      <TableCell>{renderTipoBadge(i.tipo)}</TableCell>
                      <TableCell className="font-medium">{i.responsable}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{i.descripcion}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(i)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(i.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Modal de Edición (Repetido de Creación con ajustes) */}
        <Dialog open={isEditOpen} onOpenChange={handleEditOpenChange}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Evento de Seguridad</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                  <Label htmlFor="edit-proyecto">Proyecto</Label>
                  <Select value={formData.proyectoId} onValueChange={(value) => setFormData({ ...formData, proyectoId: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProyectos.map(p => (
                        <SelectItem key={p.id} value={p.id.toString()}>{p.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="edit-fecha">Fecha</Label>
                        <Input
                            id="edit-fecha"
                            type="date"
                            value={formData.fecha}
                            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="edit-tipo">Tipo de Evento</Label>
                        <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Accidente">Accidente</SelectItem>
                                <SelectItem value="Incidente">Incidente</SelectItem>
                                <SelectItem value="Inspección">Inspección</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div>
                  <Label htmlFor="edit-responsable">Reportado / Responsable</Label>
                  <Input
                    id="edit-responsable"
                    value={formData.responsable}
                    onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-descripcion">Descripción</Label>
                  <Textarea
                    id="edit-descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows={4}
                  />
                </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleEditOpenChange(false)}>Cancelar</Button>
              <Button onClick={handleUpdate}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default GestionSeguridad;