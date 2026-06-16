const mysql = require('mysql2');

async function setupDatabase() {
  try {
    console.log('🏗️  Creating database structure...');

    const connection = mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      port: process.env.MYSQL_PORT || 3306,
      multipleStatements: true
    });

    // SQL script dengan syntax yang lebih sederhana
    const sqlScript = `
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Services table
      CREATE TABLE IF NOT EXISTS services (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        price_per_kg DECIMAL(10,2) NOT NULL,
        estimated_time INT DEFAULT 24,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Insert sample data
      INSERT IGNORE INTO users (name, email, password, role, phone) VALUES
      ('Admin Laundry', 'admin@laundry.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '081234567890'),
      ('Kasir Laundry', 'kasir@laundry.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'cashier', '081298765432');

      INSERT IGNORE INTO services (name, description, price_per_kg, estimated_time) VALUES
      ('Cuci Kering', 'Cuci biasa tanpa setrika', 7000.00, 24),
      ('Cuci Setrika', 'Cuci dan setrika', 8000.00, 24);

      INSERT IGNORE INTO outlets (name, address, phone, manager_id, investor_percentage, operational_cost) VALUES
      ('Outlet Pusat', 'Jl. Sudirman No. 123', '08123456789', 1, 30.00, 5000000.00),
      ('Outlet Cabang Meruya', 'Jl. Meruya Ilir No. 45', '08129876543', 2, 25.00, 3000000.00);

      SELECT '✅ Database setup completed successfully!' AS status;
    `;

    connection.query(sqlScript, (error, results) => {
      if (error) {
        console.error('❌ Database setup failed:', error.message);
        process.exit(1);
      } else {
        console.log('🎉 Database structure created!');
        console.log('📋 Tables: users, services, outlets');
        console.log('👤 Sample data inserted');
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
  setupDatabase();
}

module.exports = setupDatabase;