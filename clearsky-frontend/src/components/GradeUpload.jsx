import React, { useState, useEffect } from 'react'
import { gradesAPI } from '../services/api'

function GradeUpload() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [uploadResponse, setUploadResponse] = useState(null)
  const [examinations, setExaminations] = useState([])
  const [userRole, setUserRole] = useState(null)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    // Get user info from localStorage
    const userData = JSON.parse(localStorage.getItem('clearsky_user') || '{}')
    setUserRole(userData.role)
    setUserId(userData.teacherId || userData.sub)
    
    if (userData.role === 'INSTRUCTOR' && userData.teacherId) {
      loadInstructorExaminations(userData.teacherId)
    }
  }, [])

  const loadInstructorExaminations = async (instructorId) => {
    try {
      const response = await gradesAPI.getInstructorExaminations(instructorId, 'teacher')
      setExaminations(Array.isArray(response) ? response : [])
    } catch (error) {
      console.error('Failed to load examinations:', error)
      setExaminations([])
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setMessage('')
    setUploadResponse(null)
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    
    if (!file) {
      setMessage('Please select a file to upload.')
      return
    }

    if (userRole !== 'INSTRUCTOR') {
      setMessage('Only instructors can upload grades.')
      return
    }

    setUploading(true)
    setMessage('')
    setUploadResponse(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await gradesAPI.uploadGrades(formData)
      
      setUploadResponse(response)
      setMessage('File uploaded successfully! Please review the details below.')
      
    } catch (error) {
      setMessage('Upload failed: ' + error.message)
      setUploadResponse(null)
    } finally {
      setUploading(false)
    }
  }

  const handleConfirm = async () => {
    if (!uploadResponse?.uid) return

    setUploading(true)
    setMessage('')

    try {
      const response = await gradesAPI.confirmGrades(uploadResponse.uid)
      
      if (response.success) {
        setMessage('Grades confirmed and saved successfully!')
        setUploadResponse(null)
        setFile(null)
        document.getElementById('file-input').value = ''
        
        // Reload examinations to show the new one
        if (userId) {
          loadInstructorExaminations(userId)
        }
      }
    } catch (error) {
      setMessage('Confirmation failed: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = async () => {
    if (!uploadResponse?.uid) return

    setUploading(true)
    setMessage('')

    try {
      const response = await gradesAPI.cancelUpload(uploadResponse.uid)
      
      if (response.success) {
        setMessage('Upload cancelled successfully.')
        setUploadResponse(null)
        setFile(null)
        document.getElementById('file-input').value = ''
      }
    } catch (error) {
      setMessage('Cancellation failed: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const testConnection = async () => {
    setMessage('Testing connection...')
    try {
      const response = await gradesAPI.test()
      setMessage('Connection test successful: ' + JSON.stringify(response))
    } catch (error) {
      setMessage('Connection test failed: ' + error.message)
    }
  }

  if (userRole !== 'INSTRUCTOR') {
    return (
      <div className="grade-upload">
        <div className="access-denied">
          <h1>Access Denied</h1>
          <p>Only instructors can upload grades. Please login as an instructor to access this feature.</p>
        </div>

        <style jsx>{`
          .grade-upload {
            max-width: 800px;
            margin: 2rem auto;
            padding: 2rem;
          }

          .access-denied {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 8px;
            padding: 2rem;
            text-align: center;
            color: #721c24;
          }

          .access-denied h1 {
            margin: 0 0 1rem 0;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="grade-upload">
      <h1>Upload Grades</h1>
      
      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="upload-section">
        <div className="card">
          <h2>Upload Excel File</h2>
          <form onSubmit={handleUpload}>
            <div className="form-group">
              <label htmlFor="file-input">Excel File (.xlsx):</label>
              <input
                type="file"
                id="file-input"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={uploading}
                required
              />
              {file && (
                <div className="file-info">
                  Selected: {file.name} ({Math.round(file.size / 1024)} KB)
                </div>
              )}
            </div>

            <button type="submit" disabled={uploading || !file} className="btn btn-primary">
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>
            
            <button type="button" onClick={testConnection} className="btn btn-secondary">
              Test Connection
            </button>
          </form>
        </div>

        {uploadResponse && (
          <div className="card upload-preview">
            <h2>Upload Preview</h2>
            <div className="preview-details">
              <div className="detail-item">
                <strong>Course:</strong> {uploadResponse.course}
              </div>
              <div className="detail-item">
                <strong>Period:</strong> {uploadResponse.period}
              </div>
              <div className="detail-item">
                <strong>Number of Grades:</strong> {uploadResponse.number_grades}
              </div>
              <div className="detail-item">
                <strong>Upload ID:</strong> {uploadResponse.uid}
              </div>
            </div>
            
            <div className="preview-actions">
              <button 
                onClick={handleConfirm} 
                disabled={uploading}
                className="btn btn-success"
              >
                {uploading ? 'Confirming...' : 'Confirm Upload'}
              </button>
              <button 
                onClick={handleCancel} 
                disabled={uploading}
                className="btn btn-danger"
              >
                {uploading ? 'Cancelling...' : 'Cancel Upload'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="examinations-section">
        <div className="card">
          <h2>Your Examinations</h2>
          {examinations.length === 0 ? (
            <p>No examinations found. Upload grades to create your first examination.</p>
          ) : (
            <div className="examinations-list">
              <h3>Courses you've uploaded grades for:</h3>
              <ul>
                {examinations.map((course, index) => (
                  <li key={index}>{course}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .grade-upload {
          max-width: 1000px;
          margin: 2rem auto;
          padding: 2rem;
        }

        .card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .card h2 {
          margin: 0 0 1.5rem 0;
          color: #333;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .form-group input[type="file"] {
          width: 100%;
          padding: 0.75rem;
          border: 2px dashed #ddd;
          border-radius: 4px;
          background: #f8f9fa;
        }

        .file-info {
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: #e7f3ff;
          border-radius: 4px;
          font-size: 0.9rem;
          color: #0066cc;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          font-size: 1rem;
          margin-right: 1rem;
          transition: background-color 0.2s;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-success {
          background: #28a745;
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

        .upload-preview {
          border: 2px solid #28a745;
        }

        .preview-details {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1.5rem;
        }

        .detail-item {
          margin-bottom: 0.5rem;
        }

        .preview-actions {
          display: flex;
          gap: 1rem;
        }

        .examinations-list h3 {
          margin: 0 0 1rem 0;
          color: #555;
        }

        .examinations-list ul {
          list-style-type: none;
          padding: 0;
        }

        .examinations-list li {
          background: #f8f9fa;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          border-radius: 4px;
          border-left: 4px solid #007bff;
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
      `}</style>
    </div>
  )
}

export default GradeUpload