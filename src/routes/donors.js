const express = require('express');
const router = express.Router();
const {
  getAllDonors,
  getDonorById,
  updateDonorProfile,
  getAvailableDonors,
  getDonorMatches
} = require('../controllers/donorController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Donor routes
router.get('/', authenticateToken, getAllDonors);
router.get('/available', authenticateToken, getAvailableDonors);
router.get('/matches', authenticateToken, getDonorMatches);
router.get('/:id', authenticateToken, getDonorById);
router.put('/profile', authenticateToken, authorizeRoles('donor'), updateDonorProfile);

module.exports = router;
