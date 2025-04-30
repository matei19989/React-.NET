import React from 'react';
import PropertyGrid from './PropertyGrid';
import { useSearchParams } from 'react-router-dom';
import CondensedView from './CondensedView';

const SearchResultsPage: React.FC = () => {
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

    // Handle new search
    const handleSearch = () => {
        // In a real app, this would update the URL with new search params
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Condensed search bar at top */}
            <div className="sticky top-0 z-10 bg-white shadow-sm py-4">
                <CondensedView
                    destination={destination}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    totalGuests={totalGuests}
                    onSearch={handleSearch}
                />
            </div>

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

export default SearchResultsPage;