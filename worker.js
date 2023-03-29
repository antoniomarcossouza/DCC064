const amqp = require("amqplib/callback_api");
const process = require("process");
const { spawn } = require("child_process");
require("dotenv").config();

const hostname = `amqp://${process.env.QUEUE_HOST}:${process.env.PORT}`;
const exchange = process.env.EXCHANGE_NAME;

function cmd(...command) {
  let p = spawn(command[0], command.slice(1));
  return new Promise((resolveFunc) => {
    p.stdout.on("data", (x) => {
      process.stdout.write(x.toString());
    });
    p.stderr.on("data", (x) => {
      process.stderr.write(x.toString());
    });
    p.on("exit", (code) => {
      resolveFunc(code);
    });
  });
}

async function main() {
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

      channel.assertQueue(
        "",
        {
          exclusive: true,
        },
        function (err, q) {
          if (err) throw err;

          console.log(
            `Waiting for messages in ${queue}. To exit, press CTRL+C`
          );
          channel.bindQueue(q.queue, exchange, "");

          channel.consume(
            queue,
            async function (message) {
              console.log(`Task ${message.content.toString()} received.`);

              await cmd("sh", message.content.toString());

              setTimeout(function () {
                console.log(`Task '${message.content.toString()}' done.`);
              });
            },
            {
              noAck: true,
            }
          );
        }
      );
    });
  });
}

main();
