import React, { useState, useEffect } from 'react'
import { institutionAPI, userAPI } from '../services/api'

function InstitutionManagement() {
  const [institutions, setInstitutions] = useState([])
  const [selectedInstitution, setSelectedInstitution] = useState(null)
  const [institutionUsers, setInstitutionUsers] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('list')
  
  // New institution form
  const [newInstitution, setNewInstitution] = useState({
    name: '',
    address: '',
    contactEmail: ''
  })

  useEffect(() => {
    loadInstitutions()
  }, [])

  const loadInstitutions = async () => {
    setLoading(true)
    try {
      const response = await institutionAPI.getAllInstitutions()
      // API returns single institution object, convert to array
      if (response && response.id) {
        setInstitutions([response])
      } else if (Array.isArray(response)) {
        setInstitutions(response)
      } else {
        setInstitutions([])
      }
    } catch (error) {
      setMessage('Failed to load institutions: ' + error.message)
      setInstitutions([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInstitution = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      const response = await institutionAPI.createInstitution(
        newInstitution.name,
        newInstitution.address || null,
        newInstitution.contactEmail || null
      )
      
      setMessage('Institution created successfully!')
      setNewInstitution({ name: '', address: '', contactEmail: '' })
      loadInstitutions()
      setActiveTab('list')
    } catch (error) {
      setMessage('Failed to create institution: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteInstitution = async (institutionId) => {
    if (!confirm('Are you sure you want to delete this institution?')) return
    
    setLoading(true)
    setMessage('')
    
    try {
      await institutionAPI.deleteInstitution(institutionId)
      setMessage('Institution deleted successfully!')
      loadInstitutions()
      setSelectedInstitution(null)
      setInstitutionUsers(null)
    } catch (error) {
      setMessage('Failed to delete institution: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleViewInstitution = async (institution) => {
    setSelectedInstitution(institution)
    setLoading(true)
    setMessage('')
    
    try {
      // Load institution details
      const institutionDetails = await institutionAPI.getInstitution(institution.id)
      setSelectedInstitution(institutionDetails)
      
      // Load institution users
      const users = await userAPI.getInstitutionUsers(institution.id)
      setInstitutionUsers(users.data || users)
    } catch (error) {
      setMessage('Failed to load institution details: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setNewInstitution({
      ...newInstitution,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="institution-management">
      <h1>Institution Management</h1>
      
      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Institution List
        </button>
        <button 
          className={`tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Institution
        </button>
      </div>

      {activeTab === 'list' && (
        <div className="tab-content">
          <h2>Institutions</h2>
          {loading && <div className="loading">Loading...</div>}
          
          <div className="institutions-grid">
            <div className="institutions-list">
              <h3>All Institutions</h3>
              {institutions.length === 0 ? (
                <p>No institutions found.</p>
              ) : (
                <div className="institution-cards">
                  {institutions.map((institution) => (
                    <div key={institution.id} className="institution-card">
                      <h4>{institution.name}</h4>
                      <p>Credits: {institution.tokens || 0}</p>
                      <div className="card-actions">
                        <button 
                          onClick={() => handleViewInstitution(institution)}
                          className="btn btn-info"
                        >
                          View Details
                        </button>
                        <button 
                          onClick={() => handleDeleteInstitution(institution.id)}
                          className="btn btn-danger"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedInstitution && (
              <div className="institution-details">
                <h3>Institution Details</h3>
                <div className="details-card">
                  <h4>{selectedInstitution.name}</h4>
                  <p><strong>ID:</strong> {selectedInstitution.id}</p>
                  <p><strong>Credits:</strong> {selectedInstitution.tokens || 0}</p>
                  
                  {institutionUsers && (
                    <div className="users-section">
                      <h5>Users</h5>
                      
                      {institutionUsers.teachers && institutionUsers.teachers.length > 0 && (
                        <div className="user-group">
                          <h6>Instructors ({institutionUsers.teachers.length})</h6>
                          <ul>
                            {institutionUsers.teachers.map((teacher) => (
                              <li key={teacher.id}>
                                {teacher.name} {teacher.surname} - {teacher.email}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {institutionUsers.students && institutionUsers.students.length > 0 && (
                        <div className="user-group">
                          <h6>Students ({institutionUsers.students.length})</h6>
                          <ul>
                            {institutionUsers.students.map((student) => (
                              <li key={student.id}>
                                {student.name} {student.surname} - {student.email}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {institutionUsers.representatives && institutionUsers.representatives.length > 0 && (
                        <div className="user-group">
                          <h6>Representatives ({institutionUsers.representatives.length})</h6>
                          <ul>
                            {institutionUsers.representatives.map((rep) => (
                              <li key={rep.id}>
                                {rep.name} {rep.surname} - {rep.email}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="tab-content">
          <h2>Create New Institution</h2>
          <form onSubmit={handleCreateInstitution} className="create-form">
            <div className="form-group">
              <label htmlFor="name">Institution Name (Required):</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newInstitution.name}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address (Optional):</label>
              <input
                type="text"
                id="address"
                name="address"
                value={newInstitution.address}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactEmail">Contact Email (Optional):</label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={newInstitution.contactEmail}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Creating...' : 'Create Institution'}
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        .institution-management {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 2rem;
        }

        .tabs {
          display: flex;
          border-bottom: 1px solid #ddd;
          margin-bottom: 2rem;
        }

        .tab {
          padding: 1rem 2rem;
          border: none;
          background: none;
          cursor: pointer;
          font-weight: 500;
          border-bottom: 2px solid transparent;
        }

        .tab.active {
          border-bottom-color: #007bff;
          color: #007bff;
        }

        .institutions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .institution-cards {
          display: grid;
          gap: 1rem;
        }

        .institution-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1rem;
          background: white;
        }

        .institution-card h4 {
          margin: 0 0 0.5rem 0;
          color: #333;
        }

        .card-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .institution-details {
          border-left: 1px solid #ddd;
          padding-left: 2rem;
        }

        .details-card {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
        }

        .users-section {
          margin-top: 1.5rem;
        }

        .user-group {
          margin-bottom: 1rem;
        }

        .user-group h6 {
          margin: 0.5rem 0;
          color: #666;
        }

        .user-group ul {
          margin: 0;
          padding-left: 1.5rem;
        }

        .user-group li {
          margin-bottom: 0.25rem;
        }

        .create-form {
          max-width: 500px;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          text-decoration: none;
          display: inline-block;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-info {
          background: #17a2b8;
          color: white;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
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

        .loading {
          text-align: center;
          padding: 2rem;
          color: #666;
        }
      `}</style>
    </div>
  )
}

export default InstitutionManagement