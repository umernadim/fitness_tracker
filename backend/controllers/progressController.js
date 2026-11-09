const Progress = require('../models/Progress');
const User = require('../models/User');

/**
 * @desc    Record new body progress measurements
 * @route   POST /api/progress
 * @access  Private
 */
const createProgress = async (req, res, next) => {
  try {
    const { weight, chest, waist, hips, arms, bodyFat, notes, date } = req.body;

    if (!weight) {
      return res.status(400).json({
        success: false,
        message: 'Please provide body weight',
      });
    }

    const progressRecord = await Progress.create({
      userId: req.user._id,
      weight: Number(weight),
      chest: chest !== undefined ? Number(chest) : 0,
      waist: waist !== undefined ? Number(waist) : 0,
      hips: hips !== undefined ? Number(hips) : 0,
      arms: arms !== undefined ? Number(arms) : 0,
      bodyFat: bodyFat !== undefined ? Number(bodyFat) : 0,
      notes: notes || '',
      date: date || new Date().toISOString().split('T')[0],
    });

    // Also update user profile current weight and bodyFat
    await User.findByIdAndUpdate(req.user._id, {
      weight: Number(weight),
      ...(bodyFat ? { bodyFat: Number(bodyFat) } : {}),
    });

    res.status(201).json({
      success: true,
      message: 'Body progress measurements recorded successfully',
      data: progressRecord,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get progress records in chronological order
 * @route   GET /api/progress
 * @access  Private
 */
const getProgress = async (req, res, next) => {
  try {
    const records = await Progress.find({ userId: req.user._id }).sort({
      date: 1,
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single progress record by ID
 * @route   GET /api/progress/:id
 * @access  Private
 */
const getProgressById = async (req, res, next) => {
  try {
    const record = await Progress.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Progress record not found',
      });
    }

    if (record.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this progress record',
      });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update progress record
 * @route   PUT /api/progress/:id
 * @access  Private
 */
const updateProgress = async (req, res, next) => {
  try {
    let record = await Progress.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Progress record not found',
      });
    }

    if (record.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this progress record',
      });
    }

    const { weight, chest, waist, hips, arms, bodyFat, notes, date } = req.body;

    if (weight !== undefined) record.weight = Number(weight);
    if (chest !== undefined) record.chest = Number(chest);
    if (waist !== undefined) record.waist = Number(waist);
    if (hips !== undefined) record.hips = Number(hips);
    if (arms !== undefined) record.arms = Number(arms);
    if (bodyFat !== undefined) record.bodyFat = Number(bodyFat);
    if (notes !== undefined) record.notes = notes;
    if (date !== undefined) record.date = date;

    const updated = await record.save();

    res.status(200).json({
      success: true,
      message: 'Progress record updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete progress record
 * @route   DELETE /api/progress/:id
 * @access  Private
 */
const deleteProgress = async (req, res, next) => {
  try {
    const record = await Progress.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Progress record not found',
      });
    }

    if (record.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this progress record',
      });
    }

    await record.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Progress record deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get progress summary metrics
 * @route   GET /api/progress/summary
 * @access  Private
 */
const getProgressSummary = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const records = await Progress.find({ userId: req.user._id }).sort({
      date: 1,
      createdAt: 1,
    });

    const startingWeight =
      records.length > 0 ? records[0].weight : (user ? user.startingWeight || user.weight : 0);
    const currentWeight =
      records.length > 0 ? records[records.length - 1].weight : (user ? user.weight : 0);
    const targetWeight = user ? user.targetWeight || 70 : 70;
    const weightChange = Number((currentWeight - startingWeight).toFixed(1));

    const weightHistory = records.map((r) => ({
      date: r.date,
      weight: r.weight,
    }));

    const measurementHistory = records.map((r) => ({
      date: r.date,
      chest: r.chest,
      waist: r.waist,
      hips: r.hips,
      arms: r.arms,
      bodyFat: r.bodyFat,
    }));

    res.status(200).json({
      success: true,
      summary: {
        currentWeight,
        startingWeight,
        targetWeight,
        weightChange,
        totalEntries: records.length,
        weightHistory,
        measurementHistory,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProgress,
  getProgress,
  getProgressById,
  updateProgress,
  deleteProgress,
  getProgressSummary,
};
