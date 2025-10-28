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
import { mockUsuarios, updateUsuarios, Usuario, mockProyectos } from '@/data/mockData';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

// --- FUNCIÓN DE AYUDA SEGURA ---
// Para obtener el nombre del proyecto sin errores
const getProjectName = (proyectoId?: number) => {
  if (!proyectoId || !Array.isArray(mockProyectos)) {
    return '-';
  }
  const proyecto = mockProyectos.find(p => p.id === proyectoId);
  return proyecto ? proyecto.nombre : '-';
};
// --- FIN FUNCIÓN DE AYUDA ---

const GestionUsuarios = () => {
  // CORREGIDO: Asegurar que el estado inicial siempre sea un array
  const [usuarios, setUsuarios] = useState(mockUsuarios || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    rol: '',
    username: '',
    password: '',
    proyectoAsignadoId: '', // '' es válido para el placeholder inicial
  });

  // CORREGIDO: Asegurar que 'usuarios' sea un array antes de filtrar
  const filteredUsuarios = (usuarios || []).filter(u =>
    (u.nombre && u.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const resetForm = () => {
    setFormData({
      nombre: '',
      rol: '',
      username: '',
      password: '',
      proyectoAsignadoId: '',
    });
  };

  // --- CONTROLADORES DE MODAL (PARA LIMPIEZA DE ESTADO) ---
  const handleCreateOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setIsCreateOpen(open);
  };

  const handleEditOpenChange = (open: boolean) => {
    if (!open) {
      setEditingUser(null);
      resetForm();
    }
    setIsEditOpen(open);
  };
  // --- FIN DE CONTROLADORES ---

  const handleCreate = () => {
    if (!formData.nombre || !formData.rol || !formData.username || !formData.password) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    // CORREGIDO: Cálculo de ID más seguro
    const currentUsuarios = usuarios || [];
    const newId = currentUsuarios.length > 0 ? Math.max(...currentUsuarios.map(u => u.id)) + 1 : 1;

    // CORREGIDO: Interpretar 'none' o '' como undefined
    const proyectoIdInt = formData.proyectoAsignadoId && formData.proyectoAsignadoId !== 'none'
      ? parseInt(formData.proyectoAsignadoId)
      : undefined;

    const newUser: Usuario = {
      id: newId,
      nombre: formData.nombre,
      rol: formData.rol,
      username: formData.username,
      password: formData.password,
      proyectoAsignadoId: proyectoIdInt, // Usar valor interpretado
    };

    const newUsuarios = [...currentUsuarios, newUser];
    setUsuarios(newUsuarios);
    if (typeof updateUsuarios === 'function') {
      updateUsuarios(newUsuarios);
    }
    handleCreateOpenChange(false); // Usar handler para cerrar y limpiar
    toast.success('Usuario creado exitosamente');
  };

  const handleEdit = (user: Usuario) => {
    if (!user) return;
    setEditingUser(user);
    setFormData({
      nombre: user.nombre || '',
      rol: user.rol || '',
      username: user.username || '',
      password: '', // Empezar vacío para lógica de "no cambiar"
      // CORREGIDO: Usar 'none' si no hay ID, o el ID como string
      proyectoAsignadoId: user.proyectoAsignadoId?.toString() || 'none',
    });
    handleEditOpenChange(true); // Usar handler para abrir
  };

  const handleUpdate = () => {
    if (!editingUser || !formData.nombre || !formData.rol || !formData.username) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    // CORREGIDO: Interpretar 'none' o '' como undefined
    const proyectoIdInt = formData.proyectoAsignadoId && formData.proyectoAsignadoId !== 'none'
      ? parseInt(formData.proyectoAsignadoId)
      : undefined;

    const updatedUsuarios = (usuarios || []).map(u =>
      u.id === editingUser.id
        ? {
          ...u,
          nombre: formData.nombre,
          rol: formData.rol,
          username: formData.username,
          password: formData.password || u.password,
          proyectoAsignadoId: proyectoIdInt, // Usar valor interpretado
        }
        : u
    );

    setUsuarios(updatedUsuarios);
    if (typeof updateUsuarios === 'function') {
      updateUsuarios(updatedUsuarios);
    }
    handleEditOpenChange(false); // Usar handler para cerrar y limpiar
    toast.success('Usuario actualizado exitosamente');
  };

  const handleDelete = (id: number) => {
    if (editingUser && editingUser.id === id) {
      handleEditOpenChange(false); // Cerrar modal si se borra el usuario en edición
    }

    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      const newUsuarios = (usuarios || []).filter(u => u.id !== id);
      setUsuarios(newUsuarios);
      if (typeof updateUsuarios === 'function') {
        updateUsuarios(newUsuarios);
      }
      toast.success('Usuario eliminado exitosamente');
    }
  };

  // --- RENDERIZADOR DEFENSIVO DE PROYECTOS ---
  const renderProjectOptions = () => {
    if (!Array.isArray(mockProyectos)) {
      return <SelectItem value="loading" disabled>Cargando proyectos...</SelectItem>;
    }
    return mockProyectos.map(p => (
      <SelectItem key={p.id} value={p.id.toString()}>{p.nombre}</SelectItem>
    ));
  };
  // --- FIN RENDERIZADOR ---

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">Administre los usuarios del sistema</p>
          </div>

          {/* CORREGIDO: Usar onOpenChange para limpieza de estado */}
          <Dialog open={isCreateOpen} onOpenChange={handleCreateOpenChange}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Usuario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre Completo</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="rol">Rol</Label>
                  <Select value={formData.rol} onValueChange={(value) => setFormData({ ...formData, rol: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CEO">CEO</SelectItem>
                      <SelectItem value="Gerente General">Gerente General</SelectItem>
                      <SelectItem value="Director de Proyectos">Director de Proyectos</SelectItem>
                      <SelectItem value="Director Finanzas">Director Finanzas</SelectItem>
                      <SelectItem value="Director Comercial">Director Comercial</SelectItem>
                      <SelectItem value="Jefe Oficina Tecnica">Jefe Oficina Tecnica</SelectItem>
                      <SelectItem value="Jefe de Obra">Jefe de Obra</SelectItem>
                      <SelectItem value="Maestro de Obra">Maestro de Obra</SelectItem>
                      <SelectItem value="Bodeguero">Bodeguero</SelectItem>
                      <SelectItem value="RRHH">RRHH</SelectItem>
                      <SelectItem value="Albañil">Albañil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="username">Usuario</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="proyecto">Proyecto Asignado (Opcional)</Label>
                  <Select
                    value={formData.proyectoAsignadoId}
                    onValueChange={(value) => setFormData({ ...formData, proyectoAsignadoId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un proyecto" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* CORREGIDO: El valor no puede ser un string vacío */}
                      <SelectItem value="none">Ninguno</SelectItem>
                      {renderProjectOptions()}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                {/* CORREGIDO: Usar handler para cerrar */}
                <Button variant="outline" onClick={() => handleCreateOpenChange(false)}>Cancelar</Button>
                <Button onClick={handleCreate}>Crear Usuario</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuarios</CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o usuario..."
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
                    <TableHead>Usuario</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Proyecto Asignado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* CORREGIDO: Usar filteredUsuarios que es seguro */}
                  {filteredUsuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">{usuario.nombre}</TableCell>
                      <TableCell>{usuario.username}</TableCell>
                      <TableCell>{usuario.rol}</TableCell>
                      <TableCell>
                        {/* CORREGIDO: Usar función de ayuda segura */}
                        {getProjectName(usuario.proyectoAsignadoId)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(usuario)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(usuario.id)}
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

        {/* CORREGIDO: Usar onOpenChange para limpieza de estado */}
        <Dialog open={isEditOpen} onOpenChange={handleEditOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
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
                <Label htmlFor="edit-rol">Rol</Label>
                <Select value={formData.rol} onValueChange={(value) => setFormData({ ...formData, rol: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CEO">CEO</SelectItem>
                    <SelectItem value="Gerente General">Gerente General</SelectItem>
                    <SelectItem value="Director de Proyectos">Director de Proyectos</SelectItem>
                    <SelectItem value="Director Finanzas">Director Finanzas</SelectItem>
                    <SelectItem value="Director Comercial">Director Comercial</SelectItem>
                    <SelectItem value="Jefe Oficina Tecnica">Jefe Oficina Tecnica</SelectItem>
                    <SelectItem value="Jefe de Obra">Jefe de Obra</SelectItem>
                    <SelectItem value="Maestro de Obra">Maestro de Obra</SelectItem>
                    <SelectItem value="Bodeguero">Bodeguero</SelectItem>
                    <SelectItem value="RRHH">RRHH</SelectItem>
                    <SelectItem value="Albañil">Albañil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-username">Usuario</Label>
                <Input
                  id="edit-username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-password">Contraseña (dejar vacío para no cambiar)</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-proyecto">Proyecto Asignado</Label>
                <Select
                  value={formData.proyectoAsignadoId}
                  onValueChange={(value) => setFormData({ ...formData, proyectoAsignadoId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* CORREGIDO: El valor no puede ser un string vacío */}
                    <SelectItem value="none">Ninguno</SelectItem>
                    {renderProjectOptions()}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              {/* CORREGIDO: Usar handler para cerrar */}
              <Button variant="outline" onClick={() => handleEditOpenChange(false)}>Cancelar</Button>
              <Button onClick={handleUpdate}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default GestionUsuarios;