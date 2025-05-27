import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import SearchResultsPage from './components/SearchResultsPage';
import HomePage from './components/HomePage';
import PropertyDetails from './components/PropertyDetails';
import PropertyCreatePage from './components/PropertyCreatePage';
import PropertyEditPage from './components/PropertyEditPage';
import PropertyManagementPage from './components/PropertyManagementPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import BecomeHostPage from './components/BecomeHostPage';
import UserBookingsPage from './components/UserBookingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './layout.css';

function Layout() {
    // Use useEffect for logging instead of directly in JSX
    useEffect(() => {
        console.log("Rendering Layout component");
    }, []);

    return (
        <main>
            <AuthProvider>
                <Router>
                    <Navbar/>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/search" element={<SearchResultsPage />} />
                        <Route path="/property/:id" element={<PropertyDetails />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        
                        {/* Protected routes that require authentication */}
                        <Route 
                            path="/property/create" 
                            element={
                                <ProtectedRoute requiresHost={true}>
                                    <PropertyCreatePage />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/property/edit/:id" 
                            element={
                                <ProtectedRoute requiresHost={true}>
                                    <PropertyEditPage />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/my-properties" 
                            element={
                                <ProtectedRoute requiresHost={true}>
                                    <PropertyManagementPage />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/become-host" 
                            element={
                                <ProtectedRoute>
                                    <BecomeHostPage />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/trips" 
                            element={
                                <ProtectedRoute>
                                    <UserBookingsPage />
                                </ProtectedRoute>
                            } 
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </main>
    );
}

export default Layout;