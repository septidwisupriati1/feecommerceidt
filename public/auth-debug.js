/**
 * Auth Debug Utility
 * Gunakan di browser console untuk debugging masalah autentikasi
 */

// Cara pakai: Buka browser console dan ketik:
// checkAuth()

window.checkAuth = function() {
  console.group('🔍 AUTH DEBUG INFO');
  
  // Get raw data
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  console.log('📦 Raw LocalStorage:');
  console.log('  token:', token ? token.substring(0, 50) + '...' : 'NULL');
  console.log('  user string:', userStr);
  
  // Parse user
  let user = null;
  try {
    user = JSON.parse(userStr);
    console.log('✅ User parsed successfully');
  } catch (e) {
    console.error('❌ Failed to parse user:', e);
  }
  
  console.log('\n👤 User Object:');
  console.log('  Full user:', user);
  console.log('  user_id:', user?.user_id);
  console.log('  username:', user?.username);
  console.log('  email:', user?.email);
  console.log('  role (string):', user?.role);
  console.log('  roles (array):', user?.roles);
  
  console.log('\n🔐 Auth Status:');
  console.log('  Has Token:', !!token);
  console.log('  Has User:', !!user);
  console.log('  Is Authenticated:', !!(token && user));
  
  console.log('\n🎭 Role Information:');
  const roleFromString = user?.role;
  const roleFromArray = user?.roles?.[0];
  const effectiveRole = roleFromArray || roleFromString;
  
  console.log('  Role (string field):', roleFromString || 'NOT SET');
  console.log('  Roles (array field):', roleFromArray || 'NOT SET');
  console.log('  Effective Role:', effectiveRole || 'NO ROLE FOUND');
  
  console.log('\n✅ Access Permissions:');
  console.log('  Can access admin?:', effectiveRole === 'admin' || user?.roles?.includes('admin'));
  console.log('  Can access seller?:', effectiveRole === 'seller' || user?.roles?.includes('seller'));
  console.log('  Can access buyer?:', effectiveRole === 'buyer' || user?.roles?.includes('buyer'));
  
  console.log('\n🚪 Expected Dashboard:');
  let dashboard = '/';
  if (effectiveRole === 'admin' || user?.roles?.includes('admin')) {
    dashboard = '/admin/dashboard';
  } else if (effectiveRole === 'seller' || user?.roles?.includes('seller')) {
    dashboard = '/seller/dashboard';
  } else if (effectiveRole === 'buyer' || user?.roles?.includes('buyer')) {
    dashboard = '/buyer/dashboard';
  }
  console.log('  Should redirect to:', dashboard);
  
  console.groupEnd();
  
  // Return summary
  return {
    authenticated: !!(token && user),
    role: effectiveRole,
    dashboard: dashboard,
    user: user,
    hasToken: !!token,
    hasUser: !!user
  };
};

// Auto-check on load jika ada parameter
if (window.location.search.includes('debug=auth')) {
  console.log('🔍 Auto-running auth check (debug=auth detected)');
  window.checkAuth();
}

console.log('ℹ️ Auth Debug Utility loaded. Run checkAuth() in console to debug.');
