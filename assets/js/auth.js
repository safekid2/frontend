// Authentication token key for localStorage
const TOKEN_KEY = 'safekids_auth_token';

// Get the authentication token
function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Set the authentication token
function setAuthToken(token) {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        // Set default Authorization header for all axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        localStorage.removeItem(TOKEN_KEY);
        delete axios.defaults.headers.common['Authorization'];
    }
}

// Check if user is authenticated
function isAuthenticated() {
    return !!getToken();
}

// Set up authentication event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Set up axios defaults with auth token if it exists
    const token = getToken();
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    setupLoginForm();
    checkAuthState();
    setupLogoutButton();
});

// Set up login form submission
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', handleLogin);
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    try {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Logging in...
        `;
        
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            email,
            password
        });
        
        if (response.data.token) {
            // Store the token
            setAuthToken(response.data.token);
            
            // Show success message
            showToast('Success', 'Login successful!', 'success');
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            throw new Error('No token received');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        const message = error.response?.data?.error || 'Login failed. Please try again.';
        showToast('Error', message, 'error');
        
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
    }
}

// Check authentication state on page load
function checkAuthState() {
    const isLoginPage = window.location.pathname.includes('index.html');
    const isAuthenticatedUser = isAuthenticated();
    
    if (isLoginPage && isAuthenticatedUser) {
        window.location.href = 'dashboard.html';
    } 
    else if (!isLoginPage && !isAuthenticatedUser) {
        window.location.href = 'index.html';
    }
}

// Set up logout button
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            setAuthToken(null);
            window.location.href = 'index.html';
        });
    }
}