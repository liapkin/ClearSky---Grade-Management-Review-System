const express = require('express');
const axios = require('axios');
const requestGrades = require('./requestGrades');
const requestEnrolledExams = require('./requestEnrolledExams');

// Fallback HTTP API calls when RabbitMQ is not available
async function getGradesHTTP(examination_id) {
  try {
    const response = await axios.get(`http://grades:3000/grades/examination?examination_id=${examination_id}`, {
      timeout: 5000
    });
    return response.data || [];
  } catch (error) {
    console.error('Failed to get grades via HTTP:', error.message);
    return [];
  }
}

async function getEnrolledExamsHTTP(student_id) {
  try {
    const response = await axios.get(`http://grades:3000/grades/instructor-examinations?id=${student_id}&role=student`, {
      timeout: 5000
    });
    return response.data || [];
  } catch (error) {
    console.error('Failed to get enrolled exams via HTTP:', error.message);
    return [];
  }
}

const authenticateJWT = require('./middlewares/authenticateJWT');

const app = express();
const PORT = process.env.PORT || 3000;

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

// Enhanced comprehensive statistics endpoint with rich context
app.get('/statistics/comprehensive', authenticateJWT, async (req, res) => {
    try {
        const user = req.user;
        const { examination_id, course_name, semester } = req.query;
        
        if (user.role !== 'STUDENT') {
            return res.status(403).json({ error: 'Only students can access statistics' });
        }

        const student_id = user.student_id || user.sub;

        // If requesting specific examination statistics
        if (examination_id) {
            try {
                const grades = await requestGrades(examination_id);
                
                if (grades.length === 0) {
                    return res.status(404).json({ 
                        message: `No grades found for examination_id: ${examination_id}`,
                        examination_id: examination_id
                    });
                }

                const passed = grades.filter(g => g.value >= 5).length;
                const total = grades.length;
                const passRate = (passed / total) * 100;
                const average = grades.reduce((sum, g) => sum + g.value, 0) / total;

                const distribution = {
                    '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0
                };

                grades.forEach(({ value }) => {
                    const score = Math.floor(value);
                    if (score >= 0 && score <= 10) {
                        distribution[score.toString()]++;
                    }
                });

                // Get examination details (course name, teacher, semester)
                const enrolled_exams = await requestEnrolledExams(student_id);
                const examInfo = enrolled_exams.find(e => e.examination_id == examination_id) || {};

                return res.json({
                    type: 'single_examination',
                    student_id: student_id,
                    examination: {
                        id: examination_id,
                        course: examInfo.course || 'Unknown Course',
                        semester: examInfo.semester || 'Unknown Semester',
                        teacher: examInfo.teacher || 'Unknown Teacher'
                    },
                    statistics: {
                        total_students: total,
                        students_passed: passed,
                        students_failed: total - passed,
                        pass_rate: parseFloat(passRate.toFixed(2)),
                        average_grade: parseFloat(average.toFixed(2)),
                        distribution: distribution,
                        grade_ranges: {
                            excellent: distribution['9'] + distribution['10'], // 9-10
                            very_good: distribution['7'] + distribution['8'], // 7-8 
                            good: distribution['5'] + distribution['6'],      // 5-6
                            poor: distribution['3'] + distribution['4'],      // 3-4
                            fail: distribution['0'] + distribution['1'] + distribution['2'] // 0-2
                        }
                    },
                    created_at: new Date().toISOString()
                });

            } catch (error) {
                console.error('Error fetching specific examination stats:', error);
                return res.status(500).json({ 
                    error: 'Failed to fetch examination statistics',
                    examination_id: examination_id 
                });
            }
        }

        // Get comprehensive statistics for all enrolled examinations
        try {
            const enrolled_exams = await requestEnrolledExams(student_id);
            
            if (enrolled_exams.length === 0) {
                return res.json({
                    type: 'comprehensive',
                    student_id: student_id,
                    message: 'No enrolled examinations found',
                    examinations: [],
                    summary: {
                        total_courses: 0,
                        total_grades: 0,
                        overall_average: 0,
                        overall_pass_rate: 0
                    }
                });
            }

            // Handle different response formats from RabbitMQ vs HTTP
            const examIds = enrolled_exams.map(e => {
                if (typeof e === 'object' && e.examination_id) {
                    return e.examination_id;
                } else if (typeof e === 'number') {
                    return e;
                } else {
                    return e; // Fallback for other formats
                }
            }).filter(id => id != null); // Remove null/undefined values
            
            console.log('Comprehensive stats - Extracted examination IDs:', examIds);
            const results = [];
            let totalGrades = 0;
            let totalPassed = 0;
            let gradeSum = 0;

            for (const examId of examIds) {
                try {
                    const grades = await requestGrades(examId);
                    const examInfo = enrolled_exams.find(e => e.examination_id == examId) || {};
                    
                    if (grades.length > 0) {
                        const passed = grades.filter(g => g.value >= 5).length;
                        const average = grades.reduce((sum, g) => sum + g.value, 0) / grades.length;
                        const passRate = (passed / grades.length) * 100;

                        // Build distribution
                        const distribution = {
                            '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0
                        };
                        grades.forEach(({ value }) => {
                            const score = Math.floor(value);
                            if (score >= 0 && score <= 10) {
                                distribution[score.toString()]++;
                            }
                        });

                        results.push({
                            examination_id: examId,
                            course: {
                                name: examInfo.course || 'Unknown Course',
                                semester: examInfo.semester || 'Unknown Semester',
                                teacher: examInfo.teacher || 'Unknown Teacher'
                            },
                            statistics: {
                                total_students: grades.length,
                                students_passed: passed,
                                students_failed: grades.length - passed,
                                pass_rate: parseFloat(passRate.toFixed(2)),
                                average_grade: parseFloat(average.toFixed(2)),
                                distribution: distribution
                            },
                            status: 'success'
                        });

                        totalGrades += grades.length;
                        totalPassed += passed;
                        gradeSum += grades.reduce((sum, g) => sum + g.value, 0);
                    } else {
                        results.push({
                            examination_id: examId,
                            course: {
                                name: examInfo.course || 'Unknown Course',
                                semester: examInfo.semester || 'Unknown Semester',
                                teacher: examInfo.teacher || 'Unknown Teacher'
                            },
                            error: 'No grades found',
                            status: 'no_data'
                        });
                    }
                } catch (err) {
                    const examInfo = enrolled_exams.find(e => e.examination_id == examId) || {};
                    results.push({
                        examination_id: examId,
                        course: {
                            name: examInfo.course || 'Unknown Course',
                            semester: examInfo.semester || 'Unknown Semester',
                            teacher: examInfo.teacher || 'Unknown Teacher'
                        },
                        error: err.message,
                        status: 'error'
                    });
                }
            }

            const overallAverage = totalGrades > 0 ? gradeSum / totalGrades : 0;
            const overallPassRate = totalGrades > 0 ? (totalPassed / totalGrades) * 100 : 0;

            return res.json({
                type: 'comprehensive',
                student_id: student_id,
                examinations: results,
                summary: {
                    total_courses: enrolled_exams.length,
                    courses_with_data: results.filter(r => r.status === 'success').length,
                    total_grades: totalGrades,
                    total_passed: totalPassed,
                    overall_average: parseFloat(overallAverage.toFixed(2)),
                    overall_pass_rate: parseFloat(overallPassRate.toFixed(2))
                },
                created_at: new Date().toISOString()
            });

        } catch (error) {
            console.error('Error fetching comprehensive statistics:', error);
            return res.status(500).json({ 
                error: 'Failed to fetch comprehensive statistics',
                message: error.message 
            });
        }

    } catch (error) {
        console.error('Statistics service error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'Statistics service unavailable'
        });
    }
});

