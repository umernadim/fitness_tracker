const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    workoutName: {
      type: String,
      required: [true, 'Please provide a workout routine name'],
      trim: true,
    },
    exerciseName: {
      type: String,
      required: [true, 'Please provide an exercise name'],
      trim: true,
    },
    category: {
      type: String,
      default: 'Gym',
      trim: true,
    },
    sets: {
      type: Number,
      required: [true, 'Please provide the number of sets'],
      min: [1, 'Sets must be at least 1'],
      default: 3,
    },
    reps: {
      type: Number,
      required: [true, 'Please provide the number of reps'],
      min: [1, 'Reps must be at least 1'],
      default: 10,
    },
    weight: {
      type: Number,
      default: 0,
      min: [0, 'Weight cannot be negative'],
    },
    duration: {
      type: Number, // Duration in minutes
      required: [true, 'Please provide duration in minutes'],
      min: [1, 'Duration must be at least 1 minute'],
      default: 30,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
      index: true,
    },
    completed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual id getter
WorkoutSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('Workout', WorkoutSchema);
