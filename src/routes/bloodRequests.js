const express = require('express');
const router = express.Router();
const {
  createBloodRequest,
  getAllBloodRequests,
  getBloodRequestById,
  updateBloodRequest,
  deleteBloodRequest
} = require('../controllers/bloodRequestController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Blood request routes
router.post('/', authenticateToken, authorizeRoles('hospital'), createBloodRequest);
router.get('/', authenticateToken, getAllBloodRequests);
router.get('/:id', authenticateToken, getBloodRequestById);
router.put('/:id', authenticateToken, authorizeRoles('hospital', 'admin'), updateBloodRequest);
router.delete('/:id', authenticateToken, authorizeRoles('hospital', 'admin'), deleteBloodRequest);

module.exports = router;
