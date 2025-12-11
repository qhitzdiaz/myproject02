-- Services Management Database (Serbisyo24x7)

-- Service Categories Table
CREATE TABLE IF NOT EXISTS service_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(100),
  color VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service Providers Table
CREATE TABLE IF NOT EXISTS service_providers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  category_id INT NOT NULL,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  address TEXT,
  city VARCHAR(100),
  experience_years INT,
  certifications TEXT,
  availability VARCHAR(50) DEFAULT 'available',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE CASCADE
);

-- Service Listings Table
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id INT NOT NULL,
  provider_id INT NOT NULL,
  price DECIMAL(10, 2),
  duration_hours INT,
  min_rating DECIMAL(3, 2) DEFAULT 0,
  max_participants INT,
  tags VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE CASCADE,
  FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE
);

-- Service Bookings Table
CREATE TABLE IF NOT EXISTS service_bookings (
  id SERIAL PRIMARY KEY,
  booking_code VARCHAR(100) UNIQUE NOT NULL,
  service_id INT NOT NULL,
  provider_id INT NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  booking_date DATE NOT NULL,
  booking_time TIME,
  duration_hours INT,
  total_price DECIMAL(10, 2),
  special_requests TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE
);

-- Service Reviews Table
CREATE TABLE IF NOT EXISTS service_reviews (
  id SERIAL PRIMARY KEY,
  booking_id INT NOT NULL,
  provider_id INT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  reviewer_name VARCHAR(255),
  reviewer_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES service_bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE
);

-- Insert sample service categories
INSERT INTO service_categories (name, description, icon, color) VALUES
('Plumbing', 'Plumbing and water system services', 'plumbing_services', '#FF6B6B'),
('Electrical', 'Electrical installation and repair', 'electrical_services', '#FFA500'),
('Cleaning', 'Professional cleaning services', 'cleaning_services', '#4ECDC4'),
('HVAC', 'Heating, ventilation, and air conditioning', 'hvac', '#95E1D3'),
('Carpentry', 'Carpentry and furniture repair', 'carpentry', '#8B6F47'),
('Home Maintenance', 'General home maintenance and repairs', 'home_repair', '#6A5ACD');

-- Insert sample service providers
INSERT INTO service_providers (name, email, phone, category_id, experience_years, address, city, availability) VALUES
('Juan Dela Cruz Plumbing', 'juan.plumbing@email.com', '+63-917-123-4567', 1, 8, '123 Plumbing St', 'Manila', 'available'),
('Maria Santos Electrical', 'maria.electrical@email.com', '+63-916-234-5678', 2, 12, '456 Electric Ave', 'Cebu', 'available'),
('Clean Professionals PH', 'contact@cleanprofessionals.com', '+63-915-345-6789', 3, 5, '789 Clean Lane', 'Quezon City', 'available'),
('Cool Systems HVAC', 'info@coolsystems.com', '+63-918-456-7890', 4, 10, '321 AC Road', 'Davao', 'available'),
('Master Carpenter Studio', 'mastercraft@email.com', '+63-919-567-8901', 5, 15, '654 Wood Street', 'Makati', 'available');

-- Insert sample services
INSERT INTO services (title, description, category_id, provider_id, price, duration_hours) VALUES
('Pipe Installation & Repair', 'Professional pipe installation and leak repair services', 1, 1, 1500.00, 2),
('Full Bathroom Plumbing', 'Complete bathroom plumbing setup', 1, 1, 5000.00, 4),
('Electrical Wiring Installation', 'Safe and certified electrical wiring for homes and offices', 2, 2, 3000.00, 3),
('Appliance Repair', 'Repair and maintenance of electrical appliances', 2, 2, 1200.00, 1),
('Deep Cleaning Service', 'Professional deep cleaning of homes and commercial spaces', 3, 3, 2500.00, 3),
('Weekly Maintenance Cleaning', 'Regular weekly cleaning service', 3, 3, 800.00, 2),
('AC Installation & Maintenance', 'Air conditioning unit installation and regular maintenance', 4, 4, 8000.00, 5),
('Furniture Repair & Restoration', 'Expert furniture repair and wood restoration', 5, 5, 2000.00, 3);

-- Insert sample bookings
INSERT INTO service_bookings (booking_code, service_id, provider_id, customer_name, customer_email, customer_phone, booking_date, booking_time, duration_hours, total_price, status, payment_status) VALUES
('BK-2025-001', 1, 1, 'Roberto Santos', 'robert@email.com', '555-0101', '2025-12-15', '09:00', 2, 1500.00, 'confirmed', 'paid'),
('BK-2025-002', 2, 1, 'Angela Cruz', 'angela@email.com', '555-0102', '2025-12-16', '10:00', 4, 5000.00, 'pending', 'pending'),
('BK-2025-003', 5, 3, 'Maria Garcia', 'maria.g@email.com', '555-0103', '2025-12-17', '14:00', 3, 2500.00, 'confirmed', 'paid'),
('BK-2025-004', 7, 4, 'Luis Fernandez', 'luis.f@email.com', '555-0104', '2025-12-18', '08:00', 5, 8000.00, 'pending', 'pending');

-- Insert sample reviews
INSERT INTO service_reviews (booking_id, provider_id, rating, review_text, reviewer_name, reviewer_email) VALUES
(1, 1, 5, 'Excellent work! Very professional and completed on time.', 'Roberto Santos', 'robert@email.com'),
(3, 3, 4, 'Good service, thorough cleaning. Highly recommended.', 'Maria Garcia', 'maria.g@email.com');
