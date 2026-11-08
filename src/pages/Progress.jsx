import React, { useState, useMemo } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Plus,
  Scale,
  Calendar,
  Trash2,
  Activity,
  Dumbbell,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { useFitness } from '../context/FitnessContext';
import { useAuth } from '../context/AuthContext';
import { ProgressFormModal } from '../components/progress/ProgressFormModal';
import { ChartCard } from '../components/common/ChartCard';
import { Button } from '../components/common/Button';
import { fitnessDistributionData } from '../data/mockData';

export const Progress = () => {
  const { user } = useAuth();
  const {
    progressHistory,
    addProgressRecord,
    deleteProgressRecord,
    userWorkouts
  } = useFitness();

  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // Latest record calculations
  const latest = progressHistory[progressHistory.length - 1] || {
    weight: 74.5,
    chest: 105,
    waist: 81.5,
    hips: 95,
    arms: 38,
    bodyFat: 14.8
  };

  const startingWeight = user?.startingWeight || 79.3;
  const targetWeight = user?.targetWeight || 72.0;
  const currentWeight = latest.weight;
  const weightChange = (currentWeight - startingWeight).toFixed(1);

  // Workout analytics calculations
  const totalWorkouts = userWorkouts.length + 32;
  const totalHours = Math.round((userWorkouts.reduce((acc, w) => acc + w.duration, 0) + 1800) / 60);

  // Format line chart data
  const chartData = useMemo(() => {
    return progressHistory.map((p) => ({
      date: p.date.substring(5), // MM-DD
      weight: p.weight,
      bodyFat: p.bodyFat,
      waist: p.waist
    }));
  }, [progressHistory]);

  const handleDelete = (id, date) => {
    if (window.confirm(`Delete progress record from ${date}?`)) {
      deleteProgressRecord(id);
    }
  };

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
          <p style={{ fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Date: {label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: 0 }}>
              {entry.name}: <strong>{entry.value} {entry.name.includes('weight') ? 'kg' : entry.name.includes('bodyFat') ? '%' : 'cm'}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Page Header */}
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
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Progress Analytics</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Comprehensive tracking for weight changes, body circumference measurements, and volume progression.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={() => setIsRecordModalOpen(true)}>
          Record Measurements
        </Button>
      </div>

      {/* 1. Weight Tracking KPI Summary Cards */}
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
              <Scale size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Current Weight</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                {currentWeight} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>kg</span>
              </div>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-left">
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--color-sky)' }}>
              <Calendar size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Starting Weight</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                {startingWeight} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>kg</span>
              </div>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-left">
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(251, 146, 60, 0.15)', color: 'var(--color-orange)' }}>
              <Award size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Target Weight</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                {targetWeight} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>kg</span>
              </div>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-left">
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
              <TrendingDown size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Net Change</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#34D399' }}>
                {weightChange} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>kg</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Weight Chart & Workout Analytics Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Interactive Line Chart */}
        <ChartCard
          title="Weight Trajectory Over Time"
          icon={TrendingDown}
          subtitle={`Current: ${currentWeight} kg vs Target: ${targetWeight} kg`}
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData} margin={{ top: 15, right: 20, left: -20, bottom: 5 }}>
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={targetWeight} label="Target" stroke="#10B981" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="weight"
                name="Weight"
                stroke="var(--primary-teal)"
                strokeWidth={3}
                dot={{ r: 5, fill: '#16B8B0' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Workout Analytics Summary */}
        <div className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' }}>
            Workout Consistency
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Workouts</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--primary-teal)' }}>{totalWorkouts} sessions</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Hours</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--color-sky)' }}>{totalHours} hrs</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Weekly Frequency</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--color-orange)' }}>4.6 sessions / wk</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Active Day Streak</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--color-pink)' }}>{user?.streak || 24} Days 🔥</strong>
            </div>
          </div>

          <div style={{ marginTop: '16px', background: 'var(--bg-card-secondary)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            ✓ Consistent caloric deficit maintained. Target projection on track for December 2026.
          </div>
        </div>
      </div>

      {/* 3. Body Measurements Grid */}
      <section>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '14px' }}>
          Current Body Measurements
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Body Fat</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-teal)', fontFamily: 'var(--font-heading)' }}>
              {latest.bodyFat}%
            </div>
            <span style={{ fontSize: '0.72rem', color: '#34D399' }}>-3.4% overall</span>
          </div>

          <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Chest</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
              {latest.chest} cm
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-sky)' }}>+1.0 cm hypertrophy</span>
          </div>

          <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Waist</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-orange)', fontFamily: 'var(--font-heading)' }}>
              {latest.waist} cm
            </div>
            <span style={{ fontSize: '0.72rem', color: '#34D399' }}>-5.5 cm reduction</span>
          </div>

          <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hips</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
              {latest.hips} cm
            </div>
            <span style={{ fontSize: '0.72rem', color: '#34D399' }}>-3.0 cm reduction</span>
          </div>

          <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Arms</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-pink)', fontFamily: 'var(--font-heading)' }}>
              {latest.arms} cm
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-pink)' }}>+1.0 cm density</span>
          </div>
        </div>
      </section>

      {/* 4. Progress History Table */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Measurement History Logs</h2>
          <Button variant="secondary" size="sm" icon={Plus} onClick={() => setIsRecordModalOpen(true)}>
            Add Entry
          </Button>
        </div>

        <div className="table-responsive">
          <table className="table-custom">
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight</th>
                <th>Body Fat</th>
                <th>Chest</th>
                <th>Waist</th>
                <th>Hips</th>
                <th>Arms</th>
                <th>Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {progressHistory.map((row) => (
                <tr key={row.id}>
                  <td style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{row.date}</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary-teal)' }}>{row.weight} kg</td>
                  <td>{row.bodyFat ? `${row.bodyFat}%` : '—'}</td>
                  <td>{row.chest ? `${row.chest} cm` : '—'}</td>
                  <td>{row.waist ? `${row.waist} cm` : '—'}</td>
                  <td>{row.hips ? `${row.hips} cm` : '—'}</td>
                  <td>{row.arms ? `${row.arms} cm` : '—'}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {row.notes || '—'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => handleDelete(row.id, row.date)}
                      style={{ padding: '6px', color: '#EF4444' }}
                      title="Delete log"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Progress Form Modal */}
      <ProgressFormModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSubmit={addProgressRecord}
      />
    </div>
  );
};
