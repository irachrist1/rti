document.addEventListener('DOMContentLoaded', function() {
    // Initialize onboarding
    initializeOnboarding();
});

/**
 * Initialize the onboarding process
 */
function initializeOnboarding() {
    // Setup event listeners for onboarding steps
    setupEventListeners();
    
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // If user is not logged in, redirect to login page
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
    
    // Check if onboarding is already completed
    const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
    
    if (onboardingCompleted) {
        // Redirect to dashboard
        redirectToDashboard();
    }
}

/**
 * Setup event listeners for the onboarding process
 */
function setupEventListeners() {
    // Next buttons
    const nextButtons = document.querySelectorAll('.next-btn');
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextStep = this.getAttribute('data-next');
            if (nextStep === '2') {
                trackStep(1); // Track step 1 completion
                goToStep(nextStep);
            } else if (nextStep === '3') {
                const isValid = validateProfileForm();
                if (isValid) {
                    trackStep(2); // Track step 2 completion
                    goToStep(nextStep);
                    updateInterests();
                }
            } else if (nextStep === '4') {
                const isValid = validateInterests();
                if (isValid) {
                    trackStep(3); // Track step 3 completion
                    goToStep(nextStep);
                }
            }
        });
    });
    
    // Back buttons
    const backButtons = document.querySelectorAll('.back-btn');
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = this.getAttribute('data-prev');
            goToStep(prevStep);
        });
    });
    
    // Form validation on input
    const formInputs = document.querySelectorAll('#profile-form input, #profile-form select');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            validateField(this);
        });
        
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
    
    // Interest checkboxes
    const interestCheckboxes = document.querySelectorAll('.interest-item input[type="checkbox"]');
    interestCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            validateInterests();
        });
    });
    
    // Plan selection
    const planRadios = document.querySelectorAll('input[name="plan"]');
    planRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            selectPlan(this.value);
        });
    });
    
    // Complete onboarding button
    const completeButton = document.getElementById('complete-onboarding');
    if (completeButton) {
        completeButton.addEventListener('click', function() {
            completeOnboarding();
        });
    }
    
    // Tour buttons
    const startTourBtn = document.getElementById('start-tour');
    const skipTourBtn = document.getElementById('skip-tour');
    
    if (startTourBtn) {
        startTourBtn.addEventListener('click', function() {
            startTour();
        });
    }
    
    if (skipTourBtn) {
        skipTourBtn.addEventListener('click', function() {
            redirectToDashboard();
        });
    }
    
    // Tour navigation buttons
    const tooltipNextBtns = document.querySelectorAll('.tooltip-next');
    const tooltipPrevBtns = document.querySelectorAll('.tooltip-prev');
    const tooltipFinishBtn = document.querySelector('.tooltip-finish');
    
    tooltipNextBtns.forEach(button => {
        button.addEventListener('click', nextTooltip);
    });
    
    tooltipPrevBtns.forEach(button => {
        button.addEventListener('click', prevTooltip);
    });
    
    if (tooltipFinishBtn) {
        tooltipFinishBtn.addEventListener('click', finishTour);
    }
    
    // Close modal button
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeTourModal);
    }
}

/**
 * Go to a specific onboarding step
 * 
 * @param {string} stepNumber - The step number to go to
 */
