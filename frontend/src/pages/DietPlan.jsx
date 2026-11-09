import React, { useState, useMemo } from 'react';
import {
  Plus,
  Flame,
  Utensils,
  Eye,
  Trash2,
  Edit2,
  CheckCircle,
  Apple,
  Sparkles,
  Droplet
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { FoodCard } from '../components/nutrition/FoodCard';
import { MealFormModal } from '../components/nutrition/MealFormModal';
import { ProgressBar } from '../components/common/ProgressBar';
import { CircularProgress } from '../components/common/CircularProgress';
import { Button } from '../components/common/Button';

export const DietPlan = () => {
  const {
    foodCatalog,
    loggedMeals,
    addLoggedMeal,
    updateLoggedMeal,
    deleteLoggedMeal,
    nutritionTotals,
    nutritionGoals,
    setSelectedMeal,
    logWater,
    metrics
  } = useFitness();

  const [activeCategory, setActiveCategory] = useState('All');
  const [isAddMealModalOpen, setIsAddMealModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);

  const mealCategories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  // Filter food catalog
  const filteredCatalog = useMemo(() => {
    if (activeCategory === 'All') return foodCatalog;
    return foodCatalog.filter(
      (f) =>
        f.category?.toLowerCase() === activeCategory.toLowerCase() ||
        f.mealType?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [foodCatalog, activeCategory]);

  const handleOpenAddMeal = () => {
    setEditingMeal(null);
    setIsAddMealModalOpen(true);
  };

  const handleOpenEditMeal = (meal) => {
    setEditingMeal(meal);
    setIsAddMealModalOpen(true);
  };

  const handleFormSubmit = (mealData) => {
    if (editingMeal) {
      updateLoggedMeal(editingMeal.id, mealData);
    } else {
      addLoggedMeal(mealData);
    }
  };

  const handleDeleteLogged = (id, name) => {
    if (window.confirm(`Remove "${name}" from today's log?`)) {
      deleteLoggedMeal(id);
    }
  };

  const caloriesRemaining = Math.max(0, nutritionGoals.calories.target - nutritionTotals.calories);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Diet & Nutrition Plan</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Monitor macronutrient targets, log daily meals, and explore athletic high-protein recipes.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={handleOpenAddMeal}>
          Add Custom Meal
        </Button>
      </div>

      {/* 1. Macro Dashboard Banner */}
      <section className="nutrition-banner">
        {/* Calories Circular Target */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <CircularProgress
            value={nutritionTotals.calories}
            max={nutritionGoals.calories.target}
            size={110}
            strokeWidth={9}
            color="#FB923C"
            showText={false}
          />
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Daily Calories</span>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#fff', lineHeight: 1.1 }}>
              {nutritionTotals.calories}
              <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '4px' }}>
                / {nutritionGoals.calories.target} kcal
              </span>
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--primary-teal)', fontWeight: 600 }}>
              {caloriesRemaining > 0 ? `${caloriesRemaining} kcal remaining` : 'Target reached!'}
            </span>
          </div>
        </div>

        {/* 3 Macro Progress Bars */}
        <div className="macro-bars-grid">
          {/* Protein */}
          <div className="macro-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-teal)' }}>Protein</span>
              <strong style={{ fontSize: '0.9rem' }}>{nutritionTotals.protein} / {nutritionGoals.protein.target}g</strong>
            </div>
            <ProgressBar
              value={nutritionTotals.protein}
              max={nutritionGoals.protein.target}
              color="teal"
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {Math.max(0, nutritionGoals.protein.target - nutritionTotals.protein)}g left for target
            </span>
          </div>

          {/* Carbs */}
          <div className="macro-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-sky)' }}>Carbohydrates</span>
              <strong style={{ fontSize: '0.9rem' }}>{nutritionTotals.carbs} / {nutritionGoals.carbs.target}g</strong>
            </div>
            <ProgressBar
              value={nutritionTotals.carbs}
              max={nutritionGoals.carbs.target}
              color="blue"
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {Math.max(0, nutritionGoals.carbs.target - nutritionTotals.carbs)}g left for target
            </span>
          </div>

          {/* Fats */}
          <div className="macro-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-pink)' }}>Healthy Fats</span>
              <strong style={{ fontSize: '0.9rem' }}>{nutritionTotals.fats} / {nutritionGoals.fats.target}g</strong>
            </div>
            <ProgressBar
              value={nutritionTotals.fats}
              max={nutritionGoals.fats.target}
              color="pink"
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {Math.max(0, nutritionGoals.fats.target - nutritionTotals.fats)}g left for target
            </span>
          </div>
        </div>
      </section>

      {/* 2. Today's Logged Meals Section */}
      <section className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Today's Food Diary</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {loggedMeals.length} items logged today ({nutritionTotals.calories} kcal consumed)
            </p>
          </div>

          <Button variant="secondary" size="sm" icon={Plus} onClick={handleOpenAddMeal}>
            Log Item
          </Button>
        </div>

        {loggedMeals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
            <Utensils size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
            <p>No meals logged yet today. Choose from the catalog below or add a custom meal.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {loggedMeals.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  background: 'var(--bg-card-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span className="badge badge-teal">{item.mealType}</span>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.name}</h4>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      {item.quantity || '1 serving'} • Logged at {item.time || 'Today'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--color-orange)', fontWeight: 700 }}>{item.calories} kcal</span>
                    <span style={{ color: 'var(--primary-teal)' }}>P: {item.protein}g</span>
                    <span style={{ color: 'var(--color-sky)' }}>C: {item.carbs}g</span>
                    <span style={{ color: 'var(--color-pink)' }}>F: {item.fats}g</span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenEditMeal(item)}
                      style={{ padding: '6px', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}
                      title="Edit meal"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLogged(item.id, item.name)}
                      style={{ padding: '6px', borderRadius: 'var(--radius-sm)', color: '#EF4444' }}
                      title="Delete meal"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Meal Catalog Tabs & Food Cards */}
      <section id="food-catalog">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>FitNexus Meal Recipes & Database</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Click "Recipe" to view ingredients and prep steps, or "Log Meal" to add to your daily intake.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="tabs-container" style={{ marginBottom: 0 }}>
            {mealCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '22px' }}>
          {filteredCatalog.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onSelect={(item) => setSelectedMeal(item)}
            />
          ))}
        </div>
      </section>

      {/* Add / Edit Meal Modal */}
      <MealFormModal
        isOpen={isAddMealModalOpen}
        onClose={() => setIsAddMealModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingMeal}
      />
    </div>
  );
};
