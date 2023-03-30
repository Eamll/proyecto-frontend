import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenExpired } from '../helpers/auth';

const PrivateRoute = ({ children }) => {
    const is_token_expired = isTokenExpired();
    // console.log(isAuthenticated);

    if (is_token_expired) {
        // not logged in so redirect to login page with the return url
        return <Navigate to="/login" />
    }

    // authorized so return child components
    return children;
};

export default PrivateRoute;
