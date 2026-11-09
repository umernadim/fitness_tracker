const express = require('express');
const router = express.Router();
const {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/unread-count', getUnreadCount);
router.put('/read-all', markAllAsRead);

router.route('/').get(getNotifications).post(createNotification);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
