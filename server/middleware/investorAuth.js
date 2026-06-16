const Investor = require('../models-mysql/Investor');

// Middleware untuk memastikan investor hanya bisa akses outlet mereka sendiri
const investorAuth = async (req, res, next) => {
  try {
    const userId = req.user.id; // Dari JWT token
    const userRole = req.user.role;
    
    // Jika admin, skip check
    if (userRole === 'admin') {
      return next();
    }
    
    // Jika investor, check outlet access
    if (userRole === 'investor') {
      const outletId = req.params.id || req.body.outlet_id;
      
      if (outletId) {
        const hasAccess = await Investor.hasAccessToOutlet(userId, outletId);
        if (!hasAccess) {
          return res.status(403).json({ 
            message: 'Access denied. You do not have investment in this outlet.' 
          });
        }
      }
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Middleware untuk filter data hanya outlet investor saja
const filterInvestorOutlets = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    if (userRole === 'investor') {
      // Simpan investor outlets di request untuk digunakan di controller
      req.investorOutlets = await Investor.getInvestorOutlets(userId);
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { investorAuth, filterInvestorOutlets };