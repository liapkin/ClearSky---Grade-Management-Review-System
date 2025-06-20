import { statsAPI } from '../services/api.js'

export default function Statistics() {
  // Fetch statistics after component loads
  setTimeout(() => {
    fetchStatistics()
    renderCharts()
    
    // Add event listeners
    const fetchBtn = document.getElementById('fetch-stats-btn')
    if (fetchBtn) {
      fetchBtn.addEventListener('click', fetchStatistics)
    }
  }, 0)
  
  return `
    <div class="card">
      <h1 class="card-title">Grade Statistics</h1>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
        <div>
          <label for="course-select">Course</label>
          <select id="course-select">
            <option value="all">All Courses</option>
            <option value="saas">Software as a Service</option>
            <option value="algo">Algorithms</option>
            <option value="db">Databases</option>
          </select>
        </div>
        <div>
          <label for="period-select">Period</label>
          <select id="period-select">
            <option value="spring2025">Spring 2025</option>
            <option value="fall2024">Fall 2024</option>
            <option value="spring2024">Spring 2024</option>
          </select>
        </div>
      </div>
      
      <button id="fetch-stats-btn" class="btn btn-primary" style="margin-bottom: 2rem;">
        Fetch Latest Statistics
      </button>
      
      <div id="stats-loading" class="loading" style="display: none;">Loading statistics...</div>
      <div id="stats-error" class="alert alert-error" style="display: none;"></div>
      
      <!-- Live Stats from API -->
      <div id="api-stats" style="display: none;">
        <h2 style="margin-bottom: 1rem;">Examination Statistics</h2>
        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-value" id="api-students-passed">-</div>
            <div class="stat-label">Students Passed</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" id="api-pass-rate">-</div>
            <div class="stat-label">Pass Rate</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" id="api-exam-id">-</div>
            <div class="stat-label">Examination ID</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" id="api-student-id">-</div>
            <div class="stat-label">Student ID</div>
          </div>
        </div>
        
        <!-- Grade Distribution Chart -->
        <div class="card" style="margin-top: 2rem;">
          <h3>Grade Distribution</h3>
          <div id="distribution-chart" style="height: 300px; display: flex; align-items: flex-end; justify-content: space-around; padding: 2rem;">
            <!-- Chart will be populated by JavaScript -->
          </div>
        </div>
      </div>
      
      <!-- Default Stats -->
      <div id="default-stats">
        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-value">156</div>
            <div class="stat-label">Total Students</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">7.8</div>
            <div class="stat-label">Average Grade</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">92%</div>
            <div class="stat-label">Pass Rate</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">8.5</div>
            <div class="stat-label">Median Grade</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <h2 class="card-title">Grade Distribution</h2>
      <div id="grade-chart" style="height: 300px; display: flex; align-items: flex-end; justify-content: space-around; padding: 2rem;">
        <!-- Simple bar chart -->
        <div style="text-align: center;">
          <div style="background: #3498db; width: 40px; height: 20px;"></div>
          <small>0-4</small>
        </div>
        <div style="text-align: center;">
          <div style="background: #3498db; width: 40px; height: 60px;"></div>
          <small>5-6</small>
        </div>
        <div style="text-align: center;">
          <div style="background: #3498db; width: 40px; height: 120px;"></div>
          <small>7-8</small>
        </div>
        <div style="text-align: center;">
          <div style="background: #3498db; width: 40px; height: 180px;"></div>
          <small>9-10</small>
        </div>
      </div>
    </div>
    
    <div class="card">
      <h2 class="card-title">Course Comparison</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Students</th>
            <th>Avg Grade</th>
            <th>Pass Rate</th>
            <th>Finalized</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Software as a Service</td>
            <td>45</td>
            <td>8.2</td>
            <td>95%</td>
            <td><span class="badge badge-open">In Progress</span></td>
          </tr>
          <tr>
            <td>Algorithms</td>
            <td>68</td>
            <td>7.5</td>
            <td>88%</td>
            <td><span class="badge badge-final">Completed</span></td>
          </tr>
          <tr>
            <td>Databases</td>
            <td>43</td>
            <td>7.9</td>
            <td>93%</td>
            <td><span class="badge badge-final">Completed</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Debug Section for API Response -->
    <div class="card" style="margin-top: 2rem;">
      <h3>API Response Debug</h3>
      <pre id="api-response" style="background: #f4f4f4; padding: 1rem; border-radius: 4px; overflow-x: auto;">
        Click "Fetch Latest Statistics" to see the API response
      </pre>
    </div>
  `
}

