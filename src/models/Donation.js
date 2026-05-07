const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Donation = sequelize.define('Donation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  donor_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  request_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'completed'),
    defaultValue: 'pending'
  },
  donation_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'donations',
  timestamps: false
});

module.exports = Donation;
