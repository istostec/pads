import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Role = 'superadmin' | string;

function getRole(user: any): Role | null {
  return user?.role ?? null;
}

export const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xs font-bold text-slate-600">Loading session…</div>
      </div>
    );
  }

  if (!user) {
    const from = `${location.pathname}${location.search}`;
    return <Navigate to="/login" replace state={{ from }} />;
  }


  return children;
};

export const AdminRoute: React.FC<{ children: React.ReactElement; allowedRoles?: Role[] }> = ({
  children,
  allowedRoles = ['superadmin'],
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xs font-bold text-slate-600">Loading session…</div>
      </div>
    );
  }

  const role = getRole(user);

  // If not authenticated, send to login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // If authenticated but not allowed, send home (customer-safe)
  if (!allowedRoles.includes(role as Role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

