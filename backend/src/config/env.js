module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 5000),
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nexus",
  REDIS_URL: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  KAFKA_BROKERS: (process.env.KAFKA_BROKERS || "127.0.0.1:9092").split(","),
  JWT_SECRET: process.env.JWT_SECRET || "super-secret-nexus-jwt-token-key",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
};