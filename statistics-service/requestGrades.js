const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');
const amqpUrl = process.env.RABBITMQ_URL;

async function requestGrades(examination_id) {
  let connection, channel;
  
  try {
    connection = await amqp.connect(amqpUrl);
    channel = await connection.createChannel();

    const correlationId = uuidv4();
    const replyQueue = await channel.assertQueue('', { exclusive: true });

    return new Promise((resolve, reject) => {
      // Set timeout to avoid hanging forever
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('Request timeout - grades service not responding'));
      }, 10000); // 10 second timeout

      const cleanup = () => {
        clearTimeout(timeout);
        if (channel) channel.close().catch(() => {});
        if (connection) connection.close().catch(() => {});
      };

      channel.consume(replyQueue.queue, (msg) => {
        if (msg.properties.correlationId === correlationId) {
          try {
            const data = JSON.parse(msg.content.toString());
            cleanup();
            resolve(data.grades || []);
          } catch (err) {
            cleanup();
            reject(new Error('Invalid response format'));
          }
        }
      }, { noAck: true });

      const requestPayload = Buffer.from(JSON.stringify({ examination_id }));

      channel.sendToQueue('grades.request', requestPayload, {
        correlationId,
        replyTo: replyQueue.queue,
      });
    });
  } catch (error) {
    if (channel) channel.close().catch(() => {});
    if (connection) connection.close().catch(() => {});
    throw new Error(`RabbitMQ connection failed: ${error.message}`);
  }
}

module.exports = requestGrades;