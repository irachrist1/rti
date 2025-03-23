document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const premiumPlanBtn = document.getElementById('premium-plan-btn');
    const enterprisePlanBtn = document.getElementById('enterprise-plan-btn');
    const paymentModal = document.getElementById('payment-modal');
    const successModal = document.getElementById('success-modal');
    const closeModals = document.querySelectorAll('.close-modal');
    const billingToggle = document.getElementById('billing-toggle');
    const billingOptions = document.querySelectorAll('.billing-option');
    const planPrice = document.getElementById('plan-price');
    const totalPrice = document.getElementById('total-price');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentMethodForms = document.querySelectorAll('.payment-method-form');
    const completePaymentBtn = document.getElementById('complete-payment');
    const gotoDashboardBtn = document.getElementById('goto-dashboard');
    
    // Set up event listeners
    if (premiumPlanBtn) {
        premiumPlanBtn.addEventListener('click', function() {
            openModal(paymentModal);
        });
    }
    
    if (enterprisePlanBtn) {
        enterprisePlanBtn.addEventListener('click', function() {
            // Simulate sending an email to sales
            alert('Thank you for your interest in our Enterprise plan. Our sales team will contact you shortly.');
        });
    }
    
    // Close modals when clicking on the X
    closeModals.forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modals when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });
    
    // Handle billing toggle
    if (billingToggle) {
        billingToggle.addEventListener('change', function() {
            // Update billing selection UI
            billingOptions.forEach(option => {
                option.classList.toggle('active');
            });
            
            // Update pricing display
            updatePriceDisplay();
        });
    }
    
    // Handle payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remove active class from all methods
            paymentMethods.forEach(m => m.classList.remove('active'));
            
            // Add active class to selected method
            this.classList.add('active');
            
            // Show the corresponding form
            const methodType = this.getAttribute('data-method');
            paymentMethodForms.forEach(form => {
                form.style.display = 'none';
            });
            
            document.getElementById(`${methodType}-form`).style.display = 'block';
        });
    });
    
    // Handle complete payment button
    if (completePaymentBtn) {
        completePaymentBtn.addEventListener('click', function() {
            processPayment();
        });
    }
    
    // Handle go to dashboard button in success modal
    if (gotoDashboardBtn) {
        gotoDashboardBtn.addEventListener('click', function() {
            closeModal(successModal);
            // Redirect to dashboard
            window.location.href = 'index.html#dashboard';
        });
    }
    
    /**
     * Update the price display based on billing frequency
     */
    function updatePriceDisplay() {
        const isAnnual = billingToggle.checked;
        const monthlyPrice = 50000;
        const annualPrice = monthlyPrice * 10; // 2 months free
        
        if (isAnnual) {
            planPrice.textContent = `${annualPrice.toLocaleString()} RWF/year`;
            totalPrice.textContent = `${annualPrice.toLocaleString()} RWF`;
        } else {
            planPrice.textContent = `${monthlyPrice.toLocaleString()} RWF/month`;
            totalPrice.textContent = `${monthlyPrice.toLocaleString()} RWF`;
        }
    }
    
    /**
     * Process payment (mock implementation)
     */
    function processPayment() {
        // In a real implementation, this would call the IREMBOPay API
        // For now, we'll just simulate a payment process
        
        // Show loading state
        completePaymentBtn.disabled = true;
        completePaymentBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        // Simulate API call delay
        setTimeout(function() {
            // Hide payment modal
            closeModal(paymentModal);
            
            // Reset button state
            completePaymentBtn.disabled = false;
            completePaymentBtn.textContent = 'Complete Payment';
            
            // Show success modal
            openModal(successModal);
            
            // Update user's subscription in localStorage
            saveSubscriptionData();
            
            // Update UI to reflect premium status
            updateUIForPremiumUser();
        }, 2000);
    }
    
    /**
     * Save subscription data to localStorage
     */
    function saveSubscriptionData() {
        const isAnnual = billingToggle.checked;
        const subscriptionData = {
            plan: 'premium',
            billing: isAnnual ? 'annual' : 'monthly',
            startDate: new Date().toISOString(),
            endDate: getSubscriptionEndDate(isAnnual),
            active: true
        };
        
        // Save to localStorage (in real app, this would be saved to a database)
        localStorage.setItem('rti_subscription', JSON.stringify(subscriptionData));
        localStorage.setItem('rti_user_tier', 'premium');
    }
    
    /**
     * Calculate subscription end date
     * 
     * @param {boolean} isAnnual - Whether the subscription is annual
     * @returns {string} - ISO string of end date
     */
    function getSubscriptionEndDate(isAnnual) {
        const endDate = new Date();
        if (isAnnual) {
            endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
            endDate.setMonth(endDate.getMonth() + 1);
        }
        return endDate.toISOString();
    }
    
    /**
     * Update UI elements to reflect premium status
     */
    function updateUIForPremiumUser() {
        // In a full implementation, this would update all UI elements
        // that show different content based on user tier
        document.querySelectorAll('.premium-only').forEach(element => {
            element.classList.remove('feature-locked');
        });
        
        // Change free plan button to show "Current Plan" on premium
        const freePlanBtn = document.getElementById('free-plan-btn');
        if (freePlanBtn) {
            freePlanBtn.textContent = 'Free Plan';
            freePlanBtn.disabled = false;
            freePlanBtn.classList.remove('current-plan');
        }
        
        // Change premium plan button to show "Current Plan"
        if (premiumPlanBtn) {
            premiumPlanBtn.textContent = 'Current Plan';
            premiumPlanBtn.disabled = true;
            premiumPlanBtn.classList.add('current-plan');
            premiumPlanBtn.classList.remove('premium-btn');
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
     * Check if user is already a premium subscriber and update UI accordingly
     */
    function checkSubscriptionStatus() {
        const subscriptionData = JSON.parse(localStorage.getItem('rti_subscription'));
        
        if (subscriptionData && subscriptionData.active) {
            updateUIForPremiumUser();
        }
    }
    
    // Initialize subscription status check
    checkSubscriptionStatus();
});