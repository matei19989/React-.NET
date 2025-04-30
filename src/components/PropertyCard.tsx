import React from 'react';
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface PropertyData {
    id: string;
    title: string;
    location: string;
    price: number;
    rating: number;
    reviewCount: number;
    images: string[];
    availableDates?: {
        startDate: string;
        endDate: string;
    };
    propertyType: string;
    isSuperhost?: boolean;
}

interface PropertyCardProps {
    property: PropertyData;
    currency?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
                                                       property,
                                                       currency = 'USD'
                                                   }) => {
    const {
        id,
        title,
        location,
        price,
        rating,
        reviewCount,
        images,
        availableDates,
        propertyType,
        isSuperhost
    } = property;

    const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';

    return (
        <div className="group relative">
            {/* Image carousel */}
            <div className="relative aspect-square overflow-hidden rounded-xl">
                <button
                    className="absolute right-3 top-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white transition"
                    aria-label="Save to wishlist"
                >
                    <Heart className="w-5 h-5 text-gray-600" />
                </button>

                <Link to={`/property/${id}`}>
                    <img
                        src={images[0]}
                        alt={title}
                        className="h-full w-full object-cover transition group-hover:scale-105 duration-300"
                    />
                </Link>
            </div>

            {/* Property details */}
            <div className="mt-2">
                <Link to={`/property/${id}`} className="block">
                    <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900 truncate">{title}</h3>
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-current text-gray-900" />
                            <span className="text-sm">{rating.toFixed(1)}</span>
                        </div>
                    </div>

                    <p className="text-gray-500 text-sm">{location}</p>
                    <p className="text-gray-500 text-sm mt-1">{propertyType}</p>

                    {availableDates && (
                        <p className="text-gray-500 text-sm mt-1">
                            {new Date(availableDates.startDate).toLocaleDateString()} - {new Date(availableDates.endDate).toLocaleDateString()}
                        </p>
                    )}

                    <p className="mt-2 text-gray-900">
                        <span className="font-semibold">{currencySymbol}{price}</span> <span className="text-sm">night</span>
                    </p>
                </Link>
            </div>

            {/* Superhost badge */}
            {isSuperhost && (
                <div className="absolute top-3 left-3 bg-white text-xs font-medium px-2 py-1 rounded-full shadow">
                    Superhost
                </div>
            )}
        </div>
    );
};

export default PropertyCard;