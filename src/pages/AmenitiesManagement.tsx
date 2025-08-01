import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogOut, Plus, Settings, Edit, Trash2, ArrowLeft, 
         Wind, Flame, ChefHat, Utensils, Armchair, Shield, Camera, UserCheck, ShieldAlert,
         Wifi, Globe, Tv, Zap, Droplets, Shirt, Waves, Dumbbell, Trees, Building, Home,
         Users, Gamepad2, Car, Warehouse, Bus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAmenities, type Amenity } from "@/contexts/AmenitiesContext";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mapeo de iconos disponibles
const iconMap = {
  Wind, Flame, ChefHat, Utensils, Armchair, Shield, Camera, UserCheck, ShieldAlert,
  Wifi, Globe, Tv, Zap, Droplets, Shirt, Waves, Dumbbell, Trees, Building, Home,
  Users, Gamepad2, Car, Warehouse, Bus, Settings
};

const categoryLabels = {
  comfort: 'Comodidad',
  security: 'Seguridad',
  connectivity: 'Conectividad',
  utilities: 'Servicios',
  recreation: 'Recreación',
  transportation: 'Transporte',
  other: 'Otros'
};

const AmenitiesManagement = () => {
  const { user, logout } = useAuth();
  const { amenities, createAmenity, updateAmenity, deleteAmenity, toggleAmenityStatus } = useAmenities();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const [newAmenityForm, setNewAmenityForm] = useState({
    name: "",
    icon: "Settings",
    category: "other" as Amenity['category'],
    isActive: true
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente.",
    });
  };

  const handleCreateAmenity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    createAmenity(newAmenityForm);
    
    toast({
      title: "¡Amenidad creada!",
      description: `${newAmenityForm.name} ha sido agregada exitosamente.`,
    });
    
    setNewAmenityForm({
      name: "",
      icon: "Settings",
      category: "other",
      isActive: true
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditAmenity = (amenity: Amenity) => {
    setEditingAmenity(amenity);
    setIsEditDialogOpen(true);
  };

  const handleUpdateAmenity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingAmenity) return;

    updateAmenity(editingAmenity.id, {
      name: editingAmenity.name,
      icon: editingAmenity.icon,
      category: editingAmenity.category,
      isActive: editingAmenity.isActive
    });

    setIsEditDialogOpen(false);
    setEditingAmenity(null);

    toast({
      title: "¡Amenidad actualizada!",
      description: `${editingAmenity.name} ha sido actualizada exitosamente.`,
    });
  };

  const handleDeleteAmenity = (amenityId: string, amenityName: string) => {
    deleteAmenity(amenityId);
    toast({
      title: "Amenidad eliminada",
      description: `${amenityName} ha sido eliminada del sistema.`,
    });
  };

  const handleToggleStatus = (amenityId: string, amenityName: string, currentStatus: boolean) => {
    toggleAmenityStatus(amenityId);
    toast({
      title: `Amenidad ${currentStatus ? 'desactivada' : 'activada'}`,
      description: `${amenityName} ha sido ${currentStatus ? 'desactivada' : 'activada'}.`,
    });
  };

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    navigate('/login');
    return null;
  }

  // Agrupar amenidades por categoría
  const amenitiesByCategory = Object.entries(categoryLabels).map(([category, label]) => ({
    category: category as Amenity['category'],
    label,
    amenities: amenities.filter(a => a.category === category)
  }));

  const activeAmenities = amenities.filter(a => a.isActive).length;
  const totalAmenities = amenities.length;

  const IconComponent = ({ iconName }: { iconName: string }) => {
    const Icon = iconMap[iconName as keyof typeof iconMap] || Settings;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/properties')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-gold-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-navy-800">Gestión de Amenidades</h1>
                <p className="text-sm text-gray-600">Administrar características de propiedades</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-navy-800">{user.name}</p>
                <p className="text-xs text-gray-600">
                  {user.role === 'superadmin' ? 'Super Administrador' : 'Administrador'}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Amenidades</p>
                  <p className="text-3xl font-bold text-navy-800">{totalAmenities}</p>
                </div>
                <Settings className="h-12 w-12 text-gold-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Amenidades Activas</p>
                  <p className="text-3xl font-bold text-green-600">{activeAmenities}</p>
                </div>
                <Shield className="h-12 w-12 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categorías</p>
                  <p className="text-3xl font-bold text-blue-600">{Object.keys(categoryLabels).length}</p>
                </div>
                <Building className="h-12 w-12 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Amenities Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-navy-800">Gestión de Amenidades</CardTitle>
                <CardDescription>
                  Crea, edita y gestiona las amenidades disponibles para las propiedades
                </CardDescription>
              </div>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gold-600 hover:bg-gold-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Amenidad
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Amenidad</DialogTitle>
                    <DialogDescription>
                      Completa los datos para crear una nueva amenidad del sistema.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleCreateAmenity} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre de la Amenidad</Label>
                      <Input
                        id="name"
                        value={newAmenityForm.name}
                        onChange={(e) => setNewAmenityForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ej: Piscina climatizada"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoría</Label>
                      <Select
                        value={newAmenityForm.category}
                        onValueChange={(value: Amenity['category']) => 
                          setNewAmenityForm(prev => ({ ...prev, category: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(categoryLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="icon">Icono</Label>
                      <Select
                        value={newAmenityForm.icon}
                        onValueChange={(value) => 
                          setNewAmenityForm(prev => ({ ...prev, icon: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(iconMap).map((iconName) => (
                            <SelectItem key={iconName} value={iconName}>
                              <div className="flex items-center space-x-2">
                                <IconComponent iconName={iconName} />
                                <span>{iconName}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={newAmenityForm.isActive}
                        onCheckedChange={(checked) => setNewAmenityForm(prev => ({ ...prev, isActive: checked }))}
                      />
                      <Label htmlFor="isActive">Amenidad activa</Label>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-gold-600 hover:bg-gold-700">
                        Crear Amenidad
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Amenidades por categoría */}
            <div className="space-y-8">
              {amenitiesByCategory.map(({ category, label, amenities: categoryAmenities }) => (
                <div key={category} className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-navy-800">{label}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {categoryAmenities.length} amenidades
                    </Badge>
                  </div>
                  
                  {categoryAmenities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryAmenities.map((amenity) => (
                        <Card key={amenity.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gold-100 rounded-lg flex items-center justify-center">
                                  <IconComponent iconName={amenity.icon} />
                                </div>
                                <div>
                                  <p className="font-medium text-navy-800">{amenity.name}</p>
                                  <p className="text-sm text-gray-500">{amenity.createdAt}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant={amenity.isActive ? "default" : "secondary"}>
                                  {amenity.isActive ? "Activa" : "Inactiva"}
                                </Badge>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Settings className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => handleEditAmenity(amenity)}
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleToggleStatus(amenity.id, amenity.name, amenity.isActive)}
                                    >
                                      <Switch className="h-4 w-4 mr-2" />
                                      {amenity.isActive ? "Desactivar" : "Activar"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => handleDeleteAmenity(amenity.id, amenity.name)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Eliminar
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Settings className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No hay amenidades en esta categoría</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Diálogo de Edición */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Amenidad</DialogTitle>
              <DialogDescription>
                Modifica los datos de la amenidad.
              </DialogDescription>
            </DialogHeader>
            
            {editingAmenity && (
              <form onSubmit={handleUpdateAmenity} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nombre de la Amenidad</Label>
                  <Input
                    id="edit-name"
                    value={editingAmenity.name}
                    onChange={(e) => setEditingAmenity(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                    placeholder="Ej: Piscina climatizada"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Categoría</Label>
                  <Select
                    value={editingAmenity.category}
                    onValueChange={(value: Amenity['category']) => 
                      setEditingAmenity(prev => prev ? ({ ...prev, category: value }) : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-icon">Icono</Label>
                  <Select
                    value={editingAmenity.icon}
                    onValueChange={(value) => 
                      setEditingAmenity(prev => prev ? ({ ...prev, icon: value }) : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(iconMap).map((iconName) => (
                        <SelectItem key={iconName} value={iconName}>
                          <div className="flex items-center space-x-2">
                            <IconComponent iconName={iconName} />
                            <span>{iconName}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-isActive"
                    checked={editingAmenity.isActive}
                    onCheckedChange={(checked) => setEditingAmenity(prev => prev ? ({ ...prev, isActive: checked }) : null)}
                  />
                  <Label htmlFor="edit-isActive">Amenidad activa</Label>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-gold-600 hover:bg-gold-700">
                    Actualizar Amenidad
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AmenitiesManagement;
