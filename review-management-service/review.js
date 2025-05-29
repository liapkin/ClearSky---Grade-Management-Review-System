import express from 'express';
import bodyParser from 'body-parser';
import db from './models/index.js';

const app = express();
app.use(bodyParser.json());

app.post('/reviews/new',async (req, res) => {
    try{
        const { gradeId, message } = req.body;

        const newReview = await db.reviews.create({
            grade_id: gradeId,
            request_message: message,
            response_message: '',
            state: 'Pending', // 0 for pending
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
    
            
        
        
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'Failed to fetch reviews'
        });
    }
});


app.post('/reviews/:reviewId/response', (req, res) => {
    const { reviewId } = req.params;
    const { action, newGrade, response } = req.body;
    
    if (!reviewId) {
        return res.status(400).json({ error: 'reviewId is required as path parameter' });
    }

    console.log(reviewId);

    const reviewIndex = reviews.findIndex(review => review.id == reviewId);
   
    if (reviewIndex === -1) {
        return res.status(404).json({ error: 'Review not found' });
    }
    
    const updatedReview = {
        ...reviews[reviewIndex],
        status: action === 'accepted' ? 'closed' : action === 'rejected' ? 'rejected' : reviews[reviewIndex].status,
        response: response || reviews[reviewIndex].response,
        grade: newGrade || reviews[reviewIndex].grade,
        updatedAt: new Date()
    };
    
    reviews[reviewIndex] = updatedReview;
    
    // Response for Submit Response
    const responseBody = {
        reviewlist: {
            status: updatedReview.status,
            response: updatedReview.response,
            updatedAt: updatedReview.updatedAt
        }
    };
    
    res.status(201).json(responseBody);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Review service running on port ${PORT}`);
});