# 🛒 Buyer Registration Flow - Implementation Guide

## Overview
Panduan lengkap implementasi registrasi buyer yang benar sesuai dengan dokumentasi API `Buyer-Registration-API.md`.

---

## 🔄 Registration Flow

### Production Mode (With Backend)
```
1. User mengisi form registrasi
   ↓
2. POST /api/ecommerce/auth/register
   Role: "buyer"
   ↓
3. Backend creates user with email_verified: false
   ↓
4. Backend sends verification email
   ↓
5. Response: "Please check your email to verify"
   ↓
6. User checks email & clicks verification link
   ↓
7. GET /api/ecommerce/auth/verify-email?token=xxx
   ↓
8. Backend sets email_verified: true
   ↓
9. User redirected to login page
   ↓
10. User login dengan credentials
    ↓
11. POST /api/ecommerce/auth/login
    ↓
12. Backend validates email_verified === true
    ↓
13. Response: { token, user }
    ↓
14. Frontend saves token & user to localStorage
    ↓
15. Redirect to /buyer/dashboard ✅
```

### Fallback Mode (Without Backend - Development)
```
1. User mengisi form registrasi
   ↓
2. POST /api/ecommerce/auth/register (fails)
   ↓
3. Frontend catches error → fallback mode
   ↓
4. Create user in localStorage with:
   - email_verified: true (auto-verified)
   - role: "buyer"
   - roles: ["buyer"]
   ↓
5. Generate fallback_token
   ↓
6. Response: { token, user }
   ↓
7. Save auth immediately
   ↓
8. Redirect to /buyer/dashboard ✅
```

---

## 📝 Implementation Checklist

### ✅ RegisterBuyerPage.jsx

**Required Fields:**
- [x] username (min 3 chars)
- [x] email (valid email format)
- [x] password (min 8 chars)
- [x] confirmPassword (must match)
- [x] full_name (optional but recommended)
- [x] phone (optional, min 10 digits if provided)
- [x] role: "buyer" (hardcoded)

**Validation:**
```javascript
// Username
if (!formData.username || formData.username.length < 3) {
  setError('Username minimal 3 karakter');
  return false;
}

// Email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!formData.email || !emailRegex.test(formData.email)) {
  setError('Email tidak valid');
  return false;
}

// Password
if (!formData.password || formData.password.length < 8) {
  setError('Password minimal 8 karakter');
  return false;
}

// Password match
if (formData.password !== formData.confirmPassword) {
  setError('Password tidak cocok');
  return false;
}

// Phone (optional)
if (formData.phone && formData.phone.length < 10) {
  setError('Nomor telepon minimal 10 digit');
  return false;
}
```

**Submit Handler:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  try {
    const { confirmPassword, ...registerData } = formData;
    const response = await authAPI.register(registerData);
    
    if (!response.success) {
      throw new Error(response.error);
    }
    
    // Check if email verification required
    if (response.message?.includes('verify') || 
        response.message?.includes('email')) {
      // Production: Email verification required
      setSuccess(
        'Registrasi berhasil! ' +
        'Silakan cek email Anda untuk verifikasi akun.'
      );
      
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Cek email untuk verifikasi.',
            email: registerData.email 
          }
        });
      }, 3000);
      
    } else if (response.data?.token && response.data?.user) {
      // Fallback: Auto-login
      const user = {
        ...response.data.user,
        role: response.data.user.role || 'buyer',
        roles: response.data.user.roles || ['buyer']
      };
      
      saveAuth(response.data.token, user);
      
      setTimeout(() => {
        navigate(getDashboardPath(user), { replace: true });
      }, 1500);
    }
    
  } catch (err) {
    setError(err.message);
  }
};
```

---

## 🎯 Critical Points

### 1. **JANGAN Auto-Login Setelah Register (Production)**

❌ **WRONG:**
```javascript
// After registration
saveAuth(response.data.token, response.data.user);
navigate('/buyer/dashboard');
```

✅ **CORRECT:**
```javascript
// After registration
setSuccess('Cek email untuk verifikasi');
navigate('/login', { state: { email: email } });
```

**Reason:** Backend tidak return token saat register. Token hanya didapat setelah:
1. Email verified
2. Login dengan credentials

---

### 2. **Role Format yang Benar**

Backend expect:
```json
{
  "role": "buyer"  // String: "buyer", "seller", or "admin"
}
```

Backend return (after login):
```json
{
  "user": {
    "user_id": 1,
    "username": "buyer1",
    "email": "buyer@test.com",
    "role": "buyer",      // ← String format
    "roles": ["buyer"]    // ← Array format
  }
}
```

Frontend harus handle BOTH formats:
```javascript
const userRole = user.role || user.roles?.[0];
const hasRole = (role) => {
  return user.role === role || user.roles?.includes(role);
};
```

---

### 3. **Email Verification Flow**

**Backend sends email with link:**
```
http://localhost:5173/verify-email?token=abc123xyz
```

**Frontend VerifyEmailPage.jsx should:**
```javascript
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  
  if (token) {
    verifyEmail(token);
  }
}, []);

