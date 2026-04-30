const { Hospital, User, BloodRequest, Donation } = require('../database/models');

// Get all hospitals
const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get hospital by ID
const getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: BloodRequest,
          as: 'bloodRequests',
          include: [{ model: Donation, as: 'donations' }]
        }
      ]
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
    const hospital = await Hospital.findOne({ where: { user_id: req.user.id } });

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital profile not found' });
    }

    await hospital.update(req.body);

    res.json({ message: 'Hospital profile updated successfully', hospital });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get hospital blood requests
const getHospitalBloodRequests = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ where: { user_id: req.user.id } });

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital profile not found' });
    }

    const bloodRequests = await BloodRequest.findAll({
      where: { hospital_id: hospital.id },
      include: [{ model: Donation, as: 'donations' }],
      order: [['request_date', 'DESC']]
    });

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
