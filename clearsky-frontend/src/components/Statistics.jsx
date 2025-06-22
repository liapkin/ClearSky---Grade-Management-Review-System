import React, { useState, useEffect } from 'react'
import { statisticsAPI, gradesAPI } from '../services/api'
import { mapStatisticsResponse, mapGradesResponse, extractUserContext } from '../utils/responseMappers'

function Statistics() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [userRole, setUserRole] = useState(null)
  const [userId, setUserId] = useState(null)
  const [examinations, setExaminations] = useState([])
  const [selectedExamination, setSelectedExamination] = useState('')
  const [studentGrades, setStudentGrades] = useState([])

  useEffect(() => {
    // Get user info from localStorage
    const userData = JSON.parse(localStorage.getItem('clearsky_user') || '{}')
    const userContext = extractUserContext(userData)
    
    setUserRole(userContext.role)
    setUserId(userContext.userId)
    
    if (userContext.role === 'STUDENT' && userContext.userId) {
      loadStudentData(userContext.userId)
    } else if (userContext.role === 'INSTRUCTOR' && userContext.userId) {
      loadInstructorData(userContext.userId)
    }
  }, [])

  const loadStudentData = async (studentId) => {
    try {
      // Try to get detailed grades first (which includes examination IDs)
      let detailedGrades = []
      let simpleGrades = []
      
      try {
        // Try the detailed grades endpoint first
        const detailedResponse = await fetch(`http://localhost:3002/grades/detailed?student_id=${studentId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('clearsky_auth_token') || localStorage.getItem('clearsky_token')}`
          }
        })
        
        if (detailedResponse.ok) {
          const detailedData = await detailedResponse.json()
          detailedGrades = detailedData.grades || []
          console.log('Detailed grades with examination IDs:', detailedGrades)
        }
      } catch (detailError) {
        console.warn('Detailed grades not available:', detailError.message)
      }
      
      // Also get simple grades for display
      const gradesResponse = await gradesAPI.getStudentGrades(studentId)
      const mappedGrades = mapGradesResponse(gradesResponse)
      setStudentGrades(mappedGrades.map(g => g.value)) // Extract just the values for summary display
      
      if (detailedGrades.length > 0) {
        // Use real examination IDs from detailed grades
        const uniqueExaminations = detailedGrades.reduce((acc, grade) => {
          const examId = grade.course?.id || grade.examination_id
          const examName = grade.course?.name || `Course ${examId}`
          
          if (examId && !acc.find(e => e.id === examId)) {
            acc.push({ id: examId, name: examName })
          }
          return acc
        }, [])
        
        setExaminations(uniqueExaminations)
        console.log('Loaded examinations with real IDs:', uniqueExaminations)
      } else {
        // Fallback: load course names and use indices
        try {
          const examResponse = await gradesAPI.getInstructorExaminations(studentId, 'student')
          const courseNames = Array.isArray(examResponse) ? examResponse : []
          
          setExaminations(courseNames.map((name, index) => ({
            id: index + 1,
            name: name
          })))
        } catch (examError) {
          console.warn('Could not load examinations:', examError.message)
          setExaminations([])
        }
      }
      
      // Load statistics without examination_id first
      await loadStatistics()
    } catch (error) {
      console.error('Failed to load student data:', error)
    }
  }

  const loadInstructorData = async (instructorId) => {
    try {
      // Load instructor's examinations
      const examResponse = await gradesAPI.getInstructorExaminations(instructorId, 'teacher')
      setExaminations(Array.isArray(examResponse) ? examResponse : [])
    } catch (error) {
      console.error('Failed to load instructor data:', error)
    }
  }

  const loadStatistics = async (examinationId = null) => {
    setLoading(true)
    setMessage('')
    
    try {
      // Add timeout to prevent hanging  
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout - service may be unavailable')), 10000)
      )
      
      const response = await Promise.race([
        statisticsAPI.getStats(examinationId),
        timeoutPromise
      ])
      
      setStats(mapStatisticsResponse(response))
      
      if (response.statistics && Array.isArray(response.statistics)) {
        setMessage(`Loaded statistics for ${response.statistics.length} examinations`)
      } else if (response.examination_id) {
        setMessage(`Loaded statistics for examination ${response.examination_id}`)
      } else {
        setMessage('Statistics loaded successfully!')
      }
    } catch (error) {
      if (error.message.includes('timeout')) {
        setMessage('Statistics service is currently unavailable. Please try again later.')
      } else {
        setMessage('Failed to load statistics: ' + error.message)
      }
      setStats(null)
    } finally {
      setLoading(false)
    }
  }

  const handleExaminationChange = (e) => {
    const examinationId = e.target.value
    setSelectedExamination(examinationId)
    
    if (examinationId) {
      loadStatistics(parseInt(examinationId))
    } else {
      loadStatistics()
    }
  }

  const getBarColor = (grade) => {
    if (grade < 5) return '#e74c3c'  // Red for failing grades
    if (grade < 7) return '#f39c12'  // Orange for passing but low
    if (grade < 9) return '#3498db'  // Blue for good
    return '#27ae60'  // Green for excellent
  }

  const renderDistributionChart = (distribution) => {
    if (!distribution) return null

    const maxValue = Math.max(...Object.values(distribution))
    const maxHeight = 200

    return (
      <div className="distribution-chart">
        {Object.entries(distribution).map(([grade, count]) => {
          const barHeight = maxValue > 0 ? (count / maxValue) * maxHeight : 0
          
          return (
            <div key={grade} className="bar-container">
              <div className="count-label">{count}</div>
              <div 
                className="bar" 
                style={{
                  height: `${barHeight}px`,
                  backgroundColor: getBarColor(parseInt(grade))
                }}
              />
              <div className="grade-label">{grade}</div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderStudentStats = () => {
    if (userRole !== 'STUDENT' || !stats) return null

    if (stats.statistics && Array.isArray(stats.statistics)) {
      // Multiple examinations statistics
      return (
        <div className="student-stats">
          <h2>📊 Your Course Performance Overview</h2>
          
          {/* Overall Summary Card */}
          <div className="summary-overview">
            <div className="overview-card">
              <div className="overview-header">
                <h3>📈 Overall Performance</h3>
                <span className="course-count">{stats.statistics.length} Courses</span>
              </div>
              <div className="overview-metrics">
                <div className="metric">
                  <span className="metric-value">{stats.statistics.filter(s => s.data && parseFloat(s.data.pass_rate) >= 50).length}</span>
                  <span className="metric-label">Courses Above 50% Pass Rate</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{Math.round(stats.statistics.reduce((sum, s) => sum + (s.data ? parseFloat(s.data.pass_rate) || 0 : 0), 0) / stats.statistics.length)}%</span>
                  <span className="metric-label">Average Pass Rate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Individual Course Cards */}
          <div className="courses-grid">
            {stats.statistics.map((examStat, index) => (
              <div key={index} className="course-card">
                <div className="course-header">
                  <div className="course-info">
                    <h3>📚 {examinations.find(e => e.id == examStat.examination_id)?.name || `Course ${examStat.examination_id}`}</h3>
                    <span className="course-id">Examination ID: {examStat.examination_id}</span>
                  </div>
                  {examStat.data && (
                    <div className={`pass-rate-badge ${parseFloat(examStat.data.pass_rate) >= 70 ? 'high' : parseFloat(examStat.data.pass_rate) >= 50 ? 'medium' : 'low'}`}>
                      {examStat.data.pass_rate}
                    </div>
                  )}
                </div>
                
                {examStat.data ? (
                  <div className="course-content">
                    <div className="main-stats">
                      <div className="stat-item">
                        <div className="stat-icon">👥</div>
                        <div className="stat-info">
                          <span className="stat-number">{examStat.data.students_passed}</span>
                          <span className="stat-text">Students Passed</span>
                        </div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-icon">📊</div>
                        <div className="stat-info">
                          <span className="stat-number">{examStat.data.pass_rate}</span>
                          <span className="stat-text">Pass Rate</span>
                        </div>
                      </div>
                    </div>
                    
                    {examStat.data.distribution && (
                      <div className="mini-distribution">
                        <h4>Grade Distribution</h4>
                        <div className="mini-chart">
                          {Object.entries(examStat.data.distribution).map(([grade, count]) => {
                            if (count === 0) return null
                            return (
                              <div key={grade} className="mini-bar">
                                <div 
                                  className="mini-bar-fill" 
                                  style={{
                                    height: `${(count / Math.max(...Object.values(examStat.data.distribution))) * 40}px`,
                                    backgroundColor: getBarColor(parseInt(grade))
                                  }}
                                  title={`Grade ${grade}: ${count} students`}
                                />
                                <span className="mini-grade-label">{grade}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="error-state">
                    <div className="error-icon">⚠️</div>
                    <p className="error-message">{examStat.error}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )
    } else {
      // Single examination statistics
      return (
        <div className="single-exam-stats">
          <div className="exam-header">
            <h2>📊 {examinations.find(e => e.id == stats.examination_id)?.name || `Course ${stats.examination_id}`} Statistics</h2>
            <div className="exam-meta">
              <span className="student-info">Student ID: {stats.student_id}</span>
              <span className="exam-info">• Examination ID: {stats.examination_id}</span>
            </div>
          </div>

          <div className="main-metrics">
            <div className="metric-card primary">
              <div className="metric-icon">🎯</div>
              <div className="metric-content">
                <div className="metric-value">{stats.pass_rate || '0%'}</div>
                <div className="metric-label">Pass Rate</div>
              </div>
              <div className={`metric-trend ${parseFloat(stats.pass_rate) >= 70 ? 'positive' : parseFloat(stats.pass_rate) >= 50 ? 'neutral' : 'negative'}`}>
                {parseFloat(stats.pass_rate) >= 70 ? '📈 Excellent' : parseFloat(stats.pass_rate) >= 50 ? '📊 Average' : '📉 Needs Improvement'}
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon">✅</div>
              <div className="metric-content">
                <div className="metric-value">{stats.students_passed || 0}</div>
                <div className="metric-label">Students Passed</div>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon">📚</div>
              <div className="metric-content">
                <div className="metric-value">{examinations.find(e => e.id == stats.examination_id)?.name || `Course ${stats.examination_id}`}</div>
                <div className="metric-label">Course Name</div>
              </div>
            </div>
          </div>

          {stats.distribution && (
            <div className="distribution-section">
              <div className="section-header">
                <h3>📊 Grade Distribution Analysis</h3>
                <p className="section-subtitle">How students performed across different grade ranges</p>
              </div>
              
              <div className="distribution-container">
                <div className="chart-wrapper">
                  {renderDistributionChart(stats.distribution)}
                </div>
                
                <div className="distribution-insights">
                  <h4>📈 Key Insights</h4>
                  <div className="insights-list">
                    {Object.entries(stats.distribution).filter(([_, count]) => count > 0).map(([grade, count]) => (
                      <div key={grade} className="insight-item">
                        <div 
                          className="insight-color" 
                          style={{ backgroundColor: getBarColor(parseInt(grade)) }}
                        />
                        <span className="insight-text">
                          <strong>{count}</strong> student{count !== 1 ? 's' : ''} scored <strong>{grade}</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    }
  }

  if (userRole !== 'STUDENT') {
    return (
      <div className="statistics">
        <div className="access-info">
          <h1>Statistics</h1>
          <p>Statistics are currently available for students only. Please login as a student to view examination statistics.</p>
        </div>

        <style jsx>{`
          .statistics {
            max-width: 800px;
            margin: 2rem auto;
            padding: 2rem;
          }

          .access-info {
            background: #e3f2fd;
            border: 1px solid #bbdefb;
            border-radius: 8px;
            padding: 2rem;
            text-align: center;
            color: #1565c0;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="statistics">
      <h1>Grade Statistics</h1>
      
      {message && (
        <div className={`message ${message.includes('successfully') || message.includes('Loaded') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="controls">
        <div className="form-group">
          <label htmlFor="examination-select">Select Examination:</label>
          <select
            id="examination-select"
            value={selectedExamination}
            onChange={handleExaminationChange}
            disabled={loading}
          >
            <option value="">All My Examinations</option>
            {examinations.map((exam, index) => (
              <option key={exam.id || index} value={exam.id || (index + 1)}>
                {exam.name || exam} (ID: {exam.id || (index + 1)})
              </option>
            ))}
          </select>
        </div>

        <button 
          onClick={() => loadStatistics(selectedExamination || null)} 
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Loading...' : 'Refresh Statistics'}
        </button>
      </div>

      {loading && <div className="loading">Loading statistics...</div>}

      {!loading && stats && renderStudentStats()}

      {!loading && studentGrades.length > 0 && (
        <div className="grades-overview">
          <h2>Your Grades</h2>
          <div className="grades-list">
            <h3>All Your Grades ({studentGrades.length})</h3>
            <div className="grades-grid">
              {studentGrades.map((grade, index) => (
                <div key={index} className={`grade-item ${grade >= 5 ? 'pass' : 'fail'}`}>
                  {grade}
                </div>
              ))}
            </div>
            <div className="grades-summary">
              <p><strong>Average:</strong> {(studentGrades.reduce((a, b) => a + b, 0) / studentGrades.length).toFixed(2)}</p>
              <p><strong>Passed:</strong> {studentGrades.filter(g => g >= 5).length} / {studentGrades.length}</p>
            </div>
          </div>
        </div>
      )}


      <style jsx>{`
        .statistics {
          max-width: 1000px;
          margin: 2rem auto;
          padding: 2rem;
        }

        .controls {
          display: flex;
          gap: 1rem;
          align-items: end;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .form-group {
          flex: 1;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .student-stats, .single-exam-stats, .grades-overview {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          text-align: center;
          border-left: 4px solid #007bff;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          color: #007bff;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: #666;
          font-weight: 500;
        }

        .exam-stat-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }

        .exam-stat-card h3 {
          margin: 0 0 1rem 0;
          color: #333;
        }

        .distribution-section {
          margin-top: 2rem;
        }

        .distribution-chart {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          padding: 2rem;
          background: #f8f9fa;
          border-radius: 8px;
          min-height: 250px;
        }

        .bar-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          flex: 1;
          max-width: 60px;
        }

        .count-label {
          margin-bottom: 5px;
          font-weight: bold;
          color: #2c3e50;
        }

        .bar {
          width: 40px;
          transition: height 0.3s ease;
          border-radius: 4px 4px 0 0;
          min-height: 5px;
        }

        .grade-label {
          margin-top: 5px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .grades-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .grade-item {
          padding: 0.75rem;
          text-align: center;
          border-radius: 4px;
          font-weight: bold;
        }

        .grade-item.pass {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .grade-item.fail {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .grades-summary {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 4px;
        }

        .grades-summary p {
          margin: 0.25rem 0;
        }

        .debug-section {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .debug-output {
          background: #f4f4f4;
          padding: 1rem;
          border-radius: 4px;
          overflow-x: auto;
          font-size: 0.9rem;
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

        .error-message {
          color: #721c24;
          font-style: italic;
        }

        /* Enhanced Statistics Styles */
        .summary-overview {
          margin-bottom: 2rem;
        }

        .overview-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .overview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .overview-header h3 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .course-count {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .overview-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .metric {
          text-align: center;
        }

        .metric-value {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .metric-label {
          font-size: 0.9rem;
          opacity: 0.9;
          font-weight: 500;
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .course-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #f0f0f0;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .course-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .course-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .course-info h3 {
          margin: 0 0 0.25rem 0;
          color: #2c3e50;
          font-size: 1.1rem;
        }

        .course-id {
          color: #7f8c8d;
          font-size: 0.85rem;
        }

        .pass-rate-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .pass-rate-badge.high {
          background: #d4edda;
          color: #155724;
        }

        .pass-rate-badge.medium {
          background: #fff3cd;
          color: #856404;
        }

        .pass-rate-badge.low {
          background: #f8d7da;
          color: #721c24;
        }

        .main-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .stat-icon {
          font-size: 1.5rem;
        }

        .stat-number {
          display: block;
          font-size: 1.3rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .stat-text {
          font-size: 0.85rem;
          color: #7f8c8d;
        }

        .mini-distribution h4 {
          margin: 0 0 0.75rem 0;
          color: #2c3e50;
          font-size: 1rem;
        }

        .mini-chart {
          display: flex;
          align-items: flex-end;
          gap: 4px;
          height: 50px;
          padding: 0.5rem;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .mini-bar {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }

        .mini-bar-fill {
          width: 100%;
          border-radius: 2px 2px 0 0;
          min-height: 2px;
          transition: height 0.3s ease;
        }

        .mini-grade-label {
          font-size: 0.7rem;
          color: #7f8c8d;
          margin-top: 2px;
        }

        .error-state {
          text-align: center;
          padding: 2rem 1rem;
          color: #7f8c8d;
        }

        .error-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        /* Single Exam Statistics */
        .exam-header {
          margin-bottom: 2rem;
        }

        .exam-header h2 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
          font-size: 1.8rem;
        }

        .exam-meta {
          color: #7f8c8d;
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .main-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #f0f0f0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .metric-card.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
        }

        .metric-icon {
          font-size: 2rem;
        }

        .metric-content {
          flex: 1;
        }

        .metric-card .metric-value {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .metric-card .metric-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .metric-trend {
          font-size: 0.85rem;
          font-weight: 500;
          padding: 0.5rem;
          border-radius: 6px;
        }

        .metric-trend.positive {
          background: rgba(46, 204, 113, 0.1);
          color: #27ae60;
        }

        .metric-trend.neutral {
          background: rgba(241, 196, 15, 0.1);
          color: #f39c12;
        }

        .metric-trend.negative {
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
        }

        .section-header {
          margin-bottom: 1.5rem;
        }

        .section-header h3 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
          font-size: 1.3rem;
        }

        .section-subtitle {
          margin: 0;
          color: #7f8c8d;
          font-size: 0.9rem;
        }

        .distribution-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          align-items: start;
        }

        .chart-wrapper {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .distribution-insights {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .distribution-insights h4 {
          margin: 0 0 1rem 0;
          color: #2c3e50;
          font-size: 1.1rem;
        }

        .insights-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .insight-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .insight-color {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .insight-text {
          font-size: 0.9rem;
          color: #2c3e50;
        }

        @media (max-width: 768px) {
          .overview-metrics {
            grid-template-columns: 1fr;
          }

          .courses-grid {
            grid-template-columns: 1fr;
          }

          .main-metrics {
            grid-template-columns: 1fr;
          }

          .distribution-container {
            grid-template-columns: 1fr;
          }

          .main-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default Statistics