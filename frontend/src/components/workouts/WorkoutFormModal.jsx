import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export const WorkoutFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null
}) => {
  const [formData, setFormData] = useState({
    workoutName: '',
    exerciseName: '',
    category: 'Gym',
    sets: 3,
    reps: 10,
    weight: 20,
    duration: 30,
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        workoutName: initialData.workoutName || '',
        exerciseName: initialData.exerciseName || '',
        category: initialData.category || 'Gym',
        sets: initialData.sets || 3,
        reps: initialData.reps || 10,
        weight: initialData.weight || 0,
        duration: initialData.duration || 30,
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        workoutName: '',
        exerciseName: '',
        category: 'Gym',
        sets: 3,
        reps: 10,
        weight: 20,
        duration: 30,
        notes: ''
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.workoutName || !formData.exerciseName) {
      alert('Please fill in Workout Name and Exercise Name');
      return;
    }
    onSubmit({
      ...formData,
      sets: Number(formData.sets),
      reps: Number(formData.reps),
      weight: Number(formData.weight),
      duration: Number(formData.duration)
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Workout Record' : 'Log New Workout'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {initialData ? 'Save Changes' : 'Add Workout'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input
            label="Workout Routine Name"
            name="workoutName"
            value={formData.workoutName}
            onChange={handleChange}
            placeholder="e.g. Upper Body Hypertrophy"
            required
          />

          <Input
            label="Exercise Name"
            name="exerciseName"
            value={formData.exerciseName}
            onChange={handleChange}
            placeholder="e.g. Incline Dumbbell Press"
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Gym">Gym & Strength</option>
              <option value="Cardio">Cardio & HIIT</option>
              <option value="Boxing">Boxing</option>
              <option value="Yoga">Yoga & Mobility</option>
              <option value="Upper Body">Upper Body</option>
              <option value="Stretching">Stretching</option>
            </select>
          </div>

          <Input
            label="Duration (minutes)"
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <Input
            label="Sets"
            name="sets"
            type="number"
            value={formData.sets}
            onChange={handleChange}
            min="1"
            required
          />

          <Input
            label="Reps"
            name="reps"
            type="number"
            value={formData.reps}
            onChange={handleChange}
            min="1"
            required
          />

          <Input
            label="Weight (kg)"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleChange}
            min="0"
            step="0.5"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="notes">Notes / Observations</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="How did the session feel? RPE, tempo, form improvements..."
            className="form-textarea"
          />
        </div>
      </form>
    </Modal>
  );
};
