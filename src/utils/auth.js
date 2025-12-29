/**
 * Authentication Utilities
 * Helper functions for token management and validation
 */

/**
 * Get current authentication token
 * @returns {string|null} Token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get current user data
 * @returns {Object|null} User object or null if not logged in
 */
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Get user role
 * @returns {string|null} User role or null
 */
export const getUserRole = () => {
  const user = getUser();
  if (!user) return null;
  
  // Handle array format first (backend)
  if (Array.isArray(user.roles) && user.roles.length > 0) {
    return user.roles[0];
  }
  
  // Handle string format (fallback)
  if (typeof user.role === 'string') {
    return user.role;
  }
  
  console.warn('⚠️ [getUserRole] No valid role found in user object:', user);
  return null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = () => {
  const token = getToken();
  const user = getUser();
  const result = !!(token && user);
  
  console.log('🔐 [isAuthenticated] Check:', {
    hasToken: !!token,
    hasUser: !!user,
    result,
    tokenPreview: token ? token.substring(0, 20) + '...' : null,
    username: user?.username
  });
  
  return result;
};

/**
 * Check if user has specific role
 * @param {string} role - Role to check (seller, admin, buyer)
 * @returns {boolean} True if user has the role
 */
export const hasRole = (role) => {
  const user = getUser();
  if (!user) {
    console.log('❌ [hasRole] No user found');
    return false;
  }
  
  console.log('🔍 [hasRole] Checking role:', {
    requiredRole: role,
    userRole: user.role,
    userRoles: user.roles,
    fullUser: user
  });
  
  // Handle array format (backend response with roles array)
  if (Array.isArray(user.roles) && user.roles.length > 0) {
    const hasIt = user.roles.includes(role);
    console.log(`✓ [hasRole] Check roles array [${user.roles.join(', ')}]: ${role} = ${hasIt}`);
    return hasIt;
  }
  
  // Handle string format (fallback mode or single role)
  if (typeof user.role === 'string' && user.role) {
    const hasIt = user.role === role;
    console.log(`✓ [hasRole] Check role string "${user.role}": ${role} = ${hasIt}`);
    return hasIt;
  }
  
  // Default to buyer if no role specified (for backward compatibility)
  if (!user.role && !user.roles) {
    console.warn('⚠️ [hasRole] No role found in user data, defaulting to buyer');
    return role === 'buyer';
  }
  
  console.log('❌ [hasRole] No valid role format found in user object');
  return false;
};

/**
 * Save authentication data
 * @param {string} token - JWT token
 * @param {Object} user - User data object
 */
export const saveAuth = (token, user) => {
  console.log('💾 [saveAuth] Saving auth data...', {
    token: token?.substring(0, 20) + '...',
    user: {
      username: user?.username,
      email: user?.email,
      role: user?.role,
      roles: user?.roles,
      user_id: user?.user_id
    }
  });
  
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  
  // Verify saved
  const savedToken = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  
  console.log('✅ [saveAuth] Verification:', {
    tokenSaved: !!savedToken,
    userSaved: !!savedUser,
    tokenMatch: savedToken === token,
    userParseable: !!JSON.parse(savedUser)
  });
};

/**
 * Clear authentication data (logout)
 */
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('🚪 Auth data cleared (logged out)');
};

/**
 * Get authorization headers for API requests
 * @returns {Object} Headers object with Authorization
 */
export const getAuthHeaders = () => {
  const token = getToken();
  
  if (!token) {
    console.warn('⚠️ No token available for request');
    return {
      'Content-Type': 'application/json'
    };
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

/**
 * Check if token is expired (basic check - doesn't decode JWT)
 * @returns {boolean} True if token might be expired
 */
export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;
  
  // For fallback tokens, check if it's still in localStorage
  if (token.startsWith('fallback_token_')) {
    return false; // Fallback tokens don't expire
  }
  
  try {
    // Parse JWT (basic - just split by dots)
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    // Decode payload (base64)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Assume expired if can't parse
  }
};

/**
 * Validate authentication before making API calls
 * @throws {Error} If not authenticated or token expired
 */
export const validateAuth = () => {
  if (!isAuthenticated()) {
    throw new Error('UNAUTHORIZED');
  }
  
  if (isTokenExpired()) {
    clearAuth();
    throw new Error('UNAUTHORIZED');
  }
};

/**
 * Debug function to log current auth state
 */
export const debugAuth = () => {
  const token = getToken();
  const user = getUser();
  const role = getUserRole();
  
  console.log('🔍 Auth Debug Info:', {
    hasToken: !!token,
    token: token ? token.substring(0, 30) + '...' : null,
    isAuthenticated: isAuthenticated(),
    user: user,
    role: role,
    tokenExpired: isTokenExpired()
  });
};

export default {
  getToken,
  getUser,
  getUserRole,
  isAuthenticated,
  hasRole,
  saveAuth,
  clearAuth,
  getAuthHeaders,
  isTokenExpired,
  validateAuth,
  debugAuth
};
