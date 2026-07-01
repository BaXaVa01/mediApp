import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { AccountType } from './authCookies';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedAccountTypes: AccountType[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ children, allowedAccountTypes }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDF9F3] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#5A9BD4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedAccountTypes.includes(user.accountType)) {
    // User does not have access, redirect to home page
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
