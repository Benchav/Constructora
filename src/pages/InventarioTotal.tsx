import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockInventarioObra, mockProyectos } from '@/data/mockData';
import { Search, Package, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const InventarioTotal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProyecto, setSelectedProyecto] = useState<string>('todos');

  const filteredInventario = mockInventarioObra
    .filter(i => {
      const matchesSearch = i.item.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProyecto = selectedProyecto === 'todos' || i.proyectoId.toString() === selectedProyecto;
      return matchesSearch && matchesProyecto;
    });

  const totalItems = mockInventarioObra.length;
  const itemsCriticos = mockInventarioObra.filter(i => i.stock < 20).length;
  const valorTotal = mockInventarioObra.reduce((sum, i) => sum + i.stock, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Inventario Total de la Empresa</h1>
          <p className="text-muted-foreground">Vista consolidada del inventario en todos los proyectos</p>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Total de Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{totalItems}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Items Críticos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">{itemsCriticos}</p>
              <p className="text-xs text-muted-foreground mt-1">Stock bajo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Unidades Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{valorTotal.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inventario Consolidado</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar item..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedProyecto} onValueChange={setSelectedProyecto}>
                <SelectTrigger className="w-full sm:w-[250px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los Proyectos</SelectItem>
                  {mockProyectos.map(p => (
                    <SelectItem key={p.id} value={p.id.toString()}>{p.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventario.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.item}</TableCell>
                      <TableCell>
                        {mockProyectos.find(p => p.id === item.proyectoId)?.nombre}
                      </TableCell>
                      <TableCell>{item.unidad}</TableCell>
                      <TableCell className="font-bold text-lg">{item.stock}</TableCell>
                      <TableCell>
                        <Badge variant={item.stock < 20 ? 'destructive' : item.stock < 50 ? 'default' : 'secondary'}>
                          {item.stock < 20 ? 'Crítico' : item.stock < 50 ? 'Bajo' : 'Normal'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InventarioTotal;
