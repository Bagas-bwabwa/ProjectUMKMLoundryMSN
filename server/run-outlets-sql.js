const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');

async function runOutletSQL() {
  try {
    console.log('📊 Adding outlet tables to database...');

    // MySQL connection config
    const connection = mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'laundry_db',
      port: process.env.MYSQL_PORT || 3306,
      multipleStatements: true
    });

    // Read SQL file
    const sqlFilePath = path.join(__dirname, 'add-outlets-tables.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

    // Execute SQL script
    connection.query(sqlScript, (error, results) => {
      if (error) {
        console.error('❌ Error adding outlet tables:', error.message);
        process.exit(1);
      } else {
        console.log('✅ Outlet tables added successfully!');
        console.log('📋 Tables created: outlets');
        console.log('📊 Columns added to: transactions, expenses');
        console.log('👤 Sample outlets inserted: 3 outlets');
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
  runOutletSQL();
}

module.exports = runOutletSQL;