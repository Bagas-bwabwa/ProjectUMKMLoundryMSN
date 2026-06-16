const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function setupMySQLDatabase() {
  try {
    console.log('🚀 Setting up MySQL database for Laundry Management System...');

    // MySQL connection config
    const connectionConfig = {
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      port: process.env.MYSQL_PORT || 3306,
      multipleStatements: true
    };

    // Create connection
    const connection = await mysql.createConnection(connectionConfig);
    console.log('✅ Connected to MySQL server');

    // Read SQL setup file
    const sqlFilePath = path.join(__dirname, 'mysql-simple-setup.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

    // Execute SQL script
    console.log('📊 Executing database setup script...');
    await connection.execute(sqlScript);
    
    console.log('✅ Database setup completed successfully!');
    console.log('📋 Database: laundry_db');
    console.log('📊 Tables created: users, customers, services');
    console.log('👤 Sample users:');
    console.log('   - Admin: admin@laundry.com / password');
    console.log('   - Cashier: kasir@laundry.com / password');

    await connection.end();
    console.log('\n🎉 MySQL setup completed! You can now start the server.');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Tips:');
      console.log('1. Check your MySQL username and password');
      console.log('2. Make sure MySQL server is running');
      console.log('3. For MySQL 8.0, you might need to:');
      console.log('   ALTER USER \'root\'@\'localhost\' IDENTIFIED WITH mysql_native_password BY \'your_password\';');
    }
    
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  setupMySQLDatabase();
}

module.exports = setupMySQLDatabase;