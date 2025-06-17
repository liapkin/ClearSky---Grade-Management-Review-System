import { login, initializeGoogleAuth, renderGoogleButton, handleGoogleLogin } from '../utils/auth.js'

export default function Login() {
  // Initialize Google Auth and attach event listeners after render
  setTimeout(() => {
    const form = document.getElementById('login-form')
    if (form) {
      form.addEventListener('submit', handleTraditionalLogin)
    }
    
    // Initialize Google Auth
    initializeGoogleAuth(handleGoogleSignIn)
    
    // Render Google button
    const googleButtonDiv = document.getElementById('google-signin-button')
    if (googleButtonDiv) {
      renderGoogleButton(googleButtonDiv)
    }
    
    // Tab switching
    const tabs = document.querySelectorAll('.login-tab')
    const tabContents = document.querySelectorAll('.tab-content')
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'))
        tabContents.forEach(c => c.style.display = 'none')
        
        // Add active class to clicked tab
        tab.classList.add('active')
        
        // Show corresponding content
        const targetId = tab.dataset.tab
        document.getElementById(targetId).style.display = 'block'
      })
    })
    
    // Role selection for Google login
    const roleSelect = document.getElementById('google-role')
    if (roleSelect) {
      roleSelect.addEventListener('change', (e) => {
        localStorage.setItem('pendingGoogleRole', e.target.value)
      })
    }
  }, 0)
  
  return `
    <div class="login-container">
      <h2 class="login-title">Welcome to clearSKY</h2>
      <div class="card">
        <!-- Login tabs -->
        <div class="login-tabs">
          <button class="login-tab active" data-tab="google-login">
            <img src="https://www.google.com/favicon.ico" alt="Google" style="width: 16px; height: 16px; margin-right: 8px;">
            Login with Google
          </button>
          <button class="login-tab" data-tab="traditional-login">
            Traditional Login
          </button>
        </div>
        
        <!-- Google Login -->
        <div id="google-login" class="tab-content" style="display: block;">
          <div class="form-group">
            <label for="google-role">Select your role</label>
            <select id="google-role" name="google-role" required>
              <option value="">Select role...</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="institution">Institution Representative</option>
            </select>
          </div>
          
          <div id="google-error" class="alert alert-error" style="display: none;"></div>
          
          <div id="google-signin-button" style="display: flex; justify-content: center; margin-top: 1rem;"></div>
          
          <p style="text-align: center; margin-top: 1rem; color: #7f8c8d; font-size: 0.9rem;">
            Sign in with your institutional Google account
          </p>
        </div>
        
        <!-- Traditional Login -->
        <div id="traditional-login" class="tab-content" style="display: none;">
          <form id="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required
                placeholder="your.email@university.gr"
              >
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required
                placeholder="Enter your password"
              >
            </div>
            
            <div class="form-group">
              <label for="role">Login as</label>
              <select id="role" name="role" required>
                <option value="">Select role...</option>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="institution">Institution Representative</option>
              </select>
            </div>
            
            <div id="login-error" class="alert alert-error" style="display: none;"></div>
            
            <button type="submit" class="btn btn-primary" style="width: 100%;">
              Login
            </button>
          </form>
          
          <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #eee;">
            <p style="color: #7f8c8d; font-size: 0.9rem; text-align: center;">
              Demo credentials:<br>
              Student: student@ntua.gr<br>
              Instructor: instructor@ntua.gr<br>
              Institution: admin@ntua.gr<br>
              Password: (any)
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <style>
      .login-tabs {
        display: flex;
        gap: 0;
        margin-bottom: 2rem;
        border-bottom: 2px solid #eee;
      }
      
      .login-tab {
        flex: 1;
        padding: 1rem;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        font-size: 1rem;
        color: #7f8c8d;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .login-tab:hover {
        color: #3498db;
        background-color: #f8f9fa;
      }
      
      .login-tab.active {
        color: #3498db;
        border-bottom-color: #3498db;
        font-weight: 600;
      }
      
      .tab-content {
        display: none;
      }
    </style>
  `
}

function handleGoogleSignIn(response) {
  // Get selected role
  const roleSelect = document.getElementById('google-role')
  const selectedRole = roleSelect ? roleSelect.value : localStorage.getItem('pendingGoogleRole')
  
  if (!selectedRole) {
    const errorDiv = document.getElementById('google-error')
    errorDiv.textContent = 'Please select a role before signing in'
    errorDiv.style.display = 'block'
    return
  }
  
  // Handle the Google login
  const result = handleGoogleLogin(response, selectedRole)
  
  if (result.success) {
    // Clear pending role
    localStorage.removeItem('pendingGoogleRole')
    // Redirect to dashboard
    window.location.href = '/'
  } else {
    const errorDiv = document.getElementById('google-error')
    errorDiv.textContent = 'Google sign-in failed. Please try again.'
    errorDiv.style.display = 'block'
  }
}

function handleTraditionalLogin(e) {
  e.preventDefault()
  
  const formData = new FormData(e.target)
  const email = formData.get('email')
  const password = formData.get('password')
  const role = formData.get('role')
  
  const result = login(email, password, role)
  
  if (result.success) {
    window.location.href = '/'
  } else {
    const errorDiv = document.getElementById('login-error')
    errorDiv.textContent = result.error
    errorDiv.style.display = 'block'
  }
}