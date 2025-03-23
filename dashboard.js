document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI components
    initializeSidebar();
    initializeDropdowns();
    initializeUserInfo();
    
    // Initialize charts
    initializeMarketTrendChart();
    initializeIndustryChart();
    initializeInvestmentChart();
    
    // Set up event listeners
    setupEventListeners();
    
    // Check if user just completed onboarding
    checkNewUserStatus();
    
    // Setup section navigation
    setupSectionNavigation();

    // Setup tab navigation for Market Insights and Regulatory Guidance
    setupTabNavigation();

    // Setup account functionality
    setupAccountFunctionality();

    // Add Help & Support to sidebar if it doesn't exist
    const sidebarNav = document.querySelector('.sidebar-nav');
    if (sidebarNav && !document.querySelector('[data-section="help-support-section"]')) {
        const helpSupportLink = document.createElement('a');
        helpSupportLink.className = 'nav-link help-button';
        helpSupportLink.setAttribute('data-section', 'help-support-section');
        helpSupportLink.innerHTML = '<i class="fas fa-question-circle"></i><span>Help & Support</span>';
        sidebarNav.appendChild(helpSupportLink);
    }
    
    // Initialize Help & Support section
    initializeHelpSupport();
    
    // Add to setupSectionNavigation function if it exists
    if (typeof setupSectionNavigation === 'function') {
        // Make sure Help & Support section is included in section navigation
        const helpSupportSection = document.getElementById('help-support-section');
        if (helpSupportSection) {
            const allSections = document.querySelectorAll('.content-section');
            const sectionLinks = document.querySelectorAll('[data-section]');
            
            sectionLinks.forEach(link => {
                if (link.getAttribute('data-section') === 'help-support-section') {
                    link.addEventListener('click', () => {
                        // Hide all sections
                        allSections.forEach(section => {
                            section.style.display = 'none';
                        });
                        
                        // Show the target section
                        helpSupportSection.style.display = 'block';
                        
                        // Update active link
                        sectionLinks.forEach(navLink => {
                            navLink.classList.remove('active');
                        });
                        link.classList.add('active');
                        
                        // Update page title
                        document.querySelector('.page-title').textContent = 'Help & Support';
                    });
                }
            });
        }
    }
});

/**
 * Check if user just completed onboarding to show welcome notification
 */
function checkNewUserStatus() {
    // Check if this is the first time visiting dashboard after onboarding
    const isNewlyOnboarded = sessionStorage.getItem('newlyOnboarded') !== 'seen';
    const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
    
    if (onboardingCompleted && isNewlyOnboarded) {
        // Get user data
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        const firstName = userData.profile?.firstName || 'there';
        
        // Show welcome toast
        showWelcomeToast(firstName);
        
        // Mark as seen so it doesn't show again
        sessionStorage.setItem('newlyOnboarded', 'seen');
    }
}

/**
 * Show welcome toast notification to new users
 * 
 * @param {string} firstName - User's first name
 */
function showWelcomeToast(firstName) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'welcome-toast';
    
    // Add toast content
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-rocket"></i>
        </div>
        <div class="toast-content">
            <h3>Welcome to your dashboard, ${firstName}!</h3>
            <p>Your business intelligence journey begins now. Explore your personalized insights.</p>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to DOM
    document.body.appendChild(toast);
    
    // Show toast after a short delay
    setTimeout(() => {
        toast.classList.add('show');
    }, 500);
    
    // Add close button functionality
    const closeButton = toast.querySelector('.toast-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        });
    }
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
        if (document.body.contains(toast)) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    toast.remove();
                }
            }, 300);
        }
    }, 8000);
}

/**
 * Initialize the sidebar navigation
 */
function initializeSidebar() {
    // Get all sidebar links
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    // Add click event listener to each link
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get the section ID to show
            const sectionId = this.getAttribute('data-section');
            if (sectionId) {
                // If this is a logout link, handle logout
                if (sectionId === 'logout') {
                    logout();
                    return;
                }
                
                // Navigate to the section
                navigateToSection(sectionId);
            }
        });
    });
    
    // Set the initial active link based on URL hash
    const hash = window.location.hash.substring(1);
    if (hash) {
        const hashLink = document.querySelector(`.sidebar-link[data-section="${hash}"]`);
        if (hashLink) {
            hashLink.click();
        } else {
            // Default to dashboard if hash doesn't match any section
            const defaultLink = document.querySelector('.sidebar-link[data-section="dashboard-section"]');
            if (defaultLink) defaultLink.click();
        }
    } else {
        // Default to dashboard if no hash
        const defaultLink = document.querySelector('.sidebar-link[data-section="dashboard-section"]');
        if (defaultLink) defaultLink.click();
    }
    
    // Add My Account link if it doesn't exist
    addMyAccountLink();
}

/**
 * Add My Account link to the sidebar if it doesn't exist
 */
function addMyAccountLink() {
    const sidebarNav = document.querySelector('.sidebar-nav');
    const accountLink = document.querySelector('.sidebar-link[data-section="account-section"]');
    
    if (sidebarNav && !accountLink) {
        // Create the account link
        const newAccountLink = document.createElement('a');
        newAccountLink.className = 'sidebar-link';
        newAccountLink.setAttribute('data-section', 'account-section');
        newAccountLink.innerHTML = '<i class="fas fa-user-circle"></i><span>My Account</span>';
        
        // Find the logout link (usually the last item)
        const logoutLink = document.querySelector('.sidebar-link[data-section="logout"]');
        
        if (logoutLink) {
            // Insert the account link before the logout link
            sidebarNav.insertBefore(newAccountLink, logoutLink);
        } else {
            // If no logout link, append to the end
            sidebarNav.appendChild(newAccountLink);
        }
        
        // Add event listener
        newAccountLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            
            // Add active class to this link
            this.classList.add('active');
            
            // Navigate to the account section
            navigateToSection('account-section');
        });
    }
}

/**
 * Initialize dropdown menus
 */
