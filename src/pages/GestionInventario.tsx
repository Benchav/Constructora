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
// ====================================================================
// CORRECCIÓN: Importar InventarioItem desde models.ts
import { InventarioItem } from '@/data/models'; 
// CORRECCIÓN: Importar mocks y helpers desde mockData.ts
import { mockInventarioObra, updateInventario } from '@/data/mockData';
// ====================================================================
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Pencil, Trash2, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const GestionInventario = () => {
  const { user } = useAuth();
  // InventarioItem es necesaria para el useState
  const [inventario, setInventario] = useState(mockInventarioObra);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventarioItem | null>(null);
  const [formData, setFormData] = useState({
    item: '',
    unidad: '',
    stock: '',
  });

  const proyectoAsignado = user?.proyectoAsignadoId;
  const filteredInventario = (inventario || []) // Defensivo
    .filter(i => i.proyectoId === proyectoAsignado)
    .filter(i => i.item.toLowerCase().includes(searchTerm.toLowerCase()));

  const resetForm = () => {
    setFormData({
      item: '',
      unidad: '',
      stock: '',
    });
  };

  const handleCreate = () => {
    if (!formData.item || !formData.unidad || !formData.stock || !proyectoAsignado) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    const newItem: InventarioItem = {
      // Aseguramos que el ID se calcule de forma segura
      id: Math.max(...(inventario || []).map(i => i.id)) + 1, 
      item: formData.item,
      unidad: formData.unidad,
      stock: parseInt(formData.stock),
      proyectoId: proyectoAsignado,
    };

    const newInventario = [...inventario, newItem];
    setInventario(newInventario);
    updateInventario(newInventario);
    setIsCreateOpen(false);
    resetForm();
    toast.success('Item agregado exitosamente');
  };

  const handleEdit = (item: InventarioItem) => {
    setEditingItem(item);
    setFormData({
      item: item.item,
      unidad: item.unidad,
      stock: item.stock.toString(),
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!editingItem || !formData.item || !formData.unidad) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    const updatedInventario = inventario.map(i =>
      i.id === editingItem.id
        ? {
            ...i,
            item: formData.item,
            unidad: formData.unidad,
            stock: parseInt(formData.stock),
          }
        : i
    );

    setInventario(updatedInventario);
    updateInventario(updatedInventario);
    setIsEditOpen(false);
    setEditingItem(null);
    resetForm();
    toast.success('Item actualizado exitosamente');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este item del inventario?')) {
      const newInventario = inventario.filter(i => i.id !== id);
      setInventario(newInventario);
      updateInventario(newInventario);
      toast.success('Item eliminado exitosamente');
    }
  };

  const handleStockChange = (id: number, change: number) => {
    const updatedInventario = inventario.map(i =>
      i.id === id ? { ...i, stock: Math.max(0, i.stock + change) } : i
    );
    setInventario(updatedInventario);
    updateInventario(updatedInventario);
    toast.success(change > 0 ? 'Entrada registrada' : 'Salida registrada');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Gestión de Inventario</h1>
            <p className="text-muted-foreground">Administre el inventario de su obra</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="item">Nombre del Item</Label>
                  <Input
                    id="item"
                    value={formData.item}
                    onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                    placeholder="Ej: Cemento Portland"
                  />
                </div>
                <div>
                  <Label htmlFor="unidad">Unidad de Medida</Label>
                  <Input
                    id="unidad"
                    value={formData.unidad}
                    onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                    placeholder="Ej: sacos, toneladas, m³"
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock Inicial</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreate}>Agregar Item</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inventario de la Obra</CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar item..."
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
                    <TableHead>Item</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventario.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.item}</TableCell>
                      <TableCell>{item.unidad}</TableCell>
                      <TableCell className="font-bold text-lg">{item.stock}</TableCell>
                      <TableCell>
                        <Badge variant={item.stock < 20 ? 'destructive' : item.stock < 50 ? 'default' : 'secondary'}>
                          {item.stock < 20 ? 'Crítico' : item.stock < 50 ? 'Bajo' : 'Normal'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleStockChange(item.id, 10)}
                            title="Entrada +10"
                          >
                            <ArrowUp className="h-4 w-4 text-success" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleStockChange(item.id, -10)}
                            title="Salida -10"
                          >
                            <ArrowDown className="h-4 w-4 text-destructive" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
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
              <DialogTitle>Editar Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-item">Nombre del Item</Label>
                <Input
                  id="edit-item"
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-unidad">Unidad de Medida</Label>
                <Input
                  id="edit-unidad"
                  value={formData.unidad}
                  onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
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

export default GestionInventario;