async function fetchStatistics() {
  const loadingDiv = document.getElementById('stats-loading')
  const errorDiv = document.getElementById('stats-error')
  const apiStatsDiv = document.getElementById('api-stats')
  const defaultStatsDiv = document.getElementById('default-stats')
  const responseDiv = document.getElementById('api-response')
  
  // Show loading
  loadingDiv.style.display = 'block'
  errorDiv.style.display = 'none'
  apiStatsDiv.style.display = 'none'
  
  try {
    // Make the API call
    // Using POST method as mentioned
    const response = await statsAPI.getExamStats({
      student_id: 1,
      examination_id: 4
    })
    
    // Display the raw response for debugging
    responseDiv.textContent = JSON.stringify(response, null, 2)
    
    // Update the UI with the response data
    document.getElementById('api-students-passed').textContent = response.students_passed
    document.getElementById('api-pass-rate').textContent = response.pass_rate
    document.getElementById('api-exam-id').textContent = response.examination_id
    document.getElementById('api-student-id').textContent = response.student_id
    
    // Render the distribution chart
    renderDistributionChart(response.distribution)
    
    // Show API stats and hide default stats
    apiStatsDiv.style.display = 'block'
    defaultStatsDiv.style.display = 'none'
    
  } catch (error) {
    console.error('Error fetching statistics:', error)
    errorDiv.textContent = `Error: ${error.message}`
    errorDiv.style.display = 'block'
    
    // Show error in debug section
    responseDiv.textContent = `Error: ${error.message}\n\nMake sure your backend is running and the endpoint is available.`
  } finally {
    loadingDiv.style.display = 'none'
  }
}

function renderDistributionChart(distribution) {
  const chartDiv = document.getElementById('distribution-chart')
  
  // Find the maximum value for scaling
  const maxValue = Math.max(...Object.values(distribution))
  const maxHeight = 250 // pixels
  
  // Clear existing chart
  chartDiv.innerHTML = ''
  
  // Create bars for each grade
  Object.entries(distribution).forEach(([grade, count]) => {
    const barHeight = maxValue > 0 ? (count / maxValue) * maxHeight : 0
    
    const barContainer = document.createElement('div')
    barContainer.style.cssText = 'text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; flex: 1;'
    
    // Count label
    const countLabel = document.createElement('div')
    countLabel.textContent = count
    countLabel.style.cssText = 'margin-bottom: 5px; font-weight: bold; color: #2c3e50;'
    
    // Bar
    const bar = document.createElement('div')
    bar.style.cssText = `
      background: ${getBarColor(parseInt(grade))};
      width: 40px;
      height: ${barHeight}px;
      transition: height 0.3s ease;
      border-radius: 4px 4px 0 0;
    `
    
    // Grade label
    const gradeLabel = document.createElement('small')
    gradeLabel.textContent = grade
    gradeLabel.style.cssText = 'margin-top: 5px;'
    
    barContainer.appendChild(countLabel)
    barContainer.appendChild(bar)
    barContainer.appendChild(gradeLabel)
    
    chartDiv.appendChild(barContainer)
  })
}

function getBarColor(grade) {
  if (grade < 5) return '#e74c3c'  // Red for failing grades
  if (grade < 7) return '#f39c12'  // Orange for passing but low
  if (grade < 9) return '#3498db'  // Blue for good
  return '#27ae60'  // Green for excellent
}

function renderCharts() {
  // This is where you could integrate a real charting library
  // For now, we're using CSS-based charts
}

// Alternative: Direct fetch without API service (for testing)
window.testDirectFetch = async function() {
  try {
    const response = await fetch('/statistics/stat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student_id: 1,
        examination_id: "4"
      })
    })
    
    const data = await response.json()
    console.log('Direct fetch response:', data)
    
    // Update debug display
    document.getElementById('api-response').textContent = JSON.stringify(data, null, 2)
    
    return data
  } catch (error) {
    console.error('Direct fetch error:', error)
  }
}