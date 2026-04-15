-- Stored Procedures for Belize Bus Ticket System
-- Common database operations encapsulated as stored procedures

USE belize_bus_system;

-- Procedure to book a ticket
DELIMITER //
CREATE PROCEDURE BookTicket(
    IN p_bus_id INT,
    IN p_customer_id INT,
    IN p_teller_id INT,
    IN p_destination VARCHAR(100),
    IN p_travel_date DATE,
    IN p_number_of_seats INT,
    IN p_price_per_seat DECIMAL(10,2),
    IN p_is_round_trip BOOLEAN,
    IN p_return_date DATE,
    OUT p_booking_reference VARCHAR(20),
    OUT p_status VARCHAR(50)
)
BEGIN
    DECLARE v_available_seats INT;
    DECLARE v_total_price DECIMAL(10,2);
    DECLARE v_seat_numbers VARCHAR(100);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_status = 'Error: Unable to book ticket';
        SET p_booking_reference = NULL;
    END;
    
    START TRANSACTION;
    
    -- Check if bus has available seats
    SELECT available_seats INTO v_available_seats FROM buses WHERE id = p_bus_id FOR UPDATE;
    
    IF v_available_seats >= p_number_of_seats THEN
        -- Calculate total price
        SET v_total_price = p_number_of_seats * p_price_per_seat;
        
        -- Generate booking reference
        SET p_booking_reference = CONCAT('BK-', YEAR(NOW()), LPAD(MONTH(NOW()), 2, '0'), LPAD(DAY(NOW()), 2, '0'), LPAD(p_bus_id, 3, '0'), LPAD(p_customer_id, 3, '0'));
        
        -- Generate seat numbers (simplified - in real system would track specific seats)
        SET v_seat_numbers = CONCAT('Seats 1-', p_number_of_seats);
        
        -- Insert ticket
        INSERT INTO tickets (
            bus_id, customer_id, teller_id, destination, travel_date, 
            number_of_seats, price_per_seat, total_price, status, 
            seat_numbers, booking_reference, is_round_trip, return_date
        ) VALUES (
            p_bus_id, p_customer_id, p_teller_id, p_destination, p_travel_date,
            p_number_of_seats, p_price_per_seat, v_total_price, 'Booked',
            v_seat_numbers, p_booking_reference, p_is_round_trip, p_return_date
        );
        
        -- Update bus available seats
        UPDATE buses SET available_seats = available_seats - p_number_of_seats WHERE id = p_bus_id;
        
        -- Insert into customer bookings
        INSERT INTO customer_bookings (customer_id, ticket_id) VALUES (p_customer_id, LAST_INSERT_ID());
        
        -- Insert into teller sales
        INSERT INTO teller_sales (teller_id, ticket_id) VALUES (p_teller_id, LAST_INSERT_ID());
        
        SET p_status = 'Success: Ticket booked successfully';
        COMMIT;
    ELSE
        SET p_status = 'Error: Not enough available seats';
        SET p_booking_reference = NULL;
        ROLLBACK;
    END IF;
END //
DELIMITER ;

-- Procedure to cancel a ticket
DELIMITER //
CREATE PROCEDURE CancelTicket(
    IN p_ticket_id INT,
    OUT p_result VARCHAR(100)
)
BEGIN
    DECLARE v_bus_id INT;
    DECLARE v_number_of_seats INT;
    DECLARE v_status VARCHAR(50);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_result = 'Error: Unable to cancel ticket';
    END;
    
    START TRANSACTION;
    
    -- Get ticket details
    SELECT bus_id, number_of_seats, status INTO v_bus_id, v_number_of_seats, v_status 
    FROM tickets WHERE id = p_ticket_id FOR UPDATE;
    
    IF v_status = 'Booked' OR v_status = 'Confirmed' THEN
        -- Update ticket status
        UPDATE tickets SET status = 'Cancelled' WHERE id = p_ticket_id;
        
        -- Restore available seats
        UPDATE buses SET available_seats = available_seats + v_number_of_seats WHERE id = v_bus_id;
        
        SET p_result = 'Success: Ticket cancelled successfully';
        COMMIT;
    ELSE
        SET p_result = 'Error: Cannot cancel ticket in current status';
        ROLLBACK;
    END IF;
END //
DELIMITER ;

-- Procedure to get available buses for a route and date
DELIMITER //
CREATE PROCEDURE GetAvailableBuses(
    IN p_destination VARCHAR(100),
    IN p_travel_date DATE
)
BEGIN
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
        CASE 
            WHEN b.type = 'Regular' THEN b.available_seats * 15.00
            ELSE b.available_seats * 18.00
        END AS estimated_revenue
    FROM buses b
    JOIN locations dep ON b.departure_location_id = dep.id
    JOIN locations arr ON b.arrival_location_id = arr.id
    WHERE b.is_active = TRUE 
    AND b.available_seats > 0
    AND arr.name = p_destination
    AND b.departure_time > CURRENT_TIME()
    ORDER BY b.type, b.departure_time;
END //
DELIMITER ;

-- Procedure to get customer booking history
DELIMITER //
CREATE PROCEDURE GetCustomerBookings(
    IN p_customer_id INT
)
BEGIN
    SELECT 
        t.id,
        t.booking_reference,
        t.destination,
        t.travel_date,
        t.booking_date,
        t.number_of_seats,
        t.total_price,
        t.status,
        b.name AS bus_name,
        b.bus_number,
        dep.name AS departure_location,
        arr.name AS arrival_location,
        t.departure_time,
        t.arrival_time
    FROM tickets t
    JOIN buses b ON t.bus_id = b.id
    JOIN locations dep ON b.departure_location_id = dep.id
    JOIN locations arr ON b.arrival_location_id = arr.id
    WHERE t.customer_id = p_customer_id
    ORDER BY t.travel_date DESC, t.booking_date DESC;
END //
DELIMITER ;

-- Procedure to get teller sales summary
DELIMITER //
CREATE PROCEDURE GetTellerSalesSummary(
    IN p_teller_id INT,
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        COUNT(ts.ticket_id) AS total_tickets_sold,
        SUM(t.total_price) AS total_revenue,
        COUNT(DISTINCT t.customer_id) AS unique_customers,
        AVG(t.total_price) AS average_ticket_price,
        SUM(t.total_price) * tel.commission_rate AS commission_earned
    FROM teller_sales ts
    JOIN tickets t ON ts.ticket_id = t.id
    JOIN tellers tel ON ts.teller_id = tel.id
    WHERE ts.teller_id = p_teller_id
    AND DATE(ts.sale_date) BETWEEN p_start_date AND p_end_date
    AND t.status IN ('Booked', 'Confirmed');
END //
DELIMITER ;

-- Procedure to get daily revenue report
DELIMITER //
CREATE PROCEDURE GetDailyRevenueReport(
    IN p_date DATE
)
BEGIN
    SELECT 
        DATE(t.booking_date) AS booking_date,
        COUNT(*) AS total_tickets,
        SUM(t.total_price) AS total_revenue,
        COUNT(DISTINCT t.customer_id) AS unique_customers,
        COUNT(DISTINCT t.teller_id) AS tellers_used,
        AVG(t.total_price) AS average_ticket_price,
        SUM(CASE WHEN t.is_round_trip = TRUE THEN t.total_price ELSE 0 END) AS round_trip_revenue,
        SUM(CASE WHEN t.is_round_trip = FALSE THEN t.total_price ELSE 0 END) AS one_way_revenue
    FROM tickets t
    WHERE DATE(t.booking_date) = p_date
    AND t.status IN ('Booked', 'Confirmed')
    GROUP BY DATE(t.booking_date);
END //
DELIMITER ;

-- Procedure to get bus utilization report
DELIMITER //
CREATE PROCEDURE GetBusUtilizationReport()
BEGIN
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
        arr.name AS arrival_location,
        COUNT(t.id) AS total_bookings,
        SUM(t.total_price) AS total_revenue
    FROM buses b
    JOIN locations dep ON b.departure_location_id = dep.id
    JOIN locations arr ON b.arrival_location_id = arr.id
    LEFT JOIN tickets t ON b.id = t.bus_id 
        AND t.status IN ('Booked', 'Confirmed')
        AND t.travel_date >= CURDATE()
    WHERE b.is_active = TRUE
    GROUP BY b.id, b.name, b.bus_number, b.type, b.seat_capacity, b.available_seats, dep.name, arr.name
    ORDER BY occupancy_rate DESC;
END //
DELIMITER ;

-- Procedure to get popular destinations report
DELIMITER //
CREATE PROCEDURE GetPopularDestinationsReport(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        t.destination,
        COUNT(*) AS ticket_count,
        SUM(t.total_price) AS total_revenue,
        COUNT(DISTINCT t.customer_id) AS unique_customers,
        AVG(t.total_price) AS average_ticket_price,
        SUM(CASE WHEN t.is_round_trip = TRUE THEN 1 ELSE 0 END) AS round_trip_count,
        SUM(CASE WHEN t.is_round_trip = FALSE THEN 1 ELSE 0 END) AS one_way_count
    FROM tickets t
    WHERE DATE(t.booking_date) BETWEEN p_start_date AND p_end_date
    AND t.status IN ('Booked', 'Confirmed')
    GROUP BY t.destination
    ORDER BY ticket_count DESC, total_revenue DESC;
END //
DELIMITER ;

-- Procedure to update bus availability
DELIMITER //
CREATE PROCEDURE UpdateBusAvailability(
    IN p_bus_id INT,
    IN p_is_active BOOLEAN,
    OUT p_result VARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_result = 'Error: Unable to update bus availability';
    END;
    
    START TRANSACTION;
    
    UPDATE buses SET is_active = p_is_active WHERE id = p_bus_id;
    
    IF ROW_COUNT() > 0 THEN
        SET p_result = 'Success: Bus availability updated';
        COMMIT;
    ELSE
        SET p_result = 'Error: Bus not found';
        ROLLBACK;
    END IF;
END //
DELIMITER ;

-- Procedure to get system statistics
DELIMITER //
CREATE PROCEDURE GetSystemStatistics()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM users WHERE user_type = 'Customer' AND is_active = TRUE) AS total_customers,
        (SELECT COUNT(*) FROM users WHERE user_type = 'Teller' AND is_active = TRUE AND id IN (SELECT id FROM tellers WHERE is_authorized = TRUE)) AS total_authorized_tellers,
        (SELECT COUNT(*) FROM buses WHERE is_active = TRUE) AS total_active_buses,
        (SELECT COUNT(*) FROM tickets WHERE status IN ('Booked', 'Confirmed') AND travel_date >= CURDATE()) AS upcoming_bookings,
        (SELECT COUNT(*) FROM tickets WHERE status IN ('Booked', 'Confirmed') AND DATE(booking_date) = CURDATE()) AS today_bookings,
        (SELECT SUM(total_price) FROM tickets WHERE status IN ('Booked', 'Confirmed') AND DATE(booking_date) = CURDATE()) AS today_revenue,
        (SELECT COUNT(*) FROM locations WHERE is_active = TRUE) AS total_locations;
END //
DELIMITER ;

-- Function to calculate distance between two locations
DELIMITER //
CREATE FUNCTION CalculateDistance(
    lat1 DECIMAL(10,8),
    lon1 DECIMAL(11,8),
    lat2 DECIMAL(10,8),
    lon2 DECIMAL(11,8)
) RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE distance DECIMAL(10,2);
    DECLARE R INT DEFAULT 6371; -- Earth's radius in kilometers
    
    SET distance = R * 2 * ASIN(SQRT(
        POWER(SIN((lat1 - lat2) * PI() / 180 / 2), 2) +
        COS(lat1 * PI() / 180) * COS(lat2 * PI() / 180) *
        POWER(SIN((lon1 - lon2) * PI() / 180 / 2), 2)
    ));
    
    RETURN distance;
END //
DELIMITER ;

-- Procedure to backup database (simplified version)
DELIMITER //
CREATE PROCEDURE BackupDatabase(
    IN p_backup_name VARCHAR(100)
)
BEGIN
    DECLARE backup_file VARCHAR(255);
    SET backup_file = CONCAT('/backups/', p_backup_name, '_', DATE_FORMAT(NOW(), '%Y%m%d_%H%i%s'), '.sql');
    
    -- Note: This is a simplified version. In practice, you would use mysqldump or similar tools
    -- This procedure would need to be implemented at the application level or using MySQL events
    
    SELECT CONCAT('Backup file would be created: ', backup_file) AS message;
END //
DELIMITER ;