import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import * as propertyService from '../services/propertyService'; // Change to named import
import { Loader } from 'lucide-react';

const PropertyGrid = ({ searchParams }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        let data;
        if (searchParams && Object.keys(searchParams).length > 0) {
          // If we have search parameters, use the search endpoint
          data = await propertyService.searchProperties(searchParams);
        } else {
          // Otherwise, get all properties
          data = await propertyService.fetchProperties(); // Changed from getProperties to fetchProperties
        }
        setProperties(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg">No properties found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {properties.map((property) => (
        <PropertyCard key={property.propertyID} property={property} />
      ))}
    </div>
  );
};

export default PropertyGrid;