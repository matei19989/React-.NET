import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    fetchCurrentUserProperties,
    deleteProperty,
    ApiProperty
} from '../api/propertyService';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Edit, Trash2, AlertCircle } from 'lucide-react';

const PropertyManagementPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [properties, setProperties] = useState<ApiProperty[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const loadProperties = async () => {
            try {
                setLoading(true);
                // Now uses the authenticated endpoint that gets only the current user's properties
                const userProperties = await fetchCurrentUserProperties();
                setProperties(userProperties);
                setError(null);
            } catch (err) {
                console.error('Error loading properties:', err);
                setError('Failed to load your properties. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadProperties();
    }, []);

    const handleDeleteClick = (propertyId: number) => {
        setPropertyToDelete(propertyId);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!propertyToDelete) return;

        try {
            setIsDeleting(true);
            await deleteProperty(propertyToDelete);

            // Remove the deleted property from the state
            setProperties(prevProperties =>
                prevProperties.filter(p => p.propertyID !== propertyToDelete)
            );

            setShowDeleteConfirm(false);
            setPropertyToDelete(null);
        } catch (err) {
            console.error(`Error deleting property ${propertyToDelete}:`, err);
            setError('Failed to delete the property. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setPropertyToDelete(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Your Properties</h1>
                <Link
                    to="/property/create"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Add New Property
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            )}

            {properties.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <h2 className="text-xl font-medium text-gray-900 mb-2">No properties found</h2>
                    <p className="text-gray-600 mb-6">You haven't listed any properties yet. Create your first listing to get started.</p>
                    <Link
                        to="/property/create"
                        className="inline-flex items-center px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Create Your First Listing
                    </Link>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                Property
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                Location
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {properties.map(property => (
                            <tr key={property.propertyID} className="hover:bg-gray-50">
                                <td className="py-4 px-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 flex-shrink-0">
                                            <img
                                                className="h-12 w-12 rounded-md object-cover"
                                                src={property.propertyImages && property.propertyImages.length > 0
                                                    ? property.propertyImages[0].imageUrl
                                                    : "https://via.placeholder.com/100?text=No+Image"}
                                                alt={property.title}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <Link
                                                to={`/property/${property.propertyID}`}
                                                className="text-sm font-medium text-gray-900 hover:text-blue-600"
                                            >
                                                {property.title}
                                            </Link>
                                            <div className="text-sm text-gray-500">
                                                {property.propertyType} · {property.bedrooms} bed · {property.bathrooms} bath
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {property.location.city}, {property.location.state}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {property.location.country}
                                    </div>
                                </td>
                                <td className="py-4 px-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        ${property.pricePerNight}/night
                                    </div>
                                </td>
                                <td className="py-4 px-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            property.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {property.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                </td>
                                <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => navigate(`/property/edit/${property.propertyID}`)}
                                            className="text-blue-600 hover:text-blue-900"
                                            title="Edit property"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(property.propertyID)}
                                            className="text-red-600 hover:text-red-900"
                                            title="Delete property"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this property? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={cancelDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition ${
                                    isDeleting ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyManagementPage;