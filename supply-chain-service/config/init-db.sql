-- Create Supply Chain Management Database

-- Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  unit_price DECIMAL(10, 2),
  reorder_level INT DEFAULT 10,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  warehouse_location VARCHAR(100),
  quantity INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Purchase Orders Table
CREATE TABLE IF NOT EXISTS purchase_orders (
  id SERIAL PRIMARY KEY,
  po_number VARCHAR(100) UNIQUE NOT NULL,
  supplier_id INT NOT NULL,
  order_date DATE NOT NULL,
  expected_delivery DATE,
  actual_delivery DATE,
  total_amount DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
);

-- Purchase Order Items Table
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id SERIAL PRIMARY KEY,
  po_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2),
  line_total DECIMAL(12, 2),
  FOREIGN KEY (po_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Shipments Table
CREATE TABLE IF NOT EXISTS shipments (
  id SERIAL PRIMARY KEY,
  po_id INT NOT NULL,
  tracking_number VARCHAR(100) UNIQUE,
  carrier VARCHAR(100),
  ship_date DATE,
  estimated_delivery DATE,
  actual_delivery DATE,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (po_id) REFERENCES purchase_orders(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO suppliers (name, contact_person, email, phone, city, country, status) VALUES
('Global Electronics Ltd', 'John Smith', 'john@globalelec.com', '+1-555-0101', 'New York', 'USA', 'active'),
('Asia Manufacturing Co', 'Wei Chen', 'wei@asiamfg.com', '+86-10-1234', 'Beijing', 'China', 'active'),
('European Parts Supply', 'Maria Garcia', 'maria@euparts.com', '+34-91-5678', 'Madrid', 'Spain', 'active');

INSERT INTO products (sku, name, description, category, unit_price, reorder_level) VALUES
('PROD-001', 'Microcontroller Unit', 'ARM Cortex-M4 32-bit MCU', 'Electronics', 12.50, 50),
('PROD-002', 'Power Supply Module', '5V/10A regulated power supply', 'Electronics', 25.00, 20),
('PROD-003', 'Sensor Array Board', 'Multi-sensor IoT board', 'Electronics', 45.00, 15),
('PROD-004', 'Connector Pack', 'Assorted industrial connectors (100 pcs)', 'Hardware', 8.75, 100),
('PROD-005', 'Display Module', '4.3 inch LCD with touch', 'Electronics', 35.00, 10);

INSERT INTO inventory (product_id, warehouse_location, quantity) VALUES
(1, 'Rack A-01', 250),
(2, 'Rack A-02', 100),
(3, 'Rack B-01', 75),
(4, 'Rack B-02', 500),
(5, 'Rack C-01', 45);

INSERT INTO purchase_orders (po_number, supplier_id, order_date, expected_delivery, status) VALUES
('PO-2025-001', 1, '2025-12-01', '2025-12-15', 'pending'),
('PO-2025-002', 2, '2025-12-02', '2025-12-20', 'confirmed'),
('PO-2025-003', 3, '2025-11-25', '2025-12-10', 'delivered');
