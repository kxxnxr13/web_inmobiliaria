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
  ChevronDown,
  ChevronUp,
  X,
  SortAsc,
  SortDesc,
  Home,
  DollarSign,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useProperties } from "@/contexts/PropertiesContext";
import { useState, useMemo, useEffect } from "react";

const Properties = () => {
  const { getAvailableProperties } = useProperties();
  const allProperties = getAvailableProperties();

  // Estados de búsqueda
  const [searchLocation, setSearchLocation] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchPriceRange, setSearchPriceRange] = useState("");
  const [searchSaleType, setSearchSaleType] = useState(""); // venta/alquiler
  const [searchBedrooms, setSearchBedrooms] = useState("");
  const [searchBathrooms, setSearchBathrooms] = useState("");
  const [searchAreaRange, setSearchAreaRange] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest, price-low, price-high, area-large, area-small
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 6;

  // Filtrar propiedades basado en criterios de búsqueda
  const filteredProperties = useMemo(() => {
    let filtered = allProperties;

    // Filtro por ubicación (búsqueda más flexible)
    if (searchLocation.trim()) {
      const searchTerm = searchLocation.toLowerCase();
      filtered = filtered.filter(property => {
        const title = property.title.toLowerCase();
        const location = property.location.toLowerCase();
        const description = property.description.toLowerCase();
        const characteristics = (property.caracteristicas || []).join(' ').toLowerCase();

        return title.includes(searchTerm) ||
               location.includes(searchTerm) ||
               description.includes(searchTerm) ||
               characteristics.includes(searchTerm);
      });
    }

    // Filtro por tipo de venta/alquiler
    if (searchSaleType) {
      filtered = filtered.filter(property => property.type === searchSaleType);
    }

    // Filtro por tipo de propiedad
    if (searchType) {
      filtered = filtered.filter(property => {
        const propertyType = property.propertyType?.toLowerCase() || '';
        return propertyType.includes(searchType.toLowerCase());
      });
    }

    // Filtro por rango de precios
    if (searchPriceRange) {
      filtered = filtered.filter(property => {
        const price = property.price;
        switch (searchPriceRange) {
          case "0-100k":
            return price >= 0 && price <= 100000;
          case "100k-300k":
            return price > 100000 && price <= 300000;
          case "300k-500k":
            return price > 300000 && price <= 500000;
          case "500k+":
            return price > 500000;
          default:
            return true;
        }
      });
    }

    // Filtro por habitaciones
    if (searchBedrooms) {
      const bedrooms = parseInt(searchBedrooms);
      filtered = filtered.filter(property => {
        if (searchBedrooms === "4+") {
          return property.bedrooms >= 4;
        }
        return property.bedrooms === bedrooms;
      });
    }

    // Filtro por baños
    if (searchBathrooms) {
      const bathrooms = parseInt(searchBathrooms);
      filtered = filtered.filter(property => {
        if (searchBathrooms === "3+") {
          return property.bathrooms >= 3;
        }
        return property.bathrooms === bathrooms;
      });
    }

    // Filtro por área
    if (searchAreaRange) {
      filtered = filtered.filter(property => {
        const area = property.area;
        switch (searchAreaRange) {
          case "0-100":
            return area >= 0 && area <= 100;
          case "100-150":
            return area > 100 && area <= 150;
          case "150-200":
            return area > 150 && area <= 200;
          case "200+":
            return area > 200;
          default:
            return true;
        }
      });
    }

    // Ordenamiento
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "area-large":
          return b.area - a.area;
        case "area-small":
          return a.area - b.area;
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return sorted;
  }, [allProperties, searchLocation, searchSaleType, searchType, searchPriceRange, searchBedrooms, searchBathrooms, searchAreaRange, sortBy]);

  // Calcular propiedades para la página actual
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const propertiesData = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);

  // Calcular total de páginas
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  // Resetear página cuando cambian los filtros
  const handleSearch = () => {
    setCurrentPage(1);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchLocation("");
    setSearchType("");
    setSearchPriceRange("");
    setSearchSaleType("");
    setSearchBedrooms("");
    setSearchBathrooms("");
    setSearchAreaRange("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Contar filtros activos
  const activeFiltersCount = [
    searchLocation,
    searchType,
    searchPriceRange,
    searchSaleType,
    searchBedrooms,
    searchBathrooms,
    searchAreaRange
  ].filter(Boolean).length;

  // Generar chips de filtros activos
  const getActiveFilterChips = () => {
    const chips = [];
    if (searchLocation) chips.push({ label: `Ubicación: ${searchLocation}`, clear: () => setSearchLocation("") });
    if (searchSaleType) chips.push({ label: `Tipo: ${searchSaleType === 'venta' ? 'Venta' : 'Alquiler'}`, clear: () => setSearchSaleType("") });
    if (searchType) chips.push({ label: `Propiedad: ${searchType}`, clear: () => setSearchType("") });
    if (searchPriceRange) chips.push({ label: `Precio: $${searchPriceRange.replace('k', ',000')}`, clear: () => setSearchPriceRange("") });
    if (searchBedrooms) chips.push({ label: `${searchBedrooms} hab`, clear: () => setSearchBedrooms("") });
    if (searchBathrooms) chips.push({ label: `${searchBathrooms} baños`, clear: () => setSearchBathrooms("") });
    if (searchAreaRange) chips.push({ label: `Área: ${searchAreaRange}m²`, clear: () => setSearchAreaRange("") });
    return chips;
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll hacia arriba cuando se cambie de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            {/* Filtros principales */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Buscar ubicación, características..."
                  className="h-12"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>

              {/* Filtro Venta/Alquiler */}
              <Select value={searchSaleType} onValueChange={setSearchSaleType}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Venta/Alquiler" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="venta">En Venta</SelectItem>
                  <SelectItem value="alquiler">En Alquiler</SelectItem>
                </SelectContent>
              </Select>

              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Tipo Propiedad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="loft">Loft</SelectItem>
                  <SelectItem value="duplex">Dúplex</SelectItem>
                  <SelectItem value="casa ecologica">Casa Ecológica</SelectItem>
                </SelectContent>
              </Select>

              <Select value={searchPriceRange} onValueChange={setSearchPriceRange}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Rango Precio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-100k">$0 - $100,000</SelectItem>
                  <SelectItem value="100k-300k">$100,000 - $300,000</SelectItem>
                  <SelectItem value="300k-500k">$300,000 - $500,000</SelectItem>
                  <SelectItem value="500k+">$500,000+</SelectItem>
                </SelectContent>
              </Select>

              <Button
                className="h-12 bg-gold-500 hover:bg-gold-600"
                onClick={handleSearch}
              >
                <Search className="mr-2 h-5 w-5" />
                Buscar
              </Button>
            </div>

            {/* Filtros avanzados colapsables */}
            <div className="border-t pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="mb-4"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtros Avanzados
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-gold-500 text-white">
                    {activeFiltersCount}
                  </Badge>
                )}
                {showAdvancedFilters ? (
                  <ChevronUp className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </Button>

              {showAdvancedFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  {/* Habitaciones */}
                  <Select value={searchBedrooms} onValueChange={setSearchBedrooms}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Habitaciones" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 habitación</SelectItem>
                      <SelectItem value="2">2 habitaciones</SelectItem>
                      <SelectItem value="3">3 habitaciones</SelectItem>
                      <SelectItem value="4+">4+ habitaciones</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Baños */}
                  <Select value={searchBathrooms} onValueChange={setSearchBathrooms}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Baños" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 baño</SelectItem>
                      <SelectItem value="2">2 baños</SelectItem>
                      <SelectItem value="3+">3+ baños</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Área */}
                  <Select value={searchAreaRange} onValueChange={setSearchAreaRange}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Área (m²)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-100">0 - 100 m²</SelectItem>
                      <SelectItem value="100-150">100 - 150 m²</SelectItem>
                      <SelectItem value="150-200">150 - 200 m²</SelectItem>
                      <SelectItem value="200+">200+ m²</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Ordenamiento */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Más recientes</SelectItem>
                      <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
                      <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
                      <SelectItem value="area-large">Área: mayor a menor</SelectItem>
                      <SelectItem value="area-small">Área: menor a mayor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Chips de filtros activos */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {getActiveFilterChips().map((chip, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                      {chip.label}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={chip.clear}
                      />
                    </Badge>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-red-500 hover:text-red-700"
                  >
                    Limpiar todos
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <span>
                  Mostrando {filteredProperties.length > 0 ? indexOfFirstProperty + 1 : 0}-{Math.min(indexOfLastProperty, filteredProperties.length)} de {filteredProperties.length} propiedades
                </span>
                {activeFiltersCount > 0 && (
                  <span className="text-gold-600 font-medium">
                    (filtradas de {allProperties.length} total)
                  </span>
                )}
                {filteredProperties.length > 0 && (
                  <div className="flex items-center text-xs text-gray-500 ml-4">
                    <SortAsc className="h-3 w-3 mr-1" />
                    Ordenado por: {
                      sortBy === "newest" ? "Más recientes" :
                      sortBy === "price-low" ? "Precio: menor a mayor" :
                      sortBy === "price-high" ? "Precio: mayor a menor" :
                      sortBy === "area-large" ? "Área: mayor a menor" :
                      "Área: menor a mayor"
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No se encontraron propiedades
              </h3>
              <p className="text-gray-500 mb-6">
                {searchLocation || searchType || searchPriceRange
                  ? "Intenta ajustar tus criterios de búsqueda"
                  : "No hay propiedades disponibles en este momento"}
              </p>
              {(searchLocation || searchType || searchPriceRange) && (
                <Button onClick={clearFilters} variant="outline">
                  Ver todas las propiedades
                </Button>
              )}
            </div>
          ) : (
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
                      {(property.caracteristicas || []).slice(0, 2).map((caracteristica, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {caracteristica}
                        </Badge>
                      ))}
                      {(property.caracteristicas || []).length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{(property.caracteristicas || []).length - 2} más
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
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Anterior
                </Button>

                {/* Botones de números de página */}
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  const isCurrentPage = pageNumber === currentPage;

                  // Mostrar solo páginas cercanas a la actual
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={pageNumber}
                        variant={isCurrentPage ? "default" : "outline"}
                        className={isCurrentPage ? "bg-navy-800" : ""}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    );
                  }

                  // Mostrar puntos suspensivos
                  if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <Button key={pageNumber} variant="outline" disabled>
                        ...
                      </Button>
                    );
                  }

                  return null;
                })}

                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Properties;
