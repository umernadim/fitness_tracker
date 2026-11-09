const express = require('express');
const router = express.Router();
const {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
} = require('../controllers/scheduleController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').post(createSchedule).get(getSchedules);
router
  .route('/:id')
  .get(getScheduleById)
  .put(updateSchedule)
  .delete(deleteSchedule);

module.exports = router;
