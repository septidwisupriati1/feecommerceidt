/**
 * Admin Bank Account API Service
 * Handles admin bank account (escrow account) operations
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/ecommerce';

// Local storage for fallback mode
let fallbackAccounts = null;
let fallbackMode = false;

/**
 * Get authentication token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get all admin bank accounts
 * @param {Object} params - Query parameters
 * @param {string} params.account_type - Filter by type (bank, e_wallet)
 */
export const getAllAdminBankAccounts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.account_type) queryParams.append('account_type', params.account_type);

    const response = await fetch(
      `${API_BASE_URL}/admin/bank-account?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    fallbackMode = false;
    return result;
  } catch (error) {
    console.error('Error fetching admin bank accounts, using fallback mode:', error);
    fallbackMode = true;
    
    // Initialize fallback data if not exists
    if (!fallbackAccounts) {
      fallbackAccounts = getFallbackAccounts();
    }
    
    // Apply filters
    let filtered = [...fallbackAccounts];
    if (params.account_type) {
      filtered = filtered.filter(acc => acc.account_type === params.account_type);
    }
    
    return {
      success: true,
      message: 'Admin bank accounts retrieved successfully (fallback)',
      data: filtered,
      count: filtered.length
    };
  }
};

/**
 * Get active admin bank account
 */
export const getActiveAdminBankAccount = async () => {
  try {
    if (!fallbackMode) {
      const response = await fetch(
        `${API_BASE_URL}/admin/bank-account/active`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    }
  } catch (error) {
    console.error('Error fetching active account, using fallback mode:', error);
    fallbackMode = true;
  }
  
  // Fallback
  if (!fallbackAccounts) {
    fallbackAccounts = getFallbackAccounts();
  }
  
  const activeAccount = fallbackAccounts.find(acc => acc.is_active);
  if (activeAccount) {
    return {
      success: true,
      message: 'Active admin bank account retrieved successfully',
      data: activeAccount
    };
  }
  
  return {
    success: false,
    error: 'No active admin bank account found'
  };
};

/**
 * Get admin bank account by ID
 * @param {number} accountId - Account ID
 */
export const getAdminBankAccountById = async (accountId) => {
  try {
    if (!fallbackMode) {
      const response = await fetch(
        `${API_BASE_URL}/admin/bank-account/${accountId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    }
  } catch (error) {
    console.error('Error fetching account by ID, using fallback mode:', error);
    fallbackMode = true;
  }
  
  // Fallback
  if (!fallbackAccounts) {
    fallbackAccounts = getFallbackAccounts();
  }
  
  const account = fallbackAccounts.find(acc => acc.account_id === accountId);
  if (account) {
    return {
      success: true,
      message: 'Admin bank account retrieved successfully',
      data: account
    };
  }
  
  return {
    success: false,
    error: 'Admin bank account not found'
  };
};

/**
 * Create new admin bank account
 * @param {Object} data - Account data
 * @param {string} data.bank_name - Bank or e-wallet name
 * @param {string} data.account_number - Account number
 * @param {string} data.account_name - Account holder name
 * @param {string} data.account_type - 'bank' or 'e_wallet'
 * @param {boolean} data.is_active - Set as active account
 * @param {string} data.notes - Internal notes
 */