function initializeDropdowns() {
    // User dropdown
    const userProfile = document.querySelector('.user-profile');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (userProfile && userDropdown) {
        userProfile.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
            
            // Hide notification dropdown if open
            if (notificationDropdown) {
                notificationDropdown.style.display = 'none';
            }
        });
    }
    
    // Notification dropdown
    const notificationButton = document.querySelector('.notifications .icon-button');
    const notificationDropdown = document.getElementById('notification-dropdown');
    
    if (notificationButton && notificationDropdown) {
        notificationButton.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationDropdown.style.display = notificationDropdown.style.display === 'block' ? 'none' : 'block';
            
            // Hide user dropdown if open
            if (userDropdown) {
                userDropdown.style.display = 'none';
            }
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        if (userDropdown) {
            userDropdown.style.display = 'none';
        }
        if (notificationDropdown) {
            notificationDropdown.style.display = 'none';
        }
    });
    
    // Prevent dropdown from closing when clicking inside
    if (userDropdown) {
        userDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    if (notificationDropdown) {
        notificationDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

/**
 * Initialize user information
 */
function initializeUserInfo() {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));
    const subscriptionTier = localStorage.getItem('subscriptionTier') || 'free';
    
    if (userData) {
        // Update user name in welcome message
        const userFirstName = document.getElementById('user-first-name');
        if (userFirstName && userData.profile && userData.profile.firstName) {
            userFirstName.textContent = userData.profile.firstName;
        }
        
        // Update user info in header
        const userName = document.querySelector('.user-name');
        if (userName && userData.profile) {
            userName.textContent = `${userData.profile.firstName || ''} ${userData.profile.lastName || ''}`.trim();
        }
        
        // Update dropdown user info
        const dropdownUserName = document.getElementById('dropdown-user-name');
        const dropdownUserEmail = document.getElementById('dropdown-user-email');
        
        if (dropdownUserName && userData.profile) {
            dropdownUserName.textContent = `${userData.profile.firstName || ''} ${userData.profile.lastName || ''}`.trim();
        }
        
        if (dropdownUserEmail && userData.profile && userData.profile.email) {
            dropdownUserEmail.textContent = userData.profile.email;
        }
    }
    
    // Update subscription badge
    const subscriptionBadge = document.getElementById('subscription-badge');
    const upgradeButton = document.getElementById('upgrade-button');
    
    if (subscriptionBadge) {
        if (subscriptionTier === 'premium') {
            subscriptionBadge.textContent = 'Premium';
            subscriptionBadge.className = 'subscription-badge premium';
            
            if (upgradeButton) {
                upgradeButton.textContent = 'Manage Plan';
            }
        } else {
            subscriptionBadge.textContent = 'Free Plan';
            subscriptionBadge.className = 'subscription-badge free';
            
            if (upgradeButton) {
                upgradeButton.textContent = 'Upgrade Plan';
            }
        }
    }
}

/**
 * Initialize Market Trend Chart
 */
function initializeMarketTrendChart() {
    const ctx = document.getElementById('market-trend-chart');
    if (!ctx) return;
    
    // Sample data
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Technology',
                data: [5.2, 5.8, 6.5, 7.2, 8.1, 8.5, 9.2, 9.8, 10.5, 11.2, 11.8, 12.5],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Agriculture',
                data: [7.5, 7.8, 8.1, 8.5, 8.9, 9.2, 9.5, 9.8, 10.2, 10.5, 10.8, 11.2],
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Manufacturing',
                data: [4.5, 4.8, 5.2, 5.5, 5.8, 6.1, 6.5, 6.8, 7.2, 7.5, 7.8, 8.2],
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    };
    
    // Chart configuration
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        boxWidth: 12,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed.y + '%';
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            }
        }
    };
    
    // Create chart
    const marketTrendChart = new Chart(ctx, config);
    
    // Year filter change handler
    const yearFilter = document.getElementById('chart-year-filter');
    if (yearFilter) {
        yearFilter.addEventListener('change', function() {
            // In a real app, you would fetch new data based on selected year
            // For this demo, we'll just randomize the data
            
            const selectedYear = this.value;
            console.log(`Year filter changed to: ${selectedYear}`);
            
            // Update chart with randomly adjusted data
            marketTrendChart.data.datasets.forEach(dataset => {
                dataset.data = dataset.data.map(value => {
                    // Random adjustment between -2% and +2%
                    const adjustment = (Math.random() * 4 - 2);
                    return Math.max(1, value + adjustment);
                });
            });
            
            marketTrendChart.update();
        });
    }
}

/**
 * Initialize Industry Distribution Chart
 */
function initializeIndustryChart() {
    const ctx = document.getElementById('industry-chart');
    if (!ctx) return;
    
    // Sample data
    const data = {
        labels: ['Agriculture', 'Technology', 'Manufacturing', 'Finance', 'Tourism', 'Others'],
        datasets: [{
            data: [25, 30, 15, 12, 10, 8],
            backgroundColor: [
                '#27ae60',
                '#3498db',
                '#f39c12',
                '#9b59b6',
                '#e74c3c',
                '#95a5a6'
            ],
            borderWidth: 0,
            borderRadius: 5
        }]
    };
    
    // Chart configuration
    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12,
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ${value}%`;
                        }
                    }
                }
            }
        }
    };
    
    // Create chart
    new Chart(ctx, config);
}

/**
 * Initialize Investment by Region Chart
 */
function initializeInvestmentChart() {
    const ctx = document.getElementById('investment-chart');
    if (!ctx) return;
    
    // Sample data
    const data = {
        labels: ['Kigali', 'Eastern', 'Western', 'Northern', 'Southern'],
        datasets: [{
            label: 'Investment (USD Millions)',
            data: [58, 12, 8, 6, 5],
            backgroundColor: 'rgba(52, 152, 219, 0.6)',
            borderColor: 'rgba(52, 152, 219, 1)',
            borderWidth: 1
        }]
    };
    
    // Chart configuration
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            return `${label}: $${context.parsed.y}M`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value + 'M';
                        }
                    },
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    };
    
    // Create chart
    new Chart(ctx, config);
}

/**
 * Set up event listeners for dashboard interactions
 */
function setupEventListeners() {
    // Setup logout button
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    // Setup help & support button
    const helpButton = document.querySelector('.help-button');
    if (helpButton) {
        helpButton.addEventListener('click', function() {
            navigateToSection('help-support-section');
        });
    }
    
    // Upgrade button click
    const upgradeButton = document.getElementById('upgrade-button');
    if (upgradeButton) {
        upgradeButton.addEventListener('click', function() {
            window.location.href = 'subscription.html';
        });
    }
    
    // View all regulations button
    const viewAllRegulationsBtn = document.querySelector('.regulations-list + .card-actions .view-all-btn');
    if (viewAllRegulationsBtn) {
        viewAllRegulationsBtn.addEventListener('click', function() {
            window.location.href = 'regulatory.html';
        });
    }
    
    // View all news button
    const viewAllNewsBtn = document.querySelector('.news-grid + .card-actions .view-all-btn');
    if (viewAllNewsBtn) {
        viewAllNewsBtn.addEventListener('click', function() {
            window.location.href = 'news.html';
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-link');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Mark all notifications as read
    const markAllReadBtn = document.querySelector('.mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            const unreadNotifications = document.querySelectorAll('.notification-item.unread');
            unreadNotifications.forEach(item => {
                item.classList.remove('unread');
            });
            
            // Update notification count
            const notificationBadge = document.querySelector('.notification-badge');
            if (notificationBadge) {
                notificationBadge.style.display = 'none';
            }
        });
    }
    
    // Add event listeners for all FAQs
    setupFaqToggle();
    
    // Subscription page event listeners
    setupSubscriptionEvents();
    
    // Setup logout functionality
    document.getElementById('logout-button')?.addEventListener('click', logout);
}

/**
 * Logout user
 */
function logout() {
    // Clear all authentication-related data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('onboardingCompleted');
    sessionStorage.removeItem('newlyOnboarded');
    
    // You might want to keep user profile data for easier login next time
    // but clear any session-specific data
    localStorage.removeItem('rti_session_id');
    
    // Show notification before redirecting
    const toast = document.createElement('div');
    toast.className = 'welcome-toast';
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-sign-out-alt"></i>
        </div>
        <div class="toast-content">
            <h3>Logging out...</h3>
            <p>You have been successfully logged out. Redirecting to login page.</p>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }, 100);
}

/**
 * Handle window resize for responsive adjustments
 */
window.addEventListener('resize', function() {
    // Adjust charts on window resize
    const charts = Chart.instances;
    for (let i = 0; i < charts.length; i++) {
        charts[i].resize();
    }
});

/**
 * Setup section navigation
 */
function setupSectionNavigation() {
    // Get all navigation links that have data-section attribute
    const navLinks = document.querySelectorAll('[data-section]');
    const sections = document.querySelectorAll('.content-section');
    
    // Set active section based on URL hash
    function setActiveSectionFromHash() {
        const hash = window.location.hash.substring(1);
        let targetSection = 'dashboard-section'; // Default section
        
        if (hash) {
            // Map hash to section ID
            const sectionMap = {
                'dashboard': 'dashboard-section',
                'market-insights': 'market-insights-section',
                'regulatory': 'regulatory-section',
                'subscription': 'subscription-section',
                'account': 'account-section',
                'help-support': 'help-support-section'
            };
            
            targetSection = sectionMap[hash] || targetSection;
        }
        
        // Activate the target section
        navigateToSection(targetSection);
    }
    
    // Add click handlers to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            navigateToSection(sectionId);
            
            // Update URL hash without scrolling
            const hash = sectionId.replace('-section', '');
            history.pushState(null, null, `#${hash}`);
            
            // If on mobile, close the sidebar after navigation
            const sidebar = document.querySelector('.sidebar');
            if (sidebar && sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
            }
        });
    });
    
    // Listen for hash changes
    window.addEventListener('hashchange', setActiveSectionFromHash);
    
    // Set initial active section
    setActiveSectionFromHash();
}

