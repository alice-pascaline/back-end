const Match = require('../models/Match');
const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');
const Hospital = require('../models/Hospital');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Get all matches
const getAllMatches = async (req, res) => {
  try {
    const { match_status } = req.query;

    const filter = {};
    if (match_status) filter.match_status = match_status;

    const matches = await Match.find(filter)
      .populate({
        path: 'donor_id',
        populate: { path: 'user_id', select: 'name email phone' }
      })
      .populate({
        path: 'request_id',
        populate: {
          path: 'hospital_id',
          populate: { path: 'user_id', select: 'name email' }
        }
      })
      .sort({ _id: -1 });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get match by ID
const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate({
        path: 'donor_id',
        populate: { path: 'user_id', select: 'name email phone' }
      })
      .populate({
        path: 'request_id',
        populate: {
          path: 'hospital_id',
          populate: { path: 'user_id', select: 'name email' }
        }
      });

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept match
const acceptMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate({
        path: 'donor_id',
        populate: { path: 'user_id' }
      })
      .populate({
        path: 'request_id',
        populate: {
          path: 'hospital_id',
          populate: { path: 'user_id' }
        }
      });

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Check authorization
    if (match.donor_id.user_id._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Match.findByIdAndUpdate(req.params.id, { match_status: 'accepted' });

    // Create notification
    await Notification.create({
      user_id: match.request_id.hospital_id.user_id._id,
      message: `${match.donor_id.user_id.name} has accepted your blood request for ${match.request_id.blood_type} blood type.`,
      type: 'approval'
    });

    res.json({ message: 'Match accepted successfully', match });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Decline match
const declineMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate({
        path: 'donor_id',
        populate: { path: 'user_id' }
      })
      .populate({
        path: 'request_id',
        populate: {
          path: 'hospital_id',
          populate: { path: 'user_id' }
        }
      });

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Check authorization
    if (match.donor_id.user_id._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Match.findByIdAndUpdate(req.params.id, { match_status: 'declined' });

    // Create notification
    await Notification.create({
      user_id: match.request_id.hospital_id.user_id._id,
      message: `${match.donor_id.user_id.name} has declined your blood request for ${match.request_id.blood_type} blood type.`,
      type: 'rejection'
    });

    res.json({ message: 'Match declined successfully', match });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get matches for donor
const getMatchesForDonor = async (req, res) => {
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
      })
      .sort({ _id: -1 });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get matches for hospital
const getMatchesForHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ user_id: req.user.id });

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital profile not found' });
    }

    const matches = await Match.find()
      .populate({
        path: 'request_id',
        match: { hospital_id: hospital._id }
      })
      .populate({
        path: 'donor_id',
        populate: { path: 'user_id', select: 'name email phone' }
      });

    // Filter out matches where request_id is null (not matching hospital)
    const filteredMatches = matches.filter(m => m.request_id);

    res.json(filteredMatches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllMatches,
  getMatchById,
  acceptMatch,
  declineMatch,
  getMatchesForDonor,
  getMatchesForHospital
};
