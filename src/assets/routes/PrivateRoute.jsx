import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('token');

    if (!isAuthenticated) {
        // not logged in so redirect to login page with the return url
        return <Navigate to="/login" />
    }

    // authorized so return child components
    return children;
};

export default PrivateRoute;
