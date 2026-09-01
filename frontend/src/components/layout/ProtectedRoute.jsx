import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export const ProtectedRoute = ({ children }) => {
    const { user, token, isLoading } = useAppStore();
    const location = useLocation();

    // If there is no token at all, definitely not authenticated
    if (!token) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // If still loading the user profile from the token
    if (isLoading && !user) {
        return (
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500"></div>
                    <p className="text-slate-400 font-medium">Loading workspace...</p>
                </div>
            </div>
        );
    }

    // If loading finished but no user found (token invalid)
    if (!user) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return children;
};
