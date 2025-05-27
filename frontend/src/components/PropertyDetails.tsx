import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPropertyById, ApiProperty } from '../services/propertyService';
import { useAuth } from '../context/AuthContext';
import BookingCard from './BookingCard';
import { ArrowLeft, ArrowRight, Star, MapPin, Users, Bed, Bath, Home } from 'lucide-react';

interface PropertyImage {
    imageID: number;
    propertyID: number;
    imageUrl: string;
    description: string;
}

const PropertyDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [property, setProperty] = useState<ApiProperty | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currency, setCurrency] = useState('USD');

    // For image gallery
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        const storedCurrency = localStorage.getItem('preferredCurrency');
        if (storedCurrency) {
            setCurrency(storedCurrency);
        }
    }, []);

    useEffect(() => {
        const getPropertyDetails = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const propertyData = await fetchPropertyById(parseInt(id));
                setProperty(propertyData);
                setError(null);
            } catch (err) {
                console.error(`Error fetching property ${id}:`, err);
                setError('Failed to load property details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        getPropertyDetails();
    }, [id]);

    const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';

    // Next image in gallery
    const nextImage = () => {
        if (!property || !property.propertyImages) return;
        // @ts-ignore
        setActiveImageIndex((prevIndex) =>
            // @ts-ignore
            prevIndex === property.propertyImages.length - 1 ? 0 : prevIndex + 1
        );
    };

    // Previous image in gallery
    const prevImage = () => {
        if (!property || !property.propertyImages) return;
        // @ts-ignore
        setActiveImageIndex((prevIndex) =>
            // @ts-ignore
            prevIndex === 0 ? property.propertyImages.length - 1 : prevIndex - 1
        );
    };

    // Select a specific image
    const selectImage = (index: number) => {
        setActiveImageIndex(index);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <p className="text-red-700">{error || 'Property not found'}</p>
                </div>
                <Link to="/" className="inline-flex items-center text-blue-500 hover:text-blue-700">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to properties
                </Link>
            </div>
        );
    }

    // Get current image or use placeholder
    const images: PropertyImage[] = property.propertyImages || [];
    const currentImage = images.length > 0
        ? images[activeImageIndex].imageUrl
        : 'https://via.placeholder.com/1200x800?text=No+Image+Available';

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back button */}
            <Link to="/" className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to properties
            </Link>

            {/* Property Title */}
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>

            {/* Location */}
            <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="w-5 h-5 mr-1" />
                <span>{property.location.address}, {property.location.city}, {property.location.state}, {property.location.country}</span>
            </div>

            {/* Image Gallery */}
            <div className="relative mb-8">
                {/* Main Image */}
                <div className="rounded-xl overflow-hidden h-96 relative group">
                    <img
                        src={currentImage}
                        alt={images.length > 0 ? images[activeImageIndex].description : property.title}
                        className="w-full h-full object-cover"
                    />

                    {/* Navigation arrows - only show if multiple images */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition opacity-0 group-hover:opacity-100"
                                aria-label="Previous image"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition opacity-0 group-hover:opacity-100"
                                aria-label="Next image"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnail Navigation - only show if multiple images */}
                {images.length > 1 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                        {images.map((image, index) => (
                            <button
                                key={image.imageID}
                                onClick={() => selectImage(index)}
                                className={`flex-shrink-0 rounded-lg overflow-hidden h-20 w-20 border-2 transition ${
                                    activeImageIndex === index ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
                                }`}
                            >
                                <img
                                    src={image.imageUrl}
                                    alt={image.description}
                                    className="h-full w-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2">
                    {/* Property Description */}
                    <h2 className="text-2xl font-semibold mb-4">About this place</h2>
                    <p className="text-gray-700 mb-6">{property.description}</p>

                    {/* Property Features */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center">
                            <Home className="w-5 h-5 mr-2 text-gray-600" />
                            <span>{property.propertyType}</span>
                        </div>
                        <div className="flex items-center">
                            <Users className="w-5 h-5 mr-2 text-gray-600" />
                            <span>Max {property.maxGuests} guests</span>
                        </div>
                        <div className="flex items-center">
                            <Bed className="w-5 h-5 mr-2 text-gray-600" />
                            <span>{property.bedrooms} bedrooms</span>
                        </div>
                        <div className="flex items-center">
                            <Bath className="w-5 h-5 mr-2 text-gray-600" />
                            <span>{property.bathrooms} bathrooms</span>
                        </div>
                    </div>

                    {/* Amenities */}
                    <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        {property.amenities.split(',').map((amenity, index) => (
                            <div key={index} className="flex items-center">
                                <span className="mr-2">•</span>
                                <span>{amenity.trim()}</span>
                            </div>
                        ))}
                    </div>

                    {/* House Rules */}
                    <h3 className="text-xl font-semibold mb-3">House Rules</h3>
                    <p className="text-gray-700 mb-6">{property.houseRules}</p>

                    {/* Cancellation Policy */}
                    <h3 className="text-xl font-semibold mb-3">Cancellation Policy</h3>
                    <p className="text-gray-700">{property.cancellationPolicy}</p>
                </div>

                {/* Booking Card */}
                <BookingCard
                    propertyId={property.propertyID}
                    pricePerNight={property.pricePerNight}
                    cleaningFee={property.cleaningFee}
                    maxGuests={property.maxGuests}
                    isOwnProperty={user?.userId === property.hostID}
                />
            </div>
        </div>
    );
};

export default PropertyDetails;