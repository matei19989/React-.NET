// @ts-ignore
import React, { useState, useContext, useEffect, useRef } from "react";
import { Globe } from "lucide-react";
import { AppResetContext } from "./NavBar";
import { useDropdown } from "./useDropdown"; // New import

// Define the type for the context
interface AppResetContextType {
    resetCounter: number;
    resetApp: () => void;
}

const CurrencySwitcher = () => {
    const [currency, setCurrency] = useState(() => {
        // Load saved currency from localStorage or default to USD
        return localStorage.getItem("preferredCurrency") || "USD";
    });

    const { isOpen, setIsOpen, ref } = useDropdown(false); // Using the shared hook
    const { resetCounter } = useContext(AppResetContext) as AppResetContextType;

    const currencies: string[] = ["USD", "EUR", "GBP"];

    useEffect(() => {
        if (resetCounter > 0) {
            setIsOpen(false);
        }
    }, [resetCounter, setIsOpen]);

    // Save currency preference to localStorage when it changes
    useEffect(() => {
        localStorage.setItem("preferredCurrency", currency);
    }, [currency]);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition flex items-center space-x-1"
                title="Select Currency" // Added tooltip
            >
                <Globe className="w-5 h-5 text-gray-600 cursor-pointer" />
                <span className="text-xs font-medium text-gray-600">{currency}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg overflow-hidden transition-opacity duration-200 opacity-100 z-50">
                    {currencies.map((curr, index) => (
                        <button
                            key={curr}
                            onClick={() => {
                                setCurrency(curr);
                                setIsOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 
                                ${index === 0 ? "rounded-t-md" : ""} 
                                ${index === currencies.length - 1 ? "rounded-b-md" : ""}
                                ${curr === currency ? "bg-blue-50 text-blue-600 font-medium" : ""}`}
                        >
                            {curr}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CurrencySwitcher;