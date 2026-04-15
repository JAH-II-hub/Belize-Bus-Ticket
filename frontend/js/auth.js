// Belize Bus Ticket System - Authentication Module
// Handles login, logout, session management, and role-based redirects

const AUTH_STORAGE_KEY = 'currentUser';
const TOKEN_STORAGE_KEY = 'accessToken';
const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';

// User roles from backend
const USER_ROLES = {
    ADMIN: 'Admin',
    CUSTOMER: 'Customer',
    TELLER: 'Teller'
};

// Role to dashboard mapping
const ROLE_DASHBOARDS = {
    [USER_ROLES.ADMIN]: '/frontend/pages/admin/users.html',
    [USER_ROLES.CUSTOMER]: '/frontend/pages/dashboard.html',
    [USER_ROLES.TELLER]: '/frontend/pages/teller/dashboard.html'
};

// Get current user from localStorage
function getCurrentUser() {
    const userData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (userData) {
        try {
            return JSON.parse(userData);
        } catch (e) {
            console.error('Failed to parse current user:', e);
            return null;
        }
    }
    return null;
}

// Set current user in localStorage
function setCurrentUser(user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

// Get access token
function getAccessToken() {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
}

// Get refresh token
function getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

// Set auth tokens
function setAuthTokens(accessToken, refreshToken) {
    localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken || '');
}

// Clear all auth data
function clearAuthData() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

// Check if user is authenticated
function isAuthenticated() {
    return !!getAccessToken();
}

// Get user role
function getUserRole() {
    const user = getCurrentUser();
    return user ? user.userType : null;
}

// Check if user has specific role
function hasRole(role) {
    const userRole = getUserRole();
    return userRole === role;
}

// Check if user is admin
function isAdmin() {
    return hasRole(USER_ROLES.ADMIN);
}

// Check if user is customer
function isCustomer() {
    return hasRole(USER_ROLES.CUSTOMER);
}

// Check if user is teller
function isTeller() {
    return hasRole(USER_ROLES.TELLER);
}

// Handle login success
async function handleLoginSuccess(response, redirect = true) {
    if (response.success && response.data) {
        const { accessToken, refreshToken, user } = response.data;
        
        // Store tokens
        setAuthTokens(accessToken, refreshToken);
        
        // Store user info
        setCurrentUser({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userType: user.userType
        });

        // Redirect based on role
        if (redirect) {
            const dashboardUrl = ROLE_DASHBOARDS[user.userType] || '/frontend/pages/dashboard.html';
            window.location.href = dashboardUrl;
        }
        
        return true;
    }
    return false;
}

// Handle logout
async function handleLogout() {
    try {
        // Call logout API to invalidate tokens
        await API.auth.logout();
    } catch (error) {
        console.error('Logout API call failed:', error);
    } finally {
        // Always clear local auth data
        clearAuthData();
        // Redirect to home page
        window.location.href = '/frontend/index.html';
    }
}

// Initialize auth state on page load
function initAuth() {
    const user = getCurrentUser();
    const token = getAccessToken();
    
    if (user && token) {
        // User is logged in
        updateUIForLoggedInUser(user);
        return true;
    }
    return false;
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    // Update user name display
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(el => {
        el.textContent = `${user.firstName} ${user.lastName}`;
    });

    // Update email display
    const userEmailElements = document.querySelectorAll('.user-email');
    userEmailElements.forEach(el => {
        el.textContent = user.email;
    });

    // Show/hide elements based on role
    updateUIForRole(user.userType);
}

// Update UI based on user role
function updateUIForRole(role) {
    // Hide all role-specific elements first
    document.querySelectorAll('[data-role]').forEach(el => {
        el.style.display = 'none';
    });

    // Show elements for current role
    document.querySelectorAll(`[data-role="${role}"]`).forEach(el => {
        el.style.display = '';
    });

    // Update navigation based on role
    updateNavigationForRole(role);
}

// Update navigation based on role
function updateNavigationForRole(role) {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    // Remove existing role-based nav items
    navMenu.querySelectorAll('[data-role-nav]').forEach(el => el.remove());

    // Add role-specific nav items
    let roleNavItems = '';
    
    switch (role) {
        case USER_ROLES.ADMIN:
            roleNavItems = `
                <li><a href="/frontend/pages/admin/users.html" data-role-nav>Users</a></li>
                <li><a href="/frontend/pages/admin/buses.html" data-role-nav>Buses</a></li>
                <li><a href="/frontend/pages/admin/reports.html" data-role-nav>Reports</a></li>
            `;
            break;
        case USER_ROLES.CUSTOMER:
            roleNavItems = `
                <li><a href="/frontend/pages/dashboard.html" data-role-nav>Dashboard</a></li>
                <li><a href="/frontend/pages/tickets.html" data-role-nav>My Tickets</a></li>
                <li><a href="/frontend/pages/profile.html" data-role-nav>Profile</a></li>
            `;
            break;
        case USER_ROLES.TELLER:
            roleNavItems = `
                <li><a href="/frontend/pages/teller/dashboard.html" data-role-nav>Sell Tickets</a></li>
                <li><a href="/frontend/pages/teller/sales.html" data-role-nav>Sales History</a></li>
            `;
            break;
    }

    // Insert role-specific nav items before login button
    const loginBtn = navMenu.querySelector('.btn-login');
    if (loginBtn && roleNavItems) {
        loginBtn.insertAdjacentHTML('beforebegin', roleNavItems);
    }

    // Update login button to logout
    if (loginBtn) {
        loginBtn.textContent = 'Logout';
        loginBtn.addEventListener('click', handleLogout);
    }
}

