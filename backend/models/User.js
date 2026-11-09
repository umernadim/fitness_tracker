const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never return password hash in regular queries
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Non-Binary', 'Other'],
      default: 'Male',
    },
    dateOfBirth: {
      type: String,
      default: '1996-05-14',
    },
    dob: {
      type: String,
      default: '1996-05-14',
    },
    height: {
      type: Number,
      default: 178, // in cm
    },
    weight: {
      type: Number,
      default: 74.5, // in kg
    },
    startingWeight: {
      type: Number,
      default: 79.3,
    },
    targetWeight: {
      type: Number,
      default: 72.0,
    },
    bodyFat: {
      type: Number,
      default: 14.8,
    },
    bio: {
      type: String,
      default:
        'Fitness enthusiast striving for functional strength, athletic agility, and balanced holistic nutrition.',
      maxlength: [300, 'Bio cannot exceed 300 characters'],
    },
    avatar: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    },
    profilePicture: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    },
    membership: {
      type: String,
      default: 'PRO Elite',
    },
    streak: {
      type: Number,
      default: 1,
    },
    reminders: {
      workout: { type: Boolean, default: true },
      meal: { type: Boolean, default: true },
      water: { type: Boolean, default: true },
    },
    preferences: {
      weightUnit: { type: String, default: 'kg' },
      heightUnit: { type: String, default: 'cm' },
      waterUnit: { type: String, default: 'ml' },
      theme: { type: String, default: 'dark' },
      accentColor: { type: String, default: '#16B8B0' },
      notifications: { type: Boolean, default: true },
      emailNewsletter: { type: Boolean, default: true },
      profilePublic: { type: Boolean, default: false },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpire;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// Pre-save hook: Hash password before saving if modified
UserSchema.pre('save', async function (next) {
  // Sync dob and dateOfBirth
  if (this.isModified('dateOfBirth') && !this.isModified('dob')) {
    this.dob = this.dateOfBirth;
  } else if (this.isModified('dob') && !this.isModified('dateOfBirth')) {
    this.dateOfBirth = this.dob;
  }

  // Sync avatar and profilePicture
  if (this.isModified('avatar') && !this.isModified('profilePicture')) {
    this.profilePicture = this.avatar;
  } else if (this.isModified('profilePicture') && !this.isModified('avatar')) {
    this.avatar = this.profilePicture;
  }

  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate random token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire time (15 minutes)
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
