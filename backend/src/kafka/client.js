const { Kafka } = require("kafkajs");
const env = require("../config/env");
const logger = require("../utils/logger");

const kafka = new Kafka({
  clientId: "nexus-api",
  brokers: env.KAFKA_BROKERS,
  retry: { retries: 1 },
});
const producer = kafka.producer();

async function connectKafka() {
  try {
    await producer.connect();
    logger.info("Kafka producer connected");
  } catch (err) {
    logger.warn("Kafka connection notice (offline): " + err.message);
  }
}

module.exports = { kafka, producer, connectKafka };