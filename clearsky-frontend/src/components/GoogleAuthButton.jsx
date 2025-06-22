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
        use_fedcm_for_prompt: false,
        itp_support: true,
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
            shape: 'rectangular',
            logo_alignment: 'left'
          }
        )
      }

      // Also try to show One Tap if the button doesn't work
      try {
        google.accounts.id.prompt((notification) => {
          console.log('One Tap notification:', notification)
        })
      } catch (err) {
        console.log('One Tap not available:', err)
      }
    }
  }, [selectedRole])

  const handleCredentialResponse = (response) => {
    try {
      console.log('Google credential response received:', response)
      // Decode the JWT token from Google
      const userInfo = decodeJwtResponse(response.credential)
      console.log('Decoded user info:', userInfo)
      
      // Create user object with Google data
      const googleUser = {
        id: userInfo.sub, // Google user ID
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        authMethod: 'google'
      }
      
      if (onLoginSuccess) {
        onLoginSuccess(googleUser)
      }
    } catch (error) {
      console.error('Google login error:', error)
      alert('Google sign-in failed. Please try again or use the regular registration form.')
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