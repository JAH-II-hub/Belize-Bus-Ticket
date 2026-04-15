// Belize Bus Ticket System - API Client
// Handles all API communication with the backend

const API_BASE_URL = 'http://localhost:3000/api/v1';

// API Client Configuration
const apiConfig = {
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
};

// Get auth token from localStorage
function getAuthToken() {
    return localStorage.getItem('accessToken');
}

// Get refresh token from localStorage
function getRefreshToken() {
    return localStorage.getItem('refreshToken');
}

// Set auth tokens in localStorage
function setAuthTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken || '');
}

// Remove auth tokens from localStorage
function clearAuthTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
}

// Build authorization header
function getAuthHeader() {
    const token = getAuthToken();
    if (token) {
        return { 'Authorization': `Bearer ${token}` };
    }
    return {};
}

// Main API request function
async function apiRequest(endpoint, options = {}) {
    const url = `${apiConfig.baseURL}${endpoint}`;
    const config = {
        ...options,
        headers: {
            ...apiConfig.headers,
            ...getAuthHeader(),
            ...options.headers
        }
    };

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);
        
        const response = await fetch(url, {
            ...config,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        // Handle token expiration
        if (response.status === 401) {
            const errorData = await response.json().catch(() => ({}));
            if (errorData.error?.code === 'AUTH_TOKEN_EXPIRED' || 
                errorData.error?.code === 'AUTH_TOKEN_INVALID') {
                // Try to refresh token
                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    // Retry original request
                    config.headers.Authorization = `Bearer ${getAuthToken()}`;
                    const retryResponse = await fetch(url, config);
                    return await processResponse(retryResponse);
                }
            }
            // Clear auth and redirect to login
            clearAuthTokens();
            window.location.href = '/frontend/pages/login.html?expired=1';
            throw new Error('Session expired');
        }

        return await processResponse(response);
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        throw error;
    }
}

// Process API response
async function processResponse(response) {
    const data = await response.json().catch(() => null);
    
    if (!response.ok) {
        throw new ApiError(
            data?.error?.code || 'API_ERROR',
            data?.error?.message || response.statusText,
            data?.error?.details
        );
    }
    
    return data;
}

// Custom API Error class
class ApiError extends Error {
    constructor(code, message, details = null) {
        super(message);
        this.code = code;
        this.details = details;
        this.name = 'ApiError';
    }
}

// Refresh access token
async function refreshAccessToken() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        return false;
    }

    try {
        const response = await fetch(`${apiConfig.baseURL}/auth/refresh`, {
            method: 'POST',
            headers: apiConfig.headers,
            body: JSON.stringify({ refreshToken })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.data) {
                setAuthTokens(data.data.accessToken, data.data.refreshToken);
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('Token refresh failed:', error);
        return false;
    }
}

// Authentication API calls
const authAPI = {
    async register(userData) {
        return await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    async login(email, password) {
        return await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    async logout() {
        try {
            await apiRequest('/auth/logout', { method: 'POST' });
        } finally {
            clearAuthTokens();
        }
    },

    async forgotPassword(email) {
        return await apiRequest('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    },

    async resetPassword(token, newPassword) {
        return await apiRequest('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, password: newPassword })
        });
    },

    async changePassword(currentPassword, newPassword) {
        return await apiRequest('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword })
        });
    },

    async getCurrentUser() {
        return await apiRequest('/auth/me');
    }
};

// Customer API calls
const customerAPI = {
    async getProfile(customerId) {
        return await apiRequest(`/customers/${customerId}`);
    },

    async updateProfile(customerId, userData) {
        return await apiRequest(`/customers/${customerId}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    async getBookings(customerId, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/customers/${customerId}/bookings${queryString ? '?' + queryString : ''}`);
    },

    async getTickets(customerId, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/customers/${customerId}/tickets${queryString ? '?' + queryString : ''}`);
    }
};

// Bus API calls
const busAPI = {
    async getAllBuses(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/buses${queryString ? '?' + queryString : ''}`);
    },

    async getAvailableBuses(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/buses/available${queryString ? '?' + queryString : ''}`);
    },

    async getBusById(busId) {
        return await apiRequest(`/buses/${busId}`);
    },

    async getBusStops(busId) {
        return await apiRequest(`/buses/${busId}/stops`);
    }
};

// Location API calls
const locationAPI = {
    async getAllLocations(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/locations${queryString ? '?' + queryString : ''}`);
    },

    async getLocationById(locationId) {
        return await apiRequest(`/locations/${locationId}`);
    },

    async getLocationsByType(type) {
        return await apiRequest(`/locations/type/${type}`);
    },

    async getLocationsByCity(city) {
        return await apiRequest(`/locations/city/${city}`);
    }
};

// Ticket API calls
const ticketAPI = {
    async getAllTickets(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/tickets${queryString ? '?' + queryString : ''}`);
    },

    async getTicketById(ticketId) {
        return await apiRequest(`/tickets/${ticketId}`);
    },

    async getTicketByReference(reference) {
        return await apiRequest(`/tickets/ref/${reference}`);
    },

    async bookTicket(ticketData) {
        return await apiRequest('/tickets', {
            method: 'POST',
            body: JSON.stringify(ticketData)
        });
    },

    async confirmTicket(ticketId) {
        return await apiRequest(`/tickets/${ticketId}/confirm`, {
            method: 'POST'
        });
    },

    async cancelTicket(ticketId) {
        return await apiRequest(`/tickets/${ticketId}/cancel`, {
            method: 'POST'
        });
    },

    async updateTicket(ticketId, ticketData) {
        return await apiRequest(`/tickets/${ticketId}`, {
            method: 'PUT',
            body: JSON.stringify(ticketData)
        });
    }
};

// Admin API calls
const adminAPI = {
    async getAllUsers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/admins${queryString ? '?' + queryString : ''}`);
    },

    async getUserById(userId) {
        return await apiRequest(`/admins/${userId}`);
    },

    async createUser(userData) {
        return await apiRequest('/admins', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    async updateUser(userId, userData) {
        return await apiRequest(`/admins/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    async getAllCustomers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/customers${queryString ? '?' + queryString : ''}`);
    },

    async getAllTellers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/tellers${queryString ? '?' + queryString : ''}`);
    },

    async authorizeTeller(tellerId) {
        return await apiRequest(`/tellers/${tellerId}/authorize`, {
            method: 'PUT'
        });
    },

    async revokeTeller(tellerId) {
        return await apiRequest(`/tellers/${tellerId}/revoke`, {
            method: 'PUT'
        });
    }
};

// Teller API calls
const tellerAPI = {
    async getProfile(tellerId) {
        return await apiRequest(`/tellers/${tellerId}`);
    },

    async updateProfile(tellerId, userData) {
        return await apiRequest(`/tellers/${tellerId}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    async getSalesHistory(tellerId, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/tellers/${tellerId}/sales${queryString ? '?' + queryString : ''}`);
    },

    async sellTicket(ticketData) {
        return await apiRequest('/tickets', {
            method: 'POST',
            body: JSON.stringify(ticketData)
        });
    }
};

// Report API calls
const reportAPI = {
    async getDailyRevenue(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/reports/revenue/daily${queryString ? '?' + queryString : ''}`);
    },

    async getMonthlyRevenue(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/reports/revenue/monthly${queryString ? '?' + queryString : ''}`);
    },

    async getBusUtilization(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/reports/bus-utilization${queryString ? '?' + queryString : ''}`);
    },

    async getPopularDestinations(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/reports/popular-destinations${queryString ? '?' + queryString : ''}`);
    },

    async getTellerPerformance(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/reports/teller-performance${queryString ? '?' + queryString : ''}`);
    },

    async getSalesSummary(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/reports/sales-summary${queryString ? '?' + queryString : ''}`);
    }
};

// Export all API modules
window.API = {
    config: apiConfig,
    ApiError,
    auth: authAPI,
    customer: customerAPI,
    bus: busAPI,
    location: locationAPI,
    ticket: ticketAPI,
    admin: adminAPI,
    teller: tellerAPI,
    report: reportAPI
};