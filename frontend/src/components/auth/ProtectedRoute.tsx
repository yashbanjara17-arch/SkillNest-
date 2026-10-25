import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { currentUser, isLoadingAuth } = useApp();
  const location = useLocation();

  // Wait for session restoration before redirecting
  if (isLoadingAuth) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Access Restricted</h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
            This area requires a <strong className="uppercase">{allowedRoles.join(' or ')}</strong> account.
            You are currently signed in as <span className="font-semibold">{currentUser.name}</span> with role{' '}
            <span className="font-semibold uppercase text-indigo-600">{currentUser.role}</span>.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to={
              currentUser.role === 'client'
                ? '/dashboard/client'
                : currentUser.role === 'admin'
                ? '/admin'
                : '/dashboard/freelancer'
            }
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to your authorized workspace</span>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
