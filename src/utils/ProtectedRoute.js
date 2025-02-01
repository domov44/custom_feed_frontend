import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../routes';

function ProtectedRoutes({ children }) {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to={ROUTES.SIGNIN} replace />;
    }

    return <Outlet/>;
}

export default ProtectedRoutes;