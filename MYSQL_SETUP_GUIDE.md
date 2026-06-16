# 🗃️ Panduan Setup MySQL untuk Laundry Management System

## 📋 Prerequisites
- MySQL Server 5.7+ atau 8.0+
- Node.js 16+
- Access ke MySQL server (username/password)

## 🚀 Langkah Setup Cepat

### 1. Install MySQL Server
**Windows:**
- Download dari [MySQL Website](https://dev.mysql.com/downloads/mysql/)
- Install dengan MySQL Installer
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

### 2. Setup Environment
```bash
# Masuk ke folder server
cd server

# Copy environment file
cp env.example .env

# Edit file .env dengan text editor
# Update MySQL configuration:
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=password_mysql_anda
MYSQL_DATABASE=laundry_db
MYSQL_PORT=3306
```

### 3. Install Dependencies
```bash
# Install mysql2 package
npm install mysql2

# atau install semua dependencies
npm install
```

### 4. Setup Database
```bash
# Method 1: Auto setup dengan script
npm run mysql-setup

# Method 2: Manual setup dengan MySQL client
mysql -u root -p < server/mysql-setup.sql

# Method 3: PHPMyAdmin
- Buat database 'laundry_db'
- Import file server/mysql-setup.sql
```

### 5. Seed Data (Optional)
```bash
npm run seed
```

### 6. Start Server
```bash
npm run dev
```

## 🔧 Konfigurasi MySQL

### File .env Configuration:
```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=laundry_db
MYSQL_PORT=3306
```

### MySQL User Setup (Jika perlu):
```sql
-- Buat user khusus untuk aplikasi
CREATE USER 'laundry_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON laundry_db.* TO 'laundry_user'@'localhost';
FLUSH PRIVILEGES;
```

## 🐛 Troubleshooting

### Error: Authentication Failed (MySQL 8.0)
```sql
-- MySQL 8.0 mungkin perlu plugin yang berbeda
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

### Error: Access Denied
```sql
-- Berikan privileges
GRANT ALL PRIVILEGES ON laundry_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Error: Connection Refused
- Pastikan MySQL service running
- Check firewall settings
- Verify port 3306 accessible

### Test Connection Manual:
```bash
# Test koneksi MySQL
mysql -u root -p -e "SHOW DATABASES;"

# Test dari Node.js
node -e "
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password'
});
connection.connect();
console.log('Connected to MySQL');
connection.end();
"
```

## 📊 Database Structure

### Tables Created:
1. **users** - User authentication & roles
2. **customers** - Customer data dengan membership
3. **services** - Laundry services & pricing
4. **items** - Inventory management
5. **transactions** - Order transactions
6. **transaction_services** - Transaction details
7. **expenses** - Operational expenses

### Sample Data:
- **Admin**: admin@laundry.com / password
- **Cashier**: kasir@laundry.com / password
- **5 sample customers** dengan membership tiers
- **5 laundry services** dengan harga
- **5 inventory items**

## 🔄 Migration dari MongoDB

### Changes yang Dibutuhkan:
1. **Package.json** - Hapus mongoose, tambah mysql2
2. **Database Config** - Ganti ke MySQL connection
3. **Models** - Gunakan models-mysql instead of Mongoose models
4. **Environment** - Update variables untuk MySQL

### File yang Diupdate:
- `server/config/database.js` - MySQL connection
- `server/package.json` - Dependencies
- Semua route files - Import models MySQL
- `.env` - MySQL configuration

## 🚀 Production Deployment

### MySQL Production Setup:
```env
MYSQL_HOST=your-production-db-host
MYSQL_USER=your-production-user
MYSQL_PASSWORD=your-production-password
MYSQL_DATABASE=laundry_db_production
```

### Security Recommendations:
- Jangan gunakan root user di production
- Gunakan strong passwords
- Enable SSL connections
- Regular database backups
- Use connection pooling

### Backup Database:
```bash
# Backup database
mysqldump -u root -p laundry_db > backup.sql

# Restore database
mysql -u root -p laundry_db < backup.sql
```

## ✅ Checklist Setup
- [ ] MySQL Server installed
- [ ] Database created (laundry_db)
- [ ] Tables created
- [ ] Environment variables configured
- [ ] MySQL dependencies installed
- [ ] Database connection tested
- [ ] Sample data seeded
- [ ] Server running without errors

## 📞 Support

Jika mengalami issues:
1. Check error messages di console
2. Pastikan MySQL service running
3. Verify username/password correct
4. Check database privileges
5. Lihat dokumentasi MySQL

**MySQL setup completed!** 🎉

Sistem laundry management sekarang menggunakan MySQL database yang robust dan familiar!