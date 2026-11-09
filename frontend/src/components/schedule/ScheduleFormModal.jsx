import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export const ScheduleFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  defaultDate = ''
}) => {
  const [formData, setFormData] = useState({
    activityName: '',
    activityType: 'Workout',
    category: 'Gym',
    date: defaultDate || new Date().toISOString().split('T')[0],
    time: '07:30 AM',
    duration: '45 min',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        activityName: initialData.activityName || '',
        activityType: initialData.activityType || 'Workout',
        category: initialData.category || 'Gym',
        date: initialData.date || defaultDate || new Date().toISOString().split('T')[0],
        time: initialData.time || '07:30 AM',
        duration: initialData.duration || '45 min',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        activityName: '',
        activityType: 'Workout',
        category: 'Gym',
        date: defaultDate || new Date().toISOString().split('T')[0],
        time: '07:30 AM',
        duration: '45 min',
        notes: ''
      });
    }
  }, [initialData, defaultDate, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.activityName || !formData.date) {
      alert('Please fill in Activity Name and Date');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Schedule Activity' : 'Add Activity to Schedule'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {initialData ? 'Save Changes' : 'Schedule Activity'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Activity Name"
          name="activityName"
          value={formData.activityName}
          onChange={handleChange}
          placeholder="e.g. Chest & Triceps Hypertrophy"
          required
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="activityType">Activity Type</label>
            <select
              id="activityType"
              name="activityType"
              value={formData.activityType}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Workout">Workout Routine</option>
              <option value="Meal Reminder">Meal Reminder</option>
              <option value="Cardio">Cardio & Running</option>
              <option value="Rest & Recovery">Rest & Mobility</option>
              <option value="Check-in">Weigh-in & Check-in</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Gym">Gym</option>
              <option value="Diet">Diet & Nutrition</option>
              <option value="Cardio">Cardio</option>
              <option value="Yoga">Yoga</option>
              <option value="Progress">Progress Tracking</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '14px' }}>
          <Input
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <Input
            label="Time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            placeholder="08:00 AM"
            required
          />

          <Input
            label="Duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="45 min"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="notes">Notes & Instructions</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Gear needed, specific exercises or reminders..."
            className="form-textarea"
          />
        </div>
      </form>
    </Modal>
  );
};
