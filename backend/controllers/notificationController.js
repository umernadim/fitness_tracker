const Notification = require('../models/Notification');

/**
 * @desc    Get all notifications for logged in user
 * @route   GET /api/notifications
 * @access  Private
 */
const getNotifications = async (req, res, next) => {
  try {
    const { read, type } = req.query;

    const query = { userId: req.user._id };

    if (read !== undefined) {
      query.read = read === 'true' || read === true;
    }

    if (type) {
      query.type = type;
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a notification for user
 * @route   POST /api/notifications
 * @access  Private
 */
const createNotification = async (req, res, next) => {
  try {
    const { title, message, type, icon } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both title and message',
      });
    }

    const notification = await Notification.create({
      userId: req.user._id,
      title,
      message,
      type: type || 'workout',
      icon: icon || 'Bell',
    });

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark single notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this notification',
      });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark all user notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
const markAllAsRead = async (req, res, next) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete single notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this notification',
      });
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get count of unread notifications
 * @route   GET /api/notifications/unread-count
 * @access  Private
 */
const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user._id,
      read: false,
    });

    res.status(200).json({
      success: true,
      unreadCount: count,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
};
