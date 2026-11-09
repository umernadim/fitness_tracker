const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

// Initialize Express Application
const app = express();

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'FitNexus Backend REST API is running optimally.',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/workouts', require('./routes/workoutRoutes'));
app.use('/api/nutrition', require('./routes/nutritionRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/schedules', require('./routes/scheduleRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Error Middlewares
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` FitNexus Backend API Server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
  console.log(`=================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Fatal] Unhandled Rejection: ${err.message}`);
  // Keep server running in development or close gracefully
});

module.exports = app;
