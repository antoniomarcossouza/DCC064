const amqp = require("amqplib/callback_api");
require("dotenv").config();

const hostname = `amqp://${process.env.QUEUE_HOST}:${process.env.PORT}`;
const queue = process.env.QUEUE_NAME;
const message = process.argv.slice(2).join(" ") || "Hello World!";

amqp.connect(hostname, function (error, connection) {
  if (error) {
    throw error;
  }

  connection.createChannel(function (error, channel) {
    if (error) {
      throw error;
    }

    channel.assertQueue(queue, {
      durable: true,
    });

    channel.sendToQueue(queue, Buffer.from(message), {
      persistent: true,
    });

    console.log(`Sent ${message}`);
  });

  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});
