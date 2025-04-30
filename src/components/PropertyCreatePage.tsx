import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty, PropertyInput, LocationInput } from '../api/propertyService';
import PropertyForm from './PropertyForm';

const PropertyCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const initialPropertyData: PropertyInput = {
        title: '',
        description: '',
        pricePerNight: 0,
        maxGuests: 1,
        bedrooms: 1,
        bathrooms: 1,
        propertyType: 'Apartment',
        amenities: '',
        cleaningFee: 0,
        cancellationPolicy: '',
        houseRules: '',
        location: {
            country: '',
            city: '',
            state: '',
            zipCode: '',
            address: '',
            latitude: 0,
            longitude: 0
        }
    };

    const handleSubmit = async (data: PropertyInput) => {
        setIsLoading(true);
        setError(null);

        try {
            // Use a fixed host ID for now - in a real app, this would come from authentication
            const hostId = 1;

            // Create the property
            const createdProperty = await createProperty({
                ...data,
                // In a real application, you'd include the hostID from the authenticated user
            });

            // Redirect to the property details page
            navigate(`/property/${createdProperty.propertyID}`);
        } catch (err) {
            console.error('Error creating property:', err);
            setError('Failed to create property. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">List Your Property</h1>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            <PropertyForm
                initialData={initialPropertyData}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                submitButtonText="Create Listing"
            />
        </div>
    );
};

export default PropertyCreatePage;