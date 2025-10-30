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
import { mockInspeccionesCalidad, updateInspeccionesCalidad, InspeccionCalidad, mockProyectos } from '@/data/mockData';
import { Plus, Pencil, Trash2, Search, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const getProjectName = (proyectoId: number) => 
  mockProyectos.find(p => p.id === proyectoId)?.nombre || 'N/A';

const GestionCalidad = () => {
  const [inspecciones, setInspecciones] = useState(mockInspeccionesCalidad);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingInspeccion, setEditingInspeccion] = useState<InspeccionCalidad | null>(null);
  const [formData, setFormData] = useState({
    proyectoId: '',
    fecha: new Date().toISOString().split('T')[0],
    fase: '',
    resultado: 'Aprobado',
    observaciones: '',
  });

  const filteredInspecciones = inspecciones.filter(i => 
    i.fase.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.observaciones.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getProjectName(i.proyectoId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      proyectoId: '',
      fecha: new Date().toISOString().split('T')[0],
      fase: '',
      resultado: 'Aprobado',
      observaciones: '',
    });
  };

  const handleCreateOpenChange = (open: boolean) => {
    if (open) resetForm();
    setIsCreateOpen(open);
  };

  const handleEditOpenChange = (open: boolean) => {
    if (!open) { setEditingInspeccion(null); resetForm(); }
    setIsEditOpen(open);
  };

  const handleCreate = () => {
    if (!formData.proyectoId || !formData.fase || !formData.observaciones) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    const newInspeccion: InspeccionCalidad = {
      id: 'ic' + (Math.max(...inspecciones.map(i => parseInt(i.id.substring(2)) || 0)) + 1),
      proyectoId: parseInt(formData.proyectoId),
      fecha: formData.fecha,
      fase: formData.fase,
      resultado: formData.resultado as InspeccionCalidad["resultado"],
      observaciones: formData.observaciones,
    };

    const newInspecciones = [...inspecciones, newInspeccion];
    setInspecciones(newInspecciones);
    updateInspeccionesCalidad(newInspecciones);
    handleCreateOpenChange(false);
    toast.success('Inspección de Calidad registrada exitosamente');
  };

  const handleEdit = (inspeccion: InspeccionCalidad) => {
    setEditingInspeccion(inspeccion);
    setFormData({
      proyectoId: inspeccion.proyectoId.toString(),
      fecha: inspeccion.fecha,
      fase: inspeccion.fase,
      resultado: inspeccion.resultado,
      observaciones: inspeccion.observaciones,
    });
    handleEditOpenChange(true);
  };

  const handleUpdate = () => {
    if (!editingInspeccion || !formData.proyectoId || !formData.fase || !formData.observaciones) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    const updatedInspecciones = inspecciones.map(i =>
      i.id === editingInspeccion.id
        ? {
            ...i,
            proyectoId: parseInt(formData.proyectoId),
            fecha: formData.fecha,
            fase: formData.fase,
            resultado: formData.resultado as InspeccionCalidad["resultado"],
            observaciones: formData.observaciones,
          }
        : i
    );

    setInspecciones(updatedInspecciones);
    updateInspeccionesCalidad(updatedInspecciones);
    handleEditOpenChange(false);
    toast.success('Inspección de Calidad actualizada exitosamente');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta Inspección de Calidad?')) {
      const newInspecciones = inspecciones.filter(i => i.id !== id);
      setInspecciones(newInspecciones);
      updateInspeccionesCalidad(newInspecciones);
      toast.success('Inspección de Calidad eliminada exitosamente');
    }
  };

  const resultadosCriticos = inspecciones.filter(i => i.resultado !== 'Aprobado').length;
  const totalAprobadas = inspecciones.filter(i => i.resultado === 'Aprobado').length;

  const renderResultadoBadge = (resultado: InspeccionCalidad['resultado']) => {
    let variant: 'default' | 'destructive' | 'outline' = 'outline';
    let className = '';

    switch (resultado) {
      case 'Aprobado':
        variant = 'default';
        className = 'bg-success text-success-foreground';
        break;
      case 'Con Observaciones':
        variant = 'default';
        className = 'bg-warning text-warning-foreground';
        break;
      case 'Rechazado':
        variant = 'destructive';
        break;
    }
    return <Badge variant={variant} className={className}>{resultado}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Control de Calidad en Obra</h1>
            <p className="text-muted-foreground">Registro y seguimiento de inspecciones de fases constructivas</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={handleCreateOpenChange}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nueva Inspección
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Nueva Inspección</DialogTitle>
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
                <div>
                  <Label htmlFor="fase">Fase de Inspección</Label>
                  <Input
                    id="fase"
                    value={formData.fase}
                    onChange={(e) => setFormData({ ...formData, fase: e.target.value })}
                    placeholder="Ej: Fundición de Losa Nivel 2"
                  />
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
                        <Label htmlFor="resultado">Resultado</Label>
                        <Select value={formData.resultado} onValueChange={(value) => setFormData({ ...formData, resultado: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Aprobado">Aprobado</SelectItem>
                                <SelectItem value="Con Observaciones">Con Observaciones</SelectItem>
                                <SelectItem value="Rechazado">Rechazado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div>
                  <Label htmlFor="observaciones">Observaciones / Detalles</Label>
                  <Textarea
                    id="observaciones"
                    value={formData.observaciones}
                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                    placeholder="Describa los hallazgos y el cumplimiento de especificaciones."
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => handleCreateOpenChange(false)}>Cancelar</Button>
                <Button onClick={handleCreate}>Registrar Inspección</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                Total Aprobadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-success">{totalAprobadas}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Observaciones/Rechazos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">{resultadosCriticos}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Historial de Inspecciones</CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por fase o proyecto..."
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
                    <TableHead>Fase</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead className='w-1/3'>Observaciones</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInspecciones.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell>{i.fecha}</TableCell>
                      <TableCell>{getProjectName(i.proyectoId)}</TableCell>
                      <TableCell className="font-medium">{i.fase}</TableCell>
                      <TableCell>{renderResultadoBadge(i.resultado)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{i.observaciones}</TableCell>
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
              <DialogTitle>Editar Inspección</DialogTitle>
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
                <div>
                  <Label htmlFor="edit-fase">Fase de Inspección</Label>
                  <Input
                    id="edit-fase"
                    value={formData.fase}
                    onChange={(e) => setFormData({ ...formData, fase: e.target.value })}
                  />
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
                        <Label htmlFor="edit-resultado">Resultado</Label>
                        <Select value={formData.resultado} onValueChange={(value) => setFormData({ ...formData, resultado: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Aprobado">Aprobado</SelectItem>
                                <SelectItem value="Con Observaciones">Con Observaciones</SelectItem>
                                <SelectItem value="Rechazado">Rechazado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div>
                  <Label htmlFor="edit-observaciones">Observaciones / Detalles</Label>
                  <Textarea
                    id="edit-observaciones"
                    value={formData.observaciones}
                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
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

export default GestionCalidad;