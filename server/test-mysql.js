require('dotenv').config();
const { testConnection } = require('./config/mysql');

async function testMySQLConnection() {
  try {
    console.log('🧪 Testing MySQL connection...');
    
    const connected = await testConnection();
    if (connected) {
      console.log('✅ MySQL connection test: PASSED');
      console.log('📊 Connection details:');
      console.log(`   Host: ${process.env.MYSQL_HOST || 'localhost'}`);
      console.log(`   Database: ${process.env.MYSQL_DATABASE || 'laundry_db'}`);
      console.log(`   User: ${process.env.MYSQL_USER || 'root'}`);
    } else {
      console.log('❌ MySQL connection test: FAILED');
    }
  } catch (error) {
    console.error('❌ Connection test error:', error.message);
    
    // Troubleshooting tips
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Pastikan MySQL server running');
    console.log('2. Check username/password di .env file');
    console.log('3. Pastikan database "laundry_db" exists');
    console.log('4. Untuk MySQL 8.0, mungkin perlu:');
    console.log('   ALTER USER \'root\'@\'localhost\' IDENTIFIED WITH mysql_native_password BY \'password\';');
  }
}

// Run if called directly
if (require.main === module) {
  testMySQLConnection()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = testMySQLConnection;