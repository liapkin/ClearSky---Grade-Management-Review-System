export default function GradeUpload() {
    // Attach event listeners after render
    setTimeout(() => {
      const uploadForm = document.getElementById('upload-form')
      const fileInput = document.getElementById('file-input')
      const fileLabel = document.getElementById('file-label')
      
      if (fileInput) {
        fileInput.addEventListener('change', (e) => {
          const fileName = e.target.files[0]?.name || 'Choose file or drag and drop'
          fileLabel.textContent = fileName
        })
      }
      
      if (uploadForm) {
        uploadForm.addEventListener('submit', handleUpload)
      }
    }, 0)
    
    return `
      <div class="card">
        <h1 class="card-title">Upload Grades</h1>
        
        <form id="upload-form">
          <div class="form-group">
            <label for="course">Course</label>
            <select id="course" name="course" required>
              <option value="">Select course...</option>
              <option value="saas">Software as a Service</option>
              <option value="algo">Algorithms</option>
              <option value="db">Databases</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="period">Exam Period</label>
            <input 
              type="text" 
              id="period" 
              name="period" 
              placeholder="e.g., Spring 2025"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="grade-type">Grade Type</label>
            <select id="grade-type" name="gradeType" required>
              <option value="">Select type...</option>
              <option value="initial">Initial Grades</option>
              <option value="final">Final Grades</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Excel File (.xlsx)</label>
            <div class="file-upload">
              <input 
                type="file" 
                id="file-input" 
                accept=".xlsx"
                style="display: none;"
                required
              >
              <label for="file-input" id="file-label" style="cursor: pointer;">
                📁 Choose file or drag and drop
              </label>
            </div>
          </div>
          
          <div id="upload-message" style="display: none;"></div>
          
          <button type="submit" class="btn btn-primary">
            Upload Grades
          </button>
        </form>
      </div>
      
      <div class="card">
        <h2 class="card-title">Recent Uploads</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Period</th>
              <th>Type</th>
              <th>Upload Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Software as a Service</td>
              <td>Spring 2025</td>
              <td>Initial</td>
              <td>2025-03-10</td>
              <td><span class="badge badge-open">Open</span></td>
            </tr>
            <tr>
              <td>Algorithms</td>
              <td>Fall 2024</td>
              <td>Final</td>
              <td>2025-02-15</td>
              <td><span class="badge badge-final">Finalized</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  }
  
  function handleUpload(e) {
    e.preventDefault()
    
    const formData = new FormData(e.target)
    const messageDiv = document.getElementById('upload-message')
    
    // Simulate upload
    messageDiv.className = 'alert alert-success'
    messageDiv.textContent = 'Grades uploaded successfully!'
    messageDiv.style.display = 'block'
    
    // Reset form after delay
    setTimeout(() => {
      e.target.reset()
      document.getElementById('file-label').textContent = '📁 Choose file or drag and drop'
      messageDiv.style.display = 'none'
    }, 3000)
  }