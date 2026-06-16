USE laundry_db;

-- Add investor role to users table
ALTER TABLE users 
MODIFY COLUMN role ENUM('admin', 'cashier', 'manager', 'investor') DEFAULT 'cashier';

-- Create investor-outlets junction table
CREATE TABLE IF NOT EXISTS investor_outlets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    investor_id INT NOT NULL,
    outlet_id INT NOT NULL,
    investment_amount DECIMAL(15,2) DEFAULT 0.00,
    ownership_percentage DECIMAL(5,2) DEFAULT 0.00,
    investment_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (investor_id) REFERENCES users(id),
    FOREIGN KEY (outlet_id) REFERENCES outlets(id),
    UNIQUE KEY unique_investor_outlet (investor_id, outlet_id)
);

-- Insert sample investor accounts
INSERT IGNORE INTO users (name, email, password, role, phone) VALUES
('Budi Investor', 'budi@investor.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'investor', '081311223355'),
('Sari Investor', 'sari@investor.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'investor', '081322334455'),
('Rina Investor', 'rina@investor.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'investor', '081333445566');

-- Link investors to outlets
INSERT IGNORE INTO investor_outlets (investor_id, outlet_id, investment_amount, ownership_percentage) VALUES
(3, 1, 50000000.00, 15.00),
(3, 2, 30000000.00, 20.00),
(4, 1, 70000000.00, 20.00),
(5, 3, 60000000.00, 25.00);

-- Create indexes
CREATE INDEX idx_investor_outlets_investor ON investor_outlets(investor_id);
CREATE INDEX idx_investor_outlets_outlet ON investor_outlets(outlet_id);

SELECT '✅ Investor features added successfully!' AS status;