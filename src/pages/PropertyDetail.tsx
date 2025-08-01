import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useProperties } from "@/contexts/PropertiesContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Car,
  Wifi,
  Zap,
  Droplets,
  Shield,
  Trees,
  Utensils,
  Wind,
  Heart,
  Share2,
  Phone,
  Mail,
  Calendar,
  ArrowLeft,
  Camera,
  Home,
  Building,
  Users,
} from "lucide-react";



const PropertyDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { properties } = useProperties();
  const { user } = useAuth();

  // Detectar si viene del panel de admin
  const fromAdmin = location.state?.from === 'admin' ||
                   (user && (user.role === 'admin' || user.role === 'superadmin') &&
                    document.referrer.includes('/properties'));

  // Buscar la propiedad por ID en el contexto
  const property = properties.find(p => p.id === id);

  // Datos por defecto para propiedades que no tienen todos los campos
  const defaultFeatures = [
    "Acabados de alta calidad",
    "Excelente ubicación",
    "Espacios amplios y luminosos",
    "Fácil acceso a servicios",
    "Zona residencial tranquila",
    "Cerca de centros comerciales"
  ];

  // Mapeo inteligente de servicios a iconos
  const getIconForService = (servicio: string) => {
    const servicioLower = servicio.toLowerCase();

    if (servicioLower.includes('internet') || servicioLower.includes('wifi') || servicioLower.includes('fibra')) {
      return Wifi;
    } else if (servicioLower.includes('electric') || servicioLower.includes('luz') || servicioLower.includes('energía')) {
      return Zap;
    } else if (servicioLower.includes('agua') || servicioLower.includes('potable') || servicioLower.includes('water')) {
      return Droplets;
    } else if (servicioLower.includes('segur') || servicioLower.includes('security') || servicioLower.includes('protec')) {
      return Shield;
    } else if (servicioLower.includes('verde') || servicioLower.includes('jardín') || servicioLower.includes('parque') || servicioLower.includes('áreas verdes')) {
      return Trees;
    } else if (servicioLower.includes('cocina') || servicioLower.includes('kitchen') || servicioLower.includes('funcional')) {
      return Utensils;
    } else if (servicioLower.includes('ventilac') || servicioLower.includes('aire') || servicioLower.includes('climatiz')) {
      return Wind;
    } else if (servicioLower.includes('estacion') || servicioLower.includes('parking') || servicioLower.includes('garaje')) {
      return Car;
    } else if (servicioLower.includes('piscina') || servicioLower.includes('pool') || servicioLower.includes('natación')) {
      return Wind; // Usando wind como placeholder para agua/piscina
    } else if (servicioLower.includes('gimnasio') || servicioLower.includes('ejercicio') || servicioLower.includes('fitness')) {
      return Shield; // Usando shield como placeholder para gym
    } else if (servicioLower.includes('lavandería') || servicioLower.includes('laundry') || servicioLower.includes('ropa')) {
      return Droplets; // Agua para lavandería
    } else {
      return Shield; // Icono por defecto
    }
  };

  // Servicios por defecto con iconos (para cuando no hay servicios específicos)
  const defaultAmenities = [
    { icon: Wifi, label: "Internet disponible" },
    { icon: Zap, label: "Electricidad" },
    { icon: Droplets, label: "Agua potable" },
    { icon: Shield, label: "Zona segura" },
    { icon: Trees, label: "Áreas verdes" },
    { icon: Utensils, label: "Cocina funcional" },
    { icon: Wind, label: "Buena ventilación" },
    { icon: Car, label: "Estacionamiento" }
  ];

  const defaultAgent = {
    name: "Agente Inmobiliario",
    phone: "+1 (555) 123-4567",
    email: "agente@inmobiliaria.com",
    photo: "/placeholder.svg"
  };

  const images = [property?.imageUrl || "/placeholder.svg"];

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Propiedad no encontrada</h1>
          <Link to="/propiedades">
            <Button>Volver a Propiedades</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => {
            if (fromAdmin) {
              navigate('/properties');
            } else {
              navigate('/propiedades');
            }
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {fromAdmin ? 'Volver al Panel Admin' : 'Volver a Propiedades'}
        </Button>
      </div>

      {/* Property Images Carousel */}
      <section className="container mx-auto px-4 mb-8">
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
                    <img
                      src={image}
                      alt={`${property.title} - Imagen ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Badge className="absolute top-4 left-4 bg-gold-500 text-white">
                      {property.type === "venta" ? "En Venta" : "En Alquiler"}
                    </Badge>
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-md flex items-center">
                      <Camera className="mr-2 h-4 w-4" />
                      {index + 1} / {images.length}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </section>

      {/* Property Information */}
      <section className="container mx-auto px-4 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-navy-800 mb-2">
                    {property.title}
                  </h1>
                  <p className="text-lg text-gray-600 flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    {property.location}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gold-600 mb-2">
                    ${property.price.toLocaleString()}
                    {property.type === "alquiler" && (
                      <span className="text-lg text-gray-500">/mes</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="icon" variant="outline">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Bed className="h-6 w-6 mx-auto mb-2 text-navy-600" />
                  <div className="font-semibold">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Habitaciones</div>
                </div>
                <div className="text-center">
                  <Bath className="h-6 w-6 mx-auto mb-2 text-navy-600" />
                  <div className="font-semibold">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Baños</div>
                </div>
                <div className="text-center">
                  <Square className="h-6 w-6 mx-auto mb-2 text-navy-600" />
                  <div className="font-semibold">{property.area}</div>
                  <div className="text-sm text-gray-600">m²</div>
                </div>
                <div className="text-center">
                  <Car className="h-6 w-6 mx-auto mb-2 text-navy-600" />
                  <div className="font-semibold">{property.parking || 0}</div>
                  <div className="text-sm text-gray-600">Parking</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Descripción</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {property.description}
                </p>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Año de construcción:</span>{" "}
                    {property.yearBuilt || 'N/A'}
                  </div>
                  <div>
                    <span className="font-semibold">Tipo:</span>{" "}
                    {property.type === "venta" ? "Venta" : "Alquiler"}
                  </div>
                  <div>
                    <span className="font-semibold">Estado:</span>{" "}
                    {property.status === 'disponible' ? 'Disponible' : property.status}
                  </div>
                  <div>
                    <span className="font-semibold">Condición:</span>{" "}
                    {property.condition || 'Excelente'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Características</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(property.caracteristicas && property.caracteristicas.length > 0
                    ? property.caracteristicas
                    : defaultFeatures
                  ).map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-gold-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Services & Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Servicios y Comodidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(property.servicios && property.servicios.length > 0
                    ? property.servicios.map((servicio) => ({
                        icon: getIconForService(servicio),
                        label: servicio
                      }))
                    : defaultAmenities
                  ).map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <amenity.icon className="h-5 w-5 text-gold-600 mr-3" />
                      <span className="text-gray-700">{amenity.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-navy-800 mb-3">Información Adicional</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                    <div><span className="font-medium">ID Propiedad:</span> #{property.id.toString().padStart(6, '0')}</div>
                    <div><span className="font-medium">Precio por m²:</span> ${(property.pricePerSqm || Math.round(property.price / property.area)).toLocaleString()}</div>
                    <div><span className="font-medium">Estado:</span> {property.type === 'venta' ? 'Disponible para venta' : 'Disponible para alquiler'}</div>
                    <div><span className="font-medium">Fecha construcción:</span> {property.yearBuilt || 'No especificado'}</div>
                    <div><span className="font-medium">Tipo de propiedad:</span> {property.propertyType || 'Propiedad'}</div>
                    <div><span className="font-medium">Última actualización:</span> {property.lastUpdated || property.createdAt}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Agent Contact */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Contactar Agente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <img
                    src={defaultAgent.photo}
                    alt={defaultAgent.name}
                    className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                  />
                  <h3 className="font-semibold text-lg text-navy-800">
                    {defaultAgent.name}
                  </h3>
                  <p className="text-gray-600 text-sm">Agente Inmobiliario</p>
                </div>

                <div className="space-y-4">
                  <Button className="w-full bg-gold-500 hover:bg-gold-600">
                    <Phone className="mr-2 h-4 w-4" />
                    {defaultAgent.phone}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar Email
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    Agendar Visita
                  </Button>
                </div>

                <Separator className="my-6" />

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    ¿Interesado en esta propiedad?
                  </p>
                  <Button className="w-full bg-navy-800 hover:bg-navy-700">
                    Solicitar Información
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
