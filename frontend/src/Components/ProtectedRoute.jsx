
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, isLoggedIn, userRole, requiredRole }) => {
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  if (userRole !== requiredRole) {
    return <Navigate to="*" />;
  }

  return element; 
};

export default ProtectedRoute;
