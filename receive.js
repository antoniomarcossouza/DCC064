const amqp = require("amqplib/callback_api");
require("dotenv").config();

let queue = process.env.QUEUE_NAME;

amqp.connect("amqp://localhost", function (error, connection) {
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

    console.log(`Waiting for messages in ${queue}. To exit, press CTRL+C`);

    channel.consume(
      queue,
      function (msg) {
        console.log("Received %s", msg.content.toString());
      },
      {
        noAck: false,
      }
    );
  });
});
