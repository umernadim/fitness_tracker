# FitNexus — Premium Fitness & Nutrition Tracker Frontend

**FitNexus** is a modern, responsive, high-performance Fitness Tracker web application frontend built with React.js, Vite, React Router DOM, Recharts, Lucide React icons, React Context API, and modular Custom CSS.

Inspired by premium fitness and SaaS dashboards, FitNexus features a dark athletic teal aesthetic, smooth animations, interactive data visualizations, and full state persistence using `localStorage`.

---

## 🚀 Live Demo & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Preview the Production Build
```bash
npm run preview
```

---

## 🎨 Design Theme & Colors

Built exclusively with clean custom CSS (no Tailwind, no Bootstrap):

- **Main Background**: `#061C1B`
- **Sidebar Background**: `#092625`
- **Navbar Background**: `#081F1E`
- **Card Background**: `#0D2928`
- **Secondary Card**: `#123331`
- **Primary Teal**: `#16B8B0`
- **Hover Teal**: `#20D3C9`
- **Primary Text**: `#F5FAFA`
- **Secondary Text**: `#9AB7B4`
- **Borders**: `rgba(255, 255, 255, 0.08)`
- **Gradients**: Teal, Blue, Orange, Pink, and Purple accents

---

## 📱 Application Structure & Routes

| Route | Page Name | Key Features |
| :--- | :--- | :--- |
| `/dashboard` | **Dashboard / Overview** | Welcome section, 4 metric cards (Steps, Water, Calories, Heart Rate sparkline), weekly workout activity bar chart, doughnut activity distribution, 4 summary cards, hero recommended workout, category quick filters, best exercises, popular workouts. |
| `/workouts` | **Workout Discovery** | Split layout with sticky filter sidebar (Goals, Price, Level, Duration, Equipment), instant reactive filtering, favorite toggles, full details modal, and "Create Personal Training" routine modal. |
| `/workouts/manage` | **Workout Management** | CRUD management for user workout logs (name, exercise, sets, reps, weight, duration, notes), search, category filters, and table/cards view mode. |
| `/diet` | **Diet & Nutrition** | Dynamic macros dashboard (Calories, Protein, Carbs, Fats), today's logged meals diary, food database with recipe popups, and meal logging modal. |
| `/goals` | **Fitness Goals** | Target tracking for weight loss, daily steps, workout frequency, and strength PRs with progress bars, milestone celebrations, and Add/Edit modal. |
| `/schedule` | **Schedule & Planner** | Monthly, weekly, and daily agenda views, month navigation, add/edit scheduled workouts and meal reminders, upcoming tasks drawer, and completion toggles. |
| `/progress` | **Progress Analytics** | Weight change trajectory with Recharts LineChart, body circumference measurements (chest, waist, hips, arms, body fat %), workout consistency metrics, and progress logs. |
| `/profile` | **Athlete Profile** | Athlete vitals card, BMI index calculator, personal information editor, account shortcuts, weight history snapshot, support ticket modal, and newsletter subscription box. |
| `/settings` | **Settings & Units** | Unit switchers (kg/lbs, cm/ft, ml/oz, kcal/kJ), dark/light theme switch, accent color picker, automated reminder toggles, and cache reset. |
| `/notifications` | **Notifications** | Categorized alerts (workout reminders, goal achievements, nutrition alerts, milestones), read/unread filters, and mark-as-read controls. |
| `/reports` | **Reports & Exports** | Executive KPI performance summaries, real browser CSV export download for workouts and nutrition, and printable PDF view. |
| `/login` | **Authentication** | Dark themed login with 1-click Demo Mode button, remember me, password reveal toggle, and simulated auth state. |
| `/register` | **Registration** | Form validation, password confirmation, terms acceptance, and athlete onboarding. |
| `/forgot-password` | **Password Recovery** | Email password reset dispatch simulation with visual feedback. |

---

## 🛠️ Reusable Architecture

- **State Management**:
  - `AuthContext`: Authentication simulation, profile management, and login persistence.
  - `FitnessContext`: Unified data layer for workouts, meals, goals, schedules, progress logs, metrics, notifications, and active session timer.
  - `ThemeContext`: System units (kg/lbs, cm/ft) and accent color preferences.
- **Components**:
  - `Button`, `Input`, `Modal`, `ProgressBar`, `CircularProgress`, `MetricCard`, `ChartCard`, `NotificationItem`, `SearchBar`, `UserAvatar`, `ProtectedRoute`.
  - `Sidebar` (collapsible and mobile drawer), `Navbar` (search, notifications flyout, user profile menu), `DashboardLayout`.
  - `ActiveSessionModal`: Interactive live workout timer with sets completion tracker!

---

## 🔌 Future Backend Integration (MERN Stack Ready)

The code is architected to transition seamlessly to a Node.js + Express.js backend and MongoDB database:
1. Replace localStorage helper calls in `src/context/` with Axios/Fetch REST API calls.
2. Hook up MongoDB models corresponding to the schema in `src/data/mockData.js`:
   - `User`
   - `Workout`
   - `UserWorkoutLog`
   - `MealLog`
   - `Goal`
   - `Schedule`
   - `ProgressRecord`
   - `Notification`
