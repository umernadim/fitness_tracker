const Schedule = require('../models/Schedule');

/**
 * @desc    Create a new scheduled activity
 * @route   POST /api/schedules
 * @access  Private
 */
const createSchedule = async (req, res, next) => {
  try {
    const {
      title,
      activityName,
      activityType,
      category,
      date,
      time,
      duration,
      notes,
      completed,
    } = req.body;

    const resolvedTitle = title || activityName;
    if (!resolvedTitle) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an activity title or name',
      });
    }

    const schedule = await Schedule.create({
      userId: req.user._id,
      title: resolvedTitle,
      activityType: activityType || 'Workout',
      category: category || 'Gym',
      date: date || new Date().toISOString().split('T')[0],
      time: time || '07:30 AM',
      duration: duration || '45 min',
      notes: notes || '',
      completed: completed !== undefined ? completed : false,
    });

    res.status(201).json({
      success: true,
      message: 'Activity scheduled successfully',
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get schedules for authenticated user with date/month filtering
 * @route   GET /api/schedules
 * @access  Private
 */
const getSchedules = async (req, res, next) => {
  try {
    const { date, month, completed } = req.query;

    const query = { userId: req.user._id };

    if (date) {
      query.date = date;
    } else if (month) {
      // Matches month pattern e.g. "2026-11"
      query.date = new RegExp(`^${month}`);
    }

    if (completed !== undefined) {
      query.completed = completed === 'true' || completed === true;
    }

    const schedules = await Schedule.find(query).sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single schedule by ID
 * @route   GET /api/schedules/:id
 * @access  Private
 */
const getScheduleById = async (req, res, next) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Scheduled activity not found',
      });
    }

    if (schedule.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this scheduled activity',
      });
    }

    res.status(200).json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a scheduled activity
 * @route   PUT /api/schedules/:id
 * @access  Private
 */
const updateSchedule = async (req, res, next) => {
  try {
    let schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Scheduled activity not found',
      });
    }

    if (schedule.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this scheduled activity',
      });
    }

    const {
      title,
      activityName,
      activityType,
      category,
      date,
      time,
      duration,
      notes,
      completed,
    } = req.body;

    if (title !== undefined || activityName !== undefined) {
      schedule.title = title || activityName;
    }
    if (activityType !== undefined) schedule.activityType = activityType;
    if (category !== undefined) schedule.category = category;
    if (date !== undefined) schedule.date = date;
    if (time !== undefined) schedule.time = time;
    if (duration !== undefined) schedule.duration = duration;
    if (notes !== undefined) schedule.notes = notes;
    if (completed !== undefined) schedule.completed = completed;

    const updatedSchedule = await schedule.save();

    res.status(200).json({
      success: true,
      message: 'Schedule updated successfully',
      data: updatedSchedule,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a scheduled activity
 * @route   DELETE /api/schedules/:id
 * @access  Private
 */
const deleteSchedule = async (req, res, next) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Scheduled activity not found',
      });
    }

    if (schedule.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this scheduled activity',
      });
    }

    await schedule.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Scheduled activity deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