export const createAdminBankAccount = async (data) => {
  try {
    if (!fallbackMode) {
      const response = await fetch(
        `${API_BASE_URL}/admin/bank-account`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    }
  } catch (error) {
    console.error('Error creating account, using fallback mode:', error);
    fallbackMode = true;
  }
  
  // Fallback
  if (!fallbackAccounts) {
    fallbackAccounts = getFallbackAccounts();
  }
  
  // Check if this is first account
  const isFirstAccount = fallbackAccounts.length === 0;
  
  // If is_active is true, deactivate all others
  if (data.is_active || isFirstAccount) {
    fallbackAccounts = fallbackAccounts.map(acc => ({ ...acc, is_active: false }));
  }
  
  const newAccount = {
    account_id: Date.now(),
    bank_name: data.bank_name,
    account_number: data.account_number,
    account_name: data.account_name,
    account_type: data.account_type || 'bank',
    is_active: data.is_active || isFirstAccount,
    notes: data.notes || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  fallbackAccounts.push(newAccount);
  
  return {
    success: true,
    message: 'Admin bank account created successfully',
    data: newAccount
  };
};

/**
 * Update admin bank account
 * @param {number} accountId - Account ID
 * @param {Object} data - Updated data
 */
export const updateAdminBankAccount = async (accountId, data) => {
  try {
    if (!fallbackMode) {
      const response = await fetch(
        `${API_BASE_URL}/admin/bank-account/${accountId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    }
  } catch (error) {
    console.error('Error updating account, using fallback mode:', error);
    fallbackMode = true;
  }
  
  // Fallback
  if (!fallbackAccounts) {
    fallbackAccounts = getFallbackAccounts();
  }
  
  const index = fallbackAccounts.findIndex(acc => acc.account_id === accountId);
  if (index !== -1) {
    fallbackAccounts[index] = {
      ...fallbackAccounts[index],
      ...data,
      updated_at: new Date().toISOString()
    };
    
    return {
      success: true,
      message: 'Admin bank account updated successfully',
      data: fallbackAccounts[index]
    };
  }
  
  return {
    success: false,
    error: 'Admin bank account not found'
  };
};

/**
 * Set admin bank account as active
 * @param {number} accountId - Account ID
 */
export const setAdminBankAccountActive = async (accountId) => {
  try {
    if (!fallbackMode) {
      const response = await fetch(
        `${API_BASE_URL}/admin/bank-account/${accountId}/set-active`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    }
  } catch (error) {
    console.error('Error setting active account, using fallback mode:', error);
    fallbackMode = true;
  }
  
  // Fallback
  if (!fallbackAccounts) {
    fallbackAccounts = getFallbackAccounts();
  }
  
  // Deactivate all accounts
  fallbackAccounts = fallbackAccounts.map(acc => ({ ...acc, is_active: false }));
  
  // Activate selected account
  const index = fallbackAccounts.findIndex(acc => acc.account_id === accountId);
  if (index !== -1) {
    fallbackAccounts[index].is_active = true;
    fallbackAccounts[index].updated_at = new Date().toISOString();
    
    return {
      success: true,
      message: 'Admin bank account set as active successfully',
      data: fallbackAccounts[index]
    };
  }
  
  return {
    success: false,
    error: 'Admin bank account not found'
  };
};

/**
 * Delete admin bank account
 * @param {number} accountId - Account ID
 */
export const deleteAdminBankAccount = async (accountId) => {
  try {
    if (!fallbackMode) {
      const response = await fetch(
        `${API_BASE_URL}/admin/bank-account/${accountId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    }
  } catch (error) {
    console.error('Error deleting account, using fallback mode:', error);
    fallbackMode = true;
  }
  
  // Fallback
  if (!fallbackAccounts) {
    fallbackAccounts = getFallbackAccounts();
  }
  
  // Cannot delete if last account
  if (fallbackAccounts.length === 1) {
    return {
      success: false,
      error: 'Cannot delete the last admin bank account. At least one account must exist.'
    };
  }
  
  const index = fallbackAccounts.findIndex(acc => acc.account_id === accountId);
  if (index !== -1) {
    const wasActive = fallbackAccounts[index].is_active;
    fallbackAccounts.splice(index, 1);
    
    // If deleted account was active, set oldest as active
    if (wasActive && fallbackAccounts.length > 0) {
      fallbackAccounts[0].is_active = true;
    }
    
    return {
      success: true,
      message: 'Admin bank account deleted successfully'
    };
  }
  
  return {
    success: false,
    error: 'Admin bank account not found'
  };
};

/**
 * Fallback data when API is unavailable
 */
export const getFallbackAccounts = () => {
  return [
    {
      account_id: 1,
      bank_name: 'BCA',
      account_number: '1234567890',
      account_name: 'PT E-Commerce Indonesia',
      account_type: 'bank',
      is_active: true,
      notes: 'Rekening utama untuk penerimaan pembayaran',
      created_at: '2025-11-10T02:10:00.000Z',
      updated_at: '2025-11-10T02:10:00.000Z'
    },
    {
      account_id: 2,
      bank_name: 'Mandiri',
      account_number: '9876543210',
      account_name: 'PT E-Commerce Indonesia',
      account_type: 'bank',
      is_active: false,
      notes: 'Rekening backup',
      created_at: '2025-11-10T02:10:00.000Z',
      updated_at: '2025-11-10T02:10:00.000Z'
    },
    {
      account_id: 3,
      bank_name: 'GoPay',
      account_number: '081234567890',
      account_name: 'PT E-Commerce Indonesia',
      account_type: 'e_wallet',
      is_active: false,
      notes: 'E-wallet untuk pembayaran digital',
      created_at: '2025-11-11T02:10:00.000Z',
      updated_at: '2025-11-11T02:10:00.000Z'
    }
  ];
};

/**
 * Helper: Format date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Helper: Get account type label
 */
export const getAccountTypeLabel = (type) => {
  const labels = {
    bank: 'Bank Transfer',
    e_wallet: 'E-Wallet'
  };
  return labels[type] || type;
};

/**
 * Helper: Get account type color
 */
export const getAccountTypeColor = (type) => {
  const colors = {
    bank: 'bg-blue-100 text-blue-800',
    e_wallet: 'bg-purple-100 text-purple-800'
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
};
