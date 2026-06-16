const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');

async function runInvestorSQL() {
  try {
    console.log('💰 Adding investor features to database...');

    const connection = mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'laundry_db',
      port: process.env.MYSQL_PORT || 3306,
      multipleStatements: true
    });

    // Read SQL file
    const sqlFilePath = path.join(__dirname, 'add-investor-features.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

    // Execute SQL script
    connection.query(sqlScript, (error, results) => {
      if (error) {
        console.error('❌ Error adding investor features:', error.message);
        process.exit(1);
      } else {
        console.log('✅ Investor features added successfully!');
        console.log('📋 Tables modified: users, investor_outlets (new)');
        console.log('👤 Sample investors created: 3 investor accounts');
        console.log('🏪 Investment links: Multiple outlet investments');
        console.log('\n🔐 Investor Login Credentials:');
        console.log('   Budi Investor: budi@investor.com / password');
        console.log('   Sari Investor: sari@investor.com / password');
        console.log('   Rina Investor: rina@investor.com / password');
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
  runInvestorSQL();
}

module.exports = runInvestorSQL;