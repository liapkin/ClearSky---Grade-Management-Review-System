const db = require('./models');

const axios = require('axios');
const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const ExcelJS = require('exceljs');
const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ dest: 'uploads/' });
const authenticateJWT = require('./middlewares/authenticateJWT');
const requestTeacherInstitution = require('./requestTeacherInstitution');

app.use(express.json());

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

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.get('/grades/test', async (req, res) => {
    try {
    const id = await requestTeacherInstitution(4);
    console.log('Teacher Institution ID:', id);
    const Yid = id?.[0]?.institution_id ?? null;
    console.log('Actual Institution ID:', Yid);
    
    const response = await axios.get(`http://localhost:3005/institutions/${Yid}/credits`);
    const tokens = response.data.tokens;
    console.log('Current balance:', tokens);

    return res.json('all fine');
  }
  catch (err) {
    console.error('Error fetching institution ID:', err);
    return res.json('all wrong');
  }
});

app.post('/grades/upload', authenticateJWT, upload.single('file'), async (req, res) => {
  const file = req.file;

  const user = req.user;
  
  const instructor_id = user.teacherId;

  if (user.role !== 'INSTRUCTOR') {
    return res.status(403).json({ error: 'Only instructors can upload grades' });
  }

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const uid = uuidv4();
  const fileBuffer = fs.readFileSync(file.path);

  let course = 'Unknown Course';
  let period = 'Unknown Period';
  let number_grades = 0;

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(file.path);
    const worksheet = workbook.getWorksheet(1);

    course = worksheet.getCell('E4').value || 'Unknown Course';
    period = worksheet.getCell('D4').value || 'Unknown Period';

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber >= 4) {
        const isNotEmpty = row.values.some((v, i) => i > 0 && v !== null && v !== '');
        if (isNotEmpty) number_grades++;
      }
    });

  } catch (err) {
    console.error('Excel read error:', err);
  }

  try {
    await db.uploads.create({
      uid: uid,
      file: fileBuffer
    });

    await db.logs.create({
      uid,
      teacher_id: instructor_id,
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


app.post('/grades/confirm', authenticateJWT, async (req, res) => {
  const { uid } = req.body;

  const user = req.user;
  
  const instructor_id = user.teacherId;

  if (!uid || !instructor_id) {
    return res.status(400).json({
      success: false,
      message: 'Missing uid or instructor_id'
    });
  }

  const t = await db.sequelize.transaction();
  try {
    try {
      const upload = await db.uploads.findOne({ where: { uid } });
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

      const exam = await db.examinations.create({
        teacher_id: instructor_id,
        course,
        semester
      });

      const studentAMs = [];
      const gradesData = [];

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

      const studentRecords = await db.students.findAll({
        where: { am: studentAMs }
      });

      const studentMap = new Map();
      studentRecords.forEach(student => {
        studentMap.set(student.am, student.id);
      });

      for (const entry of gradesData) {
        const studentId = studentMap.get(entry.am);
        if (!studentId) continue; 

        const gradeCell = entry.row.getCell(7);
        const gradeValue = gradeCell?.value;

        await db.grades.create({
          student_id: studentId,
          examination_id: exam.id,
          value: parseInt(gradeValue),
          state: "Open"
        });
      }

      await db.logs.create({
        uid,
        teacher_id: instructor_id,
        action: 'confirm',
        message: `Grades confirmed by instructor: ${instructor_id}`
      });

    } catch (err) {
      throw new Error('Error confirming grades: ' + err.message);
    }

    try {

      // Step 1: Get institution id
      const id_response = await requestTeacherInstitution(instructor_id);
      const institution_id = id_response?.[0]?.institution_id ?? null 

      // Step 2: Get balance '/:institutionId/credits'
      const response = await axios.get(`http://statistics:3000/statistics/stats`, {
        params: {
            examination_id: exam.id
        }
      });

      // Step 3: If balance > amount_we_charge -> proceed
      //         else ...

      // Step 4: Pay '/:institutionId/credits/consume'


      // Try and catch logic: We have two opertions, 1: Payment, 2: db inserting, ...
      // Either both operations succeed, or neither should happen 


    } catch(err) {
      throw new Error('Charging processing failed: ' + err.message);
    }

    await t.commit();
    res.json({
        success: true,
        message: `Grades confirmed by instructor: ${instructor_id}`
    });
    
  } catch (error) {
    await t.rollback();
    console.error('Operation failed:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});


app.post('/grades/cancel', authenticateJWT, async (req, res) => {
  const { uid } = req.body;

  const user = req.user;
  
  const instructor_id = user.teacherId;

  if (!uid || !instructor_id) {
    return res.status(400).json({
      success: false,
      message: 'Missing uid or instructor_id'
    });
  }

  try {
    const upload = await db.uploads.findOne({ where: { uid } });

    if (!upload) {
      return res.status(404).json({
        success: false,
        message: 'No upload found with the given uid'
      });
    }

    await upload.destroy();

    await db.logs.create({
      uid,
      teacher_id: instructor_id,
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


// Enhanced detailed grades endpoint with full context
app.get('/grades/detailed', async (req, res) => {
  const { student_id, state, include_teacher, include_institution } = req.query;

  if (!student_id) {
    return res.status(400).json({ error: 'Missing student_id parameter' });
  }

  try {
    let whereClause = { student_id };
    if (state) {
      whereClause.state = state;
    }

    // Get grades with basic info
    const grades = await db.grades.findAll({
      where: whereClause,
      order: [['id', 'DESC']] // Most recent first
    });

    const detailedGrades = [];

    // For each grade, get related information with separate queries
    for (const grade of grades) {
      try {
        // Get examination details
        const examination = await db.examinations.findByPk(grade.examination_id);
        
        // Get teacher details if examination exists
        let teacher = null;
        if (examination && include_teacher !== 'false') {
          teacher = await db.teachers.findByPk(examination.teacher_id);
        }

        // Get student details
        const student = await db.students.findByPk(grade.student_id);

        // Get institution details if requested
        let teacherInstitution = null;
        let studentInstitution = null;
        if (include_institution === 'true') {
          if (teacher) {
            teacherInstitution = await db.institutions.findByPk(teacher.institution_id);
          }
          if (student) {
            studentInstitution = await db.institutions.findByPk(student.institution_id);
          }
        }

        const detailedGrade = {
          id: grade.id,
          value: grade.value,
          state: grade.state,
          state_description: grade.state === 'Open' ? 'Pending Review' : 
                            grade.state === '1' ? 'Confirmed' : 
                            grade.state === '0' ? 'Provisional' : grade.state,
          course: examination ? {
            id: examination.id,
            name: examination.course,
            semester: examination.semester,
            code: `EX-${examination.id}`
          } : {
            id: grade.examination_id,
            name: `Course ${grade.examination_id}`,
            semester: 'Unknown',
            code: `EX-${grade.examination_id}`
          },
          teacher: teacher ? {
            id: teacher.id,
            name: teacher.name,
            surname: teacher.surname,
            email: teacher.email,
            full_name: `${teacher.name} ${teacher.surname}`,
            institution: teacherInstitution ? {
              id: teacherInstitution.id,
              name: teacherInstitution.name
            } : undefined
          } : undefined,
          student: student ? {
            id: student.id,
            name: student.name,
            surname: student.surname,
            email: student.email,
            am: student.am,
            full_name: `${student.name} ${student.surname}`,
            institution: studentInstitution ? {
              id: studentInstitution.id,
              name: studentInstitution.name
            } : undefined
          } : undefined,
          grade_status: {
            is_passing: grade.value >= 5,
            letter_grade: grade.value >= 9 ? 'A' : 
                         grade.value >= 7 ? 'B' : 
                         grade.value >= 5 ? 'C' : 
                         grade.value >= 3 ? 'D' : 'F',
            performance_level: grade.value >= 9 ? 'Excellent' : 
                              grade.value >= 7 ? 'Very Good' : 
                              grade.value >= 5 ? 'Good' : 
                              grade.value >= 3 ? 'Poor' : 'Fail'
          },
          can_request_review: grade.value < 5 && grade.state === 'Open',
          created_at: grade.createdAt || new Date().toISOString()
        };

        detailedGrades.push(detailedGrade);
      } catch (err) {
        console.error(`Error processing grade ${grade.id}:`, err);
        // Add grade with basic info if detailed processing fails
        detailedGrades.push({
          id: grade.id,
          value: grade.value,
          state: grade.state,
          state_description: grade.state === 'Open' ? 'Pending Review' : 
                            grade.state === '1' ? 'Confirmed' : 
                            grade.state === '0' ? 'Provisional' : grade.state,
          course: {
            id: grade.examination_id,
            name: `Course ${grade.examination_id}`,
            semester: 'Unknown',
            code: `EX-${grade.examination_id}`
          },
          grade_status: {
            is_passing: grade.value >= 5,
            letter_grade: grade.value >= 9 ? 'A' : 
                         grade.value >= 7 ? 'B' : 
                         grade.value >= 5 ? 'C' : 
                         grade.value >= 3 ? 'D' : 'F',
            performance_level: grade.value >= 9 ? 'Excellent' : 
                              grade.value >= 7 ? 'Very Good' : 
                              grade.value >= 5 ? 'Good' : 
                              grade.value >= 3 ? 'Poor' : 'Fail'
          },
          can_request_review: grade.value < 5 && grade.state === 'Open',
          created_at: grade.createdAt || new Date().toISOString(),
          error: 'Could not load full details'
        });
      }
    }

    // Calculate summary statistics
    const summary = {
      total_grades: detailedGrades.length,
      average_grade: detailedGrades.length > 0 ? 
        parseFloat((detailedGrades.reduce((sum, g) => sum + g.value, 0) / detailedGrades.length).toFixed(2)) : 0,
      passed_grades: detailedGrades.filter(g => g.value >= 5).length,
      failed_grades: detailedGrades.filter(g => g.value < 5).length,
      pass_rate: detailedGrades.length > 0 ? 
        parseFloat(((detailedGrades.filter(g => g.value >= 5).length / detailedGrades.length) * 100).toFixed(2)) : 0,
      pending_reviews: detailedGrades.filter(g => g.can_request_review).length,
      grade_distribution: {
        excellent: detailedGrades.filter(g => g.value >= 9).length,
        very_good: detailedGrades.filter(g => g.value >= 7 && g.value < 9).length,
        good: detailedGrades.filter(g => g.value >= 5 && g.value < 7).length,
        poor: detailedGrades.filter(g => g.value >= 3 && g.value < 5).length,
        fail: detailedGrades.filter(g => g.value < 3).length
      }
    };

    res.json({
      student_id: parseInt(student_id),
      grades: detailedGrades,
      summary: summary,
      filters_applied: {
        state: state || 'all',
        include_teacher: include_teacher !== 'false',
        include_institution: include_institution === 'true'
      },
      total_count: detailedGrades.length,
      generated_at: new Date().toISOString()
    });

  } catch (err) {
    console.error('Error fetching detailed grades:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch detailed grades: ' + err.message
    });
  }
});

// Keep original endpoint for backward compatibility  
app.get('/grades/student', async (req, res) => {
  const { student_id, state } = req.query;

  if (!student_id) {
    return res.status(400).json({ error: 'Missing student_id' });
  }

  try {
    if (!state) {
      var grades = await db.grades.findAll({
        where: { student_id },
        attributes: ['value']
      });
    }

    else {
      var grades = await db.grades.findAll({
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
    const grades = await db.grades.findAll({
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
      const grades = await db.grades.findAll({
        where: { student_id: id },
        attributes: ['examination_id']
      });

      const examIds = [...new Set(grades.map(g => g.examination_id))];

      const exams = await db.examinations.findAll({
        where: { id: examIds },
        attributes: ['course']
      });

      const courses = exams.map(e => e.course);
      res.json(courses);
    }

    if (role == "teacher") {
      
      var exams = await db.examinations.findAll({
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

module.exports = async function startHttpServer() {
  app.listen(PORT, () => {
    console.log(`Grades HTTP API running on port ${PORT}`);
  });
};