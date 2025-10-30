// Copiar y pegar todo el contenido
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
// CORRECCIÓN: Importar Licitacion desde models.ts
import { Licitacion } from '@/data/models';
// CORRECCIÓN: Importar mocks y helpers desde mockData.ts
import { mockLicitaciones, updateLicitaciones } from '@/data/mockData';
// ====================================================================
import { Plus, Pencil, Trash2, Search, Briefcase, Trophy, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const GestionLicitaciones = () => {
  const [licitaciones, setLicitaciones] = useState(mockLicitaciones);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingLicitacion, setEditingLicitacion] = useState<Licitacion | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    estado: '',
    monto: '',
    fechaLimite: '',
  });

  const filteredLicitaciones = licitaciones.filter(l => 
    l.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ganadas = licitaciones.filter(l => l.estado === 'Ganada').length;
  const presentadas = licitaciones.filter(l => l.estado === 'Presentada').length;
  const enPreparacion = licitaciones.filter(l => l.estado === 'En Preparacion').length;

  const resetForm = () => {
    setFormData({
      nombre: '',
      estado: '',
      monto: '',
      fechaLimite: '',
    });
  };

  const handleCreate = () => {
    if (!formData.nombre || !formData.estado || !formData.monto) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    const newLicitacion: Licitacion = {
      id: 'l' + (Math.max(...licitaciones.map(l => parseInt(l.id.substring(1)))) + 1),
      nombre: formData.nombre,
      // Se utiliza aserción de tipo ya que el valor viene de un string del Select
      estado: formData.estado as Licitacion["estado"],
      monto: parseFloat(formData.monto),
      fechaLimite: formData.fechaLimite || undefined,
    };

    const newLicitaciones = [...licitaciones, newLicitacion];
    setLicitaciones(newLicitaciones);
    updateLicitaciones(newLicitaciones);
    setIsCreateOpen(false);
    resetForm();
    toast.success('Licitación registrada exitosamente');
  };

  const handleEdit = (licitacion: Licitacion) => {
    setEditingLicitacion(licitacion);
    setFormData({
      nombre: licitacion.nombre,
      estado: licitacion.estado,
      monto: licitacion.monto.toString(),
      fechaLimite: licitacion.fechaLimite || '',
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!editingLicitacion || !formData.nombre || !formData.estado || !formData.monto) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    const updatedLicitaciones = licitaciones.map(l =>
      l.id === editingLicitacion.id
        ? {
            ...l,
            nombre: formData.nombre,
            estado: formData.estado as Licitacion["estado"],
            monto: parseFloat(formData.monto),
            fechaLimite: formData.fechaLimite || undefined,
          }
        : l
    );

    setLicitaciones(updatedLicitaciones);
    updateLicitaciones(updatedLicitaciones);
    setIsEditOpen(false);
    setEditingLicitacion(null);
    resetForm();
    toast.success('Licitación actualizada exitosamente');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta licitación?')) {
      const newLicitaciones = licitaciones.filter(l => l.id !== id);
      setLicitaciones(newLicitaciones);
      updateLicitaciones(newLicitaciones);
      toast.success('Licitación eliminada exitosamente');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Gestión de Licitaciones</h1>
            <p className="text-muted-foreground">Seguimiento de licitaciones y propuestas comerciales</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nueva Licitación
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Nueva Licitación</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre del Proyecto</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej: Hospital Regional"
                  />
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="En Preparacion">En Preparación</SelectItem>
                      <SelectItem value="Presentada">Presentada</SelectItem>
                      <SelectItem value="Ganada">Ganada</SelectItem>
                      <SelectItem value="Perdida">Perdida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="monto">Monto de la Propuesta ($)</Label>
                  <Input
                    id="monto"
                    type="number"
                    value={formData.monto}
                    onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="fechaLimite">Fecha Límite (Opcional)</Label>
                  <Input
                    id="fechaLimite"
                    type="date"
                    value={formData.fechaLimite}
                    onChange={(e) => setFormData({ ...formData, fechaLimite: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreate}>Registrar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* KPIs Licitaciones */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Trophy className="h-4 w-4 text-success" />
                Ganadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-success">{ganadas}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                Presentadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{presentadas}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-warning" />
                En Preparación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-warning">{enPreparacion}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Licitaciones</CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar licitación..."
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
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Monto Propuesta</TableHead>
                    <TableHead>Fecha Límite</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLicitaciones.map((licitacion) => (
                    <TableRow key={licitacion.id}>
                      <TableCell className="font-medium">{licitacion.nombre}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            licitacion.estado === 'Ganada' ? 'default' : 
                            licitacion.estado === 'Presentada' ? 'secondary' : 
                            'outline'
                          }
                          className={
                            licitacion.estado === 'Ganada' ? 'bg-success' : 
                            licitacion.estado === 'Presentada' ? 'bg-primary' : 
                            ''
                          }
                        >
                          {licitacion.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold">${licitacion.monto.toLocaleString()}</TableCell>
                      <TableCell>{licitacion.fechaLimite || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(licitacion)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(licitacion.id)}
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

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Licitación</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-nombre">Nombre del Proyecto</Label>
                <Input
                  id="edit-nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-estado">Estado</Label>
                <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="En Preparacion">En Preparación</SelectItem>
                    <SelectItem value="Presentada">Presentada</SelectItem>
                    <SelectItem value="Ganada">Ganada</SelectItem>
                    <SelectItem value="Perdida">Perdida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-monto">Monto de la Propuesta ($)</Label>
                <Input
                  id="edit-monto"
                  type="number"
                  value={formData.monto}
                  onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-fechaLimite">Fecha Límite</Label>
                <Input
                  id="edit-fechaLimite"
                  type="date"
                  value={formData.fechaLimite}
                  onChange={(e) => setFormData({ ...formData, fechaLimite: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
              <Button onClick={handleUpdate}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default GestionLicitaciones;