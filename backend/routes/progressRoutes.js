const express = require('express');
const router = express.Router();
const {
  createProgress,
  getProgress,
  getProgressById,
  updateProgress,
  deleteProgress,
  getProgressSummary,
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/summary', getProgressSummary);

router.route('/').post(createProgress).get(getProgress);
router
  .route('/:id')
  .get(getProgressById)
  .put(updateProgress)
  .delete(deleteProgress);

module.exports = router;
