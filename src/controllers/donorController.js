const Donor = require('../models/Donor');
const User = require('../models/User');
const Donation = require('../models/Donation');
const BloodRequest = require('../models/BloodRequest');
const Match = require('../models/Match');
const Notification = require('../models/Notification');
const { getCompatibleDonorTypes, getCompatibleRequestTypes } = require('../utils/bloodCompatibility');

// Get donor profile (current user)
const getDonorProfile = async (req, res) => {
  try {
    const donor = await Donor.findOne({ where: { user_id: req.user.id } })
      .populate({ model: User, as: 'user', attributes: ['name', 'email', 'phone'] });

    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all donors
const getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.findAll({
      include: [{ model: User, as: 'user', attributes: ['name', 'email', 'phone'] }]
    });

    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get donor by ID
const getDonorById = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id)
      .populate('user_id', 'name email phone')
      .populate({
        path: 'donations',
        populate: { path: 'request_id' }
      });

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update donor profile
const updateDonorProfile = async (req, res) => {
  try {
    const donor = await Donor.findOne({ user_id: req.user.id });

    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    const updatedDonor = await Donor.findByIdAndUpdate(
      donor._id,
      req.body,
      { new: true }
    ).populate('user_id', 'name email phone');

    // Return updated donor with user info
    res.json({ message: 'Donor profile updated successfully', donor: updatedDonor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available donors
const getAvailableDonors = async (req, res) => {
  try {
    const { blood_type } = req.query;

    const filter = { availability_status: true };
    if (blood_type) {
      filter.blood_type = blood_type;
    }

    const donors = await Donor.find(filter)
      .populate('user_id', 'name email phone');

    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get donor matches
const getDonorMatches = async (req, res) => {
  try {
    const donor = await Donor.findOne({ user_id: req.user.id });

    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    const matches = await Match.find({ donor_id: donor._id })
      .populate({
        path: 'request_id',
        populate: {
          path: 'hospital_id',
          populate: { path: 'user_id', select: 'name email' }
        }
      });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create donation from match
const createDonationFromMatch = async (req, res) => {
  try {
    const { match_id } = req.body;
    
    const match = await Match.findById(match_id)
      .populate({ path: 'donor_id', populate: { path: 'user_id', select: 'name email' } })
      .populate({ path: 'request_id', populate: { path: 'hospital_id', populate: { path: 'user_id', select: 'name email' } } });

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Verify the donor owns this match
    const donor = await Donor.findOne({ user_id: req.user.id });
    if (!donor || match.donor_id._id.toString() !== donor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const compatibleTypes = getCompatibleDonorTypes(match.request_id.blood_type);
    if (!compatibleTypes.includes(donor.blood_type)) {
      return res.status(400).json({ message: `Your blood type (${donor.blood_type}) is not compatible with the requested type (${match.request_id.blood_type})` });
    }

    const donation = await Donation.create({
      donor_id: donor._id,
      request_id: match.request_id._id,
      status: 'accepted'
    });

    await Donor.findByIdAndUpdate(donor._id, { last_donation_date: new Date() });
    await Match.findByIdAndUpdate(match_id, { match_status: 'accepted' });
    await BloodRequest.findByIdAndUpdate(match.request_id._id, { status: 'approved' });

    await Notification.create({
      user_id: match.request_id.hospital_id.user_id._id,
      message: `${match.donor_id.user_id.name} has confirmed a donation for your ${match.request_id.blood_type} blood request.`,
      type: 'approval'
    });

    res.status(201).json({ message: 'Donation created successfully', donation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDonorProfile,
  getAllDonors,
  getDonorById,
  updateDonorProfile,
  getAvailableDonors,
  getDonorMatches,
  createDonationFromMatch
};
