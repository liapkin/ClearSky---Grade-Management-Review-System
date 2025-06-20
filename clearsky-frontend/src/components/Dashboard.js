import { getCurrentUser, getUserRole } from '../utils/auth.js'

export default function Dashboard() {
  const user = getCurrentUser()
  const role = getUserRole()
  
  // Attach event listeners after render
  setTimeout(() => {
    document.querySelectorAll('.dashboard-card').forEach(card => {
      card.addEventListener('click', () => {
        const link = card.dataset.link
        if (link) window.location.href = link
      })
    })
  }, 0)
  
  return `
    <div class="card">
      <div style="display: flex; align-items: center; gap: 1rem;">
        ${user.picture ? `<img src="${user.picture}" alt="${user.name}" style="width: 50px; height: 50px; border-radius: 50%;">` : ''}
        <div>
          <h1 class="card-title" style="margin-bottom: 0.25rem;">Welcome, ${user.name}!</h1>
          <p style="margin: 0;">Institution: ${user.institution} | Role: ${user.role}</p>
          ${user.authMethod === 'google' ? '<p style="margin: 0; font-size: 0.875rem; color: #7f8c8d;">Signed in with Google</p>' : ''}
        </div>
      </div>
    </div>
    
    <h2 style="margin-bottom: 1rem;">Quick Actions</h2>
    <div class="dashboard-grid">
      ${getDashboardCards(role)}
    </div>
    
    ${getRecentActivity(role)}
  `
}

function getDashboardCards(role) {
  const cards = {
    student: `
      <div class="dashboard-card" data-link="/grades">
        <h3>📊 My Grades</h3>
        <p>View your grades and submit review requests</p>
      </div>
      <div class="dashboard-card" data-link="/statistics">
        <h3>📈 Course Statistics</h3>
        <p>View grade distributions for all courses</p>
      </div>
    `,
    instructor: `
      <div class="dashboard-card" data-link="/upload">
        <h3>📤 Upload Grades</h3>
        <p>Upload initial or final grades</p>
      </div>
      <div class="dashboard-card" data-link="/reviews">
        <h3>📝 Review Requests</h3>
        <p>Manage student grade review requests</p>
      </div>
      <div class="dashboard-card" data-link="/statistics">
        <h3>📈 Grade Statistics</h3>
        <p>View grade distributions</p>
      </div>
    `,
    institution: `
      <div class="dashboard-card" data-link="/statistics">
        <h3>📊 Institution Statistics</h3>
        <p>View grade statistics across all courses</p>
      </div>
      <div class="dashboard-card">
        <h3>💳 Credits</h3>
        <p>Remaining credits: 50</p>
      </div>
      <div class="dashboard-card">
        <h3>👥 User Management</h3>
        <p>Manage instructors and students</p>
      </div>
    `
  }
  
  return cards[role] || ''
}

function getRecentActivity(role) {
  const activities = {
    student: `
      <div class="card" style="margin-top: 2rem;">
        <h2 class="card-title">Recent Activity</h2>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Action</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Software Engineering</td>
                <td>Grade Published</td>
                <td>2025-03-15</td>
                <td><span class="badge badge-open">Open</span></td>
              </tr>
              <tr>
                <td>Algorithms</td>
                <td>Review Request Submitted</td>
                <td>2025-03-14</td>
                <td><span class="badge badge-open">Pending</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
    instructor: `
      <div class="card" style="margin-top: 2rem;">
        <h2 class="card-title">Recent Activity</h2>
        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-value">3</div>
            <div class="stat-label">Pending Reviews</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">2</div>
            <div class="stat-label">Active Courses</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">156</div>
            <div class="stat-label">Total Students</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">85%</div>
            <div class="stat-label">Grades Finalized</div>
          </div>
        </div>
      </div>
    `,
    institution: `
      <div class="card" style="margin-top: 2rem;">
        <h2 class="card-title">Institution Overview</h2>
        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-value">24</div>
            <div class="stat-label">Active Courses</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">1,245</div>
            <div class="stat-label">Total Students</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">87</div>
            <div class="stat-label">Instructors</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">92%</div>
            <div class="stat-label">System Usage</div>
          </div>
        </div>
      </div>
    `
  }
  
  return activities[role] || ''
}