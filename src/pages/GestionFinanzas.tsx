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
// CORRECCIÓN: Importar Finanza desde models.ts
import { Finanza } from '@/data/models';
// CORRECCIÓN: Importar mocks y helpers desde mockData.ts
import { mockFinanzas, updateFinanzas, mockProyectos } from '@/data/mockData';
// ====================================================================
import { Plus, Pencil, Trash2, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const GestionFinanzas = () => {
  const [finanzas, setFinanzas] = useState(mockFinanzas);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingFinanza, setEditingFinanza] = useState<Finanza | null>(null);
  const [formData, setFormData] = useState({
    tipo: '',
    proyectoId: '',
    descripcion: '',
    monto: '',
    categoria: '',
    fecha: new Date().toISOString().split('T')[0],
  });

  const filteredFinanzas = finanzas.filter(f => 
    f.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.categoria && f.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalIngresos = finanzas.filter(f => f.tipo === 'Ingreso').reduce((sum, f) => sum + f.monto, 0);
  const totalCostos = finanzas.filter(f => f.tipo === 'Costo').reduce((sum, f) => sum + f.monto, 0);

  const resetForm = () => {
    setFormData({
      tipo: '',
      proyectoId: '',
      descripcion: '',
      monto: '',
      categoria: '',
      fecha: new Date().toISOString().split('T')[0],
    });
  };

  const handleCreate = () => {
    if (!formData.tipo || !formData.proyectoId || !formData.descripcion || !formData.monto) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    const newFinanza: Finanza = {
      id: 'f' + (Math.max(...finanzas.map(f => parseInt(f.id.substring(1)))) + 1),
      // La aserción de tipo es necesaria aquí porque el valor proviene de un string de formulario.
      tipo: formData.tipo as "Ingreso" | "Costo", 
      proyectoId: parseInt(formData.proyectoId),
      descripcion: formData.descripcion,
      monto: parseFloat(formData.monto),
      categoria: formData.categoria || undefined,
      fecha: formData.fecha,
    };

    const newFinanzas = [...finanzas, newFinanza];
    setFinanzas(newFinanzas);
    updateFinanzas(newFinanzas);
    setIsCreateOpen(false);
    resetForm();
    toast.success('Movimiento financiero registrado exitosamente');
  };

  const handleEdit = (finanza: Finanza) => {
    setEditingFinanza(finanza);
    setFormData({
      tipo: finanza.tipo,
      proyectoId: finanza.proyectoId.toString(),
      descripcion: finanza.descripcion,
      monto: finanza.monto.toString(),
      categoria: finanza.categoria || '',
      fecha: finanza.fecha || new Date().toISOString().split('T')[0],
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!editingFinanza || !formData.tipo || !formData.proyectoId || !formData.descripcion || !formData.monto) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    const updatedFinanzas = finanzas.map(f =>
      f.id === editingFinanza.id
        ? {
            ...f,
            tipo: formData.tipo as "Ingreso" | "Costo",
            proyectoId: parseInt(formData.proyectoId),
            descripcion: formData.descripcion,
            monto: parseFloat(formData.monto),
            categoria: formData.categoria || undefined,
            fecha: formData.fecha,
          }
        : f
    );

    setFinanzas(updatedFinanzas);
    updateFinanzas(updatedFinanzas);
    setIsEditOpen(false);
    setEditingFinanza(null);
    resetForm();
    toast.success('Movimiento actualizado exitosamente');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este movimiento financiero?')) {
      const newFinanzas = finanzas.filter(f => f.id !== id);
      setFinanzas(newFinanzas);
      updateFinanzas(newFinanzas);
      toast.success('Movimiento eliminado exitosamente');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Gestión Financiera</h1>
            <p className="text-muted-foreground">Control de ingresos y costos por proyecto</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Movimiento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Movimiento Financiero</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tipo">Tipo de Movimiento</Label>
                  <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ingreso">Ingreso</SelectItem>
                      <SelectItem value="Costo">Costo</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Input
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Ej: Pago de planilla quincenal"
                  />
                </div>
                <div>
                  <Label htmlFor="monto">Monto ($)</Label>
                  <Input
                    id="monto"
                    type="number"
                    value={formData.monto}
                    onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="categoria">Categoría (Opcional)</Label>
                  <Input
                    id="categoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    placeholder="Ej: Materiales, Mano de Obra, Equipo"
                  />
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

        {/* KPIs Financieros */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                Total Ingresos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-success">${totalIngresos.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-destructive" />
                Total Costos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">${totalCostos.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${totalIngresos - totalCostos >= 0 ? 'text-success' : 'text-destructive'}`}>
                ${(totalIngresos - totalCostos).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Movimientos Financieros</CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por descripción o categoría..."
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
                    <TableHead>Tipo</TableHead>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFinanzas.map((finanza) => (
                    <TableRow key={finanza.id}>
                      <TableCell>{finanza.fecha || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={finanza.tipo === 'Ingreso' ? 'default' : 'secondary'}>
                          {finanza.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>{mockProyectos.find(p => p.id === finanza.proyectoId)?.nombre}</TableCell>
                      <TableCell className="font-medium">{finanza.descripcion}</TableCell>
                      <TableCell>{finanza.categoria || '-'}</TableCell>
                      <TableCell className="text-right">
                        <span className={`font-bold ${finanza.tipo === 'Ingreso' ? 'text-success' : 'text-destructive'}`}>
                          ${finanza.monto.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(finanza)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(finanza.id)}
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
              <DialogTitle>Editar Movimiento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-tipo">Tipo de Movimiento</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ingreso">Ingreso</SelectItem>
                    <SelectItem value="Costo">Costo</SelectItem>
                  </SelectContent>
                </Select>
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
                <Label htmlFor="edit-descripcion">Descripción</Label>
                <Input
                  id="edit-descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-monto">Monto ($)</Label>
                <Input
                  id="edit-monto"
                  type="number"
                  value={formData.monto}
                  onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-categoria">Categoría</Label>
                <Input
                  id="edit-categoria"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                />
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

export default GestionFinanzas;