/**
 * Navigate to a specific section
 * 
 * @param {string} sectionId - The ID of the section to navigate to
 */
function navigateToSection(sectionId) {
    const navLinks = document.querySelectorAll('[data-section]');
    const sections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('page-title');
    
    // Update active class on menu items
    navLinks.forEach(link => {
        const linkSectionId = link.getAttribute('data-section');
        
        // Handle both menu-item and standalone links like help-button
        if (link.closest('.menu-item')) {
            const menuItem = link.closest('.menu-item');
            if (linkSectionId === sectionId) {
                menuItem.classList.add('active');
            } else {
                menuItem.classList.remove('active');
            }
        } else {
            // For non-menu items like sidebar footer buttons
            if (linkSectionId === sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
    
    // Update visible section
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.style.display = 'block';
            section.classList.add('active');
            
            // Update page title
            if (pageTitle) {
                const sectionTitles = {
                    'dashboard-section': 'Dashboard',
                    'market-insights-section': 'Market Insights',
                    'regulatory-section': 'Regulatory Guidance',
                    'subscription-section': 'Subscription Plans',
                    'account-section': 'My Account',
                    'help-support-section': 'Help & Support'
                };
                
                pageTitle.textContent = sectionTitles[sectionId] || 'Dashboard';
            }
        } else {
            section.style.display = 'none';
            section.classList.remove('active');
        }
    });
}

/**
 * Setup tab navigation for Market Insights and Regulatory Guidance sections
 */
function setupTabNavigation() {
    // Set up Market Insights tabs
    setupTabsForSection('market-insights-section');
    
    // Set up Regulatory Guidance tabs
    setupTabsForSection('regulatory-section');
    
    // Restore form event handlers
    setupFormEventHandlers();
}

/**
 * Re-initialize event handlers for forms that may have been cloned
 */
function setupFormEventHandlers() {
    // Setup Market Insights form
    setupMarketInsightsForm();
    
    // Setup Regulatory Assistant
    setupRegulatoryAssistant();
}

/**
 * Setup event handlers for the Market Insights form
 */
function setupMarketInsightsForm() {
    // Get all forms (both original and cloned)
    const forms = document.querySelectorAll('#market-insights-form');
    
    forms.forEach(form => {
        // Remove any existing event listeners by cloning and replacing
        const newForm = form.cloneNode(true);
        if (form.parentNode) {
            form.parentNode.replaceChild(newForm, form);
        }
        
        // Add new event listener
        newForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
            submitButton.disabled = true;
            
            // Get form data
            const industry = this.querySelector('#industry-select').value;
            const location = this.querySelector('#location-input').value;
            const timePeriod = this.querySelector('#time-period').value;
            
            // Simulate API request with timeout
            setTimeout(() => {
                // Find results container
                let resultsContainer = document.querySelector('#custom-insights-results');
                
                // If in tab view, find the one in the current tab
                const activeTab = document.querySelector('.tab-content-custom');
                if (activeTab) {
                    resultsContainer = activeTab.querySelector('#custom-insights-results') || resultsContainer;
                }
                
                if (resultsContainer) {
                    // Show the results
                    resultsContainer.style.display = 'block';
                    
                    // Populate results
                    const resultsContent = resultsContainer.querySelector('#insights-results-content');
                    if (resultsContent) {
                        resultsContent.innerHTML = generateInsightsHTML(industry, location, timePeriod);
                    }
                    
                    // Setup close button
                    const closeButton = resultsContainer.querySelector('.close-insights-btn');
                    if (closeButton) {
                        closeButton.addEventListener('click', function() {
                            resultsContainer.style.display = 'none';
                        });
                    }
                    
                    // Scroll to results
                    resultsContainer.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Restore button
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    });
}

/**
 * Setup Regulatory AI Assistant
 */
function setupRegulatoryAssistant() {
    // Get all regulatory query inputs (both original and cloned)
    const queryInputs = document.querySelectorAll('#regulatory-query');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');
    
    queryInputs.forEach(input => {
        // Remove existing event listeners by cloning
        const newInput = input.cloneNode(true);
        if (input.parentNode) {
            input.parentNode.replaceChild(newInput, input);
        }
        
        // Find the closest send button
        const sendButton = newInput.nextElementSibling;
        const chatContainer = newInput.closest('.ai-assistant')?.querySelector('.assistant-chat');
        
        // Add event listener to send button
        if (sendButton && chatContainer) {
            sendButton.addEventListener('click', function() {
                handleRegulatoryQuery(newInput, chatContainer);
            });
            
            // Add event listener for pressing Enter
            newInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    handleRegulatoryQuery(newInput, chatContainer);
                }
            });
        }
    });
    
    // Set up suggestion chips
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', function() {
            // Find the closest input and chat container
            const container = chip.closest('.ai-assistant');
            if (container) {
                const input = container.querySelector('#regulatory-query');
                const chatContainer = container.querySelector('.assistant-chat');
                
                if (input && chatContainer) {
                    input.value = chip.textContent;
                    handleRegulatoryQuery(input, chatContainer);
                }
            }
        });
    });
}

/**
 * Handle a regulatory query
 * @param {HTMLElement} input - The input element
 * @param {HTMLElement} chatContainer - The chat container
 */
