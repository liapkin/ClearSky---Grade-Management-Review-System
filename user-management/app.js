require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(bodyParser.json());

// Σύνδεση στη MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB συνδέθηκε επιτυχώς'))
  .catch((err) => console.error('Σφάλμα MongoDB:', err));

// Routes
app.use('/users', userRoutes);

// Εκκίνηση server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server τρέχει στο http://localhost:${PORT}`);
});
