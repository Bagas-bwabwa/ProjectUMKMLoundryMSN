const express = require('express');
const Transaction = require('../models/Transaction');
const Customer = require('../models/Customer');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all transactions
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, paymentStatus } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const transactions = await Transaction.find(filter)
      .populate('customer', 'name phone membership')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single transaction
router.get('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('customer', 'name phone address membership')
      .populate('services.service', 'name pricePerKg')
      .populate('createdBy', 'name');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new transaction
router.post('/', auth, async (req, res) => {
  try {
    const transactionData = {
      ...req.body,
      createdBy: req.user.id
    };

    const transaction = new Transaction(transactionData);
    await transaction.save();

    // Update customer stats
    await Customer.findByIdAndUpdate(req.body.customer, {
      $inc: { totalTransactions: 1, totalSpent: transaction.finalAmount },
      lastVisit: new Date()
    });

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('customer', 'name phone membership')
      .populate('services.service', 'name pricePerKg')
      .populate('createdBy', 'name');

    res.status(201).json(populatedTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('customer', 'name phone membership');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update customer stats
    await Customer.findByIdAndUpdate(transaction.customer, {
      $inc: { totalTransactions: -1, totalSpent: -transaction.finalAmount }
    });

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get transaction statistics
router.get('/stats/dashboard', auth, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [dailyStats, weeklyStats, monthlyStats, totalStats] = await Promise.all([
      Transaction.aggregate([
        { $match: { createdAt: { $gte: startOfDay } } },
        { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$finalAmount' } } }
      ]),
      Transaction.aggregate([
        { $match: { createdAt: { $gte: startOfWeek } } },
        { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$finalAmount' } } }
      ]),
      Transaction.aggregate([
        { $match: { createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$finalAmount' } } }
      ]),
      Transaction.aggregate([
        { $group: { _id: null, totalCount: { $sum: 1 }, totalRevenue: { $sum: '$finalAmount' } } }
      ])
    ]);

    res.json({
      daily: {
        transactions: dailyStats[0]?.count || 0,
        revenue: dailyStats[0]?.revenue || 0
      },
      weekly: {
        transactions: weeklyStats[0]?.count || 0,
        revenue: weeklyStats[0]?.revenue || 0
      },
      monthly: {
        transactions: monthlyStats[0]?.count || 0,
        revenue: monthlyStats[0]?.revenue || 0
      },
      total: {
        transactions: totalStats[0]?.totalCount || 0,
        revenue: totalStats[0]?.totalRevenue || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;