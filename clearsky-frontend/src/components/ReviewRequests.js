export default function ReviewRequests() {
    // Attach event listeners after render
    setTimeout(() => {
      const replyBtns = document.querySelectorAll('.reply-btn')
      replyBtns.forEach(btn => {
        btn.addEventListener('click', handleReply)
      })
      
      const replyForm = document.getElementById('reply-form')
      if (replyForm) {
        replyForm.addEventListener('submit', submitReply)
      }
    }, 0)
    
    return `
      <div class="card">
        <h1 class="card-title">Grade Review Requests</h1>
        
        <div style="margin-bottom: 2rem;">
          <select id="course-filter" style="width: 200px;">
            <option value="all">All courses</option>
            <option value="saas">Software as a Service</option>
            <option value="algo">Algorithms</option>
          </select>
        </div>
        
        <table class="table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Course</th>
              <th>Current Grade</th>
              <th>Request Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>03112345</td>
              <td>John Doe</td>
              <td>Software as a Service</td>
              <td>8.5</td>
              <td>2025-03-14</td>
              <td><span class="badge badge-open">Pending</span></td>
              <td>
                <button class="btn btn-primary btn-sm reply-btn" data-id="1">
                  Reply
                </button>
              </td>
            </tr>
            <tr>
              <td>03112346</td>
              <td>Jane Smith</td>
              <td>Software as a Service</td>
              <td>7.0</td>
              <td>2025-03-13</td>
              <td><span class="badge badge-open">Pending</span></td>
              <td>
                <button class="btn btn-primary btn-sm reply-btn" data-id="2">
                  Reply
                </button>
              </td>
            </tr>
            <tr>
              <td>03112347</td>
              <td>Bob Johnson</td>
              <td>Algorithms</td>
              <td>6.5</td>
              <td>2025-03-10</td>
              <td><span class="badge badge-final">Resolved</span></td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Reply Modal -->
      <div id="reply-modal" style="display: none;">
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999;">
          <div class="card" style="position: relative; max-width: 600px; margin: 3rem auto;">
            <h2 class="card-title">Reply to Review Request</h2>
            
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 4px; margin-bottom: 1rem;">
              <p><strong>Student:</strong> <span id="reply-student">John Doe (03112345)</span></p>
              <p><strong>Course:</strong> <span id="reply-course">Software as a Service</span></p>
              <p><strong>Current Grade:</strong> <span id="reply-grade">8.5</span></p>
              <p><strong>Student's Request:</strong></p>
              <p style="font-style: italic; margin-top: 0.5rem;">
                "I believe my project submission was not fully evaluated. 
                The automated tests show 95% pass rate but my grade doesn't reflect this."
              </p>
            </div>
            
            <form id="reply-form">
              <div class="form-group">
                <label for="action">Action</label>
                <select id="action" name="action" required>
                  <option value="">Select action...</option>
                  <option value="accept">Accept - Update Grade</option>
                  <option value="reject">Reject - Keep Current Grade</option>
                  <option value="partial">Partial Accept - Adjust Grade</option>
                </select>
              </div>
              
              <div class="form-group" id="new-grade-group" style="display: none;">
                <label for="new-grade">New Grade</label>
                <input type="number" id="new-grade" min="0" max="10" step="0.1">
              </div>
              
              <div class="form-group">
                <label for="reply-message">Response Message</label>
                <textarea 
                  id="reply-message" 
                  rows="4" 
                  required
                  placeholder="Provide explanation for your decision..."
                ></textarea>
              </div>
              
              <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button type="button" class="btn btn-secondary" onclick="closeReplyModal()">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary">
                  Submit Response
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `
  }
  
  function handleReply(e) {
    const modal = document.getElementById('reply-modal')
    modal.style.display = 'block'
    
    // Show/hide new grade field based on action
    const actionSelect = document.getElementById('action')
    const newGradeGroup = document.getElementById('new-grade-group')
    
    actionSelect.addEventListener('change', (e) => {
      if (e.target.value === 'accept' || e.target.value === 'partial') {
        newGradeGroup.style.display = 'block'
      } else {
        newGradeGroup.style.display = 'none'
      }
    })
  }
  
  window.closeReplyModal = function() {
    const modal = document.getElementById('reply-modal')
    modal.style.display = 'none'
  }
  
  function submitReply(e) {
    e.preventDefault()
    alert('Response submitted successfully!')
    window.closeReplyModal()
  }