const express = require('express');
const router = express.Router();
const {
  createDonation,
  getAllDonations,
  getDonationById,
  updateDonation,
  getDonorDonations,
  completeDonation
} = require('../controllers/donationController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Donation routes
router.post('/', authenticateToken, authorizeRoles('donor'), createDonation);
router.get('/', authenticateToken, getAllDonations);
router.get('/my-donations', authenticateToken, authorizeRoles('donor'), getDonorDonations);
router.get('/:id', authenticateToken, getDonationById);
router.put('/:id', authenticateToken, authorizeRoles('hospital'), updateDonation);
router.put('/:id/complete', authenticateToken, authorizeRoles('hospital'), completeDonation);

module.exports = router;
