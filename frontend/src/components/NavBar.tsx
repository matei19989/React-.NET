import React, {createContext, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import CurrencySwitcher from "./CurrencySwitcher";
import Profile from "./Profile";
import Logo from "./Logo";
import SearchBar, {SearchParams} from "./SearchBar";

// Define the type for the context
interface AppResetContextType {
    resetCounter: number;
    resetApp: () => void;
}

// Create the context with the defined type
export const AppResetContext = createContext<AppResetContextType | null>(null);

const NavBar = () => {
    const [resetCounter, setResetCounter] = useState(0);
    const navigate = useNavigate();

    const resetApp = () => {
        setResetCounter(prev => prev + 1);
    };

    const handleSearch = (searchParams: SearchParams) => {
        const {destination, checkIn, checkOut, guests} = searchParams;
        const queryParams = new URLSearchParams();
        if (destination) queryParams.append("destination", destination);
        if (checkIn) queryParams.append("checkIn", checkIn.toISOString());
        if (checkOut) queryParams.append("checkOut", checkOut.toISOString());
        queryParams.append("adults", guests.adults.toString());
        queryParams.append("children", guests.children.toString());
        queryParams.append("infants", guests.infants.toString());
        navigate(`/search?${queryParams.toString()}`);
    };

    return (
        <AppResetContext.Provider value={{resetCounter, resetApp}}>
            <nav className="flex flex-col md:flex-row items-center justify-between p-2 bg-white shadow-sm">
                {/* Top row on mobile, left section on desktop - Logo */}
                <div className="flex items-center mb-4 md:mb-0">
                    <Logo onLogoClick={resetApp}/>
                </div>

                {/* Middle row on mobile, middle section on desktop - SearchBar */}
                <div className="w-full md:w-auto md:flex-1 px-4 mb-4 md:mb-0">
                    <SearchBar
                        onSearch={handleSearch}
                        placeholder="Where are you going?"
                        className="mx-auto"
                    />
                </div>

                {/* Bottom row on mobile, right section on desktop - navigation and profile */}
                <div className="flex flex-wrap justify-center md:justify-end items-center gap-2 md:gap-4">
                    <Link to="/" className="text-gray-800 hover:text-gray-600 px-2 py-1 text-sm">
                        Homes
                    </Link>
                    <Link to="/experiences" className="text-gray-800 hover:text-gray-600 px-2 py-1 text-sm">
                        Experiences
                    </Link>
                    <Link to="/airbnb-your-home" className="text-gray-800 hover:text-gray-600 px-2 py-1 text-sm">
                        Airbnb your home
                    </Link>
                    <CurrencySwitcher/>
                    <Profile/>
                </div>
            </nav>
        </AppResetContext.Provider>
    );
};

export default NavBar;