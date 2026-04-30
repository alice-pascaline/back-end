const { Match, Donor, BloodRequest, Hospital, User, Notification } = require('../database/models');

// Get all matches
const getAllMatches = async (req, res) => {
  try {
    const { match_status } = req.query;

    const whereClause = {};
    if (match_status) whereClause.match_status = match_status;

    const matches = await Match.findAll({
      where: whereClause,
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
      ],
      order: [['id', 'DESC']]
    });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get match by ID
const getMatchById = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id, {
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
    const match = await Match.findByPk(req.params.id, {
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
      ]
    });

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Check authorization
    if (match.donor.user.id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await match.update({ match_status: 'accepted' });

    // Create notification
    await Notification.create({
      user_id: match.bloodRequest.hospital.user.id,
      message: `${match.donor.user.name} has accepted your blood request for ${match.bloodRequest.blood_type} blood type.`,
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
    const match = await Match.findByPk(req.params.id, {
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
      ]
    });

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Check authorization
    if (match.donor.user.id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await match.update({ match_status: 'declined' });

    // Create notification
    await Notification.create({
      user_id: match.bloodRequest.hospital.user.id,
      message: `${match.donor.user.name} has declined your blood request for ${match.bloodRequest.blood_type} blood type.`,
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
      ],
      order: [['id', 'DESC']]
    });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get matches for hospital
const getMatchesForHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ where: { user_id: req.user.id } });

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital profile not found' });
    }

    const matches = await Match.findAll({
      include: [
        {
          model: BloodRequest,
          as: 'bloodRequest',
          where: { hospital_id: hospital.id }
        },
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
        }
      ],
      order: [['id', 'DESC']]
    });

    res.json(matches);
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
