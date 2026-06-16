const mysql = require('mysql2/promise');

async function createDatabase() {
  try {
    console.log('🔧 Creating database...');
    
    // Connection tanpa database specified
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      port: process.env.MYSQL_PORT || 3306
    });

    // Create database
    await connection.execute('CREATE DATABASE IF NOT EXISTS laundry_db');
    console.log('✅ Database laundry_db created');

    // Use database
    await connection.execute('USE laundry_db');
    console.log('✅ Using database laundry_db');

    // Create tables
    console.log('📊 Creating tables...');
    
    // Users table
    await connection.execute(`
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
      )
    `);
    console.log('✅ Users table created');

    // Services table
    await connection.execute(`
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
      )
    `);
    console.log('✅ Services table created');

    // Insert sample data
    console.log('📝 Inserting sample data...');
    
    // Users
    await connection.execute(
      `INSERT INTO users (name, email, password, role, phone) 
       VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), role=VALUES(role), phone=VALUES(phone)`,
      [
        'Admin Laundry', 'admin@laundry.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '081234567890',
        'Kasir Laundry', 'kasir@laundry.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'cashier', '081298765432'
      ]
    );
    console.log('✅ Sample users inserted');

    // Services
    await connection.execute(
      `INSERT INTO services (name, description, price_per_kg, estimated_time, category) 
       VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE description=VALUES(description), price_per_kg=VALUES(price_per_kg)`,
      [
        'Cuci Kering', 'Cuci biasa tanpa setrika', 7000.00, 24, 'Regular',
        'Cuci Setrika', 'Cuci dan setrika', 8000.00, 24, 'Regular'
      ]
    );
    console.log('✅ Sample services inserted');

    await connection.end();
    console.log('\n🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  require('dotenv').config();
  createDatabase();
}

module.exports = createDatabase;