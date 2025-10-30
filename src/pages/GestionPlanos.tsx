// Copiar y pegar todo el contenido
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
// CORRECCIÓN: Importar Plano desde models.ts
import { Plano } from '@/data/models';
// CORRECCIÓN: Importar mocks y helpers desde mockData.ts
import { mockPlanos, updatePlanos, mockProyectos } from '@/data/mockData';
// ====================================================================
import { Plus, Pencil, Trash2, Search, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const GestionPlanos = () => {
  const [planos, setPlanos] = useState(mockPlanos);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPlano, setEditingPlano] = useState<Plano | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    proyectoId: '',
    categoria: '',
    fecha: new Date().toISOString().split('T')[0],
  });

  const filteredPlanos = planos.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categorias = ['Estructural', 'Arquitectónico', 'Electricidad', 'Hidráulico', 'Mecánico', 'Sanitario'];

  const resetForm = () => {
    setFormData({
      nombre: '',
      proyectoId: '',
      categoria: '',
      fecha: new Date().toISOString().split('T')[0],
    });
  };

  const handleCreate = () => {
    if (!formData.nombre || !formData.proyectoId || !formData.categoria) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    const newPlano: Plano = {
      id: 'p' + (Math.max(...planos.map(p => parseInt(p.id.substring(1)))) + 1),
      nombre: formData.nombre,
      proyectoId: parseInt(formData.proyectoId),
      categoria: formData.categoria,
      fecha: formData.fecha,
    };

    const newPlanos = [...planos, newPlano];
    setPlanos(newPlanos);
    updatePlanos(newPlanos);
    setIsCreateOpen(false);
    resetForm();
    toast.success('Plano registrado exitosamente');
  };

  const handleEdit = (plano: Plano) => {
    setEditingPlano(plano);
    setFormData({
      nombre: plano.nombre,
      proyectoId: plano.proyectoId.toString(),
      categoria: plano.categoria,
      fecha: plano.fecha || new Date().toISOString().split('T')[0],
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!editingPlano || !formData.nombre || !formData.proyectoId || !formData.categoria) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    const updatedPlanos = planos.map(p =>
      p.id === editingPlano.id
        ? {
            ...p,
            nombre: formData.nombre,
            proyectoId: parseInt(formData.proyectoId),
            categoria: formData.categoria,
            fecha: formData.fecha,
          }
        : p
    );

    setPlanos(updatedPlanos);
    updatePlanos(updatedPlanos);
    setIsEditOpen(false);
    setEditingPlano(null);
    resetForm();
    toast.success('Plano actualizado exitosamente');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este plano?')) {
      const newPlanos = planos.filter(p => p.id !== id);
      setPlanos(newPlanos);
      updatePlanos(newPlanos);
      toast.success('Plano eliminado exitosamente');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Gestión de Planos</h1>
            <p className="text-muted-foreground">Administre la documentación técnica de proyectos</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Plano
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Plano</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre del Archivo</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej: Plano Estructural P1.pdf"
                  />
                </div>
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
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
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

        <Card>
          <CardHeader>
            <CardTitle>Biblioteca de Planos</CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPlanos.map((plano) => (
                <Card key={plano.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{plano.nombre}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {mockProyectos.find(p => p.id === plano.proyectoId)?.nombre}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{plano.categoria}</Badge>
                          <span className="text-xs text-muted-foreground">{plano.fecha}</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(plano)}
                            className="flex-1"
                          >
                            <Pencil className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(plano.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Plano</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-nombre">Nombre del Archivo</Label>
                <Input
                  id="edit-nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>
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
                <Label htmlFor="edit-categoria">Categoría</Label>
                <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-fecha">Fecha</Label>
                <Input
                  id="edit-fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
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

export default GestionPlanos;