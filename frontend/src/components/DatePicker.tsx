import React from 'react';
import {Calendar} from 'lucide-react';

interface DatePickerProps {
    label: string;
    date: Date | null;
    onChange: (newDate: Date | null) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({label, date, onChange}) => {
    return (
        <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">{label}</label>
            <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-500"/>
                <input
                    type="date"
                    value={date ? date.toISOString().split('T')[0] : ''}
                    onChange={(e) =>
                        onChange(e.target.value ? new Date(e.target.value) : null)
                    }
                    className="w-full focus:outline-none text-sm cursor-pointer"
                />
            </div>
        </div>
    );
};

export default DatePicker;
