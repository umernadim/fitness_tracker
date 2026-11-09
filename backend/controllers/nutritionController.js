const Meal = require('../models/Meal');

/**
 * @desc    Log a new meal
 * @route   POST /api/nutrition
 * @access  Private
 */
const createMeal = async (req, res, next) => {
  try {
    const {
      foodName,
      name,
      mealType,
      quantity,
      calories,
      protein,
      carbohydrates,
      carbs,
      fats,
      date,
      notes,
    } = req.body;

    const resolvedFoodName = foodName || name;
    if (!resolvedFoodName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a food or meal name',
      });
    }

    const meal = await Meal.create({
      userId: req.user._id,
      foodName: resolvedFoodName,
      mealType: mealType || 'Breakfast',
      quantity: quantity || '1 serving',
      calories: Number(calories || 0),
      protein: Number(protein || 0),
      carbohydrates: Number(carbohydrates !== undefined ? carbohydrates : (carbs || 0)),
      fats: Number(fats || 0),
      date: date || new Date().toISOString().split('T')[0],
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Meal logged successfully',
      data: meal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged meals for authenticated user
 * @route   GET /api/nutrition
 * @access  Private
 */
const getMeals = async (req, res, next) => {
  try {
    const { date, startDate, endDate, mealType } = req.query;

    const query = { userId: req.user._id };

    if (date) {
      query.date = date;
    } else if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }

    if (mealType && mealType !== 'All' && mealType !== 'all') {
      query.mealType = new RegExp(`^${mealType}$`, 'i');
    }

    const meals = await Meal.find(query).sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: meals.length,
      data: meals,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single meal by ID
 * @route   GET /api/nutrition/:id
 * @access  Private
 */
const getMealById = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal record not found',
      });
    }

    if (meal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this meal record',
      });
    }

    res.status(200).json({
      success: true,
      data: meal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update meal by ID
 * @route   PUT /api/nutrition/:id
 * @access  Private
 */
const updateMeal = async (req, res, next) => {
  try {
    let meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal record not found',
      });
    }

    if (meal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this meal record',
      });
    }

    const {
      foodName,
      name,
      mealType,
      quantity,
      calories,
      protein,
      carbohydrates,
      carbs,
      fats,
      date,
      notes,
    } = req.body;

    if (foodName || name) meal.foodName = foodName || name;
    if (mealType) meal.mealType = mealType;
    if (quantity) meal.quantity = quantity;
    if (calories !== undefined) meal.calories = Number(calories);
    if (protein !== undefined) meal.protein = Number(protein);
    if (carbohydrates !== undefined || carbs !== undefined) {
      meal.carbohydrates = Number(carbohydrates !== undefined ? carbohydrates : carbs);
    }
    if (fats !== undefined) meal.fats = Number(fats);
    if (date) meal.date = date;
    if (notes !== undefined) meal.notes = notes;

    const updatedMeal = await meal.save();

    res.status(200).json({
      success: true,
      message: 'Meal updated successfully',
      data: updatedMeal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete meal by ID
 * @route   DELETE /api/nutrition/:id
 * @access  Private
 */
const deleteMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal record not found',
      });
    }

    if (meal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this meal record',
      });
    }

    await meal.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Meal deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Calculate nutrition summary (daily totals from MongoDB records)
 * @route   GET /api/nutrition/summary
 * @access  Private
 */
const getNutritionSummary = async (req, res, next) => {
  try {
    const targetDate = req.query.date || new Date().toISOString().split('T')[0];

    const summaryResult = await Meal.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: targetDate,
        },
      },
      {
        $group: {
          _id: null,
          totalCalories: { $sum: '$calories' },
          totalProtein: { $sum: '$protein' },
          totalCarbohydrates: { $sum: '$carbohydrates' },
          totalFats: { $sum: '$fats' },
          mealCount: { $sum: 1 },
        },
      },
    ]);

    const totals = summaryResult[0] || {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbohydrates: 0,
      totalFats: 0,
      mealCount: 0,
    };

    res.status(200).json({
      success: true,
      date: targetDate,
      summary: {
        totalCalories: totals.totalCalories,
        totalProtein: totals.totalProtein,
        totalCarbohydrates: totals.totalCarbohydrates,
        totalFats: totals.totalFats,
        // Short aliases for frontend convenience
        calories: totals.totalCalories,
        protein: totals.totalProtein,
        carbs: totals.totalCarbohydrates,
        fats: totals.totalFats,
        mealCount: totals.mealCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMeal,
  getMeals,
  getMealById,
  updateMeal,
  deleteMeal,
  getNutritionSummary,
};
