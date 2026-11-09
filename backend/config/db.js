const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Supports local MongoDB instance and remote MongoDB Atlas via MONGO_URI
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitnexus';

    const conn = await mongoose.connect(mongoURI, {
      autoIndex: true,
    });

    console.log(`[MongoDB] Database connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
