import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  Plus,
  RotateCcw,
  Sparkles,
  Search,
  Dumbbell
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { WorkoutCard } from '../components/workouts/WorkoutCard';
import { WorkoutFormModal } from '../components/workouts/WorkoutFormModal';
import { SearchBar } from '../components/common/SearchBar';
import { Button } from '../components/common/Button';

export const Workouts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { workouts, setSelectedWorkout, setActiveSession, addWorkoutToCatalog } = useFitness();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter States
  const [selectedGoal, setSelectedGoal] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState('All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Sync search param
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  // Options lists
  const goalOptions = [
    'All',
    'Stretch',
    'Legs',
    'Yoga',
    'Boxing',
    'Running',
    'Personal',
    'Arms',
    'Chest'
  ];

  const priceOptions = ['All', 'Free', 'Premium'];
  const levelOptions = ['All', 'Beginner', 'Medium', 'Advanced'];
  const durationOptions = [
    'All',
    '15–20 min',
    '20–30 min',
    '30–40 min',
    '45+ min'
  ];
  const equipmentOptions = [
    'All',
    'Kettlebell',
    'Dumbbells',
    'Yoga mat',
    'Bodyweight'
  ];

  const handleResetFilters = () => {
    setSelectedGoal('All');
    setSelectedPrice('All');
    setSelectedLevel('All');
    setSelectedDuration('All');
    setSelectedEquipment('All');
    setSearchQuery('');
    setSearchParams({});
  };

  // Filter logic
  const filteredWorkouts = useMemo(() => {
    return workouts.filter((w) => {
      // Goal / Category filter
      if (
        selectedGoal !== 'All' &&
        w.goal?.toLowerCase() !== selectedGoal.toLowerCase() &&
        w.category?.toLowerCase() !== selectedGoal.toLowerCase()
      ) {
        return false;
      }

      // Price filter
      if (selectedPrice !== 'All' && w.price !== selectedPrice) {
        return false;
      }

      // Level filter
      if (selectedLevel !== 'All' && w.level !== selectedLevel) {
        return false;
      }

      // Duration filter
      if (selectedDuration !== 'All') {
        const mins = w.durationMins || parseInt(w.duration) || 0;
        if (selectedDuration === '15–20 min' && (mins < 15 || mins > 20)) return false;
        if (selectedDuration === '20–30 min' && (mins < 20 || mins > 30)) return false;
        if (selectedDuration === '30–40 min' && (mins < 30 || mins > 40)) return false;
        if (selectedDuration === '45+ min' && mins < 45) return false;
      }

      // Equipment filter
      if (
        selectedEquipment !== 'All' &&
        !w.equipment?.toLowerCase().includes(selectedEquipment.toLowerCase())
      ) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = w.title?.toLowerCase().includes(q);
        const matchesDesc = w.description?.toLowerCase().includes(q);
        const matchesTrainer = w.trainer?.toLowerCase().includes(q);
        const matchesCategory = w.category?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesTrainer && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [
    workouts,
    selectedGoal,
    selectedPrice,
    selectedLevel,
    selectedDuration,
    selectedEquipment,
    searchQuery
  ]);

  const handleCreatePersonalTraining = (newWorkout) => {
    addWorkoutToCatalog({
      title: newWorkout.workoutName,
      subtitle: `${newWorkout.exerciseName} - Custom Training Protocol`,
      category: newWorkout.category,
      goal: 'Personal',
      level: 'Medium',
      duration: `${newWorkout.duration} min`,
      durationMins: newWorkout.duration,
      calories: Math.round(newWorkout.duration * 9.5),
      price: 'Free',
      equipment: 'Dumbbells',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80',
      description: newWorkout.notes || 'Personalized routine created in FitNexus.',
      exercises: [
        {
          name: newWorkout.exerciseName,
          sets: newWorkout.sets,
          reps: `${newWorkout.reps} reps`,
          rest: '60s'
        }
      ]
    });
  };

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Explore Workouts</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Discover expert-crafted functional strength, yoga, cardio, and calisthenics programs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              if (val) setSearchParams({ search: val });
              else setSearchParams({});
            }}
            onClear={() => {
              setSearchQuery('');
              setSearchParams({});
            }}
            placeholder="Search workouts or trainers..."
          />
        </div>
      </div>

      {/* Main 2-Column Split: Filter Sidebar + Workout Grid */}
      <div className="workouts-page-layout">
        {/* Left Filter Panel */}
        <aside className="filter-panel">
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsCreateModalOpen(true)}
            style={{ width: '100%' }}
          >
            Create Personal Training
          </Button>

          {/* Goal Filter */}
          <div>
            <div className="filter-section-title">Workout Goals</div>
            <div className="filter-options-group">
              {goalOptions.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  className={`filter-radio-pill ${selectedGoal === goal ? 'active' : ''}`}
                  onClick={() => setSelectedGoal(goal)}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <div className="filter-section-title">Pricing Tier</div>
            <div className="filter-options-group">
              {priceOptions.map((price) => (
                <button
                  key={price}
                  type="button"
                  className={`filter-radio-pill ${selectedPrice === price ? 'active' : ''}`}
                  onClick={() => setSelectedPrice(price)}
                >
                  {price}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <div className="filter-section-title">Experience Level</div>
            <div className="filter-options-group">
              {levelOptions.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  className={`filter-radio-pill ${selectedLevel === lvl ? 'active' : ''}`}
                  onClick={() => setSelectedLevel(lvl)}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Filter */}
          <div>
            <div className="filter-section-title">Session Duration</div>
            <div className="filter-options-group">
              {durationOptions.map((dur) => (
                <button
                  key={dur}
                  type="button"
                  className={`filter-radio-pill ${selectedDuration === dur ? 'active' : ''}`}
                  onClick={() => setSelectedDuration(dur)}
                >
                  {dur}
                </button>
              ))}
            </div>
          </div>

          {/* Equipment Filter */}
          <div>
            <div className="filter-section-title">Equipment Needed</div>
            <div className="filter-options-group">
              {equipmentOptions.map((eq) => (
                <button
                  key={eq}
                  type="button"
                  className={`filter-radio-pill ${selectedEquipment === eq ? 'active' : ''}`}
                  onClick={() => setSelectedEquipment(eq)}
                >
                  {eq}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Actions */}
          <div style={{ display: 'flex', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
            <Button
              variant="secondary"
              icon={RotateCcw}
              onClick={handleResetFilters}
              style={{ flex: 1 }}
            >
              Reset
            </Button>
            <Button
              variant="outline"
              icon={Filter}
              style={{ flex: 1 }}
              onClick={() => {}}
            >
              Apply ({filteredWorkouts.length})
            </Button>
          </div>
        </aside>

        {/* Workout Cards Right Content */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '18px'
            }}
          >
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Showing <strong>{filteredWorkouts.length}</strong> active workouts
            </span>

            {(selectedGoal !== 'All' || selectedPrice !== 'All' || selectedLevel !== 'All' || selectedDuration !== 'All' || selectedEquipment !== 'All' || searchQuery) && (
              <span style={{ fontSize: '0.78rem', color: 'var(--primary-teal)', cursor: 'pointer' }} onClick={handleResetFilters}>
                Clear active filters
              </span>
            )}
          </div>

          {filteredWorkouts.length === 0 ? (
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px dashed var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '60px 20px',
                textAlign: 'center'
              }}
            >
              <Dumbbell size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>No workouts match your filters</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
                Try relaxing your filter criteria or search query to see more training routines.
              </p>
              <Button variant="primary" onClick={handleResetFilters}>
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="workouts-grid">
              {filteredWorkouts.map((w) => (
                <WorkoutCard
                  key={w.id}
                  workout={w}
                  onSelect={(workout) => setSelectedWorkout(workout)}
                  onStart={(workout) => setActiveSession(workout)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Personal Training Modal */}
      <WorkoutFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePersonalTraining}
      />
    </div>
  );
};
