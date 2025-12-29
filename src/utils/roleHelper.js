/**
 * Role Helper Utilities
 * Membantu mengelola dan memeriksa role user
 */

/**
 * Get user roles as array (normalize dari berbagai format)
 * @param {Object} user - User object
 * @returns {Array<string>} Array of roles
 */
export const getUserRoles = (user) => {
  if (!user) return [];
  
  // Jika sudah array
  if (Array.isArray(user.roles)) {
    return user.roles;
  }
  
  // Jika string single role
  if (typeof user.role === 'string') {
    return [user.role];
  }
  
  return [];
};

/**
 * Get primary role (role utama untuk redirect)
 * Priority: admin > seller > buyer
 * @param {Object} user - User object
 * @returns {string|null} Primary role
 */
export const getPrimaryRole = (user) => {
  const roles = getUserRoles(user);
  
  console.log('🔍 [getPrimaryRole] User roles:', {
    rawUser: user,
    parsedRoles: roles,
    userRole: user?.role,
    userRoles: user?.roles
  });
  
  // Priority order
  if (roles.includes('admin')) {
    console.log('✓ [getPrimaryRole] Selected: admin');
    return 'admin';
  }
  if (roles.includes('seller')) {
    console.log('✓ [getPrimaryRole] Selected: seller');
    return 'seller';
  }
  if (roles.includes('buyer')) {
    console.log('✓ [getPrimaryRole] Selected: buyer');
    return 'buyer';
  }
  
  console.warn('⚠️ [getPrimaryRole] No valid role found, using first role:', roles[0]);
  return roles[0] || null;
};

/**
 * Get dashboard path based on user role
 * @param {Object} user - User object
 * @returns {string} Dashboard path
 */
export const getDashboardPath = (user) => {
  const primaryRole = getPrimaryRole(user);
  
  switch (primaryRole) {
    case 'admin':
      return '/admin/dashboard';
    case 'seller':
      return '/seller/dashboard';
    case 'buyer':
      return '/buyer/dashboard';
    default:
      return '/';
  }
};

/**
 * Check if user has specific role
 * @param {Object} user - User object
 * @param {string} role - Role to check
 * @returns {boolean}
 */
export const userHasRole = (user, role) => {
  const roles = getUserRoles(user);
  return roles.includes(role);
};

/**
 * Get role label in Indonesian
 * @param {string} role - Role name
 * @returns {string} Role label
 */
export const getRoleLabel = (role) => {
  const labels = {
    admin: 'Administrator',
    seller: 'Penjual',
    buyer: 'Pembeli',
  };
  return labels[role] || role;
};

/**
 * Get role badge color classes
 * @param {string} role - Role name
 * @returns {string} Tailwind classes
 */
export const getRoleBadgeClass = (role) => {
  const classes = {
    admin: 'bg-red-100 text-red-800',
    seller: 'bg-blue-100 text-blue-800',
    buyer: 'bg-green-100 text-green-800',
  };
  return classes[role] || 'bg-gray-100 text-gray-800';
};

/**
 * Debug: Log user role information
 * @param {Object} user - User object
 */
export const debugUserRole = (user) => {
  console.group('🔍 User Role Debug Info');
  console.log('User Object:', user);
  console.log('Roles (array):', user?.roles);
  console.log('Role (string):', user?.role);
  console.log('Normalized Roles:', getUserRoles(user));
  console.log('Primary Role:', getPrimaryRole(user));
  console.log('Dashboard Path:', getDashboardPath(user));
  console.groupEnd();
};

export default {
  getUserRoles,
  getPrimaryRole,
  getDashboardPath,
  userHasRole,
  getRoleLabel,
  getRoleBadgeClass,
  debugUserRole,
};
