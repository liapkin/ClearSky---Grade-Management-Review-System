import React, { useEffect, useRef } from 'react'
import config from '../config'

function GoogleAuthButton({ onLoginSuccess, selectedRole }) {
  const buttonRef = useRef(null)

  useEffect(() => {
    if (typeof google !== 'undefined' && google.accounts) {
      // Initialize Google Identity Services
      google.accounts.id.initialize({
        client_id: config.GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      })

      // Render the button
      if (buttonRef.current) {
        google.accounts.id.renderButton(
          buttonRef.current,
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
  }, [selectedRole])

  const handleCredentialResponse = (response) => {
    try {
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
        role: selectedRole || 'STUDENT', // Default to student if no role selected
        institution: institution,
        authMethod: 'google'
      }
      
      // Store user data
      localStorage.setItem('clearsky_user', JSON.stringify(user))
      localStorage.setItem('clearsky_auth_token', response.credential)
      
      if (onLoginSuccess) {
        onLoginSuccess(user)
      }
    } catch (error) {
      console.error('Google login error:', error)
    }
  }

  // Decode JWT token (simple implementation)
  const decodeJwtResponse = (token) => {
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

  return (
    <div className="google-auth-button">
      <div ref={buttonRef}></div>
      
      <style jsx>{`
        .google-auth-button {
          margin: 1rem 0;
        }
      `}</style>
    </div>
  )
}

export default GoogleAuthButton