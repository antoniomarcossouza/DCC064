const amqp = require("amqplib/callback_api");
// const { exec } = require("child_process");
const process = require("process");
const { spawn } = require("child_process");
require("dotenv").config();

const hostname = `amqp://${process.env.QUEUE_HOST}:${process.env.PORT}`;
const queue = process.env.QUEUE_NAME;

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

      // channel.prefetch(1);

      console.log(`Waiting for messages in ${queue}. To exit, press CTRL+C`);

      channel.consume(
        queue,
        async function (message) {
          console.log(`Task ${message.content.toString()} received.`);

          // exec(
          //   `sh ${message.content.toString()}`,
          //   function (err, stdout, stderr) {
          //     console.log(stdout);
          //     console.log(stderr);
          //     if (err != null) console.log(err);
          //   }
          // );
          await cmd("sh", message.content.toString());

          setTimeout(function () {
            console.log(`Task '${message.content.toString()}' done.`);
          });
        },
        {
          noAck: false,
        }
      );
    });
  });
}

main();
