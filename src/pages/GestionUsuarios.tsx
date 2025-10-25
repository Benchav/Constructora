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

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState(mockUsuarios);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    rol: '',
    username: '',
    password: '',
    proyectoAsignadoId: '',
  });

  const filteredUsuarios = usuarios.filter(u => 
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleCreate = () => {
    if (!formData.nombre || !formData.rol || !formData.username || !formData.password) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    const newUser: Usuario = {
      id: Math.max(...usuarios.map(u => u.id)) + 1,
      nombre: formData.nombre,
      rol: formData.rol,
      username: formData.username,
      password: formData.password,
      proyectoAsignadoId: formData.proyectoAsignadoId ? parseInt(formData.proyectoAsignadoId) : undefined,
    };

    const newUsuarios = [...usuarios, newUser];
    setUsuarios(newUsuarios);
    updateUsuarios(newUsuarios);
    setIsCreateOpen(false);
    resetForm();
    toast.success('Usuario creado exitosamente');
  };

  const handleEdit = (user: Usuario) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre,
      rol: user.rol,
      username: user.username,
      password: user.password,
      proyectoAsignadoId: user.proyectoAsignadoId?.toString() || '',
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!editingUser || !formData.nombre || !formData.rol || !formData.username) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    const updatedUsuarios = usuarios.map(u =>
      u.id === editingUser.id
        ? {
            ...u,
            nombre: formData.nombre,
            rol: formData.rol,
            username: formData.username,
            password: formData.password || u.password,
            proyectoAsignadoId: formData.proyectoAsignadoId ? parseInt(formData.proyectoAsignadoId) : undefined,
          }
        : u
    );

    setUsuarios(updatedUsuarios);
    updateUsuarios(updatedUsuarios);
    setIsEditOpen(false);
    setEditingUser(null);
    resetForm();
    toast.success('Usuario actualizado exitosamente');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      const newUsuarios = usuarios.filter(u => u.id !== id);
      setUsuarios(newUsuarios);
      updateUsuarios(newUsuarios);
      toast.success('Usuario eliminado exitosamente');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">Administre los usuarios del sistema</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
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
                      <SelectItem value="">Ninguno</SelectItem>
                      {mockProyectos.map(p => (
                        <SelectItem key={p.id} value={p.id.toString()}>{p.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
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
                  {filteredUsuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">{usuario.nombre}</TableCell>
                      <TableCell>{usuario.username}</TableCell>
                      <TableCell>{usuario.rol}</TableCell>
                      <TableCell>
                        {usuario.proyectoAsignadoId 
                          ? mockProyectos.find(p => p.id === usuario.proyectoAsignadoId)?.nombre 
                          : '-'}
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

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
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
                    <SelectValue />
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Ninguno</SelectItem>
                    {mockProyectos.map(p => (
                      <SelectItem key={p.id} value={p.id.toString()}>{p.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

export default GestionUsuarios;
