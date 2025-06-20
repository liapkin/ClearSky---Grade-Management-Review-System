const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

/**
 * POST /users/login
 * { "email": "user@domain.com" }
 */
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
