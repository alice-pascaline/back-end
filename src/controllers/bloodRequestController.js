const BloodRequest = require('../models/BloodRequest');
const Hospital = require('../models/Hospital');
const User = require('../models/User');
const Donation = require('../models/Donation');
const Donor = require('../models/Donor');
const Match = require('../models/Match');
const { getCompatibleDonorTypes, getCompatibleRequestTypes } = require('../utils/bloodCompatibility');

// Create blood request
const createBloodRequest = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ user_id: req.user.id });

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital profile not found' });
    }

    const bloodRequest = await BloodRequest.create({
      ...req.body,
      hospital_id: hospital._id
    });

    // Find matching donors using compatibility rules
    const matchingDonors = await Donor.find({
      blood_type: { $in: getCompatibleDonorTypes(req.body.blood_type) },
      availability_status: true
    });

    // Create matches for suggested donors
    const matches = matchingDonors.map(donor => ({
      donor_id: donor._id,
      request_id: bloodRequest._id,
      match_status: 'suggested'
    }));

    if (matches.length > 0) {
      await Match.insertMany(matches);
    }

    res.status(201).json({
      message: 'Blood request created successfully',
      bloodRequest,
      matchesFound: matches.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all blood requests
const getAllBloodRequests = async (req, res) => {
  try {
    const { status, urgency_level, blood_type, compatible_with } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (urgency_level) filter.urgency_level = urgency_level;
    if (blood_type) filter.blood_type = blood_type;
    if (compatible_with) {
      filter.blood_type = { $in: getCompatibleRequestTypes(compatible_with) };
    }

    const bloodRequests = await BloodRequest.find(filter)
      .populate({
        path: 'hospital_id',
        populate: { path: 'user_id', select: 'name email' }
      })
      .populate('donations')
      .sort({ request_date: -1 });

    res.json(bloodRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get blood request by ID
const getBloodRequestById = async (req, res) => {
  try {
    const bloodRequest = await BloodRequest.findById(req.params.id)
      .populate({
        path: 'hospital_id',
        populate: { path: 'user_id', select: 'name email' }
      })
      .populate({
        path: 'donations',
        populate: {
          path: 'donor_id',
          populate: { path: 'user_id', select: 'name email' }
        }
      })
      .populate({
        path: 'matches',
        populate: {
          path: 'donor_id',
          populate: { path: 'user_id', select: 'name email' }
        }
      });

    if (!bloodRequest) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    res.json(bloodRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update blood request
const updateBloodRequest = async (req, res) => {
  try {
    const bloodRequest = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!bloodRequest) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    res.json({ message: 'Blood request updated successfully', bloodRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete blood request
const deleteBloodRequest = async (req, res) => {
  try {
    const bloodRequest = await BloodRequest.findByIdAndDelete(req.params.id);

    if (!bloodRequest) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    await Match.deleteMany({ request_id: bloodRequest._id });
    await Donation.deleteMany({ request_id: bloodRequest._id });

    res.json({ message: 'Blood request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBloodRequest,
  getAllBloodRequests,
  getBloodRequestById,
  updateBloodRequest,
  deleteBloodRequest
};
