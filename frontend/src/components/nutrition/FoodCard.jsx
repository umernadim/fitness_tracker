import React from 'react';
import { Plus, Eye, Flame } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';

export const FoodCard = ({ food, onSelect }) => {
  const { addLoggedMeal } = useFitness();

  const handleQuickLog = (e) => {
    e.stopPropagation();
    addLoggedMeal({
      name: food.name,
      mealType: food.mealType || food.category || 'Lunch',
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats,
      quantity: '1 serving'
    });
  };

  return (
    <div className="food-card" onClick={() => onSelect && onSelect(food)}>
      <img src={food.image} alt={food.name} className="food-card-img" loading="lazy" />

      <div className="food-card-body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span className="badge badge-teal">{food.mealType || food.category}</span>
          <span className="flex items-center gap-1" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-orange)' }}>
            <Flame size={14} />
            {food.calories} kcal
          </span>
        </div>

        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px', lineHeight: 1.3 }}>
          {food.name}
        </h4>

        {food.description && (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {food.description}
          </p>
        )}

        <div className="food-macros-row">
          <div className="macro-pill">
            <span>Protein</span>
            <strong style={{ color: 'var(--primary-teal)' }}>{food.protein}g</strong>
          </div>
          <div className="macro-pill">
            <span>Carbs</span>
            <strong style={{ color: 'var(--color-sky)' }}>{food.carbs}g</strong>
          </div>
          <div className="macro-pill">
            <span>Fats</span>
            <strong style={{ color: 'var(--color-pink)' }}>{food.fats}g</strong>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
            onClick={() => onSelect && onSelect(food)}
          >
            <Eye size={14} />
            Recipe
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            style={{ flex: 1.2 }}
            onClick={handleQuickLog}
          >
            <Plus size={14} />
            Log Meal
          </button>
        </div>
      </div>
    </div>
  );
};