function handleRegulatoryQuery(input, chatContainer) {
    const query = input.value.trim();
    if (!query) return;
    
    // Add user message
    addChatMessage(chatContainer, query, 'user');
    
    // Clear input
    input.value = '';
    
    // Show typing indicator
    addTypingIndicator(chatContainer);
    
    // Simulate response after delay
    setTimeout(() => {
        // Remove typing indicator
        chatContainer.querySelector('.typing-indicator')?.closest('.chat-message')?.remove();
        
        // Add AI response
        const response = generateAIResponse(query);
        addChatMessage(chatContainer, response, 'system');
        
        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 1500);
}

/**
 * Add a message to the chat
 * @param {HTMLElement} container - The chat container
 * @param {string} text - The message text
 * @param {string} sender - The sender ('user' or 'system')
 */
function addChatMessage(container, text, sender) {
    const message = document.createElement('div');
    message.className = `chat-message ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    
    if (sender === 'user') {
        avatar.innerHTML = '<i class="fas fa-user"></i>';
    } else {
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
    }
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = `<p>${text}</p>`;
    
    message.appendChild(avatar);
    message.appendChild(content);
    container.appendChild(message);
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

/**
 * Show typing indicator in chat
 * @param {HTMLElement} container - The chat container
 */
function addTypingIndicator(container) {
    const message = document.createElement('div');
    message.className = 'chat-message system';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = '<i class="fas fa-robot"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = `
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    message.appendChild(avatar);
    message.appendChild(content);
    container.appendChild(message);
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

/**
 * Generate a response for a regulatory query
 * @param {string} query - The query
 * @returns {string} - The generated response
 */
function generateAIResponse(query) {
    // Example responses based on query content
    if (query.toLowerCase().includes('register') || query.toLowerCase().includes('business')) {
        return `
            To register a new business in Rwanda, follow these steps:
            <ol>
                <li>Check business name availability on the Rwanda Development Board (RDB) portal</li>
                <li>Register your business on the RDB online portal at <a href="#">https://www.rdb.rw</a></li>
                <li>Pay registration fees</li>
                <li>Obtain a Tax Identification Number (TIN) from Rwanda Revenue Authority</li>
                <li>Register for social security with RSSB if you have employees</li>
            </ol>
            The entire process typically takes 3-5 business days. Would you like more specific information about any of these steps?
        `;
    } else if (query.toLowerCase().includes('tax') || query.toLowerCase().includes('deadline') || query.toLowerCase().includes('filing')) {
        return `
            For 2023, the key tax filing deadlines in Rwanda are:
            <ul>
                <li><strong>Monthly VAT & PAYE:</strong> Due by the 15th of the following month</li>
                <li><strong>Quarterly taxes:</strong> Due by the 15th of the month following the end of each quarter</li>
                <li><strong>Annual corporate income tax:</strong> Due by March 31, 2023 (extended to April 30, 2023 as per recent regulation)</li>
                <li><strong>Personal income tax:</strong> Due by March 31, 2023</li>
            </ul>
            Note that penalties for late filing start at 10% of the tax due, with interest accruing at 1.5% per month.
        `;
    } else if (query.toLowerCase().includes('labor') || query.toLowerCase().includes('employee')) {
        return `
            Rwanda's key labor law requirements include:
            <ul>
                <li>Maximum work week of 45 hours</li>
                <li>Minimum of 18 working days paid annual leave</li>
                <li>Maternity leave of 12 weeks (full pay for 6 weeks)</li>
                <li>Paternity leave of 4 working days</li>
                <li>Employers must contribute 5% to RSSB, while employees contribute 3%</li>
                <li>Written employment contracts are mandatory</li>
            </ul>
            Employment contracts may be fixed-term or indefinite. Fixed-term contracts cannot exceed 5 years.
        `;
    } else if (query.toLowerCase().includes('export') || query.toLowerCase().includes('import')) {
        return `
            Export regulations in Rwanda include:
            <ul>
                <li>Exporters must register with Rwanda Revenue Authority and obtain an export code</li>
                <li>Quality certification is required for agricultural products through RSB</li>
                <li>Export declaration forms must be submitted through RRA's e-Tax system</li>
                <li>Zero-rated VAT applies to most exports</li>
                <li>Special permits required for certain products (coffee, tea, minerals)</li>
            </ul>
            Rwanda offers export incentives including tax exemptions for exporters who generate at least 50% of their turnover from exports.
        `;
    } else {
        return `
            Thank you for your question about "${query}". While I don't have specific information on this topic, I recommend checking the following resources:
            <ul>
                <li>Rwanda Development Board (RDB) website: <a href="#">https://rdb.rw</a></li>
                <li>Rwanda Revenue Authority: <a href="#">https://www.rra.gov.rw</a></li>
                <li>Ministry of Trade and Industry: <a href="#">https://minicom.gov.rw</a></li>
            </ul>
            Would you like me to provide information on a different regulatory topic?
        `;
    }
}

/**
 * Setup tab functionality for a specific section
 * @param {string} sectionId - The ID of the section containing tabs
 */
function setupTabsForSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    // Get all tab buttons in this section
    const tabButtons = section.querySelectorAll('.header-tabs .tab-button');
    
    // Get or create content containers for each tab
    const tabContainers = createTabContainers(sectionId, tabButtons);
    
    // Set up click handlers for each tab button
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Hide all content containers
            tabContainers.forEach(container => {
                container.style.display = 'none';
            });
            
            // Show the selected content container
            if (tabContainers[index]) {
                tabContainers[index].style.display = 'block';
            }
        });
    });
    
    // Activate the first tab by default
    if (tabButtons.length > 0 && tabContainers.length > 0) {
        tabButtons[0].classList.add('active');
        tabContainers[0].style.display = 'block';
        
        // Hide other containers
        for (let i = 1; i < tabContainers.length; i++) {
            tabContainers[i].style.display = 'none';
        }
    }
}

/**
 * Create or get content containers for tabs
 * @param {string} sectionId - The ID of the section
 * @param {NodeList} tabButtons - The tab buttons
 * @returns {Array} - Array of content containers
 */
function createTabContainers(sectionId, tabButtons) {
    const section = document.getElementById(sectionId);
    const containers = [];
    
    if (sectionId === 'market-insights-section') {
        // First, wrap existing content into organized tab content containers
        organizeSectionContent(section);
        
        // Now get the organized content containers
        containers.push(section.querySelector('.tab-content-overview')); // Overview tab
        containers.push(section.querySelector('.tab-content-industries')); // Industries tab
        containers.push(section.querySelector('.tab-content-regions')); // Regions tab
        containers.push(section.querySelector('.tab-content-custom')); // Custom Analysis tab
    } else if (sectionId === 'regulatory-section') {
        // Organize regulatory section content
        organizeRegulatorySectionContent(section);
        
        // Get the organized content containers
        containers.push(section.querySelector('.tab-content-dashboard')); // Compliance Dashboard tab
        containers.push(section.querySelector('.tab-content-updates')); // Updates tab
        containers.push(section.querySelector('.tab-content-roadmap')); // Roadmap tab
        containers.push(section.querySelector('.tab-content-assistant')); // AI Assistant tab
    }
    
    return containers.filter(container => container !== null);
}

