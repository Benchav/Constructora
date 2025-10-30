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
import { Textarea } from '@/components/ui/textarea';
import { mockOrdenesCompra, updateOrdenesCompra, OrdenCompra, mockProyectos } from '@/data/mockData';
import { Plus, Pencil, Trash2, Search, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const getProjectName = (proyectoId: number) => 
  mockProyectos.find(p => p.id === proyectoId)?.nombre || 'N/A';

const GestionCompras = () => {
  const [ordenesCompra, setOrdenesCompra] = useState(mockOrdenesCompra);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingOC, setEditingOC] = useState<OrdenCompra | null>(null);
  const [formData, setFormData] = useState({
    proyectoId: '',
    fechaPedido: new Date().toISOString().split('T')[0],
    proveedor: '',
    items: '',
    montoTotal: '',
    estado: 'Pendiente',
  });

  const filteredOC = ordenesCompra.filter(oc => 
    oc.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    oc.items.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      proyectoId: '',
      fechaPedido: new Date().toISOString().split('T')[0],
      proveedor: '',
      items: '',
      montoTotal: '',
      estado: 'Pendiente',
    });
  };
  
  const handleCreateOpenChange = (open: boolean) => {
    if (open) resetForm();
    setIsCreateOpen(open);
  };

  const handleEditOpenChange = (open: boolean) => {
    if (!open) { setEditingOC(null); resetForm(); }
    setIsEditOpen(open);
  };

  const handleCreate = () => {
    if (!formData.proyectoId || !formData.proveedor || !formData.montoTotal || !formData.items) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    const newOC: OrdenCompra = {
      id: 'oc' + (Math.max(...ordenesCompra.map(oc => parseInt(oc.id.substring(2)) || 0)) + 1),
      proyectoId: parseInt(formData.proyectoId),
      fechaPedido: formData.fechaPedido,
      proveedor: formData.proveedor,
      items: formData.items,
      montoTotal: parseFloat(formData.montoTotal),
      estado: formData.estado as OrdenCompra["estado"],
    };

    const newOCs = [...ordenesCompra, newOC];
    setOrdenesCompra(newOCs);
    updateOrdenesCompra(newOCs);
    handleCreateOpenChange(false);
    toast.success('Orden de Compra registrada exitosamente');
  };

  const handleEdit = (oc: OrdenCompra) => {
    setEditingOC(oc);
    setFormData({
      proyectoId: oc.proyectoId.toString(),
      fechaPedido: oc.fechaPedido,
      proveedor: oc.proveedor,
      items: oc.items,
      montoTotal: oc.montoTotal.toString(),
      estado: oc.estado,
    });
    handleEditOpenChange(true);
  };

  const handleUpdate = () => {
    if (!editingOC || !formData.proyectoId || !formData.proveedor || !formData.montoTotal || !formData.items) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    const updatedOCs = ordenesCompra.map(oc =>
      oc.id === editingOC.id
        ? {
            ...oc,
            proyectoId: parseInt(formData.proyectoId),
            fechaPedido: formData.fechaPedido,
            proveedor: formData.proveedor,
            items: formData.items,
            montoTotal: parseFloat(formData.montoTotal),
            estado: formData.estado as OrdenCompra["estado"],
          }
        : oc
    );

    setOrdenesCompra(updatedOCs);
    updateOrdenesCompra(updatedOCs);
    handleEditOpenChange(false);
    toast.success('Orden de Compra actualizada exitosamente');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta Orden de Compra?')) {
      const newOCs = ordenesCompra.filter(oc => oc.id !== id);
      setOrdenesCompra(newOCs);
      updateOrdenesCompra(newOCs);
      toast.success('Orden de Compra eliminada exitosamente');
    }
  };

  const ocPendientes = ordenesCompra.filter(oc => oc.estado === 'Pendiente' || oc.estado === 'Emitida').length;
  const montoTotalEmitido = ordenesCompra
    .filter(oc => oc.estado !== 'Cancelada')
    .reduce((sum, oc) => sum + oc.montoTotal, 0);


  const renderStatusBadge = (estado: OrdenCompra['estado']) => {
    let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
    let className = '';

    switch (estado) {
      case 'Emitida':
        variant = 'secondary';
        className = 'bg-primary text-primary-foreground';
        break;
      case 'Recibida':
        variant = 'default';
        className = 'bg-success text-success-foreground';
        break;
      case 'Cancelada':
        variant = 'destructive';
        break;
      case 'Pendiente':
        variant = 'default';
        className = 'bg-warning text-warning-foreground';
        break;
    }
    return <Badge variant={variant} className={className}>{estado}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Gestión de Órdenes de Compra</h1>
            <p className="text-muted-foreground">Administre el flujo de adquisición de materiales</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={handleCreateOpenChange}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nueva OC
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Nueva Orden de Compra</DialogTitle>
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
                  <Label htmlFor="proveedor">Proveedor</Label>
                  <Input
                    id="proveedor"
                    value={formData.proveedor}
                    onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                    placeholder="Ej: Ferretería Central"
                  />
                </div>
                <div>
                  <Label htmlFor="items">Resumen de Items Solicitados</Label>
                  <Textarea
                    id="items"
                    value={formData.items}
                    onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                    placeholder="Ej: 50 sacos de Cemento, 10 toneladas de Arena"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="montoTotal">Monto Total ($)</Label>
                    <Input
                      id="montoTotal"
                      type="number"
                      value={formData.montoTotal}
                      onChange={(e) => setFormData({ ...formData, montoTotal: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="Emitida">Emitida</SelectItem>
                        <SelectItem value="Recibida">Recibida</SelectItem>
                        <SelectItem value="Cancelada">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => handleCreateOpenChange(false)}>Cancelar</Button>
                <Button onClick={handleCreate}>Registrar OC</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                OC Pendientes/Emitidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-warning">{ocPendientes}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monto Total Adquisiciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">${montoTotalEmitido.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Listado de Órdenes de Compra</CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por proveedor o items..."
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
                    <TableHead>ID</TableHead>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Resumen de Items</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOC.map((oc) => (
                    <TableRow key={oc.id}>
                      <TableCell className="font-medium">{oc.id}</TableCell>
                      <TableCell>{getProjectName(oc.proyectoId)}</TableCell>
                      <TableCell>{oc.proveedor}</TableCell>
                      <TableCell className="max-w-xs truncate">{oc.items}</TableCell>
                      <TableCell>{oc.fechaPedido}</TableCell>
                      <TableCell className="text-right font-bold">${oc.montoTotal.toLocaleString()}</TableCell>
                      <TableCell>{renderStatusBadge(oc.estado)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(oc)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(oc.id)}
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
              <DialogTitle>Editar Orden de Compra</DialogTitle>
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
                  <Label htmlFor="edit-proveedor">Proveedor</Label>
                  <Input
                    id="edit-proveedor"
                    value={formData.proveedor}
                    onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-items">Resumen de Items Solicitados</Label>
                  <Textarea
                    id="edit-items"
                    value={formData.items}
                    onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-montoTotal">Monto Total ($)</Label>
                    <Input
                      id="edit-montoTotal"
                      type="number"
                      value={formData.montoTotal}
                      onChange={(e) => setFormData({ ...formData, montoTotal: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-estado">Estado</Label>
                    <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="Emitida">Emitida</SelectItem>
                        <SelectItem value="Recibida">Recibida</SelectItem>
                        <SelectItem value="Cancelada">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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

export default GestionCompras;