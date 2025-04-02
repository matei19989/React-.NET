import React, {useState, useEffect, useContext, useRef} from 'react';
import {AppResetContext} from './NavBar';
import DestinationInput from './DestinationInput';
import DatePicker from './DatePicker';
import GuestSelector from './GuestSelector';

export interface SearchParams {
    destination: string;
    checkIn: Date | null;
    checkOut: Date | null;
    guests: {
        adults: number;
        children: number;
        infants: number;
    };
}

const SearchBar: React.FC<{
    onSearch: (searchParams: SearchParams) => void;
    className?: string;
    placeholder?: string;
}> = ({onSearch, className = ""}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchParams, setSearchParams] = useState<SearchParams>({
        destination: "",
        checkIn: null,
        checkOut: null,
        guests: {
            adults: 1,
            children: 0,
            infants: 0,
        },
    });

    const searchBarRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const resetContext = useContext(AppResetContext);

    // Reset search parameters when resetCounter changes
    useEffect(() => {
        if (resetContext) {
            setSearchParams({
                destination: "",
                checkIn: null,
                checkOut: null,
                guests: {
                    adults: 1,
                    children: 0,
                    infants: 0,
                },
            });
            setIsExpanded(false);
        }
    }, [resetContext?.resetCounter]);

    // Handle clicks outside to collapse the search bar
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchBarRef.current &&
                modalRef.current &&
                !searchBarRef.current.contains(event.target as Node) &&
                !modalRef.current.contains(event.target as Node)
            ) {
                setIsExpanded(false);
            }
        };

        if (isExpanded) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isExpanded]);

    // Update guest counts
    const updateGuests = (type: 'adults' | 'children' | 'infants', increment: boolean) => {
        setSearchParams((prev) => ({
            ...prev,
            guests: {
                ...prev.guests,
                [type]: Math.max(
                    type === 'adults' ? 1 : 0, // Adults must be at least 1
                    increment ? prev.guests[type] + 1 : prev.guests[type] - 1
                ),
            },
        }));
    };

    // Core search logic
    const performSearch = () => {
        if (!searchParams.destination) {
            alert("Please enter a destination");
            return;
        }
        if (!searchParams.checkIn || !searchParams.checkOut) {
            alert("Please select check-in and check-out dates");
            return;
        }
        onSearch(searchParams);
        setIsExpanded(false);
    };

    const totalGuests =
        searchParams.guests.adults +
        searchParams.guests.children +
        searchParams.guests.infants;

    return (
        <div ref={searchBarRef} className={`relative w-full max-w-4xl ${className}`}>
            <div
                className="flex items-center border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
                {/* Destination Input */}
                <div
                    className={`flex-grow px-4 py-2 border-r ${
                        searchParams.destination ? 'text-black' : 'text-gray-500'
                    }`}
                    onClick={() => setIsExpanded(true)}
                >
                    {searchParams.destination || "Where to?"}
                </div>

                {/* Add Dates */}
                <div
                    className="flex-grow px-4 py-2 border-r text-gray-500"
                    onClick={() => setIsExpanded(true)}
                >
                    {searchParams.checkIn ? searchParams.checkIn.toLocaleDateString() : "Add dates"}
                </div>

                {/* Guests */}
                <div
                    className="flex-grow px-4 py-2 text-gray-500 flex justify-between items-center"
                    onClick={() => setIsExpanded(true)}
                >
                    <span>
                        {totalGuests === 1 ? "1 Guest" : `${totalGuests} Guests`}
                    </span>

                    {/* Search Button */}
                    <button
                        className="bg-rose-500 text-white rounded-full p-2 ml-2 hover:bg-rose-600 transition-colors"
                        onClick={performSearch}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Expanded Search Modal */}
            {isExpanded && (
                <div
                    ref={modalRef}
                    className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-xl z-50 p-6"
                >
                    <div className="grid grid-cols-3 gap-4">
                        <DestinationInput
                            destination={searchParams.destination}
                            onChange={(newDestination) =>
                                setSearchParams((prev) => ({...prev, destination: newDestination}))
                            }
                        />
                        <div>
                            <DatePicker
                                label="Check-in"
                                date={searchParams.checkIn}
                                onChange={(newDate) =>
                                    setSearchParams((prev) => ({...prev, checkIn: newDate}))
                                }
                            />
                        </div>
                        <div>
                            <DatePicker
                                label="Check-out"
                                date={searchParams.checkOut}
                                onChange={(newDate) =>
                                    setSearchParams((prev) => ({...prev, checkOut: newDate}))
                                }
                            />
                        </div>
                        <div className="col-span-3">
                            <GuestSelector
                                guests={searchParams.guests}
                                onUpdateGuests={updateGuests}
                            />
                        </div>
                        <div className="col-span-3 flex justify-end space-x-4 mt-4">
                            <button
                                type="button"
                                onClick={() => setIsExpanded(false)}
                                className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-full"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={performSearch}
                                className="bg-rose-500 text-white rounded-full px-6 py-2 hover:bg-rose-600"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;