import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import type { Role } from '../../store/authSlice';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    switch (user.role) {
      case 'ADMIN': return <Navigate to="/admin" replace />;
      case 'PHYSIOTHERAPIST': return <Navigate to="/physio-dashboard" replace />;
      default: return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};
