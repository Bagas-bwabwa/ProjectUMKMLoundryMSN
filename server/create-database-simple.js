const mysql = require('mysql2');

async function createDatabase() {
  try {
    console.log('🔧 Creating database...');
    
    // Connection tanpa database specified
    const connection = mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      port: process.env.MYSQL_PORT || 3306,
      multipleStatements: true
    });

    return new Promise((resolve, reject) => {
      // Create database and tables
      const sql = `
        CREATE DATABASE IF NOT EXISTS laundry_db;
        USE laundry_db;
        
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
        
        INSERT IGNORE INTO users (name, email, password, role, phone) VALUES
        ('Admin Laundry', 'admin@laundry.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '081234567890'),
        ('Kasir Laundry', 'kasir@laundry.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'cashier', '081298765432');
        
        INSERT IGNORE INTO services (name, description, price_per_kg, estimated_time, category) VALUES
        ('Cuci Kering', 'Cuci biasa tanpa setrika', 7000.00, 24, 'Regular'),
        ('Cuci Setrika', 'Cuci dan setrika', 8000.00, 24, 'Regular');
      `;

      connection.query(sql, (error, results) => {
        if (error) {
          console.error('❌ Database setup failed:', error.message);
          reject(error);
        } else {
          console.log('✅ Database laundry_db created');
          console.log('✅ Tables created: users, services');
          console.log('✅ Sample data inserted');
          console.log('\n🎉 Database setup completed successfully!');
          resolve(results);
        }
        connection.end();
      });
    });
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  require('dotenv').config();
  createDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = createDatabase;