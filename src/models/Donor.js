const mongoose = require('mongoose');

const DonorSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  blood_type: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  last_donation_date: Date,
  availability_status: {
    type: Boolean,
    default: true
  },
  location: String
}, {
  timestamps: false
});

// Prevent model overwrite in development
module.exports = mongoose.models.Donor || mongoose.model('Donor', DonorSchema);
