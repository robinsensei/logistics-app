import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginForm from '../../components/auth/LoginForm';
import { WebLogo } from '../../assets';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    useEffect(() => {
        // If user is already authenticated, redirect to dashboard
        if (user) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [user, navigate, location]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden grid lg:grid-cols-2">
                {/* Left Side Panel */}
                <div className="hidden lg:block bg-blue-900 p-8 text-white">
                    <div className="flex items-center mb-6">
                        <div className="relative flex items-center justify-center h-24 w-24">
                            {/* White circle background */}
                            <div className="absolute h-20 w-20 bg-white rounded-full shadow-lg"></div>
                            {/* Logo on top, overlapping the circle */}
                            <img className="relative h-24 w-auto" src={WebLogo} alt="UrbanSync Logo" />
                        </div>
                        <h1 className="ml-4 text-3xl font-bold text-yellow-400">UrbanSync</h1>
                    </div>
                    <p className="mt-4 text-blue-200 leading-relaxed">
                        Streamline your fleet operations with our smart transport management system. Log in to access your dashboard.
                    </p>
                    <div className="mt-12 space-y-6 border-t border-blue-700 pt-6">
                        <h2 className="text-xl font-semibold text-yellow-400">Contact Information</h2>
                        <p className="flex items-center text-blue-100">
                            <EnvelopeIcon className="h-6 w-6 mr-3 text-yellow-400" />
                            <span>support@urbansync.com</span>
                        </p>
                        <p className="flex items-center text-blue-100">
                            <PhoneIcon className="h-6 w-6 mr-3 text-yellow-400" />
                            <span>+63 (XX) XXX XXXX</span>
                        </p>
                    </div>
                </div>

                {/* Right Side (Login Form) */}
                <div className="p-8 sm:p-12 flex items-center">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}