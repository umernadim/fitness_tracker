import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Footprints,
  Droplet,
  Flame,
  HeartPulse,
  TrendingUp,
  Calendar,
  Sparkles,
  Play,
  ArrowRight,
  Plus,
  Layers,
  Dumbbell,
  Compass,
  Zap,
  Smile,
  Shield,
  Clock,
  Activity,
  Moon
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

import { useAuth } from '../context/AuthContext';
import { useFitness } from '../context/FitnessContext';
import { MetricCard } from '../components/common/MetricCard';
import { ChartCard } from '../components/common/ChartCard';
import { CircularProgress } from '../components/common/CircularProgress';
import { WorkoutCard } from '../components/workouts/WorkoutCard';
import {
  weeklyActivityData,
  fitnessDistributionData,
  fitnessSummaryCards,
  workoutCategories,
  bestExercises,
  recommendedWorkout
} from '../data/mockData';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    metrics,
    logWater,
    logSteps,
    workouts,
    setSelectedWorkout,
    setActiveSession
  } = useFitness();

  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filtered workouts for the popular section
  const filteredWorkouts = workouts.filter((w) => {
    if (selectedCategory === 'all') return true;
    return (
      w.category?.toLowerCase() === selectedCategory.toLowerCase() ||
      w.goal?.toLowerCase() === selectedCategory.toLowerCase()
    );
  });

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Custom Dark Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(22, 184, 176, 0.4)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            fontSize: '0.8rem'
          }}
        >
          <p style={{ fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{label}</p>
          {payload.map((item, index) => (
            <p key={index} style={{ color: item.color || 'var(--primary-teal)', margin: 0 }}>
              {item.name}: <strong>{item.value} {item.name.includes('Mins') ? 'mins' : item.name.includes('calories') ? 'kcal' : ''}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-container fade-in">
      {/* 1. Welcome Section */}
      <section className="welcome-section">
        <div className="welcome-info">
          <h1>
            Welcome back, {user?.name || 'Alex'}! <span>⚡</span>
          </h1>
          <p className="welcome-sub">
            Consistency is your superpower! You are on a <strong>{user?.streak || 24}-day active streak</strong>. Keep up the high standard.
          </p>
        </div>

        <div className="welcome-date-badge">
          <Calendar size={16} color="var(--primary-teal)" />
          <span>{currentDateFormatted}</span>
        </div>
      </section>

      {/* 2. Four Colorful Metric Cards */}
      <section className="metrics-grid">
        {/* Metric 1: Steps */}
        <MetricCard
          title="Daily Steps"
          value={metrics.steps.current.toLocaleString()}
          target={`${metrics.steps.goal.toLocaleString()} steps`}
          icon={Footprints}
          colorScheme="teal"
          trend={metrics.steps.trend}
          progressValue={metrics.steps.current}
          progressMax={metrics.steps.goal}
          type="bar"
          actionButton={
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ width: '100%', fontSize: '0.75rem', padding: '4px 8px' }}
              onClick={() => logSteps(500)}
            >
              <Plus size={12} /> +500 Quick Walk
            </button>
          }
        />

        {/* Metric 2: Water Intake */}
        <MetricCard
          title="Water Intake"
          value={metrics.water.current}
          unit={metrics.water.unit}
          target={`${metrics.water.goal} ${metrics.water.unit}`}
          icon={Droplet}
          colorScheme="blue"
          trend={metrics.water.trend}
          progressValue={metrics.water.current}
          progressMax={metrics.water.goal}
          type="circle"
          actionButton={
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ width: '100%', fontSize: '0.75rem', padding: '4px 8px', color: 'var(--color-sky)', borderColor: 'var(--color-sky)' }}
              onClick={() => logWater(250)}
            >
              <Plus size={12} /> +250ml Glass
            </button>
          }
        />

        {/* Metric 3: Calories */}
        <MetricCard
          title="Calories Consumed"
          value={metrics.calories.consumed.toLocaleString()}
          unit="kcal"
          target={`${metrics.calories.target} target`}
          icon={Flame}
          colorScheme="orange"
          trend={`${metrics.calories.remaining} kcal left`}
          progressValue={metrics.calories.consumed}
          progressMax={metrics.calories.target}
          type="bar"
        />

        {/* Metric 4: Heart Rate */}
        <MetricCard
          title="Resting Heart Rate"
          value={metrics.heartRate.current}
          unit={metrics.heartRate.unit}
          target={`${metrics.heartRate.status}`}
          icon={HeartPulse}
          colorScheme="pink"
          trend={`Peak ${metrics.heartRate.peak} BPM`}
          type="chart"
          chartComponent={
            <div style={{ height: '54px', width: '100%', marginTop: '6px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.heartRate.sparkline}>
                  <defs>
                    <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F472B6" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#F472B6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="hr"
                    stroke="#F472B6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#hrGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          }
        />
      </section>

      {/* 3. Middle Charts Section (Weekly Activity & Fitness Progress Distribution) */}
      <section className="dashboard-charts-grid">
        {/* Activity Chart: Weekly Bar Chart */}
        <ChartCard
          title="Weekly Workout Activity"
          icon={TrendingUp}
          subtitle="Workout duration (minutes) tracked from Monday to Sunday"
          action={
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-teal)', fontWeight: 600 }}>
              Average: 51 min/day
            </span>
          }
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="workoutMins"
                name="Duration"
                fill="var(--primary-teal)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Doughnut Chart: Fitness Progress Distribution */}
        <ChartCard
          title="Activity Distribution"
          icon={Sparkles}
          subtitle="Discipline breakdown for this week"
        >
          <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'space-between' }}>
            <div style={{ width: '55%', height: '220px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fitnessDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {fitnessDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none'
                }}
              >
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                  100%
                </span>
                <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Volume
                </span>
              </div>
            </div>

            <div style={{ width: '42%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {fitnessDistributionData.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                  </div>
                  <strong style={{ color: 'var(--text-primary)' }}>{item.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </section>

      {/* 4. Fitness Summary Cards (Running, Sleeping, Weight Lifting, Weight Loss) */}
      <section className="fitness-summary-grid">
        {fitnessSummaryCards.map((item) => (
          <div key={item.id} className="summary-card">
            <div className="summary-card-left">
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  background: `rgba(${item.color === '#16B8B0' ? '22, 184, 176' : item.color === '#38BDF8' ? '56, 189, 248' : item.color === '#FB923C' ? '251, 146, 60' : '167, 139, 250'}, 0.15)`,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {item.id === 'sum-running' && <Activity size={20} />}
                {item.id === 'sum-sleeping' && <Moon size={20} />}
                {item.id === 'sum-lifting' && <Dumbbell size={20} />}
                {item.id === 'sum-weightloss' && <Flame size={20} />}
              </div>

              <div className="summary-card-info">
                <h4>{item.title}</h4>
                <div className="summary-card-value">{item.value}</div>
                <div className="summary-card-sub">{item.subtext}</div>
              </div>
            </div>

            <CircularProgress
              value={item.progress}
              size={48}
              strokeWidth={4.5}
              color={item.color}
            />
          </div>
        ))}
      </section>

      {/* 5. Recommended Workout Hero Card */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recommended For You</h2>
          <span style={{ fontSize: '0.82rem', color: 'var(--primary-teal)', fontWeight: 600 }}>
            Curated by AI Coach
          </span>
        </div>

        <div className="recommended-workout-card">
          <div className="recommended-image-wrap">
            <img src={recommendedWorkout.image} alt={recommendedWorkout.title} />
            <div className="recommended-overlay-badge">
              <span className="badge badge-teal">Daily Pick</span>
            </div>
          </div>

          <div className="recommended-content">
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <span className="badge badge-teal">{recommendedWorkout.category}</span>
                <span className="badge badge-blue">{recommendedWorkout.level}</span>
                <span className="badge badge-pink">★ {recommendedWorkout.rating}</span>
              </div>

              <h3>{recommendedWorkout.title}</h3>
              <p>{recommendedWorkout.description}</p>

              <div className="workout-meta-chips">
                <div className="meta-chip">
                  <Clock size={14} color="var(--primary-teal)" />
                  <span>Duration: <strong>{recommendedWorkout.duration}</strong></span>
                </div>
                <div className="meta-chip">
                  <Flame size={14} color="var(--color-orange)" />
                  <span>Burn: <strong>{recommendedWorkout.calories} kcal</strong></span>
                </div>
                <div className="meta-chip">
                  <Dumbbell size={14} color="var(--color-sky)" />
                  <span>Equipment: <strong>{recommendedWorkout.equipment}</strong></span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedWorkout(recommendedWorkout)}
              >
                View Exercises ({recommendedWorkout.exercises.length})
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setActiveSession(recommendedWorkout)}
              >
                <Play size={16} fill="currentColor" />
                Start Workout
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Categories Row */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Workout Categories</h2>
          <button
            type="button"
            className="flex items-center gap-1"
            style={{ fontSize: '0.85rem', color: 'var(--primary-teal)', fontWeight: 600 }}
            onClick={() => navigate('/workouts')}
          >
            Explore All <ArrowRight size={14} />
          </button>
        </div>

        <div className="category-chips-row">
          {workoutCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`category-chip-btn ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.id === 'boxing' && <Zap size={16} />}
                {cat.id === 'cardio' && <Flame size={16} />}
                {cat.id === 'gym' && <Dumbbell size={16} />}
                {cat.id === 'stretching' && <Smile size={16} />}
                {cat.id === 'upper-body' && <Shield size={16} />}
                {cat.id === 'yoga' && <Compass size={16} />}
                {cat.id === 'all' && <Layers size={16} />}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 7. Best Exercises */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Best Exercises for You</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            High-Impact Hypertrophy & Conditioning
          </span>
        </div>

        <div className="exercises-list-grid">
          {bestExercises.map((ex) => (
            <div key={ex.id} className="exercise-item-card">
              <div className="exercise-img-wrap">
                <img src={ex.image} alt={ex.name} loading="lazy" />
                <span
                  className="badge badge-teal"
                  style={{ position: 'absolute', top: '10px', left: '10px' }}
                >
                  {ex.category}
                </span>
              </div>

              <div className="exercise-item-info">
                <div>
                  <h4>{ex.name}</h4>
                  <div className="exercise-target">{ex.targetMuscle}</div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
                    {ex.description}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {ex.duration}
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setSelectedWorkout({
                        title: ex.name,
                        category: ex.category,
                        level: ex.difficulty,
                        duration: '20 min',
                        calories: 180,
                        equipment: 'Standard',
                        image: ex.image,
                        description: ex.description,
                        exercises: [
                          { name: ex.name, sets: 4, reps: ex.duration, rest: '60s' }
                        ]
                      });
                    }}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Popular Workouts */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Popular Workouts</h2>
          <button
            type="button"
            className="flex items-center gap-1"
            style={{ fontSize: '0.85rem', color: 'var(--primary-teal)', fontWeight: 600 }}
            onClick={() => navigate('/workouts')}
          >
            See All Workouts ({workouts.length}) <ArrowRight size={14} />
          </button>
        </div>

        <div className="workouts-grid">
          {filteredWorkouts.slice(0, 3).map((w) => (
            <WorkoutCard
              key={w.id}
              workout={w}
              onSelect={(workout) => setSelectedWorkout(workout)}
              onStart={(workout) => setActiveSession(workout)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
