import React from 'react';
import { Heart, Clock, Flame, Dumbbell, Play } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';

export const WorkoutCard = ({ workout, onSelect, onStart }) => {
  const { toggleFavoriteWorkout } = useFitness();

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavoriteWorkout(workout.id);
  };

  const handleStartClick = (e) => {
    e.stopPropagation();
    if (onStart) {
      onStart(workout);
    } else if (onSelect) {
      onSelect(workout);
    }
  };

  return (
    <div className="workout-card" onClick={() => onSelect && onSelect(workout)}>
      <div className="workout-card-cover">
        <img src={workout.image} alt={workout.title} loading="lazy" />

        <div className="workout-card-badges">
          <span className="badge badge-teal">{workout.category}</span>
          <span className="badge badge-blue">{workout.level}</span>
          {workout.price === 'Premium' && (
            <span className="badge badge-pink">PRO</span>
          )}
        </div>

        <button
          type="button"
          className={`workout-fav-btn ${workout.isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label="Toggle favorite"
        >
          <Heart size={18} fill={workout.isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="workout-card-body">
        <div>
          <h4 className="workout-card-title">{workout.title}</h4>
          <p className="workout-card-desc">{workout.subtitle || workout.description}</p>
        </div>

        <div>
          <div className="workout-card-meta">
            <span className="flex items-center gap-1">
              <Clock size={15} color="var(--primary-teal)" />
              {workout.duration}
            </span>
            <span className="flex items-center gap-1">
              <Flame size={15} color="var(--color-orange)" />
              {workout.calories} kcal
            </span>
            <span className="flex items-center gap-1">
              <Dumbbell size={15} color="var(--color-sky)" />
              {workout.equipment}
            </span>
          </div>

          <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
              onClick={() => onSelect && onSelect(workout)}
            >
              Details
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ flex: 1.2 }}
              onClick={handleStartClick}
            >
              <Play size={14} fill="currentColor" />
              Start Workout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
