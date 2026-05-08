const { Op } = require('sequelize');
const User = require('../models/User');
const Donor = require('../models/Donor');
const Hospital = require('../models/Hospital');
const BloodRequest = require('../models/BloodRequest');
const Donation = require('../models/Donation');
const Match = require('../models/Match');
const Notification = require('../models/Notification');
const bcrypt = require('bcrypt');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalDonors,
      totalHospitals,
      totalRequests,
      pendingRequests,
      fulfilledRequests,
      totalDonations,
      completedDonations,
      totalMatches,
      unreadNotifications
    ] = await Promise.all([
      User.count(),
      Donor.count(),
      Hospital.count(),
      BloodRequest.count(),
      BloodRequest.count({ where: { status: 'pending' } }),
      BloodRequest.count({ where: { status: 'fulfilled' } }),
      Donation.count(),
      Donation.count({ where: { status: 'completed' } }),
      Match.count(),
      Notification.count({ where: { is_read: false } })
    ]);

    // Get recent activity
    const recentDonors = await Donor.findAll({
      include: [{ model: User, as: 'user', attributes: ['name', 'email', 'created_at'] }],
      order: [['id', 'DESC']],
      limit: 5
    });

    const recentRequests = await BloodRequest.findAll({
      include: [
        {
          model: Hospital,
          as: 'hospital',
          include: [{ model: User, as: 'user', attributes: ['name'] }]
        }
      ],
      order: [['request_date', 'DESC']],
      limit: 5
    });

    res.json({
      stats: {
        totalUsers,
        totalDonors,
        totalHospitals,
        totalRequests,
        pendingRequests,
        fulfilledRequests,
        totalDonations,
        completedDonations,
        totalMatches,
        unreadNotifications
      },
      recentActivity: {
        donors: recentDonors,
        requests: recentRequests
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User Management
const getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;

    const whereClause = {};
    if (role) whereClause.role = role;
    if (search) whereClause.name = { [Op.iLike]: `%${search}%` };

    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      include: [
        { model: Donor, as: 'donor' },
        { model: Hospital, as: 'hospital' }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, phone, role, is_active } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, role, is_active },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Donor Management
const getAllDonorsAdmin = async (req, res) => {
  try {
    const { blood_type, available } = req.query;
    const whereClause = {};

    if (blood_type) whereClause.blood_type = blood_type;
    if (available !== undefined) whereClause.availability_status = available === 'true';

    const donors = await Donor.findAll({
      where: whereClause,
      include: [{ model: User, as: 'user', attributes: ['name', 'email', 'phone', 'is_active'] }],
      order: [['id', 'DESC']]
    });

    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDonorAdmin = async (req, res) => {
  try {
    const donor = await Donor.update(
      req.body,
      { where: { id: req.params.id }, returning: true }
    );

    if (!donor[0]) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.json({ message: 'Donor updated successfully', donor: donor[1][0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hospital Management
const getAllHospitalsAdmin = async (req, res) => {
  try {
    const hospitals = await Hospital.findAll({
      include: [{ model: User, as: 'user', attributes: ['name', 'email', 'phone', 'is_active'] }],
      order: [['id', 'DESC']]
    });

    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateHospitalAdmin = async (req, res) => {
  try {
    const hospital = await Hospital.update(
      req.body,
      { where: { id: req.params.id }, returning: true }
    );

    if (!hospital[0]) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.json({ message: 'Hospital updated successfully', hospital: hospital[1][0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Blood Request Management
const getAllRequestsAdmin = async (req, res) => {
  try {
    const { status, urgency_level } = req.query;
    const whereClause = {};

    if (status) whereClause.status = status;
    if (urgency_level) whereClause.urgency_level = urgency_level;

    const requests = await BloodRequest.findAll({
      where: whereClause,
      include: [
        {
          model: Hospital,
          as: 'hospital',
          include: [{ model: User, as: 'user', attributes: ['name'] }]
        },
        { model: Match, as: 'matches' }
      ],
      order: [['request_date', 'DESC']]
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRequestAdmin = async (req, res) => {
  try {
    const [updatedRowsCount] = await BloodRequest.update(
      req.body,
      { where: { id: req.params.id }, returning: true }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ message: 'Request updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRequestAdmin = async (req, res) => {
  try {
    const deletedRowsCount = await BloodRequest.destroy({ where: { id: req.params.id } });

    if (deletedRowsCount === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Donation Management
const getAllDonationsAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    const whereClause = {};

    if (status) whereClause.status = status;

    const donations = await Donation.findAll({
      where: whereClause,
      include: [
        {
          model: Donor,
          as: 'donor',
          include: [{ model: User, as: 'user', attributes: ['name'] }]
        },
        { model: BloodRequest, as: 'request' }
      ],
      order: [['donation_date', 'DESC']]
    });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Admin User (called once during setup)
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, secret_key } = req.body;

    // Verify secret key
    if (secret_key !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ message: 'Invalid secret key' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      is_active: true
    });

    res.status(201).json({
      message: 'Admin created successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
