// app.js
const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.post('/grades/upload', upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const uid = uuidv4();
  const fileBuffer = fs.readFileSync(file.path);

  // Parse Excel file to extract course
  let course = 'Unknown Course';
  let period = 'Unknown Period';
  let number_grades = 0;

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(file.path);
    const worksheet = workbook.getWorksheet(1);

    course = worksheet.getCell('E4').value || 'Unknown Course';
    period = worksheet.getCell('D4').value || 'Unknown Period';

    // Count non-empty rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber >= 4) { // Start counting from row 4
        const isNotEmpty = row.values.some((v, i) => i > 0 && v !== null && v !== '');
        if (isNotEmpty) number_grades++;
      }
    });

  } catch (err) {
    console.error('Excel read error:', err);
  }

  try {
    await db.query('INSERT INTO uploads (uid, file) VALUES (?, ?)', [uid, fileBuffer]);

    res.json({
      course,
      period,
      number_grades,
      uid
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database insert failed' });
  } finally {
    fs.unlinkSync(file.path); // Cleanup uploaded file
  }
});

app.use(express.json()); 
app.post('/grades/confirm', async (req, res) => {
  const { uid, instructor_id } = req.body;

  if (!uid || !instructor_id) {
    return res.status(400).json({
      success: false,
      message: 'Missing uid or instructor_id'
    });
  }

  try {
    const [rows] = await db.query('SELECT id FROM uploads WHERE uid = ?', [uid]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Upload not found for the provided uid'
      });
    }

    // Add checking logic

    return res.json({
      success: true,
      message: `Grades confirmed by instructor: ${instructor_id}`
    });

  } catch (err) {
    console.error('Error confirming grades:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});


app.post('/grades/cancel', async (req, res) => {
  const { uid, instructor_id } = req.body;

  if (!uid || !instructor_id) {
    return res.status(400).json({
      success: false,
      message: 'Missing uid or instructor_id'
    });
  }

  try {
    const [rows] = await db.query('SELECT id FROM uploads WHERE uid = ?', [uid]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No upload found with the given uid'
      });
    }

    await db.query('DELETE FROM uploads WHERE uid = ?', [uid]);

    // maybe we need a table logs and store all the actions, like below
    return res.json({
      success: true,
      message: `Upload with uid ${uid} has been canceled by instructor ${instructor_id}`
    });

  } catch (err) {
    console.error('Error cancelling upload:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});




app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

