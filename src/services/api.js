/* global process */

// Change from localhost to your backend URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.onrender.com/api'  // Production
  : 'http://localhost:5000/api';  // Development

// Helper function for API calls
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
    // Handle 429 Too Many Requests
    if (response.status === 429) {
      throw new Error('Too many login attempts. Please wait a moment and try again.');
    }
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || 'Server error');
    }
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// User APIs
export const userAPI = {
  getProfile: () => apiRequest('/users/profile'),
  updateProfile: (userData) => apiRequest('/users/profile', { method: 'PUT', body: userData }),
  updateRole: (role) => apiRequest('/users/update-role', { method: 'PUT', body: { role } }),
};

// Auth APIs
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', { method: 'POST', body: userData }),
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: credentials }),
  getMe: () => apiRequest('/auth/me'),
};

// Group APIs
export const groupAPI = {
  joinGroup: (code) => apiRequest('/groups/join', { method: 'POST', body: { code } }),
  getMyGroup: () => apiRequest('/groups/my-group'),
  getGroupByCode: (code) => apiRequest(`/groups/code/${code}`),
};

// Expense APIs
export const expenseAPI = {
  createExpense: (expenseData) => apiRequest('/expenses', { method: 'POST', body: expenseData }),
  getExpenses: () => apiRequest('/expenses'),
 updatePaymentStatus: (expenseId, paymentProof) => 
  apiRequest(`/expenses/${expenseId}/pay`, { 
    method: 'PUT', 
    body: { paymentProof } 
  }),
};

export default apiRequest;