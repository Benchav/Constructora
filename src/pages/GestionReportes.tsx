// src/pages/GestionReportes.tsx
import { useState, useEffect } from 'react';
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
import { ReporteDiario, Proyecto } from '@/data/models'; // Importar ambos modelos
import apiClient from '@/lib/api'; // Importar API Client
import { useAuth } from '@/hooks/useAuth'; // Estandarizado a @/hooks/useAuth
import { Plus, FileText, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

// Definición de tipo para el formulario
type ReporteFormData = {
  fecha: string;
  proyectoId: string;
  resumen: string;
};

const GestionReportes = () => {
  const { user } = useAuth();
  
  // --- Estados de Datos (API) ---
  const [reportes, setReportes] = useState<ReporteDiario[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Estados de UI (Modal) ---
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const initialFormData: ReporteFormData = {
    fecha: new Date().toISOString().split('T')[0],
    proyectoId: '',
    resumen: '',
  };
  const [formData, setFormData] = useState<ReporteFormData>(initialFormData);

  const proyectoAsignadoId = user?.proyectoAsignadoId;

  // --- Carga de Datos (API) ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [reportesRes, proyectosRes] = await Promise.all([
          apiClient.get<ReporteDiario[]>('/reportes'),
          apiClient.get<Proyecto[]>('/proyectos'), // Para el dropdown
        ]);

        setReportes(Array.isArray(reportesRes.data) ? reportesRes.data : []);
        setProyectos(Array.isArray(proyectosRes.data) ? proyectosRes.data : []);

      } catch (error) {
        toast.error('No se pudieron cargar los datos');
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Cargar solo una vez

  // --- Lógica de Filtro (de Archivo 1) ---
  // Filtra los reportes para mostrar solo los del proyecto asignado al usuario
  const filteredReportes = reportes
    .filter(r => 
      proyectoAsignadoId ? r.proyectoId === proyectoAsignadoId : true
    )
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  // --- Helpers ---
  const getProjectName = (proyectoId?: number) => {
    if (!proyectoId) return "Proyecto no asignado";
    return proyectos.find(p => p.id === proyectoId)?.nombre || `Proyecto ID: ${proyectoId}`;
  };

  const resetForm = () => {
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      // Poblar con el proyectoId del usuario por defecto
      proyectoId: proyectoAsignadoId?.toString() || '',
      resumen: '',
    });
  };

  const handleCreateOpenChange = (open: boolean) => {
    if (open) {
      resetForm(); // Poblar el formulario con valores por defecto al abrir
    }
    setIsCreateOpen(open);
  };

  // --- Lógica de Creación (API) ---
  const handleCreate = async () => {
    if (!formData.fecha || !formData.proyectoId || !formData.resumen) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    if (formData.resumen.length < 10) {
      toast.error('El resumen debe tener al menos 10 caracteres');
      return;
    }

    const newReportePayload = {
      fecha: formData.fecha,
      proyectoId: parseInt(formData.proyectoId),
      creadoPor: user?.nombre || 'Usuario', // Tomar el nombre del usuario en sesión
      resumen: formData.resumen,
    };

    try {
      const res = await apiClient.post<ReporteDiario>('/reportes', newReportePayload);
      setReportes([...reportes, res.data]); // Añadir el nuevo reporte
      handleCreateOpenChange(false);
      toast.success('Reporte diario registrado exitosamente');
    } catch (error) {
      toast.error('Error al registrar el reporte');
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Reportes Diarios de Obra</h1>
            <p className="text-muted-foreground">Registre el avance y actividades del día</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={handleCreateOpenChange}>
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
                    // Deshabilitar si el usuario tiene un proyecto asignado
                    disabled={!!proyectoAsignadoId} 
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione proyecto" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Poblar con proyectos de la API */}
                      {proyectos
                        // Mostrar solo el proyecto del usuario (si lo tiene) o todos si es admin (aunque aquí no filtramos por admin)
                        .filter(p => !proyectoAsignadoId || p.id === proyectoAsignadoId) 
                        .map(p => (
                          <SelectItem key={p.id} value={p.id.toString()}>{p.nombre}</SelectItem>
                        ))
                      }
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
                <Button variant="outline" onClick={() => handleCreateOpenChange(false)}>Cancelar</Button>
                <Button onClick={handleCreate}>Crear Reporte</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* --- Lista de Reportes --- */}
        {loading ? (
          <p>Cargando reportes...</p>
        ) : filteredReportes.length === 0 ? (
          // Vista de "No hay reportes" (de Archivo 1)
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay reportes registrados</h3>
              <p className="text-muted-foreground mb-4">Cree su primer reporte diario</p>
              <Button onClick={() => handleCreateOpenChange(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Reporte
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Cuadrícula de reportes (Estilo de Archivo 2)
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {filteredReportes.map((reporte) => (
              <Card key={reporte.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">
                      {/* Usar helper para mostrar nombre del proyecto */}
                      {getProjectName(reporte.proyectoId)}
                    </CardTitle>
                    <Badge variant="secondary">ID: {reporte.id}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{reporte.fecha ? new Date(reporte.fecha).toLocaleDateString('es-ES') : "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{reporte.creadoPor}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{reporte.resumen}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GestionReportes;