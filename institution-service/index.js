// index.js
require('dotenv').config();
const express = require('express');
const instRoutes = require('./routes/institutions');

const app = express();
app.use(express.json());

// Mount all institution endpoints
app.use('/institutions', instRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Institution Service listening on port ${PORT}`)
);

app.get('/health', (req, res) => {
  res.send('OK');
});

