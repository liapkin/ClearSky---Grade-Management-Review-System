// API Service Module
// This is a mock implementation. Replace with actual API calls in production.

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('clearsky_auth_token') || localStorage.getItem('clearsky_token')
  const user = JSON.parse(localStorage.getItem('clearsky_user') || '{}')
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(user.authMethod && { 'X-Auth-Method': user.authMethod })
    }
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

// Authentication
export const authAPI = {
  login: async (email, password, role) => {
    // Mock implementation
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role })
    })
  },
  
  logout: async () => {
    return apiCall('/auth/logout', { method: 'POST' })
  }
}

// Grades
export const gradesAPI = {
  uploadGrades: async (formData) => {
    return apiCall('/grades/upload', {
      method: 'POST',
      headers: {}, // Let browser set content-type for FormData
      body: formData
    })
  },
  
  getStudentGrades: async (studentId) => {
    return apiCall(`/grades/student/${studentId}`)
  },
  
  getCourseGrades: async (courseId) => {
    return apiCall(`/grades/course/${courseId}`)
  }
}

// Review Requests
export const reviewsAPI = {
  createRequest: async (gradeId, reason) => {
    return apiCall('/reviews/request', {
      method: 'POST',
      body: JSON.stringify({ gradeId, reason })
    })
  },
  
  getRequests: async (instructorId) => {
    return apiCall(`/reviews/instructor/${instructorId}`)
  },
  
  respondToRequest: async (requestId, response) => {
    return apiCall(`/reviews/${requestId}/respond`, {
      method: 'POST',
      body: JSON.stringify(response)
    })
  }
}

// Statistics
export const statsAPI = {
  getCourseStats: async (courseId, period) => {
    return apiCall(`/stats/course/${courseId}?period=${period}`)
  },
  
  getInstitutionStats: async () => {
    return apiCall('/stats/institution')
  }
}

// Export all APIs
export default {
  auth: authAPI,
  grades: gradesAPI,
  reviews: reviewsAPI,
  stats: statsAPI
}