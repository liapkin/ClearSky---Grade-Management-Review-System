// Configuration file for clearSKY

const config = {
    // Google OAuth Configuration
    GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'placeholder',

    // API Configuration
    API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    
    // Application Settings
    APP_NAME: 'clearSKY',
    
    // Supported institutions (for validation)
    SUPPORTED_INSTITUTIONS: [
      { domain: 'ntua.gr', name: 'NTUA' },
      { domain: 'uoa.gr', name: 'University of Athens' },
      { domain: 'auth.gr', name: 'Aristotle University' },
      { domain: 'upatras.gr', name: 'University of Patras' },
      { domain: 'duth.gr', name: 'Democritus University' },
    ],
    
    // Role permissions
    ROLE_PERMISSIONS: {
      student: ['view_grades', 'request_review', 'view_statistics'],
      instructor: ['upload_grades', 'manage_reviews', 'view_statistics'],
      institution: ['view_statistics', 'manage_users', 'manage_credits']
    }
}

export default config
