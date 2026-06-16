const bcrypt = require('bcryptjs');
const { query } = require('../config/mysql');

async function seedData() {
  try {
    console.log('🌱 Seeding MySQL database with sample data...');

    // Clear existing data (optional - careful in production)
    console.log('🧹 Clearing existing data...');
    await query('SET FOREIGN_KEY_CHECKS = 0');
    
    const tables = ['users', 'customers', 'services', 'items', 'transactions', 'transaction_services', 'expenses'];
    
    for (const table of tables) {
      await query(`DELETE FROM ${table}`);
      await query(`ALTER TABLE ${table} AUTO_INCREMENT = 1`);
    }
    
    await query('SET FOREIGN_KEY_CHECKS = 1');

    // 1. Create users
    console.log('👤 Creating users...');
    const hashedPassword = await bcrypt.hash('password', 10);
    
    const users = [
      {
        name: 'Admin Laundry',
        email: 'admin@laundry.com',
        password: hashedPassword,
        role: 'admin',
        phone: '081234567890'
      },
      {
        name: 'Kasir Laundry', 
        email: 'kasir@laundry.com',
        password: hashedPassword,
        role: 'cashier',
        phone: '081298765432'
      }
    ];

    for (const user of users) {
      await query(
        'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
        [user.name, user.email, user.password, user.role, user.phone]
      );
    }

    // 2. Create sample customers
    console.log('👥 Creating customers...');
    const customers = [
      { name: 'Budi Santoso', phone: '081234560001', address: 'Jl. Sudirman No. 123', membership: 'Gold' },
      { name: 'Siti Aisyah', phone: '081234560002', address: 'Jl. Gatot Subroto No. 45', membership: 'Silver' },
      { name: 'Andi Saputra', phone: '081234560003', address: 'Jl. Thamrin No. 67', membership: 'Regular' },
      { name: 'Rina Putri', phone: '081234560004', address: 'Jl. Merdeka No. 89', membership: 'Gold' },
      { name: 'Dedi Kurniawan', phone: '081234560005', address: 'Jl. Asia Afrika No. 10', membership: 'Regular' }
    ];

    for (const customer of customers) {
      await query(
        'INSERT INTO customers (name, phone, address, membership) VALUES (?, ?, ?, ?)',
        [customer.name, customer.phone, customer.address, customer.membership]
      );
    }

    // 3. Create laundry services
    console.log('🧺 Creating services...');
    const services = [
      { name: 'Cuci Kering', description: 'Cuci biasa tanpa setrika', price_per_kg: 7000.00, estimated_time: 24, category: 'Regular' },
      { name: 'Cuci Setrika', description: 'Cuci dan setrika', price_per_kg: 8000.00, estimated_time: 24, category: 'Regular' },
      { name: 'Setrika Saja', description: 'Hanya setrika', price_per_kg: 5000.00, estimated_time: 12, category: 'Regular' },
      { name: 'Express', description: 'Layanan cepat 6 jam', price_per_kg: 15000.00, estimated_time: 6, category: 'Express' },
      { name: 'Premium', description: 'Layanan premium dengan pewangi khusus', price_per_kg: 12000.00, estimated_time: 24, category: 'Premium' }
    ];

    for (const service of services) {
      await query(
        'INSERT INTO services (name, description, price_per_kg, estimated_time, category) VALUES (?, ?, ?, ?, ?)',
        [service.name, service.description, service.price_per_kg, service.estimated_time, service.category]
      );
    }

    // 4. Create inventory items
    console.log('📦 Creating inventory items...');
    const items = [
      { name: 'Detergent Bubuk', category: 'Detergent', unit: 'kg', stock: 50.00, min_stock: 10.00, price: 20000.00, supplier: 'Supplier A' },
      { name: 'Pelembut Pakaian', category: 'Fabric Softener', unit: 'liter', stock: 30.00, min_stock: 5.00, price: 25000.00, supplier: 'Supplier B' },
      { name: 'Pemutih', category: 'Bleach', unit: 'liter', stock: 20.00, min_stock: 3.00, price: 18000.00, supplier: 'Supplier C' },
      { name: 'Plastik Packaging', category: 'Packaging', unit: 'pack', stock: 100.00, min_stock: 20.00, price: 15000.00, supplier: 'Supplier D' },
      { name: 'Hanger', category: 'Other', unit: 'pcs', stock: 200.00, min_stock: 50.00, price: 5000.00, supplier: 'Supplier E' }
    ];

    for (const item of items) {
      await query(
        'INSERT INTO items (name, category, unit, stock, min_stock, price, supplier) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [item.name, item.category, item.unit, item.stock, item.min_stock, item.price, item.supplier]
      );
    }

    console.log('✅ Database seeded successfully!');
    console.log('\n📧 Login credentials:');
    console.log('   Admin: admin@laundry.com / password');
    console.log('   Cashier: kasir@laundry.com / password');
    console.log('\n💡 Please change the passwords after first login!');

  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  require('dotenv').config();
  
  // Test database connection first
  const { testConnection } = require('../config/mysql');
  
  testConnection()
    .then(connected => {
      if (connected) {
        return seedData();
      } else {
        console.error('❌ Cannot seed data: MySQL connection failed');
        process.exit(1);
      }
    })
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedData;