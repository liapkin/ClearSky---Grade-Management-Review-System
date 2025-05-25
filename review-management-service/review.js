const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let reviews = [];
let ids =1;

app.post('/reviews/new', (req, res) => {
    const { gradeId, message } = req.body;

    const newReview = {
        id: ids,
        gradeId: gradeId,
        requestMessage: message,
        responseMessage: null,
        status: "pending",
        grade: 5,
        updatedAt: new Date(),
    };

    ids += 1;
    
    reviews.push(newReview);

    const response = {
            reviewId: newReview.id,
            gradeId: newReview.gradeId,
            status: newReview.status,
            requestedAt: newReview.updatedAt
    };

    res.status(201).json(response);
});


app.get('/reviews', (req, res) => {
    const { status, instructorId } = req.query;

    let filteredReviews = [...reviews];
    
    if (status) {
        filteredReviews = filteredReviews.filter(review => review.status === status);
    }

    const response = {
        reviewerList: filteredReviews.map(review => ({
            reviewId: review.id,
            gradeId: review.gradeId,
            status: review.status,
            updatedAt: review.updatedAt
        }))
    };

    res.status(200).json(response);
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