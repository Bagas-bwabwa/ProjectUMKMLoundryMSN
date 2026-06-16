USE laundry_db;

-- Create outlets table
CREATE TABLE IF NOT EXISTS outlets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    manager_id INT,
    investor_percentage DECIMAL(5,2) DEFAULT 30.00,
    operational_cost DECIMAL(12,2) DEFAULT 0.00,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id)
);

-- Add outlet_id to transactions table
ALTER TABLE transactions 
ADD COLUMN outlet_id INT AFTER id,
ADD FOREIGN KEY (outlet_id) REFERENCES outlets(id);

-- Add outlet_id to expenses table  
ALTER TABLE expenses
ADD COLUMN outlet_id INT AFTER id,
ADD FOREIGN KEY (outlet_id) REFERENCES outlets(id);

-- Insert sample outlets
INSERT INTO outlets (name, address, phone, manager_id, investor_percentage, operational_cost) VALUES
('Outlet Pusat', 'Jl. Sudirman No. 123', '08123456789', 1, 30.00, 5000000.00),
('Outlet Cabang Meruya', 'Jl. Meruya Ilir No. 45', '08129876543', 2, 25.00, 3000000.00),
('Outlet Cabang Kebayoran', 'Jl. Kebayoran Baru No. 67', '081311223344', 1, 35.00, 4000000.00);

-- Update some transactions to have outlet_id
UPDATE transactions SET outlet_id = 1 WHERE id IN (1, 2, 3);
UPDATE transactions SET outlet_id = 2 WHERE id IN (4, 5);
UPDATE transactions SET outlet_id = 3 WHERE id IN (6, 7);

-- Create index for better performance
CREATE INDEX idx_outlets_manager ON outlets(manager_id);
CREATE INDEX idx_transactions_outlet ON transactions(outlet_id);
CREATE INDEX idx_expenses_outlet ON expenses(outlet_id);

SELECT 'Outlet tables and data added successfully!' AS status;