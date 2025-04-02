import React from 'react';
import {Users} from 'lucide-react';

interface GuestSelectorProps {
    guests: {
        adults: number;
        children: number;
        infants: number;
    };
    onUpdateGuests: (type: 'adults' | 'children' | 'infants', increment: boolean) => void;
}

const GuestSelector: React.FC<GuestSelectorProps> = ({guests, onUpdateGuests}) => {
    const totalGuests = guests.adults + guests.children + guests.infants;

    return (
        <div className="col-span-4 relative">
            <label className="block text-xs font-bold text-gray-700 mb-1">Guests</label>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-gray-500"/>
                    <span className="text-sm">
            {totalGuests} Guest{totalGuests !== 1 ? 's' : ''}
          </span>
                </div>
                <div className="flex items-center space-x-4">
                    {/* Adults */}
                    <div className="flex items-center space-x-2">
                        <span className="text-sm">Adults</span>
                        <div className="flex items-center space-x-2">
                            <button
                                type="button"
                                onClick={() => onUpdateGuests('adults', false)}
                                disabled={guests.adults <= 1}
                                className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center disabled:opacity-50 cursor-pointer"
                            >
                                -
                            </button>
                            <span>{guests.adults}</span>
                            <button
                                type="button"
                                onClick={() => onUpdateGuests('adults', true)}
                                className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                            >
                                +
                            </button>
                        </div>
                    </div>
                    {/* Children */}
                    <div className="flex items-center space-x-2">
                        <span className="text-sm">Children</span>
                        <div className="flex items-center space-x-2">
                            <button
                                type="button"
                                onClick={() => onUpdateGuests('children', false)}
                                disabled={guests.children <= 0}
                                className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center disabled:opacity-50 cursor-pointer"
                            >
                                -
                            </button>
                            <span>{guests.children}</span>
                            <button
                                type="button"
                                onClick={() => onUpdateGuests('children', true)}
                                className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                            >
                                +
                            </button>
                        </div>
                    </div>
                    {/* Infants */}
                    <div className="flex items-center space-x-2">
                        <span className="text-sm">Infants</span>
                        <div className="flex items-center space-x-2">
                            <button
                                type="button"
                                onClick={() => onUpdateGuests('infants', false)}
                                disabled={guests.infants <= 0}
                                className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center disabled:opacity-50 cursor-pointer"
                            >
                                -
                            </button>
                            <span>{guests.infants}</span>
                            <button
                                type="button"
                                onClick={() => onUpdateGuests('infants', true)}
                                className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestSelector;