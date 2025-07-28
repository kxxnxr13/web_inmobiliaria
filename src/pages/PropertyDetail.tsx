import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
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
} from "lucide-react";

// Datos de ejemplo de propiedades
const propertyData = {
  1: {
    id: 1,
    title: "Casa Moderna Residencial Los Pinos",
    price: 285000,
    type: "venta",
    location: "Zona Norte, Ciudad",
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    parking: 2,
    yearBuilt: 2020,
    description: "Hermosa casa moderna de dos plantas ubicada en el exclusivo residencial Los Pinos. Esta propiedad cuenta con acabados de lujo, ampios espacios y excelente ubicación cerca de centros comerciales, colegios y hospitales.",
    features: [
      "Aire acondicionado central",
      "Cocina integral",
      "Jardín privado",
      "Seguridad 24/7",
      "Alberca comunitaria",
      "Área de BBQ",
      "Estacionamiento techado",
      "Cuarto de servicio"
    ],
    amenities: [
      { icon: Wifi, label: "Internet de alta velocidad" },
      { icon: Zap, label: "Paneles solares" },
      { icon: Droplets, label: "Sistema de riego" },
      { icon: Shield, label: "Sistema de seguridad" },
      { icon: Trees, label: "Áreas verdes" },
      { icon: Utensils, label: "Cocina equipada" },
      { icon: Wind, label: "Ventilación natural" },
      { icon: Car, label: "Estacionamiento" }
    ],
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    agent: {
      name: "María González",
      phone: "+1 (555) 123-4567",
      email: "maria@inmobiliaria.com",
      photo: "/placeholder.svg"
    }
  },
  2: {
    id: 2,
    title: "Apartamento Moderno Vista al Mar",
    price: 1800,
    type: "alquiler",
    location: "Zona Costa, Ciudad",
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    parking: 1,
    yearBuilt: 2019,
    description: "Elegante apartamento con vista panorámica al mar, ubicado en edificio de lujo con amenidades exclusivas. Perfecto para profesionales o parejas que buscan confort y ubicación privilegiada.",
    features: [
      "Vista al océano",
      "Balcón amplio",
      "Gimnasio en el edificio",
      "Piscina infinity",
      "Concierge 24/7",
      "Sala de eventos",
      "Área de coworking",
      "Pet friendly"
    ],
    amenities: [
      { icon: Wifi, label: "WiFi incluido" },
      { icon: Zap, label: "Electricidad incluida" },
      { icon: Droplets, label: "Agua incluida" },
      { icon: Shield, label: "Seguridad privada" },
      { icon: Trees, label: "Terraza jardín" },
      { icon: Utensils, label: "Cocina moderna" },
      { icon: Wind, label: "Aire acondicionado" },
      { icon: Car, label: "Parqueadero asignado" }
    ],
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    agent: {
      name: "Carlos Rodríguez",
      phone: "+1 (555) 987-6543",
      email: "carlos@inmobiliaria.com",
      photo: "/placeholder.svg"
    }
  }
};

const PropertyDetail = () => {
  const { id } = useParams();
  const property = propertyData[id as keyof typeof propertyData];

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
        <Link to="/propiedades">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Propiedades
          </Button>
        </Link>
      </div>

      {/* Property Images Carousel */}
      <section className="container mx-auto px-4 mb-8">
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {property.images.map((image, index) => (
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
                      {index + 1} / {property.images.length}
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
                  <div className="font-semibold">{property.parking}</div>
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
                    {property.yearBuilt}
                  </div>
                  <div>
                    <span className="font-semibold">Tipo:</span>{" "}
                    {property.type === "venta" ? "Venta" : "Alquiler"}
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
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-gold-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <amenity.icon className="h-5 w-5 text-gold-600 mr-3" />
                      <span className="text-gray-700">{amenity.label}</span>
                    </div>
                  ))}
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
                    src={property.agent.photo}
                    alt={property.agent.name}
                    className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                  />
                  <h3 className="font-semibold text-lg text-navy-800">
                    {property.agent.name}
                  </h3>
                  <p className="text-gray-600 text-sm">Agente Inmobiliario</p>
                </div>

                <div className="space-y-4">
                  <Button className="w-full bg-gold-500 hover:bg-gold-600">
                    <Phone className="mr-2 h-4 w-4" />
                    {property.agent.phone}
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
