import React, { useState, useEffect } from 'react'
import { reviewsAPI } from '../services/api'

function ReviewManagement() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('list')
  const [userRole, setUserRole] = useState(null)
  
  // Create review form
  const [newReview, setNewReview] = useState({
    gradeId: '',
    message: ''
  })
  
  // Response form
  const [responseForm, setResponseForm] = useState({
    reviewId: '',
    action: 'approve',
    newGrade: '',
    response: ''
  })

  useEffect(() => {
    // Get user role from localStorage
    const userData = JSON.parse(localStorage.getItem('clearsky_user') || '{}')
    setUserRole(userData.role)
    
    loadReviews()
  }, [])

  const loadReviews = async (state = null) => {
    setLoading(true)
    setMessage('')
    
    try {
      const response = await reviewsAPI.getReviews(state)
      console.log('Reviews API Response:', response)
      console.log('Response type:', typeof response)
      console.log('Response keys:', Object.keys(response || {}))
      
      const reviewsList = response.reviewerList || response.data || response || []
      console.log('Extracted reviews list:', reviewsList)
      console.log('Reviews count:', reviewsList.length)
      
      setReviews(reviewsList)
      
      if (reviewsList.length === 0) {
        setMessage('No reviews found. If you are an instructor, make sure students have submitted review requests for your courses.')
      }
    } catch (error) {
      console.error('Reviews API Error:', error)
      setMessage('Failed to load reviews: ' + error.message)
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateReview = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      const gradeId = parseInt(newReview.gradeId)
      if (isNaN(gradeId) || gradeId <= 0) {
        throw new Error('Please enter a valid grade ID')
      }
      
      const response = await reviewsAPI.createReview(gradeId, newReview.message)
      
      if (response.success) {
        setMessage('Review request created successfully!')
        setNewReview({ gradeId: '', message: '' })
        loadReviews()
        setActiveTab('list')
      }
    } catch (error) {
      setMessage('Failed to create review: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRespondToReview = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      const reviewId = parseInt(responseForm.reviewId)
      const newGrade = parseFloat(responseForm.newGrade)
      
      if (isNaN(reviewId) || reviewId <= 0) {
        throw new Error('Please enter a valid review ID')
      }
      
      if (isNaN(newGrade) || newGrade < 0 || newGrade > 10) {
        throw new Error('Please enter a valid grade (0-10)')
      }
      
      const response = await reviewsAPI.respondToReview(
        reviewId,
        responseForm.action,
        newGrade,
        responseForm.response
      )
      
      if (response.reviewId) {
        setMessage(`Review ${responseForm.action === 'approve' ? 'approved' : 'rejected'} successfully!`)
        setResponseForm({ reviewId: '', action: 'approve', newGrade: '', response: '' })
        loadReviews()
      }
    } catch (error) {
      setMessage('Failed to respond to review: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleNewReviewChange = (e) => {
    setNewReview({
      ...newReview,
      [e.target.name]: e.target.value
    })
  }

  const handleResponseChange = (e) => {
    setResponseForm({
      ...responseForm,
      [e.target.name]: e.target.value
    })
  }

  const handleQuickRespond = (reviewId, gradeId) => {
    setResponseForm({
      reviewId: reviewId.toString(),
      action: 'approve',
      newGrade: '',
      response: ''
    })
    setActiveTab('respond')
  }

  const getStatusBadge = (state) => {
    const className = state === 'Pending' ? 'pending' : 
                    state === 'Approved' ? 'approved' : 'rejected'
    return <span className={`status-badge ${className}`}>{state}</span>
  }

  return (
    <div className="review-management">
      <h1>Review Management</h1>
      
      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Review List
        </button>
        {userRole === 'STUDENT' && (
          <button 
            className={`tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Review
          </button>
        )}
        {userRole === 'INSTRUCTOR' && (
          <button 
            className={`tab ${activeTab === 'respond' ? 'active' : ''}`}
            onClick={() => setActiveTab('respond')}
          >
            Respond to Review
          </button>
        )}
      </div>

      {activeTab === 'list' && (
        <div className="tab-content">
          <div className="list-controls">
            <h2>Reviews</h2>
            <div className="filter-buttons">
              <button onClick={() => loadReviews()} className="btn btn-secondary">
                All Reviews
              </button>
              <button onClick={() => loadReviews('Pending')} className="btn btn-warning">
                Pending
              </button>
              <button onClick={() => loadReviews('Approved')} className="btn btn-success">
                Approved
              </button>
              <button onClick={() => loadReviews('Rejected')} className="btn btn-danger">
                Rejected
              </button>
            </div>
          </div>
          
          {loading && <div className="loading">Loading reviews...</div>}
          
          {!loading && reviews.length === 0 && (
            <div className="no-data">No reviews found.</div>
          )}
          
          {!loading && reviews.length > 0 && (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.reviewId} className="review-card">
                  <div className="review-header">
                    <div className="review-info">
                      <div className="review-id">Review #{review.reviewId}</div>
                      <div className="review-meta">Grade ID: {review.gradeId}</div>
                    </div>
                    {getStatusBadge(review.state)}
                  </div>
                  
                  <div className="review-content">
                    <div className="review-details">
                      <div className="detail-row">
                        <span className="detail-label">📚 Course:</span>
                        <span className="detail-value">{review.course?.name || `Course ${review.gradeId}`}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">👤 Student:</span>
                        <span className="detail-value">
                          {review.student?.name && review.student?.surname 
                            ? `${review.student.name} ${review.student.surname}` 
                            : `Student ID: ${review.studentId || 'N/A'}`}
                          {review.student?.am && ` (AM: ${review.student.am})`}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">📊 Current Grade:</span>
                        <span className="detail-value">{review.grade?.value || 'N/A'} (State: {review.grade?.state || 'Unknown'})</span>
                      </div>
                      {review.teacher && (
                        <div className="detail-row">
                          <span className="detail-label">👨‍🏫 Instructor:</span>
                          <span className="detail-value">{review.teacher.name} {review.teacher.surname}</span>
                        </div>
                      )}
                    </div>
                    
                    {(review.request_message || review.requestMessage) && (
                      <div className="request-message">
                        <h4>📝 Student's Request:</h4>
                        <p>"{review.request_message || review.requestMessage}"</p>
                      </div>
                    )}
                    
                    {(review.response_message || review.responseMessage) && (
                      <div className="response-message">
                        <h4>💬 Your Response:</h4>
                        <p>"{review.response_message || review.responseMessage}"</p>
                      </div>
                    )}
                  </div>
                  
                  {userRole === 'INSTRUCTOR' && review.state === 'Pending' && (
                    <div className="review-actions">
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleQuickRespond(review.reviewId, review.gradeId)}
                      >
                        📝 Respond to Review
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'create' && userRole === 'STUDENT' && (
        <div className="tab-content">
          <h2>Create Review Request</h2>
          <form onSubmit={handleCreateReview} className="review-form">
            <div className="form-group">
              <label htmlFor="gradeId">Grade ID:</label>
              <input
                type="number"
                id="gradeId"
                name="gradeId"
                value={newReview.gradeId}
                onChange={handleNewReviewChange}
                required
                disabled={loading}
                min="1"
                placeholder="Enter the grade ID you want to review"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Review Message:</label>
              <textarea
                id="message"
                name="message"
                value={newReview.message}
                onChange={handleNewReviewChange}
                required
                disabled={loading}
                rows="4"
                placeholder="Explain why you're requesting a review of this grade..."
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Creating...' : 'Create Review Request'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'respond' && userRole === 'INSTRUCTOR' && (
        <div className="tab-content">
          <h2>Respond to Review</h2>
          <form onSubmit={handleRespondToReview} className="review-form">
            <div className="form-group">
              <label htmlFor="reviewId">Review ID:</label>
              <input
                type="number"
                id="reviewId"
                name="reviewId"
                value={responseForm.reviewId}
                onChange={handleResponseChange}
                required
                disabled={loading}
                min="1"
                placeholder="Enter the review ID"
              />
            </div>

            <div className="form-group">
              <label htmlFor="action">Action:</label>
              <select
                id="action"
                name="action"
                value={responseForm.action}
                onChange={handleResponseChange}
                required
                disabled={loading}
              >
                <option value="approve">Approve</option>
                <option value="reject">Reject</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="newGrade">New Grade (0-10):</label>
              <input
                type="number"
                id="newGrade"
                name="newGrade"
                value={responseForm.newGrade}
                onChange={handleResponseChange}
                required
                disabled={loading}
                min="0"
                max="10"
                step="0.1"
                placeholder="Enter the new grade"
              />
            </div>

            <div className="form-group">
              <label htmlFor="response">Response Message:</label>
              <textarea
                id="response"
                name="response"
                value={responseForm.response}
                onChange={handleResponseChange}
                required
                disabled={loading}
                rows="4"
                placeholder="Provide your response to the review request..."
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Responding...' : 'Submit Response'}
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        .review-management {
          max-width: 1000px;
          margin: 2rem auto;
          padding: 2rem;
        }

        .tabs {
          display: flex;
          border-bottom: 1px solid #ddd;
          margin-bottom: 2rem;
        }

        .tab {
          padding: 1rem 2rem;
          border: none;
          background: none;
          cursor: pointer;
          font-weight: 500;
          border-bottom: 2px solid transparent;
        }

        .tab.active {
          border-bottom-color: #007bff;
          color: #007bff;
        }

        .list-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .filter-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .reviews-list {
          display: grid;
          gap: 1rem;
        }

        .review-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1.5rem;
          background: white;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .review-id {
          font-weight: bold;
          font-size: 1.1rem;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.875rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .status-badge.pending {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge.approved {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.rejected {
          background: #f8d7da;
          color: #721c24;
        }

        .review-content {
          margin-top: 1rem;
        }

        .review-details {
          margin-bottom: 1rem;
        }

        .detail-row {
          display: flex;
          align-items: center;
          margin: 0.75rem 0;
          gap: 0.5rem;
        }

        .detail-label {
          font-weight: 600;
          color: #495057;
          min-width: 120px;
        }

        .detail-value {
          color: #6c757d;
        }

        .request-message, .response-message {
          margin: 1rem 0;
          padding: 1rem;
          border-radius: 8px;
        }

        .request-message {
          background: #f8f9fa;
          border-left: 4px solid #007bff;
        }

        .response-message {
          background: #e8f5e8;
          border-left: 4px solid #28a745;
        }

        .request-message h4, .response-message h4 {
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
          color: #495057;
        }

        .request-message p, .response-message p {
          margin: 0;
          font-style: italic;
          color: #6c757d;
        }

        .review-actions {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #dee2e6;
          display: flex;
          gap: 0.5rem;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .review-form {
          max-width: 600px;
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        .form-group textarea {
          resize: vertical;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          font-size: 1rem;
          transition: background-color 0.2s;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-success {
          background: #28a745;
          color: white;
        }

        .btn-warning {
          background: #ffc107;
          color: #212529;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .message {
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 4px;
          font-weight: 500;
        }

        .message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .loading,
        .no-data {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .no-data {
          font-style: italic;
        }
      `}</style>
    </div>
  )
}

export default ReviewManagement