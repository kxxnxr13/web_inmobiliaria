import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  parking?: number;
  yearBuilt?: number;
  type: 'venta' | 'alquiler';
  status: 'disponible' | 'vendida' | 'alquilada';
  imageUrl: string;
  createdAt: string;
  adminId: string;
  featured?: boolean;
  amenities?: string[];
  pricePerSqm?: number;
  condition?: string;
  propertyType?: string;
  lastUpdated?: string;
}

interface PropertiesContextType {
  properties: Property[];
  createProperty: (propertyData: Omit<Property, 'id' | 'createdAt' | 'lastUpdated'>) => void;
  updateProperty: (propertyId: string, propertyData: Partial<Property>) => void;
  deleteProperty: (propertyId: string) => void;
  updatePropertyStatus: (propertyId: string, status: Property['status']) => void;
  getPropertiesByAdmin: (adminId: string) => Property[];
  getFeaturedProperties: () => Property[];
  getAvailableProperties: () => Property[];
  assignPropertiesToNewAdmin: (adminId: string) => void;
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);

// Datos iniciales combinando ambas fuentes
const INITIAL_PROPERTIES: Property[] = [
  // Propiedades del PropertyManagement
  {
    id: '1',
    title: 'Casa Moderna en Zona Residencial',
    description: 'Hermosa casa de 3 habitaciones con jardín privado, perfecta para familias.',
    price: 350000,
    location: 'Zona Norte, Ciudad',
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    parking: 2,
    yearBuilt: 2020,
    type: 'venta',
    status: 'disponible',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
    createdAt: '2024-01-10',
    lastUpdated: '2024-01-10',
    adminId: 'general',
    featured: true,
    amenities: ['Aire acondicionado', 'Cocina integral', 'Jardín privado', 'Seguridad 24/7'],
    pricePerSqm: Math.round(350000 / 150),
    condition: 'Excelente',
    propertyType: 'Casa'
  },
  {
    id: '2',
    title: 'Apartamento Céntrico',
    description: 'Moderno apartamento en el centro de la ciudad con excelente ubicación.',
    price: 1200,
    location: 'Centro, Ciudad',
    bedrooms: 2,
    bathrooms: 1,
    area: 80,
    parking: 1,
    yearBuilt: 2019,
    type: 'alquiler',
    status: 'disponible',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    createdAt: '2024-01-15',
    lastUpdated: '2024-01-15',
    adminId: '2',
    featured: false,
    amenities: ['Vista al océano', 'Gimnasio', 'Concierge 24/7'],
    pricePerSqm: Math.round(1200 / 80),
    condition: 'Como nuevo',
    propertyType: 'Apartamento'
  },
  // Propiedades adicionales de Properties.tsx
  {
    id: '3',
    title: 'Casa Familiar Los Jardines',
    description: 'Amplia casa familiar con jardín privado y piscina, perfecta para familias grandes. Zona residencial tranquila.',
    price: 320000,
    location: 'Zona Este, Ciudad',
    bedrooms: 5,
    bathrooms: 4,
    area: 220,
    parking: 3,
    yearBuilt: 2021,
    type: 'venta',
    status: 'disponible',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
    createdAt: '2024-01-13',
    lastUpdated: '2024-01-13',
    adminId: 'general',
    featured: true,
    amenities: ['Piscina privada', 'Jardín amplio', 'Cuarto de juegos', 'Oficina en casa', 'Terraza techada'],
    pricePerSqm: Math.round(320000 / 220),
    condition: 'Nuevo',
    propertyType: 'Casa'
  },
  {
    id: '4',
    title: 'Penthouse Ejecutivo Premium',
    description: 'Lujoso penthouse en el corazón de la ciudad con vistas panorámicas de 360 grados y amenidades premium.',
    price: 2500,
    location: 'Zona Centro, Ciudad',
    bedrooms: 3,
    bathrooms: 3,
    area: 150,
    parking: 2,
    yearBuilt: 2022,
    type: 'alquiler',
    status: 'disponible',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    createdAt: '2024-01-12',
    lastUpdated: '2024-01-12',
    adminId: '2',
    featured: false,
    amenities: ['Terraza panorámica', 'Jacuzzi privado', 'Smart home', 'Cocina gourmet', 'Valet parking'],
    pricePerSqm: Math.round(2500 / 150),
    condition: 'Nuevo',
    propertyType: 'Penthouse'
  },
  {
    id: '5',
    title: 'Casa Tradicional Renovada',
    description: 'Casa tradicional completamente renovada con materiales de primera calidad y diseño contemporáneo.',
    price: 195000,
    location: 'Zona Oeste, Ciudad',
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    parking: 2,
    yearBuilt: 2018,
    type: 'venta',
    status: 'disponible',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
    createdAt: '2024-01-11',
    lastUpdated: '2024-01-11',
    adminId: 'general',
    featured: false,
    amenities: ['Pisos de madera', 'Cocina remodelada', 'Baños renovados', 'Patio trasero', 'Chimenea'],
    pricePerSqm: Math.round(195000 / 140),
    condition: 'Renovado',
    propertyType: 'Casa'
  },
  {
    id: '6',
    title: 'Apartamento Ejecutivo Moderno',
    description: 'Cómodo apartamento ideal para profesionales, completamente amueblado y listo para habitar.',
    price: 1200,
    location: 'Zona Sur, Ciudad',
    bedrooms: 1,
    bathrooms: 1,
    area: 65,
    parking: 1,
    yearBuilt: 2020,
    type: 'alquiler',
    status: 'disponible',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    createdAt: '2024-01-10',
    lastUpdated: '2024-01-10',
    adminId: '2',
    featured: false,
    amenities: ['Completamente amueblado', 'Internet incluido', 'Lavandería', 'Portero', 'Área social'],
    pricePerSqm: Math.round(1200 / 65),
    condition: 'Excelente',
    propertyType: 'Apartamento'
  },
  {
    id: '7',
    title: 'Villa de Lujo con Piscina Infinita',
    description: 'Exclusiva villa de lujo con piscina infinita, sala de cine, gimnasio privado y todas las comodidades modernas.',
    price: 450000,
    location: 'Zona Norte, Ciudad',
    bedrooms: 6,
    bathrooms: 5,
    area: 350,
    parking: 4,
    yearBuilt: 2023,
    type: 'venta',
    status: 'disponible',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
    createdAt: '2024-01-09',
    lastUpdated: '2024-01-09',
    adminId: 'general',
    featured: true,
    amenities: ['Piscina infinita', 'Sala de cine', 'Gimnasio privado', 'Wine cellar', 'Smart home', 'Jardín paisajista'],
    pricePerSqm: Math.round(450000 / 350),
    condition: 'Nuevo',
    propertyType: 'Villa'
  },
  {
    id: '8',
    title: 'Apartamento Familiar Espacioso',
    description: 'Perfecto para familias con niños, cerca de colegios y parques. Amplio y luminoso con excelente distribución.',
    price: 1600,
    location: 'Zona Este, Ciudad',
    bedrooms: 3,
    bathrooms: 2,
    area: 110,
    parking: 2,
    yearBuilt: 2019,
    type: 'alquiler',
    status: 'disponible',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    createdAt: '2024-01-08',
    lastUpdated: '2024-01-08',
    adminId: '2',
    featured: false,
    amenities: ['Área de juegos', 'Cerca de colegios', 'Parque infantil', 'Salón comunal', 'Zona BBQ'],
    pricePerSqm: Math.round(1600 / 110),
    condition: 'Muy bueno',
    propertyType: 'Apartamento'
  },
  {
    id: '9',
    title: 'Casa Minimalista Arquitectónica',
    description: 'Diseño minimalista contemporáneo con acabados premium, grandes ventanales y espacios abiertos llenos de luz natural.',
    price: 275000,
    location: 'Zona Centro, Ciudad',
    bedrooms: 3,
    bathrooms: 3,
    area: 160,
    parking: 2,
    yearBuilt: 2021,
    type: 'venta',
    status: 'disponible',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
    createdAt: '2024-01-07',
    lastUpdated: '2024-01-07',
    adminId: 'general',
    featured: false,
    amenities: ['Diseño minimalista', 'Grandes ventanales', 'Espacios abiertos', 'Domótica', 'Terraza verde'],
    pricePerSqm: Math.round(275000 / 160),
    condition: 'Como nuevo',
    propertyType: 'Casa'
  },
  {
    id: '10',
    title: 'Loft Industrial Convertido',
    description: 'Único loft industrial completamente renovado en zona artística. Techos altos, vigas expuestas y diseño urbano moderno.',
    price: 2200,
    location: 'Zona Artística, Ciudad',
    bedrooms: 2,
    bathrooms: 2,
    area: 130,
    parking: 1,
    yearBuilt: 2020,
    type: 'alquiler',
    status: 'disponible',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    createdAt: '2024-01-06',
    lastUpdated: '2024-01-06',
    adminId: '2',
    featured: false,
    amenities: ['Techos altos', 'Vigas expuestas', 'Diseño industrial', 'Zona artística', 'Estudios cercanos'],
    pricePerSqm: Math.round(2200 / 130),
    condition: 'Renovado',
    propertyType: 'Loft'
  },
  {
    id: '11',
    title: 'Casa Ecológica Sostenible',
    description: 'Casa ecológica con paneles solares, sistema de recolección de agua lluvia y materiales sostenibles.',
    price: 385000,
    location: 'Zona Verde, Ciudad',
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    parking: 2,
    yearBuilt: 2022,
    type: 'venta',
    status: 'disponible',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
    createdAt: '2024-01-05',
    lastUpdated: '2024-01-05',
    adminId: 'general',
    featured: true,
    amenities: ['Paneles solares', 'Recolección agua lluvia', 'Materiales ecológicos', 'Huerto orgánico', 'Certificación LEED'],
    pricePerSqm: Math.round(385000 / 200),
    condition: 'Nuevo',
    propertyType: 'Casa Ecológica'
  },
  {
    id: '12',
    title: 'Dúplex Moderno Vista Ciudad',
    description: 'Elegante dúplex en dos niveles con vista panorámica de la ciudad. Diseño moderno y acabados de lujo.',
    price: 1950,
    location: 'Zona Alta, Ciudad',
    bedrooms: 3,
    bathrooms: 2,
    area: 125,
    parking: 2,
    yearBuilt: 2021,
    type: 'alquiler',
    status: 'disponible',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    createdAt: '2024-01-04',
    lastUpdated: '2024-01-04',
    adminId: '2',
    featured: false,
    amenities: ['Vista panorámica', 'Dos niveles', 'Acabados de lujo', 'Terraza privada', 'Estudio en segundo piso'],
    pricePerSqm: Math.round(1950 / 125),
    condition: 'Como nuevo',
    propertyType: 'Dúplex'
  }
];

