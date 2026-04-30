const express = require('express');
const router = express.Router();
const {
  getAllHospitals,
  getHospitalById,
  updateHospitalProfile,
  getHospitalBloodRequests
} = require('../controllers/hospitalController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Hospital routes
router.get('/', authenticateToken, getAllHospitals);
router.get('/blood-requests', authenticateToken, authorizeRoles('hospital'), getHospitalBloodRequests);
router.get('/:id', authenticateToken, getHospitalById);
router.put('/profile', authenticateToken, authorizeRoles('hospital'), updateHospitalProfile);

module.exports = router;