/**
 * Organize the Market Insights section content into tab containers
 * @param {HTMLElement} section - The section element
 */
function organizeSectionContent(section) {
    // Check if already organized
    if (section.querySelector('.tab-content-overview')) {
        return; // Already organized
    }
    
    // Create container for Overview tab (first tab)
    const overviewContainer = document.createElement('div');
    overviewContainer.className = 'tab-content-overview';
    
    // Move the Rwanda Market Overview content into this container
    const overviewContent = section.querySelector('.insights-overview');
    if (overviewContent) {
        // Clone the content before removing it from its original position
        const overviewClone = overviewContent.cloneNode(true);
        overviewContainer.appendChild(overviewClone);
        section.insertBefore(overviewContainer, overviewContent);
        overviewContent.style.display = 'none'; // Hide original but don't remove yet
    }
    
    // Create container for Industries tab (second tab)
    const industriesContainer = document.createElement('div');
    industriesContainer.className = 'tab-content-industries';
    
    // Key Growth Industries section is in the first card of column-cards
    const columnCards = section.querySelectorAll('.column-cards');
    if (columnCards.length > 0) {
        const industriesCard = columnCards[0].querySelector('.dashboard-card');
        if (industriesCard && industriesCard.querySelector('h3').textContent.includes('Key Growth Industries')) {
            // Clone the card
            const industriesCardClone = industriesCard.cloneNode(true);
            industriesContainer.appendChild(industriesCardClone);
        } else {
            // Create placeholder
            industriesContainer.innerHTML = `
                <div class="dashboard-card">
                    <div class="card-header">
                        <h3>Industries Analysis</h3>
                    </div>
                    <div class="card-body">
                        <div class="loading-spinner">
                            <i class="fas fa-spinner fa-spin"></i>
                            <span>Loading industries data...</span>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    section.appendChild(industriesContainer);
    
    // Create container for Regions tab (third tab)
    const regionsContainer = document.createElement('div');
    regionsContainer.className = 'tab-content-regions';
    
    // Investment by Region is in the second card of column-cards
    if (columnCards.length > 0) {
        const cards = columnCards[0].querySelectorAll('.dashboard-card');
        if (cards.length > 1) {
            const regionsCard = cards[1];
            if (regionsCard && regionsCard.querySelector('h3').textContent.includes('Investment by Region')) {
                // Clone the card
                const regionsCardClone = regionsCard.cloneNode(true);
                regionsContainer.appendChild(regionsCardClone);
            }
        }
        
        // If we didn't find the specific card, create a placeholder
        if (regionsContainer.children.length === 0) {
            regionsContainer.innerHTML = `
                <div class="dashboard-card">
                    <div class="card-header">
                        <h3>Regional Analysis</h3>
                    </div>
                    <div class="card-body">
                        <div class="loading-spinner">
                            <i class="fas fa-spinner fa-spin"></i>
                            <span>Loading regional data...</span>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    section.appendChild(regionsContainer);
    
    // Create container for Custom Analysis tab (fourth tab)
    const customContainer = document.createElement('div');
    customContainer.className = 'tab-content-custom';
    
    // Move the Custom Insights Form into this container
    const customForm = section.querySelector('#market-insights-form')?.closest('.dashboard-card');
    const customResults = section.querySelector('#custom-insights-results');
    
    if (customForm) {
        // Clone the form
        const customFormClone = customForm.cloneNode(true);
        customContainer.appendChild(customFormClone);
        
        // Clone the results if they exist
        if (customResults) {
            const customResultsClone = customResults.cloneNode(true);
            customContainer.appendChild(customResultsClone);
        }
    } else {
        // Create placeholder
        customContainer.innerHTML = `
            <div class="dashboard-card">
                <div class="card-header">
                    <h3>Custom Market Analysis</h3>
                </div>
                <div class="card-body">
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin"></i>
                        <span>Loading custom analysis tools...</span>
                    </div>
                </div>
            </div>
        `;
    }
    section.appendChild(customContainer);
    
    // Hide all original content to avoid duplication, but don't remove
    // This preserves any event listeners that might be attached
    columnCards.forEach(card => {
        card.style.display = 'none';
    });
    
    if (customForm) {
        customForm.style.display = 'none';
    }
    if (customResults) {
        customResults.style.display = 'none';
    }
}

/**
 * Organize the Regulatory Guidance section content into tab containers
 * @param {HTMLElement} section - The section element
 */
function organizeRegulatorySectionContent(section) {
    // Check if already organized
    if (section.querySelector('.tab-content-dashboard')) {
        return; // Already organized
    }
    
    // Create container for Compliance Dashboard tab (first tab)
    const dashboardContainer = document.createElement('div');
    dashboardContainer.className = 'tab-content-dashboard';
    
    // Move the Compliance Score Card content into this container
    const complianceScoreCard = section.querySelector('.regulatory-overview');
    if (complianceScoreCard) {
        // Clone the content
        const complianceScoreCardClone = complianceScoreCard.cloneNode(true);
        dashboardContainer.appendChild(complianceScoreCardClone);
        section.insertBefore(dashboardContainer, complianceScoreCard);
        complianceScoreCard.style.display = 'none'; // Hide original
    }
    
    // Create container for Updates tab (second tab)
    const updatesContainer = document.createElement('div');
    updatesContainer.className = 'tab-content-updates';
    
    // Find the Recent Regulatory Updates card
    const regulationsCard = Array.from(section.querySelectorAll('.dashboard-card')).find(card => {
        const header = card.querySelector('h3');
        return header && header.textContent.includes('Recent Regulatory Updates');
    });
    
    if (regulationsCard) {
        // Clone the card
        const regulationsCardClone = regulationsCard.cloneNode(true);
        updatesContainer.appendChild(regulationsCardClone);
        section.appendChild(updatesContainer);
        regulationsCard.style.display = 'none'; // Hide original
    } else {
        // Create placeholder
        updatesContainer.innerHTML = `
            <div class="dashboard-card">
                <div class="card-header">
                    <h3>Regulatory Updates</h3>
                </div>
                <div class="card-body">
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin"></i>
                        <span>Loading regulatory updates...</span>
                    </div>
                </div>
            </div>
        `;
        section.appendChild(updatesContainer);
    }
    
    // Create container for Roadmap tab (third tab)
    const roadmapContainer = document.createElement('div');
    roadmapContainer.className = 'tab-content-roadmap';
    
    // Find the Compliance Roadmap card
    const roadmapCard = Array.from(section.querySelectorAll('.dashboard-card')).find(card => {
        const header = card.querySelector('h3');
        return header && header.textContent.includes('Your Compliance Roadmap');
    });
    
    if (roadmapCard) {
        // Clone the card
        const roadmapCardClone = roadmapCard.cloneNode(true);
        roadmapContainer.appendChild(roadmapCardClone);
        section.appendChild(roadmapContainer);
        roadmapCard.style.display = 'none'; // Hide original
    } else {
        // Create placeholder
        roadmapContainer.innerHTML = `
            <div class="dashboard-card">
                <div class="card-header">
                    <h3>Compliance Roadmap</h3>
                </div>
                <div class="card-body">
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin"></i>
                        <span>Loading compliance roadmap...</span>
                    </div>
                </div>
            </div>
        `;
        section.appendChild(roadmapContainer);
    }
    
    // Create container for AI Assistant tab (fourth tab)
    const assistantContainer = document.createElement('div');
    assistantContainer.className = 'tab-content-assistant';
    
    // Find the Regulatory AI Assistant card
    const assistantCard = Array.from(section.querySelectorAll('.dashboard-card')).find(card => {
        const header = card.querySelector('h3');
        return header && header.textContent.includes('Regulatory AI Assistant');
    });
    
    if (assistantCard) {
        // Clone the card
        const assistantCardClone = assistantCard.cloneNode(true);
        assistantContainer.appendChild(assistantCardClone);
        section.appendChild(assistantContainer);
        assistantCard.style.display = 'none'; // Hide original
    } else {
        // Create placeholder
        assistantContainer.innerHTML = `
            <div class="dashboard-card">
                <div class="card-header">
                    <h3>AI Regulatory Assistant</h3>
                </div>
                <div class="card-body">
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin"></i>
                        <span>Loading AI assistant...</span>
                    </div>
                </div>
            </div>
        `;
        section.appendChild(assistantContainer);
    }
}

/**
 * Setup subscription page functionality
 */
function setupSubscriptionEvents() {
    // Get elements
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
    
    // Set up event listeners for premium plan button
    if (premiumPlanBtn) {
        premiumPlanBtn.addEventListener('click', function() {
            openModal(paymentModal);
        });
    }
    
    // Set up event listener for enterprise plan button
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
            // Navigate to dashboard section
            navigateToSection('dashboard-section');
        });
    }
    
    // Check subscription status on page load
    checkSubscriptionStatus();
}

