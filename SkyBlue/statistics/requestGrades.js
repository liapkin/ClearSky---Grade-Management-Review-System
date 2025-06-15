const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');
const amqpUrl = process.env.RABBITMQ_URL;

async function requestGrades(examination_id) {
  // const connection = await amqp.connect('amqp://localhost');
  const connection = await amqp.connect(amqpUrl);
  const channel = await connection.createChannel();

  const correlationId = uuidv4();
  const replyQueue = await channel.assertQueue('', { exclusive: true });

  return new Promise((resolve, reject) => {
    channel.consume(replyQueue.queue, (msg) => {
      if (msg.properties.correlationId === correlationId) {
        const data = JSON.parse(msg.content.toString());
        channel.close();
        connection.close();
        resolve(data.grades);
      }
    }, { noAck: true });

    const requestPayload = Buffer.from(JSON.stringify({ examination_id }));

    channel.sendToQueue('grades.request', requestPayload, {
      correlationId,
      replyTo: replyQueue.queue,
    });
  });
}

module.exports = requestGrades;