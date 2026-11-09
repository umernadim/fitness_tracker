const Workout = require('../models/Workout');

/**
 * @desc    Create a new workout log
 * @route   POST /api/workouts
 * @access  Private
 */
const createWorkout = async (req, res, next) => {
  try {
    const {
      workoutName,
      exerciseName,
      category,
      sets,
      reps,
      weight,
      duration,
      notes,
      date,
      completed,
    } = req.body;

    if (!workoutName || !exerciseName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both workoutName and exerciseName',
      });
    }

    const workout = await Workout.create({
      userId: req.user._id,
      workoutName,
      exerciseName,
      category: category || 'Gym',
      sets: sets !== undefined ? Number(sets) : 3,
      reps: reps !== undefined ? Number(reps) : 10,
      weight: weight !== undefined ? Number(weight) : 0,
      duration: duration !== undefined ? Number(duration) : 30,
      notes: notes || '',
      date: date || new Date().toISOString().split('T')[0],
      completed: completed !== undefined ? completed : true,
    });

    res.status(201).json({
      success: true,
      message: 'Workout logged successfully',
      data: workout,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all workouts for logged in user (with search & filters)
 * @route   GET /api/workouts
 * @access  Private
 */
const getWorkouts = async (req, res, next) => {
  try {
    const { search, category, date, startDate, endDate, completed } = req.query;

    const query = { userId: req.user._id };

    if (category && category !== 'All' && category !== 'all') {
      query.category = new RegExp(`^${category}$`, 'i');
    }

    if (date) {
      query.date = date;
    } else if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }

    if (completed !== undefined) {
      query.completed = completed === 'true' || completed === true;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { workoutName: regex },
        { exerciseName: regex },
        { notes: regex },
      ];
    }

    const workouts = await Workout.find(query).sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: workouts.length,
      data: workouts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single workout by ID
 * @route   GET /api/workouts/:id
 * @access  Private
 */
const getWorkoutById = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout record not found',
      });
    }

    // Verify ownership
    if (workout.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this workout record',
      });
    }

    res.status(200).json({
      success: true,
      data: workout,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update workout by ID
 * @route   PUT /api/workouts/:id
 * @access  Private
 */
const updateWorkout = async (req, res, next) => {
  try {
    let workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout record not found',
      });
    }

    // Verify ownership
    if (workout.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this workout record',
      });
    }

    const {
      workoutName,
      exerciseName,
      category,
      sets,
      reps,
      weight,
      duration,
      notes,
      date,
      completed,
    } = req.body;

    if (workoutName !== undefined) workout.workoutName = workoutName;
    if (exerciseName !== undefined) workout.exerciseName = exerciseName;
    if (category !== undefined) workout.category = category;
    if (sets !== undefined) workout.sets = Number(sets);
    if (reps !== undefined) workout.reps = Number(reps);
    if (weight !== undefined) workout.weight = Number(weight);
    if (duration !== undefined) workout.duration = Number(duration);
    if (notes !== undefined) workout.notes = notes;
    if (date !== undefined) workout.date = date;
    if (completed !== undefined) workout.completed = completed;

    const updatedWorkout = await workout.save();

    res.status(200).json({
      success: true,
      message: 'Workout updated successfully',
      data: updatedWorkout,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete workout by ID
 * @route   DELETE /api/workouts/:id
 * @access  Private
 */
const deleteWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout record not found',
      });
    }

    // Verify ownership
    if (workout.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this workout record',
      });
    }

    await workout.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Workout record deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
};
