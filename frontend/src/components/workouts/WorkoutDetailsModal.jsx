import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Clock, Flame, Dumbbell, User, Award, CheckCircle2, Play } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';

export const WorkoutDetailsModal = ({ workout, isOpen, onClose }) => {
  const { setActiveSession } = useFitness();

  if (!workout) return null;

  const handleStartWorkout = () => {
    setActiveSession(workout);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={workout.title}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" icon={Play} onClick={handleStartWorkout}>
            Start Workout Session
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Cover banner */}
        <div
          style={{
            height: '240px',
            width: '100%',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <img
            src={workout.image}
            alt={workout.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(6, 28, 27, 0.95) 0%, transparent 60%)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              right: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                <span className="badge badge-teal">{workout.category}</span>
                <span className="badge badge-blue">{workout.level}</span>
                {workout.price === 'Premium' && <span className="badge badge-pink">PRO</span>}
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>
                {workout.title}
              </h3>
            </div>
            {workout.trainer && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.5)', padding: '6px 12px', borderRadius: 'var(--radius-full)' }}>
                <User size={14} color="var(--primary-teal)" />
                <span style={{ fontSize: '0.8rem', color: '#fff' }}>{workout.trainer}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Meta Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            background: 'var(--bg-card-secondary)',
            padding: '14px',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Duration</span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{workout.duration}</strong>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Burn Est.</span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--color-orange)' }}>{workout.calories} kcal</strong>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Difficulty</span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--color-sky)' }}>{workout.level}</strong>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Equipment</span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--primary-teal)' }}>{workout.equipment}</strong>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '6px' }}>Overview</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {workout.description}
          </p>
        </div>

        {/* Exercises Routine */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px' }}>
            Included Exercises ({workout.exercises?.length || 0})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {workout.exercises?.map((ex, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--bg-card-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'rgba(22, 184, 176, 0.15)',
                      color: 'var(--primary-teal)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 700
                    }}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <h5 style={{ fontSize: '0.92rem', fontWeight: 600 }}>{ex.name}</h5>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      Rest: {ex.rest || '45s'}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--primary-teal)' }}>
                    {ex.sets} Sets × {ex.reps}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
