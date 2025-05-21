// src/api/propertyService.ts
import api from '../api/api';

// Define the property interface
export interface ApiProperty {
  propertyID: number;
  title: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  isActive: boolean;
  hostID?: number;
  location: {
    city: string;
    state: string;
    country: string;
  };
  propertyImages?: {
    imageUrl: string;
    description: string;
  }[];
  // Add other properties as needed
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
    // In real app, you'd want to get the user ID from auth context
    return mockProperties.filter(p => p.hostID === 1); // Assuming user ID 1 for mock data
  }
};

/**
 * Create a new property
 */
export const createProperty = async (property: Omit<ApiProperty, 'propertyID'>): Promise<ApiProperty> => {
  try {
    const response = await api.post<ApiProperty>('/apiproperties', property);
    return response.data;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
};

export const fetchPropertyById = async (id: number): Promise<ApiProperty> => {
  return getProperty(id); // Use the existing getProperty function
};

/**
 * Update an existing property
 */
export const updateProperty = async (id: number, property: ApiProperty): Promise<void> => {
  try {
    await api.put(`/apiproperties/${id}`, property);
  } catch (error) {
    console.error(`Error updating property ${id}:`, error);
    throw error;
  }
};

// Mock data for development and fallback
const mockProperties: ApiProperty[] = [
  {
    propertyID: 1,
    title: "Cozy Apartment in NY",
    description: "Experience the charm of New York City in this beautiful, centrally located apartment.",
    pricePerNight: 100.00,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    propertyType: "Apartment",
    isActive: true,
    hostID: 1,
    location: {
      city: "New York",
      country: "USA",
      state: "NY"
    },
    propertyImages: [
      {
        imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1080&q=80",
        description: "Living room with city view"
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1080&q=80",
        description: "Master bedroom"
      }
    ]
  },
  {
    propertyID: 2,
    title: "Luxury Downtown SF Loft",
    description: "Stay in the heart of San Francisco in this modern luxury loft.",
    pricePerNight: 175.00,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    propertyType: "Loft",
    isActive: true,
    hostID: 1,
    location: {
      city: "San Francisco",
      country: "USA",
      state: "CA"
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
const propertyService = {
  fetchProperties,
  getProperty,
  fetchPropertyById,
  searchProperties,
  deleteProperty,
  fetchCurrentUserProperties,
  createProperty,
  updateProperty,
  // Add this alias for compatibility
  getProperties: fetchProperties
};

export default propertyService;

