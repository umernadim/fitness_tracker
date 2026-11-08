import React, { useState, useMemo } from 'react';
import {
  Target,
  Plus,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  TrendingUp,
  Award,
  Sparkles
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { GoalFormModal } from '../components/goals/GoalFormModal';
import { ProgressBar } from '../components/common/ProgressBar';
import { CircularProgress } from '../components/common/CircularProgress';
import { Button } from '../components/common/Button';

export const Goals = () => {
  const {
    goals,
    addGoal,
    updateGoal,
    updateGoalProgress,
    deleteGoal
  } = useFitness();

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'completed'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const activeGoals = useMemo(() => goals.filter((g) => !g.completed), [goals]);
  const completedGoals = useMemo(() => goals.filter((g) => g.completed), [goals]);

  const displayedGoals = activeTab === 'active' ? activeGoals : completedGoals;

  const handleOpenAdd = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, data);
    } else {
      addGoal(data);
    }
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete goal "${title}"?`)) {
      deleteGoal(id);
    }
  };

  const handleQuickAdd = (goal) => {
    const step = goal.type === 'steps' ? 1000 : goal.type === 'water' ? 250 : 1;
    updateGoalProgress(goal.id, step);
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
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Fitness Goals</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Set measurable benchmarks for bodyweight, daily activity, strength PRs, and consistency.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Set New Goal
        </Button>
      </div>

      {/* Goal Summary Statistics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}
      >
        <div className="summary-card">
          <div className="summary-card-left">
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(22, 184, 176, 0.15)', color: 'var(--primary-teal)' }}>
              <Target size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Active Goals</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{activeGoals.length}</div>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-left">
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
              <Award size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Completed Milestones</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{completedGoals.length}</div>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-left">
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--color-sky)' }}>
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Overall Completion</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                {goals.length ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Active Goals vs Completed Goals */}
      <div className="tabs-container">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active Goals ({activeGoals.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed Milestones ({completedGoals.length})
        </button>
      </div>

      {/* Goals Grid */}
      {displayedGoals.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px dashed var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '50px 20px',
            textAlign: 'center'
          }}
        >
          <Target size={36} color="var(--text-muted)" style={{ margin: '0 auto 10px' }} />
          <h3>No {activeTab} goals found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
            {activeTab === 'active'
              ? 'You have completed all your goals! Create a new one to keep pushing your limits.'
              : 'Complete your ongoing goals to showcase your achievements here.'}
          </p>
          <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
            Create New Goal
          </Button>
        </div>
      ) : (
        <div className="goals-grid">
          {displayedGoals.map((goal) => {
            const percentage = Math.min(
              100,
              Math.max(0, Math.round((Number(goal.current) / (Number(goal.target) || 1)) * 100))
            );

            return (
              <div
                key={goal.id}
                className={`goal-card ${goal.completed ? 'completed' : ''}`}
              >
                <div>
                  <div className="goal-top">
                    <div>
                      <span className="badge badge-teal" style={{ marginBottom: '6px' }}>
                        {goal.category}
                      </span>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{goal.title}</h3>
                    </div>

                    <CircularProgress
                      value={percentage}
                      size={54}
                      strokeWidth={4.5}
                      color={goal.completed ? '#10B981' : '#16B8B0'}
                    />
                  </div>

                  {goal.notes && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '10px 0 16px', lineHeight: 1.4 }}>
                      {goal.notes}
                    </p>
                  )}

                  {/* Value progress indicator */}
                  <div style={{ margin: '14px 0 8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        Current: <strong style={{ color: '#fff' }}>{goal.current} {goal.unit}</strong>
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        Target: <strong style={{ color: 'var(--primary-teal)' }}>{goal.target} {goal.unit}</strong>
                      </span>
                    </div>

                    <ProgressBar
                      value={Number(goal.current)}
                      max={Number(goal.target)}
                      color={goal.completed ? 'teal' : 'teal'}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <Clock size={13} />
                    <span>Target Timeline: <strong>{goal.deadline}</strong></span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '14px',
                    marginTop: '12px'
                  }}
                >
                  {!goal.completed && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Plus}
                      onClick={() => handleQuickAdd(goal)}
                    >
                      Update Progress
                    </Button>
                  )}

                  {goal.completed && (
                    <span className="flex items-center gap-1" style={{ color: '#34D399', fontSize: '0.8rem', fontWeight: 600 }}>
                      <CheckCircle2 size={16} /> Target Achieved!
                    </span>
                  )}

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(goal)}
                      style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-secondary)', color: 'var(--text-secondary)' }}
                      title="Edit Goal"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(goal.id, goal.title)}
                      style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}
                      title="Delete Goal"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Goal Form Modal */}
      <GoalFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingGoal}
      />
    </div>
  );
};
