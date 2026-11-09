const express = require('express');
const router = express.Router();
const {
  createMeal,
  getMeals,
  getMealById,
  updateMeal,
  deleteMeal,
  getNutritionSummary,
} = require('../controllers/nutritionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/summary', getNutritionSummary);

router.route('/').post(createMeal).get(getMeals);
router.route('/:id').get(getMealById).put(updateMeal).delete(deleteMeal);

module.exports = router;
