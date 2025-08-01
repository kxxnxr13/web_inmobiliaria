import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  Share2,
  Car,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useProperties } from "@/contexts/PropertiesContext";



const Properties = () => {
  const { getAvailableProperties } = useProperties();
  const propertiesData = getAvailableProperties();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Page Header */}
      <section className="bg-navy-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Propiedades Disponibles
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Explora nuestra amplia selección de propiedades en venta y
              alquiler. Encuentra el hogar perfecto que se adapte a tu estilo de
              vida y presupuesto.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <Input placeholder="Buscar por ubicación..." className="h-12" />
              </div>
              <Select>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Precio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-100k">$0 - $100,000</SelectItem>
                  <SelectItem value="100k-300k">$100,000 - $300,000</SelectItem>
                  <SelectItem value="300k-500k">$300,000 - $500,000</SelectItem>
                  <SelectItem value="500k+">$500,000+</SelectItem>
                </SelectContent>
              </Select>
              <Button className="h-12 bg-gold-500 hover:bg-gold-600">
                <Search className="mr-2 h-5 w-5" />
                Buscar
              </Button>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Mostrando {propertiesData.length} propiedades
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Más Filtros
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propertiesData.map((property) => (
              <Card
                key={property.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={property.imageUrl}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className={`absolute top-4 left-4 ${
                    property.type === "venta" ? "bg-green-500" : "bg-blue-500"
                  }`}>
                    {property.type === "venta" ? "En Venta" : "En Alquiler"}
                  </Badge>
                  {property.featured && (
                    <Badge className="absolute top-4 left-20 bg-gold-500">
                      Destacada
                    </Badge>
                  )}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/80 hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/80 hover:bg-white">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold text-navy-800 line-clamp-2">
                      {property.title}
                    </CardTitle>
                    <div className="text-xl font-bold text-gold-600 ml-2">
                      ${property.price.toLocaleString()}
                      {property.type === "alquiler" && (
                        <span className="text-sm text-gray-500">/mes</span>
                      )}
                    </div>
                  </div>
                  <CardDescription className="flex items-center text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </CardDescription>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {property.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      {property.bedrooms} hab
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      {property.bathrooms} baños
                    </div>
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      {property.area} m²
                    </div>
                    <div className="flex items-center">
                      <Car className="h-4 w-4 mr-1" />
                      {property.parking || 0} parking
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-3 grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {property.yearBuilt || 'N/A'}
                    </div>
                    <div className="text-right">
                      ${property.pricePerSqm || 0}/m²
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="text-xs font-medium text-navy-600 mb-2">Estado: {property.condition || 'N/A'}</div>
                    <div className="text-xs font-medium text-navy-600 mb-2">Tipo: {property.propertyType || 'N/A'}</div>
                    <div className="flex flex-wrap gap-1">
                      {(property.amenities || []).slice(0, 2).map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {(property.amenities || []).length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{(property.amenities || []).length - 2} más
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mb-3">
                    Última actualización: {property.lastUpdated || property.createdAt}
                  </div>
                  <Link to={`/propiedad/${property.id}`}>
                    <Button className="w-full bg-navy-800 hover:bg-navy-700">
                      Ver Detalles Completos
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              <Button variant="outline" disabled>
                Anterior
              </Button>
              <Button className="bg-navy-800">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">...</Button>
              <Button variant="outline">8</Button>
              <Button variant="outline">Siguiente</Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Properties;
