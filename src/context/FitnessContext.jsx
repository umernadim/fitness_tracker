import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  initialWorkouts,
  initialUserWorkouts,
  initialFoodCatalog,
  initialLoggedMeals,
  initialGoals,
  initialSchedules,
  initialProgressHistory,
  initialNotifications,
  initialMetrics,
  initialNutritionGoals
} from '../data/mockData';
import { getStorageItem, setStorageItem } from '../utils/localStorage';

const FitnessContext = createContext();

const STORAGE_KEYS = {
  WORKOUTS: 'fitnexus_workouts',
  USER_WORKOUTS: 'fitnexus_user_workouts',
  FOOD_CATALOG: 'fitnexus_food_catalog',
  LOGGED_MEALS: 'fitnexus_logged_meals',
  GOALS: 'fitnexus_goals',
  SCHEDULES: 'fitnexus_schedules',
  PROGRESS: 'fitnexus_progress_history',
  NOTIFICATIONS: 'fitnexus_notifications',
  METRICS: 'fitnexus_metrics',
  NUTRITION_GOALS: 'fitnexus_nutrition_goals'
};

export const FitnessProvider = ({ children }) => {
  // 1. Workouts
  const [workouts, setWorkouts] = useState(() =>
    getStorageItem(STORAGE_KEYS.WORKOUTS, initialWorkouts)
  );

  // 2. User logged workout sessions (Workout Management)
  const [userWorkouts, setUserWorkouts] = useState(() =>
    getStorageItem(STORAGE_KEYS.USER_WORKOUTS, initialUserWorkouts)
  );

  // 3. Food Catalog & Meals
  const [foodCatalog, setFoodCatalog] = useState(() =>
    getStorageItem(STORAGE_KEYS.FOOD_CATALOG, initialFoodCatalog)
  );

  const [loggedMeals, setLoggedMeals] = useState(() =>
    getStorageItem(STORAGE_KEYS.LOGGED_MEALS, initialLoggedMeals)
  );

  const [nutritionGoals, setNutritionGoals] = useState(() =>
    getStorageItem(STORAGE_KEYS.NUTRITION_GOALS, initialNutritionGoals)
  );

  // 4. Goals
  const [goals, setGoals] = useState(() =>
    getStorageItem(STORAGE_KEYS.GOALS, initialGoals)
  );

  // 5. Schedules
  const [schedules, setSchedules] = useState(() =>
    getStorageItem(STORAGE_KEYS.SCHEDULES, initialSchedules)
  );

  // 6. Progress History
  const [progressHistory, setProgressHistory] = useState(() =>
    getStorageItem(STORAGE_KEYS.PROGRESS, initialProgressHistory)
  );

  // 7. Notifications
  const [notifications, setNotifications] = useState(() =>
    getStorageItem(STORAGE_KEYS.NOTIFICATIONS, initialNotifications)
  );

  // 8. Live Metrics (Steps, Water, Heart Rate, Calories)
  const [metrics, setMetrics] = useState(() =>
    getStorageItem(STORAGE_KEYS.METRICS, initialMetrics)
  );

  // 9. Modals / Interactive Active Items
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [activeSession, setActiveSession] = useState(null); // When user clicks "Start Workout"

  // Persistence effects
  useEffect(() => { setStorageItem(STORAGE_KEYS.WORKOUTS, workouts); }, [workouts]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.USER_WORKOUTS, userWorkouts); }, [userWorkouts]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.FOOD_CATALOG, foodCatalog); }, [foodCatalog]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.LOGGED_MEALS, loggedMeals); }, [loggedMeals]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.GOALS, goals); }, [goals]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.SCHEDULES, schedules); }, [schedules]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.PROGRESS, progressHistory); }, [progressHistory]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.NOTIFICATIONS, notifications); }, [notifications]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.METRICS, metrics); }, [metrics]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.NUTRITION_GOALS, nutritionGoals); }, [nutritionGoals]);

  // Derived live nutrition totals
  const nutritionTotals = useMemo(() => {
    return loggedMeals.reduce(
      (acc, meal) => ({
        calories: acc.calories + Number(meal.calories || 0),
        protein: acc.protein + Number(meal.protein || 0),
        carbs: acc.carbs + Number(meal.carbs || 0),
        fats: acc.fats + Number(meal.fats || 0)
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  }, [loggedMeals]);

  // Sync calories in metrics when meals change
  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      calories: {
        ...prev.calories,
        consumed: nutritionTotals.calories,
        remaining: Math.max(0, prev.calories.target - nutritionTotals.calories)
      }
    }));
  }, [nutritionTotals.calories]);

  // Workouts Actions
  const toggleFavoriteWorkout = (workoutId) => {
    setWorkouts(prev =>
      prev.map(w => (w.id === workoutId ? { ...w, isFavorite: !w.isFavorite } : w))
    );
  };

  const addWorkoutToCatalog = (newWorkout) => {
    const item = {
      ...newWorkout,
      id: `wk-${Date.now()}`,
      rating: 5.0,
      isFavorite: false
    };
    setWorkouts(prev => [item, ...prev]);
    return item;
  };

  // User Workout Session Records (Manage Page)
  const addUserWorkout = (workoutData) => {
    const item = {
      ...workoutData,
      id: `uwk-${Date.now()}`,
      date: workoutData.date || new Date().toISOString().split('T')[0]
    };
    setUserWorkouts(prev => [item, ...prev]);
    addNotification({
      type: 'workout',
      title: 'Workout Logged Successfully!',
      message: `${workoutData.workoutName || 'New Session'} has been added to your training history.`,
      icon: 'Dumbbell'
    });
    return item;
  };

  const updateUserWorkout = (id, updatedData) => {
    setUserWorkouts(prev =>
      prev.map(w => (w.id === id ? { ...w, ...updatedData } : w))
    );
  };

  const deleteUserWorkout = (id) => {
    setUserWorkouts(prev => prev.filter(w => w.id !== id));
  };

  // Nutrition & Food Actions
  const addLoggedMeal = (mealData) => {
    const item = {
      ...mealData,
      id: `log-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setLoggedMeals(prev => [item, ...prev]);
    addNotification({
      type: 'meal',
      title: 'Meal Logged',
      message: `Added ${mealData.name} (${mealData.calories} kcal) to today's diet log.`,
      icon: 'Utensils'
    });
    return item;
  };

  const updateLoggedMeal = (id, updatedData) => {
    setLoggedMeals(prev =>
      prev.map(m => (m.id === id ? { ...m, ...updatedData } : m))
    );
  };

  const deleteLoggedMeal = (id) => {
    setLoggedMeals(prev => prev.filter(m => m.id !== id));
  };

  // Goals Actions
  const addGoal = (goalData) => {
    const item = {
      ...goalData,
      id: `goal-${Date.now()}`,
      completed: false
    };
    setGoals(prev => [item, ...prev]);
    addNotification({
      type: 'goal',
      title: 'New Goal Set!',
      message: `Target for ${goalData.title}: ${goalData.target} ${goalData.unit}.`,
      icon: 'Target'
    });
    return item;
  };

  const updateGoal = (id, updatedData) => {
    setGoals(prev =>
      prev.map(g => (g.id === id ? { ...g, ...updatedData } : g))
    );
  };

  const updateGoalProgress = (id, increment) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id !== id) return g;
        const newCurrent = Number(g.current) + Number(increment);
        const isCompleted = newCurrent >= Number(g.target);
        if (isCompleted && !g.completed) {
          addNotification({
            type: 'milestone',
            title: `Goal Completed: ${g.title}! 🏆`,
            message: `Congratulations! You reached your target of ${g.target} ${g.unit}!`,
            icon: 'Trophy'
          });
        }
        return {
          ...g,
          current: newCurrent,
          completed: isCompleted
        };
      })
    );
  };

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Schedule Actions
  const addSchedule = (scheduleData) => {
    const item = {
      ...scheduleData,
      id: `sch-${Date.now()}`,
      completed: false
    };
    setSchedules(prev => [item, ...prev]);
    addNotification({
      type: 'workout',
      title: 'Activity Scheduled',
      message: `${scheduleData.activityName} on ${scheduleData.date} at ${scheduleData.time}.`,
      icon: 'Calendar'
    });
    return item;
  };

  const updateSchedule = (id, updatedData) => {
    setSchedules(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updatedData } : s))
    );
  };

  const toggleScheduleCompleted = (id) => {
    setSchedules(prev =>
      prev.map(s => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const deleteSchedule = (id) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  // Progress Actions
  const addProgressRecord = (recordData) => {
    const item = {
      ...recordData,
      id: `prog-${Date.now()}`,
      date: recordData.date || new Date().toISOString().split('T')[0]
    };
    setProgressHistory(prev => [item, ...prev]);
    addNotification({
      type: 'milestone',
      title: 'Progress Recorded!',
      message: `Logged new weight: ${recordData.weight} kg on ${item.date}.`,
      icon: 'TrendingUp'
    });
    return item;
  };

  const deleteProgressRecord = (id) => {
    setProgressHistory(prev => prev.filter(p => p.id !== id));
  };

  // Metrics Quick Actions
  const logWater = (amountMl = 250) => {
    setMetrics(prev => {
      const newCurrent = prev.water.current + amountMl;
      return {
        ...prev,
        water: {
          ...prev.water,
          current: newCurrent,
          glasses: Math.round(newCurrent / 250)
        }
      };
    });
  };

  const logSteps = (count = 500) => {
    setMetrics(prev => ({
      ...prev,
      steps: {
        ...prev.steps,
        current: prev.steps.current + count,
        caloriesBurned: Math.round((prev.steps.current + count) * 0.045)
      }
    }));
  };

  // Notifications Actions
  const addNotification = (notif) => {
    const item = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [item, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  return (
    <FitnessContext.Provider
      value={{
        // Workouts
        workouts,
        toggleFavoriteWorkout,
        addWorkoutToCatalog,
        userWorkouts,
        addUserWorkout,
        updateUserWorkout,
        deleteUserWorkout,

        // Nutrition
        foodCatalog,
        loggedMeals,
        addLoggedMeal,
        updateLoggedMeal,
        deleteLoggedMeal,
        nutritionTotals,
        nutritionGoals,
        setNutritionGoals,

        // Goals
        goals,
        addGoal,
        updateGoal,
        updateGoalProgress,
        deleteGoal,

        // Schedules
        schedules,
        addSchedule,
        updateSchedule,
        toggleScheduleCompleted,
        deleteSchedule,

        // Progress
        progressHistory,
        addProgressRecord,
        deleteProgressRecord,

        // Metrics
        metrics,
        logWater,
        logSteps,

        // Notifications
        notifications,
        unreadNotificationsCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        addNotification,

        // Modals / Interactive Active Sessions
        selectedWorkout,
        setSelectedWorkout,
        selectedMeal,
        setSelectedMeal,
        activeSession,
        setActiveSession
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
};
