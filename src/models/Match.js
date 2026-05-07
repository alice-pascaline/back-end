const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Match = sequelize.define('Match', {
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
  match_status: {
    type: DataTypes.ENUM('suggested', 'accepted', 'declined'),
    defaultValue: 'suggested'
  }
}, {
  tableName: 'matches',
  timestamps: false
});

module.exports = Match;
