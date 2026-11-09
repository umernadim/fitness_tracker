import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Dumbbell,
  Utensils,
  TrendingDown,
  Clock,
  Flame,
  Award,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line
} from 'recharts';

import { useFitness } from '../context/FitnessContext';
import { useAuth } from '../context/AuthContext';
import { exportToCSV, triggerPrint } from '../utils/exportUtils';
import { reportService } from '../services/reportService';
import { Button } from '../components/common/Button';

export const Reports = () => {
  const { user } = useAuth();
  const {
    userWorkouts,
    loggedMeals,
    progressHistory,
    nutritionTotals
  } = useFitness();

  const [dateRange, setDateRange] = useState('30days'); // '7days' | '30days' | 'thisMonth' | 'thisYear'

  // Calculations
  const totalWorkouts = userWorkouts.length + 28;
  const totalWorkoutHours = Math.round((userWorkouts.reduce((a, b) => a + b.duration, 0) + 1200) / 60);
  const totalCaloriesBurned = totalWorkouts * 380;
  const consistencyRate = 92; // %

  const latestWeight = progressHistory[progressHistory.length - 1]?.weight || 74.5;
  const startingWeight = user?.startingWeight || 79.3;
  const totalLoss = (startingWeight - latestWeight).toFixed(1);

  // Handle Export CSV
  const handleExportCSV = async () => {
    try {
      await reportService.downloadWorkoutsCSV();
    } catch (err) {
      // Fallback to client-side CSV export
      const exportData = userWorkouts.map((w) => ({
        Date: w.date,
        WorkoutName: w.workoutName,
        Exercise: w.exerciseName,
        Category: w.category,
        Sets: w.sets,
        Reps: w.reps,
        WeightKg: w.weight,
        DurationMins: w.duration,
        Notes: w.notes,
      }));
      exportToCSV(exportData, `fitnexus-workout-report-${new Date().toISOString().split('T')[0]}.csv`);
    }
  };

  const handleExportNutritionCSV = async () => {
    try {
      await reportService.downloadNutritionCSV();
    } catch (err) {
      const mealData = loggedMeals.map((m) => ({
        MealName: m.name || m.foodName,
        Category: m.mealType,
        Calories: m.calories,
        ProteinGrams: m.protein,
        CarbsGrams: m.carbohydrates || m.carbs,
        FatsGrams: m.fats,
        Portion: m.quantity,
      }));
      exportToCSV(mealData, `fitnexus-nutrition-report-${new Date().toISOString().split('T')[0]}.csv`);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Performance & Wellness Reports</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Generate and export consolidated summaries for workouts, nutrition compliance, and body composition.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="secondary" icon={Printer} onClick={triggerPrint}>
            Print / Save PDF
          </Button>
          <Button variant="primary" icon={Download} onClick={handleExportCSV}>
            Export Workout CSV
          </Button>
        </div>
      </div>

      {/* Date Filter Bar */}
      <div
        className="glass-card"
        style={{
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          <Calendar size={18} color="var(--primary-teal)" />
          <span>Reporting Timeline Filter:</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className={`btn btn-sm ${dateRange === '7days' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setDateRange('7days')}
          >
            Last 7 Days
          </button>
          <button
            type="button"
            className={`btn btn-sm ${dateRange === '30days' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setDateRange('30days')}
          >
            Last 30 Days
          </button>
          <button
            type="button"
            className={`btn btn-sm ${dateRange === 'thisMonth' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setDateRange('thisMonth')}
          >
            This Month
          </button>
          <button
            type="button"
            className={`btn btn-sm ${dateRange === 'thisYear' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setDateRange('thisYear')}
          >
            This Year
          </button>
        </div>
      </div>

      {/* Executive Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px'
        }}
      >
        <div className="summary-card">
          <div className="summary-card-left">
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(22, 184, 176, 0.15)', color: 'var(--primary-teal)' }}>
              <Dumbbell size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Workouts Completed</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{totalWorkouts}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--primary-teal)' }}>+4 vs previous cycle</div>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-left">
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--color-sky)' }}>
              <Clock size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Training Time</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{totalWorkoutHours} hrs</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-sky)' }}>Average 52 min/session</div>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-left">
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(251, 146, 60, 0.15)', color: 'var(--color-orange)' }}>
              <Flame size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Estimated Burn</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{totalCaloriesBurned.toLocaleString()} kcal</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-orange)' }}>Calorie deficit on track</div>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-left">
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
              <TrendingDown size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Weight Reduction</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#34D399' }}>-{totalLoss} kg</div>
              <div style={{ fontSize: '0.72rem', color: '#34D399' }}>Target within 2.5 kg</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Section: Workout & Nutrition Summaries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Workout Discipline Breakdown */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Training Category Performance</h3>
            <span className="badge badge-teal">High Adherence</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span>Strength & Heavy Compound Lifts</span>
                <strong>14 sessions (42%)</strong>
              </div>
              <div className="progress-track" style={{ height: '6px' }}>
                <div className="progress-fill teal" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span>Cardio & High-Intensity Conditioning</span>
                <strong>10 sessions (30%)</strong>
              </div>
              <div className="progress-track" style={{ height: '6px' }}>
                <div className="progress-fill blue" style={{ width: '30%' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span>Mobility, Yoga & Active Recovery</span>
                <strong>6 sessions (18%)</strong>
              </div>
              <div className="progress-track" style={{ height: '6px' }}>
                <div className="progress-fill orange" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span>Boxing & Agility Intervals</span>
                <strong>4 sessions (10%)</strong>
              </div>
              <div className="progress-track" style={{ height: '6px' }}>
                <div className="progress-fill pink" style={{ width: '10%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Nutrition Adherence Summary */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Nutrition & Macronutrient Report</h3>
              <Button variant="outline" size="sm" icon={Download} onClick={handleExportNutritionCSV}>
                Diet CSV
              </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center', marginBottom: '18px' }}>
              <div style={{ background: 'var(--bg-card-secondary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Avg Daily Protein</span>
                <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--primary-teal)' }}>148g</strong>
              </div>
              <div style={{ background: 'var(--bg-card-secondary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Avg Daily Carbs</span>
                <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--color-sky)' }}>215g</strong>
              </div>
              <div style={{ background: 'var(--bg-card-secondary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Avg Daily Fats</span>
                <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--color-pink)' }}>56g</strong>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Average caloric intake has maintained within 4% of the target 2,400 kcal budget. Protein threshold surpassed 2.0g/kg bodyweight across 88% of monitored days.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginTop: '16px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>FitNexus AI Nutrition Compliance Rating</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-teal)' }}>Grade A (94%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
