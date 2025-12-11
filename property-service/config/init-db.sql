-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'USA',
    property_type VARCHAR(50) NOT NULL, -- residential, commercial, industrial, land
    status VARCHAR(50) NOT NULL DEFAULT 'available', -- available, rented, sold, maintenance
    price DECIMAL(12, 2) NOT NULL,
    bedrooms INTEGER,
    bathrooms DECIMAL(3, 1),
    square_feet INTEGER,
    year_built INTEGER,
    image_url TEXT,
    owner_id INTEGER NOT NULL, -- reference to user from auth service
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    lease_start DATE NOT NULL,
    lease_end DATE NOT NULL,
    rent_amount DECIMAL(10, 2) NOT NULL,
    deposit_amount DECIMAL(10, 2),
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, inactive, pending
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create maintenance requests table
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    tenant_id INTEGER REFERENCES tenants(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'medium', -- low, medium, high, urgent
    status VARCHAR(50) NOT NULL DEFAULT 'open', -- open, in_progress, completed, cancelled
    requested_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_date TIMESTAMP,
    cost DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50), -- cash, check, credit_card, bank_transfer
    payment_type VARCHAR(50) NOT NULL DEFAULT 'rent', -- rent, deposit, late_fee, maintenance
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, completed, failed
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_tenants_property ON tenants(property_id);
CREATE INDEX idx_maintenance_property ON maintenance_requests(property_id);
CREATE INDEX idx_payments_tenant ON payments(tenant_id);
CREATE INDEX idx_payments_property ON payments(property_id);

-- Insert sample properties
INSERT INTO properties (title, description, address, city, state, zip_code, property_type, status, price, bedrooms, bathrooms, square_feet, year_built, owner_id) VALUES
('Modern Downtown Apartment', '2BR/2BA luxury apartment in the heart of downtown with city views', '123 Main St, Unit 4B', 'San Francisco', 'CA', '94102', 'residential', 'available', 3500.00, 2, 2.0, 1200, 2018, 1),
('Suburban Family Home', 'Spacious 4BR/3BA home with large backyard, perfect for families', '456 Oak Avenue', 'San Jose', 'CA', '95128', 'residential', 'rented', 4200.00, 4, 3.0, 2500, 2005, 1),
('Commercial Office Space', 'Prime office space in business district, ready for immediate occupancy', '789 Business Blvd, Suite 200', 'Palo Alto', 'CA', '94301', 'commercial', 'available', 6500.00, NULL, 2.0, 3000, 2015, 1);

-- Insert sample tenant
INSERT INTO tenants (property_id, full_name, email, phone, lease_start, lease_end, rent_amount, deposit_amount, status) VALUES
(2, 'John Smith', 'john.smith@example.com', '555-0123', '2024-01-01', '2025-12-31', 4200.00, 8400.00, 'active');

-- Insert sample maintenance request
INSERT INTO maintenance_requests (property_id, tenant_id, title, description, priority, status) VALUES
(2, 1, 'Leaking Kitchen Faucet', 'The kitchen faucet has been dripping continuously for the past week', 'medium', 'open');

-- Insert sample payment
INSERT INTO payments (tenant_id, property_id, amount, payment_date, payment_method, payment_type, status) VALUES
(1, 2, 4200.00, CURRENT_DATE, 'bank_transfer', 'rent', 'completed');
