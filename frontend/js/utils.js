// Belize Bus Ticket System - Utility Functions
// Helper functions for formatting, validation, and common operations

// ===== Date/Time Utilities =====

/**
 * Format date to locale string
 * @param {string|Date} dateString - Date string or Date object
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
function formatDate(dateString, options = {}) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    
    return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
}

/**
 * Format time to locale string
 * @param {string} timeString - Time string (HH:MM:SS format)
 * @returns {string} Formatted time string
 */
function formatTime(timeString) {
    if (!timeString) return '';
    
    // Handle time string in HH:MM:SS format
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

/**
 * Get relative time description
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Relative time description
 */
function getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Check if date is in the past
 * @param {string|Date} dateString - Date string or Date object
 * @returns {boolean} True if date is in the past
 */
function isPastDate(dateString) {
    return new Date(dateString) < new Date();
}

/**
 * Check if date is today
 * @param {string|Date} dateString - Date string or Date object
 * @returns {boolean} True if date is today
 */
function isToday(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

/**
 * Get minimum date for booking (tomorrow)
 * @returns {string} Minimum date in YYYY-MM-DD format
 */
function getMinBookingDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
}

// ===== Currency/Number Utilities =====

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount);
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @returns {number} Percentage value
 */
function calculatePercentage(value, total) {
    if (total === 0) return 0;
    return ((value / total) * 100).toFixed(2);
}

