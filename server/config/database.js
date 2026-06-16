const { testConnection } = require('./mysql');

const connectDB = async () => {
  try {
    console.log('🔗 Connecting to MySQL database...');
    
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