import React, { useState } from 'react';
import { PropertyInput } from '../api/propertyService';

interface PropertyFormProps {
    initialData: PropertyInput;
    onSubmit: (data: PropertyInput) => void;
    isLoading: boolean;
    submitButtonText: string;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
                                                       initialData,
                                                       onSubmit,
                                                       isLoading,
                                                       submitButtonText
                                                   }) => {
    const [formData, setFormData] = useState<PropertyInput>(initialData);
    const [amenities, setAmenities] = useState<string[]>(
        initialData.amenities ? initialData.amenities.split(',').map(a => a.trim()) : []
    );

    // Handle normal input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Handle nested location fields
        if (name.startsWith('location.')) {
            const locationField = name.split('.')[1];
            setFormData({
                ...formData,
                location: {
                    ...formData.location,
                    [locationField]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // Handle number input changes
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Handle nested location fields
        if (name.startsWith('location.')) {
            const locationField = name.split('.')[1];
            setFormData({
                ...formData,
                location: {
                    ...formData.location,
                    [locationField]: parseFloat(value) || 0
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: parseFloat(value) || 0
            });
        }
    };

    // Handle amenity checkbox changes
    const handleAmenityChange = (amenity: string, isChecked: boolean) => {
        let updatedAmenities;

        if (isChecked) {
            updatedAmenities = [...amenities, amenity];
        } else {
            updatedAmenities = amenities.filter(a => a !== amenity);
        }

        setAmenities(updatedAmenities);
        setFormData({
            ...formData,
            amenities: updatedAmenities.join(', ')
        });
    };

    // Form submission handler
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Common amenities list
    const commonAmenities = [
        'WiFi', 'TV', 'Kitchen', 'Washer', 'Dryer', 'Air Conditioning',
        'Heating', 'Dedicated workspace', 'Iron', 'Hair dryer',
        'Pool', 'Hot tub', 'Free parking', 'EV charger', 'Crib',
        'Gym', 'BBQ grill', 'Breakfast', 'Indoor fireplace', 'Beachfront',
        'Waterfront', 'Ski-in/ski-out'
    ];

    // Property types
    const propertyTypes = [
        'Apartment', 'House', 'Condo', 'Villa', 'Cabin',
        'Cottage', 'Bungalow', 'Townhouse', 'Loft', 'Boat',
        'Camper/RV', 'Treehouse', 'Yurt', 'Tipi', 'Cave',
        'Island', 'Castle', 'Windmill', 'Lighthouse', 'Dome'
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Property Type
                        </label>
                        <select
                            name="propertyType"
                            value={formData.propertyType}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            {propertyTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* Location Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                        </label>
                        <input
                            type="text"
                            name="location.country"
                            value={formData.location.country}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            City
                        </label>
                        <input
                            type="text"
                            name="location.city"
                            value={formData.location.city}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            State/Province
                        </label>
                        <input
                            type="text"
                            name="location.state"
                            value={formData.location.state}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP/Postal Code
                        </label>
                        <input
                            type="text"
                            name="location.zipCode"
                            value={formData.location.zipCode}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address
                        </label>
                        <input
                            type="text"
                            name="location.address"
                            value={formData.location.address}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Latitude
                        </label>
                        <input
                            type="number"
                            name="location.latitude"
                            value={formData.location.latitude}
                            onChange={handleNumberChange}
                            step="0.0000001"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Longitude
                        </label>
                        <input
                            type="number"
                            name="location.longitude"
                            value={formData.location.longitude}
                            onChange={handleNumberChange}
                            step="0.0000001"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Property Details Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Property Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price per night
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                            <input
                                type="number"
                                name="pricePerNight"
                                value={formData.pricePerNight}
                                onChange={handleNumberChange}
                                min="1"
                                step="0.01"
                                className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cleaning Fee
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                            <input
                                type="number"
                                name="cleaningFee"
                                value={formData.cleaningFee}
                                onChange={handleNumberChange}
                                min="0"
                                step="0.01"
                                className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Max Guests
                        </label>
                        <input
                            type="number"
                            name="maxGuests"
                            value={formData.maxGuests}
                            onChange={handleNumberChange}
                            min="1"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bedrooms
                        </label>
                        <input
                            type="number"
                            name="bedrooms"
                            value={formData.bedrooms}
                            onChange={handleNumberChange}
                            min="0"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bathrooms
                        </label>
                        <input
                            type="number"
                            name="bathrooms"
                            value={formData.bathrooms}
                            onChange={handleNumberChange}
                            min="0"
                            step="0.5"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Amenities Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {commonAmenities.map(amenity => (
                        <div key={amenity} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`amenity-${amenity}`}
                                checked={amenities.includes(amenity)}
                                onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor={`amenity-${amenity}`} className="ml-2 text-sm text-gray-700">
                                {amenity}
                            </label>
                        </div>
                    ))}
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Amenities (comma-separated)
                    </label>
                    <input
                        type="text"
                        name="amenities"
                        value={formData.amenities}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. Xbox, Projector, Baby Monitor"
                    />
                </div>
            </div>

            {/* Policies Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Policies</h2>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cancellation Policy
                        </label>
                        <textarea
                            name="cancellationPolicy"
                            value={formData.cancellationPolicy}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                            placeholder="e.g. Full refund if cancelled 48 hours before check-in"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            House Rules
                        </label>
                        <textarea
                            name="houseRules"
                            value={formData.houseRules}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                            placeholder="e.g. No smoking, No parties, Quiet hours after 10 PM"
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition ${
                        isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                >
                    {isLoading ? 'Processing...' : submitButtonText}
                </button>
            </div>
        </form>
    );
};

export default PropertyForm;