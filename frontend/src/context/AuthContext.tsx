import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, getCurrentUser as getStoredUser, logout, login, register, LoginRequest, RegisterRequest } from '../api/authService';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => void;
    error: string | null;
    getCurrentUser: () => Promise<User | null>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    login: async () => {},
    register: async () => {},
    logout: () => {},
    error: null,
    getCurrentUser: async () => null
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load user from localStorage on initial render
    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = getStoredUser();
                setUser(currentUser);
            } catch (err) {
                console.error('Failed to load user:', err);
                setError('Failed to load user profile');
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const handleLogin = async (credentials: LoginRequest) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await login(credentials);
            setUser(response.user);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred during login');
            }
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (userData: RegisterRequest) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await register(userData);
            setUser(response.user);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred during registration');
            }
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        setUser(null);
    };

    // Add the getCurrentUser function to refresh user data
    const handleGetCurrentUser = async (): Promise<User | null> => {
        try {
            // In a real application, you might want to fetch the latest user data from the API
            // For now, we'll just get the stored user data
            const currentUser = getStoredUser();
            setUser(currentUser);
            return currentUser;
        } catch (err) {
            console.error('Failed to get current user:', err);
            setError('Failed to load user profile');
            return null;
        }
    };

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        error,
        getCurrentUser: handleGetCurrentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;