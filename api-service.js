// API Service - Backend Integration

const API_BASE_URL = 'https://cosmetic-server-production.up.railway.app/api';

// CORS Proxy for development - DISABLED (not working with credentials)
const USE_PROXY = false;
const PROXY_URL = 'https://corsproxy.io/?';

function getApiUrl(endpoint) {
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  // Proxy disabled
  return fullUrl;
}

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
    mode: 'cors', // Enable CORS
    // credentials removed - causes issues with CORS proxy
  };

  if (body && (method === 'POST' || method === 'PUT')) {
    config.body = JSON.stringify(body);
  }

  try {
    const apiUrl = getApiUrl(endpoint);
    console.log(`🚀 API Call: ${method} ${apiUrl}`);
    console.log('📦 Body:', body);

    const response = await fetch(apiUrl, config);
    
    console.log('📡 Response status:', response.status);

    // Check if response is ok
    if (!response.ok) {
      let errorMessage = 'API request failed';
      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('✅ Response data:', data);
    return data;
    
  } catch (error) {
    console.error('❌ API Error:', error);
    
    // Check if it's a network error
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error('Server bilan bog\'lanishda xatolik! Internetni tekshiring yoki keyinroq urinib ko\'ring.');
    }
    
    throw error;
  }
}

// Get auth token from storage
function getAuthToken() {
  try {
    const user = JSON.parse(localStorage.getItem('myshop_current_user_v1'));
    return user?.token || null;
  } catch (e) {
    return null;
  }
}

// Save auth token
function saveAuthToken(token, user) {
  localStorage.setItem('myshop_current_user_v1', JSON.stringify({ ...user, token }));
}

// ==================== AUTH API ====================

const AuthAPI = {
  // Register new user
  async register(userData) {
    try {
      console.log('📝 Registering user:', userData.email);
      
      const response = await apiCall('/auth/register', 'POST', {
        name: userData.name,
        email: userData.email,
        password: userData.password
      });

      console.log('✅ Register response:', response);

      // Handle different response formats
      if (response.token || response.data?.token) {
        const token = response.token || response.data.token;
        const user = response.user || response.data?.user || response.data;
        
        saveAuthToken(token, user);
        
        return { 
          success: true, 
          data: { token, user } 
        };
      }

      // If no token but successful response
      if (response.message || response.success) {
        return { 
          success: true, 
          data: response 
        };
      }

      return { success: true, data: response };
      
    } catch (error) {
      console.error('❌ Register error:', error);
      return { 
        success: false, 
        message: error.message || 'Registration failed' 
      };
    }
  },

  // Login user
  async login(email, password) {
    try {
      console.log('🔐 Logging in:', email);
      
      const response = await apiCall('/auth/login', 'POST', { 
        email, 
        password 
      });

      console.log('✅ Login response:', response);
      
      // Handle different response formats
      if (response.token || response.data?.token) {
        const token = response.token || response.data.token;
        const user = response.user || response.data?.user || response.data;
        
        saveAuthToken(token, user);
        
        return { 
          success: true, 
          data: { token, user } 
        };
      }

      return { success: true, data: response };
      
    } catch (error) {
      console.error('❌ Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Login failed' 
      };
    }
  }
};

// ==================== PRODUCTS API ====================

const ProductsAPI = {
  // Get all products
  async getAll() {
    try {
      const response = await apiCall('/products', 'GET');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Get product by ID
  async getById(id) {
    try {
      const response = await apiCall(`/products/${id}`, 'GET');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Create product (admin only)
  async create(productData) {
    try {
      const token = getAuthToken();
      const response = await apiCall('/products', 'POST', productData, token);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Update product (admin only)
  async update(id, productData) {
    try {
      const token = getAuthToken();
      const response = await apiCall(`/products/${id}`, 'PUT', productData, token);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Delete product (admin only)
  async delete(id) {
    try {
      const token = getAuthToken();
      const response = await apiCall(`/products/${id}`, 'DELETE', null, token);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
};

// ==================== CART API ====================

const CartAPI = {
  // Get user's cart
  async get(userId) {
    try {
      const token = getAuthToken();
      const response = await apiCall(`/cart/${userId}`, 'GET', null, token);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Add item to cart
  async addItem(userId, productId, quantity = 1) {
    try {
      const token = getAuthToken();
      const response = await apiCall('/cart/add', 'POST', {
        userId,
        productId,
        quantity
      }, token);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Update cart item quantity
  async updateQuantity(cartItemId, quantity) {
    try {
      const token = getAuthToken();
      const response = await apiCall(`/cart/${cartItemId}?quantity=${quantity}`, 'PUT', null, token);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Remove item from cart
  async removeItem(cartItemId) {
    try {
      const token = getAuthToken();
      const response = await apiCall(`/cart/${cartItemId}`, 'DELETE', null, token);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Sync local cart to server
  async syncLocalCart(userId) {
    try {
      const localCart = JSON.parse(localStorage.getItem('myshop_cart_v1')) || [];
      
      for (const item of localCart) {
        // Assuming you have product IDs in local cart
        await this.addItem(userId, item.productId || item.id, item.qty);
      }

      // Clear local cart after sync
      localStorage.removeItem('myshop_cart_v1');
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
};

// ==================== ORDERS API ====================

const OrdersAPI = {
  // Create new order
  async create(userId, address, totalAmount) {
    try {
      const token = getAuthToken();
      const response = await apiCall('/orders/create', 'POST', {
        userId,
        address,
        totalAmount
      }, token);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Get single order
  async getById(orderId) {
    try {
      const token = getAuthToken();
      const response = await apiCall(`/orders/${orderId}`, 'GET', null, token);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Update order status
  async updateStatus(orderId, status) {
    try {
      const token = getAuthToken();
      const response = await apiCall(`/orders/${orderId}/status`, 'PUT', status, token);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Delete order
  async delete(orderId) {
    try {
      const token = getAuthToken();
      const response = await apiCall(`/orders/${orderId}`, 'DELETE', null, token);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
};

// ==================== HELPER FUNCTIONS ====================

// Get current user ID
function getCurrentUserId() {
  try {
    const user = JSON.parse(localStorage.getItem('myshop_current_user_v1'));
    return user?.id || user?.user?.id || null;
  } catch (e) {
    return null;
  }
}

// Show loading
function showLoading(message = 'Yuklanmoqda...') {
  if (window.loadingSystem) {
    window.loadingSystem.showLoading(message);
  }
}

// Hide loading
function hideLoading() {
  if (window.loadingSystem) {
    window.loadingSystem.hideLoading();
  }
}

// Show notification
function showNotification(message, type = 'success') {
  if (window.loadingSystem) {
    window.loadingSystem.showToast(message, type);
  } else {
    alert(message);
  }
}

// ==================== EXPORT ====================

window.API = {
  Auth: AuthAPI,
  Products: ProductsAPI,
  Cart: CartAPI,
  Orders: OrdersAPI,
  getCurrentUserId,
  getAuthToken
};

console.log('✅ API Service initialized');
console.log('API Base URL:', API_BASE_URL);