const User = require('../models/User');
const { formatUserResponse } = require('./authController');

/**
 * @desc    Get current user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    res.status(200).json({
      success: true,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update current user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const {
      name,
      email,
      gender,
      dateOfBirth,
      dob,
      height,
      weight,
      startingWeight,
      targetWeight,
      bodyFat,
      bio,
      avatar,
      profilePicture,
      preferences,
      reminders,
      membership,
    } = req.body;

    // Check if new email is already taken by another user
    if (email && email.toLowerCase().trim() !== user.email) {
      const emailExists = await User.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: user._id },
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'That email address is already in use by another account.',
        });
      }
      user.email = email.toLowerCase().trim();
    }

    if (name) user.name = name.trim();
    if (gender) user.gender = gender;
    if (dateOfBirth || dob) {
      user.dateOfBirth = dateOfBirth || dob;
      user.dob = dateOfBirth || dob;
    }
    if (height !== undefined) user.height = Number(height);
    if (weight !== undefined) user.weight = Number(weight);
    if (startingWeight !== undefined) user.startingWeight = Number(startingWeight);
    if (targetWeight !== undefined) user.targetWeight = Number(targetWeight);
    if (bodyFat !== undefined) user.bodyFat = Number(bodyFat);
    if (bio !== undefined) user.bio = bio;
    if (avatar || profilePicture) {
      user.avatar = avatar || profilePicture;
      user.profilePicture = avatar || profilePicture;
    }
    if (membership) user.membership = membership;

    // Deep merge or update preferences
    if (preferences) {
      user.preferences = {
        ...user.preferences,
        ...preferences,
      };
    }

    // Update reminders
    if (reminders) {
      user.reminders = {
        ...user.reminders,
        ...reminders,
      };
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: formatUserResponse(updatedUser),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
