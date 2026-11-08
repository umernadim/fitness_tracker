import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export const ProgressFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: 74.5,
    chest: 105,
    waist: 81.5,
    hips: 95,
    arms: 38,
    bodyFat: 14.8,
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.weight || !formData.date) {
      alert('Please enter Date and Weight');
      return;
    }
    onSubmit({
      ...formData,
      weight: Number(formData.weight),
      chest: Number(formData.chest),
      waist: Number(formData.waist),
      hips: Number(formData.hips),
      arms: Number(formData.arms),
      bodyFat: Number(formData.bodyFat)
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Body Progress"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Measurements
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input
            label="Log Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <Input
            label="Bodyweight (kg)"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleChange}
            step="0.1"
            min="30"
            max="300"
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          <Input
            label="Body Fat (%)"
            name="bodyFat"
            type="number"
            value={formData.bodyFat}
            onChange={handleChange}
            step="0.1"
            min="3"
            max="60"
          />

          <Input
            label="Chest (cm)"
            name="chest"
            type="number"
            value={formData.chest}
            onChange={handleChange}
            step="0.5"
          />

          <Input
            label="Waist (cm)"
            name="waist"
            type="number"
            value={formData.waist}
            onChange={handleChange}
            step="0.5"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input
            label="Hips (cm)"
            name="hips"
            type="number"
            value={formData.hips}
            onChange={handleChange}
            step="0.5"
          />

          <Input
            label="Arms (cm)"
            name="arms"
            type="number"
            value={formData.arms}
            onChange={handleChange}
            step="0.5"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="notes">Notes / Observations</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Conditioning notes, vein definition, energy levels..."
            className="form-textarea"
          />
        </div>
      </form>
    </Modal>
  );
};
