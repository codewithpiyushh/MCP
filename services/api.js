// API configuration and service layer for MongoDB backend with Descope integration
const API_BASE_URL = 'http://localhost:3000/api';

class APIService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
    this.descopeSession = null; // Store Descope session
  }

  // Set authentication token (MongoDB JWT)
  setToken(token) {
    this.token = token;
  }

  // Set Descope session
  setDescopeSession(session) {
    this.descopeSession = session;
  }

  // Get authentication token
  getToken() {
    return this.token;
  }

  // Get Descope session token
  getDescopeSessionToken() {
    return this.descopeSession?.sessionJwt || null;
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    this.descopeSession = null;
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        // Prioritize Descope session token for protected routes
        ...(this.descopeSession?.sessionJwt && { 'Authorization': `Bearer ${this.descopeSession.sessionJwt}` }),
        // Fallback to MongoDB JWT if no Descope session
        ...(this.token && !this.descopeSession?.sessionJwt && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } finally {
      this.clearToken();
    }
  }

  async getProfile() {
    return await this.request('/auth/me');
  }

  async updateProfile(updates) {
    return await this.request('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Admin methods
  async getAllUsers() {
    return await this.request('/auth/users');
  }

  // Health check
  async healthCheck() {
    return await this.request('/health');
  }

  // Descope-specific methods
  async getProtectedProfile() {
    return await this.request('/protected/profile');
  }

  async getProtectedData() {
    return await this.request('/protected/data');
  }

  // Example method for making authenticated requests with Descope session
  async exampleProtectedFetch() {
    if (!this.descopeSession?.sessionJwt) {
      throw new Error('No Descope session available');
    }

    const response = await fetch(`${this.baseURL}/protected/data`, {
      headers: {
        Authorization: `Bearer ${this.descopeSession.sessionJwt}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}

export default new APIService();
