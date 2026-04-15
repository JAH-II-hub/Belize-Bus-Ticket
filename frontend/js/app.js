// Belize Bus Ticket System - JavaScript Application

// DOM Elements
const bookingForm = document.getElementById('booking-form');
const registrationForm = document.getElementById('registration-form');
const loginForm = document.getElementById('login-form');
const loginModal = document.getElementById('login-modal');
const closeModal = document.querySelector('.close');
const loginBtn = document.querySelector('.btn-login');
const busResults = document.getElementById('bus-results');
const busList = document.getElementById('bus-list');
const dashboard = document.getElementById('dashboard');
const customerName = document.getElementById('customer-name');
const recentBookings = document.getElementById('recent-bookings');

// Sample Data (In real application, this would come from the backend)
const locations = [
    { id: 1, name: 'Belize City Terminal', type: 'Terminal' },
    { id: 2, name: 'Belmopan Terminal', type: 'Terminal' },
    { id: 3, name: 'San Ignacio Terminal', type: 'Terminal' },
    { id: 4, name: 'Orange Walk Terminal', type: 'Terminal' },
    { id: 5, name: 'Corozal Terminal', type: 'Terminal' },
    { id: 6, name: 'San Pedro Terminal', type: 'Terminal' },
    { id: 7, name: 'Dangriga Terminal', type: 'Terminal' },
    { id: 8, name: 'Punta Gorda Terminal', type: 'Terminal' }
];

const buses = [
    { id: 1, name: 'Regular Express 1', busNumber: 'BZ-REG-001', type: 'Regular', capacity: 40, available: 35, departure: '06:00', arrival: '08:00', from: 1, to: 2, price: 15.00 },
    { id: 2, name: 'Regular Express 2', busNumber: 'BZ-REG-002', type: 'Regular', capacity: 40, available: 40, departure: '07:00', arrival: '09:30', from: 1, to: 3, price: 20.00 },
    { id: 3, name: 'Express VIP 1', busNumber: 'BZ-EXP-001', type: 'Express', capacity: 25, available: 20, departure: '06:30', arrival: '07:30', from: 1, to: 2, price: 18.00 },
    { id: 4, name: 'Express VIP 2', busNumber: 'BZ-EXP-002', type: 'Express', capacity: 25, available: 25, departure: '07:30', arrival: '09:00', from: 1, to: 3, price: 22.00 }
];

// Current User State
let currentUser = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    populateLocationSelects();
    setupEventListeners();
    checkAuthStatus();
});