// Require authentication - redirect if not logged in
function requireAuth(redirectUrl = '/frontend/pages/login.html') {
    if (!isAuthenticated()) {
        // Save current URL for redirect after login
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        window.location.href = redirectUrl;
        return false;
    }
    return true;
}

// Require specific role - redirect if user doesn't have role
function requireRole(requiredRoles, redirectUrl = '/frontend/pages/dashboard.html') {
    const userRole = getUserRole();
    
    if (!Array.isArray(requiredRoles)) {
        requiredRoles = [requiredRoles];
    }

    if (!userRole || !requiredRoles.includes(userRole)) {
        window.location.href = redirectUrl;
        return false;
    }
    return true;
}

// Handle login form submission
async function handleLoginFormSubmit(formElement, callback) {
    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = formElement.querySelector('[name="email"]')?.value;
        const password = formElement.querySelector('[name="password"]')?.value;

        if (!email || !password) {
            showAuthError('Please enter email and password');
            return;
        }

        try {
            // Show loading state
            const submitBtn = formElement.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Logging in...';
            submitBtn.disabled = true;

            const response = await API.auth.login(email, password);
            
            if (response.success) {
                await handleLoginSuccess(response);
                if (callback) callback(response.data.user);
            } else {
                showAuthError(response.message || 'Login failed');
            }

            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        } catch (error) {
            console.error('Login error:', error);
            showAuthError(error.message || 'An error occurred during login');
            
            // Reset button state
            const submitBtn = formElement.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Login';
            submitBtn.disabled = false;
        }
    });
}

// Handle registration form submission
async function handleRegistrationFormSubmit(formElement, callback) {
    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(formElement);
        const userData = {
            firstName: formData.get('first-name') || formData.get('firstName'),
            lastName: formData.get('last-name') || formData.get('lastName'),
            email: formData.get('email'),
            password: formData.get('password'),
            phoneNumber: formData.get('phone') || formData.get('phoneNumber'),
            address: formData.get('address')
        };

        // Validate passwords match
        const confirmPassword = formData.get('confirm-password') || formData.get('confirmPassword');
        if (confirmPassword && userData.password !== confirmPassword) {
            showAuthError('Passwords do not match');
            return;
        }

        try {
            // Show loading state
            const submitBtn = formElement.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Registering...';
            submitBtn.disabled = true;

            const response = await API.auth.register(userData);
            
            if (response.success) {
                // Auto-login after successful registration
                const loginResponse = await API.auth.login(userData.email, userData.password);
                if (loginResponse.success) {
                    await handleLoginSuccess(loginResponse);
                    if (callback) callback(loginResponse.data.user);
                }
            }

            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        } catch (error) {
            console.error('Registration error:', error);
            showAuthError(error.details?.[0]?.message || error.message || 'Registration failed');
            
            // Reset button state
            const submitBtn = formElement.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Register';
            submitBtn.disabled = false;
        }
    });
}

// Show auth error message
function showAuthError(message) {
    const errorContainer = document.getElementById('auth-error');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 5000);
    } else {
        alert(message);
    }
}

// Show auth success message
function showAuthSuccess(message) {
    const successContainer = document.getElementById('auth-success');
    if (successContainer) {
        successContainer.textContent = message;
        successContainer.style.display = 'block';
        setTimeout(() => {
            successContainer.style.display = 'none';
        }, 3000);
    } else {
        alert(message);
    }
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Export auth functions
window.Auth = {
    USER_ROLES,
    ROLE_DASHBOARDS,
    getCurrentUser,
    setCurrentUser,
    getAccessToken,
    getRefreshToken,
    setAuthTokens,
    clearAuthData,
    isAuthenticated,
    getUserRole,
    hasRole,
    isAdmin,
    isCustomer,
    isTeller,
    handleLoginSuccess,
    handleLogout,
    initAuth,
    requireAuth,
    requireRole,
    handleLoginFormSubmit,
    handleRegistrationFormSubmit,
    showAuthError,
    showAuthSuccess,
    formatDate,
    formatCurrency
};