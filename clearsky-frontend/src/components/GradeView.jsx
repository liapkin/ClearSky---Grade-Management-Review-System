import React, { useState, useEffect } from 'react'
import { gradesAPI, reviewsAPI } from '../services/api'
import { mapGradesResponse, mapReviewsResponse } from '../utils/responseMappers'

function GradeView() {
  const [grades, setGrades] = useState([])
  const [examinations, setExaminations] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [userRole, setUserRole] = useState(null)
  const [userId, setUserId] = useState(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState(null)
  const [reviewMessage, setReviewMessage] = useState('')

  useEffect(() => {
    // Get user info from localStorage  
    const userData = JSON.parse(localStorage.getItem('clearsky_user') || '{}')
    setUserRole(userData.role)
    
    // Extract correct user ID based on role
    let effectiveUserId
    if (userData.role === 'STUDENT') {
      effectiveUserId = userData.studentId || userData.sub
    } else if (userData.role === 'INSTRUCTOR') {
      effectiveUserId = userData.teacherId || userData.sub
    } else {
      effectiveUserId = userData.sub
    }
    
    setUserId(effectiveUserId)
    
    if (userData.role === 'STUDENT' && effectiveUserId) {
      loadStudentData(effectiveUserId)
    }
  }, [])

  const loadStudentData = async (studentId) => {
    setLoading(true)
    try {
      // Try to get detailed grades first (which includes real grade IDs)
      let detailedGrades = []
      
      try {
        const detailedResponse = await fetch(`http://localhost:3002/grades/detailed?student_id=${studentId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('clearsky_auth_token') || localStorage.getItem('clearsky_token')}`
          }
        })
        
        if (detailedResponse.ok) {
          const detailedData = await detailedResponse.json()
          detailedGrades = detailedData.grades || []
          console.log('Detailed grades for review requests:', detailedGrades)
        }
      } catch (detailError) {
        console.warn('Detailed grades not available:', detailError.message)
      }
      
      if (detailedGrades.length > 0) {
        // Use real grade data with actual IDs
        const gradesWithRealIds = detailedGrades.map(grade => ({
          id: grade.id, // Real grade ID from database
          value: grade.value,
          course: grade.course?.name || `Course ${grade.course?.id || 'Unknown'}`,
          state: grade.state,
          examination_id: grade.course?.id || grade.examination_id,
          canRequestReview: grade.value < 5 && grade.state === 'Open'
        }))
        setGrades(gradesWithRealIds)
      } else {
        // Fallback: use simple grades API
        const gradesResponse = await gradesAPI.getStudentGrades(studentId)
        const mappedGrades = mapGradesResponse(gradesResponse)
        setGrades(mappedGrades)
      }
      
      // Load student's examinations/courses - this endpoint might timeout
      try {
        const examResponse = await gradesAPI.getInstructorExaminations(studentId, 'student')
        setExaminations(Array.isArray(examResponse) ? examResponse : [])
      } catch (examError) {
        console.warn('Could not load examinations:', examError.message)
        setExaminations([])
      }
      
      // Load student's review history with detailed information
      try {
        await loadReviews()
      } catch (reviewError) {
        console.warn('Could not load reviews:', reviewError.message)
        setReviews([])
      }
      
    } catch (error) {
      setMessage('Failed to load grade data: ' + error.message)
      console.error('Failed to load student data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadReviews = async () => {
    try {
      const reviewsResponse = await reviewsAPI.getReviews()
      setReviews(mapReviewsResponse(reviewsResponse))
    } catch (error) {
      console.error('Failed to load reviews:', error)
      setReviews([])
    }
  }

  const handleRequestReview = (gradeIndex) => {
    const gradeObj = grades[gradeIndex]
    setSelectedGrade({
      index: gradeIndex,
      id: gradeObj.id, // Real grade ID from database
      value: gradeObj.value,
      course: gradeObj.course || examinations[gradeIndex % examinations.length] || 'Unknown Course',
      examination_id: gradeObj.examination_id
    })
    setShowReviewModal(true)
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    
    if (!selectedGrade || !reviewMessage.trim()) {
      setMessage('Please provide a review message.')
      return
    }

    setLoading(true)
    try {
      // Use the real grade ID from the database
      const gradeId = selectedGrade.id || (selectedGrade.index + 1) // Fallback to old method if ID not available
      
      console.log('Submitting review for grade ID:', gradeId)
      const response = await reviewsAPI.createReview(gradeId, reviewMessage)
      
      if (response.success) {
        setMessage('Review request submitted successfully!')
        setShowReviewModal(false)
        setReviewMessage('')
        setSelectedGrade(null)
        
        // Reload reviews to show the new one
        await loadReviews()
      }
    } catch (error) {
      setMessage('Failed to submit review: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getGradeStatus = (grade) => {
    return grade >= 5 ? 'Pass' : 'Fail'
  }

  const getGradeStatusClass = (grade) => {
    return grade >= 5 ? 'pass' : 'fail'
  }

  if (userRole !== 'STUDENT') {
    return (
      <div className="grade-view">
        <div className="access-denied">
          <h1>Access Denied</h1>
          <p>Only students can view grades. Please login as a student to access this feature.</p>
        </div>

        <style jsx>{`
          .grade-view {
            max-width: 1000px;
            margin: 2rem auto;
            padding: 2rem;
          }

          .access-denied {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 8px;
            padding: 2rem;
            text-align: center;
            color: #721c24;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="grade-view">
      <h1>My Grades</h1>
      
      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {loading && <div className="loading">Loading grades...</div>}

      {/* Grades Overview */}
      <div className="grades-overview">
        <h2>Current Grades</h2>
        {grades.length === 0 ? (
          <div className="no-data">No grades found. Contact your instructor if you believe this is an error.</div>
        ) : (
          <div className="grades-grid">
            {grades.map((gradeObj, index) => (
              <div key={gradeObj.id || index} className="grade-card">
                <div className="grade-header">
                  <h3>{gradeObj.course || examinations[index % examinations.length] || `Course ${index + 1}`}</h3>
                  <span className={`grade-badge ${getGradeStatusClass(gradeObj.value)}`}>
                    {typeof gradeObj.value === 'number' ? gradeObj.value.toFixed(1) : gradeObj.value}
                  </span>
                </div>
                <div className="grade-details">
                  <p><strong>Status:</strong> {getGradeStatus(gradeObj.value)}</p>
                  <p><strong>Grade ID:</strong> {gradeObj.id}</p>
                </div>
                <div className="grade-actions">
                  <button 
                    onClick={() => handleRequestReview(index)}
                    className="btn btn-primary btn-sm"
                    disabled={loading}
                  >
                    Request Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {grades.length > 0 && (
          <div className="grades-summary">
            <div className="summary-card">
              <h3>Summary</h3>
              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Grades:</span>
                  <span className="stat-value">{grades.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Average:</span>
                  <span className="stat-value">{(grades.reduce((a, b) => a + b.value, 0) / grades.length).toFixed(2)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Passed:</span>
                  <span className="stat-value">{grades.filter(g => g.value >= 5).length} / {grades.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Pass Rate:</span>
                  <span className="stat-value">{((grades.filter(g => g.value >= 5).length / grades.length) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Review History */}
      <div className="reviews-section">
        <h2>Review Request History</h2>
        {reviews.length === 0 ? (
          <div className="no-data">No review requests found.</div>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.reviewId} className="review-card">
                <div className="review-header">
                  <span className="review-id">Review #{review.reviewId}</span>
                  <span className={`review-status ${review.state.toLowerCase()}`}>
                    {review.state}
                  </span>
                </div>
                <div className="review-details">
                  <p><strong>Grade ID:</strong> {review.gradeId}</p>
                  <p><strong>Status:</strong> {review.state}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Request Modal */}
      {showReviewModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Request Grade Review</h2>
            <form onSubmit={handleSubmitReview}>
              <div className="form-group">
                <label><strong>Course:</strong> {selectedGrade?.course}</label>
              </div>
              <div className="form-group">
                <label><strong>Current Grade:</strong> {typeof selectedGrade?.value === 'number' ? selectedGrade.value.toFixed(1) : selectedGrade?.value}</label>
              </div>
              <div className="form-group">
                <label><strong>Grade ID:</strong> {selectedGrade?.id || (selectedGrade?.index + 1)}</label>
              </div>
              <div className="form-group">
                <label htmlFor="review-message">Reason for Review:</label>
                <textarea
                  id="review-message"
                  value={reviewMessage}
                  onChange={(e) => setReviewMessage(e.target.value)}
                  rows="4"
                  required
                  placeholder="Please explain why you believe your grade should be reconsidered..."
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowReviewModal(false)
                    setReviewMessage('')
                    setSelectedGrade(null)
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .grade-view {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 2rem;
        }

        .grades-overview, .reviews-section {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .grades-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .grade-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1.5rem;
          background: #f8f9fa;
        }

        .grade-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .grade-header h3 {
          margin: 0;
          color: #333;
        }

        .grade-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: bold;
          font-size: 1.1rem;
        }

        .grade-badge.pass {
          background: #d4edda;
          color: #155724;
        }

        .grade-badge.fail {
          background: #f8d7da;
          color: #721c24;
        }

        .grade-details p {
          margin: 0.5rem 0;
        }

        .grade-actions {
          margin-top: 1rem;
        }

        .grades-summary {
          margin-top: 2rem;
        }

        .summary-card {
          background: #e3f2fd;
          padding: 1.5rem;
          border-radius: 8px;
        }

        .summary-card h3 {
          margin: 0 0 1rem 0;
          color: #1565c0;
        }

        .summary-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
        }

        .stat-label {
          font-weight: 500;
        }

        .stat-value {
          font-weight: bold;
          color: #1565c0;
        }

        .reviews-list {
          display: grid;
          gap: 1rem;
        }

        .review-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1rem;
          background: #f8f9fa;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .review-id {
          font-weight: bold;
        }

        .review-status {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .review-status.pending {
          background: #fff3cd;
          color: #856404;
        }

        .review-status.approved {
          background: #d4edda;
          color: #155724;
        }

        .review-status.rejected {
          background: #f8d7da;
          color: #721c24;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal {
          background: white;
          border-radius: 8px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal h2 {
          margin: 0 0 1.5rem 0;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          resize: vertical;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1.5rem;
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

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
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

export default GradeView