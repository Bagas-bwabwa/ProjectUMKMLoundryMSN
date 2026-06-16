CREATE DATABASE IF NOT EXISTS laundry_db;
USE laundry_db;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'cashier', 'manager') DEFAULT 'cashier',
    phone VARCHAR(20),
    address TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    membership ENUM('Regular', 'Silver', 'Gold') DEFAULT 'Regular',
    total_transactions INT DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0,
    last_visit DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    price_per_kg DECIMAL(10,2) NOT NULL,
    min_weight DECIMAL(5,2) DEFAULT 1.00,
    estimated_time INT DEFAULT 24,
    active BOOLEAN DEFAULT TRUE,
    category ENUM('Regular', 'Express', 'Premium') DEFAULT 'Regular',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    category ENUM('Detergent', 'Fabric Softener', 'Bleach', 'Packaging', 'Other') NOT NULL,
    unit ENUM('kg', 'liter', 'pcs', 'pack', 'bag') NOT NULL,
    stock DECIMAL(10,2) NOT NULL,
    min_stock DECIMAL(10,2) DEFAULT 10.00,
    price DECIMAL(10,2) NOT NULL,
    supplier VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    transaction_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id INT NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    total_weight DECIMAL(8,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0.00,
    final_amount DECIMAL(12,2) NOT NULL,
    payment_status ENUM('Pending', 'Paid', 'Partial') DEFAULT 'Pending',
    status ENUM('Pending', 'Processing', 'Ready', 'Completed', 'Cancelled') DEFAULT 'Pending',
    payment_method ENUM('Cash', 'Transfer', 'QRIS', 'Debit/Credit') DEFAULT 'Cash',
    estimated_ready DATETIME,
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE transaction_services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    transaction_id INT NOT NULL,
    service_id INT,
    service_name VARCHAR(100) NOT NULL,
    weight DECIMAL(8,2) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id)
);

CREATE TABLE expenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(255) NOT NULL,
    category ENUM('Operational', 'Equipment', 'Utilities', 'Salary', 'Maintenance', 'Other') NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    payment_method ENUM('Cash', 'Transfer', 'Other') DEFAULT 'Cash',
    receipt_number VARCHAR(100),
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_transactions_number ON transactions(transaction_number);
CREATE INDEX idx_transactions_customer ON transactions(customer_id);
CREATE INDEX idx_transactions_date ON transactions(created_at);
CREATE INDEX idx_expenses_date ON expenses(date);

INSERT INTO users (name, email, password, role, phone) VALUES
('Admin Laundry', 'admin@laundry.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '081234567890'),
('Kasir Laundry', 'kasir@laundry.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'cashier', '081298765432');

INSERT INTO services (name, description, price_per_kg, estimated_time, category) VALUES
('Cuci Kering', 'Cuci biasa tanpa setrika', 7000.00, 24, 'Regular'),
('Cuci Setrika', 'Cuci dan setrika', 8000.00, 24, 'Regular'),
('Setrika Saja', 'Hanya setrika', 5000.00, 12, 'Regular'),
('Express', 'Layanan cepat 6 jam', 15000.00, 6, 'Express'),
('Premium', 'Layanan premium dengan pewangi khusus', 12000.00, 24, 'Premium');

INSERT INTO items (name, category, unit, stock, min_stock, price, supplier) VALUES
('Detergent Bubuk', 'Detergent', 'kg', 50.00, 10.00, 20000.00, 'Supplier A'),
('Pelembut Pakaian', 'Fabric Softener', 'liter', 30.00, 5.00, 25000.00, 'Supplier B'),
('Pemutih', 'Bleach', 'liter', 20.00, 3.00, 18000.00, 'Supplier C'),
('Plastik Packaging', 'Packaging', 'pack', 100.00, 20.00, 15000.00, 'Supplier D'),
('Hanger', 'Other', 'pcs', 200.00, 50.00, 5000.00, 'Supplier E');

SELECT 'MySQL Database setup completed successfully!' AS status;