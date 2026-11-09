const Goal = require('../models/Goal');

/**
 * @desc    Create a new fitness goal
 * @route   POST /api/goals
 * @access  Private
 */
const createGoal = async (req, res, next) => {
  try {
    const {
      title,
      category,
      targetValue,
      target,
      currentValue,
      current,
      unit,
      deadline,
      status,
      completed,
      notes,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a goal title',
      });
    }

    const resolvedTarget = Number(targetValue !== undefined ? targetValue : (target !== undefined ? target : 100));
    const resolvedCurrent = Number(currentValue !== undefined ? currentValue : (current !== undefined ? current : 0));
    const isCompleted = completed !== undefined ? completed : resolvedCurrent >= resolvedTarget;

    const goal = await Goal.create({
      userId: req.user._id,
      title,
      category: category || 'Weight Loss',
      targetValue: resolvedTarget,
      currentValue: resolvedCurrent,
      unit: unit || 'kg',
      deadline: deadline || 'Daily',
      status: status || (isCompleted ? 'Completed' : 'In Progress'),
      completed: isCompleted,
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Fitness goal created successfully',
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all goals for authenticated user
 * @route   GET /api/goals
 * @access  Private
 */
const getGoals = async (req, res, next) => {
  try {
    const { status, category, completed } = req.query;

    const query = { userId: req.user._id };

    if (status) query.status = status;
    if (category) query.category = category;
    if (completed !== undefined) {
      query.completed = completed === 'true' || completed === true;
    }

    const goals = await Goal.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single goal by ID
 * @route   GET /api/goals/:id
 * @access  Private
 */
const getGoalById = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Fitness goal not found',
      });
    }

    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this goal',
      });
    }

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a fitness goal by ID
 * @route   PUT /api/goals/:id
 * @access  Private
 */
const updateGoal = async (req, res, next) => {
  try {
    let goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Fitness goal not found',
      });
    }

    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this goal',
      });
    }

    const {
      title,
      category,
      targetValue,
      target,
      currentValue,
      current,
      increment,
      unit,
      deadline,
      status,
      completed,
      notes,
    } = req.body;

    if (title !== undefined) goal.title = title;
    if (category !== undefined) goal.category = category;
    if (targetValue !== undefined || target !== undefined) {
      goal.targetValue = Number(targetValue !== undefined ? targetValue : target);
    }
    if (currentValue !== undefined || current !== undefined) {
      goal.currentValue = Number(currentValue !== undefined ? currentValue : current);
    } else if (increment !== undefined) {
      goal.currentValue += Number(increment);
    }
    if (unit !== undefined) goal.unit = unit;
    if (deadline !== undefined) goal.deadline = deadline;
    if (notes !== undefined) goal.notes = notes;

    // Check completion state
    if (completed !== undefined) {
      goal.completed = completed;
      goal.status = completed ? 'Completed' : 'In Progress';
    } else {
      goal.completed = goal.currentValue >= goal.targetValue;
      goal.status = goal.completed ? 'Completed' : (status || 'In Progress');
    }

    const updatedGoal = await goal.save();

    res.status(200).json({
      success: true,
      message: 'Goal updated successfully',
      data: updatedGoal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a fitness goal
 * @route   DELETE /api/goals/:id
 * @access  Private
 */
const deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Fitness goal not found',
      });
    }

    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this goal',
      });
    }

    await goal.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
};
