-- Sample data for Belize Bus Ticket System
-- This file contains sample data for testing the system

USE belize_bus_system;

-- Insert sample locations (terminals and stops)
INSERT INTO locations (name, type, address, city, state, country, latitude, longitude) VALUES
-- Major cities and terminals
('Belize City Terminal', 'Terminal', '123 Main Street', 'Belize City', 'Belize District', 'Belize', 17.2510, -88.7590),
('Belmopan Terminal', 'Terminal', '456 Commerce Road', 'Belmopan', 'Cayo District', 'Belize', 17.2510, -88.7590),
('San Ignacio Terminal', 'Terminal', '789 Market Street', 'San Ignacio', 'Cayo District', 'Belize', 17.1000, -89.0833),
('Orange Walk Terminal', 'Terminal', '321 Central Avenue', 'Orange Walk Town', 'Orange Walk District', 'Belize', 17.9833, -89.1000),
('Corozal Terminal', 'Terminal', '654 Bay Street', 'Corozal Town', 'Corozal District', 'Belize', 18.4000, -88.4000),
('San Pedro Terminal', 'Terminal', '987 Ambergris Caye', 'San Pedro', 'Belize District', 'Belize', 17.9167, -87.9667),
('Dangriga Terminal', 'Terminal', '147 Coastal Road', 'Dangriga', 'Stann Creek District', 'Belize', 16.9833, -88.1500),
('Punta Gorda Terminal', 'Terminal', '258 Southern Highway', 'Punta Gorda', 'Toledo District', 'Belize', 16.0833, -88.5000),

-- Additional stops along routes
('Independence Stop', 'Stop', 'Highway 1', 'Independence', 'Stann Creek District', 'Belize', 16.6667, -88.3333),
('Stann Creek Stop', 'Stop', 'Stann Creek Town', 'Stann Creek', 'Stann Creek District', 'Belize', 16.7000, -88.2000),
('Cayo Stop', 'Stop', 'Western Highway', 'Cayo', 'Cayo District', 'Belize', 17.1667, -89.0833),
('San Jose Succotz Stop', 'Stop', 'San Jose Succotz Village', 'San Jose Succotz', 'Cayo District', 'Belize', 17.1333, -89.1167),
('Benque Viejo Stop', 'Stop', 'Benque Viejo del Carmen', 'Benque Viejo', 'Cayo District', 'Belize', 17.0667, -89.2000),
('San Estevan Stop', 'Stop', 'San Estevan Village', 'San Estevan', 'Orange Walk District', 'Belize', 17.8333, -89.0833),
('Tower Hill Stop', 'Stop', 'Tower Hill Village', 'Tower Hill', 'Orange Walk District', 'Belize', 17.9167, -89.0833),
('San Antonio Stop', 'Stop', 'San Antonio Village', 'San Antonio', 'Cayo District', 'Belize', 17.1833, -89.1167);

-- Insert sample users (base table)
INSERT INTO users (first_name, last_name, email, password_hash, user_type, is_active) VALUES
-- Customers
('John', 'Smith', 'john.smith@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Customer', TRUE),
('Maria', 'Gonzalez', 'maria.g@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Customer', TRUE),
('David', 'Johnson', 'david.j@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Customer', TRUE),
('Sarah', 'Wilson', 'sarah.w@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Customer', TRUE),
('Michael', 'Brown', 'michael.b@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Customer', TRUE),
('Emily', 'Davis', 'emily.d@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Customer', TRUE),
('Robert', 'Miller', 'robert.m@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Customer', TRUE),
('Lisa', 'Taylor', 'lisa.t@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Customer', TRUE),
('James', 'Anderson', 'james.a@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Customer', TRUE),
('Jennifer', 'Thomas', 'jennifer.t@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Customer', TRUE),

-- Tellers
('Anna', 'Martinez', 'anna.m@belizebus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Teller', TRUE),
('Carlos', 'Rodriguez', 'carlos.r@belizebus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Teller', TRUE),
('Susan', 'Lee', 'susan.l@belizebus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Teller', TRUE),
('Thomas', 'Wilson', 'thomas.w@belizebus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Teller', TRUE),
('Patricia', 'Garcia', 'patricia.g@belizebus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Teller', TRUE);

