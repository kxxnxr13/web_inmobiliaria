import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Amenity {
  id: string;
  name: string;
  icon: string; // Nombre del icono de Lucide React
  category: 'comfort' | 'security' | 'connectivity' | 'utilities' | 'recreation' | 'transportation' | 'other';
  isActive: boolean;
  createdAt: string;
}

interface AmenitiesContextType {
  amenities: Amenity[];
  createAmenity: (amenityData: Omit<Amenity, 'id' | 'createdAt'>) => void;
  updateAmenity: (amenityId: string, amenityData: Partial<Amenity>) => void;
  deleteAmenity: (amenityId: string) => void;
  toggleAmenityStatus: (amenityId: string) => void;
  getActiveAmenities: () => Amenity[];
  getAmenitiesByCategory: (category: Amenity['category']) => Amenity[];
}

const AmenitiesContext = createContext<AmenitiesContextType | undefined>(undefined);

// Amenidades iniciales del sistema
const INITIAL_AMENITIES: Amenity[] = [
  // Comodidad
  {
    id: '1',
    name: 'Aire acondicionado',
    icon: 'Wind',
    category: 'comfort',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Calefacción',
    icon: 'Flame',
    category: 'comfort',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '3',
    name: 'Cocina integral',
    icon: 'ChefHat',
    category: 'comfort',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '4',
    name: 'Cocina equipada',
    icon: 'Utensils',
    category: 'comfort',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '5',
    name: 'Amueblado',
    icon: 'Armchair',
    category: 'comfort',
    isActive: true,
    createdAt: '2024-01-01'
  },
  
  // Seguridad
  {
    id: '6',
    name: 'Seguridad 24/7',
    icon: 'Shield',
    category: 'security',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '7',
    name: 'Cámaras de seguridad',
    icon: 'Camera',
    category: 'security',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '8',
    name: 'Portero',
    icon: 'UserCheck',
    category: 'security',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '9',
    name: 'Sistema de alarma',
    icon: 'ShieldAlert',
    category: 'security',
    isActive: true,
    createdAt: '2024-01-01'
  },
  
  // Conectividad
  {
    id: '10',
    name: 'Internet fibra óptica',
    icon: 'Wifi',
    category: 'connectivity',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '11',
    name: 'Internet incluido',
    icon: 'Globe',
    category: 'connectivity',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '12',
    name: 'TV por cable',
    icon: 'Tv',
    category: 'connectivity',
    isActive: true,
    createdAt: '2024-01-01'
  },
  
  // Servicios
  {
    id: '13',
    name: 'Electricidad',
    icon: 'Zap',
    category: 'utilities',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '14',
    name: 'Agua potable',
    icon: 'Droplets',
    category: 'utilities',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '15',
    name: 'Gas natural',
    icon: 'Flame',
    category: 'utilities',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '16',
    name: 'Lavandería',
    icon: 'Shirt',
    category: 'utilities',
    isActive: true,
    createdAt: '2024-01-01'
  },
  
  // Recreación
  {
    id: '17',
    name: 'Piscina',
    icon: 'Waves',
    category: 'recreation',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '18',
    name: 'Gimnasio',
    icon: 'Dumbbell',
    category: 'recreation',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '19',
    name: 'Jardín privado',
    icon: 'Trees',
    category: 'recreation',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '20',
    name: 'Terraza',
    icon: 'Building',
    category: 'recreation',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '21',
    name: 'Balcón',
    icon: 'Home',
    category: 'recreation',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '22',
    name: 'Área de BBQ',
    icon: 'ChefHat',
    category: 'recreation',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '23',
    name: 'Salón comunal',
    icon: 'Users',
    category: 'recreation',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '24',
    name: 'Área de juegos',
    icon: 'Gamepad2',
    category: 'recreation',
    isActive: true,
    createdAt: '2024-01-01'
  },
  
  // Transporte
  {
    id: '25',
    name: 'Estacionamiento',
    icon: 'Car',
    category: 'transportation',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '26',
    name: 'Garaje',
    icon: 'Warehouse',
    category: 'transportation',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '27',
    name: 'Transporte público cercano',
    icon: 'Bus',
    category: 'transportation',
    isActive: true,
    createdAt: '2024-01-01'
  }
];

export const AmenitiesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [amenities, setAmenities] = useState<Amenity[]>(INITIAL_AMENITIES);

  // Cargar amenidades desde localStorage al inicializar
  useEffect(() => {
    const savedAmenities = localStorage.getItem('amenities_data');
    const needsReset = localStorage.getItem('amenities_reset_needed');
    
    if (needsReset !== 'false' && savedAmenities) {
      // Limpiar localStorage corrupto una sola vez
      localStorage.removeItem('amenities_data');
      localStorage.setItem('amenities_reset_needed', 'false');
      console.log('Amenities data cleared, loading fresh initial amenities');
      setAmenities(INITIAL_AMENITIES);
    } else if (savedAmenities && needsReset === 'false') {
      try {
        const parsedAmenities = JSON.parse(savedAmenities);
        setAmenities(parsedAmenities);
        console.log('Amenities loaded from localStorage:', parsedAmenities.length);
      } catch (error) {
        console.error('Error loading amenities from localStorage:', error);
        setAmenities(INITIAL_AMENITIES);
      }
    } else {
      console.log('Loading initial amenities for first time');
      setAmenities(INITIAL_AMENITIES);
      localStorage.setItem('amenities_reset_needed', 'false');
    }
  }, []);

  // Guardar amenidades en localStorage cuando cambie
  useEffect(() => {
    if (amenities.length > 0) {
      localStorage.setItem('amenities_data', JSON.stringify(amenities));
      console.log('Amenities saved to localStorage:', amenities.length, 'amenities');
    }
  }, [amenities]);

  const createAmenity = (amenityData: Omit<Amenity, 'id' | 'createdAt'>) => {
    const newAmenity: Amenity = {
      ...amenityData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAmenities(prev => [...prev, newAmenity]);
  };

  const updateAmenity = (amenityId: string, amenityData: Partial<Amenity>) => {
    setAmenities(prev => 
      prev.map(amenity => 
        amenity.id === amenityId 
          ? { ...amenity, ...amenityData }
          : amenity
      )
    );
  };

  const deleteAmenity = (amenityId: string) => {
    setAmenities(prev => prev.filter(amenity => amenity.id !== amenityId));
  };

  const toggleAmenityStatus = (amenityId: string) => {
    setAmenities(prev => 
      prev.map(amenity => 
        amenity.id === amenityId 
          ? { ...amenity, isActive: !amenity.isActive }
          : amenity
      )
    );
  };

  const getActiveAmenities = (): Amenity[] => {
    return amenities.filter(amenity => amenity.isActive);
  };

  const getAmenitiesByCategory = (category: Amenity['category']): Amenity[] => {
    return amenities.filter(amenity => amenity.category === category && amenity.isActive);
  };

  const value: AmenitiesContextType = {
    amenities,
    createAmenity,
    updateAmenity,
    deleteAmenity,
    toggleAmenityStatus,
    getActiveAmenities,
    getAmenitiesByCategory
  };

  return (
    <AmenitiesContext.Provider value={value}>
      {children}
    </AmenitiesContext.Provider>
  );
};

export const useAmenities = () => {
  const context = useContext(AmenitiesContext);
  if (context === undefined) {
    throw new Error('useAmenities must be used within an AmenitiesProvider');
  }
  return context;
};
