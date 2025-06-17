const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');


const app = express();
app.use(bodyParser.json());

// 🔹 POST /users/register/instructor, /student, /representative (μέσω ενός endpoint)
app.post('/users/register/:role', async (req, res) => {
  try {
    const { role } = req.params;
    const { first_name, last_name, email, institution_id, identification_number } = req.body;

    if (!['INSTRUCTOR', 'STUDENT', 'REPRESENTATIVE'].includes(role.toUpperCase())) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const newUser = await db.users.create({
      first_name,
      last_name,
      email,
      role: role.toUpperCase(),
      institution_id,
      identification_number: role.toUpperCase() === 'STUDENT' ? identification_number : null
    });

    res.status(201).json({ success: true, data: newUser });
  } catch (err) {
    console.error('Σφάλμα στη δημιουργία χρήστη:', err);
    res.status(500).json({ success: false, error: 'Σφάλμα διακομιστή' });
  }
});

// GET /users/instructor/:id
app.get('/users/instructor/:id', async (req, res) => {
  const user = await db.users.findByPk(req.params.id);
  if (!user || user.role !== 'INSTRUCTOR') {
    return res.status(404).json({ error: 'Instructor not found' });
  }
  res.json(user);
});

// GET /users/student/:id
app.get('/users/student/:id', async (req, res) => {
  const user = await db.users.findByPk(req.params.id);
  if (!user || user.role !== 'STUDENT') {
    return res.status(404).json({ error: 'Student not found' });
  }
  res.json(user);
});

// GET /users/institutionUsers/:id
app.get('/users/institutionUsers/:id', async (req, res) => {
  try {
    const users = await db.users.findAll({ where: { institution_id: req.params.id } });
    res.json({ users });
  } catch (err) {
    console.error('Σφάλμα στη λήψη χρηστών:', err);
    res.status(500).json({ error: 'Σφάλμα διακομιστή' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`User management service running on port ${PORT}`);
});
