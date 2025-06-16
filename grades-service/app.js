const db = require('./models');

const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const ExcelJS = require('exceljs');
const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ dest: 'uploads/' });

app.use(express.json()); 

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.post('/grades/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const instructor_id = 1; // ToDo: Take from auth

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
    await db.Upload.create({
      uid: uid,
      file: fileBuffer
    });

    await db.Log.create({
      uid,
      instructor_id,
      action: 'upload',
      message: `Upload with uid ${uid} by instructor_id: ${instructor_id}`
    });

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
    fs.unlinkSync(file.path);
  }
});


app.post('/grades/confirm', async (req, res) => {
  const { uid, instructor_id } = req.body;

  if (!uid || !instructor_id) {
    return res.status(400).json({
      success: false,
      message: 'Missing uid or instructor_id'
    });
  }

  try {
    const upload = await db.Upload.findOne({ where: { uid } });
    if (!upload) {
      return res.status(404).json({
        success: false,
        message: 'Upload not found'
      });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(upload.file);
    const worksheet = workbook.worksheets[0];

    const course = worksheet.getCell('E4').value || 'Unknown Course';       
    const semester = worksheet.getCell('D4').value || 'Unknown Semester';

    const exam = await db.Examination.create({
      teacher_id: instructor_id,
      course,
      semester
    });

    const studentAMs = [];       // Collect all AMs from Excel
    const gradesData = [];       // Store both the AM and the row

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber >= 4) {      
        const amCell = row.getCell(1); 
        const am = amCell?.value?.toString()?.trim(); 

        if (am) {
          studentAMs.push(am);             
          gradesData.push({ am, row });    
        }
      }
    });

    const studentRecords = await db.Student.findAll({
      where: { am: studentAMs }
    });

    const studentMap = new Map();
    studentRecords.forEach(student => {
      studentMap.set(student.am, student.id);
    });

    for (const entry of gradesData) {
      const studentId = studentMap.get(entry.am); // Match AM to student ID
      if (!studentId) continue; 

      const gradeCell = entry.row.getCell(7); // Grade on col G
      const gradeValue = gradeCell?.value;

      await db.Grade.create({
        student_id: studentId,
        examination_id: exam.id,
        value: parseInt(gradeValue),
        state: "Open"
      });
    }

    await db.Log.create({
      uid,
      instructor_id,
      action: 'confirm',
      message: `Grades confirmed by instructor: ${instructor_id}`
    });

    res.json({
      success: true,
      message: `Grades confirmed by instructor: ${instructor_id}`
    });

  } catch (err) {
    console.error('Error confirming grades:', err);
    res.status(500).json({
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
    const upload = await db.Upload.findOne({ where: { uid } });

    if (!upload) {
      return res.status(404).json({
        success: false,
        message: 'No upload found with the given uid'
      });
    }

    await upload.destroy();

    await db.Log.create({
      uid,
      instructor_id,
      action: 'cancel',
      message: `Upload with uid ${uid} has been canceled by instructor_id: ${instructor_id}`
    });

    return res.json({
      success: true,
      message: `Upload with uid ${uid} has been canceled by instructor_id: ${instructor_id}`
    });

  } catch (err) {
    console.error('Error cancelling upload:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});


app.get('/grades/student', async (req, res) => {
  const { student_id, state } = req.query;

  if (!student_id) {
    return res.status(400).json({ error: 'Missing student_id' });
  }

  try {
    if (!state) {
      var grades = await db.Grade.findAll({
        where: { student_id },
        attributes: ['value']
      });
    }

    else {
      var grades = await db.Grade.findAll({
        where: {
          student_id,
          state: state
        },
        attributes: ['value']
      });
    }

    const values = grades.map(grade => grade.value);

    res.json(values);

  } catch (err) {
    console.error('Error fetching grade values:', err);
    res.status(500).json({ error: 'Internal server error' });
  }

});


app.get('/grades/examination', async (req, res) => {
  const { examination_id } = req.query;

  if (!examination_id) {
    return res.status(400).json({ error: 'Missing examination_id' });
  }
  try {
    const grades = await db.Grade.findAll({
      where: { examination_id },
      attributes: ['value']
    });

    // (Ask) Maybe change, depends on what data structure frontend needs
    const values = grades.map(grade => grade.value);

    res.json(values);

  } catch (err) {
    console.error('Error fetching grade values:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/grades/instructor-examinations', async (req, res) => {
  const { id, role } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing id' });
  }
  if (!role) {
    return res.status(400).json({ error: 'Missing role' });
  }

  try {
    if (role == "student") {
      const grades = await db.Grade.findAll({
        where: { student_id: id },
        attributes: ['examination_id']
      });

      const examIds = [...new Set(grades.map(g => g.examination_id))];

      const exams = await db.Examination.findAll({
        where: { id: examIds },
        attributes: ['course']
      });

      const courses = exams.map(e => e.course);
      res.json(courses);
    }

    if (role == "teacher") {
      
      var exams = await db.Examination.findAll({
        where: { teacher_id: id },
        attributes: ['course']
      });

      var values = exams.map(exam => exam.course);

      res.json(values);

    }
  } catch (err) {
    console.error('Error fetching examinations:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

