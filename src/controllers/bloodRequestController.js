const { BloodRequest, Hospital, User, Donation, Donor, Match } = require('../database/models');

// Create blood request
const createBloodRequest = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ where: { user_id: req.user.id } });

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital profile not found' });
    }

    const bloodRequest = await BloodRequest.create({
      ...req.body,
      hospital_id: hospital.id
    });

    // Find matching donors
    const matchingDonors = await Donor.findAll({
      where: {
        blood_type: req.body.blood_type,
        availability_status: true
      }
    });

    // Create matches
    const matches = matchingDonors.map(donor => ({
      donor_id: donor.id,
      request_id: bloodRequest.id,
      match_status: 'suggested'
    }));

    if (matches.length > 0) {
      await Match.bulkCreate(matches);
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
    const { status, urgency_level } = req.query;

    const whereClause = {};
    if (status) whereClause.status = status;
    if (urgency_level) whereClause.urgency_level = urgency_level;

    const bloodRequests = await BloodRequest.findAll({
      where: whereClause,
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
        },
        { model: Donation, as: 'donations' }
      ],
      order: [['request_date', 'DESC']]
    });

    res.json(bloodRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get blood request by ID
const getBloodRequestById = async (req, res) => {
  try {
    const bloodRequest = await BloodRequest.findByPk(req.params.id, {
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
        },
        {
          model: Donation,
          as: 'donations',
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
            }
          ]
        },
        {
          model: Match,
          as: 'matches',
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
            }
          ]
        }
      ]
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
    const bloodRequest = await BloodRequest.findByPk(req.params.id);

    if (!bloodRequest) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    await bloodRequest.update(req.body);

    res.json({ message: 'Blood request updated successfully', bloodRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete blood request
const deleteBloodRequest = async (req, res) => {
  try {
    const bloodRequest = await BloodRequest.findByPk(req.params.id);

    if (!bloodRequest) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    await bloodRequest.destroy();

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
