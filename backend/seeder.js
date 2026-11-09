const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Workout = require('./models/Workout');
const Meal = require('./models/Meal');
const Goal = require('./models/Goal');
const Schedule = require('./models/Schedule');
const Progress = require('./models/Progress');
const Notification = require('./models/Notification');

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitnexus';
    await mongoose.connect(mongoURI);
    console.log('[Seeder] Connected to MongoDB for seeding...');

    // Clear existing data for demo user
    const demoEmail = 'alex.rivera@fitnexus.io';
    const existingDemoUser = await User.findOne({ email: demoEmail });
    if (existingDemoUser) {
      await Workout.deleteMany({ userId: existingDemoUser._id });
      await Meal.deleteMany({ userId: existingDemoUser._id });
      await Goal.deleteMany({ userId: existingDemoUser._id });
      await Schedule.deleteMany({ userId: existingDemoUser._id });
      await Progress.deleteMany({ userId: existingDemoUser._id });
      await Notification.deleteMany({ userId: existingDemoUser._id });
      await User.deleteOne({ _id: existingDemoUser._id });
      console.log('[Seeder] Cleared previous demo user data.');
    }

    // 1. Create Demo User
    const demoUser = await User.create({
      name: 'Alex Rivera',
      email: demoEmail,
      password: 'password123',
      gender: 'Male',
      dateOfBirth: '1996-05-14',
      dob: '1996-05-14',
      height: 178,
      weight: 74.5,
      startingWeight: 79.3,
      targetWeight: 72.0,
      bodyFat: 14.8,
      bio: 'Fitness enthusiast striving for functional strength, athletic agility, and balanced holistic nutrition.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      membership: 'PRO Elite',
      streak: 24,
    });
    console.log(`[Seeder] Created Demo User: ${demoUser.name} (${demoUser.email})`);

    // 2. Workouts
    const workouts = [
      {
        userId: demoUser._id,
        workoutName: 'Morning Hypertrophy Push',
        exerciseName: 'Incline Dumbbell Press',
        category: 'Upper Body',
        sets: 4,
        reps: 10,
        weight: 28,
        duration: 45,
        date: new Date().toISOString().split('T')[0],
        notes: 'Felt strong, increased weight on 3rd set. Clean lockouts.',
        completed: true,
      },
      {
        userId: demoUser._id,
        workoutName: 'Heavy Leg Day Anchor',
        exerciseName: 'Barbell Back Squats',
        category: 'Gym',
        sets: 5,
        reps: 8,
        weight: 105,
        duration: 55,
        date: '2026-11-05',
        notes: 'Hit all sets with parallel depth. Great hamstring engagement.',
        completed: true,
      },
      {
        userId: demoUser._id,
        workoutName: 'Midweek Recovery Flow',
        exerciseName: 'Deep Pigeon & Spine Roll',
        category: 'Yoga',
        sets: 3,
        reps: 12,
        weight: 0,
        duration: 25,
        date: '2026-11-04',
        notes: 'Relieved lower back tightness from sitting. Excellent breath rhythm.',
        completed: true,
      },
      {
        userId: demoUser._id,
        workoutName: 'Explosive Boxing Conditioning',
        exerciseName: 'Speed Bag & Slip Rope',
        category: 'Boxing',
        sets: 6,
        reps: 3,
        weight: 2,
        duration: 35,
        date: '2026-11-02',
        notes: 'High sweat output. Heart rate averaged 155 BPM.',
        completed: true,
      },
    ];
    await Workout.insertMany(workouts);
    console.log(`[Seeder] Seeded ${workouts.length} workout logs.`);

    // 3. Meals
    const today = new Date().toISOString().split('T')[0];
    const meals = [
      {
        userId: demoUser._id,
        foodName: 'Scrambled Eggs with Turkey Bacon & Avocado',
        mealType: 'Breakfast',
        quantity: '1 serving',
        calories: 420,
        protein: 34,
        carbohydrates: 8,
        fats: 28,
        date: today,
        notes: '3 eggs, 2 slices uncured turkey bacon, half avocado.',
      },
      {
        userId: demoUser._id,
        foodName: 'Superfood Berry & Spinach Protein Smoothie',
        mealType: 'Snacks',
        quantity: '1 tall shake (350ml)',
        calories: 290,
        protein: 26,
        carbohydrates: 36,
        fats: 5,
        date: today,
        notes: 'Whey protein, blueberries, spinach, coconut water.',
      },
      {
        userId: demoUser._id,
        foodName: 'Grilled Salmon & Quinoa Power Bowl',
        mealType: 'Lunch',
        quantity: '1 bowl',
        calories: 580,
        protein: 44,
        carbohydrates: 48,
        fats: 22,
        date: today,
        notes: 'Wild salmon fillet, tri-color quinoa, roasted sweet potatoes.',
      },
      {
        userId: demoUser._id,
        foodName: 'Chicken Breast, Brown Rice & Broccoli',
        mealType: 'Dinner',
        quantity: '1 plate',
        calories: 510,
        protein: 48,
        carbohydrates: 52,
        fats: 12,
        date: today,
        notes: 'Lean grilled chicken with steamed broccoli.',
      },
    ];
    await Meal.insertMany(meals);
    console.log(`[Seeder] Seeded ${meals.length} nutrition logs.`);

    // 4. Goals
    const goals = [
      {
        userId: demoUser._id,
        title: 'Lean Bodyweight Target',
        category: 'Weight Loss',
        targetValue: 72.0,
        currentValue: 74.5,
        unit: 'kg',
        deadline: '2026-12-31',
        status: 'In Progress',
        completed: false,
        notes: 'Maintain muscle mass while dropping remaining body fat.',
      },
      {
        userId: demoUser._id,
        title: 'Daily Active Step Count',
        category: 'Daily Steps',
        targetValue: 10000,
        currentValue: 8432,
        unit: 'steps/day',
        deadline: 'Daily',
        status: 'In Progress',
        completed: false,
        notes: 'Hit at least 8k before dinner.',
      },
      {
        userId: demoUser._id,
        title: 'Weekly Workout Consistency',
        category: 'Workout Frequency',
        targetValue: 5,
        currentValue: 4,
        unit: 'sessions/week',
        deadline: 'Weekly',
        status: 'In Progress',
        completed: false,
        notes: '4 lifting days + 1 dedicated mobility session.',
      },
      {
        userId: demoUser._id,
        title: 'Daily Hydration Minimum',
        category: 'Water Intake',
        targetValue: 3000,
        currentValue: 2250,
        unit: 'ml/day',
        deadline: 'Daily',
        status: 'In Progress',
        completed: false,
        notes: 'Drink 500ml upon waking and 750ml during workout.',
      },
      {
        userId: demoUser._id,
        title: 'Deadlift 2x Bodyweight',
        category: 'Strength',
        targetValue: 150,
        currentValue: 150,
        unit: 'kg PR',
        deadline: '2026-12-15',
        status: 'Completed',
        completed: true,
        notes: 'Strict conventional barbell pull with zero lumbar rounding.',
      },
    ];
    await Goal.insertMany(goals);
    console.log(`[Seeder] Seeded ${goals.length} fitness goals.`);

    // 5. Schedules
    const schedules = [
      {
        userId: demoUser._id,
        title: 'Upper Body Power & Core',
        activityType: 'Workout',
        category: 'Gym',
        date: today,
        time: '07:30 AM',
        duration: '50 min',
        notes: 'Incline bench press, weighted dips, and hanging leg raises.',
        completed: true,
      },
      {
        userId: demoUser._id,
        title: 'Hydration & Post-Workout Whey Shake',
        activityType: 'Meal Reminder',
        category: 'Diet',
        date: today,
        time: '08:45 AM',
        duration: '15 min',
        notes: '35g whey isolate + 5g creatine + 500ml water.',
        completed: true,
      },
      {
        userId: demoUser._id,
        title: 'Sunset 5K Tempo Run',
        activityType: 'Cardio',
        category: 'Cardio',
        date: '2026-11-10',
        time: '06:00 PM',
        duration: '35 min',
        notes: 'Maintain 5:15/km pace across riverside trail.',
        completed: false,
      },
      {
        userId: demoUser._id,
        title: 'Lower Body Quad & Posterior Focus',
        activityType: 'Workout',
        category: 'Gym',
        date: '2026-11-11',
        time: '07:00 AM',
        duration: '60 min',
        notes: 'Barbell squats, Romanian deadlifts, Bulgarian split squats.',
        completed: false,
      },
    ];
    await Schedule.insertMany(schedules);
    console.log(`[Seeder] Seeded ${schedules.length} schedules.`);

    // 6. Progress
    const progressRecords = [
      {
        userId: demoUser._id,
        date: '2026-10-10',
        weight: 79.3,
        chest: 104,
        waist: 87,
        hips: 98,
        arms: 37.0,
        bodyFat: 18.2,
        notes: 'Starting baseline measurement for Q4 fitness sprint.',
      },
      {
        userId: demoUser._id,
        date: '2026-10-17',
        weight: 78.4,
        chest: 104.2,
        waist: 86,
        hips: 97.5,
        arms: 37.2,
        bodyFat: 17.5,
        notes: 'Water weight shed, energy levels solid with 2,400 kcal budget.',
      },
      {
        userId: demoUser._id,
        date: '2026-10-24',
        weight: 77.1,
        chest: 104.5,
        waist: 84.5,
        hips: 96.5,
        arms: 37.5,
        bodyFat: 16.8,
        notes: 'Waist circumference down 2.5cm! Strength on compound lifts maintained.',
      },
      {
        userId: demoUser._id,
        date: '2026-10-31',
        weight: 76.0,
        chest: 104.8,
        waist: 83.0,
        hips: 95.8,
        arms: 37.8,
        bodyFat: 15.9,
        notes: 'Consistent 5 days/week training streak.',
      },
      {
        userId: demoUser._id,
        date: today,
        weight: 74.5,
        chest: 105.0,
        waist: 81.5,
        hips: 95.0,
        arms: 38.0,
        bodyFat: 14.8,
        notes: 'Abdominal vascularity showing. Surpassed 4.8kg total drop!',
      },
    ];
    await Progress.insertMany(progressRecords);
    console.log(`[Seeder] Seeded ${progressRecords.length} progress records.`);

    // 7. Notifications
    const notifications = [
      {
        userId: demoUser._id,
        type: 'workout',
        title: 'Upcoming Workout Reminder',
        message: 'Upper Body Power & Core is scheduled tomorrow at 07:30 AM.',
        icon: 'Dumbbell',
        read: false,
      },
      {
        userId: demoUser._id,
        type: 'goal',
        title: 'Milestone Unlocked! 🏆',
        message: 'You have achieved your Deadlift 2x Bodyweight target at 150 kg!',
        icon: 'Trophy',
        read: false,
      },
      {
        userId: demoUser._id,
        type: 'nutrition',
        title: 'Daily Hydration Check',
        message: 'You are at 2,250 ml. Only 750 ml left to hit today’s 3,000 ml target.',
        icon: 'Droplet',
        read: true,
      },
      {
        userId: demoUser._id,
        type: 'milestone',
        title: 'Streak Multiplier Active 🔥',
        message: 'You are on a 24-day consecutive active fitness streak. Keep going!',
        icon: 'Flame',
        read: true,
      },
    ];
    await Notification.insertMany(notifications);
    console.log(`[Seeder] Seeded ${notifications.length} athlete notifications.`);

    console.log('\n[Seeder] Complete database seeding successful!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

seedData();
