document.addEventListener('DOMContentLoaded', function() {
    // Initialize login page functionality
    setupTabs();
    setupFormValidation();
    setupPasswordToggle();
    setupForgotPassword();
    setupSocialLogin();
});

/**
 * Set up tab switching between login and signup forms
 */
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.auth-tab');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the tab to show
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to selected button and tab
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * Set up form validation for login and signup forms
 */
function setupFormValidation() {
    // Login form validation
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form inputs
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Basic validation
            if (!email || !password) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // For demo purposes, simulate a successful login
            loginUser(email, password);
        });
    }
    
    // Signup form validation
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        const passwordInput = document.getElementById('signup-password');
        
        // Live password validation
        if (passwordInput) {
            passwordInput.addEventListener('input', validatePassword);
        }
        
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form inputs
            const firstName = document.getElementById('signup-first-name').value;
            const lastName = document.getElementById('signup-last-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm').value;
            const termsCheckbox = document.getElementById('terms');
            
            // Basic validation
            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Check if passwords match
            if (password !== confirmPassword) {
                showNotification('Passwords do not match.', 'error');
                return;
            }
            
            // Check if password is strong enough
            if (!isStrongPassword(password)) {
                showNotification('Please create a stronger password.', 'error');
                return;
            }
            
            // Check if terms are accepted
            if (!termsCheckbox.checked) {
                showNotification('You must accept the Terms of Service and Privacy Policy.', 'error');
                return;
            }
            
            // For demo purposes, simulate a successful signup
            signupUser(firstName, lastName, email, password);
        });
    }
    
    // Forgot password form
    const forgotForm = document.getElementById('forgot-form');
    if (forgotForm) {
        forgotForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get email input
            const email = document.getElementById('forgot-email').value;
            
            // Basic validation
            if (!email) {
                showNotification('Please enter your email address.', 'error');
                return;
            }
            
            // Simulate sending a password reset email
            showNotification('Password reset instructions have been sent to your email.', 'success');
            
            // Close the modal
            const modal = document.getElementById('forgot-modal');
            closeModal(modal);
            
            // Clear the form
            this.reset();
        });
    }
}

/**
 * Set up password visibility toggle
 */
function setupPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find the password input
            const input = this.previousElementSibling;
            
            // Toggle input type
            if (input.type === 'password') {
                input.type = 'text';
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                input.type = 'password';
                this.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    });
}

/**
 * Set up forgot password modal
 */
function setupForgotPassword() {
    const forgotLink = document.querySelector('.forgot-password');
    const forgotModal = document.getElementById('forgot-modal');
    const closeModalBtn = forgotModal ? forgotModal.querySelector('.close-modal') : null;
    
    // Show modal when forgot password link is clicked
    if (forgotLink && forgotModal) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(forgotModal);
        });
    }
    
    // Close modal when close button is clicked
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            closeModal(forgotModal);
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === forgotModal) {
            closeModal(forgotModal);
        }
    });
}

/**
 * Set up social login buttons
 */
function setupSocialLogin() {
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 'LinkedIn';
            
            // For demo purposes, simulate a successful social login
            showNotification(`Logging in with ${provider}...`, 'info');
            
            // Simulate a delay for the authentication process
            setTimeout(() => {
                // Set user as logged in
                localStorage.setItem('isLoggedIn', 'true');
                
                // Create demo user data
                const userData = {
                    profile: {
                        firstName: provider === 'Google' ? 'Google' : 'LinkedIn',
                        lastName: 'User',
                        email: `${provider.toLowerCase()}.user@example.com`
                    }
                };
                
                localStorage.setItem('userData', JSON.stringify(userData));
                
                // Redirect to onboarding
                window.location.href = 'onboarding.html';
            }, 1500);
        });
    });
}

/**
 * Validate password strength in real time
 */
