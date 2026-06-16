USE laundry_db;

-- Add investor role to users table
ALTER TABLE users 
MODIFY COLUMN role ENUM('admin', 'cashier', 'manager', 'investor') DEFAULT 'cashier';

-- Create investor-outlets junction table
CREATE TABLE IF NOT EXISTS investor_outlets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    investor_id INT NOT NULL,
    outlet_id INT NOT NULL,
    investment_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    ownership_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    investment_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (investor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (outlet_id) REFERENCES outlets(id) ON DELETE CASCADE,
    UNIQUE KEY unique_investor_outlet (investor_id, outlet_id)
);

-- Insert sample investor accounts
INSERT INTO users (name, email, password, role, phone) VALUES
('Budi Investor', 'budi@investor.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'investor', '081311223355'),
('Sari Investor', 'sari@investor.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'investor', '081322334455'),
('Rina Investor', 'rina@investor.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'investor', '081333445566');

-- Link investors to outlets
INSERT INTO investor_outlets (investor_id, outlet_id, investment_amount, ownership_percentage) VALUES
(3, 1, 50000000.00, 15.00),  -- Budi invest di Outlet Pusat 15%
(3, 2, 30000000.00, 20.00),  -- Budi invest di Outlet Meruya 20%
(4, 1, 70000000.00, 20.00),  -- Sari invest di Outlet Pusat 20%
(5, 3, 60000000.00, 25.00);  -- Rina invest di Outlet Kebayoran 25%

-- Update outlet investor percentages based on total investment
UPDATE outlets o
SET investor_percentage = (
    SELECT SUM(ownership_percentage) 
    FROM investor_outlets 
    WHERE outlet_id = o.id
)
WHERE id IN (1, 2, 3);

-- Create indexes for better performance
CREATE INDEX idx_investor_outlets_investor ON investor_outlets(investor_id);
CREATE INDEX idx_investor_outlets_outlet ON investor_outlets(outlet_id);
CREATE INDEX idx_investor_outlets_composite ON investor_outlets(investor_id, outlet_id);

SELECT '✅ Investor features added successfully!' AS status;
SELECT '👤 Sample investors created:' AS info;
SELECT '   - Budi Investor (budi@investor.com) - Outlet Pusat 15%, Meruya 20%' AS details;
SELECT '   - Sari Investor (sari@investor.com) - Outlet Pusat 20%' AS details;
SELECT '   - Rina Investor (rina@investor.com) - Outlet Kebayoran 25%' AS details;