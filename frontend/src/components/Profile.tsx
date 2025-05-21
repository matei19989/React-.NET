import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppResetContext } from "./NavBar";
import { useDropdown } from "./useDropdown";
import { useAuth } from "../context/AuthContext";
import { User } from "../api/authService";

// Define the type for the context
interface AppResetContextType {
    resetCounter: number;
    resetApp: () => void;
}

const Profile = () => {
    const { isOpen: showDropdown, setIsOpen: setShowDropdown, ref: dropdownRef } = useDropdown(false);
    const { resetCounter } = useContext(AppResetContext) as AppResetContextType;
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (resetCounter > 0) {
            setShowDropdown(false);
        }
    }, [resetCounter, setShowDropdown]);

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        navigate('/');
    };

    // Get user's initials for the profile display when no image is available
    const getUserInitials = (user: User) => {
        return `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="flex items-center space-x-2 rounded-full border border-gray-300 p-2 hover:shadow-md transition-shadow duration-200"
                onClick={() => setShowDropdown(!showDropdown)}
                title="Account Menu"
            >
                {isAuthenticated && user ? (
                    user.profilePicture && user.profilePicture !== 'default-profile.jpg' ? (
                        <img 
                            src={user.profilePicture} 
                            alt={`${user.firstname}'s profile`} 
                            className="h-8 w-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-medium">
                            {getUserInitials(user)}
                        </div>
                    )
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200 transition-opacity duration-200 opacity-100">
                    {isAuthenticated && user ? (
                        <>
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-medium text-gray-900">
                                    {user.firstname} {user.lastname}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 truncate">
                                    {user.email}
                                </p>
                            </div>
                            
                            <Link
                                to="/trips"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setShowDropdown(false)}
                            >
                                Trips
                            </Link>
                            
                            <Link
                                to="/wishlists"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setShowDropdown(false)}
                            >
                                Wishlists
                            </Link>
                            
                            {user.isHost ? (
                                <>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <Link
                                        to="/property/create"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        Create Listing
                                    </Link>
                                    <Link
                                        to="/my-properties"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        Manage Properties
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    to="/become-host"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    Become a Host
                                </Link>
                            )}
                            
                            <div className="border-t border-gray-100 my-1"></div>
                            <Link
                                to="/account"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setShowDropdown(false)}
                            >
                                Account
                            </Link>
                            
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setShowDropdown(false)}
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setShowDropdown(false)}
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Profile;