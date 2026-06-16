const express = require('express');
const Outlet = require('../models-mysql/Outlet');
const Investor = require('../models-mysql/Investor');
const { auth, adminAuth } = require('../middleware/auth');
const { investorAuth, filterInvestorOutlets } = require('../middleware/investorAuth');

const router = express.Router();

// Get all outlets - dengan filter untuk investor
router.get('/', auth, filterInvestorOutlets, async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    
    let outlets;
    
    if (req.user.role === 'investor') {
      // Investor hanya bisa lihat outlet mereka sendiri
      const investorOutlets = req.investorOutlets;
      const outletIds = investorOutlets.map(outlet => outlet.id);
      
      if (outletIds.length === 0) {
        return res.json([]);
      }
      
      // Get statistics untuk outlet investor
      outlets = await Promise.all(
        outletIds.map(async (outletId) => {
          return await Outlet.getStats(outletId, period);
        })
      );
      
      // Filter out null results
      outlets = outlets.filter(outlet => outlet !== null);
      
    } else {
      // Admin bisa lihat semua outlets
      outlets = await Outlet.getAllWithStats(period);
    }
    
    res.json(outlets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single outlet - dengan investor authorization
router.get('/:id', auth, investorAuth, async (req, res) => {
  try {
    const outlet = await Outlet.findById(req.params.id);
    if (!outlet) {
      return res.status(404).json({ message: 'Outlet not found' });
    }
    
    // Jika investor, tambahkan investment details
    if (req.user.role === 'investor') {
      const investorOutlets = await Investor.getInvestorOutlets(req.user.id);
      const investment = investorOutlets.find(o => o.id == req.params.id);
      
      if (investment) {
        outlet.investment_amount = investment.investment_amount;
        outlet.ownership_percentage = investment.ownership_percentage;
      }
    }
    
    res.json(outlet);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get outlet statistics - dengan investor authorization
router.get('/:id/stats', auth, investorAuth, async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    
    const stats = await Outlet.getStats(req.params.id, period);
    if (!stats) {
      return res.status(404).json({ message: 'Outlet not found' });
    }
    
    // Jika investor, tambahkan investment share calculation
    if (req.user.role === 'investor') {
      const investorOutlets = await Investor.getInvestorOutlets(req.user.id);
      const investment = investorOutlets.find(o => o.id == req.params.id);
      
      if (investment) {
        stats.investment_amount = investment.investment_amount;
        stats.ownership_percentage = investment.ownership_percentage;
        stats.personal_share = stats.investor_share * (investment.ownership_percentage / stats.investor_percentage);
      }
    }
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Routes untuk admin only (tetap sama)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const outlet = await Outlet.create(req.body);
    res.status(201).json(outlet);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const outlet = await Outlet.update(req.params.id, req.body);
    if (!outlet) {
      return res.status(404).json({ message: 'Outlet not found' });
    }
    res.json(outlet);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    await Outlet.delete(req.params.id);
    res.json({ message: 'Outlet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Financial report - dengan investor authorization
router.get('/:id/financial-report', auth, investorAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const report = await Outlet.getFinancialReport(req.params.id, startDate, endDate);
    if (!report) {
      return res.status(404).json({ message: 'Outlet not found or no data for the period' });
    }
    
    // Jika investor, tambahkan investment share calculation
    if (req.user.role === 'investor') {
      const investorOutlets = await Investor.getInvestorOutlets(req.user.id);
      const investment = investorOutlets.find(o => o.id == req.params.id);
      
      if (investment) {
        report.investment_amount = investment.investment_amount;
        report.ownership_percentage = investment.ownership_percentage;
        report.personal_share = report.investor_share * (investment.ownership_percentage / report.investor_percentage);
      }
    }
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get investor's personal dashboard
router.get('/investor/dashboard', auth, async (req, res) => {
  try {
    if (req.user.role !== 'investor') {
      return res.status(403).json({ message: 'Access denied. Investor only.' });
    }
    
    const dashboardData = await Investor.getInvestorFinancialReport(req.user.id);
    const totalInvestment = await Investor.getTotalInvestment(req.user.id);
    
    res.json({
      investor: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
      },
      total_investment: totalInvestment.total_investment,
      total_outlets: totalInvestment.total_outlets,
      outlets: dashboardData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;