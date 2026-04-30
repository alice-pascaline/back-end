const sequelize = require('../../config/db');
const { DataTypes } = require('sequelize');

// Import models
const User = require('./User')(sequelize, DataTypes);
const Donor = require('./Donor')(sequelize, DataTypes);
const Hospital = require('./Hospital')(sequelize, DataTypes);
const BloodRequest = require('./BloodRequest')(sequelize, DataTypes);
const Donation = require('./Donation')(sequelize, DataTypes);
const Notification = require('./Notification')(sequelize, DataTypes);
const Match = require('./Match')(sequelize, DataTypes);

// Define associations
const defineAssociations = () => {
  // User has one Donor or Hospital
  User.hasOne(Donor, { foreignKey: 'user_id', as: 'donor' });
  Donor.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  User.hasOne(Hospital, { foreignKey: 'user_id', as: 'hospital' });
  Hospital.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // Hospital has many BloodRequests
  Hospital.hasMany(BloodRequest, { foreignKey: 'hospital_id', as: 'bloodRequests' });
  BloodRequest.belongsTo(Hospital, { foreignKey: 'hospital_id', as: 'hospital' });

  // Donor has many Donations
  Donor.hasMany(Donation, { foreignKey: 'donor_id', as: 'donations' });
  Donation.belongsTo(Donor, { foreignKey: 'donor_id', as: 'donor' });

  // BloodRequest has many Donations
  BloodRequest.hasMany(Donation, { foreignKey: 'request_id', as: 'donations' });
  Donation.belongsTo(BloodRequest, { foreignKey: 'request_id', as: 'bloodRequest' });

  // User has many Notifications
  User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
  Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // Donor has many Matches
  Donor.hasMany(Match, { foreignKey: 'donor_id', as: 'matches' });
  Match.belongsTo(Donor, { foreignKey: 'donor_id', as: 'donor' });

  // BloodRequest has many Matches
  BloodRequest.hasMany(Match, { foreignKey: 'request_id', as: 'matches' });
  Match.belongsTo(BloodRequest, { foreignKey: 'request_id', as: 'bloodRequest' });
};

// Call associations
defineAssociations();

module.exports = {
  sequelize,
  User,
  Donor,
  Hospital,
  BloodRequest,
  Donation,
  Notification,
  Match
};
