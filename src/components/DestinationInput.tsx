import React from 'react';
import {MapPin} from 'lucide-react';

interface DestinationInputProps {
    destination: string;
    onChange: (newDestination: string) => void;
}

const DestinationInput: React.FC<DestinationInputProps> = ({destination, onChange}) => {
    return (
        <div className="col-span-2 border-r pr-2">
            <label className="block text-xs font-bold text-gray-700 mb-1">Destination</label>
            <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-gray-500 "/>
                <input
                    type="text"
                    placeholder="Where are you going?"
                    value={destination}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full focus:outline-none text-sm"
                />
            </div>
        </div>
    );
};

export default DestinationInput;