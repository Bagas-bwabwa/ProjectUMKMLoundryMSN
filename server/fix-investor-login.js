const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

async function fixInvestorLogin() {
  try {
    console.log('🔧 Fixing investor login issues...');

    const connection = mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'laundry_db',
      port: process.env.MYSQL_PORT || 3306
    });

    // Hash password yang benar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password', salt);

    // Update password untuk semua investor
    const updateSql = `
      UPDATE users 
      SET password = ?, role = 'investor'
      WHERE email IN ('budi@investor.com', 'sari@investor.com', 'rina@investor.com')
    `;

    connection.query(updateSql, [hashedPassword], (error, results) => {
      if (error) {
        console.error('❌ Error fixing investor login:', error.message);
        process.exit(1);
      } else {
        console.log('✅ Investor passwords updated successfully!');
        console.log('📋 Updated accounts:');
        console.log('   - budi@investor.com / password');
        console.log('   - sari@investor.com / password');
        console.log('   - rina@investor.com / password');
        console.log('\n🔐 Password: "password" (without quotes)');
        
        // Verify the fixes
        const verifySql = `
          SELECT email, role, password 
          FROM users 
          WHERE role = 'investor'
        `;
        
        connection.query(verifySql, (error, users) => {
          if (error) {
            console.error('❌ Error verifying fixes:', error.message);
          } else {
            console.log('\n👥 Verified investor accounts:');
            users.forEach(user => {
              console.log(`   - ${user.email} (${user.role})`);
            });
          }
          connection.end();
          process.exit(0);
        });
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
  fixInvestorLogin();
}

module.exports = fixInvestorLogin;