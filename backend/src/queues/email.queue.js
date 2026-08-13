const { Queue } = require("bullmq");
const env = require("../config/env");
const { QUEUES } = require("../constants");

const connection = { url: env.REDIS_URL };

const emailQueue = new Queue(QUEUES.EMAIL, { connection });

exports.emailQueue = emailQueue;
exports.connection = connection;
exports.enqueueWelcomeEmail = (to) => emailQueue.add("welcome", { to }, { attempts: 3 });