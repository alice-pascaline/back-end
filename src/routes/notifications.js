const express = require('express');
const router = express.Router();
const {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount
} = require('../controllers/notificationController');
const { authenticateToken } = require('../middlewares/auth');

// Notification routes
router.post('/', authenticateToken, createNotification);
router.get('/', authenticateToken, getUserNotifications);
router.get('/unread/count', authenticateToken, getUnreadNotificationCount);
router.put('/:id/read', authenticateToken, markNotificationAsRead);
router.put('/read-all', authenticateToken, markAllNotificationsAsRead);
router.delete('/:id', authenticateToken, deleteNotification);

module.exports = router;