-- Insert sample customers
INSERT INTO customers (id, phone_number, address, date_of_birth) VALUES
(1, '+501-222-1111', '123 Belize City Street, Belize City', '1985-06-15'),
(2, '+501-222-2222', '456 Belmopan Avenue, Belmopan', '1990-03-22'),
(3, '+501-222-3333', '789 Orange Walk Road, Orange Walk Town', '1978-11-08'),
(4, '+501-222-4444', '321 San Pedro Lane, San Pedro', '1992-07-14'),
(5, '+501-222-5555', '654 Dangriga Coast, Dangriga', '1983-02-28'),
(6, '+501-222-6666', '987 PG Highway, Punta Gorda', '1987-09-10'),
(7, '+501-222-7777', '147 Independence Road, Independence', '1975-12-05'),
(8, '+501-222-8888', '258 Cayo Lane, San Ignacio', '1995-04-18'),
(9, '+501-222-9999', '741 Western Highway, Benque Viejo', '1980-08-25'),
(10, '+501-222-0000', '852 Tower Hill Road, Tower Hill', '1989-01-12');

-- Insert sample tellers
INSERT INTO tellers (id, employee_id, terminal_location_id, commission_rate, is_authorized, hire_date) VALUES
(11, 'EMP-001', 1, 0.05, TRUE, '2023-01-15'),  -- Belize City Terminal
(12, 'EMP-002', 2, 0.06, TRUE, '2023-02-20'),  -- Belmopan Terminal
(13, 'EMP-003', 3, 0.05, TRUE, '2023-03-10'),  -- San Ignacio Terminal
(14, 'EMP-004', 4, 0.07, TRUE, '2023-04-05'),  -- Orange Walk Terminal
(15, 'EMP-005', 5, 0.05, TRUE, '2023-05-12');  -- Corozal Terminal

-- Insert sample buses
INSERT INTO buses (name, bus_number, type, seat_capacity, available_seats, departure_location_id, arrival_location_id, departure_time, arrival_time, is_active) VALUES
-- Regular buses
('Regular Express 1', 'BZ-REG-001', 'Regular', 40, 40, 1, 2, '06:00:00', '08:00:00', TRUE),
('Regular Express 2', 'BZ-REG-002', 'Regular', 40, 40, 1, 3, '07:00:00', '09:30:00', TRUE),
('Regular Express 3', 'BZ-REG-003', 'Regular', 35, 35, 1, 4, '08:00:00', '11:00:00', TRUE),
('Regular Express 4', 'BZ-REG-004', 'Regular', 35, 35, 1, 5, '09:00:00', '12:30:00', TRUE),
('Regular Express 5', 'BZ-REG-005', 'Regular', 40, 40, 1, 6, '10:00:00', '13:00:00', TRUE),
('Regular Express 6', 'BZ-REG-006', 'Regular', 30, 30, 1, 7, '11:00:00', '14:30:00', TRUE),
('Regular Express 7', 'BZ-REG-007', 'Regular', 30, 30, 1, 8, '12:00:00', '16:00:00', TRUE),
('Regular Express 8', 'BZ-REG-008', 'Regular', 40, 40, 2, 1, '14:00:00', '16:00:00', TRUE),
('Regular Express 9', 'BZ-REG-009', 'Regular', 40, 40, 3, 1, '15:00:00', '17:30:00', TRUE),
('Regular Express 10', 'BZ-REG-010', 'Regular', 35, 35, 4, 1, '16:00:00', '19:00:00', TRUE),

-- Express buses
('Express VIP 1', 'BZ-EXP-001', 'Express', 25, 25, 1, 2, '06:30:00', '07:30:00', TRUE),
('Express VIP 2', 'BZ-EXP-002', 'Express', 25, 25, 1, 3, '07:30:00', '09:00:00', TRUE),
('Express VIP 3', 'BZ-EXP-003', 'Express', 20, 20, 1, 4, '08:30:00', '10:30:00', TRUE),
('Express VIP 4', 'BZ-EXP-004', 'Express', 20, 20, 1, 5, '09:30:00', '12:00:00', TRUE),
('Express VIP 5', 'BZ-EXP-005', 'Express', 25, 25, 1, 6, '10:30:00', '12:30:00', TRUE),
('Express VIP 6', 'BZ-EXP-006', 'Express', 20, 20, 1, 7, '11:30:00', '14:00:00', TRUE),
('Express VIP 7', 'BZ-EXP-007', 'Express', 20, 20, 1, 8, '12:30:00', '15:30:00', TRUE),
('Express VIP 8', 'BZ-EXP-008', 'Express', 25, 25, 2, 1, '14:30:00', '15:30:00', TRUE),
('Express VIP 9', 'BZ-EXP-009', 'Express', 25, 25, 3, 1, '15:30:00', '17:00:00', TRUE),
('Express VIP 10', 'BZ-EXP-010', 'Express', 20, 20, 4, 1, '16:30:00', '18:30:00', TRUE);

-- Insert sample bus stops (stops along routes)
INSERT INTO bus_stops (bus_id, location_id, stop_order, arrival_time, departure_time) VALUES
-- Bus 1 stops (Belize City to Belmopan)
(1, 1, 0, NULL, '06:00:00'),  -- Departure from Belize City
(1, 9, 1, '06:30:00', '06:35:00'),  -- Independence
(1, 10, 2, '07:00:00', '07:05:00'),  -- Stann Creek
(1, 2, 3, '08:00:00', NULL),  -- Arrival at Belmopan

-- Bus 2 stops (Belize City to San Ignacio)
(2, 1, 0, NULL, '07:00:00'),  -- Departure from Belize City
(2, 9, 1, '07:30:00', '07:35:00'),  -- Independence
(2, 10, 2, '08:00:00', '08:05:00'),  -- Stann Creek
(2, 11, 3, '08:45:00', '08:50:00'),  -- Cayo
(2, 12, 4, '09:15:00', '09:20:00'),  -- San Jose Succotz
(2, 3, 5, '09:30:00', NULL),  -- Arrival at San Ignacio

-- Bus 3 stops (Belize City to Orange Walk)
(3, 1, 0, NULL, '08:00:00'),  -- Departure from Belize City
(3, 9, 1, '08:30:00', '08:35:00'),  -- Independence
(3, 10, 2, '09:00:00', '09:05:00'),  -- Stann Creek
(3, 11, 3, '09:45:00', '09:50:00'),  -- Cayo
(3, 13, 4, '10:30:00', '10:35:00'),  -- San Estevan
(3, 14, 5, '10:45:00', '10:50:00'),  -- Tower Hill
(3, 4, 6, '11:00:00', NULL),  -- Arrival at Orange Walk

-- Bus 4 stops (Belize City to Corozal)
(4, 1, 0, NULL, '09:00:00'),  -- Departure from Belize City
(4, 9, 1, '09:30:00', '09:35:00'),  -- Independence
(4, 10, 2, '10:00:00', '10:05:00'),  -- Stann Creek
(4, 11, 3, '10:45:00', '10:50:00'),  -- Cayo
(4, 13, 4, '11:30:00', '11:35:00'),  -- San Estevan
(4, 14, 5, '11:45:00', '11:50:00'),  -- Tower Hill
(4, 15, 6, '12:00:00', '12:05:00'),  -- San Antonio
(4, 5, 7, '12:30:00', NULL),  -- Arrival at Corozal

-- Bus 5 stops (Belize City to San Pedro)
(5, 1, 0, NULL, '10:00:00'),  -- Departure from Belize City
(5, 6, 1, '13:00:00', NULL),  -- Arrival at San Pedro

-- Bus 6 stops (Belize City to Dangriga)
(6, 1, 0, NULL, '11:00:00'),  -- Departure from Belize City
(6, 9, 1, '11:30:00', '11:35:00'),  -- Independence
(6, 7, 2, '14:30:00', NULL),  -- Arrival at Dangriga

-- Bus 7 stops (Belize City to Punta Gorda)
(7, 1, 0, NULL, '12:00:00'),  -- Departure from Belize City
(7, 9, 1, '12:30:00', '12:35:00'),  -- Independence
(7, 10, 2, '13:00:00', '13:05:00'),  -- Stann Creek
(7, 7, 3, '14:30:00', '14:35:00'),  -- Dangriga
(7, 8, 4, '16:00:00', NULL),  -- Arrival at Punta Gorda

-- Express buses have fewer stops
-- Express 1 (Belize City to Belmopan)
(11, 1, 0, NULL, '06:30:00'),  -- Departure from Belize City
(11, 2, 1, '07:30:00', NULL),  -- Direct to Belmopan

-- Express 2 (Belize City to San Ignacio)
(12, 1, 0, NULL, '07:30:00'),  -- Departure from Belize City
(12, 11, 1, '08:30:00', '08:35:00'),  -- Cayo (express stop)
(12, 3, 2, '09:00:00', NULL),  -- Arrival at San Ignacio

-- Express 3 (Belize City to Orange Walk)
(13, 1, 0, NULL, '08:30:00'),  -- Departure from Belize City
(13, 11, 1, '09:30:00', '09:35:00'),  -- Cayo (express stop)
(13, 13, 2, '10:15:00', '10:20:00'),  -- San Estevan (express stop)
(13, 4, 3, '10:30:00', NULL),  -- Arrival at Orange Walk

-- Express 4 (Belize City to Corozal)
(14, 1, 0, NULL, '09:30:00'),  -- Departure from Belize City
(14, 11, 1, '10:30:00', '10:35:00'),  -- Cayo (express stop)
(14, 13, 2, '11:15:00', '11:20:00'),  -- San Estevan (express stop)
(14, 15, 3, '11:45:00', '11:50:00'),  -- San Antonio (express stop)
(14, 5, 4, '12:00:00', NULL);  -- Arrival at Corozal

-- Insert sample tickets
INSERT INTO tickets (bus_id, customer_id, teller_id, destination, travel_date, number_of_seats, price_per_seat, total_price, status, seat_numbers, booking_reference, is_round_trip, return_date) VALUES
-- Recent bookings
(1, 1, 11, 'Belmopan', DATE_SUB(CURDATE(), INTERVAL 1 DAY), 2, 15.00, 30.00, 'Confirmed', 'A1,A2', 'BK-20230001', FALSE, NULL),
(2, 2, 12, 'San Ignacio', DATE_SUB(CURDATE(), INTERVAL 2 DAY), 1, 20.00, 20.00, 'Confirmed', 'B1', 'BK-20230002', TRUE, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL 1 DAY)),
(3, 3, 13, 'Orange Walk', DATE_SUB(CURDATE(), INTERVAL 3 DAY), 3, 25.00, 75.00, 'Confirmed', 'C1,C2,C3', 'BK-20230003', FALSE, NULL),
(4, 4, 14, 'Corozal', DATE_SUB(CURDATE(), INTERVAL 4 DAY), 2, 30.00, 60.00, 'Confirmed', 'D1,D2', 'BK-20230004', TRUE, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 4 DAY), INTERVAL 2 DAY)),
(5, 5, 15, 'San Pedro', DATE_SUB(CURDATE(), INTERVAL 5 DAY), 1, 35.00, 35.00, 'Confirmed', 'E1', 'BK-20230005', FALSE, NULL),
(6, 6, 11, 'Dangriga', DATE_SUB(CURDATE(), INTERVAL 6 DAY), 2, 18.00, 36.00, 'Confirmed', 'F1,F2', 'BK-20230006', FALSE, NULL),
(7, 7, 12, 'Punta Gorda', DATE_SUB(CURDATE(), INTERVAL 7 DAY), 4, 22.00, 88.00, 'Confirmed', 'G1,G2,G3,G4', 'BK-20230007', TRUE, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY), INTERVAL 3 DAY)),
(11, 8, 13, 'Belmopan', DATE_SUB(CURDATE(), INTERVAL 8 DAY), 1, 18.00, 18.00, 'Confirmed', 'H1', 'BK-20230008', FALSE, NULL),
(12, 9, 14, 'San Ignacio', DATE_SUB(CURDATE(), INTERVAL 9 DAY), 2, 22.00, 44.00, 'Confirmed', 'I1,I2', 'BK-20230009', TRUE, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 9 DAY), INTERVAL 1 DAY)),
(13, 10, 15, 'Orange Walk', DATE_SUB(CURDATE(), INTERVAL 10 DAY), 1, 28.00, 28.00, 'Confirmed', 'J1', 'BK-20230010', FALSE, NULL),

-- Upcoming bookings
(1, 1, 11, 'Belmopan', DATE_ADD(CURDATE(), INTERVAL 1 DAY), 2, 15.00, 30.00, 'Booked', 'A3,A4', 'BK-20230011', FALSE, NULL),
(2, 2, 12, 'San Ignacio', DATE_ADD(CURDATE(), INTERVAL 2 DAY), 1, 20.00, 20.00, 'Booked', 'B2', 'BK-20230012', TRUE, DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 2 DAY), INTERVAL 1 DAY)),
(3, 3, 13, 'Orange Walk', DATE_ADD(CURDATE(), INTERVAL 3 DAY), 3, 25.00, 75.00, 'Booked', 'C4,C5,C6', 'BK-20230013', FALSE, NULL),
(4, 4, 14, 'Corozal', DATE_ADD(CURDATE(), INTERVAL 4 DAY), 2, 30.00, 60.00, 'Booked', 'D3,D4', 'BK-20230014', TRUE, DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 4 DAY), INTERVAL 2 DAY)),
(5, 5, 15, 'San Pedro', DATE_ADD(CURDATE(), INTERVAL 5 DAY), 1, 35.00, 35.00, 'Booked', 'E2', 'BK-20230015', FALSE, NULL),
(6, 6, 11, 'Dangriga', DATE_ADD(CURDATE(), INTERVAL 6 DAY), 2, 18.00, 36.00, 'Booked', 'F3,F4', 'BK-20230016', FALSE, NULL),
(7, 7, 12, 'Punta Gorda', DATE_ADD(CURDATE(), INTERVAL 7 DAY), 4, 22.00, 88.00, 'Booked', 'G5,G6,G7,G8', 'BK-20230017', TRUE, DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 7 DAY), INTERVAL 3 DAY)),
(11, 8, 13, 'Belmopan', DATE_ADD(CURDATE(), INTERVAL 8 DAY), 1, 18.00, 18.00, 'Booked', 'H2', 'BK-20230018', FALSE, NULL),
(12, 9, 14, 'San Ignacio', DATE_ADD(CURDATE(), INTERVAL 9 DAY), 2, 22.00, 44.00, 'Booked', 'I3,I4', 'BK-20230019', TRUE, DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 9 DAY), INTERVAL 1 DAY)),
(13, 10, 15, 'Orange Walk', DATE_ADD(CURDATE(), INTERVAL 10 DAY), 1, 28.00, 28.00, 'Booked', 'J2', 'BK-20230020', FALSE, NULL),

-- Express bus bookings
(14, 1, 11, 'Corozal', DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1, 32.00, 32.00, 'Booked', 'K1', 'BK-20230021', FALSE, NULL),
(15, 2, 12, 'San Pedro', DATE_ADD(CURDATE(), INTERVAL 2 DAY), 2, 38.00, 76.00, 'Booked', 'L1,L2', 'BK-20230022', TRUE, DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 2 DAY), INTERVAL 1 DAY)),
(16, 3, 13, 'Dangriga', DATE_ADD(CURDATE(), INTERVAL 3 DAY), 1, 20.00, 20.00, 'Booked', 'M1', 'BK-20230023', FALSE, NULL),
(17, 4, 14, 'Punta Gorda', DATE_ADD(CURDATE(), INTERVAL 4 DAY), 3, 24.00, 72.00, 'Booked', 'N1,N2,N3', 'BK-20230024', TRUE, DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 4 DAY), INTERVAL 2 DAY)),
(18, 5, 15, 'Belmopan', DATE_ADD(CURDATE(), INTERVAL 5 DAY), 2, 17.00, 34.00, 'Booked', 'O1,O2', 'BK-20230025', FALSE, NULL);

-- Insert customer booking history
INSERT INTO customer_bookings (customer_id, ticket_id) VALUES
(1, 1), (1, 11), (1, 21),
(2, 2), (2, 12), (2, 22),
(3, 3), (3, 13), (3, 23),
(4, 4), (4, 14), (4, 24),
(5, 5), (5, 15), (5, 25),
(6, 6), (6, 16),
(7, 7), (7, 17),
(8, 8), (8, 18),
(9, 9), (9, 19),
(10, 10), (10, 20);

-- Insert teller sales history
INSERT INTO teller_sales (teller_id, ticket_id) VALUES
(11, 1), (11, 11), (11, 21),
(12, 2), (12, 12), (12, 22),
(13, 3), (13, 13), (13, 23),
(14, 4), (14, 14), (14, 24),
(15, 5), (15, 15), (15, 25),
(11, 6), (11, 16),
(12, 7), (12, 17),
(13, 8), (13, 18),
(14, 9), (14, 19),
(15, 10), (15, 20);