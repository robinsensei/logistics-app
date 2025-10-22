import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // This will likely not be shown because AuthProvider now waits,
        // but it's good practice to have it.
        return <div>Loading...</div>;
    }

    if (!user) {
        // If there's no user, redirect to the login page.
        // Save the location they were trying to go to so we can send them there after login.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
