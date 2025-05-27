import React, { useState, useEffect } from 'react';
import { Star, Calendar, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    createBooking,
    checkAvailability,
    calculateBookingPrice,
    validateBookingDates,
    BookingFormData
} from '../services/bookingService';

interface BookingCardProps {
    propertyId: number;
    pricePerNight: number;
    cleaningFee: number;
    maxGuests: number;
    isOwnProperty?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({
    propertyId,
    pricePerNight,
    cleaningFee,
    maxGuests,
    isOwnProperty = false
}) => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    
    const [bookingData, setBookingData] = useState<BookingFormData>({
        checkInDate: null,
        checkOutDate: null,
        numGuests: 1
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

    // Calculate pricing when dates change
    const pricing = bookingData.checkInDate && bookingData.checkOutDate
        ? calculateBookingPrice(pricePerNight, cleaningFee, bookingData.checkInDate, bookingData.checkOutDate)
        : null;

    // Check availability when dates change
    useEffect(() => {
        const checkDatesAvailability = async () => {
            if (!bookingData.checkInDate || !bookingData.checkOutDate) {
                setIsAvailable(null);
                return;
            }

            const validation = validateBookingDates(bookingData.checkInDate, bookingData.checkOutDate);
            if (validation) {
                setError(validation);
                setIsAvailable(false);
                return;
            }

            setIsCheckingAvailability(true);
            setError(null);

            try {
                const availability = await checkAvailability(
                    propertyId,
                    bookingData.checkInDate,
                    bookingData.checkOutDate
                );
                setIsAvailable(availability.isAvailable);
                
                if (!availability.isAvailable) {
                    setError('These dates are not available. Please select different dates.');
                }
            } catch (err) {
                console.error('Error checking availability:', err);
                setError('Failed to check availability. Please try again.');
                setIsAvailable(false);
            } finally {
                setIsCheckingAvailability(false);
            }
        };

        checkDatesAvailability();
    }, [bookingData.checkInDate, bookingData.checkOutDate, propertyId]);

    const handleDateChange = (field: 'checkInDate' | 'checkOutDate', value: string) => {
        const date = value ? new Date(value) : null;
        setBookingData(prev => ({
            ...prev,
            [field]: date
        }));
        setSuccess(null);
    };

    const handleGuestChange = (increment: boolean) => {
        setBookingData(prev => ({
            ...prev,
            numGuests: increment
                ? Math.min(prev.numGuests + 1, maxGuests)
                : Math.max(1, prev.numGuests - 1)
        }));
    };

    const handleReservation = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!bookingData.checkInDate || !bookingData.checkOutDate) {
            setError('Please select check-in and check-out dates');
            return;
        }

        if (!isAvailable) {
            setError('Selected dates are not available');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await createBooking({
                propertyID: propertyId,
                checkInDate: bookingData.checkInDate.toISOString(),
                checkOutDate: bookingData.checkOutDate.toISOString(),
                numGuests: bookingData.numGuests
            });

            setSuccess('Booking confirmed! You can view your reservations in your profile.');
            
            // Reset form
            setBookingData({
                checkInDate: null,
                checkOutDate: null,
                numGuests: 1
            });
            
            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
        } catch (err: any) {
            console.error('Error creating booking:', err);
            
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data) {
                setError(typeof err.response.data === 'string' ? err.response.data : 'Failed to create booking');
            } else {
                setError('Failed to create booking. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Don't show booking card if user owns this property
    if (isOwnProperty) {
        return (
            <div className="bg-gray-50 rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="text-center text-gray-600">
                    <Users className="w-8 h-8 mx-auto mb-2" />
                    <p>This is your property</p>
                    <p className="text-sm">You cannot book your own listing</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 sticky top-4">
            {/* Success Message */}
            {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                    <p className="text-green-700 text-sm">{success}</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            {/* Price Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="text-2xl font-bold">
                    ${pricePerNight} <span className="text-gray-500 text-base font-normal">night</span>
                </div>
                <div className="flex items-center">
                    <Star className="w-4 h-4 fill-current text-gray-900" />
                    <span className="ml-1">4.9</span>
                </div>
            </div>

            {/* Date Selection */}
            <div className="border border-gray-300 rounded-lg mb-4">
                <div className="grid grid-cols-2 divide-x divide-gray-300">
                    <div className="p-3">
                        <div className="text-xs uppercase font-semibold text-gray-500 mb-1">Check-in</div>
                        <input
                            type="date"
                            value={bookingData.checkInDate ? bookingData.checkInDate.toISOString().split('T')[0] : ''}
                            onChange={(e) => handleDateChange('checkInDate', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full text-sm border-none outline-none bg-transparent"
                        />
                    </div>
                    <div className="p-3">
                        <div className="text-xs uppercase font-semibold text-gray-500 mb-1">Checkout</div>
                        <input
                            type="date"
                            value={bookingData.checkOutDate ? bookingData.checkOutDate.toISOString().split('T')[0] : ''}
                            onChange={(e) => handleDateChange('checkOutDate', e.target.value)}
                            min={bookingData.checkInDate ? 
                                new Date(bookingData.checkInDate.getTime() + 86400000).toISOString().split('T')[0] : 
                                new Date().toISOString().split('T')[0]
                            }
                            className="w-full text-sm border-none outline-none bg-transparent"
                        />
                    </div>
                </div>
                
                {/* Guests Selection */}
                <div className="border-t border-gray-300 p-3">
                    <div className="text-xs uppercase font-semibold text-gray-500 mb-1">Guests</div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm">{bookingData.numGuests} guest{bookingData.numGuests !== 1 ? 's' : ''}</span>
                        <div className="flex items-center space-x-2">
                            <button
                                type="button"
                                onClick={() => handleGuestChange(false)}
                                disabled={bookingData.numGuests <= 1}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50"
                            >
                                -
                            </button>
                            <button
                                type="button"
                                onClick={() => handleGuestChange(true)}
                                disabled={bookingData.numGuests >= maxGuests}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Availability Status */}
            {isCheckingAvailability && (
                <div className="mb-4 text-center text-gray-600">
                    <div className="inline-flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                        Checking availability...
                    </div>
                </div>
            )}

            {isAvailable === true && !error && (
                <div className="mb-4 text-center text-green-600 text-sm">
                    ✓ Available for selected dates
                </div>
            )}

            {/* Reserve Button */}
            <button
                onClick={handleReservation}
                disabled={
                    isLoading || 
                    !bookingData.checkInDate || 
                    !bookingData.checkOutDate || 
                    isAvailable === false ||
                    isCheckingAvailability
                }
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    isLoading || !bookingData.checkInDate || !bookingData.checkOutDate || isAvailable === false
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600'
                }`}
            >
                {isLoading ? 'Processing...' : 
                 !isAuthenticated ? 'Log in to Reserve' :
                 !bookingData.checkInDate || !bookingData.checkOutDate ? 'Select Dates' :
                 isAvailable === false ? 'Not Available' : 
                 'Reserve'}
            </button>

            {!isAuthenticated && (
                <p className="text-center text-sm text-gray-500 mt-2">
                    You need to log in to make a reservation
                </p>
            )}

            {/* Price Breakdown */}
            {pricing && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>${pricePerNight} x {pricing.nights} night{pricing.nights !== 1 ? 's' : ''}</span>
                            <span>${pricing.breakdown.accommodationTotal}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Cleaning fee</span>
                            <span>${cleaningFee}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                            <span>Total</span>
                            <span>${pricing.totalPrice}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingCard;