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
      User.countDocuments(),
      Donor.countDocuments(),
      Hospital.countDocuments(),
      BloodRequest.countDocuments(),
      BloodRequest.countDocuments({ status: 'pending' }),
      BloodRequest.countDocuments({ status: 'fulfilled' }),
      Donation.countDocuments(),
      Donation.countDocuments({ status: 'completed' }),
      Match.countDocuments(),
      Notification.countDocuments({ is_read: false })
    ]);

    // Get recent activity
    const recentDonors = await Donor.find()
      .populate('user_id', 'name email created_at')
      .sort({ _id: -1 })
      .limit(5);

    const recentRequests = await BloodRequest.find()
      .populate({
        path: 'hospital_id',
        populate: { path: 'user_id', select: 'name' }
      })
      .sort({ request_date: -1 })
      .limit(5);

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

    const filter = {};
    if (role) filter.role = role;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const users = await User.find(filter)
      .select('-password')
      .populate('donor')
      .populate('hospital')
      .sort({ created_at: -1 });

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
    const filter = {};

    if (blood_type) filter.blood_type = blood_type;
    if (available !== undefined) filter.availability_status = available === 'true';

    const donors = await Donor.find(filter)
      .populate('user_id', 'name email phone is_active')
      .sort({ _id: -1 });

    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDonorAdmin = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.json({ message: 'Donor updated successfully', donor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hospital Management
const getAllHospitalsAdmin = async (req, res) => {
  try {
    const hospitals = await Hospital.find()
      .populate('user_id', 'name email phone is_active')
      .sort({ _id: -1 });

    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateHospitalAdmin = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.json({ message: 'Hospital updated successfully', hospital });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Blood Request Management
const getAllRequestsAdmin = async (req, res) => {
  try {
    const { status, urgency_level } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (urgency_level) filter.urgency_level = urgency_level;

    const requests = await BloodRequest.find(filter)
      .populate({
        path: 'hospital_id',
        populate: { path: 'user_id', select: 'name' }
      })
      .populate('matches')
      .sort({ request_date: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRequestAdmin = async (req, res) => {
  try {
    const request = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ message: 'Request updated successfully', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRequestAdmin = async (req, res) => {
  try {
    const request = await BloodRequest.findByIdAndDelete(req.params.id);

    if (!request) {
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
    const filter = {};

    if (status) filter.status = status;

    const donations = await Donation.find(filter)
      .populate({
        path: 'donor_id',
        populate: { path: 'user_id', select: 'name' }
      })
      .populate('request_id')
      .sort({ donation_date: -1 });

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
