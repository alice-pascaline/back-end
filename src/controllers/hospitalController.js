const Hospital = require('../models/Hospital');
const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const Donation = require('../models/Donation');

// Get all hospitals
const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().populate('user_id', 'name email phone');
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get hospital by ID
const getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id)
      .populate('user_id', 'name email phone')
      .populate({
        path: 'bloodRequests',
        populate: { path: 'donations' }
      });

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.json(hospital);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update hospital profile
const updateHospitalProfile = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ user_id: req.user.id });

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital profile not found' });
    }

    const updatedHospital = await Hospital.findByIdAndUpdate(
      hospital._id,
      req.body,
      { new: true }
    );

    res.json({ message: 'Hospital profile updated successfully', hospital: updatedHospital });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get hospital blood requests
const getHospitalBloodRequests = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ user_id: req.user.id });

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital profile not found' });
    }

    const bloodRequests = await BloodRequest.find({ hospital_id: hospital._id })
      .populate('donations')
      .sort({ request_date: -1 });

    res.json(bloodRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllHospitals,
  getHospitalById,
  updateHospitalProfile,
  getHospitalBloodRequests
};
