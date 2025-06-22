import React, { useState, useEffect } from 'react'
import { reviewsAPI } from '../services/api'
import { mapReviewsResponse } from '../utils/responseMappers'

function ReviewRequests() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [userRole, setUserRole] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  
  useEffect(() => {
    // Get user info from localStorage
    const userData = JSON.parse(localStorage.getItem('clearsky_user') || '{}')
    setUserRole(userData.role)
    
    loadReviews()
  }, [])

  const loadReviews = async (state = null) => {
    setLoading(true)
    setMessage('')
    
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout - service may be unavailable')), 10000)
      )
      
      const response = await Promise.race([
        reviewsAPI.getReviews(state),
        timeoutPromise
      ])
      
      setReviews(mapReviewsResponse(response))
      
      if (response.reviewerList && response.reviewerList.length > 0) {
        setMessage(`Loaded ${response.reviewerList.length} review(s)`)
      } else {
        setMessage('No reviews found for the selected criteria')
      }
    } catch (error) {
      if (error.message.includes('timeout')) {
        setMessage('Reviews service is currently unavailable. Please try again later.')
      } else {
        setMessage('Failed to load reviews: ' + error.message)
      }
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusFilterChange = (e) => {
    const status = e.target.value
    setStatusFilter(status)
    
    if (status === '') {
      loadReviews()
    } else {
      loadReviews(status)
    }
  }

  const getStatusBadge = (state) => {
    const className = state === 'Pending' ? 'pending' : 
                    state === 'Approved' ? 'approved' : 'rejected'
    return <span className={`status-badge ${className}`}>{state}</span>
  }

  if (userRole === 'INSTRUCTOR') {
    return (
      <div className="review-requests">
        <div className="redirect-notice">
          <h1>Review Management</h1>
          <p>As an instructor, you should use the Review Management section to respond to review requests.</p>
          <p>This section is for viewing review requests only.</p>
        </div>

        <style jsx>{`
          .review-requests {
            max-width: 800px;
            margin: 2rem auto;
            padding: 2rem;
          }

          .redirect-notice {
            background: #e3f2fd;
            border: 1px solid #bbdefb;
            border-radius: 8px;
            padding: 2rem;
            text-align: center;
            color: #1565c0;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="review-requests">
      <h1>My Review Requests</h1>
      
      {message && (
        <div className={`message ${message.includes('Loaded') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="controls">
        <div className="filter-section">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            disabled={loading}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <button 
          onClick={() => loadReviews(statusFilter || null)} 
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {loading && <div className="loading">Loading reviews...</div>}

      <div className="reviews-section">
        {!loading && reviews.length === 0 && (
          <div className="no-data">
            <h3>No review requests found</h3>
            <p>You haven't submitted any review requests yet, or none match your current filter.</p>
            <p>To submit a new review request, go to "My Grades" and click "Request Review" on any grade.</p>
          </div>
        )}

        {!loading && reviews.length > 0 && (
          <div className="reviews-list">
            <h2>Review Requests ({reviews.length})</h2>
            {reviews.map((review) => (
              <div key={review.reviewId} className="review-card">
                <div className="review-header">
                  <div className="review-info">
                    <h3>Review #{review.reviewId}</h3>
                    <p className="review-meta">Grade ID: {review.gradeId}</p>
                  </div>
                  <div className="review-status">
                    {getStatusBadge(review.state)}
                  </div>
                </div>
                
                <div className="review-details">
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value">{review.state}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Grade ID:</span>
                    <span className="detail-value">{review.gradeId}</span>
                  </div>
                </div>

                {review.state === 'Pending' && (
                  <div className="pending-notice">
                    <p>⏳ Your review request is pending. You will be notified when the instructor responds.</p>
                  </div>
                )}

                {review.state === 'Approved' && (
                  <div className="approved-notice">
                    <p>✅ Your review request has been approved. Check your grades for any updates.</p>
                  </div>
                )}

                {review.state === 'Rejected' && (
                  <div className="rejected-notice">
                    <p>❌ Your review request has been rejected.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="help-section">
        <h2>Need Help?</h2>
        <div className="help-content">
          <div className="help-item">
            <h4>How to request a review</h4>
            <p>Go to "My Grades" and click "Request Review" next to any grade you want reviewed.</p>
          </div>
          <div className="help-item">
            <h4>Review process</h4>
            <p>Once submitted, your instructor will review your request and either approve or reject it with comments.</p>
          </div>
          <div className="help-item">
            <h4>Response time</h4>
            <p>Instructors typically respond to review requests within 3-5 business days.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .review-requests {
          max-width: 1000px;
          margin: 2rem auto;
          padding: 2rem;
        }

        .controls {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .filter-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-section label {
          font-weight: 500;
          color: #555;
        }

        .filter-section select {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          min-width: 150px;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .reviews-section {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .reviews-list h2 {
          margin: 0 0 1.5rem 0;
          color: #333;
        }

        .review-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          background: #f8f9fa;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .review-info h3 {
          margin: 0 0 0.25rem 0;
          color: #333;
        }

        .review-meta {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        .review-details {
          margin-bottom: 1rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .detail-label {
          font-weight: 500;
          color: #555;
        }

        .detail-value {
          color: #333;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
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

        .pending-notice,
        .approved-notice,
        .rejected-notice {
          padding: 1rem;
          border-radius: 6px;
          margin-top: 1rem;
        }

        .pending-notice {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
        }

        .approved-notice {
          background: #d4edda;
          border-left: 4px solid #28a745;
        }

        .rejected-notice {
          background: #f8d7da;
          border-left: 4px solid #dc3545;
        }

        .pending-notice p,
        .approved-notice p,
        .rejected-notice p {
          margin: 0;
          font-weight: 500;
        }

        .help-section {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 2rem;
        }

        .help-section h2 {
          margin: 0 0 1.5rem 0;
          color: #333;
        }

        .help-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .help-item h4 {
          margin: 0 0 0.5rem 0;
          color: #007bff;
        }

        .help-item p {
          margin: 0;
          color: #666;
          line-height: 1.5;
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

        .no-data h3 {
          margin: 0 0 1rem 0;
          color: #555;
        }

        .no-data p {
          margin: 0.5rem 0;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .review-requests {
            padding: 1rem;
          }

          .controls {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .review-header {
            flex-direction: column;
            gap: 1rem;
          }

          .detail-row {
            flex-direction: column;
            gap: 0.25rem;
          }

          .help-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default ReviewRequests