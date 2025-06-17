// Authentication utilities with Google OAuth support
import config from '../config.js'

// Initialize Google Identity Services
export function initializeGoogleAuth(callback) {
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.initialize({
      client_id: config.GOOGLE_CLIENT_ID,
      callback: callback,
      auto_select: false,
      cancel_on_tap_outside: true,
    })
  }
}

// Render Google Sign-In button
export function renderGoogleButton(buttonElement) {
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.renderButton(
      buttonElement,
      {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        width: '100%',
      }
    )
  }
}

// Check if user is authenticated
export function isAuthenticated() {
  return localStorage.getItem('clearsky_user') !== null
}

// Get current user
export function getCurrentUser() {
  const userStr = localStorage.getItem('clearsky_user')
  return userStr ? JSON.parse(userStr) : null
}

// Get user role
export function getUserRole() {
  const user = getCurrentUser()
  return user ? user.role : null
}

// Handle Google login response
export function handleGoogleLogin(response, selectedRole) {
  // Decode the JWT token from Google
  const userInfo = decodeJwtResponse(response.credential)
  
  // Determine institution from email domain
  const emailDomain = userInfo.email.split('@')[1]
  const institution = emailDomain.includes('ntua') ? 'NTUA' : 
                     emailDomain.includes('uoa') ? 'University of Athens' : 
                     'Unknown Institution'
  
  // Create user object
  const user = {
    id: userInfo.sub, // Google user ID
    email: userInfo.email,
    name: userInfo.name,
    picture: userInfo.picture,
    role: selectedRole || 'student', // Default to student if no role selected
    institution: institution,
    authMethod: 'google'
  }
  
  // Store user data
  localStorage.setItem('clearsky_user', JSON.stringify(user))
  localStorage.setItem('clearsky_auth_token', response.credential)
  
  return { success: true, user }
}

// Decode JWT token (simple implementation)
function decodeJwtResponse(token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )
  return JSON.parse(jsonPayload)
}

// Login user (mock implementation for traditional login)
export function login(email, password, role) {
  // In production, this would make an API call
  // For now, we'll mock the authentication
  
  // Mock user data based on role
  const mockUsers = {
    student: {
      id: '03112345',
      email: 'student@ntua.gr',
      name: 'John Student',
      role: 'student',
      institution: 'NTUA',
      authMethod: 'traditional'
    },
    instructor: {
      id: 'inst001',
      email: 'instructor@ntua.gr',
      name: 'Dr. Smith',
      role: 'instructor',
      institution: 'NTUA',
      authMethod: 'traditional'
    },
    institution: {
      id: 'rep001',
      email: 'admin@ntua.gr',
      name: 'Admin User',
      role: 'institution',
      institution: 'NTUA',
      authMethod: 'traditional'
    }
  }
  
  // Simple validation
  if (!email || !password || !role) {
    return { success: false, error: 'All fields are required' }
  }
  
  // Mock successful login
  const user = mockUsers[role]
  if (user) {
    localStorage.setItem('clearsky_user', JSON.stringify(user))
    return { success: true, user }
  }
  
  return { success: false, error: 'Invalid credentials' }
}

// Logout user
export function logout() {
  // Check if user was authenticated with Google
  const user = getCurrentUser()
  if (user && user.authMethod === 'google' && typeof google !== 'undefined') {
    // Revoke Google authentication
    google.accounts.id.disableAutoSelect()
  }
  
  // Clear all stored data
  localStorage.removeItem('clearsky_user')
  localStorage.removeItem('clearsky_auth_token')
  localStorage.removeItem('clearsky_grades')
  localStorage.removeItem('clearsky_reviews')
}