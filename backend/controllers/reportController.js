const Workout = require('../models/Workout');
const Meal = require('../models/Meal');
const Progress = require('../models/Progress');
const User = require('../models/User');

/**
 * Helper to calculate start and end dates based on range string
 */
const getDateRangeFilter = (range, customStart, customEnd) => {
  if (customStart && customEnd) {
    return { startDate: customStart, endDate: customEnd };
  }

  const end = new Date();
  const start = new Date();

  switch (range) {
    case '7days':
      start.setDate(end.getDate() - 7);
      break;
    case '30days':
      start.setDate(end.getDate() - 30);
      break;
    case 'thisMonth':
      start.setDate(1);
      break;
    case 'thisYear':
      start.setMonth(0, 1);
      break;
    default:
      start.setDate(end.getDate() - 30);
  }

  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
};

/**
 * @desc    Get fitness report data with date filtering
 * @route   GET /api/reports/fitness
 * @access  Private
 */
const getFitnessReport = async (req, res, next) => {
  try {
    const { range, startDate, endDate } = req.query;
    const dateRange = getDateRangeFilter(range, startDate, endDate);

    const workouts = await Workout.find({
      userId: req.user._id,
      date: { $gte: dateRange.startDate, $lte: dateRange.endDate },
    }).sort({ date: 1 });

    const totalSessions = workouts.length;
    const totalMinutes = workouts.reduce((sum, w) => sum + Number(w.duration || 0), 0);
    const totalVolume = workouts.reduce(
      (sum, w) => sum + Number(w.sets || 0) * Number(w.reps || 0) * Number(w.weight || 0),
      0
    );
    const avgDuration = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
    const estimatedCaloriesBurned = workouts.reduce(
      (sum, w) => sum + Number(w.duration || 0) * 8,
      0
    );

    // Group by category
    const categoryMap = {};
    workouts.forEach((w) => {
      const cat = w.category || 'Other';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    const categoryBreakdown = Object.keys(categoryMap).map((cat) => ({
      name: cat,
      count: categoryMap[cat],
      percentage: Math.round((categoryMap[cat] / (totalSessions || 1)) * 100),
    }));

    // Group by date for charts
    const dailyVolumeMap = {};
    workouts.forEach((w) => {
      if (!dailyVolumeMap[w.date]) {
        dailyVolumeMap[w.date] = { date: w.date, duration: 0, volume: 0, sessions: 0 };
      }
      dailyVolumeMap[w.date].duration += Number(w.duration || 0);
      dailyVolumeMap[w.date].volume +=
        Number(w.sets || 0) * Number(w.reps || 0) * Number(w.weight || 0);
      dailyVolumeMap[w.date].sessions += 1;
    });

    const dailyActivity = Object.values(dailyVolumeMap);

    res.status(200).json({
      success: true,
      range: range || '30days',
      dateRange,
      summary: {
        totalSessions,
        totalMinutes,
        totalHours: Number((totalMinutes / 60).toFixed(1)),
        totalVolume,
        avgDuration,
        estimatedCaloriesBurned,
      },
      categoryBreakdown,
      dailyActivity,
      workouts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get nutrition report data with date filtering
 * @route   GET /api/reports/nutrition
 * @access  Private
 */
const getNutritionReport = async (req, res, next) => {
  try {
    const { range, startDate, endDate } = req.query;
    const dateRange = getDateRangeFilter(range, startDate, endDate);

    const meals = await Meal.find({
      userId: req.user._id,
      date: { $gte: dateRange.startDate, $lte: dateRange.endDate },
    }).sort({ date: 1 });

    const totalMeals = meals.length;
    const totalCalories = meals.reduce((sum, m) => sum + Number(m.calories || 0), 0);
    const totalProtein = meals.reduce((sum, m) => sum + Number(m.protein || 0), 0);
    const totalCarbohydrates = meals.reduce((sum, m) => sum + Number(m.carbohydrates || 0), 0);
    const totalFats = meals.reduce((sum, m) => sum + Number(m.fats || 0), 0);

    // Group meals by date
    const dailyNutritionMap = {};
    meals.forEach((m) => {
      if (!dailyNutritionMap[m.date]) {
        dailyNutritionMap[m.date] = {
          date: m.date,
          calories: 0,
          protein: 0,
          carbohydrates: 0,
          fats: 0,
          mealCount: 0,
        };
      }
      dailyNutritionMap[m.date].calories += Number(m.calories || 0);
      dailyNutritionMap[m.date].protein += Number(m.protein || 0);
      dailyNutritionMap[m.date].carbohydrates += Number(m.carbohydrates || 0);
      dailyNutritionMap[m.date].fats += Number(m.fats || 0);
      dailyNutritionMap[m.date].mealCount += 1;
    });

    const dailyBreakdown = Object.values(dailyNutritionMap);
    const daysCount = dailyBreakdown.length || 1;

    const dailyAverages = {
      avgCalories: Math.round(totalCalories / daysCount),
      avgProtein: Math.round(totalProtein / daysCount),
      avgCarbohydrates: Math.round(totalCarbohydrates / daysCount),
      avgFats: Math.round(totalFats / daysCount),
    };

    res.status(200).json({
      success: true,
      range: range || '30days',
      dateRange,
      summary: {
        totalMeals,
        totalCalories,
        totalProtein,
        totalCarbohydrates,
        totalFats,
        dailyAverages,
      },
      dailyBreakdown,
      meals,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export workouts report as downloadable CSV
 * @route   GET /api/reports/export/workouts
 * @access  Private
 */
const exportWorkoutsCSV = async (req, res, next) => {
  try {
    const workouts = await Workout.find({ userId: req.user._id }).sort({ date: -1 });

    const headers = 'Date,WorkoutName,Exercise,Category,Sets,Reps,WeightKg,DurationMins,Completed,Notes\n';
    const rows = workouts
      .map((w) => {
        const cleanNotes = (w.notes || '').replace(/[\r\n,]/g, ' ');
        const cleanWorkout = (w.workoutName || '').replace(/,/g, ' ');
        const cleanExercise = (w.exerciseName || '').replace(/,/g, ' ');
        return `${w.date},"${cleanWorkout}","${cleanExercise}","${w.category}",${w.sets},${w.reps},${w.weight},${w.duration},${w.completed},"${cleanNotes}"`;
      })
      .join('\n');

    const csvContent = headers + rows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="fitnexus-workouts-${new Date().toISOString().split('T')[0]}.csv"`
    );
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export nutrition report as downloadable CSV
 * @route   GET /api/reports/export/nutrition
 * @access  Private
 */
const exportNutritionCSV = async (req, res, next) => {
  try {
    const meals = await Meal.find({ userId: req.user._id }).sort({ date: -1 });

    const headers = 'Date,FoodName,MealType,Quantity,Calories,ProteinGrams,CarbsGrams,FatsGrams,Notes\n';
    const rows = meals
      .map((m) => {
        const cleanFood = (m.foodName || '').replace(/,/g, ' ');
        const cleanQty = (m.quantity || '').replace(/,/g, ' ');
        const cleanNotes = (m.notes || '').replace(/[\r\n,]/g, ' ');
        return `${m.date},"${cleanFood}","${m.mealType}","${cleanQty}",${m.calories},${m.protein},${m.carbohydrates},${m.fats},"${cleanNotes}"`;
      })
      .join('\n');

    const csvContent = headers + rows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="fitnexus-nutrition-${new Date().toISOString().split('T')[0]}.csv"`
    );
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFitnessReport,
  getNutritionReport,
  exportWorkoutsCSV,
  exportNutritionCSV,
};
