const express = require('express');
const router = express.Router();
const {
  getDonorProfile,
  getAllDonors,
  getDonorById,
  updateDonorProfile,
  getAvailableDonors,
  getDonorMatches,
  createDonationFromMatch
} = require('../controllers/donorController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Donor routes
router.get('/', authenticateToken, getAllDonors);
router.get('/available', authenticateToken, getAvailableDonors);
router.get('/matches', authenticateToken, getDonorMatches);
router.get('/profile', authenticateToken, authorizeRoles('donor'), getDonorProfile);
router.get('/:id', authenticateToken, getDonorById);
router.put('/profile', authenticateToken, authorizeRoles('donor'), updateDonorProfile);
router.post('/donations', authenticateToken, authorizeRoles('donor'), createDonationFromMatch);

module.exports = router;
