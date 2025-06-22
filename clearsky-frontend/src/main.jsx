import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import './styles/main.css'
import { authAPI } from './services/api'

// Import all components
import UserManagement from './components/UserManagement'
import Dashboard from './components/Dashboard'
import GradeUpload from './components/GradeUpload'
import GradeView from './components/GradeView'
import ReviewRequests from './components/ReviewRequests'
import ReviewManagement from './components/ReviewManagement'
import Statistics from './components/Statistics'
import InstitutionManagement from './components/InstitutionManagement'
import CreditManagement from './components/CreditManagement'

// Navigation Component
function Navigation({ user, onLogout }) {
  if (!user) return null

  const userRole = user?.role

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-logo">
          ClearSKY
        </Link>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>

          {/* Student specific links */}
          {userRole === 'STUDENT' && (
            <>
              <Link to="/grades" className="nav-link">
                My Grades
              </Link>
              <Link to="/statistics" className="nav-link">
                Statistics
              </Link>
              <Link to="/review-requests" className="nav-link">
                Review Requests
              </Link>
            </>
          )}

          {/* Instructor specific links */}
          {userRole === 'INSTRUCTOR' && (
            <>
              <Link to="/upload" className="nav-link">
                Upload Grades
              </Link>
              <Link to="/reviews" className="nav-link">
                Review Management
              </Link>
              <Link to="/statistics" className="nav-link">
                Statistics
              </Link>
            </>
          )}

          {/* Representative specific links */}
          {userRole === 'REPRESENTATIVE' && (
            <>
              <Link to="/institutions" className="nav-link">
                Institutions
              </Link>
              <Link to="/credits" className="nav-link">
                Credits
              </Link>
            </>
          )}

          {/* Admin/Management links (available to all) */}
          <div className="nav-dropdown">
            <button className="nav-link dropdown-toggle">
              Management ▼
            </button>
            <div className="dropdown-content">
              <Link to="/institutions" className="dropdown-link">
                Institutions
              </Link>
              <Link to="/credits" className="dropdown-link">
                Credits
              </Link>
              <Link to="/user-management" className="dropdown-link">
                User Registration
              </Link>
            </div>
          </div>

          <div className="user-info">
            <span className="user-role">{userRole}</span>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Protected Route Component
function ProtectedRoute({ children, user, requiredRole = null }) {
  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

// Main App Component
function App() {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('clearsky_auth_token')
    const userData = localStorage.getItem('clearsky_user')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing user data:', error)
        handleLogout()
      }
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    authAPI.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    )
  }

  return (
    <Router>
      <div className="app">
        <Navigation user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <UserManagement onLoginSuccess={handleLoginSuccess} />
                )
              } 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute user={user}>
                  <Dashboard user={user} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/upload" 
              element={
                <ProtectedRoute user={user} requiredRole="INSTRUCTOR">
                  <GradeUpload />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/grades" 
              element={
                <ProtectedRoute user={user} requiredRole="STUDENT">
                  <GradeView />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/review-requests" 
              element={
                <ProtectedRoute user={user} requiredRole="STUDENT">
                  <ReviewRequests />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/reviews" 
              element={
                <ProtectedRoute user={user} requiredRole="INSTRUCTOR">
                  <ReviewManagement />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/statistics" 
              element={
                <ProtectedRoute user={user}>
                  <Statistics />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/institutions" 
              element={
                <ProtectedRoute user={user}>
                  <InstitutionManagement />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/credits" 
              element={
                <ProtectedRoute user={user}>
                  <CreditManagement />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/user-management" 
              element={
                <ProtectedRoute user={user}>
                  <UserManagement />
                </ProtectedRoute>
              } 
            />
            
            {/* Default redirects */}
            <Route 
              path="/" 
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            {/* 404 Route */}
            <Route 
              path="*" 
              element={
                <div className="not-found">
                  <h1>404 - Page Not Found</h1>
                  <Link to="/dashboard">Go to Dashboard</Link>
                </div>
              } 
            />
          </Routes>
        </main>

        <style jsx>{`
          .app {
            min-height: 100vh;
            background: #f5f5f5;
          }

          .navbar {
            background: white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
          }

          .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 60px;
          }

          .nav-logo {
            color: #007bff;
            margin: 0;
            font-size: 1.5rem;
            font-weight: bold;
            text-decoration: none;
          }

          .nav-links {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .nav-link {
            padding: 0.5rem 1rem;
            border-radius: 4px;
            font-weight: 500;
            color: #333;
            text-decoration: none;
            transition: all 0.2s;
          }

          .nav-link:hover {
            background: #f8f9fa;
            color: #007bff;
          }

          .nav-dropdown {
            position: relative;
            display: inline-block;
          }

          .dropdown-toggle {
            background: none;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            color: #333;
          }

          .dropdown-content {
            display: none;
            position: absolute;
            background: white;
            min-width: 180px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            border-radius: 4px;
            z-index: 1;
            right: 0;
            top: 100%;
            margin-top: 5px;
          }

          .nav-dropdown:hover .dropdown-content {
            display: block;
          }

          .dropdown-link {
            display: block;
            padding: 0.75rem 1rem;
            color: #333;
            text-decoration: none;
            transition: background-color 0.2s;
          }

          .dropdown-link:hover {
            background: #f8f9fa;
          }

          .user-info {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-left: 1rem;
            padding-left: 1rem;
            border-left: 1px solid #ddd;
          }

          .user-role {
            font-size: 0.9rem;
            color: #666;
            font-weight: 500;
            padding: 0.25rem 0.5rem;
            background: #e9ecef;
            border-radius: 12px;
          }

          .logout-btn {
            background: #dc3545;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s;
          }

          .logout-btn:hover {
            background: #c82333;
          }

          .main-content {
            min-height: calc(100vh - 60px);
          }

          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }

          .loading-spinner {
            font-size: 1.2rem;
            color: #007bff;
          }

          .not-found {
            text-align: center;
            padding: 4rem 2rem;
          }

          .not-found h1 {
            margin-bottom: 1rem;
            color: #333;
          }

          .not-found a {
            color: #007bff;
            text-decoration: none;
          }

          @media (max-width: 768px) {
            .nav-container {
              padding: 0 1rem;
            }

            .nav-links {
              flex-wrap: wrap;
              gap: 0.5rem;
            }

            .user-info {
              margin-left: 0.5rem;
              padding-left: 0.5rem;
            }

            .nav-link {
              padding: 0.25rem 0.5rem;
              font-size: 0.9rem;
            }
          }
        `}</style>
      </div>
    </Router>
  )
}

// Mount the React app
const container = document.getElementById('app')
const root = createRoot(container)
root.render(<App />)