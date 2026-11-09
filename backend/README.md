# FitNexus Backend REST API

Production-ready, modular, and secure Node.js, Express.js, and MongoDB backend developed for the **FitNexus** Fitness Tracker application (Aptech eProject).

---

## 🚀 Key Features

- **Robust Architecture:** MVC (Model-View-Controller) structure separating routing, business logic, models, and error handling.
- **Secure Authentication:** JWT (JSON Web Tokens) with 30-day expiration, `bcryptjs` password hashing (10 salt rounds), password-recovery workflow.
- **Complete REST APIs:**
  - **Auth:** Register, Login, Current User (`/api/auth/me`), Logout, Forgot Password, Reset Password.
  - **User Profile:** View and update profile, height, weight, bio, preferences, reminders.
  - **Workouts:** Full CRUD, search, category filter, date range filter, completion status.
  - **Nutrition & Diet:** Log meals, track macros (calories, protein, carbohydrates, fats), daily nutrition summary aggregation from actual MongoDB records.
  - **Fitness Goals:** Goal tracking with automatic percentage calculation and completion milestones.
  - **Schedules:** Workout and meal calendar scheduling with month/date filtering.
  - **Progress:** Chronological body measurements (chest, waist, hips, arms, body fat, weight) and summary calculations.
  - **Notifications:** Real-time athlete alerts, unread counts, mark-all-read.
  - **Dashboard:** Real-time MongoDB aggregations for today's workouts, today's calories/macros, weekly activity distribution, goal progress, and upcoming sessions.
  - **Reports & Export:** Performance reports with date-range filters and CSV export endpoints.
- **Security & Data Isolation:** Ownership checks on every record prevent unauthorized access across user accounts.

---

## 📁 Backend Project Structure

```text
backend/
├── config/
│   └── db.js                        # Reusable Mongoose connection with error handling
├── controllers/
│   ├── authController.js            # Register, login, me, logout, password recovery
│   ├── userController.js            # Athlete profile retrieval and updates
│   ├── workoutController.js         # Workouts CRUD, search, category filters
│   ├── nutritionController.js       # Meals CRUD & daily macro aggregation
│   ├── goalController.js            # Goals CRUD & percentage calculation
│   ├── scheduleController.js        # Schedule CRUD & date/month filtering
│   ├── progressController.js        # Body progress measurements & history summary
│   ├── notificationController.js    # Athlete notifications & unread counts
│   ├── dashboardController.js       # Aggregated metrics for home dashboard
│   └── reportController.js          # Fitness & nutrition analytics and CSV exports
├── middleware/
│   ├── authMiddleware.js            # JWT Bearer token verification
│   └── errorMiddleware.js           # 404 handler and global exception handler
├── models/
│   ├── User.js                      # User schema with bcrypt hooks & reset tokens
│   ├── Workout.js                   # Workout log schema
│   ├── Meal.js                      # Nutrition & macros schema
│   ├── Goal.js                      # Goals & completion percentage schema
│   ├── Schedule.js                  # Schedule calendar schema
│   ├── Progress.js                  # Anthropometric vitals schema
│   └── Notification.js              # Athlete notification schema
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── workoutRoutes.js
│   ├── nutritionRoutes.js
│   ├── goalRoutes.js
│   ├── scheduleRoutes.js
│   ├── progressRoutes.js
│   ├── notificationRoutes.js
│   ├── dashboardRoutes.js
│   └── reportRoutes.js
├── utils/
│   └── generateToken.js             # JWT signing utility
├── .env                             # Environment configuration
├── .env.example                     # Environment template
├── FitNexus_Postman_Collection.json # Ready-to-import Postman collection
├── FitNexus_Postman_Environment.json# Postman local environment variables
├── package.json                     # Scripts and dependencies
├── seeder.js                        # Demo data seeder script
├── server.js                        # Express app entrypoint & middleware pipeline
└── test-suite.js                    # Automated end-to-end API test suite (31 tests)
```

---

## 🛠️ Step-by-Step Setup Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v24.18.0)
- **MongoDB** (Local MongoDB Community Server on port `27017` or MongoDB Atlas cloud connection)

### 2. Install Dependencies
Open terminal inside the `backend` folder:
```bash
cd backend
npm install
```

