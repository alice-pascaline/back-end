const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Hospital = sequelize.define('Hospital', {
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
  hospital_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contact_number: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'hospitals',
  timestamps: false
});

module.exports = Hospital;
