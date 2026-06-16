const express = require('express');
const Service = require('../models/Service');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all services
router.get('/', auth, async (req, res) => {
  try {
    const services = await Service.find({ active: true }).sort({ name: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single service
router.get('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new service
router.post('/', auth, async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Service name already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update service
router.put('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Service name already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete service (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json({ message: 'Service deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get service statistics
router.get('/stats/popular', auth, async (req, res) => {
  try {
    // This would typically require transaction data aggregation
    // For now, return basic service stats
    const serviceStats = await Service.aggregate([
      { $match: { active: true } },
      { $group: { 
        _id: '$category', 
        count: { $sum: 1 },
        avgPrice: { $avg: '$pricePerKg' }
      }}
    ]);

    res.json(serviceStats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;