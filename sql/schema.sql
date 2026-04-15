-- Belize Bus Ticket System Database Schema
-- SQL schema for the Belize Bus Ticket System

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS belize_bus_system;
USE belize_bus_system;

-- Location table - stores all locations including terminals and stops
CREATE TABLE locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type ENUM('Terminal', 'Stop', 'City', 'Town') NOT NULL,
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50) DEFAULT 'Belize',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_location_type (type),
    INDEX idx_location_city (city),
    INDEX idx_location_active (is_active)
);

-- Users table - base table for all users (customers and tellers)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('Customer', 'Teller') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_email (email),
    INDEX idx_user_type (user_type),
    INDEX idx_user_active (is_active)
);

-- Customers table - inherits from users
CREATE TABLE customers (
    id INT PRIMARY KEY,
    phone_number VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_customer_phone (phone_number)
);

-- Tellers table - inherits from users
CREATE TABLE tellers (
    id INT PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    terminal_location_id INT NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 0.05,
    is_authorized BOOLEAN DEFAULT FALSE,
    hire_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (terminal_location_id) REFERENCES locations(id),
    INDEX idx_teller_employee_id (employee_id),
    INDEX idx_teller_terminal (terminal_location_id),
    INDEX idx_teller_authorized (is_authorized)
);

-- Buses table - manages bus information and schedules
CREATE TABLE buses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    bus_number VARCHAR(20) UNIQUE NOT NULL,
    type ENUM('Regular', 'Express') NOT NULL,
    seat_capacity INT NOT NULL CHECK (seat_capacity > 0),
    available_seats INT NOT NULL,
    departure_location_id INT NOT NULL,
    arrival_location_id INT NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (departure_location_id) REFERENCES locations(id),
    FOREIGN KEY (arrival_location_id) REFERENCES locations(id),
    INDEX idx_bus_number (bus_number),
    INDEX idx_bus_type (type),
    INDEX idx_bus_active (is_active),
    INDEX idx_bus_departure (departure_location_id),
    INDEX idx_bus_arrival (arrival_location_id),
    
    CONSTRAINT chk_seat_capacity CHECK (available_seats >= 0 AND available_seats <= seat_capacity),
    CONSTRAINT chk_bus_schedule CHECK (departure_time < arrival_time)
);

-- Bus stops table - defines stops along bus routes
CREATE TABLE bus_stops (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bus_id INT NOT NULL,
    location_id INT NOT NULL,
    stop_order INT NOT NULL,
    arrival_time TIME,
    departure_time TIME,
    
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(id),
    UNIQUE KEY unique_bus_stop (bus_id, location_id),
    INDEX idx_bus_stop_order (bus_id, stop_order),
    
    CONSTRAINT chk_stop_times CHECK (arrival_time <= departure_time)
);

-- Tickets table - manages ticket bookings and sales
CREATE TABLE tickets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bus_id INT NOT NULL,
    customer_id INT NOT NULL,
    teller_id INT,
    destination VARCHAR(100) NOT NULL,
    travel_date DATE NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    number_of_seats INT NOT NULL CHECK (number_of_seats > 0),
    price_per_seat DECIMAL(10,2) NOT NULL CHECK (price_per_seat >= 0),
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    status ENUM('Available', 'Booked', 'Confirmed', 'Cancelled', 'Expired') DEFAULT 'Booked',
    seat_numbers VARCHAR(100),
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    is_round_trip BOOLEAN DEFAULT FALSE,
    return_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (bus_id) REFERENCES buses(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (teller_id) REFERENCES tellers(id),
    INDEX idx_ticket_bus (bus_id),
    INDEX idx_ticket_customer (customer_id),
    INDEX idx_ticket_teller (teller_id),
    INDEX idx_ticket_date (travel_date),
    INDEX idx_ticket_status (status),
    INDEX idx_ticket_reference (booking_reference),
    
    CONSTRAINT chk_return_date CHECK (return_date IS NULL OR return_date >= travel_date)
);

-- Customer booking history table - tracks all customer bookings
CREATE TABLE customer_bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    ticket_id INT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    UNIQUE KEY unique_customer_ticket (customer_id, ticket_id),
    INDEX idx_customer_booking (customer_id, booking_date)
);

