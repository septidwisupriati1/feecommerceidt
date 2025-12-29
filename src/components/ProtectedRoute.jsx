import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasRole, getUser } from '../utils/auth';

/**
 * ProtectedRoute Component
 * Protects routes that require authentication
 * @param {Object} props
 * @param {React.Component} props.children - Child component to render if authenticated
 * @param {string} props.requiredRole - Required role to access the route (optional)
 * @param {string} props.redirectTo - Path to redirect if not authenticated (default: /login)
 */
export default function ProtectedRoute({ 
  children, 
  requiredRole = null, 
  redirectTo = '/login' 
}) {
  const authenticated = isAuthenticated();
  const user = getUser();

  console.log('🔒 [ProtectedRoute] Checking access:', {
    authenticated,
    requiredRole,
    userRole: user?.role || user?.roles?.[0],
    user,
    hasToken: !!localStorage.getItem('token'),
    hasUser: !!localStorage.getItem('user')
  });

  // Check if user is authenticated
  if (!authenticated) {
    console.log('❌ [ProtectedRoute] Not authenticated, redirecting to login');
    return <Navigate to={redirectTo} replace />;
  }

  // Check if specific role is required
  if (requiredRole && !hasRole(requiredRole)) {
    console.log('❌ [ProtectedRoute] User does not have required role:', requiredRole);
    
    // Redirect to appropriate dashboard based on user's actual role
    if (hasRole('admin')) {
      console.log('🔄 [ProtectedRoute] Redirecting to admin dashboard');
      return <Navigate to="/admin/dashboard" replace />;
    } else if (hasRole('seller')) {
      console.log('🔄 [ProtectedRoute] Redirecting to seller dashboard');
      return <Navigate to="/seller/dashboard" replace />;
    } else if (hasRole('buyer')) {
      console.log('🔄 [ProtectedRoute] Redirecting to buyer dashboard');
      return <Navigate to="/buyer/dashboard" replace />;
    }
    
    // If no matching role, redirect to login
    console.log('❌ [ProtectedRoute] No matching role, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ [ProtectedRoute] Access granted');
  return children;
}
