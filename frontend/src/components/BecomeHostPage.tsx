import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BecomeHostPage: React.FC = () => {
    const { user, getCurrentUser } = useAuth();
    const navigate = useNavigate();
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [bio, setBio] = useState(user?.bio || '');
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            navigate('/login');
            return;
        }
        
        setIsSubmitting(true);
        setError(null);
        
        try {
            // Make API call to update user to host status
            const token = localStorage.getItem('auth_token');
            await axios.put(`https://localhost:7144/api/users/${user.userId}/becomehost`,
                { bio },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            // Refresh user data
            await getCurrentUser();
            
            // Redirect to the property creation page
            navigate('/property/create');
        } catch (err) {
            console.error('Error becoming a host:', err);
            setError('Failed to update your account. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Become a Host</h1>
                        
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                                <p className="text-red-700">{error}</p>
                            </div>
                        )}
                        
                        <div className="mb-8">
                            <h2 className="text-xl font-medium text-gray-900 mb-2">Share your space, earn extra income</h2>
                            <p className="text-gray-600">
                                Hosting on Airbnb is a great way to share your place, earn extra income, and meet guests from around the world.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium text-gray-900 mb-2">Set your own schedule</h3>
                                <p className="text-gray-600 text-sm">You control your availability, prices, and requirements for guests.</p>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium text-gray-900 mb-2">Host with confidence</h3>
                                <p className="text-gray-600 text-sm">To support hosts, most bookings include free protection against guest-caused damage and liability.</p>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium text-gray-900 mb-2">Get expert support</h3>
                                <p className="text-gray-600 text-sm">From setting up your listing to getting your first booking, we're here to help.</p>
                            </div>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tell guests about yourself
                                </label>
                                <textarea
                                    id="bio"
                                    rows={4}
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Share a bit about yourself, your hosting style, and why you love your area."
                                ></textarea>
                                <p className="mt-1 text-sm text-gray-500">
                                    Your bio will be visible on your host profile and property listings.
                                </p>
                            </div>
                            
                            <div className="flex items-center">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-lg hover:from-rose-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${
                                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isSubmitting ? 'Processing...' : 'Become a Host'}
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="ml-4 text-gray-600 hover:text-gray-900"
                                >
                                    I'll do this later
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BecomeHostPage;