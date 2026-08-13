const { kafka } = require("./client");
const logger = require("../utils/logger");
const { TOPICS } = require("../constants");

async function startConsumer() {
  const consumer = kafka.consumer({ groupId: "nexus-api" });
  await consumer.connect();
  await consumer.subscribe({ topic: TOPICS.COURSE_CREATED, fromBeginning: false });
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      logger.info(`kafka:${topic}`, message.value?.toString());
    },
  });
}

module.exports = startConsumer;