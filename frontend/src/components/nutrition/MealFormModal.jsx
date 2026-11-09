import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export const MealFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null
}) => {
  const [formData, setFormData] = useState({
    name: '',
    mealType: 'Breakfast',
    calories: 350,
    protein: 25,
    carbs: 40,
    fats: 10,
    quantity: '1 serving'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        mealType: initialData.mealType || 'Breakfast',
        calories: initialData.calories || 0,
        protein: initialData.protein || 0,
        carbs: initialData.carbs || 0,
        fats: initialData.fats || 0,
        quantity: initialData.quantity || '1 serving'
      });
    } else {
      setFormData({
        name: '',
        mealType: 'Breakfast',
        calories: 350,
        protein: 25,
        carbs: 40,
        fats: 10,
        quantity: '1 serving'
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please enter a Food/Meal Name');
      return;
    }
    onSubmit({
      ...formData,
      calories: Number(formData.calories),
      protein: Number(formData.protein),
      carbs: Number(formData.carbs),
      fats: Number(formData.fats)
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Logged Meal' : 'Log Meal / Food Item'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {initialData ? 'Update Meal' : 'Add to Today’s Log'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Food or Meal Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Grilled Chicken Breast with Brown Rice"
          required
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="mealType">Meal Category</label>
            <select
              id="mealType"
              name="mealType"
              value={formData.mealType}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snacks">Snacks</option>
            </select>
          </div>

          <Input
            label="Portion / Quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="e.g. 1 plate / 250g"
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <Input
            label="Calories (kcal)"
            name="calories"
            type="number"
            value={formData.calories}
            onChange={handleChange}
            min="0"
            required
          />

          <Input
            label="Protein (g)"
            name="protein"
            type="number"
            value={formData.protein}
            onChange={handleChange}
            min="0"
            required
          />

          <Input
            label="Carbs (g)"
            name="carbs"
            type="number"
            value={formData.carbs}
            onChange={handleChange}
            min="0"
            required
          />

          <Input
            label="Fats (g)"
            name="fats"
            type="number"
            value={formData.fats}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
      </form>
    </Modal>
  );
};
