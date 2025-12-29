/**
 * Quick Setup Buyer User
 * Copy-paste script ini ke browser console untuk membuat user buyer
 */

// CARA 1: Setup dan login otomatis sebagai buyer
function setupBuyerNow() {
  console.log('🔧 Setting up buyer user...');
  
  // Create buyer user
  const buyerUser = {
    user_id: 100,
    username: 'buyer_demo',
    email: 'buyer@demo.com',
    full_name: 'Buyer Demo',
    phone: '081234567890',
    role: 'buyer',
    roles: ['buyer'],
    email_verified: true,
    created_at: new Date().toISOString()
  };
  
  // Generate token
  const token = 'fallback_token_buyer_' + Math.random().toString(36).substr(2, 9);
  
  // Save to localStorage
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(buyerUser));
  
  // Add to fallback users
  const users = JSON.parse(localStorage.getItem('fallback_users') || '[]');
  
  // Remove existing buyer_demo if exists
  const filteredUsers = users.filter(u => u.email !== 'buyer@demo.com');
  
  // Add new buyer with password
  filteredUsers.push({
    ...buyerUser,
    password: 'buyer123' // Password untuk login manual
  });
  
  localStorage.setItem('fallback_users', JSON.stringify(filteredUsers));
  
  console.log('✅ Buyer user created!');
  console.log('📧 Email: buyer@demo.com');
  console.log('🔑 Password: buyer123');
  console.log('👤 Username: buyer_demo');
  console.log('🎭 Role: buyer');
  console.log('🔐 Token:', token.substring(0, 30) + '...');
  console.log('\n🚀 Redirecting to buyer dashboard...');
  
  // Redirect to dashboard
  setTimeout(() => {
    window.location.href = '/buyer/dashboard';
  }, 1000);
}

// CARA 2: Hanya create user (tanpa auto-login)
function createBuyerUser() {
  console.log('👤 Creating buyer user...');
  
  const buyerUser = {
    user_id: 100,
    username: 'buyer_demo',
    email: 'buyer@demo.com',
    password: 'buyer123',
    full_name: 'Buyer Demo',
    phone: '081234567890',
    role: 'buyer',
    roles: ['buyer'],
    email_verified: true,
    created_at: new Date().toISOString()
  };
  
  const users = JSON.parse(localStorage.getItem('fallback_users') || '[]');
  const filteredUsers = users.filter(u => u.email !== 'buyer@demo.com');
  filteredUsers.push(buyerUser);
  localStorage.setItem('fallback_users', JSON.stringify(filteredUsers));
  
  console.log('✅ Buyer user created!');
  console.log('📧 Email: buyer@demo.com');
  console.log('🔑 Password: buyer123');
  console.log('\n➡️  Now go to /login and login with these credentials');
  
  return buyerUser;
}

// CARA 3: Login manual dengan user yang sudah ada
function loginAsBuyerManual() {
  console.log('🔐 Manual login as buyer...');
  
  const users = JSON.parse(localStorage.getItem('fallback_users') || '[]');
  const buyer = users.find(u => u.email === 'buyer@demo.com');
  
  if (!buyer) {
    console.error('❌ Buyer user not found. Run createBuyerUser() first.');
    return;
  }
  
  const { password, ...userWithoutPassword } = buyer;
  const token = 'fallback_token_buyer_' + Math.random().toString(36).substr(2, 9);
  
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  
  console.log('✅ Logged in as buyer!');
  console.log('🚀 Redirecting to dashboard...');
  
  setTimeout(() => {
    window.location.href = '/buyer/dashboard';
  }, 500);
}

// CARA 4: Fix role jika user sudah login tapi role salah
function fixBuyerRole() {
  console.log('🔧 Fixing buyer role...');
  
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    console.error('❌ No user data found. Please login first.');
    return;
  }
  
  const user = JSON.parse(userStr);
  user.role = 'buyer';
  user.roles = ['buyer'];
  
  localStorage.setItem('user', JSON.stringify(user));
  
  console.log('✅ Role fixed to buyer!');
  console.log('👤 User:', user.username);
  console.log('🎭 Role:', user.role);
  console.log('🔄 Reloading page...');
  
  setTimeout(() => {
    location.reload();
  }, 500);
}

console.log('='.repeat(60));
console.log('🛒 BUYER USER SETUP HELPER');
console.log('='.repeat(60));
console.log('\n📋 Available commands:\n');
console.log('1️⃣  setupBuyerNow()        - Create buyer & auto-login (FASTEST)');
console.log('2️⃣  createBuyerUser()      - Create buyer user only');
console.log('3️⃣  loginAsBuyerManual()   - Login with existing buyer');
console.log('4️⃣  fixBuyerRole()         - Fix role if already logged in');
console.log('\n💡 Recommended: Run setupBuyerNow() for instant access\n');
console.log('='.repeat(60));
