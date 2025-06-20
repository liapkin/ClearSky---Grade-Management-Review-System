export default function GradeView() {
    // Attach event listeners after render
    setTimeout(() => {
      const reviewBtns = document.querySelectorAll('.review-btn')
      reviewBtns.forEach(btn => {
        btn.addEventListener('click', handleReviewRequest)
      })
      
      const reviewForm = document.getElementById('review-form')
      if (reviewForm) {
        reviewForm.addEventListener('submit', submitReview)
      }
    }, 0)
    
    return `
      <div class="card">
        <h1 class="card-title">My Grades</h1>
        
        <div style="margin-bottom: 2rem;">
          <label for="period-filter">Filter by period:</label>
          <select id="period-filter" style="width: 200px; margin-left: 0.5rem;">
            <option value="all">All periods</option>
            <option value="spring2025">Spring 2025</option>
            <option value="fall2024">Fall 2024</option>
          </select>
        </div>
        
        <table class="table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Period</th>
              <th>Grade</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Software as a Service</td>
              <td>Spring 2025</td>
              <td><strong>8.5</strong></td>
              <td><span class="badge badge-open">Open</span></td>
              <td>
                <button class="btn btn-primary btn-sm review-btn" data-course="saas">
                  Request Review
                </button>
              </td>
            </tr>
            <tr>
              <td>Algorithms</td>
              <td>Fall 2024</td>
              <td><strong>7.0</strong></td>
              <td><span class="badge badge-final">Final</span></td>
              <td>-</td>
            </tr>
            <tr>
              <td>Databases</td>
              <td>Fall 2024</td>
              <td><strong>9.0</strong></td>
              <td><span class="badge badge-final">Final</span></td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Review Request Modal -->
      <div id="review-modal" style="display: none;">
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999;">
          <div class="card" style="position: relative; max-width: 500px; margin: 5rem auto;">
            <h2 class="card-title">Request Grade Review</h2>
            <form id="review-form">
              <div class="form-group">
                <label>Course: <strong id="review-course">Software as a Service</strong></label>
              </div>
              <div class="form-group">
                <label>Current Grade: <strong id="review-grade">8.5</strong></label>
              </div>
              <div class="form-group">
                <label for="review-reason">Reason for Review</label>
                <textarea 
                  id="review-reason" 
                  rows="4" 
                  required
                  placeholder="Please explain why you believe your grade should be reconsidered..."
                ></textarea>
              </div>
              <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button type="button" class="btn btn-secondary" onclick="closeReviewModal()">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div class="card">
        <h2 class="card-title">Review Request History</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Request Date</th>
              <th>Status</th>
              <th>Response</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Operating Systems</td>
              <td>2025-02-20</td>
              <td><span class="badge badge-final">Resolved</span></td>
              <td>Grade updated from 6.5 to 7.0</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  }
  
  function handleReviewRequest(e) {
    const modal = document.getElementById('review-modal')
    modal.style.display = 'block'
  }
  
  window.closeReviewModal = function() {
    const modal = document.getElementById('review-modal')
    modal.style.display = 'none'
  }
  
  function submitReview(e) {
    e.preventDefault()
    alert('Review request submitted successfully!')
    window.closeReviewModal()
  }