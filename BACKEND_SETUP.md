# 🚀 Setup Backend Laundry Management System

## Prerequisites
- Node.js 16+ terinstall
- MongoDB terinstall (local atau MongoDB Atlas)
- Git terinstall

## 🛠️ Step-by-Step Setup

### 1. Install MongoDB
**Option A: MongoDB Local**
- Download dari https://www.mongodb.com/try/download/community
- Install dan start MongoDB service

**Option B: MongoDB Atlas (Cloud)**
- Buat account di https://www.mongodb.com/atlas
- Buat cluster gratis
- Dapatkan connection string

### 2. Setup Backend
```bash
# Masuk ke folder backend
cd ProjectUMKMLoundryMSN/server

# Install dependencies
npm install

# Buat file environment
cp env.example .env

# Edit file .env dengan text editor favorit Anda
# Isi dengan konfigurasi yang sesuai:
MONGODB_URI=mongodb://localhost:27017/laundry_db
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Seed Database (Optional)
```bash
npm run seed
```

**Default Login setelah seeding:**
- 🔐 **Admin**: admin@laundry.com / admin123
- 💰 **Kasir**: kasir@laundry.com / cashier123

### 4. Start Backend Server
```bash
# Development mode dengan auto-reload
npm run dev

# Production mode
npm start
```

Server akan berjalan di: http://localhost:5000

### 5. Test API Connection
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@laundry.com","password":"admin123"}'
```

## 📊 API Endpoints Available

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register user baru
- `GET /api/auth/me` - Get current user info

### Customers Management
- `GET /api/customers` - Get semua customers
- `POST /api/customers` - Create customer baru
- `GET /api/customers/stats/overview` - Customer statistics

### Transactions
- `GET /api/transactions` - Get semua transactions
- `POST /api/transactions` - Create transaction baru
- `GET /api/transactions/stats/dashboard` - Dashboard statistics

### Services
- `GET /api/services` - Get laundry services
- `POST /api/services` - Create service baru

### Inventory
- `GET /api/items` - Get inventory items
- `PATCH /api/items/:id/stock` - Update stock level

### Expenses
- `GET /api/expenses` - Get operational expenses
- `POST /api/expenses` - Create expense record

## 🔧 Troubleshooting

### MongoDB Connection Error
```bash
# Pastikan MongoDB service running
sudo systemctl start mongod  # Linux
brew services start mongodb/brew/mongodb-community  # Mac
# atau start dari MongoDB Compass
```

### Port Already in Use
```bash
# Cari process yang menggunakan port 5000
lsof -ti:5000
# Kill process
kill -9 $(lsof -ti:5000)
```

### Module Not Found
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Production Deployment

### 1. Environment Variables untuk Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://your-atlas-connection-string
JWT_SECRET=very-strong-secret-key-here
PORT=5000
FRONTEND_URL=https://your-domain.com
```

### 2. Start Production Server
```bash
npm start
```

### 3. Using PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start application dengan PM2
pm2 start server.js --name laundry-backend

# Save process list
pm2 save

# Setup startup script
pm2 startup
```

## 📦 Database Structure

### Collections:
- **users** - Admin, cashier, manager accounts
- **customers** - Customer data dengan membership
- **services** - Laundry services & pricing
- **transactions** - Order & payment records
- **items** - Inventory management
- **expenses** - Operational expenses

## 🔐 Security Features
- JWT Authentication
- Password hashing dengan bcrypt
- Rate limiting (100 requests/15min)
- CORS protection
- Helmet security headers

## 📈 Monitoring
- Health check endpoint: `/api/health`
- Request logging dengan Morgan
- Error handling dengan proper responses

## 🤝 Frontend Integration

Frontend React sudah dikonfigurasi untuk connect ke:
- Development: http://localhost:5000/api
- Production: Sesuai environment variable `REACT_APP_API_URL`

**Pastikan backend running sebelum start frontend!**

## 🆘 Need Help?

1. Check console untuk error messages
2. Pastikan MongoDB connected
3. Verify environment variables
4. Check port availability
5. Lihat documentation di `server/README.md`

## ✅ Completion Checklist
- [ ] MongoDB installed & running
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Database seeded (optional)
- [ ] Backend server running on port 5000
- [ ] Test API connection successful
- [ ] Frontend can connect to backend

Backend siap digunakan! 🎉