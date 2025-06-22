import React, { useState, useEffect } from 'react'
import { userAPI, institutionAPI } from '../services/api'
import { mapInstitutionResponse } from '../utils/responseMappers'

function UserManagement({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('login')
  const [institutions, setInstitutions] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: ''
  })
  
  // Registration form state
  const [registerData, setRegisterData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    institution_id: '',
    role: 'student'
  })

  useEffect(() => {
    loadInstitutions()
  }, [])

  const loadInstitutions = async () => {
    try {
      const response = await institutionAPI.getAllInstitutions()
      setInstitutions(mapInstitutionResponse(response))
    } catch (error) {
      console.error('Failed to load institutions:', error)
      setInstitutions([])
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      const response = await userAPI.login(loginData.email)
      
      if (response.token) {
        localStorage.setItem('clearsky_auth_token', response.token)
        
        // Decode JWT to get user info (simple base64 decode for demo)
        const payload = JSON.parse(atob(response.token.split('.')[1]))
        localStorage.setItem('clearsky_user', JSON.stringify(payload))
        
        setMessage('Login successful! Redirecting...')
        
        if (onLoginSuccess) {
          setTimeout(() => {
            onLoginSuccess(payload)
          }, 1000)
        } else {
          setTimeout(() => {
            window.location.reload() // Fallback for when used standalone
          }, 1000)
        }
      }
    } catch (error) {
      setMessage('Login failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      const userData = {
        first_name: registerData.first_name,
        last_name: registerData.last_name,
        email: registerData.email,
        institution_id: parseInt(registerData.institution_id)
      }
      
      const response = await userAPI.register(userData, registerData.role)
      
      if (response.success) {
        setMessage('Registration successful! You can now login.')
        setActiveTab('login')
        setRegisterData({
          first_name: '',
          last_name: '',
          email: '',
          institution_id: '',
          role: 'student'
        })
      }
    } catch (error) {
      setMessage('Registration failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLoginInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    })
  }

  const handleRegisterInputChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="user-management">
      <div className="auth-container">
        <div className="auth-tabs">
          <button 
            className={`tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button 
            className={`tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {activeTab === 'login' && (
          <div className="auth-form">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginInputChange}
                  required
                  disabled={loading}
                />
              </div>
              
              <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'register' && (
          <div className="auth-form">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="role">Role:</label>
                <select
                  id="role"
                  name="role"
                  value={registerData.role}
                  onChange={handleRegisterInputChange}
                  required
                  disabled={loading}
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="representative">Representative</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="first_name">First Name:</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={registerData.first_name}
                  onChange={handleRegisterInputChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="last_name">Last Name:</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={registerData.last_name}
                  onChange={handleRegisterInputChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterInputChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="institution_id">Institution:</label>
                <select
                  id="institution_id"
                  name="institution_id"
                  value={registerData.institution_id}
                  onChange={handleRegisterInputChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Institution</option>
                  {institutions.map((institution) => (
                    <option key={institution.id} value={institution.id}>
                      {institution.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <button type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
          </div>
        )}
      </div>

      <style jsx>{`
        .user-management {
          max-width: 500px;
          margin: 2rem auto;
          padding: 2rem;
        }

        .auth-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .auth-tabs {
          display: flex;
          background: #f5f5f5;
        }

        .tab {
          flex: 1;
          padding: 1rem;
          border: none;
          background: transparent;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .tab:hover {
          background: #e0e0e0;
        }

        .tab.active {
          background: white;
          border-bottom: 2px solid #007bff;
        }

        .auth-form {
          padding: 2rem;
        }

        .auth-form h2 {
          margin: 0 0 1.5rem 0;
          color: #333;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #555;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        button[type="submit"] {
          width: 100%;
          padding: 0.75rem;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        button[type="submit"]:hover:not(:disabled) {
          background: #0056b3;
        }

        button[type="submit"]:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .message {
          padding: 1rem;
          margin: 1rem 2rem;
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
      `}</style>
    </div>
  )
}

export default UserManagement