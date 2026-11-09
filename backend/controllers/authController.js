const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * Helper to build safe user response
 */
const formatUserResponse = (user) => {
  return {
    id: user._id,
    _id: user._id,
    name: user.name,
    email: user.email,
    gender: user.gender,
    dateOfBirth: user.dateOfBirth,
    dob: user.dob,
    height: user.height,
    weight: user.weight,
    startingWeight: user.startingWeight,
    targetWeight: user.targetWeight,
    bodyFat: user.bodyFat,
    bio: user.bio,
    avatar: user.avatar,
    profilePicture: user.profilePicture,
    membership: user.membership,
    streak: user.streak,
    reminders: user.reminders,
    preferences: user.preferences,
    createdAt: user.createdAt,
  };
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const { name, email, password, confirmPassword, gender, dateOfBirth, dob } = req.body;

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An athlete account with this email address already exists. Please log in.',
      });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      gender: gender || 'Male',
      dateOfBirth: dateOfBirth || dob || '1996-05-14',
      dob: dateOfBirth || dob || '1996-05-14',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Athlete account created successfully.',
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user and get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Check for user and explicitly include password field
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
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
 * @desc    Logout user / clear session
 * @route   POST /api/auth/logout
 * @access  Public / Private
 */
const logout = async (req, res) => {
  // Clear cookie if cookie authentication was used
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully.',
  });
};

/**
 * @desc    Forgot password - Generate reset token
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your registered email address.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'There is no user registered with that email address.',
      });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Since email sending is not configured (eProject demo environment),
    // return resetToken directly in response for immediate demonstration & Postman testing.
    res.status(200).json({
      success: true,
      message:
        'Password recovery token generated. Email service is not configured on this server, so the recovery token is returned below for testing and demonstration.',
      resetToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password using recovery token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, password, confirmPassword } = req.body;

    if (!resetToken) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is required.',
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    // Hash token to compare with database
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.',
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You are now logged in.',
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  formatUserResponse,
};
