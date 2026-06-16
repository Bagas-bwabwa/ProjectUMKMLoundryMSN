const User = require('./models-mysql/User');

async function testInvestorLogin() {
  try {
    console.log('🔐 Testing investor login...');
    
    // Test find investor by email
    const budi = await User.findByEmail('budi@investor.com');
    console.log('✅ Budi investor found:', budi ? 'YES' : 'NO');
    
    if (budi) {
      console.log('📋 Budi details:');
      console.log('   - Name:', budi.name);
      console.log('   - Email:', budi.email);
      console.log('   - Role:', budi.role);
      console.log('   - Phone:', budi.phone);
      
      // Test password verification
      const isPasswordCorrect = await User.verifyPassword('password', budi.password);
      console.log('🔑 Password test:', isPasswordCorrect ? 'CORRECT' : 'WRONG');
      
      if (isPasswordCorrect) {
        console.log('🎉 Login should work now!');
      } else {
        console.log('❌ Password still not matching');
      }
    }
    
    // Test other investors
    const sari = await User.findByEmail('sari@investor.com');
    const rina = await User.findByEmail('rina@investor.com');
    
    console.log('\n👥 All investor accounts verified:');
    console.log('   - Budi:', budi ? '✓' : '✗');
    console.log('   - Sari:', sari ? '✓' : '✗');
    console.log('   - Rina:', rina ? '✓' : '✗');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  require('dotenv').config();
  testInvestorLogin();
}

module.exports = testInvestorLogin;