// ===== String Utilities =====

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalizeWords(str) {
    if (!str) return '';
    return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Truncate string to specified length
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated string
 */
function truncateString(str, maxLength, suffix = '...') {
    if (!str || str.length <= maxLength) return str;
    return str.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Generate initials from name
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {string} Initials
 */
function generateInitials(firstName, lastName) {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number format (Belize format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone number
 */
function isValidPhone(phone) {
    // Belize phone format: +501-XXX-XXXX or XXX-XXXX
    const phoneRegex = /^(\+501-)?\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with strength level
 */
function validatePassword(password) {
    const result = {
        valid: false,
        strength: 'weak',
        requirements: []
    };

    if (password.length < 8) {
        result.requirements.push('At least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
        result.requirements.push('At least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        result.requirements.push('At least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        result.requirements.push('At least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        result.requirements.push('At least one special character');
    }

    if (result.requirements.length === 0) {
        result.valid = true;
        result.strength = 'strong';
    } else if (result.requirements.length <= 2) {
        result.strength = 'medium';
    }

    return result;
}

// ===== DOM Utilities =====

/**
 * Show loading state on element
 * @param {HTMLElement} element - Element to show loading state
 * @param {string} loadingText - Loading text to display
 */
function showLoading(element, loadingText = 'Loading...') {
    if (!element) return;
    element.dataset.originalContent = element.innerHTML;
    element.innerHTML = `<span class="loading-spinner"></span> ${loadingText}`;
    element.disabled = true;
}

/**
 * Hide loading state on element
 * @param {HTMLElement} element - Element to hide loading state
 */
function hideLoading(element) {
    if (!element) return;
    element.innerHTML = element.dataset.originalContent || '';
    element.disabled = false;
}

/**
 * Create loading spinner HTML
 * @returns {string} Loading spinner HTML
 */
function createLoadingSpinner() {
    return '<div class="loading-spinner"></div>';
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Notification type (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${getToastIcon(type)}</span>
        <span class="toast-message">${escapeHtml(message)}</span>
        <button class="toast-close">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after duration
    setTimeout(() => {
        toast.remove();
    }, duration);
    
    // Close button handler
    toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
}

/**
 * Create toast container if it doesn't exist
 * @returns {HTMLElement} Toast container
 */
function createToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

/**
 * Get icon for toast type
 * @param {string} type - Toast type
 * @returns {string} Icon character
 */
function getToastIcon(type) {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[type] || icons.info;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Clear form fields
 * @param {HTMLFormElement} form - Form to clear
 */
function clearForm(form) {
    if (!form) return;
    form.reset();
    // Clear any validation messages
    form.querySelectorAll('.error-message').forEach(el => el.remove());
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
}

/**
 * Set form field values
 * @param {HTMLFormElement} form - Form to populate
 * @param {object} data - Data object with field values
 */
function setFormValues(form, data) {
    if (!form || !data) return;
    
    Object.keys(data).forEach(key => {
        const field = form.querySelector(`[name="${key}"]`);
        if (field) {
            field.value = data[key];
        }
    });
}

/**
 * Get form field values as object
 * @param {HTMLFormElement} form - Form to extract values from
 * @returns {object} Form data object
 */
function getFormValues(form) {
    if (!form) return {};
    
    const formData = new FormData(form);
    const data = {};
    
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    return data;
}

// ===== Status/State Utilities =====

/**
 * Get status badge class
 * @param {string} status - Status value
 * @returns {string} CSS class for status badge
 */
function getStatusClass(status) {
    const statusClasses = {
        // Ticket statuses
        'Available': 'status-available',
        'Booked': 'status-booked',
        'Confirmed': 'status-confirmed',
        'Cancelled': 'status-cancelled',
        'Expired': 'status-expired',
        // User statuses
        'Active': 'status-active',
        'Inactive': 'status-inactive',
        // General
        'Pending': 'status-pending',
        'Completed': 'status-completed',
        'Success': 'status-success',
        'Error': 'status-error'
    };
    return statusClasses[status] || 'status-default';
}

/**
 * Get status label
 * @param {string} status - Status value
 * @returns {string} Human-readable status label
 */
function getStatusLabel(status) {
    return capitalizeWords(status.toLowerCase());
}

/**
 * Create status badge HTML
 * @param {string} status - Status value
 * @returns {string} Status badge HTML
 */
function createStatusBadge(status) {
    const className = getStatusClass(status);
    const label = getStatusLabel(status);
    return `<span class="status-badge ${className}">${label}</span>`;
}

// ===== Storage Utilities =====

/**
 * Safely get item from localStorage
 * @param {string} key - Storage key
 * @returns {*} Parsed value or null
 */
function getStorageItem(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Failed to parse storage item:', e);
        return null;
    }
}

/**
 * Safely set item in localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
function setStorageItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('Failed to set storage item:', e);
        return false;
    }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
function removeStorageItem(key) {
    localStorage.removeItem(key);
}

/**
 * Clear all items with specific prefix
 * @param {string} prefix - Key prefix to match
 */
function clearStorageByPrefix(prefix) {
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith(prefix)) {
            localStorage.removeItem(key);
        }
    });
}

// ===== URL/Query Utilities =====

/**
 * Get query parameter from URL
 * @param {string} param - Parameter name
 * @param {string} url - URL to parse (defaults to current URL)
 * @returns {string|null} Parameter value or null
 */
function getQueryParam(param, url = window.location.href) {
    const urlObj = new URL(url);
    return urlObj.searchParams.get(param);
}

/**
 * Get all query parameters from URL
 * @param {string} url - URL to parse (defaults to current URL)
 * @returns {object} Query parameters object
 */
function getAllQueryParams(url = window.location.href) {
    const urlObj = new URL(url);
    return Object.fromEntries(urlObj.searchParams.entries());
}

/**
 * Add query parameters to URL
 * @param {string} url - Base URL
 * @param {object} params - Parameters to add
 * @returns {string} URL with parameters
 */
function addQueryParams(url, params) {
    const urlObj = new URL(url, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            urlObj.searchParams.set(key, value);
        }
    });
    return urlObj.toString();
}

/**
 * Navigate to URL with query parameters
 * @param {string} url - Target URL
 * @param {object} params - Parameters to add
 */
function navigateWithParams(url, params) {
    const fullUrl = addQueryParams(url, params);
    window.location.href = fullUrl;
}

// Export utilities
window.Utils = {
    // Date/Time
    formatDate,
    formatTime,
    getRelativeTime,
    isPastDate,
    isToday,
    getMinBookingDate,
    // Currency/Number
    formatCurrency,
    formatNumber,
    calculatePercentage,
    // String
    capitalizeWords,
    truncateString,
    generateInitials,
    isValidEmail,
    isValidPhone,
    validatePassword,
    // DOM
    showLoading,
    hideLoading,
    createLoadingSpinner,
    showToast,
    escapeHtml,
    clearForm,
    setFormValues,
    getFormValues,
    // Status
    getStatusClass,
    getStatusLabel,
    createStatusBadge,
    // Storage
    getStorageItem,
    setStorageItem,
    removeStorageItem,
    clearStorageByPrefix,
    // URL
    getQueryParam,
    getAllQueryParams,
    addQueryParams,
    navigateWithParams
};