/**
 * Update the price display based on billing frequency
 */
function updatePriceDisplay() {
    const billingToggle = document.getElementById('billing-toggle');
    const planPrice = document.getElementById('plan-price');
    const totalPrice = document.getElementById('total-price');
    
    if (!billingToggle || !planPrice || !totalPrice) return;
    
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
    // Get button element
    const completePaymentBtn = document.getElementById('complete-payment');
    const successModal = document.getElementById('success-modal');
    const paymentModal = document.getElementById('payment-modal');
    
    if (!completePaymentBtn) return;
    
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
    const billingToggle = document.getElementById('billing-toggle');
    if (!billingToggle) return;
    
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
    localStorage.setItem('subscriptionTier', 'premium');
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
    // Update subscription badge in welcome banner
    const subscriptionBadge = document.getElementById('subscription-badge');
    if (subscriptionBadge) {
        subscriptionBadge.textContent = 'Premium Plan';
        subscriptionBadge.className = 'subscription-badge premium';
    }
    
    // Update upgrade button in welcome banner
    const upgradeButton = document.getElementById('upgrade-button');
    if (upgradeButton) {
        upgradeButton.textContent = 'Manage Plan';
    }
    
    // Show premium-only elements
    document.querySelectorAll('.premium-only').forEach(element => {
        element.classList.remove('feature-locked');
    });
    
    // Change free plan button to show not active
    const freePlanBtn = document.getElementById('free-plan-btn');
    if (freePlanBtn) {
        freePlanBtn.textContent = 'Free Plan';
        freePlanBtn.disabled = false;
        freePlanBtn.classList.remove('current-plan');
    }
    
    // Change premium plan button to show "Current Plan"
    const premiumPlanBtn = document.getElementById('premium-plan-btn');
    if (premiumPlanBtn) {
        premiumPlanBtn.textContent = 'Current Plan';
        premiumPlanBtn.disabled = true;
        premiumPlanBtn.classList.add('current-plan');
        premiumPlanBtn.classList.remove('premium-btn');
    }
}

/**
 * Open a modal
 * @param {HTMLElement} modal - The modal element to open
 */
function openModal(modal) {
    if (!modal) return;
    
    // If the modal doesn't have the overlay structure, create it
    if (!modal.classList.contains('modal-overlay')) {
        const modalContent = modal.innerHTML;
        const modalId = modal.id;
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = modalId;
        
        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal';
        modalContainer.innerHTML = modalContent;
        
        // Append modal to overlay
        overlay.appendChild(modalContainer);
        
        // Replace original modal with overlay
        modal.parentNode.replaceChild(overlay, modal);
        
        // Set new reference
        modal = overlay;
    }
    
    // Add active class to show modal
    modal.classList.add('active');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Add close button functionality
    const closeButton = modal.querySelector('.modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => closeModal(modal));
    }
    
    // Add click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    // Add escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal(modal);
        }
    });
}

/**
 * Close a modal
 * @param {HTMLElement} modal - The modal element to close
 */
function closeModal(modal) {
    if (!modal) return;
    
    modal.classList.remove('active');
    
    // Restore body scrolling
    document.body.style.overflow = '';
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

/**
 * Setup FAQ accordion functionality
 */
function setupFaqToggle() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                // Toggle active class on the clicked item
                item.classList.toggle('active');
                
                // If you want to close other items when one is opened, uncomment this:
                /*
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                */
            });
        }
    });
}

/**
 * Setup account tab navigation and form handlers
 */
function setupAccountFunctionality() {
    setupAccountTabs();
    setupAccountForms();
    setupAccountButtons();
    checkAccountStatus();
}

/**
 * Set up account tab navigation
 */
function setupAccountTabs() {
    const tabButtons = document.querySelectorAll('.account-tab-btn');
    const tabPanes = document.querySelectorAll('.account-tab-pane');
    
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
 * Set up account form submissions
 */
function setupAccountForms() {
    // Profile form
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const company = document.getElementById('company').value;
            const industry = document.getElementById('industry').value;
            const companySize = document.getElementById('company-size').value;
            
            // Validate form data
            if (!firstName || !lastName || !email) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Save profile data to localStorage (in a real app, this would go to an API)
            const profileData = {
                firstName,
                lastName,
                email,
                phone,
                company,
                industry,
                companySize,
                updatedAt: new Date().toISOString()
            };
            
            localStorage.setItem('rti_user_profile', JSON.stringify(profileData));
            
            // Update display name
            const nameElement = document.getElementById('user-name');
            if (nameElement) {
                nameElement.textContent = `${firstName} ${lastName}`;
            }
            
            // Update email
            const emailElement = document.getElementById('user-email');
            if (emailElement) {
                emailElement.textContent = email;
            }
            
            // Show success message
            showNotification('Profile updated successfully!', 'success');
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
            
            // Password strength validation
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(newPassword)) {
                showNotification('Password must be at least 8 characters long with at least one uppercase letter, one number, and one special character.', 'error');
                return;
            }
            
            // In a real application, this would verify the current password and update it
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
            
            // Get reason and feedback
            const reason = document.getElementById('cancel-reason').value;
            const feedback = document.getElementById('cancel-feedback').value;
            
            if (!reason) {
                showNotification('Please select a reason for cancellation.', 'error');
                return;
            }
            
            // In a real app, this would send the cancellation request to an API
            
            // Close modal
            const cancelModal = document.getElementById('cancel-modal');
            closeModal(cancelModal);
            
            // Update subscription status
            updateSubscriptionStatus('free');
            
            // Show success message
            showNotification('Your subscription has been cancelled. You will still have access to premium features until the end of your billing period.', 'success');
            
            // Update UI
            updateSubscriptionUI('free');
        });
    }
}

