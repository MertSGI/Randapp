import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { currentUser, isLoading, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-white"></div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to login page but save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    // Redirect to home or show unauthorized if role doesn't match
    // Depending on the app's structure, you could also redirect to a standard /unauthorized page.
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p className="text-gray-700 dark:text-gray-300">You do not have permission to view this page.</p>
        <Navigate to="/" replace />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
