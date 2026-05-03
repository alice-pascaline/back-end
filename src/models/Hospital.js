const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  hospital_name: String,
  address: String,
  contact_number: String
}, {
  timestamps: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

HospitalSchema.virtual('bloodRequests', {
  ref: 'BloodRequest',
  localField: '_id',
  foreignField: 'hospital_id'
});

// Prevent model overwrite in development
module.exports = mongoose.models.Hospital || mongoose.model('Hospital', HospitalSchema);
