import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchPropertyById, updateProperty, PropertyInput } from '../api/propertyService';
import PropertyForm from './PropertyForm';

const PropertyEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [property, setProperty] = useState<PropertyInput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getPropertyDetails = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                const propertyData = await fetchPropertyById(parseInt(id));

                // Convert API property to the format expected by the form
                setProperty({
                    title: propertyData.title,
                    description: propertyData.description,
                    pricePerNight: propertyData.pricePerNight,
                    maxGuests: propertyData.maxGuests,
                    bedrooms: propertyData.bedrooms,
                    bathrooms: propertyData.bathrooms,
                    propertyType: propertyData.propertyType,
                    amenities: propertyData.amenities,
                    cleaningFee: propertyData.cleaningFee,
                    cancellationPolicy: propertyData.cancellationPolicy,
                    houseRules: propertyData.houseRules,
                    location: {
                        country: propertyData.location.country,
                        city: propertyData.location.city,
                        state: propertyData.location.state,
                        zipCode: propertyData.location.zipCode,
                        address: propertyData.location.address,
                        latitude: propertyData.location.latitude,
                        longitude: propertyData.location.longitude
                    }
                });
                setError(null);
            } catch (err) {
                console.error(`Error fetching property ${id}:`, err);
                setError('Failed to load property details. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        getPropertyDetails();
    }, [id]);

    const handleSubmit = async (data: PropertyInput) => {
        if (!id) return;

        setIsSaving(true);
        setError(null);

        try {
            await updateProperty(parseInt(id), data);
            // Redirect to the property details page
            navigate(`/property/${id}`);
        } catch (err) {
            console.error(`Error updating property ${id}:`, err);
            setError('Failed to update property. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error && !property) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center text-blue-500 hover:text-blue-700"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Go back
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-6"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to property
            </button>

            <h1 className="text-3xl font-bold mb-6">Edit Property</h1>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {property && (
                <PropertyForm
                    initialData={property}
                    onSubmit={handleSubmit}
                    isLoading={isSaving}
                    submitButtonText="Save Changes"
                />
            )}
        </div>
    );
};

export default PropertyEditPage;