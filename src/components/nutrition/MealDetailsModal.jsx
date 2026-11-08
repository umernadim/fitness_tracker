import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Plus, Check, Flame } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';

export const MealDetailsModal = ({ meal, isOpen, onClose }) => {
  const { addLoggedMeal } = useFitness();

  if (!meal) return null;

  const handleLogThisMeal = () => {
    addLoggedMeal({
      name: meal.name,
      mealType: meal.mealType || meal.category || 'Lunch',
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats,
      quantity: '1 serving'
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={meal.name}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" icon={Plus} onClick={handleLogThisMeal}>
            Log to Today's Diet
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Banner */}
        <div style={{ height: '220px', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative' }}>
          <img src={meal.image} alt={meal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              display: 'flex',
              gap: '8px'
            }}
          >
            <span className="badge badge-teal">{meal.mealType || meal.category}</span>
          </div>
        </div>

        {/* Macros Breakdown Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            background: 'var(--bg-card-secondary)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Energy</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-orange)', fontFamily: 'var(--font-heading)' }}>
              {meal.calories} kcal
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Protein</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-teal)', fontFamily: 'var(--font-heading)' }}>
              {meal.protein}g
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Carbohydrates</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-sky)', fontFamily: 'var(--font-heading)' }}>
              {meal.carbs}g
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fats</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-pink)', fontFamily: 'var(--font-heading)' }}>
              {meal.fats}g
            </div>
          </div>
        </div>

        {/* Ingredients */}
        {meal.ingredients && meal.ingredients.length > 0 && (
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px' }}>
              Ingredients
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '8px' }}>
              {meal.ingredients.map((ing, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    background: 'var(--bg-card-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <Check size={14} color="var(--primary-teal)" />
                  {ing}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preparation Instructions */}
        {meal.prepInstructions && meal.prepInstructions.length > 0 && (
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px' }}>
              Preparation Instructions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {meal.prepInstructions.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5
                  }}
                >
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(22, 184, 176, 0.15)',
                      color: 'var(--primary-teal)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      flexShrink: 0
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
