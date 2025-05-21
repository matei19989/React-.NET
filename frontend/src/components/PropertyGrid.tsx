import React, { useContext, useEffect, useState } from 'react';
import PropertyCard, { PropertyData } from './PropertyCard';
import { AppResetContext } from './NavBar';
// Import API functions with proper TypeScript types
import { fetchProperties, ApiProperty } from '../api/propertyService';

interface PropertyGridProps {
    destination?: string;
    checkIn?: Date | null;
    checkOut?: Date | null;
    totalGuests?: number;
}

// Define the type for the context
interface AppResetContextType {
    resetCounter: number;
    resetApp: () => void;
}

// Helper function to convert API property to frontend PropertyData
const convertApiPropertyToPropertyData = (apiProp: ApiProperty): PropertyData => {
    // Extract the image URLs from propertyImages
    const imageUrls = apiProp.propertyImages && apiProp.propertyImages.length > 0
        ? apiProp.propertyImages.map(img => img.imageUrl)
        : ['https://via.placeholder.com/500x500?text=No+Image'];

    return {
        id: apiProp.propertyID.toString(),
        title: apiProp.title,
        location: `${apiProp.location.city}, ${apiProp.location.state}`,
        price: apiProp.pricePerNight,
        rating: 4.8, // Default rating
        reviewCount: 0, // Default review count
        images: imageUrls,
        propertyType: apiProp.propertyType,
        isSuperhost: false, // Default value
    };
};

const PropertyGrid: React.FC<PropertyGridProps> = ({
    destination,
    checkIn,
    checkOut,
    totalGuests
}) => {
    const [properties, setProperties] = useState<PropertyData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currency, setCurrency] = useState('USD');

    // Safely access context with fallback values
    const resetContext = useContext(AppResetContext);
    const resetCounter = resetContext ? resetContext.resetCounter : 0;

    // Get currency from localStorage
    useEffect(() => {
        const storedCurrency = localStorage.getItem('preferredCurrency');
        if (storedCurrency) {
            setCurrency(storedCurrency);
        }
    }, []);

    // Fetch properties
    useEffect(() => {
        const getProperties = async () => {
            try {
                console.log("Fetching properties with params:", { destination, checkIn, checkOut, totalGuests });
                setLoading(true);
                
                // Fetch properties - this will use mock data if USE_MOCK_DATA is true in propertyService.ts
                const apiProperties = await fetchProperties();
                console.log(`Fetched ${apiProperties.length} properties`);

                // Convert API properties to your PropertyData format
                const convertedProperties: PropertyData[] = apiProperties.map(convertApiPropertyToPropertyData);

                // Filter by destination if provided
                let filteredProperties = convertedProperties;
                if (destination) {
                    filteredProperties = filteredProperties.filter(
                        property => property.location.toLowerCase().includes(destination.toLowerCase())
                    );
                    console.log(`Filtered to ${filteredProperties.length} properties matching destination: ${destination}`);
                }

                setProperties(filteredProperties);
                setError(null);
            } catch (err) {
                console.error("Error fetching properties:", err);
                setError("Error loading properties. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        getProperties();
    }, [destination, checkIn, checkOut, totalGuests, resetCounter]);

    // Show loading indicator
    if (loading) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
                <h2 className="text-xl font-medium text-gray-900 mb-2">Loading properties...</h2>
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Show error message if any
    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <p className="text-yellow-700">{error}</p>
                </div>

                <h1 className="text-2xl font-bold mb-6">
                    {destination
                        ? `Places to stay in ${destination}`
                        : 'Popular places to stay'}
                </h1>
            </div>
        );
    }

    // If no properties found after filtering
    if (properties.length === 0) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
                <h2 className="text-xl font-medium text-gray-900 mb-2">No properties found</h2>
                <p className="text-gray-500">Try adjusting your search filters or exploring a different area</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">
                {destination
                    ? `Places to stay in ${destination}`
                    : 'Popular places to stay'}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {properties.map(property => (
                    <PropertyCard
                        key={property.id}
                        property={property}
                        currency={currency}
                    />
                ))}
            </div>
        </div>
    );
};

export default PropertyGrid;