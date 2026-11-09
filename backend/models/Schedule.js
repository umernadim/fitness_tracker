const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an activity name/title'],
      trim: true,
    },
    activityType: {
      type: String,
      default: 'Workout',
      trim: true,
    },
    category: {
      type: String,
      default: 'Gym',
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Please provide scheduled date (YYYY-MM-DD)'],
      index: true,
    },
    time: {
      type: String,
      required: [true, 'Please provide scheduled time'],
      default: '07:30 AM',
      trim: true,
    },
    duration: {
      type: String,
      default: '45 min',
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual id
ScheduleSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Virtual alias for activityName
ScheduleSchema.virtual('activityName').get(function () {
  return this.title;
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
