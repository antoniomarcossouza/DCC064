const amqp = require("amqplib/callback_api");
require("dotenv").config();

amqp.connect("amqp://localhost", function (error, connection) {
  if (error) {
    throw error;
  }

  connection.createChannel(function (error, channel) {
    if (error) {
      throw error;
    }

    let queue = process.env.QUEUE_NAME;

    channel.assertQueue(queue, {
      durable: false,
    });

    console.log(`Waiting for messages in ${queue}. To exit, press CTRL+C`);

    channel.consume(
      queue,
      function (msg) {
        console.log("Received %s", msg.content.toString());
      },
      {
        noAck: true,
      }
    );
  });
});
