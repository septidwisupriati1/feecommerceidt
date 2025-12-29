import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasRole } from '../utils/auth';
import LandingPage from '../pages/LandingPage';

/**
 * DashboardRouter Component
 * Routes user to appropriate dashboard based on their role
 * If not authenticated, shows landing page
 */
export default function DashboardRouter() {
  const authenticated = isAuthenticated();

  // If not authenticated, show landing page
  if (!authenticated) {
    return <LandingPage />;
  }

  // Route to appropriate dashboard based on role
  if (hasRole('admin')) {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (hasRole('seller')) {
    return <Navigate to="/seller/dashboard" replace />;
  } else if (hasRole('buyer')) {
    return <Navigate to="/" replace />;
  }

  // If role not recognized, redirect to login
  return <Navigate to="/login" replace />;
}
