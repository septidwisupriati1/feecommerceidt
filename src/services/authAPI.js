/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import { saveAuth, clearAuth } from '../utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/ecommerce';

/**
 * Register new user
 * @param {Object} data - Registration data
 * @param {string} data.username - Unique username
 * @param {string} data.email - Email address
 * @param {string} data.password - Password (min 8 chars)
 * @param {string} data.full_name - Full name
 * @param {string} data.phone - Phone number
 * @param {string} data.role - Role (seller/admin)
 */
export const register = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Registration failed');
    }

    // Return result without saving - let RegisterPage handle it
    console.log('✅ Registration API call successful:', result.data?.user?.username);

    return {
      success: true,
      message: result.message || 'Registration successful',
      data: result.data
    };
  } catch (error) {
    console.warn('Backend unavailable, using fallback mode:', error.message);
    
    // FALLBACK MODE: Register locally (development only)
    const users = JSON.parse(localStorage.getItem('fallback_users') || '[]');
    
    // Check if email already exists
    if (users.find(u => u.email === data.email)) {
      throw new Error('Email already registered');
    }
    
    // Check if username already exists
    if (users.find(u => u.username === data.username)) {
      throw new Error('Username already taken');
    }
    
    // Create new user
    const newUser = {
      user_id: users.length + 1,
      username: data.username,
      email: data.email,
      full_name: data.full_name || '',
      phone: data.phone || '',
      email_verified: true, // Auto verify in fallback mode
      role: data.role, // Store as string for fallback
      roles: [data.role], // Also store as array for compatibility
      created_at: new Date().toISOString(),
    };
    
    // Generate fake token
    const token = 'fallback_token_' + Math.random().toString(36).substr(2, 9);
    
    // Save user to fallback storage
    users.push({ ...newUser, password: data.password }); // Store password for login
    localStorage.setItem('fallback_users', JSON.stringify(users));
    
    console.log('✅ Fallback registration successful:', newUser.username);
    
    // Return without saving auth - let RegisterPage handle it
    return {
      success: true,
      message: 'Registration successful (FALLBACK MODE - Backend not available)',
      data: {
        user: newUser,
        token: token
      }
    };
  }
};

/**
 * Login user
 * @param {Object} credentials
 * @param {string} credentials.email - Email address
 * @param {string} credentials.password - Password
 */
export const login = async (credentials) => {
  try {
    console.log('🔐 Attempting login for:', credentials.email);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const result = await response.json();
    
    console.log('📥 Login response:', {
      status: response.status,
      ok: response.ok,
      result: result
    });

    if (!response.ok) {
      console.error('❌ Login failed:', result.error || result.message);
      throw new Error(result.error || result.message || 'Login failed');
    }

    // Save token and user to localStorage using auth utility
    if (result.data?.token && result.data?.user) {
      saveAuth(result.data.token, result.data.user);
      console.log('✅ Login successful:', {
        username: result.data.user.username,
        role: result.data.user.role || result.data.user.roles?.[0],
        userId: result.data.user.user_id
      });
      
      // Return with success flag
      return {
        success: true,
        message: result.message || 'Login successful',
        data: result.data
      };
    } else {
      throw new Error('Invalid response format - missing token or user data');
    }

  } catch (error) {
    console.warn('⚠️ Backend unavailable or error, using fallback mode:', error.message);
    
    // FALLBACK MODE: Login locally (development only)
    const users = JSON.parse(localStorage.getItem('fallback_users') || '[]');
    
    // Find user by email
    const user = users.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Check password
    if (user.password !== credentials.password) {
      throw new Error('Invalid email or password');
    }
    
    // Generate fake token
    const token = 'fallback_token_' + Math.random().toString(36).substr(2, 9);
    
    // Remove password from user object
    const { password, ...userWithoutPassword } = user;
    
    // Save current session using auth utility
    saveAuth(token, userWithoutPassword);
    console.log('✅ Fallback login successful:', userWithoutPassword.username);
    
    return {
      success: true,
      message: 'Login successful (FALLBACK MODE - Backend not available)',
      data: {
        user: userWithoutPassword,
        token: token
      }
    };
  }
};

/**
 * Logout user
 */
export const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (token && !token.startsWith('fallback_token')) {
      // Only call backend if using real token
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('Logout API error:', error);
  } finally {
    // Always clear localStorage using auth utility
    clearAuth();
    
    console.log('✅ Logout successful');
  }
  
  return { success: true, message: 'Logout successful' };
};

/**
 * Verify email with token
 * @param {string} token - Verification token from email
 */
export const verifyEmail = async (token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/verify-email?token=${token}`,
      {
        method: 'GET',
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Email verification failed');
    }

    return result;
  } catch (error) {
    console.error('Email verification error:', error);
    throw error;
  }
};

/**
 * Request password reset
 * @param {string} email - Email address
 */
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Password reset request failed');
    }

    return result;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

/**
 * Reset password with token
 * @param {Object} data
 * @param {string} data.token - Reset token from email
 * @param {string} data.newPassword - New password
 */
export const resetPassword = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Password reset failed');
    }

    return result;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  try {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Check if user has specific role
 * @param {string} role - Role to check (seller/admin/buyer)
 */
export const hasRole = (role) => {
  const user = getCurrentUser();
  
  // Handle both array format (backend) and string format (fallback)
  if (Array.isArray(user?.roles)) {
    return user.roles.includes(role);
  }
  
  // If role is a string (fallback mode)
  if (typeof user?.role === 'string') {
    return user.role === role;
  }
  
  // Legacy check for roles array
  return false;
};

/**
 * Get authentication token
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

// Default export
export default {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  isAuthenticated,
  hasRole,
  getToken,
};
