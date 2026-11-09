import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Dumbbell,
  CheckCircle,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { WorkoutFormModal } from '../components/workouts/WorkoutFormModal';
import { SearchBar } from '../components/common/SearchBar';
import { Button } from '../components/common/Button';

export const WorkoutManagement = () => {
  const {
    userWorkouts,
    addUserWorkout,
    updateUserWorkout,
    deleteUserWorkout
  } = useFitness();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  // Summary Metrics
  const stats = useMemo(() => {
    const totalSessions = userWorkouts.length;
    const totalMinutes = userWorkouts.reduce((acc, w) => acc + Number(w.duration || 0), 0);
    const totalVolume = userWorkouts.reduce(
      (acc, w) => acc + Number(w.sets || 0) * Number(w.reps || 0) * Number(w.weight || 0),
      0
    );
    const avgDuration = totalSessions ? Math.round(totalMinutes / totalSessions) : 0;
    return { totalSessions, totalMinutes, totalVolume, avgDuration };
  }, [userWorkouts]);

  // Filtering
  const filteredList = useMemo(() => {
    return userWorkouts.filter((w) => {
      if (categoryFilter !== 'All' && w.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = w.workoutName?.toLowerCase().includes(q);
        const matchesExercise = w.exerciseName?.toLowerCase().includes(q);
        const matchesNotes = w.notes?.toLowerCase().includes(q);
        if (!matchesName && !matchesExercise && !matchesNotes) return false;
      }
      return true;
    });
  }, [userWorkouts, categoryFilter, searchQuery]);

  const handleOpenAdd = () => {
    setEditingWorkout(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (workout) => {
    setEditingWorkout(workout);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (editingWorkout) {
      updateUserWorkout(editingWorkout.id, data);
    } else {
      addUserWorkout(data);
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name || 'this workout'}"?`)) {
      deleteUserWorkout(id);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
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
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Workout Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Log individual training sessions, track progressive overload volume, and manage workout logs.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Add Workout Record
        </Button>
      </div>

      {/* KPI Stats Row */}
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
              <CheckCircle size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Sessions</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{stats.totalSessions}</div>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-left">
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--color-sky)' }}>
              <Clock size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Time Invested</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{stats.totalMinutes} min</div>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-left">
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(251, 146, 60, 0.15)', color: 'var(--color-orange)' }}>
              <Dumbbell size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Volume Lifted</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{stats.totalVolume.toLocaleString()} kg</div>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-left">
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(244, 114, 182, 0.15)', color: 'var(--color-pink)' }}>
              <TrendingUp size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Avg Duration</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{stats.avgDuration} min</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search + Category Filter + View Mode Toggle */}
      <div
        className="glass-card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search by routine, exercise, or notes..."
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-select"
            style={{ width: '180px' }}
          >
            <option value="All">All Categories</option>
            <option value="Gym">Gym & Strength</option>
            <option value="Cardio">Cardio & HIIT</option>
            <option value="Boxing">Boxing</option>
            <option value="Yoga">Yoga</option>
            <option value="Upper Body">Upper Body</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('table')}
          >
            Table View
          </button>
          <button
            type="button"
            className={`btn btn-sm ${viewMode === 'cards' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('cards')}
          >
            Cards View
          </button>
        </div>
      </div>

      {/* Workout Data: Table or Cards */}
      {filteredList.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px dashed var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '50px 20px',
            textAlign: 'center'
          }}
        >
          <FileText size={36} color="var(--text-muted)" style={{ margin: '0 auto 10px' }} />
          <h3>No workout logs found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
            {searchQuery || categoryFilter !== 'All'
              ? 'Try modifying your search or filter.'
              : 'Start logging your workouts to track your progressive overload.'}
          </p>
          <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
            Log First Workout
          </Button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="table-responsive">
          <table className="table-custom">
            <thead>
              <tr>
                <th>Date</th>
                <th>Workout Name</th>
                <th>Exercise</th>
                <th>Category</th>
                <th>Sets × Reps</th>
                <th>Weight</th>
                <th>Duration</th>
                <th>Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((w) => (
                <tr key={w.id}>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                    {w.date}
                  </td>
                  <td style={{ fontWeight: 600 }}>{w.workoutName}</td>
                  <td style={{ color: 'var(--primary-teal)', fontWeight: 500 }}>{w.exerciseName}</td>
                  <td>
                    <span className="badge badge-teal">{w.category}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {w.sets} × {w.reps}
                  </td>
                  <td style={{ fontWeight: 600 }}>{w.weight} kg</td>
                  <td>{w.duration} min</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {w.notes || '—'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(w)}
                        style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-secondary)', color: 'var(--text-secondary)' }}
                        title="Edit workout"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(w.id, w.workoutName)}
                        style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}
                        title="Delete workout"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredList.map((w) => (
            <div key={w.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge badge-teal">{w.category}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{w.date}</span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>{w.workoutName}</h3>
                <div style={{ fontSize: '0.88rem', color: 'var(--primary-teal)', fontWeight: 600, marginBottom: '12px' }}>
                  {w.exerciseName}
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                    background: 'var(--bg-card-secondary)',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    marginBottom: '12px'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Sets × Reps</span>
                    <strong>{w.sets} × {w.reps}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Weight</span>
                    <strong>{w.weight} kg</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Duration</span>
                    <strong>{w.duration} m</strong>
                  </div>
                </div>

                {w.notes && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '14px' }}>
                    "{w.notes}"
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <Button variant="secondary" size="sm" icon={Edit2} onClick={() => handleOpenEdit(w)} style={{ flex: 1 }}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDelete(w.id, w.workoutName)} style={{ flex: 1 }}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Workout Modal */}
      <WorkoutFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingWorkout}
      />
    </div>
  );
};
