# 🧪 Quick Testing Guide - Buyer Registration

## Test Menggunakan Fallback Mode (Tanpa Backend)

### Metode 1: Console Helper (Recommended)

1. **Buka browser** → http://localhost:5173
2. **Tekan F12** → Console tab
3. **Run command:**

```javascript
// Setup test users dulu
setupTestUsers();

// Quick test - login langsung sebagai buyer
loginAsTestBuyer();

// Atau test register flow
```

### Metode 2: Manual Registration Testing

**Step 1: Register Buyer**
```
1. Go to: http://localhost:5173/register/buyer
2. Fill form:
   - Username: testbuyer1
   - Email: testbuyer1@test.com
   - Password: Test123!
   - Confirm Password: Test123!
   - Full Name: Test Buyer One
   - Phone: 08123456789
3. Click "Daftar Sekarang"
4. ✅ Should see success message
5. ✅ Should auto-redirect to /buyer/dashboard (fallback mode)
```

**Step 2: Verify Dashboard Access**
```
1. Should land on /buyer/dashboard
2. Console should show:
   ✅ [BuyerDashboard] User authenticated
   ✅ Role: buyer
3. Check localStorage:
   - token: fallback_token_...
   - user: { role: "buyer", roles: ["buyer"] }
```

**Step 3: Test Logout & Login**
```
1. Click Logout
2. ✅ Redirected to /login
3. Login dengan:
   - Email: testbuyer1@test.com  
   - Password: Test123!
4. ✅ Should login successfully
5. ✅ Redirect to /buyer/dashboard
```

---

## Test Dengan Backend (Production Flow)

### Prerequisites
- Backend running di http://localhost:5000
- Database configured
- SMTP email configured

### Test Flow

**Step 1: Register**
```
POST http://localhost:5000/api/ecommerce/auth/register
Content-Type: application/json

{
  "username": "buyer2",
  "email": "buyer2@example.com",
  "password": "Buyer123!",
  "full_name": "Buyer Two",
  "phone": "081234567891",
  "role": "buyer"
}
```

**Expected Response 201:**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "user_id": 123,
    "username": "buyer2",
    "email": "buyer2@example.com",
    "role": "buyer",
    "email_verified": false
  }
}
```

**Step 2: Check Email**
```
Subject: Verify Your Email - E-Commerce Platform
Body: Click link to verify...
Link: http://localhost:5173/verify-email?token=abc123xyz
```

**Step 3: Verify Email**
```
1. Click link dari email
2. Frontend calls:
   GET http://localhost:5000/api/ecommerce/auth/verify-email?token=abc123xyz

3. Expected Response 200:
{
  "success": true,
  "message": "Email verified successfully. You can now log in."
}

4. ✅ Redirected to /login with success message
```

**Step 4: Login**
```
POST http://localhost:5000/api/ecommerce/auth/login
Content-Type: application/json

{
  "email": "buyer2@example.com",
  "password": "Buyer123!"
}
```

**Expected Response 200:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": 123,
      "email": "buyer2@example.com",
      "username": "buyer2",
      "roles": ["buyer"]
    }
  }
}
```

**Step 5: Access Dashboard**
```
1. Frontend saves token & user
2. Redirect to /buyer/dashboard
3. ✅ Dashboard loads with buyer data
```

---

## Validation Tests

### Test 1: Invalid Email
```
Input: email = "invalid"
Expected: ❌ "Email tidak valid"
```

### Test 2: Short Username
```
Input: username = "ab"
Expected: ❌ "Username minimal 3 karakter"
```

### Test 3: Weak Password
```
Input: password = "12345"
Expected: ❌ "Password minimal 8 karakter"
```

### Test 4: Password Mismatch
```
Input: 
  password = "Test123!"
  confirmPassword = "Different123!"
Expected: ❌ "Password tidak cocok"
```

### Test 5: Short Phone
```
Input: phone = "123"
Expected: ❌ "Nomor telepon minimal 10 digit"
```

### Test 6: Duplicate Email
```
1. Register: buyer@test.com
2. Register again: buyer@test.com
Expected: ❌ "Email already registered"
```

---

## Browser Console Checks

### After Registration (Fallback)
```javascript
// Check auth
checkAuth();

// Expected output:
{
  authenticated: true,
  role: "buyer",
  dashboard: "/buyer/dashboard",
  hasToken: true,
  hasUser: true
}
```

### After Registration (Production)
```javascript
// Should NOT have token yet
checkAuth();

// Expected output:
{
  authenticated: false,
  role: null,
  dashboard: "/",
  hasToken: false,
  hasUser: false
}
```

### After Login
```javascript
checkAuth();

// Expected output:
{
  authenticated: true,
  role: "buyer",
  dashboard: "/buyer/dashboard",
  hasToken: true,
  hasUser: true
}
```

---

## Quick Debug Commands

```javascript
// 1. Check current auth state
checkAuth();

// 2. Clear and reset
clearAuthData();

// 3. Setup test users
setupTestUsers();

// 4. Quick buyer login
loginAsTestBuyer();

// 5. Manual check localStorage
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user')));

// 6. Check fallback users
console.log('Fallback Users:', 
  JSON.parse(localStorage.getItem('fallback_users') || '[]')
);
```

