const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');

const app = express();
app.use(bodyParser.json());


app.post('/users/register/:role', async (req, res) => {
  try {
    const { first_name, last_name, email, institution_id } = req.body;
    const { role } = req.params;

    if (!['instructor', 'student', 'representative'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    if (role == 'instructor') {
      const newInstructor = await db.teachers.create({
        institution_id: institution_id,
        name: first_name,
        surname: last_name,
        email: email,
      })
      return res.status(201).json({ success: true, data: newInstructor });
    }
    
    if (role == 'student') {
      const newStudent = await db.students.create({
        institution_id: institution_id,
        name: first_name,
        surname: last_name,
        email: email,
      })
      return res.status(201).json({ success: true, data: newStudent });
    }
    
    if (role == 'representative') {
      const newRepresentatives = await db.representatives.create({
        institution_id: institution_id,
        name: first_name,
        surname: last_name
        // email: email,
      })
      return res.status(201).json({ success: true, data: newRepresentatives });
    }

  } catch (err) {
    console.error('Σφάλμα στη δημιουργία χρήστη:', err);
    res.status(500).json({ success: false, error: 'Σφάλμα διακομιστή' });
  }
});


app.get('/users/instructor', async (req, res) => {
  const { id } = req.query;
  const user = await db.teachers.findByPk(id);

  res.json(user);
});


app.get('/users/student', async (req, res) => {
  const { id } = req.query;
  const user = await db.students.findByPk(id);

  res.json(user);
});


app.get('/users/institutionUsers', async (req, res) => {
  try {
    const { institutionId } = req.query;

    if (isNaN(institutionId)) {
      return res.status(400).json({ error: 'Invalid institution ID' });
    }

    const [teachers, students, representatives] = await Promise.all([
      db.teachers.findAll({ where: { institution_id: institutionId } }),
      db.students.findAll({ where: { institution_id: institutionId } }),
      db.representatives.findAll({ where: { institution_id: institutionId } })
    ]);

    return res.status(200).json({
      success: true,
      data: {
        teachers,
        students,
        representatives
      }
    });
  } catch (err) {
    console.error('Σφάλμα κατά την ανάκτηση χρηστών του ιδρύματος:', err);
    return res.status(500).json({ success: false, error: 'Σφάλμα διακομιστή' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`User management service running on port ${PORT}`);
});