function goToStep(stepNumber) {
    // Get all steps
    const steps = document.querySelectorAll('.onboarding-step');
    
    // Hide all steps
    steps.forEach(step => {
        step.classList.remove('active');
    });
    
    // Show the target step
    const targetStep = document.getElementById(`step-${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
        
        // Update progress bar
        updateProgress(parseInt(stepNumber));
        
        // Update step indicators
        updateStepIndicators(parseInt(stepNumber));
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
}

/**
 * Update the progress bar
 * 
 * @param {number} stepNumber - The current step number
 */
function updateProgress(stepNumber) {
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        const progressPercentage = ((stepNumber - 1) / 3) * 100;
        progressFill.style.width = `${progressPercentage}%`;
    }
}

/**
 * Update the step indicators
 * 
 * @param {number} currentStep - The current step number
 */
function updateStepIndicators(currentStep) {
    const stepIndicators = document.querySelectorAll('.step');
    
    stepIndicators.forEach(indicator => {
        const step = parseInt(indicator.getAttribute('data-step'));
        
        // Remove all classes first
        indicator.classList.remove('active', 'completed');
        
        // Add appropriate class
        if (step === currentStep) {
            indicator.classList.add('active');
        } else if (step < currentStep) {
            indicator.classList.add('completed');
        }
    });
}

/**
 * Validate the profile form
 * 
 * @returns {boolean} - Whether the form is valid
 */
function validateProfileForm() {
    const form = document.getElementById('profile-form');
    const formInputs = form.querySelectorAll('input[required], select[required]');
    
    let isValid = true;
    
    formInputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Validate an individual form field
 * 
 * @param {HTMLElement} field - The field to validate
 * @returns {boolean} - Whether the field is valid
 */
function validateField(field) {
    // Get field value
    const value = field.value.trim();
    
    // Check if required and empty
    if (field.hasAttribute('required') && value === '') {
        setFieldError(field, 'This field is required');
        return false;
    }
    
    // Validate email if field is email type
    if (field.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            setFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Validate phone if field is phone type
    if (field.id === 'phone' && value !== '') {
        const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
        if (!phoneRegex.test(value)) {
            setFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    // Clear any errors if field is valid
    clearFieldError(field);
    return true;
}

/**
 * Set error message for a field
 * 
 * @param {HTMLElement} field - The field to set the error on
 * @param {string} message - The error message
 */
function setFieldError(field, message) {
    // Remove any existing error
    clearFieldError(field);
    
    // Add error class to field
    field.classList.add('error');
    
    // Create error message element
    const errorElement = document.createElement('span');
    errorElement.className = 'form-error';
    errorElement.textContent = message;
    
    // Insert error message after the field
    field.parentNode.appendChild(errorElement);
}

/**
 * Clear error message for a field
 * 
 * @param {HTMLElement} field - The field to clear the error from
 */
function clearFieldError(field) {
    // Remove error class
    field.classList.remove('error');
    
    // Remove error message if it exists
    const existingError = field.parentNode.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
}

/**
 * Validate that at least one interest is selected
 * 
 * @returns {boolean} - Whether at least one interest is selected
 */
function validateInterests() {
    const checkboxes = document.querySelectorAll('.interest-item input[type="checkbox"]:checked');
    const errorContainer = document.querySelector('.interests-grid + .form-error');
    
    if (checkboxes.length === 0) {
        // Show error if no interests selected
        if (!errorContainer) {
            const interestsGrid = document.querySelector('.interests-grid');
            const error = document.createElement('div');
            error.className = 'form-error';
            error.textContent = 'Please select at least one interest';
            interestsGrid.parentNode.insertBefore(error, interestsGrid.nextSibling);
        }
        return false;
    } else {
        // Clear error if interests are selected
        if (errorContainer) {
            errorContainer.remove();
        }
        return true;
    }
}

/**
 * Update interests based on user profile and industry selection
 */
function updateInterests() {
    const industry = document.getElementById('industry').value;
    
    // If industry is selected, pre-select related interests
    if (industry) {
        const relatedInterests = getRelatedInterests(industry);
        
        // Check related interest checkboxes
        relatedInterests.forEach(interest => {
            const checkbox = document.getElementById(interest);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }
}

/**
 * Get interests related to a specific industry
 * 
 * @param {string} industry - The industry
 * @returns {array} - Array of related interest IDs
 */
function getRelatedInterests(industry) {
    const interestMap = {
        'Technology': ['market-research', 'regulatory-compliance', 'sector-trends'],
        'Finance': ['regulatory-compliance', 'tax-compliance', 'funding-opportunities'],
        'Agriculture': ['sector-trends', 'export-regulations', 'market-research'],
        'Healthcare': ['regulatory-compliance', 'sector-trends', 'investment-opportunities'],
        'Manufacturing': ['export-regulations', 'tax-compliance', 'competitor-analysis'],
        'Retail': ['market-research', 'competitor-analysis', 'sector-trends'],
        'Tourism': ['market-research', 'business-licensing', 'competitor-analysis'],
        'Energy': ['regulatory-compliance', 'investment-opportunities', 'funding-opportunities'],
        'Education': ['sector-trends', 'funding-opportunities', 'regulatory-compliance']
    };
    
    return interestMap[industry] || [];
}

/**
 * Handle plan selection
 * 
 * @param {string} planType - The selected plan type ('free' or 'premium')
 */
function selectPlan(planType) {
    localStorage.setItem('selectedPlan', planType);
}

/**
 * Complete the onboarding process
 */
function completeOnboarding() {
    // Collect user data from forms
    const userData = {
        profile: {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            company: document.getElementById('company').value,
            industry: document.getElementById('industry').value,
            companySize: document.getElementById('company-size').value
        },
        interests: getSelectedInterests(),
        plan: document.querySelector('input[name="plan"]:checked').value
    };
    
    // Save user data to localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('onboardingCompleted', 'true');
    
    // Set plan in user preferences
    const selectedPlan = userData.plan;
    localStorage.setItem('rti_user_tier', selectedPlan);
    
    // Track onboarding completion
    trackCompletion(userData);
    
    // Handle plan-specific actions
    if (selectedPlan === 'premium') {
        // In a real implementation, redirect to payment flow
        // For demo purposes, just save as premium
        const subscriptionData = {
            plan: 'premium',
            billing: 'monthly',
            startDate: new Date().toISOString(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
            active: true
        };
        localStorage.setItem('rti_subscription', JSON.stringify(subscriptionData));
    } else if (selectedPlan === 'enterprise') {
        // For enterprise plan, we would typically trigger a contact sales flow
        // For demo, save enterprise plan status
        const subscriptionData = {
            plan: 'enterprise',
            billing: 'custom',
            startDate: new Date().toISOString(),
            status: 'pending_contact',
            active: true
        };
        localStorage.setItem('rti_subscription', JSON.stringify(subscriptionData));
    }
    
    // Show welcome animation before tour or dashboard
    showWelcomeAnimation();
}

/**
 * Show welcome animation before proceeding to tour modal or dashboard
 */
function showWelcomeAnimation() {
    const welcomeAnimation = document.getElementById('welcome-animation');
    
    if (welcomeAnimation) {
        // Show animation
        welcomeAnimation.classList.add('show');
        
        // Hide onboarding container
        const onboardingContainer = document.querySelector('.onboarding-container');
        if (onboardingContainer) {
            onboardingContainer.style.display = 'none';
        }
        
        // After animation completes, proceed to tour modal
        setTimeout(() => {
            welcomeAnimation.classList.remove('show');
            
            // After fade out, show tour modal
            setTimeout(() => {
                welcomeAnimation.style.display = 'none';
                showTourModal();
            }, 300);
        }, 2500);
    } else {
        // If animation element doesn't exist, just show tour modal
        showTourModal();
    }
}

/**
 * Show the tour modal after onboarding completion
 */
function showTourModal() {
    const tourModal = document.getElementById('tour-modal');
    if (tourModal) {
        tourModal.style.display = 'flex';
    }
}

/**
 * Close the tour modal
 */
function closeTourModal() {
    const tourModal = document.getElementById('tour-modal');
    if (tourModal) {
        tourModal.style.display = 'none';
    }
}

/**
 * Start the platform tour
 */
function startTour() {
    // Close the tour modal
    closeTourModal();
    
    // Hide onboarding container
    const onboardingContainer = document.querySelector('.onboarding-container');
    if (onboardingContainer) {
        onboardingContainer.style.display = 'none';
    }
    
    // Create platform preview skeleton with navigation
    createPlatformPreview();
    
    // Set CSS to handle body size
    document.body.classList.add('tour-mode');
    
    // Show first tooltip
    showTooltip(0);
    
    // Track tour start
    trackEvent('tour_started');
}

/**
 * Create a platform preview for the tour
 */
function createPlatformPreview() {
    const previewHTML = `
        <div class="platform-preview">
            <div class="preview-sidebar">
                <div class="preview-logo">
                    <img src="https://via.placeholder.com/100/ffffff?text=RTI" alt="RTI Consultant Logo">
                    <h2>RTI Consultant</h2>
                </div>
                <ul class="preview-nav">
                    <li id="tour-dashboard-link" class="active"><i class="fas fa-tachometer-alt"></i> <span>Dashboard</span></li>
                    <li id="tour-insights-link"><i class="fas fa-chart-line"></i> <span>Market Insights</span></li>
                    <li id="tour-regulatory-link"><i class="fas fa-balance-scale"></i> <span>Regulatory Guidance</span></li>
                    <li id="tour-subscription-link"><i class="fas fa-tags"></i> <span>Subscription</span></li>
                    <li id="tour-account-link"><i class="fas fa-user"></i> <span>My Account</span></li>
                </ul>
            </div>
            <div class="preview-content">
                <div class="preview-placeholder">
                    <h2>Platform Preview</h2>
                    <p>This is a preview of the RTI Consultant platform. Follow the guided tour to learn more.</p>
                </div>
            </div>
        </div>
    `;
    
    // Add preview to DOM
    document.body.insertAdjacentHTML('beforeend', previewHTML);
    
    // Add event listeners to nav items
    document.getElementById('tour-dashboard-link').addEventListener('click', function() {
        updateActiveTourLink(this);
        showTooltip(0);
    });
    
    document.getElementById('tour-insights-link').addEventListener('click', function() {
        updateActiveTourLink(this);
        showTooltip(1);
    });
    
    document.getElementById('tour-regulatory-link').addEventListener('click', function() {
        updateActiveTourLink(this);
        showTooltip(2);
    });
    
    document.getElementById('tour-subscription-link').addEventListener('click', function() {
        updateActiveTourLink(this);
        showTooltip(3);
    });
    
    document.getElementById('tour-account-link').addEventListener('click', function() {
        updateActiveTourLink(this);
        showTooltip(4);
    });
}

/**
 * Update active link in the tour navigation
 * 
 * @param {HTMLElement} clickedLink - The clicked navigation link
 */
function updateActiveTourLink(clickedLink) {
    // Remove active class from all links
    const navLinks = document.querySelectorAll('.preview-nav li');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to clicked link
    clickedLink.classList.add('active');
}

/**
 * Show a specific tooltip in the tour
 * 
 * @param {number} index - The index of the tooltip to show
 */
function showTooltip(index) {
    // Hide all tooltips first
    hideAllTooltips();
    
    // Array of tooltip IDs
    const tooltips = [
        'dashboard-tooltip',
        'insights-tooltip',
        'regulatory-tooltip',
        'subscription-tooltip',
        'account-tooltip'
    ];
    
    // Show the selected tooltip
    const tooltipId = tooltips[index];
    const tooltip = document.getElementById(tooltipId);
    
    if (tooltip) {
        tooltip.style.display = 'block';
        
        // Position tooltip next to corresponding nav item
        positionTooltip(tooltip, index);
    }
    
    // Update active nav link
    const navLinks = document.querySelectorAll('.preview-nav li');
    navLinks.forEach((link, i) => {
        link.classList.toggle('active', i === index);
    });
}

/**
 * Hide all tooltips
 */
function hideAllTooltips() {
    const tooltips = document.querySelectorAll('.tour-tooltip');
    tooltips.forEach(tooltip => {
        tooltip.style.display = 'none';
    });
}

/**
 * Move to the next tooltip
 */
function nextTooltip() {
    const visibleTooltip = document.querySelector('.tour-tooltip[style*="display: block"]');
    if (visibleTooltip) {
        const tooltips = ['dashboard-tooltip', 'insights-tooltip', 'regulatory-tooltip', 'subscription-tooltip', 'account-tooltip'];
        const currentIndex = tooltips.indexOf(visibleTooltip.id);
        const nextIndex = (currentIndex + 1) % tooltips.length;
        
        showTooltip(nextIndex);
    }
}

/**
 * Move to the previous tooltip
 */
function prevTooltip() {
    const visibleTooltip = document.querySelector('.tour-tooltip[style*="display: block"]');
    if (visibleTooltip) {
        const tooltips = ['dashboard-tooltip', 'insights-tooltip', 'regulatory-tooltip', 'subscription-tooltip', 'account-tooltip'];
        const currentIndex = tooltips.indexOf(visibleTooltip.id);
        const prevIndex = (currentIndex - 1 + tooltips.length) % tooltips.length;
        
        showTooltip(prevIndex);
    }
}

/**
 * Finish the tour and redirect to dashboard
 */
function finishTour() {
    // Remove tour elements
    const platformPreview = document.querySelector('.platform-preview');
    if (platformPreview) {
        platformPreview.remove();
    }
    
    // Hide all tooltips
    hideAllTooltips();
    
    // Remove tour mode class
    document.body.classList.remove('tour-mode');
    
    // Redirect to dashboard
    redirectToDashboard();
    
    // Track tour completion
    trackEvent('tour_completed');
}

/**
 * Redirect to the dashboard page
 */
function redirectToDashboard() {
    // Check if the welcome animation is shown
    const welcomeAnimation = document.getElementById('welcome-animation');
    if (welcomeAnimation && welcomeAnimation.classList.contains('show')) {
        // Wait for the animation to complete before redirecting
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        // Redirect immediately if no animation is shown
        window.location.href = 'dashboard.html';
    }
}

/**
 * Position a tooltip next to its corresponding navigation item
 * 
 * @param {HTMLElement} tooltip - The tooltip element
 * @param {number} navIndex - The index of the navigation item
 */
function positionTooltip(tooltip, navIndex) {
    const navItems = document.querySelectorAll('.preview-nav li');
    
    if (navItems[navIndex]) {
        const navItem = navItems[navIndex];
        const navRect = navItem.getBoundingClientRect();
        
        tooltip.style.top = `${navRect.top}px`;
        tooltip.style.left = `${navRect.right + 20}px`;
    }
}

/**
 * Get all selected interests
 * 
 * @returns {array} - Array of selected interest values
 */
function getSelectedInterests() {
    const checkboxes = document.querySelectorAll('.interest-item input[type="checkbox"]:checked');
    const interests = [];
    
    checkboxes.forEach(checkbox => {
        interests.push(checkbox.value);
    });
    
    return interests;
}

/**
 * Track step completion
 * 
 * @param {number} stepNumber - The completed step number
 */
function trackStep(stepNumber) {
    trackEvent('onboarding_step_completed', { step: stepNumber });
}

/**
 * Track onboarding completion
 * 
 * @param {object} userData - The user data
 */
function trackCompletion(userData) {
    trackEvent('onboarding_completed', {
        industry: userData.profile.industry,
        company_size: userData.profile.companySize,
        interests_count: userData.interests.length,
        selected_plan: userData.plan
    });
}

/**
 * Track an event (analytics)
 * 
 * @param {string} eventName - The name of the event
 * @param {object} properties - Event properties
 */
function trackEvent(eventName, properties = {}) {
    // In a real implementation, this would send data to an analytics service
    console.log(`Event tracked: ${eventName}`, properties);
}