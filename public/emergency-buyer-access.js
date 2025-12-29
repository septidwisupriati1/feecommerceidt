/**
 * EMERGENCY FIX - Direct Access to Buyer Dashboard
 * Jalankan ini di console jika stuck di login loop
 */

function emergencyBuyerAccess() {
  console.log('🚨 EMERGENCY ACCESS - Forcing buyer dashboard access...\n');
  
  // Step 1: Clear any corrupted auth data
  console.log('1️⃣ Clearing old auth data...');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Step 2: Create clean buyer user
  console.log('2️⃣ Creating fresh buyer user...');
  const buyerUser = {
    user_id: 999,
    username: 'emergency_buyer',
    email: 'emergency@buyer.com',
    full_name: 'Emergency Buyer',
    phone: '08999999999',
    role: 'buyer',           // ← String format
    roles: ['buyer'],        // ← Array format
    email_verified: true,
    created_at: new Date().toISOString()
  };
  
  // Step 3: Generate token
  console.log('3️⃣ Generating auth token...');
  const token = 'emergency_buyer_token_' + Date.now();
  
  // Step 4: Save with verification
  console.log('4️⃣ Saving to localStorage...');
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(buyerUser));
  
  // Step 5: Verify save
  const savedToken = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  
  console.log('\n✅ VERIFICATION:');
  console.log('Token saved:', !!savedToken);
  console.log('User saved:', !!savedUser);
  console.log('Token value:', savedToken);
  console.log('User value:', savedUser);
  
  if (!savedToken || !savedUser) {
    console.error('❌ FAILED TO SAVE! Try again or check browser permissions.');
    return false;
  }
  
  // Step 6: Verify user object
  try {
    const user = JSON.parse(savedUser);
    console.log('\n📋 USER OBJECT:');
    console.log('  user_id:', user.user_id);
    console.log('  username:', user.username);
    console.log('  email:', user.email);
    console.log('  role (string):', user.role);
    console.log('  roles (array):', user.roles);
    
    if (!user.role && !user.roles) {
      console.error('❌ User missing role!');
      return false;
    }
    
  } catch (e) {
    console.error('❌ Failed to parse user:', e);
    return false;
  }
  
  console.log('\n✅ ALL CHECKS PASSED!');
  console.log('🚀 Redirecting to buyer dashboard in 2 seconds...\n');
  
  // Step 7: Force redirect
  setTimeout(() => {
    console.log('🔄 REDIRECTING NOW...');
    window.location.href = '/buyer/dashboard';
  }, 2000);
  
  return true;
}

// Quick function untuk bypass semua check
function bypassToDashboard() {
  console.log('⚡ BYPASS MODE - Direct dashboard access...');
  
  const user = {
    user_id: 888,
    username: 'bypass_buyer',
    email: 'bypass@buyer.com',
    role: 'buyer',
    roles: ['buyer'],
    email_verified: true
  };
  
  const token = 'bypass_token_' + Date.now();
  
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  
  console.log('✅ Auth set!');
  console.log('🚀 Going to dashboard NOW...');
  
  // Immediate redirect
  window.location.replace('/buyer/dashboard');
}

// Function untuk debug kenapa redirect
function debugRedirectIssue() {
  console.log('🔍 DEBUGGING REDIRECT ISSUE\n');
  console.log('='.repeat(60));
  
  // Check 1: LocalStorage
  console.log('\n1️⃣ LOCALSTORAGE CHECK:');
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  console.log('Has token:', !!token);
  console.log('Token value:', token);
  console.log('Has user:', !!userStr);
  console.log('User string:', userStr);
  
  if (!token) {
    console.error('❌ PROBLEM: No token found!');
    console.log('💡 FIX: Run emergencyBuyerAccess()');
    return;
  }
  
  if (!userStr) {
    console.error('❌ PROBLEM: No user data found!');
    console.log('💡 FIX: Run emergencyBuyerAccess()');
    return;
  }
  
  // Check 2: User object
  console.log('\n2️⃣ USER OBJECT CHECK:');
  let user;
  try {
    user = JSON.parse(userStr);
    console.log('User parsed:', user);
    console.log('user_id:', user.user_id);
    console.log('username:', user.username);
    console.log('email:', user.email);
    console.log('role (string):', user.role);
    console.log('roles (array):', user.roles);
  } catch (e) {
    console.error('❌ PROBLEM: Failed to parse user!');
    console.error('Error:', e);
    console.log('💡 FIX: Run emergencyBuyerAccess()');
    return;
  }
  
  // Check 3: Role validation
  console.log('\n3️⃣ ROLE VALIDATION:');
  const hasStringRole = typeof user.role === 'string';
  const hasArrayRoles = Array.isArray(user.roles);
  const roleIsBuyer = user.role === 'buyer' || user.roles?.includes('buyer');
  
  console.log('Has string role:', hasStringRole, '→', user.role);
  console.log('Has array roles:', hasArrayRoles, '→', user.roles);
  console.log('Role is buyer:', roleIsBuyer);
  
  if (!roleIsBuyer) {
    console.error('❌ PROBLEM: User is not a buyer!');
    console.log('Current role:', user.role || user.roles);
    console.log('💡 FIX: Run emergencyBuyerAccess()');
    return;
  }
  
  // Check 4: Auth functions
  console.log('\n4️⃣ AUTH FUNCTIONS CHECK:');
  if (typeof window.checkAuth === 'function') {
    const authState = window.checkAuth();
    console.log('Auth state:', authState);
  } else {
    console.warn('⚠️ checkAuth() not available');
  }
  
  console.log('\n='.repeat(60));
  console.log('✅ ALL CHECKS PASSED!');
  console.log('🤔 If still redirecting, check browser console for:');
  console.log('   - ProtectedRoute messages');
  console.log('   - BuyerDashboard messages');
  console.log('   - Network errors');
  console.log('\n💡 Try: bypassToDashboard() for immediate access');
  console.log('='.repeat(60));
}

console.log('\n' + '='.repeat(60));
console.log('🚨 EMERGENCY BUYER ACCESS TOOLS LOADED');
console.log('='.repeat(60));
console.log('\n📋 Available commands:\n');
console.log('emergencyBuyerAccess()  - Complete fix + auto redirect');
console.log('bypassToDashboard()     - Instant redirect (fastest)');
console.log('debugRedirectIssue()    - Debug why redirecting\n');
console.log('💡 Recommended: Run bypassToDashboard() first!\n');
console.log('='.repeat(60) + '\n');
