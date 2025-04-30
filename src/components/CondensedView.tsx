import React from 'react';
import {MapPin} from 'lucide-react';

interface CondensedViewProps {
    destination: string;
    checkIn: Date | null;
    checkOut: Date | null;
    totalGuests: number;
    onSearch: () => void;
}

const CondensedView: React.FC<CondensedViewProps> = ({
                                                         destination,
                                                         checkIn,
                                                         checkOut,
                                                         totalGuests,
                                                         onSearch,
                                                     }) => {
    return (
        <div className="flex items-center bg-white shadow-md rounded-full px-6 py-3 max-w-lg mx-auto">
            <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-500"/>
                <span className="text-gray-700 font-medium">
                    {destination || "Where to?"}
                </span>
            </div>
            <div className="border-l border-gray-300 h-6 mx-4"></div>
            <div className="flex items-center">
                <span className="text-gray-700 font-medium">
                    {checkIn ? checkIn.toLocaleDateString() : "Add dates"}
                </span>
            </div>
            <div className="border-l border-gray-300 h-6 mx-4"></div>
            <div className="flex items-center">
                <span className="text-gray-700 font-medium">
                    {totalGuests} Guests
                </span>
            </div>
            <button
                className="ml-4 bg-rose-500 text-white rounded-full px-4 py-2 text-sm hover:bg-rose-600 focus:outline-none"
                onClick={onSearch}
            >
                Search
            </button>
        </div>
    );
};

export default CondensedView;
