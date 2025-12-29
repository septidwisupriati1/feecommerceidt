import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasRole } from '../utils/auth';

/**
 * PublicRoute Component
 * Redirects authenticated users to their dashboard
 * Used for login/register pages
 */
export default function PublicRoute({ children }) {
  const authenticated = isAuthenticated();

  // If user is already authenticated, redirect to appropriate dashboard
  if (authenticated) {
    if (hasRole('admin')) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (hasRole('seller')) {
      return <Navigate to="/seller/dashboard" replace />;
    } else if (hasRole('buyer')) {
      return <Navigate to="/buyer/dashboard" replace />;
    }
  }

  // If not authenticated, show the public page (login/register)
  return children;
}
