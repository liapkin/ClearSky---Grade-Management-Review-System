const express = require('express');
const instRoutes = require('./routes/institutions');
const db = require('./models');

const app = express();
app.use(express.json());

app.use('/institutions', instRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Institution Service listening on port ${PORT}`)
);

app.get('/health', (req, res) => {
  res.send('OK');
});

