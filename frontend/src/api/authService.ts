// src/api/authService.ts
import axios from 'axios';

// API base URL
const API_BASE_URL = 'http://localhost:5194/api';


// User interfaces
export interface User {
    userId: number;
    firstname: string;
    lastname: string;
    email: string;
    isHost: boolean;
    profilePicture: string;
    bio?: string; // Added bio field
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone?: string;
    isHost?: boolean;
    profilePicture?: string;
    bio?: string;
}

// Local storage keys
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * Save authentication data to local storage
 */
const saveAuthData = (data: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
};

/**
 * Clear authentication data from local storage
 */
const clearAuthData = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

/**
 * Get current auth token
 */
export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): User | null => {
    const userString = localStorage.getItem(USER_KEY);
    if (!userString) return null;
    
    try {
        return JSON.parse(userString);
    } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
    }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
    return !!getToken();
};

/**
 * Login user with email and password
 */
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
        const data = response.data;
        saveAuthData(data);
        return data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Login failed');
        }
        throw new Error('Login failed. Please try again.');
    }
};

/**
 * Register a new user
 */
export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
        const data = response.data;
        saveAuthData(data);
        return data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Registration failed');
        }
        throw new Error('Registration failed. Please try again.');
    }
};

/**
 * Logout the current user
 */
export const logout = (): void => {
    clearAuthData();
};

/**
 * Create axios instance with auth token
 */
export const authAxios = axios.create({
    baseURL: API_BASE_URL
});

// Add auth token to requests
authAxios.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Default exports
export default {
    login,
    register,
    logout,
    getCurrentUser,
    isAuthenticated,
    getToken,
    authAxios
};