---

## Error Scenarios to Test

### Scenario 1: Backend Down (Fallback Mode)
```
1. Stop backend
2. Try register
3. ✅ Should use fallback
4. ✅ Auto-login works
5. ✅ Dashboard accessible
```

### Scenario 2: Email Not Verified
```
1. Register (production)
2. Don't verify email
3. Try login
4. ❌ Should get: "Email not verified"
5. ✅ Should suggest resend verification
```

### Scenario 3: Wrong Password
```
1. Register & verify
2. Login with wrong password
3. ❌ Should get: "Invalid credentials"
```

### Scenario 4: Expired Token (if backend implements)
```
1. Login
2. Wait for token expiry (or manually expire)
3. Try access dashboard
4. ❌ Should redirect to login
5. ✅ Message: "Session expired"
```

---

## API Response Validation

### Register Response (Production)
```javascript
// Should NOT contain token
{
  success: true,
  message: "Please check your email...",
  data: {
    user: { /* user data */ }
    // NO TOKEN!
  }
}
```

### Register Response (Fallback)
```javascript
// Should contain token
{
  success: true,
  message: "Registration successful (FALLBACK)",
  data: {
    user: { /* user data */ },
    token: "fallback_token_..." // TOKEN included
  }
}
```

### Login Response
```javascript
// Always contains token
{
  success: true,
  message: "Login successful",
  data: {
    token: "eyJ...",
    user: {
      userId: 123,
      username: "buyer1",
      email: "buyer@test.com",
      roles: ["buyer"] // or role: "buyer"
    }
  }
}
```

---

## Network Tab Checks

### Registration Request
```
POST /api/ecommerce/auth/register
Request:
{
  "username": "buyer1",
  "email": "buyer@test.com",
  "password": "Buyer123!",
  "full_name": "Buyer One",
  "phone": "08123456789",
  "role": "buyer"  ← Must be "buyer"
}

Response 201:
{
  "success": true,
  "message": "Registration successful. Please check your email..."
}
```

### Login Request
```
POST /api/ecommerce/auth/login
Request:
{
  "email": "buyer@test.com",
  "password": "Buyer123!"
}

Response 200:
{
  "success": true,
  "data": {
    "token": "eyJ...",
    "user": { ... }
  }
}

Response 403 (not verified):
{
  "success": false,
  "error": "Email not verified. Please check your inbox..."
}
```

---

## Success Criteria

### ✅ Registration Success (Production)
- [ ] Form submitted successfully
- [ ] Success message shown
- [ ] Email verification message displayed
- [ ] Redirected to login page
- [ ] Email received (in real backend)
- [ ] No token saved to localStorage
- [ ] No auto-login

### ✅ Registration Success (Fallback)
- [ ] Form submitted successfully
- [ ] User created in fallback_users
- [ ] Token auto-generated
- [ ] Auth saved to localStorage
- [ ] Auto-redirected to dashboard
- [ ] Dashboard loads successfully
- [ ] Role is "buyer"

### ✅ Email Verification Success
- [ ] Link clicked
- [ ] API call successful
- [ ] Success message shown
- [ ] Redirected to login
- [ ] Can now login

### ✅ Login Success
- [ ] Credentials accepted
- [ ] Token received
- [ ] User data received
- [ ] Auth saved to localStorage
- [ ] Redirected to /buyer/dashboard
- [ ] Dashboard displays user data
- [ ] All buyer features accessible

---

## Troubleshooting Quick Fixes

### Issue: Stuck at Login After Registration
```javascript
// Fix: Clear and start fresh
clearAuthData();
loginAsTestBuyer();
```

### Issue: Dashboard Redirects Back to Login
```javascript
// Check auth state
checkAuth();

// If role missing, fix it:
const user = JSON.parse(localStorage.getItem('user'));
user.role = 'buyer';
user.roles = ['buyer'];
localStorage.setItem('user', JSON.stringify(user));
location.reload();
```

### Issue: Can't Register (Email Exists)
```javascript
// Clear fallback users (dev only)
localStorage.removeItem('fallback_users');

// Or use different email
```

---

## Quick Test Script

Copy-paste ke console:

```javascript
// Complete test flow
async function testBuyerRegistration() {
  console.log('🧪 Testing Buyer Registration...\n');
  
  // 1. Clear state
  console.log('1️⃣ Clearing auth data...');
  clearAuthData();
  
  // 2. Setup test users
  console.log('2️⃣ Setting up test users...');
  setupTestUsers();
  
  // 3. Quick login
  console.log('3️⃣ Logging in as test buyer...');
  loginAsTestBuyer();
  
  // Wait for redirect
  setTimeout(() => {
    console.log('4️⃣ Checking auth after login...');
    const auth = checkAuth();
    
    if (auth.authenticated && auth.role === 'buyer') {
      console.log('✅ TEST PASSED! Buyer registration flow working!');
    } else {
      console.log('❌ TEST FAILED! Auth state:', auth);
    }
  }, 2000);
}

// Run test
testBuyerRegistration();
```

---

**Happy Testing! 🎉**

Last Updated: ${new Date().toISOString()}
