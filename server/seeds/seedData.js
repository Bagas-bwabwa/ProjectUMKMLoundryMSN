const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Customer = require('../models/Customer');
const Service = require('../models/Service');
const Item = require('../models/Item');

const connectDB = require('../config/database');

const seedData = async () => {
  try {
    await connectDB();

    console.log('🌱 Seeding database...');

    // Clear existing data
    await User.deleteMany({});
    await Customer.deleteMany({});
    await Service.deleteMany({});
    await Item.deleteMany({});

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Admin Laundry',
      email: 'admin@laundry.com',
      password: hashedPassword,
      role: 'admin',
      phone: '081234567890'
    });

    // Create cashier user
    const cashierPassword = await bcrypt.hash('cashier123', 10);
    await User.create({
      name: 'Kasir Laundry',
      email: 'kasir@laundry.com',
      password: cashierPassword,
      role: 'cashier',
      phone: '081298765432'
    });

    // Create sample customers
    const customers = [
      { name: 'Budi Santoso', phone: '081234560001', address: 'Jl. Sudirman No. 123', membership: 'Gold' },
      { name: 'Siti Aisyah', phone: '081234560002', address: 'Jl. Gatot Subroto No. 45', membership: 'Silver' },
      { name: 'Andi Saputra', phone: '081234560003', address: 'Jl. Thamrin No. 67', membership: 'Regular' },
      { name: 'Rina Putri', phone: '081234560004', address: 'Jl. Merdeka No. 89', membership: 'Gold' },
      { name: 'Dedi Kurniawan', phone: '081234560005', address: 'Jl. Asia Afrika No. 10', membership: 'Regular' }
    ];

    await Customer.insertMany(customers);

    // Create laundry services
    const services = [
      { name: 'Cuci Kering', description: 'Cuci biasa tanpa setrika', pricePerKg: 7000, estimatedTime: 24, category: 'Regular' },
      { name: 'Cuci Setrika', description: 'Cuci dan setrika', pricePerKg: 8000, estimatedTime: 24, category: 'Regular' },
      { name: 'Setrika Saja', description: 'Hanya setrika', pricePerKg: 5000, estimatedTime: 12, category: 'Regular' },
      { name: 'Express', description: 'Layanan cepat 6 jam', pricePerKg: 15000, estimatedTime: 6, category: 'Express' },
      { name: 'Premium', description: 'Layanan premium dengan pewangi khusus', pricePerKg: 12000, estimatedTime: 24, category: 'Premium' }
    ];

    await Service.insertMany(services);

    // Create inventory items
    const items = [
      { name: 'Detergent Bubuk', category: 'Detergent', unit: 'kg', stock: 50, minStock: 10, price: 20000, supplier: 'Supplier A' },
      { name: 'Pelembut Pakaian', category: 'Fabric Softener', unit: 'liter', stock: 30, minStock: 5, price: 25000, supplier: 'Supplier B' },
      { name: 'Pemutih', category: 'Bleach', unit: 'liter', stock: 20, minStock: 3, price: 18000, supplier: 'Supplier C' },
      { name: 'Plastik Packaging', category: 'Packaging', unit: 'pack', stock: 100, minStock: 20, price: 15000, supplier: 'Supplier D' },
      { name: 'Hanger', category: 'Other', unit: 'pcs', stock: 200, minStock: 50, price: 5000, supplier: 'Supplier E' }
    ];

    await Item.insertMany(items);

    console.log('✅ Database seeded successfully!');
    console.log('📧 Admin login: admin@laundry.com / admin123');
    console.log('📧 Cashier login: kasir@laundry.com / cashier123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;