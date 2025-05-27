// src/services/bookingService.ts
import api from '../api/api';

// Booking interfaces
export interface Booking {
    bookingID: number;
    propertyID: number;
    guestID: number;
    checkInDate: string;
    checkOutDate: string;
    numGuests: number;
    totalPrice: number;
    property?: {
        title: string;
        location: {
            city: string;
            state: string;
            country: string;
        };
        propertyImages?: {
            imageUrl: string;
            description: string;
        }[];
    };
}

export interface CreateBookingRequest {
    propertyID: number;
    checkInDate: string; // ISO date string
    checkOutDate: string; // ISO date string
    numGuests: number;
}

export interface AvailabilityResponse {
    isAvailable: boolean;
    propertyID: number;
    checkInDate: string;
    checkOutDate: string;
}

export interface BookingFormData {
    checkInDate: Date | null;
    checkOutDate: Date | null;
    numGuests: number;
}

/**
 * Get current user's bookings
 */
export const getUserBookings = async (): Promise<Booking[]> => {
    try {
        const response = await api.get<Booking[]>('/bookings/user');
        return response.data;
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        throw error;
    }
};

/**
 * Get bookings for a specific property (host only)
 */
export const getPropertyBookings = async (propertyId: number): Promise<Booking[]> => {
    try {
        const response = await api.get<Booking[]>(`/bookings/property/${propertyId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching bookings for property ${propertyId}:`, error);
        throw error;
    }
};

/**
 * Create a new booking
 */
export const createBooking = async (bookingData: CreateBookingRequest): Promise<Booking> => {
    try {
        const response = await api.post<Booking>('/bookings', bookingData);
        return response.data;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

/**
 * Cancel a booking
 */
export const cancelBooking = async (bookingId: number): Promise<void> => {
    try {
        await api.delete(`/bookings/${bookingId}`);
    } catch (error) {
        console.error(`Error cancelling booking ${bookingId}:`, error);
        throw error;
    }
};

/**
 * Check availability for specific dates
 */
export const checkAvailability = async (
    propertyId: number,
    checkInDate: Date,
    checkOutDate: Date
): Promise<AvailabilityResponse> => {
    try {
        const response = await api.get<AvailabilityResponse>(
            `/bookings/availability/${propertyId}`,
            {
                params: {
                    checkIn: checkInDate.toISOString(),
                    checkOut: checkOutDate.toISOString()
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error checking availability:', error);
        throw error;
    }
};

/**
 * Calculate total price for a booking
 */
export const calculateBookingPrice = (
    pricePerNight: number,
    cleaningFee: number,
    checkInDate: Date,
    checkOutDate: Date
): { nights: number; totalPrice: number; breakdown: any } => {
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const accommodationTotal = nights * pricePerNight;
    const totalPrice = accommodationTotal + cleaningFee;

    return {
        nights,
        totalPrice,
        breakdown: {
            accommodationTotal,
            cleaningFee,
            nights,
            pricePerNight
        }
    };
};

/**
 * Validate booking dates
 */
export const validateBookingDates = (checkInDate: Date | null, checkOutDate: Date | null): string | null => {
    if (!checkInDate || !checkOutDate) {
        return 'Please select both check-in and check-out dates';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
        return 'Check-in date cannot be in the past';
    }

    if (checkOutDate <= checkInDate) {
        return 'Check-out date must be after check-in date';
    }

    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    
    if (checkInDate > maxDate) {
        return 'Check-in date cannot be more than 1 year in advance';
    }

    return null;
};

export default {
    getUserBookings,
    getPropertyBookings,
    createBooking,
    cancelBooking,
    checkAvailability,
    calculateBookingPrice,
    validateBookingDates
};