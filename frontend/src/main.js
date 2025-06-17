import './styles/main.css'
import Navigo from 'navigo'
import { isAuthenticated, logout, getUserRole } from './utils/auth.js'
import Login from './components/Login.js'
import Dashboard from './components/Dashboard.js'
import GradeUpload from './components/GradeUpload.js'
import GradeView from './components/GradeView.js'
import ReviewRequests from './components/ReviewRequests.js'
import Statistics from './components/Statistics.js'

// Initialize router
const router = new Navigo('/')

// Get DOM elements
const mainContent = document.getElementById('main-content')
const navbar = document.getElementById('navbar')
const roleSpecificNav = document.getElementById('role-specific-nav')
const logoutBtn = document.getElementById('logout-btn')

// Update navigation based on user role
function updateNavigation() {
  const role = getUserRole()
  if (!role) {
    navbar.style.display = 'none'
    return
  }
  
  navbar.style.display = 'block'
  
  // Add role-specific navigation links
  let navLinks = ''
  
  switch(role) {
    case 'student':
      navLinks = `
        <a href="/grades" class="nav-link">My Grades</a>
        <a href="/statistics" class="nav-link">Statistics</a>
      `
      break
    case 'instructor':
      navLinks = `
        <a href="/upload" class="nav-link">Upload Grades</a>
        <a href="/reviews" class="nav-link">Review Requests</a>
        <a href="/statistics" class="nav-link">Statistics</a>
      `
      break
    case 'institution':
      navLinks = `
        <a href="/statistics" class="nav-link">Statistics</a>
      `
      break
  }
  
  roleSpecificNav.innerHTML = navLinks
}

// Logout handler
logoutBtn.addEventListener('click', () => {
  logout()
  router.navigate('/login')
})

// Auth guard middleware
function requireAuth() {
  if (!isAuthenticated()) {
    router.navigate('/login')
    return false
  }
  return true
}

// Routes
router
  .on('/login', () => {
    if (isAuthenticated()) {
      router.navigate('/')
      return
    }
    navbar.style.display = 'none'
    mainContent.innerHTML = Login()
  })
  .on('/', () => {
    if (!requireAuth()) return
    updateNavigation()
    mainContent.innerHTML = Dashboard()
  })
  .on('/upload', () => {
    if (!requireAuth()) return
    const role = getUserRole()
    if (role !== 'instructor') {
      router.navigate('/')
      return
    }
    updateNavigation()
    mainContent.innerHTML = GradeUpload()
  })
  .on('/grades', () => {
    if (!requireAuth()) return
    const role = getUserRole()
    if (role !== 'student') {
      router.navigate('/')
      return
    }
    updateNavigation()
    mainContent.innerHTML = GradeView()
  })
  .on('/reviews', () => {
    if (!requireAuth()) return
    const role = getUserRole()
    if (role !== 'instructor') {
      router.navigate('/')
      return
    }
    updateNavigation()
    mainContent.innerHTML = ReviewRequests()
  })
  .on('/statistics', () => {
    if (!requireAuth()) return
    updateNavigation()
    mainContent.innerHTML = Statistics()
  })
  .notFound(() => {
    router.navigate('/')
  })

// Start router
router.resolve()

// Check initial auth state
if (!isAuthenticated() && window.location.pathname !== '/login') {
  router.navigate('/login')
}