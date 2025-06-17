const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');
const listener = require('./message__listener.js');

const app = express();
app.use(bodyParser.json());

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


app.get('/reviews', async (req, res) => {
    try {
        const { state, userId, role } = req.body;
        
        if (role == "student") {
            
            console.log("Fetching reviews for student with ID:", userId);

            //const grades = await getGradesByStudentId(studentId);
            
            const rev = await db.reviews.findAll({
                include: [{
                    model: db.grades,
                    as: 'grade',
                    where: { student_id: userId }
                }],
                where: { state: state },
                timeout: 5000
            });
            
            console.log("Reviews fetched for student:", rev);
            
            const response = {
                reviewerList: rev.map(review => ({
                    reviewId: review.id,
                    gradeId: review.grade_id,
                    state: review.state,
                }))
            }
            
            res.status(200).json(response);
        };
        
        if (role == "teacher") {
            
            console.log("Fetching reviews for teacher with ID:", userId);
            
            const rev = await db.reviews.findAll({
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
            
            const response = {
                reviewerList: rev.map(review => ({
                    reviewId: review.id,
                    gradeId: review.grade_id,
                    state: review.state,
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