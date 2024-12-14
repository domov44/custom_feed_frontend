import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoutes({ children }) {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    console.log(currentUser)

    if (!currentUser) {
        return <Navigate to="/se-connecter" replace />;
    }

    return <Outlet/>;
}

export default ProtectedRoutes;