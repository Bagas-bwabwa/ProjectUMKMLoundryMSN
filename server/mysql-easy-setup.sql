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

INSERT INTO users (name, email, password, role, phone) VALUES
('Admin Laundry', 'admin@laundry.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '081234567890'),
('Kasir Laundry', 'kasir@laundry.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'cashier', '081298765432');

INSERT INTO services (name, description, price_per_kg, estimated_time, category) VALUES
('Cuci Kering', 'Cuci biasa tanpa setrika', 7000.00, 24, 'Regular'),
('Cuci Setrika', 'Cuci dan setrika', 8000.00, 24, 'Regular');

SELECT 'MySQL Database setup completed successfully!' AS status;