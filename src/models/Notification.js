const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: String,
  type: {
    type: String,
    enum: ['request', 'approval', 'rejection']
  },
  is_read: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

// Prevent model overwrite in development
module.exports = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
