const { sequelize } = require('../config/db');

const User = require('./User');
const Donor = require('./Donor');
const Hospital = require('./Hospital');
const BloodRequest = require('./BloodRequest');
const Donation = require('./Donation');
const Notification = require('./Notification');
const Match = require('./Match');

// Setup all associations
const setupAssociations = () => {
  // User associations
  User.hasOne(Donor, { foreignKey: 'user_id' });
  User.hasOne(Hospital, { foreignKey: 'user_id' });
  User.hasMany(Notification, { foreignKey: 'user_id' });

  // Donor associations
  Donor.belongsTo(User, { foreignKey: 'user_id' });
  Donor.hasMany(Donation, { foreignKey: 'donor_id' });
  Donor.hasMany(Match, { foreignKey: 'donor_id' });

  // Hospital associations
  Hospital.belongsTo(User, { foreignKey: 'user_id' });
  Hospital.hasMany(BloodRequest, { foreignKey: 'hospital_id' });

  // BloodRequest associations
  BloodRequest.belongsTo(Hospital, { foreignKey: 'hospital_id' });
  BloodRequest.hasMany(Donation, { foreignKey: 'request_id' });
  BloodRequest.hasMany(Match, { foreignKey: 'request_id' });

  // Donation associations
  Donation.belongsTo(Donor, { foreignKey: 'donor_id' });
  Donation.belongsTo(BloodRequest, { foreignKey: 'request_id' });

  // Match associations
  Match.belongsTo(Donor, { foreignKey: 'donor_id' });
  Match.belongsTo(BloodRequest, { foreignKey: 'request_id' });

  // Notification associations
  Notification.belongsTo(User, { foreignKey: 'user_id' });
};

// Setup associations
setupAssociations();

module.exports = {
  sequelize,
  User,
  Donor,
  Hospital,
  BloodRequest,
  Donation,
  Notification,
  Match,
  setupAssociations
};
