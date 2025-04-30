// src/api/propertyService.ts

// Define interfaces to match your API structure
export interface ApiProperty {
    propertyID: number;
    hostID: number;
    locationID: number;
    title: string;
    description: string;
    pricePerNight: number;
    maxGuests: number;
    bedrooms: number;
    bathrooms: number;
    propertyType: string;
    amenities: string;
    isActive: boolean;
    dateListed: string;
    cleaningFee: number;
    cancellationPolicy: string;
    houseRules: string;
    host: {
        userID: number;
        firstname: string;
        lastname: string;
        email: string;
        password: string;
        phone: string;
        dateRegistered: string;
        isHost: boolean;
        profilePicture: string;
        bio: string;
    };
    location: {
        locationID: number;
        country: string;
        city: string;
        state: string;
        zipCode: string;
        address: string;
        latitude: number;
        longitude: number;
    };
    propertyImages: Array<{
        imageID: number;
        propertyID: number;
        imageUrl: string;
        description: string;
    }> | null;
    bookings: any[] | null;
    reviews: any[] | null;
    availabilities: any[] | null;
}

// Location interface for creating/updating properties
export interface LocationInput {
    country: string;
    city: string;
    state: string;
    zipCode: string;
    address: string;
    latitude: number;
    longitude: number;
}

// Property interface for creating/updating
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

// Base URL for your API
const API_BASE_URL = 'https://localhost:7144/api';

/**
 * Fetch all properties from the API
 * @returns {Promise<ApiProperty[]>} Promise containing the property data
 */
export const fetchProperties = async (): Promise<ApiProperty[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/apiproperties`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching properties:", error);
        throw error;
    }
};

/**
 * Fetch a single property by ID
 * @param {number} propertyId - The ID of the property to fetch
 * @returns {Promise<ApiProperty>} Promise containing the property data
 */
export const fetchPropertyById = async (propertyId: number): Promise<ApiProperty> => {
    try {
        const response = await fetch(`${API_BASE_URL}/apiproperties/${propertyId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching property ${propertyId}:`, error);
        throw error;
    }
};

/**
 * Search properties with filters
 * @param {string} location - Location to search for
 * @param {number} guests - Number of guests
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {Promise<ApiProperty[]>} Promise containing the filtered properties
 */
export const searchProperties = async (
    location?: string,
    guests?: number,
    minPrice?: number,
    maxPrice?: number
): Promise<ApiProperty[]> => {
    try {
        // Build query string
        const params = new URLSearchParams();
        if (location) params.append('location', location);
        if (guests) params.append('guests', guests.toString());
        if (minPrice) params.append('minPrice', minPrice.toString());
        if (maxPrice) params.append('maxPrice', maxPrice.toString());

        const response = await fetch(`${API_BASE_URL}/apiproperties/search?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error searching properties:", error);
        throw error;
    }
};

/**
 * Create a new property
 * @param {PropertyInput} propertyData - The property data to create
 * @returns {Promise<ApiProperty>} Promise containing the created property
 */
export const createProperty = async (propertyData: PropertyInput): Promise<ApiProperty> => {
    try {
        const response = await fetch(`${API_BASE_URL}/apiproperties`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(propertyData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating property:', error);
        throw error;
    }
};

/**
 * Update an existing property
 * @param {number} propertyId - The ID of the property to update
 * @param {PropertyInput} propertyData - The updated property data
 * @returns {Promise<void>} Promise that resolves when the update is complete
 */
export const updateProperty = async (
    propertyId: number,
    propertyData: PropertyInput
): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/apiproperties/${propertyId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ propertyID: propertyId, ...propertyData }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error updating property ${propertyId}:`, error);
        throw error;
    }
};

/**
 * Delete a property
 * @param {number} propertyId - The ID of the property to delete
 * @returns {Promise<void>} Promise that resolves when the deletion is complete
 */
export const deleteProperty = async (propertyId: number): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/apiproperties/${propertyId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error deleting property ${propertyId}:`, error);
        throw error;
    }
};

/**
 * Upload property images
 * @param {number} propertyId - The ID of the property to attach images to
 * @param {FormData} formData - FormData containing the images
 * @returns {Promise<void>} Promise that resolves when the upload is complete
 */
export const uploadPropertyImages = async (
    propertyId: number,
    formData: FormData
): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/apiproperties/${propertyId}/images`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error uploading images for property ${propertyId}:`, error);
        throw error;
    }
};