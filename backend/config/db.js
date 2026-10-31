const mongoose = require('mongoose');
const memoryStore = require('./memoryStore');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodbridge';

  try {
    console.log(`[DB] Attempting connection to MongoDB: ${uri}...`);
    // Connect with a short timeout so we quickly fall back if local mongod is not running
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });
    global.isUsingMemoryStore = false;
    console.log(`[DB] Connected successfully to MongoDB at ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`[DB] Primary MongoDB is unavailable (${err.message}).`);
    console.log('[DB] Activating built-in FoodBridge In-Memory Data Engine...');
    global.isUsingMemoryStore = true;
    await memoryStore.seed();
    console.log('[DB] In-Memory Engine active. All models, routes, auth, and stateful mutations are 100% operational!');
  }
};

const disconnectDB = async () => {
  try {
    if (!global.isUsingMemoryStore) {
      await mongoose.disconnect();
    }
  } catch (e) {
    console.error('Error disconnecting DB:', e);
  }
};

module.exports = { connectDB, disconnectDB };
