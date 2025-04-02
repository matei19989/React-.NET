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

// Base URL for your API
const API_BASE_URL = 'https://localhost:7144/api';

/**
 * Fetch all properties from the API
 * @returns {Promise<ApiProperty[]>} Promise containing the property data
 */
// @ts-ignore
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

// @ts-ignore
/**
 * Fetch a single property by ID
 * @param {number} propertyId - The ID of the property to fetch
 * @returns {Promise<ApiProperty>} Promise containing the property data
 */
// @ts-ignore
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