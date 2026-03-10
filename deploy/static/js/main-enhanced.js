/**
 * Main Enhanced JavaScript
 * Handles core functionality, dark mode, language switching, and navigation
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initDarkMode();
    initLanguageSelector();
    initSmoothScroll();
    initParticles();
    initNavigation();
    showAuthModal();
});

/**
 * Initialize the application
 */
function initializeApp() {
    // Apply saved language
    const savedLang = localStorage.getItem('language') || 'en';
    window.i18n.applyTranslations(savedLang);
    
    // Check if user has authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (isAuthenticated) {
        hideAuthModal();
    }
}

/**
 * Initialize dark mode toggle
 */
function initDarkMode() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Toggle theme
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');
        
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Update icon
        this.innerHTML = isDark ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
        
        // Add animation
        this.style.transform = 'scale(0.8)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
}

/**
 * Initialize language selector
 */
function initLanguageSelector() {
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    const langLinks = langDropdown.querySelectorAll('a');
    
    // Toggle dropdown
    langBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        langDropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
            langDropdown.classList.remove('active');
        }
    });
    
    // Handle language selection
    langLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            window.i18n.applyTranslations(lang);
            langDropdown.classList.remove('active');
            
            showNotification('Language changed successfully', 'success');
        });
    });
}

/**
 * Initialize smooth scrolling
 */
function initSmoothScroll() {
    document.querySelectorAll('a.smooth-scroll').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navMenu = document.getElementById('navMenu');
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });
}

/**
 * Initialize animated particles
 */
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation delay and duration
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (10 + Math.random() * 20) + 's';
        
        particlesContainer.appendChild(particle);
    }
}

/**
 * Initialize navigation
 */
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const userBtn = document.getElementById('userBtn');
    
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Animate hamburger
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(10px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // User button click
    if (userBtn) {
        userBtn.addEventListener('click', function() {
            const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
            if (isAuthenticated) {
                // Show user menu
                showUserMenu();
            } else {
                // Show auth modal
                showAuthModal();
            }
        });
    }
    
    // Highlight active section on scroll
    window.addEventListener('scroll', highlightActiveSection);
}

/**
 * Highlight active section in navigation
 */
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = sectionId;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

/**
 * Show user menu
 */
function showUserMenu() {
    const username = localStorage.getItem('username') || 'User';
    
    const menuHTML = `
        <div class="user-menu" style="position: fixed; top: 80px; right: 20px; background: var(--bg-card); 
             border-radius: 16px; padding: 1rem; box-shadow: var(--shadow-xl); z-index: 1000; min-width: 200px;">
            <div style="padding: 1rem; border-bottom: 1px solid var(--border-color); margin-bottom: 0.5rem;">
                <p style="font-weight: 600; margin-bottom: 0.25rem;">${username}</p>
                <p style="font-size: 0.875rem; color: var(--text-tertiary);">Welcome back!</p>
            </div>
            <a href="#" onclick="window.location.reload()" 
               style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; color: var(--text-primary); 
                      text-decoration: none; border-radius: 8px; transition: all 0.2s;">
                <i class="fas fa-user"></i> Profile
            </a>
            <a href="#history" 
               style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; color: var(--text-primary); 
                      text-decoration: none; border-radius: 8px; transition: all 0.2s;">
                <i class="fas fa-history"></i> History
            </a>
            <a href="#" onclick="logout(); return false;" 
               style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; color: var(--error-color); 
                      text-decoration: none; border-radius: 8px; transition: all 0.2s;">
                <i class="fas fa-sign-out-alt"></i> Logout
            </a>
        </div>
    `;
    
    // Remove existing menu
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    // Add menu
    document.body.insertAdjacentHTML('beforeend', menuHTML);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            const menu = document.querySelector('.user-menu');
            if (menu && !menu.contains(e.target) && !document.getElementById('userBtn').contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

/**
 * Logout user
 */
function logout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    showNotification('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
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
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Type (success, error, info, warning)
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        color: 'white',
        fontWeight: '600',
        boxShadow: 'var(--shadow-xl)',
        zIndex: '10001',
        animation: 'slideInRight 0.3s ease',
        maxWidth: '400px'
    });
    
    const bgColors = {
        success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    };
    
    notification.style.background = bgColors[type] || bgColors.info;
    
    document.body.appendChild(notification);
    
    // Add animation styles
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/**
 * Utility functions
 */
window.appUtils = {
    showNotification,
    
    formatFileSize: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    },
    
    validateFileType: function(file, allowedTypes) {
        return allowedTypes.some(type => {
            if (type.endsWith('/*')) {
                const baseType = type.split('/')[0];
                return file.type.startsWith(baseType + '/');
            }
            return file.type === type;
        });
    },
    
    validateFileSize: function(file, maxSizeMB) {
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        return file.size <= maxSizeBytes;
    },
    
    fileToBase64: function(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    },
    
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Expose logout function globally
window.logout = logout;