export const PropertiesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);

  // Cargar propiedades desde localStorage al inicializar
  useEffect(() => {
    const savedProperties = localStorage.getItem('properties_data');
    if (savedProperties) {
      setProperties(JSON.parse(savedProperties));
    }
  }, []);

  // Guardar propiedades en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('properties_data', JSON.stringify(properties));
  }, [properties]);

  const createProperty = (propertyData: Omit<Property, 'id' | 'createdAt' | 'lastUpdated'>) => {
    const newProperty: Property = {
      ...propertyData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      pricePerSqm: propertyData.area ? Math.round(propertyData.price / propertyData.area) : 0,
      amenities: propertyData.amenities || [],
      condition: propertyData.condition || 'Bueno',
      propertyType: propertyData.propertyType || 'Casa'
    };

    setProperties(prev => [...prev, newProperty]);
  };

  const updateProperty = (propertyId: string, propertyData: Partial<Property>) => {
    setProperties(prev => 
      prev.map(property => 
        property.id === propertyId 
          ? { 
              ...property, 
              ...propertyData, 
              lastUpdated: new Date().toISOString().split('T')[0],
              pricePerSqm: propertyData.price && propertyData.area ? Math.round(propertyData.price / propertyData.area) : property.pricePerSqm
            }
          : property
      )
    );
  };

  const deleteProperty = (propertyId: string) => {
    setProperties(prev => prev.filter(property => property.id !== propertyId));
  };

  const updatePropertyStatus = (propertyId: string, status: Property['status']) => {
    setProperties(prev => 
      prev.map(property => 
        property.id === propertyId 
          ? { ...property, status, lastUpdated: new Date().toISOString().split('T')[0] }
          : property
      )
    );
  };

  const getPropertiesByAdmin = (adminId: string): Property[] => {
    return properties.filter(property => property.adminId === adminId);
  };

  const getFeaturedProperties = (): Property[] => {
    return properties.filter(property => property.featured && property.status === 'disponible');
  };

  const getAvailableProperties = (): Property[] => {
    return properties.filter(property => property.status === 'disponible');
  };

  const value: PropertiesContextType = {
    properties,
    createProperty,
    updateProperty,
    deleteProperty,
    updatePropertyStatus,
    getPropertiesByAdmin,
    getFeaturedProperties,
    getAvailableProperties
  };

  return (
    <PropertiesContext.Provider value={value}>
      {children}
    </PropertiesContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertiesContext);
  if (context === undefined) {
    throw new Error('useProperties must be used within a PropertiesProvider');
  }
  return context;
};
