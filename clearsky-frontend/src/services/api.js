// API Service Module - Complete Integration with All Microservices

// Base URLs for all microservices - Direct service URLs with CORS headers
const USER_MANAGEMENT_URL = 'http://localhost:3004'
const GRADES_SERVICE_URL = 'http://localhost:3002'
const STATISTICS_SERVICE_URL = 'http://localhost:3001'
const REVIEW_SERVICE_URL = 'http://localhost:3003'
const INSTITUTION_SERVICE_URL = 'http://localhost:3005'

// Helper function for API calls
async function apiCall(url, options = {}) {
  const token = localStorage.getItem('clearsky_auth_token') || localStorage.getItem('clearsky_token')
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }
  
  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API Error: ${response.status} - ${errorText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

// Helper for FormData requests (file uploads)
async function apiCallFormData(url, formData) {
  const token = localStorage.getItem('clearsky_auth_token') || localStorage.getItem('clearsky_token')
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API Error: ${response.status} - ${errorText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

// User Management Service APIs
export const userAPI = {
  // Register user with role (instructor, student, representative)
  register: async (userData, role) => {
    return apiCall(`${USER_MANAGEMENT_URL}/users/register/${role}`, {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  },
  
  // Login user
  login: async (email) => {
    return apiCall(`${USER_MANAGEMENT_URL}/users/login`, {
      method: 'POST',
      body: JSON.stringify({ email })
    })
  },
  
  // Get instructor by ID
  getInstructor: async (id) => {
    return apiCall(`${USER_MANAGEMENT_URL}/users/instructor?id=${id}`)
  },
  
  // Get student by ID
  getStudent: async (id) => {
    return apiCall(`${USER_MANAGEMENT_URL}/users/student?id=${id}`)
  },
  
  // Get all users for an institution
  getInstitutionUsers: async (institutionId) => {
    return apiCall(`${USER_MANAGEMENT_URL}/users/institutionUsers?institutionId=${institutionId}`)
  }
}

// Grades Service APIs
export const gradesAPI = {
  // Test endpoint
  test: async () => {
    return apiCall(`${GRADES_SERVICE_URL}/grades/test`)
  },
  
  // Upload grades file
  uploadGrades: async (formData) => {
    return apiCallFormData(`${GRADES_SERVICE_URL}/grades/upload`, formData)
  },
  
  // Confirm uploaded grades
  confirmGrades: async (uid) => {
    return apiCall(`${GRADES_SERVICE_URL}/grades/confirm`, {
      method: 'POST',
      body: JSON.stringify({ uid })
    })
  },
  
  // Cancel upload
  cancelUpload: async (uid) => {
    return apiCall(`${GRADES_SERVICE_URL}/grades/cancel`, {
      method: 'POST',
      body: JSON.stringify({ uid })
    })
  },
  
  // Get grades for a student
  getStudentGrades: async (studentId, state = null) => {
    const params = new URLSearchParams({ student_id: studentId })
    if (state) params.append('state', state)
    return apiCall(`${GRADES_SERVICE_URL}/grades/student?${params}`)
  },
  
  // Get grades for an examination
  getExaminationGrades: async (examinationId) => {
    return apiCall(`${GRADES_SERVICE_URL}/grades/examination?examination_id=${examinationId}`)
  },
  
  // Get examinations for instructor or student
  getInstructorExaminations: async (id, role) => {
    return apiCall(`${GRADES_SERVICE_URL}/grades/instructor-examinations?id=${id}&role=${role}`)
  }
}

// Statistics Service APIs
export const statisticsAPI = {
  // Get statistics for an examination
  getStats: async (examinationId = null) => {
    const params = examinationId ? `?examination_id=${examinationId}` : ''
    return apiCall(`${STATISTICS_SERVICE_URL}/statistics/stats${params}`)
  }
}

// Review Management Service APIs
export const reviewsAPI = {
  // Create a new review request
  createReview: async (gradeId, message) => {
    return apiCall(`${REVIEW_SERVICE_URL}/reviews/new`, {
      method: 'POST',
      body: JSON.stringify({ gradeId, message })
    })
  },
  
  // Get reviews (filtered by user role)
  getReviews: async (state = null) => {
    // Use detailed endpoint for richer data including student/course info
    const url = state ? `${REVIEW_SERVICE_URL}/reviews/detailed?state=${encodeURIComponent(state)}` : `${REVIEW_SERVICE_URL}/reviews/detailed`
    return apiCall(url, {
      method: 'GET'
    })
  },
  
  // Respond to a review request
  respondToReview: async (reviewId, action, newGrade, response) => {
    return apiCall(`${REVIEW_SERVICE_URL}/reviews/${reviewId}/response`, {
      method: 'POST',
      body: JSON.stringify({ action, newGrade, response })
    })
  }
}

// Institution Service APIs
export const institutionAPI = {
  // Get all institutions
  getAllInstitutions: async () => {
    return apiCall(`${INSTITUTION_SERVICE_URL}/`)
  },
  
  // Create new institution
  createInstitution: async (name, address = null, contactEmail = null) => {
    return apiCall(`${INSTITUTION_SERVICE_URL}/`, {
      method: 'POST',
      body: JSON.stringify({ name, address, contactEmail })
    })
  },
  
  // Get institution by ID
  getInstitution: async (institutionId) => {
    return apiCall(`${INSTITUTION_SERVICE_URL}/institutions/${institutionId}`)
  },
  
  // Delete institution
  deleteInstitution: async (institutionId) => {
    return apiCall(`${INSTITUTION_SERVICE_URL}/institutions/${institutionId}`, {
      method: 'DELETE'
    })
  },
  
  // Get institution credits
  getCredits: async (institutionId) => {
    return apiCall(`${INSTITUTION_SERVICE_URL}/institutions/${institutionId}/credits`)
  },
  
  // Purchase credits
  purchaseCredits: async (institutionId, amount) => {
    return apiCall(`${INSTITUTION_SERVICE_URL}/institutions/${institutionId}/credits/purchase`, {
      method: 'POST',
      body: JSON.stringify({ amount })
    })
  },
  
  // Consume credits
  consumeCredits: async (institutionId, amount) => {
    return apiCall(`${INSTITUTION_SERVICE_URL}/institutions/${institutionId}/credits/consume`, {
      method: 'POST',
      body: JSON.stringify({ amount })
    })
  }
}

// Legacy API exports for backward compatibility
export const authAPI = {
  login: userAPI.login,
  logout: () => {
    localStorage.removeItem('clearsky_auth_token')
    localStorage.removeItem('clearsky_token')
    localStorage.removeItem('clearsky_user')
    return Promise.resolve({ success: true })
  }
}

export const statsAPI = statisticsAPI

// Export all APIs
export default {
  user: userAPI,
  auth: authAPI,
  grades: gradesAPI,
  statistics: statisticsAPI,
  reviews: reviewsAPI,
  institution: institutionAPI,
  stats: statsAPI
}