const Notification = require('../models/Notification');

// Create notification
const createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);

    res.status(201).json({
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user notifications
const getUserNotifications = async (req, res) => {
  try {
    const { is_read } = req.query;

    const filter = { user_id: req.user.id };
    if (is_read !== undefined) {
      filter.is_read = is_read === 'true';
    }

    const notifications = await Notification.find(filter)
      .sort({ created_at: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.user_id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      { is_read: true },
      { new: true }
    );

    res.json({ message: 'Notification marked as read', notification: updatedNotification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all notifications as read
const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user_id: req.user.id, is_read: false },
      { is_read: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.user_id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get unread notification count
const getUnreadNotificationCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user_id: req.user.id,
      is_read: false
    });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount
};