/**
 * Set up account button click listeners
 */
function setupAccountButtons() {
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
            // Navigate to subscription section
            navigateToSection('subscription-section');
        });
    }
    
    // Enable 2FA button
    const enable2faBtn = document.getElementById('enable-2fa-btn');
    if (enable2faBtn) {
        enable2faBtn.addEventListener('click', function() {
            showNotification('Two-factor authentication setup would be implemented here', 'info');
        });
    }
    
    // Deactivate account button
    const deactivateAccountBtn = document.getElementById('deactivate-account-btn');
    if (deactivateAccountBtn) {
        deactivateAccountBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to deactivate your account? You can reactivate it at any time by logging in.')) {
                showNotification('Your account has been deactivated.', 'success');
                
                // In a real app, this would send a deactivation request to an API
                setTimeout(() => {
                    logout();
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
                
                // In a real app, this would send a deletion request to an API
                setTimeout(() => {
                    logout();
                }, 2000);
            }
        });
    }
    
    // Save all settings button
    const saveAllSettingsBtn = document.getElementById('save-all-settings');
    if (saveAllSettingsBtn) {
        saveAllSettingsBtn.addEventListener('click', function() {
            // Trigger submit on the currently visible form
            const activePane = document.querySelector('.account-tab-pane.active');
            if (activePane) {
                const form = activePane.querySelector('form');
                if (form) {
                    form.dispatchEvent(new Event('submit'));
                } else {
                    showNotification('No changes to save in this section.', 'info');
                }
            }
        });
    }
}

/**
 * Check account status and update UI
 */
function checkAccountStatus() {
    // Load profile data from localStorage
    const profileData = JSON.parse(localStorage.getItem('rti_user_profile'));
    if (profileData) {
        // Update name fields
        document.getElementById('first-name').value = profileData.firstName || '';
        document.getElementById('last-name').value = profileData.lastName || '';
        document.getElementById('email').value = profileData.email || '';
        document.getElementById('phone').value = profileData.phone || '';
        document.getElementById('company').value = profileData.company || '';
        
        // Update selects if values exist
        if (profileData.industry) {
            document.getElementById('industry').value = profileData.industry;
        }
        
        if (profileData.companySize) {
            document.getElementById('company-size').value = profileData.companySize;
        }
        
        // Update display name
        const nameElement = document.getElementById('user-name');
        if (nameElement && profileData.firstName && profileData.lastName) {
            nameElement.textContent = `${profileData.firstName} ${profileData.lastName}`;
        }
        
        // Update email
        const emailElement = document.getElementById('user-email');
        if (emailElement && profileData.email) {
            emailElement.textContent = profileData.email;
        }
    }
    
    // Check subscription status
    const subscriptionData = JSON.parse(localStorage.getItem('rti_subscription'));
    if (subscriptionData) {
        updateSubscriptionUI(subscriptionData.plan);
    }
}

/**
 * Update subscription status
 * 
 * @param {string} plan - The plan to update to ('free', 'premium', or 'enterprise')
 */
function updateSubscriptionStatus(plan) {
    // Save to localStorage (in real app, this would be saved to a database)
    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    
    let subscriptionData = {
        plan: plan,
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        active: true
    };
    
    if (plan === 'free') {
        // Mark the subscription as free
        subscriptionData = {
            plan: 'free',
            startDate: null,
            endDate: null,
            active: true
        };
    }
    
    localStorage.setItem('rti_subscription', JSON.stringify(subscriptionData));
    localStorage.setItem('subscriptionTier', plan);
}

/**
 * Update UI based on subscription status
 * 
 * @param {string} plan - The current plan ('free', 'premium', or 'enterprise')
 */
function updateSubscriptionUI(plan) {
    // Update membership badge
    const membershipBadge = document.getElementById('membership-badge');
    if (membershipBadge) {
        if (plan === 'premium' || plan === 'enterprise') {
            membershipBadge.textContent = `${plan.charAt(0).toUpperCase() + plan.slice(1)} Member`;
            membershipBadge.classList.add('premium');
        } else {
            membershipBadge.textContent = 'Free Member';
            membershipBadge.classList.remove('premium');
        }
    }
    
    // Update current plan name
    const currentPlanName = document.getElementById('current-plan-name');
    if (currentPlanName) {
        currentPlanName.textContent = `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`;
    }
    
    // Update current plan price
    const currentPlanPrice = document.getElementById('current-plan-price');
    if (currentPlanPrice) {
        if (plan === 'premium') {
            currentPlanPrice.textContent = '50,000 RWF / month';
        } else if (plan === 'enterprise') {
            currentPlanPrice.textContent = 'Custom Pricing';
        } else {
            currentPlanPrice.textContent = 'Free';
        }
    }
    
    // Update plan features list
    const planFeaturesList = document.getElementById('plan-features-list');
    if (planFeaturesList) {
        if (plan === 'premium') {
            planFeaturesList.innerHTML = `
                <li><i class="fas fa-check"></i> Advanced market insights</li>
                <li><i class="fas fa-check"></i> Comprehensive regulatory guidance</li>
                <li><i class="fas fa-check"></i> AI-powered business recommendations</li>
                <li><i class="fas fa-check"></i> Exclusive industry reports</li>
                <li><i class="fas fa-check"></i> Unlimited report exports</li>
                <li><i class="fas fa-check"></i> Access to historical data</li>
                <li><i class="fas fa-check"></i> Priority email support</li>
            `;
        } else if (plan === 'enterprise') {
            planFeaturesList.innerHTML = `
                <li><i class="fas fa-check"></i> Everything in Premium plan, plus:</li>
                <li><i class="fas fa-check"></i> Dedicated account manager</li>
                <li><i class="fas fa-check"></i> Customized data integration</li>
                <li><i class="fas fa-check"></i> API access</li>
                <li><i class="fas fa-check"></i> Custom reporting</li>
                <li><i class="fas fa-check"></i> Team collaboration features</li>
                <li><i class="fas fa-check"></i> On-site training and workshops</li>
                <li><i class="fas fa-check"></i> 24/7 priority support</li>
            `;
        } else {
            planFeaturesList.innerHTML = `
                <li><i class="fas fa-check"></i> Basic market insights</li>
                <li><i class="fas fa-check"></i> Limited regulatory guidance</li>
                <li><i class="fas fa-check"></i> Rwanda tech ecosystem dashboard</li>
                <li><i class="fas fa-check"></i> 3 report exports per month</li>
                <li><i class="fas fa-times"></i> Advanced analytics</li>
                <li><i class="fas fa-times"></i> Personalized recommendations</li>
                <li><i class="fas fa-times"></i> Exclusive reports</li>
                <li><i class="fas fa-times"></i> Priority support</li>
            `;
        }
    }
    
    // Update current subscription badge in welcome banner
    const subscriptionBadge = document.getElementById('subscription-badge');
    if (subscriptionBadge) {
        if (plan === 'premium' || plan === 'enterprise') {
            subscriptionBadge.textContent = `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`;
            subscriptionBadge.className = 'subscription-badge premium';
        } else {
            subscriptionBadge.textContent = 'Free Plan';
            subscriptionBadge.className = 'subscription-badge free';
        }
    }
    
    // Update upgrade button in welcome banner
    const upgradeButton = document.getElementById('upgrade-button');
    if (upgradeButton) {
        if (plan === 'premium' || plan === 'enterprise') {
            upgradeButton.textContent = 'Manage Plan';
        } else {
            upgradeButton.textContent = 'Upgrade Now';
        }
    }
    
    // Show/hide premium-only features
    document.querySelectorAll('.premium-only').forEach(element => {
        if (plan === 'premium' || plan === 'enterprise') {
            element.classList.remove('feature-locked');
        } else {
            element.classList.add('feature-locked');
        }
    });
}

