const express = require('express');
const router = express.Router();
const {
  getFitnessReport,
  getNutritionReport,
  exportWorkoutsCSV,
  exportNutritionCSV,
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/fitness', getFitnessReport);
router.get('/nutrition', getNutritionReport);
router.get('/export/workouts', exportWorkoutsCSV);
router.get('/export/nutrition', exportNutritionCSV);

module.exports = router;
