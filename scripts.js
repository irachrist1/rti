document.addEventListener('DOMContentLoaded', function() {
    try {
        // Page Switching Functionality
        setupPageSwitching();
        
        // FAQ Toggle Functionality
        setupFaqToggle();
        
        // Get form elements by their specific IDs
        const marketInsightsForm = document.getElementById('market-insights-form');
        const regulatoryGuidanceForm = document.getElementById('regulatory-guidance-form');

        // Add event listeners to forms if they exist in the DOM
        if (marketInsightsForm) {
            marketInsightsForm.addEventListener('submit', handleMarketInsightsSubmit);
            console.log('Market Insights form event listener added successfully');
        } else {
            console.error('Market Insights form not found in the DOM');
        }

        if (regulatoryGuidanceForm) {
            regulatoryGuidanceForm.addEventListener('submit', handleRegulatoryGuidanceSubmit);
            console.log('Regulatory Guidance form event listener added successfully');
        } else {
            console.error('Regulatory Guidance form not found in the DOM');
        }
        
        // Add event listener to the "Get Started" button to navigate to Market Insights
        const getStartedButton = document.getElementById('get-started');
        if (getStartedButton) {
            getStartedButton.addEventListener('click', function() {
                navigateToPage('market-insights');
            });
        }
    } catch (error) {
        console.error('Error setting up page functionality:', error);
    }

    /**
     * Sets up the page switching functionality
     */
    function setupPageSwitching() {
        try {
            // Get all navigation links
            const navLinks = document.querySelectorAll('.nav-link');
            
            // Add click event listeners to each nav link
            navLinks.forEach(link => {
                link.addEventListener('click', function(event) {
                    // Prevent default anchor behavior
                    event.preventDefault();
                    
                    // Get the target page ID from the href attribute
                    const targetPageId = this.getAttribute('href').substring(1);
                    
                    // Navigate to the target page
                    navigateToPage(targetPageId);
                });
            });
            
            // Check if there's a hash in the URL to navigate to a specific page on load
            if (window.location.hash) {
                const pageId = window.location.hash.substring(1);
                navigateToPage(pageId);
            }
            
            console.log('Page switching functionality set up successfully');
        } catch (error) {
            console.error('Error setting up page switching:', error);
        }
    }
    
    /**
     * Navigates to a specific page
     * 
     * @param {string} pageId - The ID of the page to navigate to
     */
    function navigateToPage(pageId) {
        try {
            // Get current active page
            const currentPage = document.querySelector('.page.active');
            
            // Get target page
            const targetPage = document.getElementById(pageId);
            
            if (!targetPage) {
                console.error(`Page with ID "${pageId}" not found`);
                return;
            }
            
            // Fade out current page
            if (currentPage) {
                currentPage.style.animation = 'fadeOut 0.3s forwards';
                
                // Wait for animation to complete before showing new page
                setTimeout(() => {
                    // Hide all pages
                    document.querySelectorAll('.page').forEach(page => {
                        page.classList.remove('active');
                        page.style.animation = '';
                    });
                    
                    // Show and fade in target page
                    targetPage.classList.add('active');
                    targetPage.style.animation = 'fadeInUp 0.5s forwards';
                    
                    // Update active state in navigation
                    const navLinks = document.querySelectorAll('.nav-link');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${pageId}`) {
                            link.classList.add('active');
                        }
                    });
                    
                    // Update URL hash
                    window.location.hash = pageId;
                    
                    // Scroll to top
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    
                    // Reinitialize charts if navigating to the dashboard page
                    if (pageId === 'dashboard' && typeof window.initDashboard === 'function') {
                        // Use a small delay to ensure the page is fully visible
                        setTimeout(() => {
                            if (typeof window.renderIndustryRevenueChart === 'function') {
                                window.renderIndustryRevenueChart();
                            }
                            if (typeof window.renderMarketShareChart === 'function') {
                                window.renderMarketShareChart();
                            }
                            if (typeof window.renderStartupGrowthChart === 'function') {
                                window.renderStartupGrowthChart();
                            }
                        }, 100);
                    }
                    
                    console.log(`Navigated to page: ${pageId}`);
                }, 300); // Match this to the fadeOut animation duration
            } else {
                // First load, no current page to fade out
                targetPage.classList.add('active');
                
                // Update active state in navigation
                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${pageId}`) {
                        link.classList.add('active');
                    }
                });
                
                console.log(`Navigated to page: ${pageId}`);
            }
        } catch (error) {
            console.error('Error navigating to page:', error);
        }
    }
    
    /**
     * Sets up the FAQ toggle functionality
     */
    function setupFaqToggle() {
        try {
            // Get all FAQ question elements
            const faqQuestions = document.querySelectorAll('.faq-question');
            
            // Add click event listeners to each FAQ question
            faqQuestions.forEach(question => {
                question.addEventListener('click', function() {
                    // Toggle active class on the parent FAQ item
                    const faqItem = this.parentElement;
                    
                    // Check if the clicked item is already active
                    const isActive = faqItem.classList.contains('active');
                    
                    // Close all FAQ items
                    document.querySelectorAll('.faq-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    
                    // If the clicked item wasn't active, make it active
                    if (!isActive) {
                        faqItem.classList.add('active');
                    }
                });
            });
            
            console.log('FAQ toggle functionality set up successfully');
        } catch (error) {
            console.error('Error setting up FAQ toggle:', error);
        }
    }
    
    /**
     * Displays insights results in the UI
     * 
     * @param {Object} insights - The insights data to display
     */
    function displayMarketInsights(insights) {
        try {
            // Get the results container
            const resultsContainer = document.getElementById('insights-results');
            
            if (!resultsContainer) {
                throw new Error('Results container not found');
            }
            
            // Display the results container
            resultsContainer.style.display = 'block';
            
            // Create HTML content for insights
            let html = `
                <h2>Market Insights for ${insights.industry} in ${insights.location}</h2>
                
                <div class="insights-section">
                    <h3>Market Trends</h3>
                    <ul class="trend-list">
            `;
            
            // Add trends
            insights.trends.forEach(trend => {
                const trendIcon = getTrendIcon(trend.trend);
                html += `
                    <li class="trend-item ${trend.trend}">
                        <div class="trend-header">
                            <span class="trend-name">${trend.name}</span>
                            <span class="trend-value">${trend.value} ${trendIcon}</span>
                        </div>
                    </li>
                `;
            });
            
            html += `
                    </ul>
                </div>
                
                <div class="insights-section">
                    <h3>Opportunities</h3>
                    <ul class="opportunity-list">
            `;
            
            // Add opportunities
            insights.opportunities.forEach(opportunity => {
                html += `<li>${opportunity}</li>`;
            });
            
            html += `
                    </ul>
                </div>
                
                <div class="insights-section">
                    <h3>Potential Risks</h3>
                    <ul class="risk-list">
            `;
            
            // Add risks
            insights.risks.forEach(risk => {
                html += `<li>${risk}</li>`;
            });
            
            html += `
                    </ul>
                </div>
            `;
            
            // Set the HTML content
            resultsContainer.innerHTML = html;
            
            // Scroll to results
            resultsContainer.scrollIntoView({ behavior: 'smooth' });
            
            console.log('Market insights displayed successfully');
        } catch (error) {
            console.error('Error displaying market insights:', error);
        }
    }
    
    /**
     * Gets the appropriate icon for a trend
     * 
     * @param {string} trend - The trend direction ('up', 'down', or 'stable')
     * @returns {string} - HTML for the trend icon
     */
    function getTrendIcon(trend) {
        switch (trend) {
            case 'up':
                return '<i class="fas fa-arrow-up" style="color: var(--secondary-color);"></i>';
            case 'down':
                return '<i class="fas fa-arrow-down" style="color: #dc3545;"></i>';
            case 'stable':
                return '<i class="fas fa-equals" style="color: var(--primary-color);"></i>';
            default:
                return '';
        }
    }

    /**
     * Handles the Market Insights form submission
     * Prevents default form submission, logs data, shows alert, and resets form
     * 
     * @param {Event} event - The form submission event
     */
    function handleMarketInsightsSubmit(event) {
        try {
            // Prevent the default form submission behavior to avoid page reload
            event.preventDefault();
            
            // Show loading state - could be enhanced with a proper UI loader
            toggleLoadingState(true, 'market-insights');
            
            // Get form data using the utility function
            const formData = getFormData({
                industry: 'industry',
                location: 'location',
                revenueRange: 'revenue_range'
            });
            
            // Log form data to console in a structured format for debugging
            console.log('Market Insights Form Data:', formData);
            
            // In the future, this will be replaced with an API call
            // Simulate API call with a Promise for future integration
            fetchMarketInsights(formData)
                .then(insights => {
                    // Display results when available
                    console.log('Market insights received:', insights);
                    displayMarketInsights(insights);
                })
                .catch(error => {
                    console.error('Error fetching market insights:', error);
                    alert('Error fetching market insights. Please try again.');
                })
                .finally(() => {
                    // Reset the form after submission
                    event.target.reset();
                    
                    // Hide loading state
                    toggleLoadingState(false, 'market-insights');
                });
            
        } catch (error) {
            console.error('Error processing Market Insights form submission:', error);
            alert('An error occurred. Please try again.');
            toggleLoadingState(false, 'market-insights');
        }
    }

    /**
     * Handles the Regulatory Guidance form submission
     * Prevents default form submission, logs data, shows alert, and resets form
     * 
     * @param {Event} event - The form submission event
     */
    function handleRegulatoryGuidanceSubmit(event) {
        try {
            // Prevent the default form submission behavior to avoid page reload
            event.preventDefault();
            
            // Show loading state
            toggleLoadingState(true, 'regulatory-guidance');
            
            // Get form data using the utility function
            const formData = getFormData({
                businessType: 'business_type',
                industry: 'reg_industry',
                businessObjectives: 'business_objectives'
            });
            
            // Log form data to console in a structured format for debugging
            console.log('Regulatory Guidance Form Data:', formData);
            console.log('Form Method: POST');
            
            // Simulate API call for regulatory guidance
            fetchRegulatoryGuidance(formData)
                .then(guidance => {
                    // Display results when available
                    console.log('Regulatory guidance received:', guidance);
                    displayRegulatoryGuidance(guidance);
                })
                .catch(error => {
                    console.error('Error generating regulatory roadmap:', error);
                    alert('Error generating regulatory roadmap. Please try again.');
                })
                .finally(() => {
                    // Reset the form after submission
                    event.target.reset();
                    
                    // Hide loading state
                    toggleLoadingState(false, 'regulatory-guidance');
                });
            
        } catch (error) {
            console.error('Error processing Regulatory Guidance form submission:', error);
            alert('An error occurred. Please try again.');
            toggleLoadingState(false, 'regulatory-guidance');
        }
    }
    
    /**
     * Displays regulatory guidance results in the UI
     * 
     * @param {Object} guidance - The regulatory guidance data to display
     */
    function displayRegulatoryGuidance(guidance) {
        try {
            // Get the results container
            const resultsContainer = document.getElementById('guidance-results');
            
            if (!resultsContainer) {
                throw new Error('Results container not found');
            }
            
            // Display the results container
            resultsContainer.style.display = 'block';
            
            // Create HTML content for guidance
            let html = `
                <h2>Regulatory Roadmap for ${guidance.businessType}</h2>
                
                <div class="guidance-section">
                    <h3>Key Requirements</h3>
                    <ol class="requirements-list">
            `;
            
            // Add requirements
            guidance.requirements.forEach(requirement => {
                html += `<li>${requirement}</li>`;
            });
            
            html += `
                    </ol>
                </div>
                
                <div class="guidance-section timeline">
                    <div class="timeline-item">
                        <h3>Estimated Timeline</h3>
                        <p>${guidance.timeline}</p>
                    </div>
                    
                    <div class="timeline-item">
                        <h3>Estimated Cost</h3>
                        <p>${guidance.estimatedCost}</p>
                    </div>
                </div>
                
                <div class="guidance-section">
                    <h3>Next Steps</h3>
                    <p>${guidance.nextSteps}</p>
                </div>
            `;
            
            // Set the HTML content
            resultsContainer.innerHTML = html;
            
            // Scroll to results
            resultsContainer.scrollIntoView({ behavior: 'smooth' });
            
            console.log('Regulatory guidance displayed successfully');
        } catch (error) {
            console.error('Error displaying regulatory guidance:', error);
        }
    }
    
    /**
     * Utility function to get form data from multiple fields
     * 
     * @param {Object} fieldMap - Object mapping data keys to input element IDs
     * @returns {Object} - Object containing the form field values
     */
    function getFormData(fieldMap) {
        const data = {};
        
        try {
            // Iterate through the fieldMap to get values from DOM elements
            for (const [key, elementId] of Object.entries(fieldMap)) {
                const element = document.getElementById(elementId);
                if (element) {
                    data[key] = element.value;
                } else {
                    console.warn(`Form field with ID "${elementId}" not found`);
                    data[key] = null;
                }
            }
        } catch (error) {
            console.error('Error retrieving form data:', error);
        }
        
        return data;
    }
    
    /**
     * Toggle loading state for a form
     * 
     * @param {boolean} isLoading - Whether to show or hide loading state
     * @param {string} formType - The type of form (e.g., 'market-insights')
     */
    function toggleLoadingState(isLoading, formType) {
        try {
            // Get the form and submit button
            const formElement = document.getElementById(`${formType}-form`);
            const submitButton = formElement?.querySelector('button[type="submit"]');
            
            if (submitButton) {
                // Disable button and change text during loading
                submitButton.disabled = isLoading;
                
                if (isLoading) {
                    submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Loading...`;
                } else {
                    // Restore original button text based on form type
                    if (formType === 'market-insights') {
                        submitButton.innerHTML = `Get Insights <i class="fas fa-search"></i>`;
                    } else if (formType === 'regulatory-guidance') {
                        submitButton.innerHTML = `Generate Roadmap <i class="fas fa-route"></i>`;
                    }
                }
            }
            
            console.log(`${formType} loading state: ${isLoading ? 'active' : 'inactive'}`);
        } catch (error) {
            console.error('Error toggling loading state:', error);
        }
    }
    
    /**
     * Mock API function to fetch market insights
     * Will be replaced with actual API call in the future
     * 
     * @param {Object} formData - The form data to send to the API
     * @returns {Promise} - Promise that resolves with the insights data
     */
    function fetchMarketInsights(formData) {
        return new Promise((resolve) => {
            // Simulate API delay
            setTimeout(() => {
                // Mock response data
                const insights = {
                    industry: formData.industry,
                    location: formData.location,
                    trends: [
                        { name: 'Market Growth', value: '12.5%', trend: 'up' },
                        { name: 'Competition', value: 'Moderate', trend: 'stable' },
                        { name: 'Entry Barriers', value: 'Low', trend: 'down' }
                    ],
                    opportunities: [
                        'Expanding digital presence',
                        'Export to neighboring countries',
                        'Product diversification'
                    ],
                    risks: [
                        'Regulatory changes',
                        'Seasonal demand fluctuations',
                        'Infrastructure limitations'
                    ]
                };
                
                resolve(insights);
            }, 1500); // Simulate a 1.5s delay for API response
        });
    }
    
    /**
     * Mock API function to fetch regulatory guidance
     * Will be replaced with actual API call to LLM in the future
     * 
     * @param {Object} formData - The form data to send to the API
     * @returns {Promise} - Promise that resolves with the guidance data
     */
    function fetchRegulatoryGuidance(formData) {
        return new Promise((resolve) => {
            // Simulate API delay
            setTimeout(() => {
                // Mock response data
                const guidance = {
                    businessType: formData.businessType,
                    industry: formData.industry,
                    requirements: [
                        'Register your business with the Rwanda Development Board (RDB)',
                        'Obtain Tax Identification Number (TIN) from Rwanda Revenue Authority',
                        'Apply for necessary sector-specific permits and licenses',
                        'Register for Social Security with RSSB',
                        'Comply with environmental regulations if applicable'
                    ],
                    timeline: '4-6 weeks',
                    estimatedCost: '50,000 - 150,000 RWF',
                    nextSteps: 'Start by preparing your business registration documents and visiting the RDB one-stop center in Kigali. Our platform can help you prepare the necessary forms and documentation.'
                };
                
                resolve(guidance);
            }, 2000); // Simulate a 2s delay for API response
        });
    }
}); 