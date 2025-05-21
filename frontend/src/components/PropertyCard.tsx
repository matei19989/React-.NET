import React from 'react';
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

// Define an interface for the property data structure
interface PropertyData {
  propertyID: number;
  title: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  pricePerNight: number;
  propertyImages?: Array<{
    imageUrl: string;
    description: string;
  }>;
  // Add other properties you need
}

// Define the component props interface
interface PropertyCardProps {
  property: PropertyData;
}

// Add type annotation to your component
const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  // Destructure the property data
  const { 
    propertyID, 
    title, 
    location, 
    pricePerNight, 
    propertyImages = [] 
  } = property;

  // Get the first image or use a placeholder
  const mainImage = propertyImages && propertyImages.length > 0 
    ? propertyImages[0].imageUrl 
    : 'https://placehold.co/600x400?text=No+Image';

  // Calculate random rating for demo purposes (in a real app, this would come from reviews)
  const rating = ((Math.random() * 2) + 3).toFixed(1); // Random rating between 3.0 and 5.0

  return (
    <div className="group">
      <Link to={`/property/${propertyID}`} className="block">
        <div className="relative overflow-hidden rounded-xl aspect-square">
          {/* Main property image */}
          <img 
            src={mainImage} 
            alt={title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Favorite button */}
          <button className="absolute top-3 right-3 p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-colors duration-200">
            <Heart className="h-5 w-5 text-gray-500 hover:text-red-500 transition-colors duration-200" />
          </button>
        </div>
        
        {/* Property details */}
        <div className="mt-2">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-current text-black" />
              <span className="ml-1 text-sm">{rating}</span>
            </div>
          </div>
          
          <p className="text-gray-500 text-sm mt-1">
            {location.city}, {location.state}, {location.country}
          </p>
          
          <p className="mt-2">
            <span className="font-semibold">${pricePerNight}</span>
            <span className="text-gray-500"> / night</span>
          </p>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;