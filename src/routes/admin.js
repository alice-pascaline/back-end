const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');
const {
  getDashboardStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllDonorsAdmin,
  updateDonorAdmin,
  getAllHospitalsAdmin,
  updateHospitalAdmin,
  getAllRequestsAdmin,
  updateRequestAdmin,
  deleteRequestAdmin,
  getAllDonationsAdmin,
  createAdmin
} = require('../controllers/adminController');

// Admin authentication required for all routes
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// User Management
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Donor Management
router.get('/donors', getAllDonorsAdmin);
router.put('/donors/:id', updateDonorAdmin);

// Hospital Management
router.get('/hospitals', getAllHospitalsAdmin);
router.put('/hospitals/:id', updateHospitalAdmin);

// Blood Request Management
router.get('/requests', getAllRequestsAdmin);
router.put('/requests/:id', updateRequestAdmin);
router.delete('/requests/:id', deleteRequestAdmin);

// Donation Management
router.get('/donations', getAllDonationsAdmin);

// Create Admin (public with secret key)
router.post('/create', createAdmin);

module.exports = router;