const verifyEmail = async (token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/verify-email?token=${token}`
    );
    const result = await response.json();
    
    if (result.success) {
      setSuccess('Email verified! You can now login.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  } catch (err) {
    setError('Verification failed');
  }
};
```

---

### 4. **Fallback Mode Handling**

```javascript
// authAPI.js - register function
export const register = async (data) => {
  try {
    // Try backend first
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error);
    }
    
    // Production: Return without token
    return {
      success: true,
      message: result.message, // "Please verify email"
      data: {
        user: result.data.user // No token!
      }
    };
    
  } catch (error) {
    // Fallback mode
    const newUser = {
      user_id: Date.now(),
      username: data.username,
      email: data.email,
      full_name: data.full_name || '',
      phone: data.phone || '',
      email_verified: true, // Auto-verify in fallback
      role: data.role,
      roles: [data.role]
    };
    
    const token = 'fallback_token_' + Math.random().toString(36);
    
    // Fallback: Return WITH token for auto-login
    return {
      success: true,
      message: 'Registration successful (FALLBACK)',
      data: {
        user: newUser,
        token: token // Token available in fallback
      }
    };
  }
};
```

---

## 🧪 Testing Scenarios

### Scenario 1: Production Registration (Email Verification)
```
1. Fill form: buyer@test.com, password123
2. Submit
3. ✅ See: "Cek email untuk verifikasi"
4. ✅ Redirected to /login with message
5. Check email (real backend needed)
6. Click verification link
7. ✅ Email verified
8. Login with credentials
9. ✅ Get token
10. ✅ Redirect to /buyer/dashboard
```

### Scenario 2: Fallback Registration (Auto-Login)
```
1. Backend not running
2. Fill form: buyer@test.com, password123
3. Submit
4. ✅ Fallback mode activated
5. ✅ User created in localStorage
6. ✅ Token auto-generated
7. ✅ Auth auto-saved
8. ✅ Direct redirect to /buyer/dashboard
```

### Scenario 3: Duplicate Email
```
1. Register with buyer@test.com
2. Try register again with same email
3. ✅ Error: "Email already registered"
```

### Scenario 4: Invalid Input
```
1. Username: "ab" (< 3 chars)
   ✅ Error: "Username minimal 3 karakter"

2. Email: "invalid"
   ✅ Error: "Email tidak valid"

3. Password: "12345" (< 8 chars)
   ✅ Error: "Password minimal 8 karakter"

4. Confirm: "different"
   ✅ Error: "Password tidak cocok"
```

---

## 🐛 Common Errors & Fixes

### Error 1: "Email already registered"
**Cause:** Email sudah ada di database

**Fix:** 
- Use different email
- Or delete existing user (dev only)

---

### Error 2: Redirect to login immediately after register
**Cause:** Wrong - assuming token available after register

**Fix:** Check response for email verification message:
```javascript
if (response.message?.includes('verify')) {
  // Show verification message, don't auto-login
  navigate('/login', { state: { message: '...' } });
}
```

---

### Error 3: "Email not verified" on login
**Cause:** User hasn't clicked verification link

**Fix:**
- Check email inbox (and spam folder)
- Use resend verification endpoint:
```javascript
POST /api/ecommerce/auth/resend-verification
{ "email": "buyer@test.com" }
```

---

### Error 4: Dashboard redirect to login
**Cause:** Role not saved correctly or missing

**Fix:** Ensure user object has role:
```javascript
const user = {
  ...response.data.user,
  role: response.data.user.role || 'buyer',
  roles: response.data.user.roles || ['buyer']
};
saveAuth(token, user);
```

---

## 📊 Data Validation Rules

### Backend Validation (from docs)
```javascript
// Username
- Required: Yes
- Min length: 3
- Max length: 50
- Unique: Yes
- Pattern: alphanumeric + underscore

// Email
- Required: Yes
- Format: valid email
- Unique: Yes

// Password
- Required: Yes
- Min length: 8
- Must have: uppercase, lowercase, number, special char
- Hashed: bcrypt with salt 10

// Full Name
- Required: No
- Max length: 100

// Phone
- Required: No
- Min length: 10
- Max length: 15
- Pattern: numeric only

// Role
- Required: Yes
- Values: "buyer", "seller", "admin"
```

### Frontend Validation (RegisterBuyerPage)
```javascript
const validate = () => {
  // Username
  if (!username || username.length < 3) return false;
  
  // Email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
  
  // Password
  if (!password || password.length < 8) return false;
  
  // Confirm password
  if (password !== confirmPassword) return false;
  
  // Phone (if provided)
  if (phone && (phone.length < 10 || !/^\d+$/.test(phone))) {
    return false;
  }
  
  return true;
};
```

---

## 🔐 Security Considerations

### 1. Password Security
- ✅ Min 8 characters enforced
- ✅ Client-side validation
- ✅ Backend hashing with bcrypt
- ✅ Never stored in plain text
- ✅ Never logged in console

### 2. Email Verification
- ✅ Prevents fake accounts
- ✅ Token expires in 24h
- ✅ One-time use token
- ✅ Can resend if needed

### 3. Role Assignment
- ✅ Role hardcoded to "buyer" in frontend
- ✅ Backend validates role value
- ✅ Cannot register as admin via form
- ✅ Can upgrade buyer→seller later

---

## 📋 Complete Example

### RegisterBuyerPage.jsx (Key Parts)
```jsx
const [formData, setFormData] = useState({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  full_name: '',
  phone: '',
  role: 'buyer' // ← Fixed
});

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  try {
    const { confirmPassword, ...data } = formData;
    const response = await authAPI.register(data);
    
    if (!response.success) {
      throw new Error(response.error);
    }
    
    // Handle based on backend response
    if (response.message?.includes('verify')) {
      // Production mode
      setSuccess('Cek email Anda untuk verifikasi!');
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Registrasi berhasil! Cek email untuk verifikasi.',
            email: data.email 
          }
        });
      }, 3000);
    } else if (response.data?.token) {
      // Fallback mode
      const user = {
        ...response.data.user,
        role: response.data.user.role || 'buyer',
        roles: response.data.user.roles || ['buyer']
      };
      saveAuth(response.data.token, user);
      navigate('/buyer/dashboard', { replace: true });
    }
    
  } catch (err) {
    setError(err.message);
  }
};
```

---

## ✅ Final Checklist

Before deploying:

- [ ] Backend API endpoints working
- [ ] Email service configured (SMTP)
- [ ] Frontend validation matches backend
- [ ] Error messages user-friendly
- [ ] Success messages clear
- [ ] Email verification tested
- [ ] Resend verification working
- [ ] Login after verification working
- [ ] Dashboard redirect correct
- [ ] Fallback mode tested
- [ ] Role saved correctly
- [ ] LocalStorage data verified
- [ ] Console logs clean
- [ ] No sensitive data logged
- [ ] Terms & conditions link working

---

## 🎉 Summary

**Correct Flow:**
1. Register → Email sent
2. Verify email → Click link
3. Login → Get token
4. Dashboard → Start shopping

**Key Points:**
- ✅ NO auto-login after register (production)
- ✅ Email verification REQUIRED
- ✅ Token only after login
- ✅ Role must be "buyer"
- ✅ Both role formats supported
- ✅ Fallback mode for development
- ✅ Clear error messages
- ✅ User-friendly flow

---

Last Updated: ${new Date().toISOString()}
