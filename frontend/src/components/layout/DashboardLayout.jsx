import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ActiveSessionModal } from '../workouts/ActiveSessionModal';
import { WorkoutDetailsModal } from '../workouts/WorkoutDetailsModal';
import { MealDetailsModal } from '../nutrition/MealDetailsModal';
import { useFitness } from '../../context/FitnessContext';

export const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const {
    selectedWorkout,
    setSelectedWorkout,
    selectedMeal,
    setSelectedMeal
  } = useFitness();

  return (
    <div className="app-layout">
      {/* Mobile Drawer Backdrop */}
      <div
        className={`sidebar-overlay ${isMobileOpen ? 'active' : ''}`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Persistent Left Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Navbar onOpenMobile={() => setIsMobileOpen(true)} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>

      {/* Global Interactive Modals */}
      <ActiveSessionModal />

      {selectedWorkout && (
        <WorkoutDetailsModal
          workout={selectedWorkout}
          isOpen={Boolean(selectedWorkout)}
          onClose={() => setSelectedWorkout(null)}
        />
      )}

      {selectedMeal && (
        <MealDetailsModal
          meal={selectedMeal}
          isOpen={Boolean(selectedMeal)}
          onClose={() => setSelectedMeal(null)}
        />
      )}
    </div>
  );
};
