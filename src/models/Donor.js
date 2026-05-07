const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Donor = sequelize.define('Donor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  blood_type: {
    type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    allowNull: true
  },
  last_donation_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  availability_status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'donors',
  timestamps: false
});

module.exports = Donor;
