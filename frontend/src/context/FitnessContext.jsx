import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
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
  initialNutritionGoals,
} from '../data/mockData';
import { getStorageItem, setStorageItem } from '../utils/localStorage';
import { workoutService } from '../services/workoutService';
import { nutritionService } from '../services/nutritionService';
import { goalService } from '../services/goalService';
import { scheduleService } from '../services/scheduleService';
import { progressService } from '../services/progressService';
import { notificationService } from '../services/notificationService';

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
  NUTRITION_GOALS: 'fitnexus_nutrition_goals',
};

export const FitnessProvider = ({ children }) => {
  // 1. Workouts catalog
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
  const [activeSession, setActiveSession] = useState(null);

  // Loading state
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Fetch initial live data from backend for logged in user
  const fetchBackendData = useCallback(async () => {
    const token = localStorage.getItem('fitnexus_token');
    if (!token) return;

    setIsDataLoading(true);
    try {
      // 1. Fetch user workouts
      const wkRes = await workoutService.getWorkouts().catch(() => null);
      if (wkRes?.data && wkRes.data.length > 0) {
        setUserWorkouts(wkRes.data);
      }

      // 2. Fetch logged meals
      const mealRes = await nutritionService.getMeals().catch(() => null);
      if (mealRes?.data && mealRes.data.length > 0) {
        setLoggedMeals(mealRes.data);
      }

      // 3. Fetch goals
      const goalRes = await goalService.getGoals().catch(() => null);
      if (goalRes?.data && goalRes.data.length > 0) {
        setGoals(goalRes.data);
      }

      // 4. Fetch schedules
      const schRes = await scheduleService.getSchedules().catch(() => null);
      if (schRes?.data && schRes.data.length > 0) {
        setSchedules(schRes.data);
      }

      // 5. Fetch progress history
      const progRes = await progressService.getProgress().catch(() => null);
      if (progRes?.data && progRes.data.length > 0) {
        setProgressHistory(progRes.data);
      }

      // 6. Fetch notifications
      const notifRes = await notificationService.getNotifications().catch(() => null);
      if (notifRes?.data && notifRes.data.length > 0) {
        setNotifications(notifRes.data);
      }
    } catch (err) {
      console.warn('[FitnessContext] Backend fetch notice:', err.message);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  // Fetch from backend on load and when token is available
  useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData]);

  // Local storage persistence effects
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
        carbs: acc.carbs + Number(meal.carbohydrates || meal.carbs || 0),
        fats: acc.fats + Number(meal.fats || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  }, [loggedMeals]);

  // Sync calories in metrics when meals change
  useEffect(() => {
    setMetrics((prev) => ({
      ...prev,
      calories: {
        ...prev.calories,
        consumed: nutritionTotals.calories,
        remaining: Math.max(0, prev.calories.target - nutritionTotals.calories),
      },
    }));
  }, [nutritionTotals.calories]);

  // Workouts Actions
  const toggleFavoriteWorkout = (workoutId) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === workoutId || w._id === workoutId ? { ...w, isFavorite: !w.isFavorite } : w))
    );
  };

  const addWorkoutToCatalog = (newWorkout) => {
    const item = {
      ...newWorkout,
      id: `wk-${Date.now()}`,
      rating: 5.0,
      isFavorite: false,
    };
    setWorkouts((prev) => [item, ...prev]);
    return item;
  };

  // User Workout Session Records (Manage Page)
  const addUserWorkout = async (workoutData) => {
    try {
      const res = await workoutService.createWorkout(workoutData);
      if (res?.data) {
        setUserWorkouts((prev) => [res.data, ...prev]);
        addNotification({
          type: 'workout',
          title: 'Workout Logged Successfully!',
          message: `${res.data.workoutName || 'New Session'} has been added to your training history.`,
          icon: 'Dumbbell',
        });
        return res.data;
      }
    } catch (err) {
      console.warn('[FitnessContext] Backend createWorkout failed, saving locally:', err);
    }

    // Fallback local creation
    const item = {
      ...workoutData,
      id: `uwk-${Date.now()}`,
      _id: `uwk-${Date.now()}`,
      date: workoutData.date || new Date().toISOString().split('T')[0],
    };
    setUserWorkouts((prev) => [item, ...prev]);
    addNotification({
      type: 'workout',
      title: 'Workout Logged Successfully!',
      message: `${workoutData.workoutName || 'New Session'} has been added to your training history.`,
      icon: 'Dumbbell',
    });
    return item;
  };

  const updateUserWorkout = async (id, updatedData) => {
    try {
      const res = await workoutService.updateWorkout(id, updatedData);
      if (res?.data) {
        setUserWorkouts((prev) =>
          prev.map((w) => (w._id === id || w.id === id ? res.data : w))
        );
        return res.data;
      }
    } catch (err) {
      console.warn('[FitnessContext] Backend updateWorkout failed, updating locally:', err);
    }

    setUserWorkouts((prev) =>
      prev.map((w) => (w.id === id || w._id === id ? { ...w, ...updatedData } : w))
    );
  };

  const deleteUserWorkout = async (id) => {
    try {
      await workoutService.deleteWorkout(id);
    } catch (err) {
      console.warn('[FitnessContext] Backend deleteWorkout failed, deleting locally:', err);
    }
    setUserWorkouts((prev) => prev.filter((w) => w.id !== id && w._id !== id));
  };

  // Nutrition & Food Actions
  const addLoggedMeal = async (mealData) => {
    try {
      const res = await nutritionService.createMeal(mealData);
      if (res?.data) {
        setLoggedMeals((prev) => [res.data, ...prev]);
        addNotification({
          type: 'meal',
          title: 'Meal Logged',
          message: `Added ${mealData.name || mealData.foodName} (${mealData.calories} kcal) to today's diet log.`,
          icon: 'Utensils',
        });
        return res.data;
      }
    } catch (err) {
      console.warn('[FitnessContext] Backend createMeal failed, saving locally:', err);
    }

    const item = {
      ...mealData,
      id: `log-${Date.now()}`,
      _id: `log-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setLoggedMeals((prev) => [item, ...prev]);
    addNotification({
      type: 'meal',
      title: 'Meal Logged',
      message: `Added ${mealData.name || mealData.foodName} (${mealData.calories} kcal) to today's diet log.`,
      icon: 'Utensils',
    });
    return item;
  };

  const updateLoggedMeal = async (id, updatedData) => {
    try {
      const res = await nutritionService.updateMeal(id, updatedData);
      if (res?.data) {
        setLoggedMeals((prev) =>
          prev.map((m) => (m._id === id || m.id === id ? res.data : m))
        );
        return res.data;
      }
    } catch (err) {
      console.warn('[FitnessContext] Backend updateMeal failed, updating locally:', err);
    }

    setLoggedMeals((prev) =>
      prev.map((m) => (m.id === id || m._id === id ? { ...m, ...updatedData } : m))
    );
  };

  const deleteLoggedMeal = async (id) => {
    try {
      await nutritionService.deleteMeal(id);
    } catch (err) {
      console.warn('[FitnessContext] Backend deleteMeal failed, deleting locally:', err);
    }
    setLoggedMeals((prev) => prev.filter((m) => m.id !== id && m._id !== id));
  };

  // Goals Actions
  const addGoal = async (goalData) => {
    try {
      const res = await goalService.createGoal(goalData);
      if (res?.data) {
        setGoals((prev) => [res.data, ...prev]);
        addNotification({
          type: 'goal',
          title: 'New Goal Set!',
          message: `Target for ${goalData.title}: ${goalData.target || goalData.targetValue} ${goalData.unit}.`,
          icon: 'Target',
        });
        return res.data;
      }
    } catch (err) {
      console.warn('[FitnessContext] Backend createGoal failed, saving locally:', err);
    }

    const item = {
      ...goalData,
      id: `goal-${Date.now()}`,
      _id: `goal-${Date.now()}`,
      completed: false,
    };
    setGoals((prev) => [item, ...prev]);
    addNotification({
      type: 'goal',
      title: 'New Goal Set!',
      message: `Target for ${goalData.title}: ${goalData.target || goalData.targetValue} ${goalData.unit}.`,
      icon: 'Target',
    });
    return item;
  };

  const updateGoal = async (id, updatedData) => {
    try {
      const res = await goalService.updateGoal(id, updatedData);
      if (res?.data) {
        setGoals((prev) =>
          prev.map((g) => (g._id === id || g.id === id ? res.data : g))
        );
        return res.data;
      }
    } catch (err) {
      console.warn('[FitnessContext] Backend updateGoal failed, updating locally:', err);
    }

    setGoals((prev) =>
      prev.map((g) => (g.id === id || g._id === id ? { ...g, ...updatedData } : g))
    );
  };

  const updateGoalProgress = async (id, increment) => {
    try {
      const res = await goalService.updateGoal(id, { increment });
      if (res?.data) {
        setGoals((prev) =>
          prev.map((g) => (g._id === id || g.id === id ? res.data : g))
        );
        if (res.data.completed) {
          addNotification({
            type: 'milestone',
            title: `Goal Completed: ${res.data.title}! 🏆`,
            message: `Congratulations! You reached your target of ${res.data.targetValue || res.data.target} ${res.data.unit}!`,
            icon: 'Trophy',
          });
        }
        return res.data;
      }
    } catch (err) {
      console.warn('[FitnessContext] Backend updateGoalProgress failed, updating locally:', err);
    }

    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id && g._id !== id) return g;
        const newCurrent = Number(g.current || g.currentValue) + Number(increment);
        const targetVal = Number(g.target || g.targetValue);
        const isCompleted = newCurrent >= targetVal;
        if (isCompleted && !g.completed) {
          addNotification({
            type: 'milestone',
            title: `Goal Completed: ${g.title}! 🏆`,
            message: `Congratulations! You reached your target of ${targetVal} ${g.unit}!`,
            icon: 'Trophy',
          });
        }
        return {
          ...g,
          current: newCurrent,
          currentValue: newCurrent,
          completed: isCompleted,
        };
      })
    );
  };

  const deleteGoal = async (id) => {
    try {
      await goalService.deleteGoal(id);
    } catch (err) {
      console.warn('[FitnessContext] Backend deleteGoal failed, deleting locally:', err);
    }
    setGoals((prev) => prev.filter((g) => g.id !== id && g._id !== id));
  };

  // Schedule Actions
  const addSchedule = async (scheduleData) => {
    try {
      const res = await scheduleService.createSchedule(scheduleData);
      if (res?.data) {
        setSchedules((prev) => [res.data, ...prev]);
        addNotification({
          type: 'workout',
          title: 'Activity Scheduled',
          message: `${scheduleData.activityName || scheduleData.title} on ${scheduleData.date} at ${scheduleData.time}.`,
          icon: 'Calendar',
        });
        return res.data;
      }
    } catch (err) {
      console.warn('[FitnessContext] Backend createSchedule failed, saving locally:', err);
    }

    const item = {
      ...scheduleData,
      id: `sch-${Date.now()}`,
      _id: `sch-${Date.now()}`,
      completed: false,
    };
    setSchedules((prev) => [item, ...prev]);
    addNotification({
      type: 'workout',
      title: 'Activity Scheduled',
      message: `${scheduleData.activityName || scheduleData.title} on ${scheduleData.date} at ${scheduleData.time}.`,
      icon: 'Calendar',
    });
    return item;
  };

  const updateSchedule = async (id, updatedData) => {
    try {
      const res = await scheduleService.updateSchedule(id, updatedData);
      if (res?.data) {
        setSchedules((prev) =>
          prev.map((s) => (s._id === id || s.id === id ? res.data : s))
        );
        return res.data;
      }
    } catch (err) {
      console.warn('[FitnessContext] Backend updateSchedule failed, updating locally:', err);
    }

    setSchedules((prev) =>
      prev.map((s) => (s.id === id || s._id === id ? { ...s, ...updatedData } : s))
    );
  };

  const toggleScheduleCompleted = async (id) => {
    const targetSchedule = schedules.find((s) => s.id === id || s._id === id);
    const newCompleted = targetSchedule ? !targetSchedule.completed : true;

    try {
      const res = await scheduleService.updateSchedule(id, { completed: newCompleted });
      if (res?.data) {
        setSchedules((prev) =>
          prev.map((s) => (s._id === id || s.id === id ? res.data : s))
        );
        return;
      }
    } catch (err) {
      console.warn('[FitnessContext] Backend toggleScheduleCompleted failed, updating locally:', err);
    }

    setSchedules((prev) =>
      prev.map((s) => (s.id === id || s._id === id ? { ...s, completed: newCompleted } : s))
    );
  };

  const deleteSchedule = async (id) => {
    try {
      await scheduleService.deleteSchedule(id);
    } catch (err) {
      console.warn('[FitnessContext] Backend deleteSchedule failed, deleting locally:', err);
    }
    setSchedules((prev) => prev.filter((s) => s.id !== id && s._id !== id));
  };

  // Progress Actions
  const addProgressRecord = async (recordData) => {
    try {
      const res = await progressService.createProgress(recordData);
      if (res?.data) {
        setProgressHistory((prev) => [res.data, ...prev]);
        addNotification({
          type: 'milestone',
          title: 'Progress Recorded!',
          message: `Logged new weight: ${recordData.weight} kg on ${recordData.date || 'today'}.`,
          icon: 'TrendingUp',
        });
        return res.data;
      }
    } catch (err) {
      console.warn('[FitnessContext] Backend createProgress failed, saving locally:', err);
    }

    const item = {
      ...recordData,
      id: `prog-${Date.now()}`,
      _id: `prog-${Date.now()}`,
      date: recordData.date || new Date().toISOString().split('T')[0],
    };
    setProgressHistory((prev) => [item, ...prev]);
    addNotification({
      type: 'milestone',
      title: 'Progress Recorded!',
      message: `Logged new weight: ${recordData.weight} kg on ${item.date}.`,
      icon: 'TrendingUp',
    });
    return item;
  };

  const deleteProgressRecord = async (id) => {
    try {
      await progressService.deleteProgress(id);
    } catch (err) {
      console.warn('[FitnessContext] Backend deleteProgress failed, deleting locally:', err);
    }
    setProgressHistory((prev) => prev.filter((p) => p.id !== id && p._id !== id));
  };

  // Metrics Quick Actions
  const logWater = (amountMl = 250) => {
    setMetrics((prev) => {
      const newCurrent = prev.water.current + amountMl;
      return {
        ...prev,
        water: {
          ...prev.water,
          current: newCurrent,
          glasses: Math.round(newCurrent / 250),
        },
      };
    });
  };

  const logSteps = (count = 500) => {
    setMetrics((prev) => ({
      ...prev,
      steps: {
        ...prev.steps,
        current: prev.steps.current + count,
        caloriesBurned: Math.round((prev.steps.current + count) * 0.045),
      },
    }));
  };

  // Notifications Actions
  const addNotification = async (notif) => {
    try {
      const res = await notificationService.createNotification(notif);
      if (res?.data) {
        setNotifications((prev) => [res.data, ...prev]);
        return;
      }
    } catch (err) {
      // Fallback local
    }

    const item = {
      ...notif,
      id: `notif-${Date.now()}`,
      _id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [item, ...prev]);
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
    } catch (err) {
      // Ignore
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id || n._id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
    } catch (err) {
      // Ignore
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
    } catch (err) {
      // Ignore
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id && n._id !== id));
  };

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
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
        setActiveSession,

        // Data refresh
        fetchBackendData,
        isDataLoading,
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
