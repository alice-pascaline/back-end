const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./auth');
const donorRoutes = require('./donors');
const hospitalRoutes = require('./hospitals');
const bloodRequestRoutes = require('./bloodRequests');
const donationRoutes = require('./donations');
const notificationRoutes = require('./notifications');
const matchRoutes = require('./matches');
const adminRoutes = require('./admin');

// Use routes
router.use('/auth', authRoutes);
router.use('/donors', donorRoutes);
router.use('/hospitals', hospitalRoutes);
router.use('/blood-requests', bloodRequestRoutes);
router.use('/donations', donationRoutes);
router.use('/notifications', notificationRoutes);
router.use('/matches', matchRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
