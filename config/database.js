const mongoose = require('mongoose');

/**
 * connectDB - connects to MongoDB with retry logic and an optional
 * in-memory fallback (for local development when Atlas isn't available).
 *
 * To force an in-memory DB, set USE_IN_MEMORY_DB=true in .env
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  const useInMemory = process.env.USE_IN_MEMORY_DB === 'true';

  const tryConnect = async (connectionString) => {
    // modern mongoose doesn't require the deprecated options
    const conn = await mongoose.connect(connectionString);
    console.log(`MongoDB Connected: ${conn.connection.host || 'in-memory'}`);
    return conn;
  };

  if (useInMemory) {
    // Defer requiring heavy dev dependency until needed
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();
    await tryConnect(memUri);
    // keep process alive with mongod in scope
    return;
  }

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment');
  }

  const maxAttempts = 5;
  const retryDelayMs = 3000;
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      await tryConnect(uri);
      return;
    } catch (error) {
      attempt += 1;
      console.error(`MongoDB connection attempt ${attempt} failed: ${error.message}`);
      if (attempt >= maxAttempts) {
        console.error('Exceeded max MongoDB connection attempts. Falling back to in-memory DB.');
        // Try fallback to in-memory server automatically
        try {
          const { MongoMemoryServer } = require('mongodb-memory-server');
          const mongod = await MongoMemoryServer.create();
          const memUri = mongod.getUri();
          await tryConnect(memUri);
          return;
        } catch (memErr) {
          console.error('In-memory MongoDB fallback failed:', memErr.message || memErr);
          throw error; // rethrow original
        }
      }
      console.log(`Retrying in ${retryDelayMs / 1000}s...`);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((res) => setTimeout(res, retryDelayMs));
    }
  }
};

module.exports = connectDB;
