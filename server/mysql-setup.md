# 🗃️ MySQL Database Setup untuk Laundry Management System

## Prerequisites
- MySQL Server 5.7+ atau MySQL 8.0+
- Node.js 16+
- MySQL client (phpMyAdmin, MySQL Workbench, atau command line)

## 📋 Langkah Setup

### 1. Install MySQL
**Windows:**
- Download dari https://dev.mysql.com/downloads/mysql/
- Install MySQL Server
- Set password untuk root user

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

**Mac:**
```bash
brew install mysql
brew services start mysql
```

### 2. Create Database
```bash
# Login ke MySQL
mysql -u root -p

# Jalankan setup script
source server/mysql-setup.sql
```

**Atau menggunakan PHPMyAdmin:**
- Buat database baru: `laundry_db`
- Import file `mysql-setup.sql`

### 3. Install MySQL Dependencies
```bash
cd server
npm install mysql2 bcryptjs
```

### 4. Update Environment Variables
Edit file `.env` di folder server:
```env
# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=laundry_db
MYSQL_PORT=3306

# JWT Configuration (tetap sama)
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 5. Update Database Configuration
Edit file `server/config/database.js`:
```javascript
// Ganti dari MongoDB ke MySQL
const { testConnection } = require('./mysql');

const connectDB = async () => {
  try {
    const connected = await testConnection();
    if (connected) {
      console.log('✅ MySQL Connected successfully');
    } else {
      console.error('❌ MySQL Connection failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 6. Update Models
Ganti import dari MongoDB models ke MySQL models di routes:

**Contoh di auth.js:**
```javascript
// Ganti ini:
const User = require('../models/User');

// Menjadi ini:
const User = require('../models-mysql/User');
```

### 7. Test Connection
```bash
cd server
npm run dev
```

## 🔄 Changes Required

### File yang Perlu Diupdate:
1. **`server/config/database.js`** - Ganti ke MySQL connection
2. **Semua route files** - Update model imports
3. **`server/package.json`** - Tambah dependency `mysql2`

### Model Imports Update:
- `../models/User` → `../models-mysql/User`
- `../models/Customer` → `../models-mysql/Customer` 
- `../models/Transaction` → `../models-mysql/Transaction`
- Dan seterusnya...

## 📊 Database Structure

### Tables Created:
1. **users** - User accounts & authentication
2. **customers** - Customer data dengan membership
3. **services** - Laundry services & pricing
4. **items** - Inventory management
5. **transactions** - Order transactions
6. **transaction_services** - Transaction details
7. **expenses** - Operational expenses

### Sample Data:
- **Admin user**: admin@laundry.com / password
- **Cashier user**: kasir@laundry.com / password  
- **Sample services**: Cuci Kering, Cuci Setrika, etc.
- **Sample items**: Detergent, Fabric Softener, etc.

## 🐛 Troubleshooting

### Common Issues:
1. **MySQL Connection refused**
   - Pastikan MySQL service running
   - Check username/password
   - Verify database exists

2. **Authentication failed**
   - MySQL 8.0 mungkin perlu authentication plugin update
   - Jalankan: `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';`

3. **Access denied**
   - Grant privileges: `GRANT ALL PRIVILEGES ON laundry_db.* TO 'root'@'localhost';`

### Test Connection Manual:
```javascript
// test-mysql.js
const { testConnection } = require('./config/mysql');

testConnection().then(console.log).catch(console.error);
```

## 🚀 Production Notes

### Environment Variables Production:
```env
MYSQL_HOST=your-production-mysql-host
MYSQL_USER=your-production-user
MYSQL_PASSWORD=your-production-password
MYSQL_DATABASE=laundry_db_production
```

### Security Recommendations:
- Gunakan user khusus (bukan root) untuk production
- Setup proper MySQL user privileges
- Enable SSL connections untuk production
- Regular database backups

## ✅ Completion Checklist
- [ ] MySQL Server installed
- [ ] Database created dan tables setup
- [ ] Environment variables configured
- [ ] MySQL dependencies installed
- [ ] Database config updated
- [ ] Model imports updated
- [ ] Connection test successful
- [ ] Sample data inserted

**MySQL conversion completed!** 🎉