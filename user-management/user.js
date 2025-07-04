const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');

const app = express();
app.use(bodyParser.json());

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

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret';


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
        surname: last_name,
        email: email,
      })
      return res.status(201).json({ success: true, data: newRepresentatives });
    }

  } catch (err) {
    console.error('Σφάλμα στη δημιουργία χρήστη:', err);
    
    // Check if error is due to duplicate email
    if (err.name === 'SequelizeUniqueConstraintError' || err.original?.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, error: 'Email already exists' });
    }
    
    res.status(500).json({ success: false, error: 'Σφάλμα διακομιστή' });
  }
});

app.post('/users/register-google/:role', async (req, res) => {
  try {
    const { first_name, last_name, email, institution_id, google_id, picture } = req.body;
    const { role } = req.params;

    if (!['instructor', 'student', 'representative'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // For Google registration, we mainly handle students
    if (role === 'student') {
      // Check if user already exists by email
      const existingStudent = await db.students.findOne({ where: { email } });
      
      if (existingStudent) {
        return res.status(409).json({ success: false, error: 'Email already exists' });
      }

      const newStudent = await db.students.create({
        institution_id: institution_id,
        name: first_name,
        surname: last_name,
        email: email,
        am: generateStudentAM(email) // Generate a unique student AM
      });
      
      return res.status(201).json({ success: true, data: newStudent });
    }
    
    return res.status(400).json({ error: 'Google registration currently only supports students' });

  } catch (err) {
    console.error('Google registration error:', err);
    
    if (err.name === 'SequelizeUniqueConstraintError' || err.original?.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, error: 'Email already exists' });
    }
    
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Helper function to generate student AM from email
function generateStudentAM(email) {
  // Extract relevant parts from email for AM generation
  const emailPrefix = email.split('@')[0];
  const timestamp = Date.now().toString().slice(-6);
  return emailPrefix.slice(0, 4) + timestamp;
}


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

app.post('/users/login', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    // Search the three tables in parallel
    const [teacher, student, representative] = await Promise.all([
      db.teachers.findOne({ where: { email } }),
      db.students.findOne({ where: { email } }),
      db.representatives.findOne({ where: { email } })
    ]);

    let payload;
    if (teacher) {
      payload = { sub: teacher.id, role: 'INSTRUCTOR', teacherId: teacher.id };
    } else if (student) {
      payload = { sub: student.id, role: 'STUDENT', studentId: student.id };
    } else if (representative) {
      payload = { sub: representative.id, role: 'REPRESENTATIVE', representativeId: representative.id };
    } else {
      return res.status(404).json({ error: 'Email not found' });
    }

    // Sign and (optionally) persist the token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    // await db.tokens.create({ user_id: payload.sub, token, expires_at: Date.now() + 3600_000 });

    return res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`User management service running on port ${PORT}`);
});
