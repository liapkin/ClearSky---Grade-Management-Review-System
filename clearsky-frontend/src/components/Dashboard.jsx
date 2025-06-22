import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userAPI } from '../services/api'

function Dashboard({ user }) {
  const navigate = useNavigate()
  const [userDetails, setUserDetails] = useState(null)

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) return
      
      try {
        let details = null
        
        if (user.role === 'STUDENT' && user.studentId) {
          details = await userAPI.getStudent(user.studentId)
        } else if (user.role === 'INSTRUCTOR' && user.teacherId) {
          details = await userAPI.getInstructor(user.teacherId)
        }
        
        if (details) {
          setUserDetails(details)
          console.log('Fetched user details:', details)
        }
      } catch (error) {
        console.warn('Could not fetch user details:', error.message)
        // Fallback to basic user data
        setUserDetails(user)
      }
    }
    
    fetchUserDetails()
  }, [user])

  if (!user) {
    return (
      <div className="dashboard">
        <div className="card">
          <h1>Welcome to ClearSKY</h1>
          <p>Please login to access your dashboard.</p>
        </div>
      </div>
    )
  }

  const role = user.role
  
  const getQuickActions = () => {
    switch (role) {
      case 'STUDENT':
        return [
          { title: 'View My Grades', description: 'Check your current grades and performance', icon: '📊', action: 'grades' },
          { title: 'Statistics', description: 'View examination statistics and trends', icon: '📈', action: 'statistics' },
          { title: 'Review Requests', description: 'Submit review requests for your grades', icon: '📝', action: 'reviews' }
        ]
      case 'INSTRUCTOR':
        return [
          { title: 'Upload Grades', description: 'Upload and manage student grades', icon: '📤', action: 'upload' },
          { title: 'Review Management', description: 'Respond to student review requests', icon: '⚖️', action: 'reviews' },
          { title: 'Statistics', description: 'View course and student statistics', icon: '📈', action: 'statistics' }
        ]
      case 'REPRESENTATIVE':
        return [
          { title: 'Institution Management', description: 'Manage institution settings and users', icon: '🏛️', action: 'institutions' },
          { title: 'Credit Management', description: 'Purchase and manage credits', icon: '💳', action: 'credits' }
        ]
      default:
        return [
          { title: 'Institution Management', description: 'View and manage institutions', icon: '🏛️', action: 'institutions' },
          { title: 'User Registration', description: 'Register new users', icon: '👥', action: 'user-management' }
        ]
    }
  }

  const handleActionClick = (action) => {
    // Map actions to actual route paths
    const routeMapping = {
      'grades': '/grades',
      'statistics': '/statistics',
      'reviews': role === 'STUDENT' ? '/review-requests' : '/reviews',
      'upload': '/upload',
      'institutions': '/institutions',
      'credits': '/credits',
      'user-management': '/user-management'
    }
    
    const targetRoute = routeMapping[action]
    if (targetRoute) {
      navigate(targetRoute)
    } else {
      console.warn('Unknown action:', action)
    }
  }

  return (
    <div className="dashboard">
      <div className="welcome-card">
        <div className="user-info">
          <div className="user-details">
            <h1>Welcome, {userDetails?.name && userDetails?.surname ? `${userDetails.name} ${userDetails.surname}` : userDetails?.name || user.name || user.sub || 'User'}!</h1>
            <p className="user-meta">Role: {role}</p>
            {user.teacherId && <p className="user-meta">Teacher ID: {user.teacherId}</p>}
            {user.studentId && (
              <div className="student-info">
                <p className="user-meta">Student ID: {user.studentId}</p>
                {userDetails?.am && <p className="user-meta">AM: {userDetails.am}</p>}
              </div>
            )}
            {(userDetails?.email || user.email) && <p className="user-meta">📧 {userDetails?.email || user.email}</p>}
          </div>
        </div>
      </div>

      <h2>Quick Actions</h2>
      <div className="dashboard-grid">
        {getQuickActions().map((action, index) => (
          <div 
            key={index} 
            className="dashboard-card" 
            onClick={() => handleActionClick(action.action)}
          >
            <div className="card-icon">{action.icon}</div>
            <h3>{action.title}</h3>
            <p>{action.description}</p>
          </div>
        ))}
      </div>

      <div className="system-status">
        <h2>System Status</h2>
        <div className="status-grid">
          <div className="status-item">
            <div className="status-label">Microservices</div>
            <div className="status-value online">5 Online</div>
          </div>
          <div className="status-item">
            <div className="status-label">Database</div>
            <div className="status-value online">Connected</div>
          </div>
          <div className="status-item">
            <div className="status-label">Message Queue</div>
            <div className="status-value online">Active</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .welcome-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-details h1 {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
          font-weight: 600;
        }

        .user-meta {
          margin: 0.25rem 0;
          opacity: 0.9;
          font-size: 1rem;
        }

        .student-info {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .student-info .user-meta {
          margin: 0.25rem 0;
        }

        h2 {
          color: #333;
          margin: 2rem 0 1rem 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .dashboard-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid #e0e0e0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .dashboard-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border-color: #007bff;
        }

        .card-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .dashboard-card h3 {
          margin: 0 0 0.5rem 0;
          color: #333;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .dashboard-card p {
          margin: 0;
          color: #666;
          line-height: 1.5;
        }

        .system-status {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .system-status h2 {
          margin-top: 0;
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .status-label {
          font-weight: 500;
          color: #555;
        }

        .status-value {
          font-weight: 600;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.9rem;
        }

        .status-value.online {
          background: #d4edda;
          color: #155724;
        }

        .status-value.offline {
          background: #f8d7da;
          color: #721c24;
        }

        @media (max-width: 768px) {
          .dashboard {
            padding: 1rem;
          }

          .welcome-card {
            padding: 1.5rem;
          }

          .user-details h1 {
            font-size: 1.5rem;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .dashboard-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}

export default Dashboard