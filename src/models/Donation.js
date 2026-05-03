const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  donor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: true
  },
  request_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodRequest',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  donation_date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

// Prevent model overwrite in development
module.exports = mongoose.models.Donation || mongoose.model('Donation', DonationSchema);
