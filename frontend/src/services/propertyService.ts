// src/api/propertyService.ts
import api from '../api/api';

// Complete property interface matching backend model
export interface ApiProperty {
  propertyID: number;
  hostID: number;
  title: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  amenities: string;
  isActive: boolean;
  dateListedd?: string;
  cleaningFee: number;
  cancellationPolicy: string;
  houseRules: string;
  location: {
    locationID?: number;
    country: string;
    city: string;
    state: string;
    zipCode: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  propertyImages?: {
    imageID?: number;
    propertyID?: number;
    imageUrl: string;
    description: string;
  }[];
  host?: {
    userID: number;
    firstname: string;
    lastname: string;
    email: string;
    isHost: boolean;
    profilePicture: string;
  };
}

// Property input for create/update operations
export interface PropertyInput {
  title: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  amenities: string;
  cleaningFee: number;
  cancellationPolicy: string;
  houseRules: string;
  location: LocationInput;
}

export interface LocationInput {
  country: string;
  city: string;
  state: string;
  zipCode: string;
  address: string;
  latitude: number;
  longitude: number;
}

/**
 * Fetch all properties from the API
 */
export const fetchProperties = async (): Promise<ApiProperty[]> => {
  try {
    const response = await api.get<ApiProperty[]>('/apiproperties');
    return response.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return mockProperties; // Fallback to mock data on error
  }
};

/**
 * Get a specific property by ID
 */
export const getProperty = async (id: number): Promise<ApiProperty> => {
  try {
    const response = await api.get<ApiProperty>(`/apiproperties/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching property ${id}:`, error);
    const mockProperty = mockProperties.find(p => p.propertyID === id);
    if (!mockProperty) throw new Error(`Property with ID ${id} not found`);
    return mockProperty;
  }
};

/**
 * Search for properties based on criteria
 */
export const searchProperties = async (params: any): Promise<ApiProperty[]> => {
  try {
    const response = await api.get<ApiProperty[]>('/apiproperties/search', { params });
    return response.data;
  } catch (error) {
    console.error("Error searching properties:", error);
    // Simple filtering logic for mock data
    return mockProperties.filter(p => {
      if (params.location && !p.location.city.toLowerCase().includes(params.location.toLowerCase())) {
        return false;
      }
      if (params.guests && p.maxGuests < params.guests) {
        return false;
      }
      return true;
    });
  }
};

/**
 * Delete a property by ID
 */
export const deleteProperty = async (id: number): Promise<void> => {
  try {
    await api.delete(`/apiproperties/${id}`);
  } catch (error) {
    console.error(`Error deleting property ${id}:`, error);
    throw error;
  }
};

/**
 * Fetch properties belonging to the current logged-in user
 */
export const fetchCurrentUserProperties = async (): Promise<ApiProperty[]> => {
  try {
    const response = await api.get<ApiProperty[]>('/apiproperties/current');
    return response.data;
  } catch (error) {
    console.error("Error fetching current user properties:", error);
    // For development, return filtered mock properties
    return mockProperties.filter(p => p.hostID === 1);
  }
};

/**
 * Create a new property
 */
export const createProperty = async (property: PropertyInput): Promise<ApiProperty> => {
  try {
    const response = await api.post<ApiProperty>('/apiproperties', property);
    return response.data;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
};

/**
 * Fetch property by ID (alias for getProperty)
 */
export const fetchPropertyById = async (id: number): Promise<ApiProperty> => {
  return getProperty(id);
};

/**
 * Update an existing property
 */
export const updateProperty = async (id: number, property: PropertyInput): Promise<void> => {
  try {
    // Create the full property object with the ID
    const fullProperty = {
      propertyID: id,
      ...property,
      hostID: 1, // This should come from auth context in real app
      isActive: true,
      locationID: 1 // This should be managed by the backend
    };
    
    await api.put(`/apiproperties/${id}`, fullProperty);
  } catch (error) {
    console.error(`Error updating property ${id}:`, error);
    throw error;
  }
};

// Mock data for development and fallback
const mockProperties: ApiProperty[] = [
  {
    propertyID: 1,
    hostID: 1,
    title: "Cozy Apartment in NY",
    description: "Experience the charm of New York City in this beautiful, centrally located apartment. This cozy space offers modern amenities with classic New York style, perfect for couples or small families looking to explore the city.",
    pricePerNight: 100.00,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    propertyType: "Apartment",
    amenities: "WiFi, TV, Air Conditioning, Kitchen, Washer, Dryer, Iron, Heating, Coffee Maker",
    isActive: true,
    cleaningFee: 20.00,
    cancellationPolicy: "Flexible - Full refund if cancelled at least 48 hours before check-in",
    houseRules: "No smoking, No pets, No parties or events, Check-in after 3PM",
    location: {
      locationID: 1,
      country: "USA",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      address: "123 Main St",
      latitude: 40.7128,
      longitude: -74.0060
    },
    propertyImages: [
      {
        imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80",
        description: "Living room with city view"
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1080&q=80",
        description: "Master bedroom"
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1080&q=80",
        description: "Modern kitchen"
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=1080&q=80",
        description: "Bathroom"
      }
    ]
  },
  {
    propertyID: 2,
    hostID: 1,
    title: "Luxury Downtown SF Loft",
    description: "Stay in the heart of San Francisco in this modern luxury loft. Featuring high ceilings, floor-to-ceiling windows, and designer furnishings.",
    pricePerNight: 175.00,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    propertyType: "Loft",
    amenities: "WiFi, Smart TV, Gym Access, Rooftop Terrace, Fully Equipped Kitchen, Washer/Dryer, Dishwasher",
    isActive: true,
    cleaningFee: 30.00,
    cancellationPolicy: "Moderate - Full refund if cancelled 5 days before check-in",
    houseRules: "No smoking, Quiet hours after 10PM, No pets",
    location: {
      locationID: 2,
      country: "USA",
      city: "San Francisco",
      state: "CA",
      zipCode: "94103",
      address: "456 Market St",
      latitude: 37.7749,
      longitude: -122.4194
    },
    propertyImages: [
      {
        imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1080&q=80",
        description: "Bedroom with city view"
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?auto=format&fit=crop&w=1080&q=80",
        description: "Kitchen and dining area"
      }
    ]
  }
];

// Currency conversion utilities
export const currencyRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79
};

export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to USD first (base currency)
  const usdAmount = amount / currencyRates[fromCurrency as keyof typeof currencyRates];
  
  // Convert from USD to target currency
  const convertedAmount = usdAmount * currencyRates[toCurrency as keyof typeof currencyRates];
  
  return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
};

export const getCurrencySymbol = (currency: string): string => {
  switch (currency) {
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'GBP': return '£';
    default: return '$';
  }
};

const propertyService = {
  fetchProperties,
  getProperty,
  fetchPropertyById,
  searchProperties,
  deleteProperty,
  fetchCurrentUserProperties,
  createProperty,
  updateProperty,
  getProperties: fetchProperties,
  convertCurrency,
  getCurrencySymbol
};

export default propertyService;