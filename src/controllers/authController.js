const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Donor, Hospital } = require('../models');

// Simple token generator
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, ...additionalData } = req.body;

    if (!['donor', 'hospital'].includes(role)) {
      return res.status(400).json({ message: 'Registration is only available for donor and hospital accounts' });
    }

    if (role === 'donor' && !additionalData.blood_type) {
      return res.status(400).json({ message: 'Donor registration requires a blood type' });
    }

    if (role === 'hospital' && !additionalData.hospital_name) {
      return res.status(400).json({ message: 'Hospital registration requires a hospital name' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
    });

    // Create role profile
    if (role === 'donor') {
      await Donor.create({ user_id: user.id, ...additionalData });
    } else if (role === 'hospital') {
      await Hospital.create({ user_id: user.id, ...additionalData });
    }

    const token = generateToken(user);

    // Get role-specific profile
    const userData = { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone };

    if (role === 'donor') {
      userData.Donor = await Donor.findOne({ where: { user_id: user.id } });
    } else if (role === 'hospital') {
      userData.Hospital = await Hospital.findOne({ where: { user_id: user.id } });
    }

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);


    // Get role-specific profile

    const userData = { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone };

    if (user.role === 'donor') {
      userData.Donor = await Donor.findOne({ where: { user_id: user.id } });
    } else if (user.role === 'hospital') {
      userData.Hospital = await Hospital.findOne({ where: { user_id: user.id } });
    }

    res.json({
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get role-specific profile
    let profile = { user };

    if (user.role === 'donor') {
      profile.donor = await Donor.findOne({ where: { user_id: user.id } });
    } else if (user.role === 'hospital') {
      profile.hospital = await Hospital.findOne({ where: { user_id: user.id } });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile
};
