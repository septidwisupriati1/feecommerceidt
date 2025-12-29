/**
 * Setup Test Users
 * Script untuk membuat test users di fallback mode
 * Run di browser console
 */

window.setupTestUsers = function() {
  console.group('👥 Setting up test users...');
  
  const testUsers = [
    {
      user_id: 1,
      username: 'buyer1',
      email: 'buyer@test.com',
      password: 'buyer123',
      full_name: 'Test Buyer',
      phone: '081234567890',
      role: 'buyer',
      roles: ['buyer'],
      email_verified: true,
      created_at: new Date().toISOString()
    },
    {
      user_id: 2,
      username: 'seller1',
      email: 'seller@test.com',
      password: 'seller123',
      full_name: 'Test Seller',
      phone: '081234567891',
      role: 'seller',
      roles: ['seller'],
      email_verified: true,
      store_name: 'Test Store',
      created_at: new Date().toISOString()
    },
    {
      user_id: 3,
      username: 'admin1',
      email: 'admin@test.com',
      password: 'admin123',
      full_name: 'Test Admin',
      phone: '081234567892',
      role: 'admin',
      roles: ['admin'],
      email_verified: true,
      created_at: new Date().toISOString()
    }
  ];
  
  localStorage.setItem('fallback_users', JSON.stringify(testUsers));
  
  console.log('✅ Test users created:');
  console.table(testUsers.map(u => ({
    Username: u.username,
    Email: u.email,
    Password: u.password,
    Role: u.role
  })));
  
  console.log('\n📝 Login credentials:');
  console.log('BUYER:');
  console.log('  Email: buyer@test.com');
  console.log('  Password: buyer123');
  console.log('\nSELLER:');
  console.log('  Email: seller@test.com');
  console.log('  Password: seller123');
  console.log('\nADMIN:');
  console.log('  Email: admin@test.com');
  console.log('  Password: admin123');
  
  console.groupEnd();
  
  return testUsers;
};

window.loginAsTestBuyer = function() {
  console.log('🔐 Logging in as test buyer...');
  
  const user = {
    user_id: 1,
    username: 'buyer1',
    email: 'buyer@test.com',
    full_name: 'Test Buyer',
    phone: '081234567890',
    role: 'buyer',
    roles: ['buyer'],
    email_verified: true
  };
  
  const token = 'fallback_token_test_buyer_' + Math.random().toString(36).substr(2, 9);
  
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  
  console.log('✅ Logged in as buyer');
  console.log('👤 User:', user.username);
  console.log('🎭 Role:', user.role);
  console.log('🔑 Token:', token.substring(0, 30) + '...');
  console.log('\n🚀 Redirecting to /buyer/dashboard...');
  
  setTimeout(() => {
    window.location.href = '/buyer/dashboard';
  }, 500);
};

window.loginAsTestSeller = function() {
  console.log('🔐 Logging in as test seller...');
  
  const user = {
    user_id: 2,
    username: 'seller1',
    email: 'seller@test.com',
    full_name: 'Test Seller',
    phone: '081234567891',
    role: 'seller',
    roles: ['seller'],
    email_verified: true,
    store_name: 'Test Store'
  };
  
  const token = 'fallback_token_test_seller_' + Math.random().toString(36).substr(2, 9);
  
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  
  console.log('✅ Logged in as seller');
  console.log('👤 User:', user.username);
  console.log('🎭 Role:', user.role);
  console.log('🔑 Token:', token.substring(0, 30) + '...');
  console.log('\n🚀 Redirecting to /seller/dashboard...');
  
  setTimeout(() => {
    window.location.href = '/seller/dashboard';
  }, 500);
};

window.loginAsTestAdmin = function() {
  console.log('🔐 Logging in as test admin...');
  
  const user = {
    user_id: 3,
    username: 'admin1',
    email: 'admin@test.com',
    full_name: 'Test Admin',
    phone: '081234567892',
    role: 'admin',
    roles: ['admin'],
    email_verified: true
  };
  
  const token = 'fallback_token_test_admin_' + Math.random().toString(36).substr(2, 9);
  
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  
  console.log('✅ Logged in as admin');
  console.log('👤 User:', user.username);
  console.log('🎭 Role:', user.role);
  console.log('🔑 Token:', token.substring(0, 30) + '...');
  console.log('\n🚀 Redirecting to /admin/dashboard...');
  
  setTimeout(() => {
    window.location.href = '/admin/dashboard';
  }, 500);
};

window.clearAuthData = function() {
  console.log('🧹 Clearing auth data...');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('✅ Auth data cleared');
  console.log('🔄 Redirecting to login...');
  setTimeout(() => {
    window.location.href = '/login';
  }, 500);
};

// Auto-setup jika parameter ada
if (window.location.search.includes('setup=users')) {
  console.log('🔧 Auto-setup detected');
  setupTestUsers();
}

console.log('ℹ️ Test User Helper loaded. Available commands:');
console.log('  setupTestUsers()     - Create test users');
console.log('  loginAsTestBuyer()   - Quick login as buyer');
console.log('  loginAsTestSeller()  - Quick login as seller');
console.log('  loginAsTestAdmin()   - Quick login as admin');
console.log('  clearAuthData()      - Logout and clear data');
