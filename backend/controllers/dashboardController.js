const Workout = require('../models/Workout');
const Meal = require('../models/Meal');
const Goal = require('../models/Goal');
const Schedule = require('../models/Schedule');
const Progress = require('../models/Progress');
const User = require('../models/User');

/**
 * @desc    Get aggregated dashboard statistics for authenticated user
 * @route   GET /api/dashboard
 * @access  Private
 */
const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const today = new Date().toISOString().split('T')[0];

    // 1. User profile data
    const user = await User.findById(userId);

    // 2. Workouts stats
    const totalWorkouts = await Workout.countDocuments({ userId });
    const todayWorkouts = await Workout.find({ userId, date: today }).sort({ createdAt: -1 });
    const recentWorkouts = await Workout.find({ userId }).sort({ date: -1, createdAt: -1 }).limit(4);

    // 3. Nutrition stats (Today's calories & macros via aggregation)
    const todayNutritionAgg = await Meal.aggregate([
      {
        $match: {
          userId,
          date: today,
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

    const nutrition = todayNutritionAgg[0] || {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbohydrates: 0,
      totalFats: 0,
      mealCount: 0,
    };

    // 4. Progress records & current weight
    const progressRecords = await Progress.find({ userId })
      .sort({ date: 1, createdAt: 1 });

    const currentWeight =
      progressRecords.length > 0
        ? progressRecords[progressRecords.length - 1].weight
        : (user ? user.weight : 0);

    const startingWeight =
      progressRecords.length > 0
        ? progressRecords[0].weight
        : (user ? user.startingWeight || user.weight : 0);

    // 5. Weekly Workout Activity (last 7 days aggregation)
    // Generate dates for the last 7 days
    const past7Days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      const dayName = dayNames[d.getDay()];
      past7Days.push({ date: dateString, day: dayName });
    }

    const startDateStr = past7Days[0].date;
    const endDateStr = past7Days[6].date;

    const weeklyWorkoutsAgg = await Workout.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startDateStr, $lte: endDateStr },
        },
      },
      {
        $group: {
          _id: '$date',
          totalDuration: { $sum: '$duration' },
          workoutCount: { $sum: 1 },
          estimatedCalories: { $sum: { $multiply: ['$duration', 8] } }, // approx 8 kcal/min
        },
      },
    ]);

    const weeklyActivityMap = {};
    weeklyWorkoutsAgg.forEach((item) => {
      weeklyActivityMap[item._id] = item;
    });

    const weeklyActivity = past7Days.map(({ date, day }) => {
      const agg = weeklyActivityMap[date];
      return {
        date,
        day,
        workoutMins: agg ? agg.totalDuration : 0,
        targetMins: 45,
        calories: agg ? agg.estimatedCalories : 0,
      };
    });

    // 6. Fitness Goals Statistics
    const goals = await Goal.find({ userId });
    const totalGoals = goals.length;
    const completedGoals = goals.filter((g) => g.completed).length;
    const goalCompletionPercentage =
      totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    // 7. Upcoming Schedules (today or future dates)
    const upcomingSchedules = await Schedule.find({
      userId,
      date: { $gte: today },
    })
      .sort({ date: 1, time: 1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: {
        date: today,
        workouts: {
          todayCount: todayWorkouts.length,
          todayWorkouts,
          totalCount: totalWorkouts,
          recent: recentWorkouts,
        },
        nutrition: {
          todayCalories: nutrition.totalCalories,
          todayProtein: nutrition.totalProtein,
          todayCarbs: nutrition.totalCarbohydrates,
          todayFats: nutrition.totalFats,
          mealCount: nutrition.mealCount,
        },
        progress: {
          currentWeight,
          startingWeight,
          targetWeight: user ? user.targetWeight : 70,
          weightChange: Number((currentWeight - startingWeight).toFixed(1)),
          latestRecords: progressRecords.slice(-5),
        },
        weeklyActivity,
        goals: {
          total: totalGoals,
          completed: completedGoals,
          completionPercentage: goalCompletionPercentage,
          activeGoals: goals,
        },
        upcomingSchedules,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData,
};
