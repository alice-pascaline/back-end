const mongoose = require('mongoose');

const User = require('./User');
const Donor = require('./Donor');
const Hospital = require('./Hospital');
const BloodRequest = require('./BloodRequest');
const Donation = require('./Donation');
const Notification = require('./Notification');
const Match = require('./Match');

// Prevent model overwrite issues in development with hot reload
if (!mongoose.models.User) mongoose.model('User', User.schema || User.schema);
if (!mongoose.models.Donor) mongoose.model('Donor', Donor.schema || Donor.schema);
if (!mongoose.models.Hospital) mongoose.model('Hospital', Hospital.schema || Hospital.schema);
if (!mongoose.models.BloodRequest) mongoose.model('BloodRequest', BloodRequest.schema || BloodRequest.schema);
if (!mongoose.models.Donation) mongoose.model('Donation', Donation.schema || Donation.schema);
if (!mongoose.models.Notification) mongoose.model('Notification', Notification.schema || Notification.schema);
if (!mongoose.models.Match) mongoose.model('Match', Match.schema || Match.schema);

module.exports = {
  User,
  Donor,
  Hospital,
  BloodRequest,
  Donation,
  Notification,
  Match
};
