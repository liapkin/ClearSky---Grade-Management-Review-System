const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');


const app = express();
app.use(bodyParser.json());


app.post('/users/register/:role', async (req, res) => {
  try {
    const { role } = req.params;
    const { first_name, last_name, email, institution_id, identification_number } = req.body;

    if (!['INSTRUCTOR', 'STUDENT', 'REPRESENTATIVE'].includes(role.toUpperCase())) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    if(role == 'instructor'){
      const newInstructor = await db.teachers.create({
        institution_id: institution_id,
        name:first_name,
        surname:last_name,
        email:email,
      })
      res.status(201).json({ success: true, data: newInstructor });
    }

  } catch (err) {
    console.error('Σφάλμα στη δημιουργία χρήστη:', err);
    res.status(500).json({ success: false, error: 'Σφάλμα διακομιστή' });
  }
});


app.get('/users/instructor/:id', async (req, res) => {
  const user = await db.users.findByPk(req.params.id);
  if (!user || user.role !== 'INSTRUCTOR') {
    return res.status(404).json({ error: 'Instructor not found' });
  }
  res.json(user);
});


app.get('/users/student/:id', async (req, res) => {
  const user = await db.users.findByPk(req.params.id);
  if (!user || user.role !== 'STUDENT') {
    return res.status(404).json({ error: 'Student not found' });
  }
  res.json(user);
});


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