/**
 * Show notification message
 * 
 * @param {string} message - Message to display
 * @param {string} type - Notification type: 'success', 'error', 'info', 'warning'
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Create icon based on type
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    notification.innerHTML = `
        <i class="fas ${iconMap[type] || iconMap.info}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add notification to the document
    document.body.appendChild(notification);
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('visible');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('visible');
    }, 10);
    
    // Auto-hide after delay
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('visible');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Add initialization for Help & Support section
function initializeHelpSupport() {
    // Tab switching functionality
    const helpTabBtns = document.querySelectorAll('.help-tab-btn');
    const helpTabPanes = document.querySelectorAll('.help-tab-pane');
    
    helpTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabTarget = btn.getAttribute('data-tab');
            
            // Reset active state
            helpTabBtns.forEach(b => b.classList.remove('active'));
            helpTabPanes.forEach(p => p.classList.remove('active'));
            
            // Set active state
            btn.classList.add('active');
            document.getElementById(tabTarget).classList.add('active');
        });
    });
    
    // FAQ toggle functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other open FAQs
            faqItems.forEach(i => {
                if (i !== item && i.classList.contains('active')) {
                    i.classList.remove('active');
                }
            });
            
            // Toggle current FAQ
            item.classList.toggle('active');
        });
    });
    
    // FAQ category filtering
    const faqCategories = document.querySelectorAll('.faq-category');
    
    faqCategories.forEach(category => {
        category.addEventListener('click', () => {
            const categoryValue = category.getAttribute('data-category');
            
            // Update active category
            faqCategories.forEach(c => c.classList.remove('active'));
            category.classList.add('active');
            
            // Filter FAQ items
            faqItems.forEach(item => {
                if (categoryValue === 'all' || item.getAttribute('data-category') === categoryValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // FAQ search functionality
    const faqSearch = document.getElementById('faq-search');
    
    if (faqSearch) {
        faqSearch.addEventListener('input', () => {
            const searchTerm = faqSearch.value.toLowerCase();
            
            faqItems.forEach(item => {
                const questionText = item.querySelector('.faq-question h4').textContent.toLowerCase();
                const answerText = item.querySelector('.faq-answer').textContent.toLowerCase();
                
                if (questionText.includes(searchTerm) || answerText.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // User Guide navigation
    const guideNavItems = document.querySelectorAll('.guide-nav-item');
    const guideSections = document.querySelectorAll('.guide-section');
    
    guideNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const guideTarget = item.getAttribute('data-guide');
            
            // Reset active state
            guideNavItems.forEach(i => i.classList.remove('active'));
            guideSections.forEach(s => s.classList.remove('active'));
            
            // Set active state
            item.classList.add('active');
            document.getElementById(guideTarget).classList.add('active');
        });
    });
    
    // Tutorial category filtering
    const tutorialCategories = document.querySelectorAll('.tutorial-category');
    const tutorialCards = document.querySelectorAll('.tutorial-card');
    
    tutorialCategories.forEach(category => {
        category.addEventListener('click', () => {
            const categoryValue = category.getAttribute('data-category');
            
            // Update active category
            tutorialCategories.forEach(c => c.classList.remove('active'));
            category.classList.add('active');
            
            // Filter tutorial cards
            tutorialCards.forEach(card => {
                if (categoryValue === 'all' || card.getAttribute('data-category') === categoryValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Video tutorial modal functionality
    const watchButtons = document.querySelectorAll('.watch-tutorial-btn');
    const tutorialModal = document.getElementById('tutorial-modal');
    const tutorialTitle = document.getElementById('tutorial-title');
    const modalCloseButtons = document.querySelectorAll('.modal-close, .modal-close-btn');
    
    watchButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tutorialId = button.getAttribute('data-tutorial');
            const tutorialName = button.parentElement.querySelector('h4').textContent;
            
            tutorialTitle.textContent = tutorialName;
            tutorialModal.classList.add('visible');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });
    
    // Support form submission
    const supportForm = document.getElementById('support-form');
    const supportSuccessModal = document.getElementById('support-success-modal');
    const referenceNumber = document.getElementById('reference-number');
    
    if (supportForm) {
        supportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Generate a random reference number
            const randomRef = 'SR-' + Math.floor(100000 + Math.random() * 900000);
            referenceNumber.textContent = randomRef;
            
            // Show success modal
            supportSuccessModal.classList.add('visible');
            document.body.style.overflow = 'hidden';
            
            // Reset form
            supportForm.reset();
        });
    }
    
    // Modal close functionality
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.modal-overlay').forEach(modal => {
                modal.classList.remove('visible');
            });
            document.body.style.overflow = ''; // Restore scrolling
        });
    });
    
    // Contact Support button functionality
    const contactSupportButton = document.getElementById('contact-support-button');
    
    if (contactSupportButton) {
        contactSupportButton.addEventListener('click', () => {
            // Switch to Contact tab
            helpTabBtns.forEach(b => b.classList.remove('active'));
            helpTabPanes.forEach(p => p.classList.remove('active'));
            
            document.querySelector('[data-tab="contact-tab"]').classList.add('active');
            document.getElementById('contact-tab').classList.add('active');
            
            // Scroll to contact form
            document.querySelector('.contact-form-container').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // View Tutorials button functionality
    const viewTutorialsButton = document.getElementById('view-tutorials-button');
    
    if (viewTutorialsButton) {
        viewTutorialsButton.addEventListener('click', () => {
            // Switch to Tutorials tab
            helpTabBtns.forEach(b => b.classList.remove('active'));
            helpTabPanes.forEach(p => p.classList.remove('active'));
            
            document.querySelector('[data-tab="tutorials-tab"]').classList.add('active');
            document.getElementById('tutorials-tab').classList.add('active');
        });
    }
}