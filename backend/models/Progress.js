const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    weight: {
      type: Number,
      required: [true, 'Please provide body weight'],
      min: [20, 'Weight must be at least 20 kg'],
      max: [400, 'Weight cannot exceed 400 kg'],
    },
    chest: {
      type: Number,
      default: 0,
    },
    waist: {
      type: Number,
      default: 0,
    },
    hips: {
      type: Number,
      default: 0,
    },
    arms: {
      type: Number,
      default: 0,
    },
    bodyFat: {
      type: Number,
      default: 0,
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual id
ProgressSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('Progress', ProgressSchema);
