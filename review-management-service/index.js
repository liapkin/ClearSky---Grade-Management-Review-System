const app = require('./review.js');
const PORT = process.env.PORT || 3000;

async function connectRabbitMQ(url, retries = 10, delay = 3000) {
    for (let i = 0; i < retries; i++) {
        try {
            const connection = await amqp.connect(url);
            return connection;
        } catch (err) {
            console.log(`RabbitMQ not ready (attempt ${i + 1}/${retries}). Retrying in ${delay}ms...`);
            await new Promise(res => setTimeout(res, delay));
        }
    }
    throw new Error(`Unable to connect to RabbitMQ after ${retries} attempts`);
}

connectRabbitMQ().then(() => {
    app.listen(PORT, () => {
        console.log(`Review service running on port ${PORT}`);
    });
});