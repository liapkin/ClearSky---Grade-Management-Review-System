const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');
const requestGrades = require('./requestStudentGrades'); 
const authenticateJWT = require('./middlewares/authenticateJWT');

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

app.post('/reviews/new',async (req, res) => {
    try{
        const { gradeId, message } = req.body;
        
        const newReview = await db.reviews.create({
            grade_id: gradeId,
            request_message: message,
            response_message: '',
            state: 'Pending',
        });
        
        res.status(201).json({ success: true, data: newReview });
        
    } catch (err) {
        console.error('Σφάλμα στη δημιουργία review:', err);
        res.status(500).json({ success: false, error: 'Σφάλμα διακομιστή' });
  }
});


// Enhanced detailed reviews endpoint with full context
app.get('/reviews/detailed', authenticateJWT, async (req, res) => {
    try {
        const { state } = req.query;
        const user = req.user;
        const role = user.role.toLowerCase();
        
        // Extract correct user ID based on role
        let userId;
        if (role === 'student') {
            userId = user.studentId || user.sub;
        } else if (role === 'teacher' || role === 'instructor') {
            userId = user.teacherId || user.sub;
        } else {
            userId = user.sub;
        }

        if (role == "student") {
            console.log("Fetching detailed reviews for student with ID:", userId);

            const grades = await requestGrades(userId);
            const gradeIds = grades.map(grade => grade.gradeId);
            
            let whereClause = {
                grade_id: {
                    [db.Sequelize.Op.in]: gradeIds
                }
            };
            
            if (state) {
                whereClause.state = state;
            }
            
            const reviews = await db.reviews.findAll({
                where: whereClause,
                include: [
                    {
                        model: db.grades,
                        as: 'grade',
                        include: [
                            {
                                model: db.examinations,
                                as: 'examination',
                                include: [
                                    {
                                        model: db.teachers,
                                        as: 'teacher',
                                        include: [
                                            {
                                                model: db.institutions,
                                                as: 'institution'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                model: db.students,
                                as: 'student',
                                include: [
                                    {
                                        model: db.institutions,
                                        as: 'institution'
                                    }
                                ]
                            }
                        ]
                    }
                ],
                timeout: 10000
            });
            
            const response = {
                reviewerList: reviews.map(review => ({
                    reviewId: review.id,
                    gradeId: review.grade_id,
                    state: review.state,
                    requestMessage: review.request_message,
                    responseMessage: review.response_message,
                    grade: {
                        value: review.grade.value,
                        state: review.grade.state
                    },
                    course: {
                        name: review.grade.examination.course,
                        semester: review.grade.examination.semester,
                        id: review.grade.examination.id
                    },
                    teacher: {
                        name: review.grade.examination.teacher.name,
                        surname: review.grade.examination.teacher.surname,
                        email: review.grade.examination.teacher.email
                    },
                    student: {
                        name: review.grade.student.name,
                        surname: review.grade.student.surname,
                        email: review.grade.student.email,
                        am: review.grade.student.am
                    },
                    institution: {
                        name: review.grade.student.institution.name,
                        id: review.grade.student.institution.id
                    }
                }))
            };
            
            res.status(200).json(response);
        }
        
        if (role == "teacher" || role == "instructor") {
            console.log("Fetching detailed reviews for teacher with ID:", userId);
            console.log("User object:", JSON.stringify(user, null, 2));
            console.log("Role:", role);
            console.log("State filter:", state);
            
            let whereClause = {};
            if (state) {
                whereClause.state = state;
            }
            
            const reviews = await db.reviews.findAll({
                where: whereClause,
                include: [
                    {
                        model: db.grades,
                        as: 'grade',
                        include: [
                            {
                                model: db.examinations,
                                as: 'examination',
                                where: {
                                    teacher_id: userId
                                },
                                include: [
                                    {
                                        model: db.teachers,
                                        as: 'teacher',
                                        include: [
                                            {
                                                model: db.institutions,
                                                as: 'institution'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                model: db.students,
                                as: 'student',
                                include: [
                                    {
                                        model: db.institutions,
                                        as: 'institution'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
            
            console.log("Found reviews count:", reviews.length);
            console.log("Reviews found:", reviews.map(r => ({ id: r.id, gradeId: r.grade_id, state: r.state })));
            
            const response = {
                reviewerList: reviews.map(review => ({
                    reviewId: review.id,
                    gradeId: review.grade_id,
                    state: review.state,
                    requestMessage: review.request_message,
                    responseMessage: review.response_message,
                    grade: {
                        value: review.grade.value,
                        state: review.grade.state
                    },
                    course: {
                        name: review.grade.examination.course,
                        semester: review.grade.examination.semester,
                        id: review.grade.examination.id
                    },
                    teacher: {
                        name: review.grade.examination.teacher.name,
                        surname: review.grade.examination.teacher.surname,
                        email: review.grade.examination.teacher.email
                    },
                    student: {
                        name: review.grade.student.name,
                        surname: review.grade.student.surname,
                        email: review.grade.student.email,
                        am: review.grade.student.am
                    },
                    institution: {
                        name: review.grade.student.institution.name,
                        id: review.grade.student.institution.id
                    }
                }))
            };
            
            res.status(200).json(response);
        }
        
    } catch (error) {
        console.error('Error fetching detailed reviews:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'Failed to fetch detailed reviews: ' + error.message
        });
    }
});

// Keep original endpoint for backward compatibility
app.get('/reviews', authenticateJWT, async (req, res) => {
    try {
        // const { state, userId, role } = req.query;
        const { state } = req.query;
        
        const user = req.user;
        const role = user.role.toLowerCase();
        
        // Extract correct user ID based on role
        let userId;
        if (role === 'student') {
            userId = user.studentId || user.sub;
        } else if (role === 'teacher' || role === 'instructor') {
            userId = user.teacherId || user.sub;
        } else {
            userId = user.sub;
        }

        if (role == "student") {
            
            console.log("Fetching reviews for student with ID:", userId);

            const grades = await requestGrades(userId);
            const gradeIds = grades.map(grade => grade.gradeId);
            console.log("Grades fetched for student:", grades);
            
            let whereClause = {
                grade_id: {
                    [db.Sequelize.Op.in]: gradeIds
                }
            };
            
            if (state) {
                whereClause.state = state;
            }
            
            const rev = await db.reviews.findAll({
                where: whereClause,
                timeout: 5000
            });
            
            const response = {
                reviewerList: rev.map(review => ({
                    reviewId: review.id,
                    gradeId: review.grade_id,
                    state: review.state,
                }))
            }
            
            res.status(200).json(response);
        };
        
        if (role == "teacher" || role == "instructor") {
            
            console.log("Fetching reviews for teacher with ID:", userId);
            console.log("User object:", JSON.stringify(user, null, 2));
            console.log("Role:", role);
            console.log("State filter:", state);
            
            let whereClause = {};
            if (state) {
                whereClause.state = state;
            }
            
            const rev = await db.reviews.findAll({
                where: whereClause,
                include: [
                    {
                        model: db.grades,
                        as: 'grade',
                        include: [
                            {
                                model: db.examinations,
                                as: 'examination',
                                where: {
                                    teacher_id: userId
                                },
                            }
                        ],
                    }
                ]
            });
            
            console.log("Basic endpoint - Found reviews count:", rev.length);
            console.log("Basic endpoint - Reviews found:", rev.map(r => ({ id: r.id, gradeId: r.grade_id, state: r.state })));
            
            const response = {
                reviewerList: rev.map(review => ({
                    reviewId: review.id,
                    gradeId: review.grade_id,
                    state: review.state,
                    request_message: review.request_message,
                    response_message: review.response_message,
                    studentId: review.grade?.student_id || 'N/A'
                }))
            }
            
            res.status(200).json(response);
        };
        
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'Failed to fetch reviews'
        });
    }
});

app.post('/reviews/:reviewId/response', async (req, res) => {
    const { reviewId } = req.params;
    const { action, newGrade, response } = req.body;
    
    if (!reviewId) {
        return res.status(400).json({ error: 'reviewId is required as path parameter' });
    }
    
    console.log("Searching for review no." + reviewId);
    const  review = await db.reviews.findByPk(reviewId);
    if (!review) {
        return res.status(404).json({ error: 'Review not found' });
    }
    console.log("Review found:", review);
    console.log("Searching for grade no." + review.grade_id);
    const grade = await db.grades.findByPk(review.grade_id); // ToDo: Remove (RabbitMQ)
    if (!grade) {
        return res.status(404).json({ error: 'Grade not found' });
    }
    
    review.set({
        state: action === 'approve' ? 'Approved' : 'Rejected',
        response_message: response
    });
    
    grade.set({
        value: newGrade,
        state: 1 // 1 for approved
    });
    
    await review.save();
    await grade.save();
    
    const responseBody = {
        reviewId: review.id,
        state: review.state,
        responseMessage: review.response_message,
        gradeId: review.grade_id
    };
    
    res.status(201).json(responseBody);
});

module.exports = app;