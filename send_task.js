const amqp = require("amqplib/callback_api");
require("dotenv").config();

const hostname = `amqp://${process.env.QUEUE_HOST}:${process.env.PORT}`;
const exchange = process.env.EXCHANGE_NAME;
const message = process.argv.slice(2).join(" ") || "Hello World!";

amqp.connect(hostname, function (err, connection) {
  if (err) {
    throw err;
  }

  connection.createChannel(function (err, channel) {
    if (err) {
      throw err;
    }

    channel.assertExchange(exchange, "fanout", {
      durable: false,
    });

    channel.publish(exchange, "", Buffer.from(message));
    console.log(`Sent task ${message}`);
  });

  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});