// Event Listeners
function setupEventListeners() {
    // Form Submissions
    bookingForm.addEventListener('submit', handleBookingSearch);
    registrationForm.addEventListener('submit', handleRegistration);
    loginForm.addEventListener('submit', handleLogin);
    
    // Modal Controls
    loginBtn.addEventListener('click', openModal);
    closeModal.addEventListener('click', closeModalHandler);
    window.addEventListener('click', outsideClickHandler);
    
    // Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Location Management
function populateLocationSelects() {
    const departureSelect = document.getElementById('departure');
    const destinationSelect = document.getElementById('destination');
    
    locations.forEach(location => {
        const option1 = document.createElement('option');
        option1.value = location.id;
        option1.textContent = location.name;
        departureSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = location.id;
        option2.textContent = location.name;
        destinationSelect.appendChild(option2);
    });
}

// Booking System
function handleBookingSearch(e) {
    e.preventDefault();
    
    const departure = parseInt(document.getElementById('departure').value);
    const destination = parseInt(document.getElementById('destination').value);
    const travelDate = document.getElementById('travel-date').value;
    const busType = document.getElementById('bus-type').value;
    
    if (!departure || !destination || !travelDate) {
        alert('Please fill in all required fields');
        return;
    }
    
    const availableBuses = searchBuses(departure, destination, busType);
    displayBuses(availableBuses);
}

function searchBuses(departureId, destinationId, busType) {
    return buses.filter(bus => {
        const matchesDeparture = bus.from === departureId;
        const matchesDestination = bus.to === destinationId;
        const matchesType = busType === 'all' || bus.type === busType;
        const hasAvailability = bus.available > 0;
        
        return matchesDeparture && matchesDestination && matchesType && hasAvailability;
    });
}

function displayBuses(buses) {
    busList.innerHTML = '';
    
    if (buses.length === 0) {
        busResults.style.display = 'block';
        busList.innerHTML = '<p>No buses available for the selected criteria.</p>';
        return;
    }
    
    busResults.style.display = 'block';
    
    buses.forEach(bus => {
        const locationFrom = locations.find(loc => loc.id === bus.from);
        const locationTo = locations.find(loc => loc.id === bus.to);
        
        const busCard = document.createElement('div');
        busCard.className = 'bus-card';
        busCard.innerHTML = `
            <h3>${bus.name} (${bus.busNumber})</h3>
            <div class="bus-info">
                <div class="bus-info-item">
                    <h4>Type</h4>
                    <p>${bus.type}</p>
                </div>
                <div class="bus-info-item">
                    <h4>Route</h4>
                    <p>${locationFrom.name} → ${locationTo.name}</p>
                </div>
                <div class="bus-info-item">
                    <h4>Departure</h4>
                    <p>${bus.departure}</p>
                </div>
                <div class="bus-info-item">
                    <h4>Arrival</h4>
                    <p>${bus.arrival}</p>
                </div>
                <div class="bus-info-item">
                    <h4>Available Seats</h4>
                    <p>${bus.available}/${bus.capacity}</p>
                </div>
                <div class="bus-info-item">
                    <h4>Price</h4>
                    <p>$${bus.price.toFixed(2)}</p>
                </div>
            </div>
            <button class="btn-primary book-btn" onclick="bookBus(${bus.id})">Book Now</button>
        `;
        
        busList.appendChild(busCard);
    });
}

function bookBus(busId) {
    if (!currentUser) {
        alert('Please login to book a ticket');
        openModal();
        return;
    }
    
    const bus = buses.find(b => b.id === busId);
    if (!bus || bus.available <= 0) {
        alert('This bus is no longer available');
        return;
    }
    
    // In a real application, this would make an API call to the backend
    alert(`Booking confirmed for ${bus.name}!\nTotal: $${bus.price.toFixed(2)}`);
    
    // Update available seats (simulation)
    bus.available--;
    displayBuses([bus]);
}

// Authentication System
function handleRegistration(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const address = document.getElementById('address').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    // In a real application, this would make an API call to register the user
    const newUser = {
        id: Date.now(),
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        address: address,
        userType: 'Customer'
    };
    
    // Simulate successful registration
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    currentUser = newUser;
    
    alert('Registration successful! You are now logged in.');
    updateUIAfterLogin();
    closeModalHandler();
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // In a real application, this would make an API call to authenticate
    // For demo purposes, we'll simulate a successful login
    const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Smith',
        email: email,
        userType: 'Customer'
    };
    
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    currentUser = mockUser;
    
    alert('Login successful!');
    updateUIAfterLogin();
    closeModalHandler();
}

function checkAuthStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIAfterLogin();
    }
}

function updateUIAfterLogin() {
    if (currentUser) {
        customerName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
        dashboard.style.display = 'block';
        
        // Update navigation
        const loginBtn = document.querySelector('.btn-login');
        if (loginBtn) {
            loginBtn.textContent = 'Logout';
            loginBtn.removeEventListener('click', openModal);
            loginBtn.addEventListener('click', handleLogout);
        }
        
        loadDashboardData();
    }
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    dashboard.style.display = 'none';
    
    // Update navigation
    const loginBtn = document.querySelector('.btn-login');
    if (loginBtn) {
        loginBtn.textContent = 'Login';
        loginBtn.removeEventListener('click', handleLogout);
        loginBtn.addEventListener('click', openModal);
    }
}

function loadDashboardData() {
    // In a real application, this would fetch data from the backend
    const mockBookings = [
        { id: 1, reference: 'BK-20230001', destination: 'Belmopan', date: '2023-12-15', status: 'Confirmed', price: 30.00 },
        { id: 2, reference: 'BK-20230002', destination: 'San Ignacio', date: '2023-12-20', status: 'Booked', price: 20.00 }
    ];
    
    recentBookings.innerHTML = '';
    mockBookings.forEach(booking => {
        const bookingDiv = document.createElement('div');
        bookingDiv.className = 'booking-item';
        bookingDiv.innerHTML = `
            <h4>Booking #${booking.reference}</h4>
            <p><strong>Destination:</strong> ${booking.destination}</p>
            <p><strong>Date:</strong> ${booking.date}</p>
            <p><strong>Status:</strong> <span class="status ${booking.status.toLowerCase()}">${booking.status}</span></p>
            <p><strong>Price:</strong> $${booking.price.toFixed(2)}</p>
            <hr>
        `;
        recentBookings.appendChild(bookingDiv);
    });
}

// Modal Controls
function openModal() {
    loginModal.style.display = 'block';
}

function closeModalHandler() {
    loginModal.style.display = 'none';
}

function outsideClickHandler(e) {
    if (e.target === loginModal) {
        closeModalHandler();
    }
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Export functions for global access (needed for onclick handlers)
window.bookBus = bookBus;