-- Teller sales history table - tracks all teller sales
CREATE TABLE teller_sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    teller_id INT NOT NULL,
    ticket_id INT NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (teller_id) REFERENCES tellers(id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    UNIQUE KEY unique_teller_ticket (teller_id, ticket_id),
    INDEX idx_teller_sale (teller_id, sale_date)
);

-- System configuration table - stores system settings
CREATE TABLE system_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    config_key VARCHAR(50) UNIQUE NOT NULL,
    config_value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_config_key (config_key)
);

-- Insert default system configuration
INSERT INTO system_config (config_key, config_value, description) VALUES
('system_name', 'Belize Bus Ticket System', 'Name of the bus ticket system'),
('system_version', '1.0.0', 'Current version of the system'),
('currency', 'BZD', 'Default currency for ticket prices'),
('commission_rate', '0.05', 'Default commission rate for tellers'),
('max_booking_days', '30', 'Maximum number of days in advance for booking'),
('min_booking_days', '1', 'Minimum number of days in advance for booking'),
('round_trip_discount', '0.10', 'Discount rate for round trip tickets');

-- Create views for common queries

-- View for available buses with current seat availability
CREATE VIEW available_buses_view AS
SELECT 
    b.id,
    b.name,
    b.bus_number,
    b.type,
    b.seat_capacity,
    b.available_seats,
    dep.name AS departure_location,
    arr.name AS arrival_location,
    b.departure_time,
    b.arrival_time,
    b.is_active
FROM buses b
JOIN locations dep ON b.departure_location_id = dep.id
JOIN locations arr ON b.arrival_location_id = arr.id
WHERE b.is_active = TRUE AND b.available_seats > 0;

-- View for ticket sales summary
CREATE VIEW ticket_sales_summary AS
SELECT 
    DATE(t.booking_date) AS booking_date,
    COUNT(*) AS total_tickets,
    SUM(t.total_price) AS total_revenue,
    COUNT(DISTINCT t.customer_id) AS unique_customers,
    COUNT(DISTINCT t.teller_id) AS tellers_used
FROM tickets t
WHERE t.status IN ('Booked', 'Confirmed')
GROUP BY DATE(t.booking_date)
ORDER BY booking_date DESC;

-- View for bus utilization
CREATE VIEW bus_utilization_view AS
SELECT 
    b.id,
    b.name,
    b.bus_number,
    b.type,
    b.seat_capacity,
    b.available_seats,
    (b.seat_capacity - b.available_seats) AS seats_booked,
    ROUND(((b.seat_capacity - b.available_seats) / b.seat_capacity) * 100, 2) AS occupancy_rate,
    dep.name AS departure_location,
    arr.name AS arrival_location
FROM buses b
JOIN locations dep ON b.departure_location_id = dep.id
JOIN locations arr ON b.arrival_location_id = arr.id
WHERE b.is_active = TRUE;

-- View for popular destinations
CREATE VIEW popular_destinations_view AS
SELECT 
    t.destination,
    COUNT(*) AS ticket_count,
    SUM(t.total_price) AS total_revenue,
    COUNT(DISTINCT t.customer_id) AS unique_customers
FROM tickets t
WHERE t.status IN ('Booked', 'Confirmed')
GROUP BY t.destination
ORDER BY ticket_count DESC;

-- View for teller performance
CREATE VIEW teller_performance_view AS
SELECT 
    t.id,
    t.employee_id,
    CONCAT(u.first_name, ' ', u.last_name) AS teller_name,
    loc.name AS terminal_location,
    COUNT(ts.ticket_id) AS tickets_sold,
    SUM(tic.total_price) AS total_sales,
    COUNT(DISTINCT tic.customer_id) AS unique_customers,
    ROUND(COUNT(ts.ticket_id) * t.commission_rate, 2) AS commission_earned
FROM tellers t
JOIN users u ON t.id = u.id
JOIN locations loc ON t.terminal_location_id = loc.id
LEFT JOIN teller_sales ts ON t.id = ts.teller_id
LEFT JOIN tickets tic ON ts.ticket_id = tic.id AND tic.status IN ('Booked', 'Confirmed')
WHERE t.is_authorized = TRUE
GROUP BY t.id, t.employee_id, u.first_name, u.last_name, loc.name, t.commission_rate
ORDER BY tickets_sold DESC;