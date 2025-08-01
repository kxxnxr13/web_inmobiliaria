import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogOut, Plus, Home, Edit, Trash2, Eye, MapPin, DollarSign, Bed, Bath, Square, Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProperties } from "@/contexts/PropertiesContext";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import type { Property } from "@/contexts/PropertiesContext";

const PropertyManagement = () => {
  const { user, logout } = useAuth();
  const { getPropertiesByAdmin, createProperty, deleteProperty, updatePropertyStatus, properties, refreshProperties } = useProperties();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPropertyForm, setNewPropertyForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    type: "venta" as const,
    status: "disponible" as const,
    imageUrl: ""
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente.",
    });
  };

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();

    const newPropertyData = {
      title: newPropertyForm.title,
      description: newPropertyForm.description,
      price: Number(newPropertyForm.price),
      location: newPropertyForm.location,
      bedrooms: Number(newPropertyForm.bedrooms),
      bathrooms: Number(newPropertyForm.bathrooms),
      area: Number(newPropertyForm.area),
      type: newPropertyForm.type,
      status: newPropertyForm.status,
      imageUrl: newPropertyForm.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
      adminId: 'general', // Propiedades generales que cualquier admin puede gestionar
      featured: false,
      amenities: [],
      condition: 'Excelente',
      propertyType: 'Casa'
    };

    createProperty(newPropertyData);
    setNewPropertyForm({
      title: "",
      description: "",
      price: "",
      location: "",
      bedrooms: "",
      bathrooms: "",
      area: "",
      type: "venta",
      status: "disponible",
      imageUrl: ""
    });
    setIsCreateDialogOpen(false);

    toast({
      title: "¡Propiedad creada!",
      description: `${newPropertyData.title} ha sido agregada exitosamente.`,
    });
  };

  const handleDeleteProperty = (propertyId: string, propertyTitle: string) => {
    deleteProperty(propertyId);
    toast({
      title: "Propiedad eliminada",
      description: `${propertyTitle} ha sido eliminada del sistema.`,
    });
  };

  const handleStatusChange = (propertyId: string, newStatus: Property['status']) => {
    updatePropertyStatus(propertyId, newStatus);
    toast({
      title: "Estado actualizado",
      description: `El estado de la propiedad ha sido actualizado.`,
    });
  };

  const formatPrice = (price: number, type: Property['type']) => {
    return type === 'venta' 
      ? `$${price.toLocaleString()}` 
      : `$${price.toLocaleString()}/mes`;
  };

  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  // Filtrar propiedades del administrador actual
  const userProperties = getPropertiesByAdmin(user?.id || '');

  // Debug: Log información sobre propiedades
  console.log('Current user:', user?.id, user?.name);
  console.log('Total properties:', properties.length);
  console.log('User properties:', userProperties.length);
  console.log('Properties for admin:', userProperties);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
                <Home className="h-6 w-6 text-gold-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-navy-800">Gestión de Propiedades</h1>
                <p className="text-sm text-gray-600">Panel de Administrador</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-navy-800">{user.name}</p>
                <p className="text-xs text-gray-600">Administrador</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Propiedades Disponibles</p>
                  <p className="text-3xl font-bold text-navy-800">{userProperties.length}</p>
                </div>
                <Home className="h-12 w-12 text-gold-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disponibles</p>
                  <p className="text-3xl font-bold text-green-600">
                    {userProperties.filter(p => p.status === 'disponible').length}
                  </p>
                </div>
                <Eye className="h-12 w-12 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Venta</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {userProperties.filter(p => p.type === 'venta').length}
                  </p>
                </div>
                <DollarSign className="h-12 w-12 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Alquiler</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {userProperties.filter(p => p.type === 'alquiler').length}
                  </p>
                </div>
                <Home className="h-12 w-12 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-navy-800">Gestión de Propiedades</CardTitle>
                <CardDescription>
                  Gestiona las propiedades del sistema inmobiliario
                </CardDescription>
              </div>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gold-600 hover:bg-gold-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Propiedad
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Agregar Nueva Propiedad</DialogTitle>
                    <DialogDescription>
                      Completa los datos de la nueva propiedad.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleCreateProperty} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Título</Label>
                        <Input
                          id="title"
                          value={newPropertyForm.title}
                          onChange={(e) => setNewPropertyForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Casa moderna..."
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="price">Precio</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newPropertyForm.price}
                          onChange={(e) => setNewPropertyForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="350000"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={newPropertyForm.description}
                        onChange={(e) => setNewPropertyForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descripción detallada de la propiedad..."
                        rows={3}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Ubicación</Label>
                      <Input
                        id="location"
                        value={newPropertyForm.location}
                        onChange={(e) => setNewPropertyForm(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Zona Norte, Ciudad"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bedrooms">Habitaciones</Label>
                        <Input
                          id="bedrooms"
                          type="number"
                          value={newPropertyForm.bedrooms}
                          onChange={(e) => setNewPropertyForm(prev => ({ ...prev, bedrooms: e.target.value }))}
                          placeholder="3"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bathrooms">Baños</Label>
                        <Input
                          id="bathrooms"
                          type="number"
                          value={newPropertyForm.bathrooms}
                          onChange={(e) => setNewPropertyForm(prev => ({ ...prev, bathrooms: e.target.value }))}
                          placeholder="2"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="area">Área (m²)</Label>
                        <Input
                          id="area"
                          type="number"
                          value={newPropertyForm.area}
                          onChange={(e) => setNewPropertyForm(prev => ({ ...prev, area: e.target.value }))}
                          placeholder="150"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Tipo</Label>
                        <Select
                          value={newPropertyForm.type}
                          onValueChange={(value: 'venta' | 'alquiler') => 
                            setNewPropertyForm(prev => ({ ...prev, type: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="venta">Venta</SelectItem>
                            <SelectItem value="alquiler">Alquiler</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="status">Estado</Label>
                        <Select
                          value={newPropertyForm.status}
                          onValueChange={(value: 'disponible' | 'vendida' | 'alquilada') => 
                            setNewPropertyForm(prev => ({ ...prev, status: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="disponible">Disponible</SelectItem>
                            <SelectItem value="vendida">Vendida</SelectItem>
                            <SelectItem value="alquilada">Alquilada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">URL de Imagen (opcional)</Label>
                      <Input
                        id="imageUrl"
                        value={newPropertyForm.imageUrl}
                        onChange={(e) => setNewPropertyForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-gold-600 hover:bg-gold-700">
                        Crear Propiedad
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Propiedad</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Detalles</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <img
                          src={property.imageUrl}
                          alt={property.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{property.title}</p>
                          <p className="text-sm text-gray-500">{property.createdAt}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{property.location}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatPrice(property.price, property.type)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Bed className="h-4 w-4" />
                          <span>{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Bath className="h-4 w-4" />
                          <span>{property.bathrooms}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Square className="h-4 w-4" />
                          <span>{property.area}m²</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={property.status}
                        onValueChange={(value: Property['status']) => 
                          handleStatusChange(property.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="disponible">Disponible</SelectItem>
                          <SelectItem value="vendida">Vendida</SelectItem>
                          <SelectItem value="alquilada">Alquilada</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant={property.type === 'venta' ? "default" : "secondary"}>
                        {property.type === 'venta' ? 'Venta' : 'Alquiler'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteProperty(property.id, property.title)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {userProperties.length === 0 && (
              <div className="text-center py-8">
                <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay propiedades disponibles para gestionar</p>
                <p className="text-sm text-gray-500">Agrega una nueva propiedad al sistema</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PropertyManagement;