### 3. Environment Variables Configuration
Create a `.env` file in the `backend` folder (or copy from `.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/fitnexus
JWT_SECRET=fitnexus_super_secret_jwt_key_aptech_2026
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

#### Configuring MongoDB Atlas (Cloud Database)
To use MongoDB Atlas instead of a local MongoDB server:
1. Log in to [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a free M0 Cluster.
3. Under **Database Access**, create a database user (username and password).
4. Under **Network Access**, add IP `0.0.0.0/0` (allow access from anywhere).
5. Click **Connect** > **Drivers** > copy connection string.
6. Replace `MONGO_URI` in `.env`:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/fitnexus?retryWrites=true&w=majority
   ```

### 4. Seed Initial Athlete Data
Populate MongoDB with demo athlete records (Alex Rivera, workouts, meals, goals, schedules, progress):
```bash
npm run seed
```

### 5. Run the Backend Server
- **Production mode:**
  ```bash
  npm start
  ```
- **Development mode (with auto-reload):**
  ```bash
  npm run dev
  ```
The server will start at: `http://localhost:5000`  
Health check endpoint: `http://localhost:5000/api/health`

### 6. Connect the React / Vite Frontend
1. In the `fitness_tracker` folder, ensure `.env` contains:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
2. Start the frontend:
   ```bash
   cd fitness_tracker
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.
4. Log in with the pre-seeded demo athlete:
   - **Email:** `alex.rivera@fitnexus.io`
   - **Password:** `password123`
   (Or click the **⚡ Quick Demo Mode: Instant Login** button).

---

## 🧪 Testing with Postman & Automated Suite

### Running the Automated Test Suite (31 Tests)
Run the built-in test suite to test all 31 criteria (Auth, CRUD, Ownership Isolation, Aggregations):
```bash
npm test
```
Expected output:
```text
======================================================
 TEST SUMMARY: 31 PASSED | 0 FAILED 
======================================================
```

### Testing with Postman
1. Open Postman.
2. Click **Import** > Select `FitNexus_Postman_Collection.json` and `FitNexus_Postman_Environment.json`.
3. Select the active environment: **FitNexus Local Environment**.
4. Run the **Login (Demo Athlete)** request. Postman will automatically extract the JWT token and set the `authToken` collection variable for all subsequent requests!
5. Test Workouts, Nutrition, Goals, Schedules, Progress, Dashboard, and Reports seamlessly.

---

## 📋 Complete REST API Documentation

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new athlete account | Public |
| `POST` | `/api/auth/login` | Log in athlete & return JWT token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated athlete profile | Private (Bearer) |
| `POST` | `/api/auth/logout` | Clear athlete session | Public |
| `POST` | `/api/auth/forgot-password` | Generate password reset recovery token | Public |
| `POST` | `/api/auth/reset-password` | Reset password using recovery token | Public |

### 2. User Profile (`/api/users`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/users/profile` | Get current athlete profile | Private |
| `PUT` | `/api/users/profile` | Update profile, bio, vitals, preferences | Private |

### 3. Workouts (`/api/workouts`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/workouts` | Create workout log | Private |
| `GET` | `/api/workouts` | Get user workouts (`?category=`, `?search=`, `?date=`) | Private |
| `GET` | `/api/workouts/:id` | Get workout details | Private |
| `PUT` | `/api/workouts/:id` | Update workout | Private |
| `DELETE` | `/api/workouts/:id` | Delete workout | Private |

### 4. Nutrition (`/api/nutrition`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/nutrition` | Log a meal | Private |
| `GET` | `/api/nutrition` | Get logged meals (`?mealType=`, `?date=`) | Private |
| `GET` | `/api/nutrition/:id` | Get meal details | Private |
| `PUT` | `/api/nutrition/:id` | Update meal record | Private |
| `DELETE` | `/api/nutrition/:id` | Delete meal record | Private |
| `GET` | `/api/nutrition/summary` | Calculate total calories, protein, carbs, fats (`?date=`) | Private |

### 5. Fitness Goals (`/api/goals`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/goals` | Create fitness target goal | Private |
| `GET` | `/api/goals` | Get all goals with completion percentages | Private |
| `GET` | `/api/goals/:id` | Get goal details | Private |
| `PUT` | `/api/goals/:id` | Update goal target or progress (`?increment=`) | Private |
| `DELETE` | `/api/goals/:id` | Delete goal | Private |

### 6. Workout Schedule (`/api/schedules`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/schedules` | Schedule workout or meal reminder | Private |
| `GET` | `/api/schedules` | Get schedules (`?date=YYYY-MM-DD`, `?month=YYYY-MM`) | Private |
| `GET` | `/api/schedules/:id` | Get schedule details | Private |
| `PUT` | `/api/schedules/:id` | Update schedule or toggle completed | Private |
| `DELETE` | `/api/schedules/:id` | Delete scheduled activity | Private |

### 7. Progress Tracking (`/api/progress`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/progress` | Record body measurements & weight | Private |
| `GET` | `/api/progress` | Get progress records (chronological order) | Private |
| `GET` | `/api/progress/:id` | Get progress record by ID | Private |
| `PUT` | `/api/progress/:id` | Update measurements | Private |
| `DELETE` | `/api/progress/:id` | Delete progress entry | Private |
| `GET` | `/api/progress/summary` | Current weight, starting weight, delta, history | Private |

### 8. Notifications (`/api/notifications`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/notifications` | Get athlete alerts (`?read=false`) | Private |
| `GET` | `/api/notifications/unread-count` | Get total unread notifications count | Private |
| `PUT` | `/api/notifications/:id/read` | Mark single notification as read | Private |
| `PUT` | `/api/notifications/read-all` | Mark all notifications as read | Private |
| `DELETE` | `/api/notifications/:id` | Delete notification | Private |

### 9. Dashboard (`/api/dashboard`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/dashboard` | Aggregated dashboard data (MongoDB aggregations) | Private |

### 10. Reports & Export (`/api/reports`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/reports/fitness` | Performance stats & category distribution | Private |
| `GET` | `/api/reports/nutrition` | Nutrition analytics & daily averages | Private |
| `GET` | `/api/reports/export/workouts` | Download workouts report as CSV | Private |
| `GET` | `/api/reports/export/nutrition` | Download nutrition report as CSV | Private |

---

## 🛡️ Security Implementation

1. **Password Hashing:** Passwords are never stored in plaintext. Hashed using `bcryptjs` with 10 salt rounds in a Mongoose `pre('save')` hook.
2. **Safe JSON Projection:** User passwords, reset tokens, and expiration dates are explicitly excluded using `select: false` and schema `toJSON` transforms.
3. **User Data Isolation:** Every database query filters by `userId: req.user._id`. Unauthorized attempts to access or mutate other users' records by ID immediately return HTTP `403 Forbidden`.
4. **Input Validation:** Request bodies are sanitized and validated using `express-validator`.
5. **CORS:** Configured with origin whitelist (`http://localhost:5173`) and credentials support.
