const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    foodName: {
      type: String,
      required: [true, 'Please provide the food or meal name'],
      trim: true,
    },
    mealType: {
      type: String,
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Other'],
      default: 'Breakfast',
    },
    quantity: {
      type: String,
      default: '1 serving',
      trim: true,
    },
    calories: {
      type: Number,
      required: [true, 'Please provide calorie amount'],
      min: [0, 'Calories cannot be negative'],
      default: 0,
    },
    protein: {
      type: Number,
      min: [0, 'Protein cannot be negative'],
      default: 0,
    },
    carbohydrates: {
      type: Number,
      min: [0, 'Carbohydrates cannot be negative'],
      default: 0,
    },
    fats: {
      type: Number,
      min: [0, 'Fats cannot be negative'],
      default: 0,
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
      index: true,
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
MealSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Virtual aliases for frontend compatibility
MealSchema.virtual('name').get(function () {
  return this.foodName;
});

MealSchema.virtual('carbs').get(function () {
  return this.carbohydrates;
});

module.exports = mongoose.model('Meal', MealSchema);
