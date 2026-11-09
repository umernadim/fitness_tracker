const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a goal title'],
      trim: true,
    },
    category: {
      type: String,
      default: 'Weight Loss',
      trim: true,
    },
    targetValue: {
      type: Number,
      required: [true, 'Please provide a target value'],
    },
    currentValue: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: 'kg',
      trim: true,
    },
    deadline: {
      type: String,
      default: 'Daily',
      trim: true,
    },
    status: {
      type: String,
      enum: ['In Progress', 'Completed', 'Paused'],
      default: 'In Progress',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual id
GoalSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Virtual aliases for frontend compatibility
GoalSchema.virtual('target').get(function () {
  return this.targetValue;
});

GoalSchema.virtual('current').get(function () {
  return this.currentValue;
});

// Goal completion percentage
GoalSchema.virtual('percentage').get(function () {
  if (!this.targetValue || this.targetValue <= 0) return 0;
  return Math.min(100, Math.round((this.currentValue / this.targetValue) * 100));
});

module.exports = mongoose.model('Goal', GoalSchema);
