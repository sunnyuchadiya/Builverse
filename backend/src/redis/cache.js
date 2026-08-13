const { redis } = require("./client");

exports.get = async (key) => {
  const raw = await redis.get(key);
  return raw ? JSON.parse(raw) : null;
};

exports.set = (key, value, ttlSeconds = 300) =>
  redis.set(key, JSON.stringify(value), "EX", ttlSeconds);

exports.del = (key) => redis.del(key);