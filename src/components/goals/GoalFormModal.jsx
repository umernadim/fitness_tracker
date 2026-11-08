import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export const GoalFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null
}) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Weight Loss',
    current: 75,
    target: 70,
    unit: 'kg',
    deadline: '2026-12-31',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || 'Weight Loss',
        current: initialData.current || 0,
        target: initialData.target || 0,
        unit: initialData.unit || 'kg',
        deadline: initialData.deadline || 'Daily',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        title: '',
        category: 'Weight Loss',
        current: 75,
        target: 70,
        unit: 'kg',
        deadline: '2026-12-31',
        notes: ''
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) {
      alert('Please enter a Goal Title');
      return;
    }
    onSubmit({
      ...formData,
      current: Number(formData.current),
      target: Number(formData.target)
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Fitness Goal' : 'Create New Fitness Goal'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {initialData ? 'Save Goal' : 'Set Goal'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Goal Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Reach 12% Body Fat & 72kg"
          required
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="goalCategory">Goal Category</label>
            <select
              id="goalCategory"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Weight Loss">Weight Loss</option>
              <option value="Weight Gain">Weight Gain</option>
              <option value="Daily Steps">Daily Steps</option>
              <option value="Workout Frequency">Workout Frequency</option>
              <option value="Water Intake">Water Intake</option>
              <option value="Calorie & Macro Goal">Calorie & Macro Goal</option>
            </select>
          </div>

          <Input
            label="Target Date / Frequency"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            placeholder="e.g. Daily or 2026-12-31"
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          <Input
            label="Current Value"
            name="current"
            type="number"
            value={formData.current}
            onChange={handleChange}
            step="0.1"
            required
          />

          <Input
            label="Target Goal"
            name="target"
            type="number"
            value={formData.target}
            onChange={handleChange}
            step="0.1"
            required
          />

          <Input
            label="Unit of Metric"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            placeholder="kg, steps, ml, days"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="notes">Strategy & Milestone Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Key actions to stay accountable..."
            className="form-textarea"
          />
        </div>
      </form>
    </Modal>
  );
};
