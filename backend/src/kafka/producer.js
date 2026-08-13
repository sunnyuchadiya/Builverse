const { producer } = require("./client");

exports.publish = (topic, message) =>
  producer.send({ topic, messages: [{ value: JSON.stringify(message) }] });