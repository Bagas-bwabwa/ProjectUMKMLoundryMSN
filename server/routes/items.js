const express = require('express');
const Item = require('../models/Item');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all items
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, lowStock } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (lowStock === 'true') {
      filter.$expr = { $lte: ['$stock', '$minStock'] };
    }

    const items = await Item.find(filter)
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Item.countDocuments(filter);

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single item
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new item
router.post('/', auth, async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Item name already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update item
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Item name already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update item stock
router.patch('/:id/stock', auth, async (req, res) => {
  try {
    const { operation, quantity, notes } = req.body;
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (operation === 'add') {
      item.stock += quantity;
    } else if (operation === 'subtract') {
      if (item.stock < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      item.stock -= quantity;
    } else {
      return res.status(400).json({ message: 'Invalid operation' });
    }

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get inventory statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const stats = await Item.aggregate([
      {
        $group: {
          _id: '$category',
          totalItems: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          totalValue: { $sum: { $multiply: ['$stock', '$price'] } },
          lowStockItems: {
            $sum: {
              $cond: [{ $lte: ['$stock', '$minStock'] }, 1, 0]
            }
          }
        }
      }
    ]);

    const totalInventoryValue = await Item.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ['$stock', '$price'] } } } }
    ]);

    const lowStockItems = await Item.find({
      $expr: { $lte: ['$stock', '$minStock'] }
    }).select('name category stock minStock');

    res.json({
      categoryStats: stats,
      totalValue: totalInventoryValue[0]?.total || 0,
      lowStockItems
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;