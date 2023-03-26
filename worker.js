const amqp = require("amqplib/callback_api");
require("dotenv").config();

const hostname = `amqp://${process.env.QUEUE_HOST}:${process.env.PORT}`;
const queue = process.env.QUEUE_NAME;

amqp.connect(hostname, function (error, connection) {
  if (error) {
    throw error;
  }

  connection.createChannel(function (error, channel) {
    if (error) {
      throw error;
    }

    channel.prefetch(1);

    channel.assertQueue(queue, {
      durable: true,
    });

    console.log(`Waiting for messages in ${queue}. To exit, press CTRL+C`);

    channel.consume(
      queue,
      function (message) {
        var secs = message.content.toString().split(".").length - 1;

        console.log(`Message received: ${message.content.toString()}`);

        setTimeout(function () {
          console.log(`Message '${message.content.toString()}' done.`);
        }, secs * 1000);
      },
      {
        noAck: false,
      }
    );
  });
});
