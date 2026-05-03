const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
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
  match_status: {
    type: String,
    enum: ['suggested', 'accepted', 'declined'],
    default: 'suggested'
  }
}, {
  timestamps: false
});

// Prevent model overwrite in development
module.exports = mongoose.models.Match || mongoose.model('Match', MatchSchema);
