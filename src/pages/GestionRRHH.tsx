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
// CORRECCIÓN: Importar Empleado desde models.ts
import { Empleado } from '@/data/models';
// CORRECCIÓN: Importar mocks y helpers desde mockData.ts
import { mockEmpleados, updateEmpleados, mockProyectos } from '@/data/mockData';
// ====================================================================
import { Plus, Pencil, Trash2, Search, Users } from 'lucide-react';
import { toast } from 'sonner';

const GestionRRHH = () => {
  const [empleados, setEmpleados] = useState(mockEmpleados);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState<Empleado | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    puesto: '',
    proyectoAsignadoId: '',
    salario: '',
  });

  const filteredEmpleados = empleados.filter(e => 
    e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.puesto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalNomina = empleados.reduce((sum, e) => sum + e.salario, 0);

  const resetForm = () => {
    setFormData({
      nombre: '',
      puesto: '',
      proyectoAsignadoId: '',
      salario: '',
    });
  };

  const handleCreate = () => {
    if (!formData.nombre || !formData.puesto || !formData.proyectoAsignadoId || !formData.salario) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    const newEmpleado: Empleado = {
      id: Math.max(...empleados.map(e => e.id)) + 1,
      nombre: formData.nombre,
      puesto: formData.puesto,
      proyectoAsignadoId: parseInt(formData.proyectoAsignadoId),
      salario: parseFloat(formData.salario),
    };

    const newEmpleados = [...empleados, newEmpleado];
    setEmpleados(newEmpleados);
    updateEmpleados(newEmpleados);
    setIsCreateOpen(false);
    resetForm();
    toast.success('Empleado agregado exitosamente');
  };

  const handleEdit = (empleado: Empleado) => {
    setEditingEmpleado(empleado);
    setFormData({
      nombre: empleado.nombre,
      puesto: empleado.puesto,
      proyectoAsignadoId: empleado.proyectoAsignadoId.toString(),
      salario: empleado.salario.toString(),
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!editingEmpleado || !formData.nombre || !formData.puesto || !formData.proyectoAsignadoId || !formData.salario) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    const updatedEmpleados = empleados.map(e =>
      e.id === editingEmpleado.id
        ? {
            ...e,
            nombre: formData.nombre,
            puesto: formData.puesto,
            proyectoAsignadoId: parseInt(formData.proyectoAsignadoId),
            salario: parseFloat(formData.salario),
          }
        : e
    );

    setEmpleados(updatedEmpleados);
    updateEmpleados(updatedEmpleados);
    setIsEditOpen(false);
    setEditingEmpleado(null);
    resetForm();
    toast.success('Empleado actualizado exitosamente');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este empleado?')) {
      const newEmpleados = empleados.filter(e => e.id !== id);
      setEmpleados(newEmpleados);
      updateEmpleados(newEmpleados);
      toast.success('Empleado eliminado exitosamente');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Gestión de Recursos Humanos</h1>
            <p className="text-muted-foreground">Administre el personal de la empresa</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Empleado
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Empleado</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre Completo</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej: Juan Pérez"
                  />
                </div>
                <div>
                  <Label htmlFor="puesto">Puesto</Label>
                  <Input
                    id="puesto"
                    value={formData.puesto}
                    onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
                    placeholder="Ej: Albañil, Electricista, Operador"
                  />
                </div>
                <div>
                  <Label htmlFor="proyecto">Proyecto Asignado</Label>
                  <Select value={formData.proyectoAsignadoId} onValueChange={(value) => setFormData({ ...formData, proyectoAsignadoId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un proyecto" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProyectos.map(p => (
                        <SelectItem key={p.id} value={p.id.toString()}>{p.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="salario">Salario Mensual ($)</Label>
                  <Input
                    id="salario"
                    type="number"
                    value={formData.salario}
                    onChange={(e) => setFormData({ ...formData, salario: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreate}>Agregar Empleado</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* KPIs RRHH */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Total Empleados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{empleados.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Nómina Total Mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">${totalNomina.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Empleados</CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o puesto..."
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
                    <TableHead>Nombre</TableHead>
                    <TableHead>Puesto</TableHead>
                    <TableHead>Proyecto Asignado</TableHead>
                    <TableHead className="text-right">Salario</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmpleados.map((empleado) => (
                    <TableRow key={empleado.id}>
                      <TableCell className="font-medium">{empleado.nombre}</TableCell>
                      <TableCell>{empleado.puesto}</TableCell>
                      <TableCell>
                        {mockProyectos.find(p => p.id === empleado.proyectoAsignadoId)?.nombre}
                      </TableCell>
                      <TableCell className="text-right font-bold">${empleado.salario.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(empleado)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(empleado.id)}
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
              <DialogTitle>Editar Empleado</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-nombre">Nombre Completo</Label>
                <Input
                  id="edit-nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-puesto">Puesto</Label>
                <Input
                  id="edit-puesto"
                  value={formData.puesto}
                  onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-proyecto">Proyecto Asignado</Label>
                <Select value={formData.proyectoAsignadoId} onValueChange={(value) => setFormData({ ...formData, proyectoAsignadoId: value })}>
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
                <Label htmlFor="edit-salario">Salario Mensual ($)</Label>
                <Input
                  id="edit-salario"
                  type="number"
                  value={formData.salario}
                  onChange={(e) => setFormData({ ...formData, salario: e.target.value })}
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

export default GestionRRHH;