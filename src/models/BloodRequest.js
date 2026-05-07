const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const BloodRequest = sequelize.define('BloodRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  hospital_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  patient_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  blood_type: {
    type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  urgency_level: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'fulfilled', 'cancelled'),
    defaultValue: 'pending'
  },
  request_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'blood_requests',
  timestamps: false
});

module.exports = BloodRequest;
