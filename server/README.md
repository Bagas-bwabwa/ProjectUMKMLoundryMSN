# Laundry Management System - Backend API

Backend server untuk sistem manajemen laundry Qucuci menggunakan Node.js, Express, dan MongoDB.

## 🛠️ Tech Stack
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM untuk MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📦 Installation

1. **Install dependencies:**
```bash
cd server
npm install
```

2. **Setup environment variables:**
```bash
cp env.example .env
# Edit .env file dengan konfigurasi yang sesuai
```

3. **Setup MongoDB:**
- Install MongoDB locally atau gunakan MongoDB Atlas
- Update `MONGODB_URI` di file `.env`

4. **Seed database (optional):**
```bash
npm run seed
```

5. **Start development server:**
```bash
npm run dev
```

Server akan berjalan di http://localhost:5000

## 🗃️ Database Models

### 1. User
- Admin, cashier, manager roles
- Authentication system

### 2. Customer
- Customer data dengan membership tiers
- Transaction history tracking

### 3. Service
- Laundry services dengan pricing
- Categories: Regular, Express, Premium

### 4. Transaction
- Order management system
- Payment status tracking
- Automatic transaction numbering

### 5. Item
- Inventory management
- Stock tracking dengan alerts

### 6. Expense
- Operational expense tracking
- Financial reporting

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `GET /api/customers/stats/overview` - Customer statistics

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create service

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/stats/dashboard` - Transaction statistics

### Items
- `GET /api/items` - Get inventory items
- `POST /api/items` - Create item
- `PATCH /api/items/:id/stock` - Update stock

### Expenses
- `GET /api/expenses` - Get expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses/stats/overview` - Expense statistics

## 🔐 Authentication

Semua endpoints (kecuali auth) membutuhkan JWT token di header:
```
Authorization: Bearer <your-token>
```

## 📊 Database Seeding

Jalankan `npm run seed` untuk mengisi database dengan sample data:
- **Admin user**: admin@laundry.com / admin123
- **Cashier user**: kasir@laundry.com / cashier123
- **Sample customers** dengan membership tiers
- **Laundry services** dengan pricing
- **Inventory items**

## 🚀 Production Deployment

1. **Set environment variables:**
```bash
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-secure-jwt-secret
```

2. **Start production server:**
```bash
npm start
```

## 📝 Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/laundry_db
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 🤝 API Response Format

### Success Response
```json
{
  "data": {},
  "message": "Success message"
}
```

### Error Response
```json
{
  "message": "Error message",
  "error": "Error details (development only)"
}
```

## 🔍 API Usage Examples

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@laundry.com","password":"admin123"}'
```

### Create Transaction
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "customer": "customer_id",
    "services": [{
      "service": "service_id",
      "weight": 5,
      "price": 7000
    }],
    "totalWeight": 5,
    "totalAmount": 35000
  }'
```

## 📈 Monitoring

- Health check: `GET /api/health`
- Logging dengan Morgan
- Rate limiting (100 requests/15 minutes)
- Security headers dengan Helmet

## 🆘 Troubleshooting

1. **MongoDB connection error**: Pastikan MongoDB running
2. **JWT errors**: Check JWT_SECRET environment variable
3. **CORS errors**: Update FRONTEND_URL di environment variables

## 📄 License

MIT License - lihat file LICENSE untuk detail lengkap.