import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Play, Pause, SkipForward, CheckCircle, Flame, Clock } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';

export const ActiveSessionModal = () => {
  const { activeSession, setActiveSession, addUserWorkout, logSteps } = useFitness();

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState({});

  useEffect(() => {
    let interval = null;
    if (activeSession && isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSession, isActive]);

  if (!activeSession) return null;

  const exercises = activeSession.exercises || [
    { name: activeSession.title, sets: 4, reps: '10 reps' }
  ];
  const currentEx = exercises[currentExerciseIndex] || exercises[0];

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  const handleToggleSet = (setNum) => {
    const key = `${currentExerciseIndex}-${setNum}`;
    setCompletedSets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    }
  };

  const handleFinishWorkout = () => {
    const minutesTrained = Math.max(1, Math.round(seconds / 60));
    // Save to user workout history
    addUserWorkout({
      workoutName: activeSession.title,
      exerciseName: currentEx.name,
      category: activeSession.category || 'Gym',
      sets: currentEx.sets || 4,
      reps: parseInt(currentEx.reps) || 12,
      weight: 20,
      duration: minutesTrained,
      notes: `Completed interactive session in ${formatTime(seconds)}. High energy!`
    });

    logSteps(120); // quick step bonus
    setActiveSession(null);
    setSeconds(0);
    setCurrentExerciseIndex(0);
    setCompletedSets({});
  };

  const handleClose = () => {
    if (window.confirm('Are you sure you want to exit the current workout session?')) {
      setActiveSession(null);
      setSeconds(0);
      setCurrentExerciseIndex(0);
      setCompletedSets({});
    }
  };

  return (
    <Modal
      isOpen={Boolean(activeSession)}
      onClose={handleClose}
      title={`Live Session: ${activeSession.title}`}
      size="md"
      closeOnBackdrop={false}
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={CheckCircle} onClick={handleFinishWorkout}>
            Finish & Log Session
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Timer Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(22, 184, 176, 0.25) 0%, rgba(13, 41, 40, 0.95) 100%)',
            border: '1px solid rgba(22, 184, 176, 0.4)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            textAlign: 'center',
            position: 'relative'
          }}
        >
          <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            Session Elapsed Time
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#ffffff', letterSpacing: '1px' }}>
            {formatTime(seconds)}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '12px' }}>
            <Button
              variant={isActive ? 'outline' : 'primary'}
              size="sm"
              icon={isActive ? Pause : Play}
              onClick={() => setIsActive(!isActive)}
            >
              {isActive ? 'Pause Timer' : 'Resume Timer'}
            </Button>
          </div>
        </div>

        {/* Current Exercise Details */}
        <div
          style={{
            background: 'var(--bg-card-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '20px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="badge badge-teal">
              Exercise {currentExerciseIndex + 1} of {exercises.length}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Rest: {currentEx.rest || '45s'}
            </span>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
            {currentEx.name}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Target: {currentEx.sets} sets × {currentEx.reps}
          </p>

          {/* Sets Checkboxes */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {Array.from({ length: currentEx.sets || 4 }).map((_, idx) => {
              const setNum = idx + 1;
              const isDone = completedSets[`${currentExerciseIndex}-${setNum}`];
              return (
                <button
                  key={setNum}
                  type="button"
                  onClick={() => handleToggleSet(setNum)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: isDone ? 'var(--primary-teal)' : 'rgba(255, 255, 255, 0.05)',
                    color: isDone ? '#061C1B' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    border: `1px solid ${isDone ? 'var(--primary-teal)' : 'var(--border-color)'}`
                  }}
                >
                  <CheckCircle size={14} />
                  Set {setNum}
                </button>
              );
            })}
          </div>
        </div>

        {/* Next exercise navigator */}
        {currentExerciseIndex < exercises.length - 1 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outline"
              size="sm"
              icon={SkipForward}
              iconPosition="right"
              onClick={handleNextExercise}
            >
              Next: {exercises[currentExerciseIndex + 1].name}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
