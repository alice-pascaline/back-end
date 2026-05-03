const mongoose = require('mongoose');

const BloodRequestSchema = new mongoose.Schema({
  hospital_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  patient_name: String,
  blood_type: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  quantity: Number,
  urgency_level: {
    type: String,
    enum: ['low', 'medium', 'high']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'fulfilled', 'cancelled'],
    default: 'pending'
  },
  request_date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

BloodRequestSchema.virtual('matches', {
  ref: 'Match',
  localField: '_id',
  foreignField: 'request_id'
});

BloodRequestSchema.virtual('donations', {
  ref: 'Donation',
  localField: '_id',
  foreignField: 'request_id'
});

// Prevent model overwrite in development
module.exports = mongoose.models.BloodRequest || mongoose.model('BloodRequest', BloodRequestSchema);
