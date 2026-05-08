const { Op } = require('sequelize');
const Donation = require('../models/Donation');
const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');
const Hospital = require('../models/Hospital');
const User = require('../models/User');
const Match = require('../models/Match');
const Notification = require('../models/Notification');
const { getCompatibleDonorTypes } = require('../utils/bloodCompatibility');

// Blood type compatibility map
const bloodTypeCompatibility = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+']
};

// Create donation
const createDonation = async (req, res) => {
  try {
    const donor = await Donor.findOne({ where: { user_id: req.user.id } });

    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    const { request_id } = req.body;

    if (!request_id) {
      return res.status(400).json({ message: 'Request ID is required' });
    }

    // Check if blood request exists and is pending
    const bloodRequest = await BloodRequest.findByPk(request_id, {
      include: [
        {
          model: Hospital,
          as: 'hospital',
          include: [{ model: User, as: 'user' }]
        }
      ]
    });

    if (!bloodRequest) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    if (bloodRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Blood request is no longer pending' });
    }

    // Check blood type compatibility
    const compatibleTypes = bloodTypeCompatibility[donor.blood_type] || [];
    if (!compatibleTypes.includes(bloodRequest.blood_type)) {
      return res.status(400).json({ message: `Your blood type (${donor.blood_type}) is not compatible with the requested type (${bloodRequest.blood_type})` });
    }

    // Create donation
    const donation = await Donation.create({
      donor_id: donor.id,
      request_id: request_id,
      status: 'accepted'
    });

    // Update donor's last donation date
    await Donor.update({ last_donation_date: new Date() }, { where: { id: donor.id } });

    // Update match status to accepted if match exists
    await Match.update(
      { match_status: 'accepted' },
      { where: { donor_id: donor.id, request_id: request_id } }
    );

    // Update blood request status to approved
    await BloodRequest.update({ status: 'approved' }, { where: { id: request_id } });

    // Create notification for hospital
    await Notification.create({
      user_id: bloodRequest.hospital.user.id,
      message: `${donor.user_id?.name || 'A donor'} has confirmed a donation for your ${bloodRequest.blood_type} request.`,
      type: 'approval'
    });

    res.status(201).json({
      message: 'Donation created successfully',
      donation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all donations
const getAllDonations = async (req, res) => {
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
          include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
        },
        {
          model: BloodRequest,
          as: 'request',
          include: [
            {
              model: Hospital,
              as: 'hospital',
              include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
            }
          ]
        }
      ],
      order: [['donation_date', 'DESC']]
    });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get donation by ID
const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findByPk(req.params.id)
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

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update donation
const updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findByPk(req.params.id).populate({
      path: 'request_id',
      populate: { path: 'hospital_id', populate: { path: 'user_id' } }
    });

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    const hospital = await Hospital.findOne({ user_id: req.user.id });
    if (!hospital || donation.request_id.hospital_id._id.toString() !== hospital._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this donation' });
    }

    const allowedUpdates = ['status'];
    const updates = {};
    if (req.body.status && allowedUpdates.includes('status')) {
      updates.status = req.body.status;
    }

    const updatedDonation = await Donation.update(req.body, { 
      where: { id: req.params.id }, 
      returning: true 
    });

    if (!updatedDonation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (updates.status === 'completed') {
      await BloodRequest.update({ status: 'fulfilled' }, { where: { id: donation.request_id } });
      await Notification.create({
        user_id: donation.donor_id,
        message: `Your donation to ${donation.request_id.blood_type} blood request has been marked as completed.`,
        type: 'completion'
      });
    }

    res.json({ message: 'Donation updated successfully', donation: updatedDonation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get donor donations
const getDonorDonations = async (req, res) => {
  try {
    const donor = await Donor.findOne({ user_id: req.user.id });

    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    const donations = await Donation.findAll({ 
      where: { donor_id: donor.id },
      include: [
        {
          model: BloodRequest,
          as: 'request',
          include: [
            {
              model: Hospital,
              as: 'hospital',
              include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
            }
          ]
        }
      ],
      order: [['donation_date', 'DESC']]
    });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeDonation = async (req, res) => {
  try {
    const donation = await Donation.findByPk(req.params.id, {
      include: [
        {
          model: BloodRequest,
          as: 'request',
          include: [
            {
              model: Hospital,
              as: 'hospital',
              include: [{ model: User, as: 'user' }]
            }
          ]
        },
        {
          model: Donor,
          as: 'donor',
          include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
        }
      ]
    });

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    const hospital = await Hospital.findOne({ where: { user_id: req.user.id } });
    if (!hospital || donation.request.hospital.id !== hospital.id) {
      return res.status(403).json({ message: 'Not authorized to complete this donation' });
    }

    await Donation.update(
      { status: 'completed', donation_date: new Date() },
      { where: { id: req.params.id } }
    );

    await BloodRequest.update({ status: 'fulfilled' }, { where: { id: donation.request_id } });

    await Notification.create({
      user_id: donation.donor.user.id,
      message: `Your donation for request ${donation.request.blood_type} was completed by hospital.`,
      type: 'completion'
    });

    res.json({ message: 'Donation marked as completed', donation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDonation,
  getAllDonations,
  getDonationById,
  updateDonation,
  getDonorDonations,
  completeDonation
};
