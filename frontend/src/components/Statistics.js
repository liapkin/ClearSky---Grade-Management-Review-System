export default function Statistics() {
    // Simple chart rendering after component loads
    setTimeout(() => {
      renderCharts()
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
    `
  }
  
  function renderCharts() {
    
  }