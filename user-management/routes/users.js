const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Δημιουργία χρήστη (POST /users)
router.post('/', async (req, res) => {
  const { username, email, gradeId, institutionId } = req.body;
  try {
    const user = new User({ username, email, gradeId, institutionId });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Λήψη χρηστών ενός ιδρύματος (GET /users/institution/:institutionId)
router.get('/institution/:institutionId', async (req, res) => {
  try {
    const users = await User.find({ institutionId: req.params.institutionId });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Λήψη χρήστη βάσει gradeId (GET /users/grade/:gradeId)
router.get('/grade/:gradeId', async (req, res) => {
  try {
    const user = await User.findOne({ gradeId: req.params.gradeId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
