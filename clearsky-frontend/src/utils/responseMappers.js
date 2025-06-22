// API Response Mappers
// These functions transform the actual API responses into the format expected by the frontend

/**
 * Maps institution API response to array format
 * API returns: {id: 1, name: "NTUA", tokens: 1000}
 * Frontend expects: [{id: 1, name: "NTUA", tokens: 1000}]
 */
export const mapInstitutionResponse = (response) => {
  if (!response) return []
  
  if (Array.isArray(response)) {
    return response
  }
  
  if (response.id) {
    return [response]
  }
  
  return []
}

/**
 * Maps grades API response to rich objects
 * API returns: [6] (simple grade values)
 * Frontend expects: [{id, value, course, state, examination_id}]
 */
export const mapGradesResponse = (response) => {
  if (!Array.isArray(response)) return []
  
  return response.map((gradeValue, index) => ({
    id: index + 1,
    value: gradeValue,
    course: `Course ${index + 1}`, // Placeholder - would need course data
    state: gradeValue >= 5 ? 'passed' : 'failed', // Assuming 5+ is passing
    examination_id: index + 1,
    canRequestReview: gradeValue < 5 // Allow reviews for failing grades
  }))
}

/**
 * Maps reviews API response 
 * API returns: {reviewerList: [...]} or times out
 * Frontend expects: array of review objects
 */
export const mapReviewsResponse = (response) => {
  if (!response) return []
  
  // Handle different response structures
  if (response.reviewerList && Array.isArray(response.reviewerList)) {
    return response.reviewerList
  }
  
  if (response.data && Array.isArray(response.data)) {
    return response.data
  }
  
  if (Array.isArray(response)) {
    return response
  }
  
  return []
}

/**
 * Maps statistics API response
 * API returns: unknown structure (times out)
 * Frontend expects: statistics object with structured data
 */
export const mapStatisticsResponse = (response) => {
  if (!response) return null
  
  // If response has statistics array
  if (response.statistics && Array.isArray(response.statistics)) {
    return {
      ...response,
      hasData: true,
      count: response.statistics.length
    }
  }
  
  // If response has examination_id
  if (response.examination_id) {
    return {
      ...response,
      hasData: true,
      type: 'single_examination'
    }
  }
  
  // Default structure
  return {
    ...response,
    hasData: Object.keys(response).length > 0
  }
}

/**
 * Creates an error response object with timeout information
 */
export const createTimeoutError = (serviceName) => ({
  error: true,
  message: `${serviceName} service is currently unavailable. Please try again later.`,
  timeout: true,
  serviceName
})

/**
 * Creates a loading state response
 */
export const createLoadingResponse = (serviceName) => ({
  loading: true,
  message: `Loading ${serviceName} data...`,
  serviceName
})

/**
 * Extracts user context from stored user data
 */
export const extractUserContext = (userData) => {
  if (!userData) return { userId: null, role: null }
  
  let effectiveUserId
  if (userData.role === 'STUDENT') {
    effectiveUserId = userData.studentId || userData.sub
  } else if (userData.role === 'INSTRUCTOR') {
    effectiveUserId = userData.teacherId || userData.sub
  } else {
    effectiveUserId = userData.sub
  }
  
  return {
    userId: effectiveUserId,
    role: userData.role,
    institutionId: userData.institutionId || userData.institution_id,
    studentId: userData.studentId,
    teacherId: userData.teacherId,
    email: userData.email,
    name: userData.name
  }
}