function validatePassword() {
    const password = this.value;
    const lengthReq = document.getElementById('length-req');
    const uppercaseReq = document.getElementById('uppercase-req');
    const numberReq = document.getElementById('number-req');
    const specialReq = document.getElementById('special-req');
    
    // Validate length (8+ characters)
    if (password.length >= 8) {
        lengthReq.classList.add('valid');
        lengthReq.innerHTML = '<i class="fas fa-check-circle"></i> At least 8 characters';
    } else {
        lengthReq.classList.remove('valid');
        lengthReq.innerHTML = '<i class="fas fa-circle"></i> At least 8 characters';
    }
    
    // Validate uppercase letter
    if (/[A-Z]/.test(password)) {
        uppercaseReq.classList.add('valid');
        uppercaseReq.innerHTML = '<i class="fas fa-check-circle"></i> One uppercase letter';
    } else {
        uppercaseReq.classList.remove('valid');
        uppercaseReq.innerHTML = '<i class="fas fa-circle"></i> One uppercase letter';
    }
    
    // Validate number
    if (/[0-9]/.test(password)) {
        numberReq.classList.add('valid');
        numberReq.innerHTML = '<i class="fas fa-check-circle"></i> One number';
    } else {
        numberReq.classList.remove('valid');
        numberReq.innerHTML = '<i class="fas fa-circle"></i> One number';
    }
    
    // Validate special character
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        specialReq.classList.add('valid');
        specialReq.innerHTML = '<i class="fas fa-check-circle"></i> One special character';
    } else {
        specialReq.classList.remove('valid');
        specialReq.innerHTML = '<i class="fas fa-circle"></i> One special character';
    }
}

/**
 * Check if a password meets all strength requirements
 * 
 * @param {string} password - The password to validate
 * @returns {boolean} - Whether the password is strong
 */
function isStrongPassword(password) {
    // Check length (8+ characters)
    const hasLength = password.length >= 8;
    
    // Check for uppercase letter
    const hasUppercase = /[A-Z]/.test(password);
    
    // Check for number
    const hasNumber = /[0-9]/.test(password);
    
    // Check for special character
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return hasLength && hasUppercase && hasNumber && hasSpecial;
}

/**
 * Login a user
 * 
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 */
function loginUser(email, password) {
    // In a real app, this would make an API call to authenticate the user
    // For demo purposes, we'll just simulate a successful login
    
    showNotification('Logging in...', 'info');
    
    setTimeout(() => {
        // Set user as logged in
        localStorage.setItem('isLoggedIn', 'true');
        
        // Check if user has completed onboarding
        const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
        
        // Create demo user data if it doesn't exist
        if (!localStorage.getItem('userData')) {
            const userData = {
                profile: {
                    firstName: 'Demo',
                    lastName: 'User',
                    email: email
                }
            };
            
            localStorage.setItem('userData', JSON.stringify(userData));
        }
        
        // Redirect to onboarding or dashboard based on completion status
        if (onboardingCompleted) {
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'onboarding.html';
        }
    }, 1500);
}

/**
 * Sign up a new user
 * 
 * @param {string} firstName - The user's first name
 * @param {string} lastName - The user's last name
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 */
function signupUser(firstName, lastName, email, password) {
    // In a real app, this would make an API call to create a new user
    // For demo purposes, we'll just simulate a successful signup
    
    showNotification('Creating your account...', 'info');
    
    setTimeout(() => {
        // Set user as logged in
        localStorage.setItem('isLoggedIn', 'true');
        
        // Save user data
        const userData = {
            profile: {
                firstName: firstName,
                lastName: lastName,
                email: email
            }
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Redirect to onboarding
        window.location.href = 'onboarding.html';
    }, 1500);
}

/**
 * Open a modal dialog
 * 
 * @param {HTMLElement} modal - The modal element to open
 */
function openModal(modal) {
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
}

/**
 * Close a modal dialog
 * 
 * @param {HTMLElement} modal - The modal element to close
 */
function closeModal(modal) {
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

/**
 * Show a notification message
 * 
 * @param {string} message - The message to display
 * @param {string} type - The notification type ('success', 'error', 'info', or 'warning')
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('visible');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('visible');
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}