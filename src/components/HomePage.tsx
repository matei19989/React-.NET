import React from 'react';
import PropertyGrid from './PropertyGrid';
import { useSearchParams } from 'react-router-dom';

const HomePage: React.FC = () => {
    const [searchParams] = useSearchParams();

    // Parse search parameters
    const destination = searchParams.get('destination') || '';
    const checkInStr = searchParams.get('checkIn');
    const checkOutStr = searchParams.get('checkOut');
    const adults = parseInt(searchParams.get('adults') || '0', 10);
    const children = parseInt(searchParams.get('children') || '0', 10);
    const infants = parseInt(searchParams.get('infants') || '0', 10);

    // Convert date strings to Date objects
    const checkIn = checkInStr ? new Date(checkInStr) : null;
    const checkOut = checkOutStr ? new Date(checkOutStr) : null;

    // Calculate total guests
    const totalGuests = adults + children + infants;

    return (
        <div className="min-h-screen bg-white">
            {/* Optional: Hero section for homepage */}
            {!destination && (
                <div className="relative h-96 bg-gradient-to-r from-rose-500 to-indigo-500 mb-8">
                    <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
                        <div>
                            <h1 className="text-4xl font-bold mb-4">Find your next stay</h1>
                            <p className="text-xl">
                                Search deals on hotels, homes, and much more...
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Property listings */}
            <PropertyGrid
                destination={destination}
                checkIn={checkIn}
                checkOut={checkOut}
                totalGuests={totalGuests > 0 ? totalGuests : undefined}
            />
        </div>
    );
};

export default HomePage;