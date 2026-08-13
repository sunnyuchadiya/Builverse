const Redis = require("ioredis");
const env = require("../config/env");
const logger = require("../utils/logger");

const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: null,
  enableOfflineQueue: false,
  retryStrategy: () => null, // Stop endless retry spam if Redis is offline
});

redis.on("error", (err) => {
  // Silent catch offline redis error
});

async function connectRedis() {
  try {
    await redis.connect();
    logger.info("Redis connected successfully");
  } catch (err) {
    logger.warn("Redis connection notice (offline): " + err.message);
  }
}

module.exports = { redis, connectRedis };