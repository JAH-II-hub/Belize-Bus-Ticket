// Belize Bus Ticket System - Simple Client-Side Router
// Handles basic routing and navigation for single-page functionality

const routes = {
    // Public routes
    '/': '/frontend/index.html',
    '/index.html': '/frontend/index.html',
    '/login': '/frontend/pages/login.html',
    '/signup': '/frontend/pages/signup.html',
    
    // Customer routes (require authentication)
    '/dashboard': '/frontend/pages/dashboard.html',
    '/buses': '/frontend/pages/buses.html',
    '/tickets': '/frontend/pages/tickets.html',
    '/profile': '/frontend/pages/profile.html',
    
    // Admin routes (require admin role)
    '/admin/users': '/frontend/pages/admin/users.html',
    '/admin/buses': '/frontend/pages/admin/buses.html',
    '/admin/reports': '/frontend/pages/admin/reports.html',
    
    // Teller routes (require teller role)
    '/teller/dashboard': '/frontend/pages/teller/dashboard.html',
    '/teller/sales': '/frontend/pages/teller/sales.html'
};

// Route protection rules
const routeGuards = {
    '/dashboard': ['Customer'],
    '/buses': ['Customer', 'Admin', 'Teller'],
    '/tickets': ['Customer', 'Admin', 'Teller'],
    '/profile': ['Customer', 'Admin', 'Teller'],
    '/admin/users': ['Admin'],
    '/admin/buses': ['Admin'],
    '/admin/reports': ['Admin'],
    '/teller/dashboard': ['Teller'],
    '/teller/sales': ['Teller']
};

/**
 * Navigate to a route
 * @param {string} path - Route path
 * @param {object} params - Query parameters
 */
function navigate(path, params = {}) {
    const targetRoute = routes[path] || routes['/'];
    const url = new URL(targetRoute, window.location.origin);
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            url.searchParams.set(key, value);
        }
    });
    
    window.location.href = url.toString();
}

/**
 * Check if route requires authentication
 * @param {string} path - Route path
 * @returns {boolean} True if auth required
 */
function requiresAuth(path) {
    return routeGuards.hasOwnProperty(path);
}

/**
 * Check if user has access to route
 * @param {string} path - Route path
 * @param {string} userRole - Current user role
 * @returns {boolean} True if access granted
 */
function hasRouteAccess(path, userRole) {
    const allowedRoles = routeGuards[path];
    if (!allowedRoles) return true; // Public route
    return allowedRoles.includes(userRole);
}

/**
 * Get redirect path based on user role
 * @param {string} userRole - User role
 * @returns {string} Redirect path
 */
function getRoleRedirect(userRole) {
    const redirects = {
        'Admin': '/admin/users',
        'Customer': '/dashboard',
        'Teller': '/teller/dashboard'
    };
    return redirects[userRole] || '/';
}

/**
 * Initialize router - check current route and apply guards
 */
function initRouter() {
    const currentPath = window.location.pathname;
    const user = Auth?.getCurrentUser?.();
    const userRole = user?.userType;
    
    // Find matching route key
    let routeKey = Object.keys(routes).find(key => routes[key] === currentPath.replace('/frontend', '')) || '/';
    
    // Check route access
    if (requiresAuth(routeKey)) {
        if (!userRole) {
            // Not authenticated - redirect to login
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
            navigate('/login');
            return false;
        }
        
        if (!hasRouteAccess(routeKey, userRole)) {
            // No access - redirect to appropriate dashboard
            navigate(getRoleRedirect(userRole));
            return false;
        }
    }
    
    return true;
}

/**
 * Create navigation link handler
 * @param {HTMLElement} link - Navigation link element
 */
function handleNavLink(link) {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Only handle internal links
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else if (href && !href.startsWith('http') && !href.startsWith('//')) {
            // Internal page navigation
            e.preventDefault();
            
            // Check if it's a known route
            const routeKey = Object.keys(routes).find(key => routes[key].includes(href));
            if (routeKey) {
                navigate(routeKey);
            } else {
                window.location.href = href;
            }
        }
    });
}

/**
 * Initialize all navigation links on page
 */
function initNavLinks() {
    document.querySelectorAll('a[href]').forEach(handleNavLink);
}

/**
 * Update active navigation state
 * @param {string} currentPath - Current route path
 */
function updateActiveNav(currentPath) {
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && (currentPath.includes(href) || href.includes(currentPath))) {
            link.classList.add('active');
        }
    });
}

/**
 * Go back in history
 */
function goBack() {
    window.history.back();
}

/**
 * Go forward in history
 */
function goForward() {
    window.history.forward();
}

/**
 * Replace current history state without reload
 * @param {string} path - New path
 */
function replaceState(path) {
    const targetRoute = routes[path] || path;
    window.history.replaceState({ path }, '', targetRoute);
}

// Export router functions
window.Router = {
    routes,
    routeGuards,
    navigate,
    requiresAuth,
    hasRouteAccess,
    getRoleRedirect,
    initRouter,
    initNavLinks,
    updateActiveNav,
    goBack,
    goForward,
    replaceState
};

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initRouter();
    initNavLinks();
});