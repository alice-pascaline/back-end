const { Donor, User, Donation, BloodRequest, Match } = require('../database/models');

// Get all donors
const getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get donor by ID
const getDonorById = async (req, res) => {
  try {
    const donor = await Donor.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: Donation,
          as: 'donations',
          include: [{ model: BloodRequest, as: 'bloodRequest' }]
        }
      ]
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
    const donor = await Donor.findOne({ where: { user_id: req.user.id } });

    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    await donor.update(req.body);

    res.json({ message: 'Donor profile updated successfully', donor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available donors
const getAvailableDonors = async (req, res) => {
  try {
    const { blood_type } = req.query;

    const whereClause = { availability_status: true };
    if (blood_type) {
      whereClause.blood_type = blood_type;
    }

    const donors = await Donor.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get donor matches
const getDonorMatches = async (req, res) => {
  try {
    const donor = await Donor.findOne({ where: { user_id: req.user.id } });

    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    const matches = await Match.findAll({
      where: { donor_id: donor.id },
      include: [
        {
          model: BloodRequest,
          as: 'bloodRequest',
          include: [
            {
              model: Hospital,
              as: 'hospital',
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['id', 'name', 'email']
                }
              ]
            }
          ]
        }
      ]
    });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDonors,
  getDonorById,
  updateDonorProfile,
  getAvailableDonors,
  getDonorMatches
};