// Keep original endpoint for backward compatibility
app.get('/statistics/stats', authenticateJWT, async (req, res) => {
    // const student_id = 1; 
    // const { student_id, examination_id } = req.query;

    const user = req.user;
  
    const student_id = user.student_id || user.sub;

    const { examination_id } = req.query;
    // const examination_id = 4
  
    if (user.role !== 'STUDENT') {
        return res.status(403).json({ error: 'Only students can use this' });
    }

    try {
        if (examination_id) {
            let grades;
            try {
                grades = await requestGrades(examination_id);
            } catch (error) {
                console.log('RabbitMQ failed, trying HTTP fallback:', error.message);
                grades = await getGradesHTTP(examination_id);
            }

            if (grades.length === 0) {
                return res.status(404).json({ message: `No grades found for examination_id: ${examination_id}` });
            }

            const passed = grades.filter(g => g.value >= 5).length;
            const passRate = (passed / grades.length) * 100;

            const distribution = {
                '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0
            }; 

            grades.forEach(({ value }) => {
                const score = Math.floor(value);
                if (score == 0) distribution['0']++;
                else if (score == 1) distribution['1']++;
                else if (score == 2) distribution['2']++;
                else if (score == 3) distribution['3']++;
                else if (score == 4) distribution['4']++;
                else if (score == 5) distribution['5']++;
                else if (score == 6) distribution['6']++;
                else if (score == 7) distribution['7']++;
                else if (score == 8) distribution['8']++;
                else if (score == 9) distribution['9']++;
                else distribution['10']++;
            });

            return res.json({
                student_id: student_id,
                examination_id: examination_id,
                students_passed: passed,
                pass_rate: passRate.toFixed(2) + '%',
                distribution: distribution
            });
        }

        let enrolled_exams;
        try {
            enrolled_exams = await requestEnrolledExams(student_id);
        } catch (error) {
            console.log('RabbitMQ failed for enrolled exams, trying HTTP fallback:', error.message);
            enrolled_exams = await getEnrolledExamsHTTP(student_id);
        }

        // Handle different response formats from RabbitMQ vs HTTP
        const examIds = enrolled_exams.map(e => {
            if (typeof e === 'object' && e.examination_id) {
                return e.examination_id;
            } else if (typeof e === 'number') {
                return e;
            } else {
                return e; // Fallback for other formats
            }
        }).filter(id => id != null); // Remove null/undefined values
        
        console.log('Extracted examination IDs:', examIds);
        const results = [];
        for (const id of examIds) {
            try {
                let grades;
                try {
                    grades = await requestGrades(id);
                } catch (error) {
                    console.log(`RabbitMQ failed for exam ${id}, trying HTTP fallback:`, error.message);
                    grades = await getGradesHTTP(id);
                }
                
                if (grades.length === 0) {
                    results.push({ examination_id: id, error: `No grades found for examination_id: ${id}` });
                    continue;
                }

                const passed = grades.filter(g => g.value >= 5).length;
                const passRate = (passed / grades.length) * 100;

                const distribution = {
                    '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0
                }; 

                grades.forEach(({ value }) => {
                    const score = Math.floor(value);
                    if (score >= 0 && score <= 10) {
                        distribution[score.toString()]++;
                    }
                });

                const data = {
                    student_id: student_id,
                    examination_id: id,
                    students_passed: passed,
                    pass_rate: passRate.toFixed(2) + '%',
                    distribution: distribution
                };
                
                results.push({ examination_id: id, data: data });
            } catch (err) {
                results.push({ examination_id: id, error: err.message });
            }
        }

        res.json({ student_id: student_id, statistics: results });



    } catch (error) {
        console.error('Statistics endpoint error:', error);
        
        if (error.message.includes('RabbitMQ connection failed')) {
            res.status(503).json({ 
                message: 'Statistics service temporarily unavailable - grades service connection failed',
                error: 'Service dependency unavailable'
            });
        } else if (error.message.includes('timeout')) {
            res.status(408).json({ 
                message: 'Request timeout - grades service not responding',
                error: 'Request timeout'
            });
        } else {
            res.status(500).json({ 
                message: 'Server error', 
                error: error.message 
            });
        }
    }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

