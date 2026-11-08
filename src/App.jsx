import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { FitnessProvider } from './context/FitnessContext';

import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

import { Dashboard } from './pages/Dashboard';
import { Workouts } from './pages/Workouts';
import { WorkoutManagement } from './pages/WorkoutManagement';
import { DietPlan } from './pages/DietPlan';
import { Goals } from './pages/Goals';
import { Schedule } from './pages/Schedule';
import { Progress } from './pages/Progress';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Notifications } from './pages/Notifications';
import { Reports } from './pages/Reports';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <FitnessProvider>
            <Routes>
              {/* Public Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Fitness Tracker Application Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/workouts" element={<Workouts />} />
                  <Route path="/workouts/manage" element={<WorkoutManagement />} />
                  <Route path="/diet" element={<DietPlan />} />
                  <Route path="/diet/details" element={<DietPlan />} />
                  <Route path="/goals" element={<Goals />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/progress" element={<Progress />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/reports" element={<Reports />} />
                </Route>
              </Route>

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </FitnessProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
