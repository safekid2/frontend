// API Configuration
const API_BASE_URL = 'https://safe-kids-qixg.onrender.com/api/v1';

// Toast initialization
const toastEl = document.getElementById('toast');
const toastTitle = document.getElementById('toast-title');
const toastMessage = document.getElementById('toast-message');
const toast = new bootstrap.Toast(toastEl);

// Show toast message
function showToast(title, message, type = 'info') {
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    // Remove previous color classes
    toastEl.querySelector('.toast-header').classList.remove(
        'text-primary', 'text-success', 'text-danger', 'text-warning'
    );
    
    // Add appropriate color class
    switch(type) {
        case 'success':
            toastEl.querySelector('.toast-header').classList.add('text-success');
            break;
        case 'error':
            toastEl.querySelector('.toast-header').classList.add('text-danger');
            break;
        case 'warning':
            toastEl.querySelector('.toast-header').classList.add('text-warning');
            break;
        default:
            toastEl.querySelector('.toast-header').classList.add('text-primary');
    }
    
    toast.show();
}

// Set authorization header for axios
function setAuthToken(token) {
    try {
        if (token) {
            // Store token in localStorage
            localStorage.setItem('token', token);
            // Set default Authorization header for all axios requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log('Token set successfully');
        } else {
            // Remove token from localStorage and axios headers
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            console.log('Token removed');
        }
    } catch (error) {
        console.error('Error setting auth token:', error);
    }
}

// Check if user is authenticated
function isAuthenticated() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found');
            return false;
        }
        
        // Check if token is expired
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        
        if (isExpired) {
            console.log('Token expired');
            localStorage.removeItem('token');
            return false;
        }
        
        console.log('User is authenticated');
        return true;
    } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('token');
        return false;
    }
}

// Initialize axios defaults when utils.js loads
const token = localStorage.getItem('token');
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Redirect if not authenticated
function requireAuth() {
    if (!isAuthenticated() && !window.location.href.includes('index.html')) {
        window.location.href = 'index.html';
    }
}

// Format date
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
}
