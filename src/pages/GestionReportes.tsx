import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { mockReportesDiarios, updateReportesDiarios, ReporteDiario, mockProyectos } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, FileText, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const GestionReportes = () => {
  const { user } = useAuth();
  const [reportes, setReportes] = useState(mockReportesDiarios);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    proyectoId: '',
    resumen: '',
  });

  const proyectoAsignado = user?.proyectoAsignadoId;
  const filteredReportes = reportes.filter(r => 
    proyectoAsignado ? r.proyectoId === proyectoAsignado : true
  ).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const resetForm = () => {
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      proyectoId: proyectoAsignado?.toString() || '',
      resumen: '',
    });
  };

  const handleCreate = () => {
    if (!formData.fecha || !formData.proyectoId || !formData.resumen) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    if (formData.resumen.length < 10) {
      toast.error('El resumen debe tener al menos 10 caracteres');
      return;
    }

    const newReporte: ReporteDiario = {
      id: 'r' + (Math.max(...reportes.map(r => parseInt(r.id.substring(1)))) + 1),
      fecha: formData.fecha,
      proyectoId: parseInt(formData.proyectoId),
      creadoPor: user?.nombre || 'Usuario',
      resumen: formData.resumen,
    };

    const newReportes = [...reportes, newReporte];
    setReportes(newReportes);
    updateReportesDiarios(newReportes);
    setIsCreateOpen(false);
    resetForm();
    toast.success('Reporte diario registrado exitosamente');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Reportes Diarios de Obra</h1>
            <p className="text-muted-foreground">Registre el avance y actividades del día</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Reporte
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Reporte Diario</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
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
                  <Label htmlFor="proyecto">Proyecto</Label>
                  <Select 
                    value={formData.proyectoId} 
                    onValueChange={(value) => setFormData({ ...formData, proyectoId: value })}
                    disabled={!!proyectoAsignado}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione proyecto" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProyectos
                        .filter(p => !proyectoAsignado || p.id === proyectoAsignado)
                        .map(p => (
                          <SelectItem key={p.id} value={p.id.toString()}>{p.nombre}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="resumen">Resumen de Actividades</Label>
                  <Textarea
                    id="resumen"
                    value={formData.resumen}
                    onChange={(e) => setFormData({ ...formData, resumen: e.target.value })}
                    placeholder="Describa las actividades realizadas, avances, personal presente, materiales utilizados, incidentes, etc."
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.resumen.length} caracteres (mínimo 10)
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreate}>Crear Reporte</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {filteredReportes.map((reporte) => (
            <Card key={reporte.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      {mockProyectos.find(p => p.id === reporte.proyectoId)?.nombre}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {reporte.fecha}
                      </span>
                      <span>Por: {reporte.creadoPor}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">{reporte.resumen}</p>
              </CardContent>
            </Card>
          ))}

          {filteredReportes.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay reportes registrados</h3>
                <p className="text-muted-foreground mb-4">Cree su primer reporte diario</p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Reporte
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GestionReportes;
