const { Donation, Donor, BloodRequest, Hospital, User } = require('../database/models');

// Create donation
const createDonation = async (req, res) => {
  try {
    const donor = await Donor.findOne({ where: { user_id: req.user.id } });

    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    const donation = await Donation.create({
      ...req.body,
      donor_id: donor.id
    });

    // Update donor's last donation date
    await donor.update({ last_donation_date: new Date() });

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
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        },
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
    const donation = await Donation.findByPk(req.params.id, {
      include: [
        {
          model: Donor,
          as: 'donor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email', 'phone']
            }
          ]
        },
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
    const donation = await Donation.findByPk(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    await donation.update(req.body);

    res.json({ message: 'Donation updated successfully', donation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get donor donations
const getDonorDonations = async (req, res) => {
  try {
    const donor = await Donor.findOne({ where: { user_id: req.user.id } });

    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    const donations = await Donation.findAll({
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
      ],
      order: [['donation_date', 'DESC']]
    });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDonation,
  getAllDonations,
  getDonationById,
  updateDonation,
  getDonorDonations
};
