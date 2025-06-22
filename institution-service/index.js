const express = require('express');
const instRoutes = require('./routes/institutions');
const startMessageListener = require('./message_listener');

const app = express();
app.use(express.json());

// Add CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use('/institutions', instRoutes);

const PORT = process.env.PORT || 3000;

startMessageListener().then(
  app.listen(PORT, () =>
    console.log(`Institution Service listening on port ${PORT}`)
    )
);

app.get('/health', (req, res) => {
  res.send('OK');
});

