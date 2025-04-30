import React, {useContext, useEffect} from "react";
import {Link} from "react-router-dom";
import {AppResetContext} from "./NavBar";
import {useDropdown} from "./useDropdown";

// Define the type for the context
interface AppResetContextType {
    resetCounter: number;
    resetApp: () => void;
}

const Profile = () => {
    const {isOpen: showDropdown, setIsOpen: setShowDropdown, ref: dropdownRef} = useDropdown(false);
    const {resetCounter} = useContext(AppResetContext) as AppResetContextType;

    useEffect(() => {
        if (resetCounter > 0) {
            setShowDropdown(false);
        }
    }, [resetCounter, setShowDropdown]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="flex items-center space-x-2 rounded-full border border-gray-300 p-2 hover:shadow-md transition-shadow duration-200"
                onClick={() => setShowDropdown(!showDropdown)}
                title="Account Menu"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20"
                     fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"/>
                </svg>
            </button>

            {showDropdown && (
                <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200 transition-opacity duration-200 opacity-100">
                    <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}>
                        Log in
                    </Link>
                    <Link
                        to="/signup"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                    >
                        Sign up
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <Link
                        to="/property/create"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                    >
                        List Your Home
                    </Link>
                    <Link
                        to="/my-properties"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                    >
                        Manage Properties
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Profile;