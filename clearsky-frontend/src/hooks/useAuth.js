import { useState, useEffect } from 'react'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    const token = localStorage.getItem('clearsky_auth_token')
    const userData = localStorage.getItem('clearsky_user')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing user data:', error)
        logout()
      }
    }
    setLoading(false)
  }

  const login = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    // Check if user was authenticated with Google
    if (user && user.authMethod === 'google' && typeof google !== 'undefined') {
      // Revoke Google authentication
      google.accounts.id.disableAutoSelect()
    }
    
    // Clear all stored data
    localStorage.removeItem('clearsky_user')
    localStorage.removeItem('clearsky_auth_token')
    localStorage.removeItem('clearsky_grades')
    localStorage.removeItem('clearsky_reviews')
    
    setUser(null)
    setIsAuthenticated(false)
  }

  const getCurrentUser = () => {
    return user
  }

  const getUserRole = () => {
    return user ? user.role : null
  }

  const isUserAuthenticated = () => {
    return isAuthenticated
  }

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    getCurrentUser,
    getUserRole,
    isUserAuthenticated,
    checkAuthStatus
  }
}