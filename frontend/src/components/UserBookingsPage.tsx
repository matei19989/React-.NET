import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { 
    getUserBookings, 
    cancelBooking, 
    Booking 
} from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { convertCurrency, getCurrencySymbol } from '../services/propertyService';

const UserBookingsPage: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<number | null>(null);
    const [showCancelConfirm, setShowCancelConfirm] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [currency, setCurrency] = useState('USD');

    // Listen for currency changes
    useEffect(() => {
        const handleStorageChange = () => {
            const storedCurrency = localStorage.getItem('preferredCurrency') || 'USD';
            setCurrency(storedCurrency);
        };

        // Initial load
        handleStorageChange();

        // Listen for changes
        window.addEventListener('storage', handleStorageChange);
        
        // Also check periodically
        const interval = setInterval(handleStorageChange, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const userBookings = await getUserBookings();
            setBookings(userBookings);
            setError(null);
        } catch (err) {
            console.error('Error loading bookings:', err);
            setError('Failed to load your bookings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId: number) => {
        setCancellingId(bookingId);
        setError(null);
        setSuccessMessage(null);

        try {
            await cancelBooking(bookingId);
            
            // Remove cancelled booking from state
            setBookings(prevBookings => prevBookings.filter(b => b.bookingID !== bookingId));
            setSuccessMessage('Booking cancelled successfully.');
            setShowCancelConfirm(null);
        } catch (err: any) {
            console.error('Error cancelling booking:', err);
            
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data) {
                setError(typeof err.response.data === 'string' ? err.response.data : 'Failed to cancel booking');
            } else {
                setError('Failed to cancel booking. Please try again.');
            }
        } finally {
            setCancellingId(null);
        }
    };

    const canCancelBooking = (checkInDate: string): boolean => {
        const checkIn = new Date(checkInDate);
        const now = new Date();
        const hoursUntilCheckIn = (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60);
        return hoursUntilCheckIn > 24;
    };

    const getBookingStatus = (checkInDate: string, checkOutDate: string): { status: string; color: string } => {
        const now = new Date();
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (now < checkIn) {
            return { status: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
        } else if (now >= checkIn && now <= checkOut) {
            return { status: 'Active', color: 'bg-green-100 text-green-800' };
        } else {
            return { status: 'Completed', color: 'bg-gray-100 text-gray-800' };
        }
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const currencySymbol = getCurrencySymbol(currency);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Your Trips</h1>
                <p className="text-gray-600 mt-2">Manage your bookings and reservations</p>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                    <p className="text-green-700">{successMessage}</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {bookings.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-medium text-gray-900 mb-2">No trips yet</h2>
                    <p className="text-gray-600 mb-6">
                        When you're ready to plan your next trip, we're here to help.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Start searching
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => {
                        const status = getBookingStatus(booking.checkInDate, booking.checkOutDate);
                        const canCancel = canCancelBooking(booking.checkInDate);

                        return (
                            <div key={booking.bookingID} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                                {/* Property Image */}
                                <div className="h-48 bg-gray-200 relative">
                                    {booking.property?.propertyImages && booking.property.propertyImages.length > 0 ? (
                                        <img
                                            src={booking.property.propertyImages[0].imageUrl}
                                            alt={booking.property.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-300">
                                            <span className="text-gray-500">No image</span>
                                        </div>
                                    )}
                                    
                                    {/* Status Badge */}
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                                            {status.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Booking Details */}
                                <div className="p-4">
                                    <div className="mb-3">
                                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                            {booking.property?.title || 'Property'}
                                        </h3>
                                        
                                        {booking.property?.location && (
                                            <div className="flex items-center text-gray-600 text-sm">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                <span>
                                                    {booking.property.location.city}, {booking.property.location.state}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Dates and Guests */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <span>
                                                {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Users className="w-4 h-4 mr-2" />
                                            <span>{booking.numGuests} guest{booking.numGuests !== 1 ? 's' : ''}</span>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-lg font-semibold text-gray-900">
                                            {currencySymbol}{convertCurrency(booking.totalPrice, 'USD', currency)}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex space-x-2">
                                        <Link
                                            to={`/property/${booking.propertyID}`}
                                            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-center rounded-lg hover:bg-gray-200 transition text-sm"
                                        >
                                            View Property
                                        </Link>
                                        
                                        {canCancel && status.status === 'Upcoming' && (
                                            <button
                                                onClick={() => setShowCancelConfirm(booking.bookingID)}
                                                disabled={cancellingId === booking.bookingID}
                                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm border border-red-200"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {!canCancel && status.status === 'Upcoming' && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            Cancellation not available (less than 24 hours before check-in)
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Cancel Confirmation Modal */}
            {showCancelConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Cancel Booking</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to cancel this booking? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowCancelConfirm(null)}
                                disabled={cancellingId === showCancelConfirm}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                            >
                                Keep Booking
                            </button>
                            <button
                                onClick={() => handleCancelBooking(showCancelConfirm)}
                                disabled={cancellingId === showCancelConfirm}
                                className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition ${
                                    cancellingId === showCancelConfirm ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                {cancellingId === showCancelConfirm ? 'Cancelling...' : 'Cancel Booking'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserBookingsPage;