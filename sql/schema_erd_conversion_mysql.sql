CREATE TABLE `locations` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `type` varchar(20) NOT NULL,
  `address` text,
  `city` varchar(50),
  `state` varchar(50),
  `country` varchar(50) DEFAULT 'Belize',
  `latitude` decimal(10,8),
  `longitude` decimal(11,8),
  `is_active` boolean DEFAULT true,
  `created_at` timestamp DEFAULT (now()),
  `updated_at` timestamp
);

CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) UNIQUE NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `user_type` varchar(20) NOT NULL,
  `is_active` boolean DEFAULT true,
  `created_at` timestamp DEFAULT (now()),
  `updated_at` timestamp
);

CREATE TABLE `customers` (
  `id` int PRIMARY KEY,
  `phone_number` varchar(20),
  `address` text,
  `date_of_birth` date,
  `created_at` timestamp DEFAULT (now()),
  `updated_at` timestamp
);

CREATE TABLE `tellers` (
  `id` int PRIMARY KEY,
  `employee_id` varchar(20) UNIQUE NOT NULL,
  `terminal_location_id` int,
  `commission_rate` decimal(5,2) DEFAULT 0.05,
  `is_authorized` boolean DEFAULT false,
  `hire_date` date,
  `created_at` timestamp DEFAULT (now()),
  `updated_at` timestamp
);

CREATE TABLE `buses` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `bus_number` varchar(20) UNIQUE NOT NULL,
  `type` varchar(20) NOT NULL,
  `seat_capacity` int NOT NULL,
  `available_seats` int NOT NULL,
  `departure_location_id` int,
  `arrival_location_id` int,
  `departure_time` time,
  `arrival_time` time,
  `is_active` boolean DEFAULT true,
  `created_at` timestamp DEFAULT (now()),
  `updated_at` timestamp
);

CREATE TABLE `bus_stops` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `bus_id` int,
  `location_id` int,
  `stop_order` int,
  `arrival_time` time,
  `departure_time` time
);

CREATE TABLE `tickets` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `bus_id` int,
  `customer_id` int,
  `teller_id` int,
  `destination` varchar(100) NOT NULL,
  `travel_date` date NOT NULL,
  `booking_date` timestamp DEFAULT (now()),
  `number_of_seats` int,
  `price_per_seat` decimal(10,2),
  `total_price` decimal(10,2),
  `status` varchar(20) DEFAULT 'Booked',
  `seat_numbers` varchar(100),
  `booking_reference` varchar(20) UNIQUE,
  `is_round_trip` boolean DEFAULT false,
  `return_date` date,
  `created_at` timestamp DEFAULT (now()),
  `updated_at` timestamp
);

CREATE TABLE `customer_bookings` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `customer_id` int,
  `ticket_id` int,
  `booking_date` timestamp DEFAULT (now())
);

CREATE TABLE `teller_sales` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `teller_id` int,
  `ticket_id` int,
  `sale_date` timestamp DEFAULT (now())
);

CREATE TABLE `system_config` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `config_key` varchar(50) UNIQUE NOT NULL,
  `config_value` text,
  `description` text,
  `created_at` timestamp DEFAULT (now()),
  `updated_at` timestamp
);

CREATE UNIQUE INDEX `teller_sales_index_0` ON `teller_sales` (`teller_id`, `ticket_id`);

ALTER TABLE `locations` COMMENT = 'All bus terminals, stops, cities, and towns';

ALTER TABLE `users` COMMENT = 'Base table for customers and tellers';

ALTER TABLE `customers` COMMENT = 'Customer specific data';

ALTER TABLE `tellers` COMMENT = 'Employees who sell tickets';

ALTER TABLE `buses` COMMENT = 'Buses and their schedules';

ALTER TABLE `bus_stops` COMMENT = 'Intermediate stops for each bus route';

ALTER TABLE `tickets` COMMENT = 'Ticket bookings for bus travel';

ALTER TABLE `customer_bookings` COMMENT = 'History of all bookings made by customers';

ALTER TABLE `teller_sales` COMMENT = 'Tracks ticket sales made by tellers';

ALTER TABLE `system_config` COMMENT = 'System configuration values';

ALTER TABLE `customers` ADD FOREIGN KEY (`id`) REFERENCES `users` (`id`);

ALTER TABLE `tellers` ADD FOREIGN KEY (`id`) REFERENCES `users` (`id`);

ALTER TABLE `tellers` ADD FOREIGN KEY (`terminal_location_id`) REFERENCES `locations` (`id`);

ALTER TABLE `buses` ADD FOREIGN KEY (`departure_location_id`) REFERENCES `locations` (`id`);

ALTER TABLE `buses` ADD FOREIGN KEY (`arrival_location_id`) REFERENCES `locations` (`id`);

ALTER TABLE `bus_stops` ADD FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`);

ALTER TABLE `bus_stops` ADD FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);

ALTER TABLE `tickets` ADD FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`);

ALTER TABLE `tickets` ADD FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

ALTER TABLE `tickets` ADD FOREIGN KEY (`teller_id`) REFERENCES `tellers` (`id`);

ALTER TABLE `customer_bookings` ADD FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

ALTER TABLE `customer_bookings` ADD FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`);

ALTER TABLE `teller_sales` ADD FOREIGN KEY (`teller_id`) REFERENCES `tellers` (`id`);

ALTER TABLE `teller_sales` ADD FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`);
