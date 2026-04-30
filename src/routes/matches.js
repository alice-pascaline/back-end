const express = require('express');
const router = express.Router();
const {
  getAllMatches,
  getMatchById,
  acceptMatch,
  declineMatch,
  getMatchesForDonor,
  getMatchesForHospital
} = require('../controllers/matchController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Match routes
router.get('/', authenticateToken, getAllMatches);
router.get('/donor', authenticateToken, authorizeRoles('donor'), getMatchesForDonor);
router.get('/hospital', authenticateToken, authorizeRoles('hospital'), getMatchesForHospital);
router.get('/:id', authenticateToken, getMatchById);
router.put('/:id/accept', authenticateToken, authorizeRoles('donor'), acceptMatch);
router.put('/:id/decline', authenticateToken, authorizeRoles('donor'), declineMatch);

module.exports = router;
