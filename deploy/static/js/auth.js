/**
 * Authentication Module
 * Handles login, register, and skip authentication
 */

document.addEventListener('DOMContentLoaded', function() {
    initAuth();
});

/**
 * Initialize authentication
 */
function initAuth() {
    const authModal = document.getElementById('authModal');
    const authClose = document.getElementById('authClose');
    const authToggle = document.getElementById('authToggle');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const skipAuth = document.getElementById('skipAuth');
    const skipAuthRegister = document.getElementById('skipAuthRegister');
    
    // Close modal
    if (authClose) {
        authClose.addEventListener('click', function() {
            const isAuth = localStorage.getItem('isAuthenticated') === 'true';
            if (isAuth) {
                hideAuthModal();
            } else {
                if (confirm('Continue without logging in?')) {
                    skipAuthentication();
                }
            }
        });
    }
    
    // Toggle between login and register
    if (authToggle) {
        authToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleAuthForms();
        });
    }
    
    // Handle login form
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin(this);
        });
    }
    
    // Handle register form
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister(this);
        });
    }
    
    // Skip authentication buttons
    if (skipAuth) {
        skipAuth.addEventListener('click', skipAuthentication);
    }
    
    if (skipAuthRegister) {
        skipAuthRegister.addEventListener('click', skipAuthentication);
    }
    
    // Check if already authenticated
    checkAuthentication();
}

/**
 * Toggle between login and register forms
 */
function toggleAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');
    const authToggle = document.getElementById('authToggle');
    const authToggleText = document.getElementById('authToggleText');
    
    const isLogin = loginForm.classList.contains('active');
    
    if (isLogin) {
        // Switch to register
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        authTitle.textContent = 'Create Account';
        authSubtitle.textContent = 'Join TruthVerify to save your history';
        authToggleText.innerHTML = 'Already have an account? <a href="#" id="authToggle">Sign in</a>';
    } else {
        // Switch to login
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
        authTitle.textContent = 'Welcome Back';
        authSubtitle.textContent = 'Sign in to access your detection history';
        authToggleText.innerHTML = 'Don\'t have an account? <a href="#" id="authToggle">Sign up</a>';
    }
    
    // Re-bind click event
    const newAuthToggle = document.getElementById('authToggle');
    newAuthToggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleAuthForms();
    });
}

/**
 * Handle login
 * @param {HTMLFormElement} form - Login form
 */
function handleLogin(form) {
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    
    // Simple validation
    if (!email || !password) {
        window.appUtils.showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate login (In production, make API call)
    showLoading();
    
    setTimeout(() => {
        // Extract username from email
        const username = email.split('@')[0];
        
        // Save to localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        
        hideLoading();
        window.appUtils.showNotification('Login successful!', 'success');
        
        // Hide modal
        hideAuthModal();
        
        // Update UI
        updateUserUI();
    }, 1500);
}

/**
 * Handle registration
 * @param {HTMLFormElement} form - Register form
 */
function handleRegister(form) {
    const inputs = form.querySelectorAll('input');
    const name = inputs[0].value;
    const email = inputs[1].value;
    const password = inputs[2].value;
    const confirmPassword = inputs[3].value;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        window.appUtils.showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        window.appUtils.showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        window.appUtils.showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Simulate registration (In production, make API call)
    showLoading();
    
    setTimeout(() => {
        // Save to localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', name);
        localStorage.setItem('email', email);
        
        hideLoading();
        window.appUtils.showNotification('Account created successfully!', 'success');
        
        // Hide modal
        hideAuthModal();
        
        // Update UI
        updateUserUI();
    }, 1500);
}

/**
 * Skip authentication (guest mode)
 */
function skipAuthentication() {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('username', 'Guest');
    localStorage.setItem('isGuest', 'true');
    
    window.appUtils.showNotification('Continuing as guest', 'info');
    hideAuthModal();
    updateUserUI();
}

/**
 * Check if user is authenticated
 */
function checkAuthentication() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (isAuthenticated) {
        hideAuthModal();
        updateUserUI();
    } else {
        // Show modal after a short delay
        setTimeout(showAuthModal, 1000);
    }
}

/**
 * Update UI for authenticated user
 */
function updateUserUI() {
    const username = localStorage.getItem('username') || 'User';
    const userBtn = document.getElementById('userBtn');
    
    if (userBtn) {
        userBtn.title = `Logged in as ${username}`;
    }
}

/**
 * Show auth modal
 */
function showAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.classList.remove('hidden');
    }
}

/**
 * Hide auth modal
 */
function hideAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.classList.add('hidden');
    }
}

/**
 * Show loading overlay
 */
function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Export functions
window.authModule = {
    showAuthModal,
    hideAuthModal,
    skipAuthentication
};
