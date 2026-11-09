/**
 * FitNexus Complete Backend API Test Suite
 * Tests all endpoints, validation, authentication, and data isolation
 */

const BASE_URL = 'http://localhost:3000/api';

const runTests = async () => {
  console.log('\n======================================================');
  console.log('       FITNEXUS BACKEND API AUTOMATED TEST SUITE       ');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} ${details ? `- ${details}` : ''}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'success', 'Health Check Endpoint (/api/health)');

    // 2. Register User 1
    const uniqueEmail = `testuser_${Date.now()}@fitnexus.io`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jordan Hayes',
        email: uniqueEmail,
        password: 'password123',
        confirmPassword: 'password123',
        gender: 'Male',
        dateOfBirth: '1995-08-20',
      }),
    });
    const regData = await regRes.json();
    assert(regRes.status === 201 && regData.token && regData.user.email === uniqueEmail, 'Register New Athlete User');
    const user1Token = regData.token;
    const user1Id = regData.user.id;

    // 3. Register Duplicate Email Error
    const dupRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate Jordan',
        email: uniqueEmail,
        password: 'password123',
      }),
    });
    assert(dupRes.status === 400, 'Duplicate Email Prevention (400 Bad Request)');

    // 4. Invalid Password Login
    const invalidLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'wrongpassword',
      }),
    });
    assert(invalidLoginRes.status === 401, 'Invalid Password Rejection (401 Unauthorized)');

    // 5. Valid Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'password123',
      }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && loginData.token, 'Athlete Login with Valid Credentials');

    // 6. Get Current User (/api/auth/me)
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.user.name === 'Jordan Hayes', 'Get Current User (/api/auth/me)');

    // 7. Forgot Password & Reset Password Workflow
    const forgotRes = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: uniqueEmail }),
    });
    const forgotData = await forgotRes.json();
    assert(forgotRes.status === 200 && forgotData.resetToken, 'Forgot Password Recovery Token Generation');

    const resetRes = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resetToken: forgotData.resetToken,
        password: 'newpassword123',
        confirmPassword: 'newpassword123',
      }),
    });
    const resetData = await resetRes.json();
    assert(resetRes.status === 200 && resetData.token, 'Reset Password with Token');

    // Re-login with new password
    const newLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'newpassword123',
      }),
    });
    const newLoginData = await newLoginRes.json();
    const token = newLoginData.token;
    assert(newLoginRes.status === 200, 'Login with New Reset Password');

    // 8. User Profile (GET & PUT)
    const profilePutRes = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'Jordan Alexander Hayes',
        height: 182,
        weight: 78.5,
        bio: 'Functional athlete targeting marathon stamina and 150kg deadlift.',
      }),
    });
    const profilePutData = await profilePutRes.json();
    assert(
      profilePutRes.status === 200 &&
        profilePutData.user.name === 'Jordan Alexander Hayes' &&
        profilePutData.user.height === 182,
      'Update User Profile (/api/users/profile)'
    );

    // 9. Workouts CRUD & Search/Filter
    const createWkRes = await fetch(`${BASE_URL}/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        workoutName: 'Morning Hypertrophy Push',
        exerciseName: 'Incline Dumbbell Press',
        category: 'Upper Body',
        sets: 4,
        reps: 10,
        weight: 28,
        duration: 45,
        date: '2026-11-09',
        notes: 'Great pump, increased load on 3rd set',
      }),
    });
    const createWkData = await createWkRes.json();
    assert(createWkRes.status === 201 && createWkData.data._id, 'Create Workout Record');
    const workoutId = createWkData.data._id;

    // Get workouts
    const getWkRes = await fetch(`${BASE_URL}/workouts?category=Upper Body&search=Dumbbell`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const getWkData = await getWkRes.json();
    assert(getWkRes.status === 200 && getWkData.count >= 1, 'Get Workouts with Filter & Search');

    // Update workout
    const updateWkRes = await fetch(`${BASE_URL}/workouts/${workoutId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ weight: 30, reps: 12 }),
    });
    const updateWkData = await updateWkRes.json();
    assert(updateWkRes.status === 200 && updateWkData.data.weight === 30, 'Update Workout Record');

    // 10. Nutrition CRUD & Summary Aggregation
    const createMealRes = await fetch(`${BASE_URL}/nutrition`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        foodName: 'Grilled Chicken Breast & Brown Rice',
        mealType: 'Lunch',
        quantity: '1 plate',
        calories: 520,
        protein: 48,
        carbohydrates: 55,
        fats: 12,
        date: '2026-11-09',
      }),
    });
    const createMealData = await createMealRes.json();
    assert(createMealRes.status === 201 && createMealData.data._id, 'Log Nutrition Meal Record');
    const mealId = createMealData.data._id;

    // Nutrition summary
    const summaryRes = await fetch(`${BASE_URL}/nutrition/summary?date=2026-11-09`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const summaryData = await summaryRes.json();
    assert(
      summaryRes.status === 200 &&
        summaryData.summary.totalCalories >= 520 &&
        summaryData.summary.totalProtein >= 48,
      'Nutrition Summary Aggregation (MongoDB Records)'
    );

    // 11. Fitness Goals CRUD & Percentage Calculation
    const createGoalRes = await fetch(`${BASE_URL}/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: 'Deadlift Double Bodyweight',
        category: 'Strength',
        targetValue: 150,
        currentValue: 120,
        unit: 'kg',
        deadline: '2026-12-31',
      }),
    });
    const createGoalData = await createGoalRes.json();
    assert(createGoalRes.status === 201 && createGoalData.data._id, 'Create Fitness Goal');
    const goalId = createGoalData.data._id;

    // Check percentage virtual
    const getGoalsRes = await fetch(`${BASE_URL}/goals`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const getGoalsData = await getGoalsRes.json();
    const fetchedGoal = getGoalsData.data.find((g) => g._id === goalId);
    assert(
      getGoalsRes.status === 200 && fetchedGoal && fetchedGoal.percentage === 80,
      'Goal Completion Percentage Calculation (120/150 = 80%)'
    );

    // 12. Workout Schedule CRUD & Filter
    const createSchRes = await fetch(`${BASE_URL}/schedules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: 'Sunset 5K Tempo Run',
        activityType: 'Cardio',
        category: 'Cardio',
        date: '2026-11-09',
        time: '06:00 PM',
        duration: '35 min',
      }),
    });
    const createSchData = await createSchRes.json();
    assert(createSchRes.status === 201 && createSchData.data._id, 'Create Scheduled Activity');
    const scheduleId = createSchData.data._id;

    const getSchRes = await fetch(`${BASE_URL}/schedules?date=2026-11-09`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const getSchData = await getSchRes.json();
    assert(getSchRes.status === 200 && getSchData.count >= 1, 'Filter Schedules by Date');

    // 13. Progress Tracking CRUD & Summary
    const createProgRes = await fetch(`${BASE_URL}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        weight: 78.5,
        chest: 104,
        waist: 82,
        hips: 96,
        arms: 38,
        bodyFat: 14.5,
        date: '2026-11-09',
        notes: 'Veins visible on forearms, waist down 1cm',
      }),
    });
    const createProgData = await createProgRes.json();
    assert(createProgRes.status === 201 && createProgData.data._id, 'Record Body Progress Measurements');

    const progSummaryRes = await fetch(`${BASE_URL}/progress/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const progSummaryData = await progSummaryRes.json();
    assert(
      progSummaryRes.status === 200 && progSummaryData.summary.currentWeight === 78.5,
      'Body Progress Summary Calculation'
    );

    // 14. Notifications CRUD, Mark-as-read, Unread Count
    const createNotifRes = await fetch(`${BASE_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: 'Hydration Target Reached!',
        message: 'Great job! You drank 3,000 ml today.',
        type: 'nutrition',
      }),
    });
    const createNotifData = await createNotifRes.json();
    assert(createNotifRes.status === 201 && createNotifData.data._id, 'Create Athlete Notification');
    const notifId = createNotifData.data._id;

    const unreadCountRes = await fetch(`${BASE_URL}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const unreadCountData = await unreadCountRes.json();
    assert(unreadCountRes.status === 200 && unreadCountData.unreadCount >= 1, 'Get Unread Notifications Count');

    const markReadRes = await fetch(`${BASE_URL}/notifications/${notifId}/read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(markReadRes.status === 200, 'Mark Single Notification as Read');

    // 15. Dashboard API Aggregation
    const dashRes = await fetch(`${BASE_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const dashData = await dashRes.json();
    assert(
      dashRes.status === 200 &&
        dashData.data.workouts.totalCount >= 1 &&
        dashData.data.nutrition.todayCalories >= 520 &&
        dashData.data.progress.currentWeight === 78.5 &&
        Array.isArray(dashData.data.weeklyActivity),
      'Dashboard Aggregated Endpoint (/api/dashboard)'
    );

    // 16. Reports (Fitness, Nutrition, and CSV Exports)
    const fitReportRes = await fetch(`${BASE_URL}/reports/fitness?range=30days`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const fitReportData = await fitReportRes.json();
    assert(
      fitReportRes.status === 200 && fitReportData.summary.totalSessions >= 1,
      'Fitness Performance Report Analytics'
    );

    const nutReportRes = await fetch(`${BASE_URL}/reports/nutrition?range=30days`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const nutReportData = await nutReportRes.json();
    assert(
      nutReportRes.status === 200 && nutReportData.summary.totalCalories >= 520,
      'Nutrition Intake Report Analytics'
    );

    const csvWkRes = await fetch(`${BASE_URL}/reports/export/workouts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const csvWkText = await csvWkRes.text();
    assert(
      csvWkRes.status === 200 && csvWkText.includes('WorkoutName') && csvWkText.includes('Incline Dumbbell Press'),
      'Workouts CSV Export Endpoint'
    );

    // 17. User Data Isolation Test (Security Check)
    // Register User 2
    const user2Email = `user2_${Date.now()}@fitnexus.io`;
    const reg2Res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sarah Connor',
        email: user2Email,
        password: 'password123',
      }),
    });
    const reg2Data = await reg2Res.json();
    const user2Token = reg2Data.token;

    // User 2 attempts to GET User 1's workout by ID
    const unauthorizedGet = await fetch(`${BASE_URL}/workouts/${workoutId}`, {
      headers: { Authorization: `Bearer ${user2Token}` },
    });
    assert(unauthorizedGet.status === 403, 'User Data Isolation: GET /api/workouts/:id Forbidden (403)');

    // User 2 attempts to UPDATE User 1's workout by ID
    const unauthorizedPut = await fetch(`${BASE_URL}/workouts/${workoutId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user2Token}`,
      },
      body: JSON.stringify({ weight: 999 }),
    });
    assert(unauthorizedPut.status === 403, 'User Data Isolation: PUT /api/workouts/:id Forbidden (403)');

    // User 2 attempts to DELETE User 1's meal
    const unauthorizedDelete = await fetch(`${BASE_URL}/nutrition/${mealId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user2Token}` },
    });
    assert(unauthorizedDelete.status === 403, 'User Data Isolation: DELETE /api/nutrition/:id Forbidden (403)');

    console.log('\n======================================================');
    console.log(` TEST SUMMARY: ${passed} PASSED | ${failed} FAILED `);
    console.log('======================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Fatal Error executing test suite:', err);
    process.exit(1);
  }
};

runTests();
