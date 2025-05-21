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

  // Handle favorite button click without navigating
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling
    // Add favorite logic here
    console.log('Added to favorites:', propertyID);
  };

  return (
    <Link to={`/property/${propertyID}`} className="block text-inherit no-underline">
      <div className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-xl aspect-square mb-2">
          {/* Image */}
          <img 
            src={mainImage} 
            alt={title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Favorite button with event stopping */}
          <button 
            className="absolute top-3 right-3 p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-colors"
            onClick={handleFavoriteClick}
          >
            <Heart className="h-5 w-5 text-gray-500 hover:text-red-500" />
          </button>
        </div>
        
        {/* Property details with better spacing */}
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-base">{title}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-1 text-sm">4.8</span>
            </div>
          </div>
          
          <p className="text-gray-500 text-sm mt-1">
            {location.city}, {location.state}
          </p>
          
          <p className="mt-1">
            <span className="font-semibold">${pricePerNight}</span>
            <span className="text-gray-500"> night</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;