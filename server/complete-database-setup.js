const mysql = require('mysql2');

async function setupCompleteDatabase() {
  try {
    console.log('🏗️  Creating complete database structure...');

    const connection = mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      port: process.env.MYSQL_PORT || 3306,
      multipleStatements: true
    });

    const sqlScript = `
      -- Create database
      CREATE DATABASE IF NOT EXISTS laundry_db;
      USE laundry_db;

      -- Users table
      CREATE TABLE IF NOT EXISTS users (
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

      -- Customers table
      CREATE TABLE IF NOT EXISTS customers (
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

      -- Services table
      CREATE TABLE IF NOT EXISTS services (
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

      -- Outlets table
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

      -- Transactions table
      CREATE TABLE IF NOT EXISTS transactions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        outlet_id INT,
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
        FOREIGN KEY (created_by) REFERENCES users(id),
        FOREIGN KEY (outlet_id) REFERENCES outlets(id)
      );

      -- Transaction Services table
      CREATE TABLE IF NOT EXISTS transaction_services (
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

      -- Expenses table
      CREATE TABLE IF NOT EXISTS expenses (
        id INT PRIMARY KEY AUTO_INCREMENT,
        outlet_id INT,
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
        FOREIGN KEY (created_by) REFERENCES users(id),
        FOREIGN KEY (outlet_id) REFERENCES outlets(id)
      );

      -- Insert sample data
      INSERT IGNORE INTO users (name, email, password, role, phone) VALUES
      ('Admin Laundry', 'admin@laundry.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '081234567890'),
      ('Kasir Laundry', 'kasir@laundry.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'cashier', '081298765432');

      INSERT IGNORE INTO services (name, description, price_per_kg, estimated_time, category) VALUES
      ('Cuci Kering', 'Cuci biasa tanpa setrika', 7000.00, 24, 'Regular'),
      ('Cuci Setrika', 'Cuci dan setrika', 8000.00, 24, 'Regular'),
      ('Setrika Saja', 'Hanya setrika', 5000.00, 12, 'Regular');

      INSERT IGNORE INTO outlets (name, address, phone, manager_id, investor_percentage, operational_cost) VALUES
      ('Outlet Pusat', 'Jl. Sudirman No. 123', '08123456789', 1, 30.00, 5000000.00),
      ('Outlet Cabang Meruya', 'Jl. Meruya Ilir No. 45', '08129876543', 2, 25.00, 3000000.00),
      ('Outlet Cabang Kebayoran', 'Jl. Kebayoran Baru No. 67', '081311223344', 1, 35.00, 4000000.00);

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
      CREATE INDEX IF NOT EXISTS idx_transactions_number ON transactions(transaction_number);
      CREATE INDEX IF NOT EXISTS idx_transactions_outlet ON transactions(outlet_id);
      CREATE INDEX IF NOT EXISTS idx_expenses_outlet ON expenses(outlet_id);
      CREATE INDEX IF NOT EXISTS idx_outlets_manager ON outlets(manager_id);

      SELECT '✅ Complete database setup completed successfully!' AS status;
    `;

    connection.query(sqlScript, (error, results) => {
      if (error) {
        console.error('❌ Database setup failed:', error.message);
        process.exit(1);
      } else {
        console.log('🎉 Complete database structure created!');
        console.log('📋 Database: laundry_db');
        console.log('📊 Tables created: users, customers, services, outlets, transactions, transaction_services, expenses');
        console.log('👤 Sample data: 2 users, 3 services, 3 outlets');
        console.log('🔍 Indexes created for better performance');
        connection.end();
        process.exit(0);
      }
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  require('dotenv').config();
  setupCompleteDatabase();
}

module.exports = setupCompleteDatabase;