const { Worker } = require("bullmq");
const { connection } = require("./email.queue");
const { QUEUES } = require("../constants");
const logger = require("../utils/logger");

module.exports = () =>
  new Worker(
    QUEUES.EMAIL,
    async (job) => {
      logger.info(`sending ${job.name} email to ${job.data.to}`);
    },
    { connection },
  );