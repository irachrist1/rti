document.addEventListener('DOMContentLoaded', function() {
    // Set up tab navigation
    setupTabs();
    
    // Set up form submissions
    setupForms();
    
    // Handle various button clicks
    setupButtonListeners();
    
    // Check subscription status
    checkSubscriptionStatus();
});

/**
 * Set up tab navigation
 */
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get target tab
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding pane
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

/**
 * Set up form submissions
 */
function setupForms() {
    // Profile form
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real application, this would send the form data to the server
            // For demo purposes, just show a success message
            showNotification('Profile updated successfully!', 'success');
            
            // Update display name
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const nameElement = document.getElementById('user-name');
            
            if (nameElement && firstName && lastName) {
                nameElement.textContent = `${firstName} ${lastName}`;
            }
        });
    }
    
    // Password form
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Simple validation
            if (!currentPassword || !newPassword || !confirmPassword) {
                showNotification('Please fill in all password fields.', 'error');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showNotification('New passwords do not match.', 'error');
                return;
            }
            
            // For demo purposes, just show success and clear the form
            showNotification('Password updated successfully!', 'success');
            this.reset();
        });
    }
    
    // Cancel subscription form
    const cancelForm = document.getElementById('cancel-form');
    if (cancelForm) {
        cancelForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Close modal
            const cancelModal = document.getElementById('cancel-modal');
            closeModal(cancelModal);
            
            // Update subscription status in localStorage
            updateSubscriptionStatus('free');
            
            // Show success message
            showNotification('Your subscription has been cancelled. You will still have access to premium features until the end of your billing period.', 'success');
            
            // Redirect to subscription page
            setTimeout(() => {
                window.location.href = 'subscription.html';
            }, 3000);
        });
    }
}

/**
 * Set up button click listeners
 */
function setupButtonListeners() {
    // Cancel subscription button
    const cancelPlanBtn = document.getElementById('cancel-plan-btn');
    if (cancelPlanBtn) {
        cancelPlanBtn.addEventListener('click', function() {
            const cancelModal = document.getElementById('cancel-modal');
            openModal(cancelModal);
        });
    }
    
    // Change plan button
    const changePlanBtn = document.getElementById('change-plan-btn');
    if (changePlanBtn) {
        changePlanBtn.addEventListener('click', function() {
            window.location.href = 'subscription.html';
        });
    }
    
    // Enable 2FA button
    const enable2faBtn = document.getElementById('enable-2fa-btn');
    if (enable2faBtn) {
        enable2faBtn.addEventListener('click', function() {
            alert('Two-factor authentication setup would be implemented here');
        });
    }
    
    // Deactivate account button
    const deactivateAccountBtn = document.getElementById('deactivate-account-btn');
    if (deactivateAccountBtn) {
        deactivateAccountBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to deactivate your account? You can reactivate it at any time by logging in.')) {
                showNotification('Your account has been deactivated.', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }
        });
    }
    
    // Delete account button
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            if (confirm('Are you absolutely sure you want to delete your account? This action CANNOT be undone and all your data will be permanently lost.')) {
                showNotification('Your account has been scheduled for deletion.', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }
        });
    }
    
    // Close modal buttons
    const closeModalBtns = document.querySelectorAll('.close-modal, .close-modal-btn');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });
}

/**
 * Check subscription status
 */
function checkSubscriptionStatus() {
    // Get subscription data from localStorage (in a real app, this would come from an API)
    const subscriptionData = JSON.parse(localStorage.getItem('rti_subscription'));
    const userTier = localStorage.getItem('rti_user_tier');
    
    // Set membership badge based on subscription
    const membershipBadge = document.querySelector('.membership-badge');
    if (membershipBadge) {
        if (userTier === 'premium') {
            membershipBadge.textContent = 'Premium Member';
            membershipBadge.classList.add('premium');
        } else {
            membershipBadge.textContent = 'Free Member';
            membershipBadge.classList.remove('premium');
        }
    }
}

/**
 * Update subscription status
 * 
 * @param {string} plan - The plan to update to ('free', 'premium', or 'enterprise')
 */
function updateSubscriptionStatus(plan) {
    // Save to localStorage (in real app, this would be saved to a database)
    localStorage.setItem('rti_user_tier', plan);
    
    if (plan === 'free') {
        // Create a cancelled subscription record
        const subscriptionData = {
            plan: 'free',
            startDate: null,
            endDate: null,
            active: true
        };
        
        localStorage.setItem('rti_subscription', JSON.stringify(subscriptionData));
    }
}

/**
 * Open a modal dialog
 * 
 * @param {HTMLElement} modal - The modal element to open
 */
function openModal(modal) {
    if (modal) {
        modal.style.display = 'flex';
        
        // Prevent page scrolling when modal is open
        document.body.style.overflow = 'hidden';
        
        // Trigger animation
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
        
        // Wait for the animation to complete before hiding the modal
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
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