document.addEventListener('DOMContentLoaded', function() {
    // Display current date
    const currentDateElement = document.getElementById('current-date');
    if (currentDateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDateElement.textContent = new Date().toLocaleDateString('en-US', options);
    }
    
    // Page Navigation
    setupAdminNavigation();
    
    // Load Mock Data
    loadDashboardStats();
    initCharts();
    loadUsersTable();
    
    // Add event listeners
    setupEventListeners();
});

/**
 * Set up admin panel navigation
 */
function setupAdminNavigation() {
    const navLinks = document.querySelectorAll('.admin-sidebar .nav-link');
    const adminPages = document.querySelectorAll('.admin-page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle internal links
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                // Get target page ID
                const targetId = this.getAttribute('href').substring(1);
                
                // Deactivate all pages and nav links
                adminPages.forEach(page => page.classList.remove('active'));
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Activate target page and nav link
                document.getElementById(targetId).classList.add('active');
                this.classList.add('active');
            }
        });
    });
}

/**
 * Set up event listeners for admin panel functionality
 */
function setupEventListeners() {
    // Select all checkbox in users table
    const selectAllUsers = document.getElementById('select-all-users');
    if (selectAllUsers) {
        selectAllUsers.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('#users-table-body input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateSelectedCount();
        });
    }
    
    // User table row checkboxes
    const userTableBody = document.getElementById('users-table-body');
    if (userTableBody) {
        userTableBody.addEventListener('change', function(e) {
            if (e.target.type === 'checkbox') {
                updateSelectedCount();
                
                // Update "select all" checkbox
                const allCheckboxes = document.querySelectorAll('#users-table-body input[type="checkbox"]');
                const checkedCheckboxes = document.querySelectorAll('#users-table-body input[type="checkbox"]:checked');
                
                if (selectAllUsers) {
                    selectAllUsers.checked = allCheckboxes.length === checkedCheckboxes.length;
                    selectAllUsers.indeterminate = checkedCheckboxes.length > 0 && allCheckboxes.length !== checkedCheckboxes.length;
                }
            }
        });
    }
    
    // Filter button
    const filterButton = document.querySelector('.filter-button');
    if (filterButton) {
        filterButton.addEventListener('click', function() {
            // In a real application, this would apply filters to the data
            // For now, just show a message
            alert('Filters applied!');
        });
    }
    
    // Reset filters button
    const resetButton = document.querySelector('.filter-reset');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            const filters = document.querySelectorAll('.filter-group select');
            filters.forEach(filter => {
                filter.value = 'all';
            });
        });
    }
    
    // Pagination buttons
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    
    if (prevPageBtn && nextPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            if (!this.disabled) {
                navigateToPage(getCurrentPage() - 1);
            }
        });
        
        nextPageBtn.addEventListener('click', function() {
            if (!this.disabled) {
                navigateToPage(getCurrentPage() + 1);
            }
        });
    }
    
    // Bulk action buttons
    const actionButtons = document.querySelectorAll('.action-buttons .action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedCount = document.querySelectorAll('#users-table-body input[type="checkbox"]:checked').length;
            
            if (selectedCount === 0) {
                alert('Please select at least one user to perform this action.');
            } else {
                const actionText = this.textContent.trim();
                alert(`${actionText} action will be performed on ${selectedCount} users.`);
            }
        });
    });
}

/**
 * Load mock stats for dashboard
 */
function loadDashboardStats() {
    // Set dashboard KPI values
    document.getElementById('total-users').textContent = '3,214';
    document.getElementById('users-change').textContent = '12%';
    
    document.getElementById('premium-users').textContent = '428';
    document.getElementById('premium-change').textContent = '18%';
    
    document.getElementById('monthly-revenue').textContent = '14,356,000 RWF';
    document.getElementById('revenue-change').textContent = '23%';
    
    document.getElementById('active-sessions').textContent = '187';
    document.getElementById('sessions-change').textContent = '5%';
}

/**
 * Initialize all dashboard charts
 */
function initCharts() {
    initUserGrowthChart();
    initRevenueChart();
    initFeatureUsageChart();
    initSubscriptionChart();
}

/**
 * Initialize user growth chart
 */
function initUserGrowthChart() {
    const ctx = document.getElementById('user-growth-chart');
    if (!ctx) return;
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Total Users',
                    data: [1820, 2012, 2150, 2340, 2510, 2690, 2810, 2920, 3050, 3180, 3214, 3214],
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Premium Users',
                    data: [120, 165, 210, 250, 270, 310, 345, 380, 395, 410, 420, 428],
                    borderColor: '#f8961e',
                    backgroundColor: 'rgba(248, 150, 30, 0.1)',
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Initialize revenue chart
 */
function initRevenueChart() {
    const ctx = document.getElementById('revenue-chart');
    if (!ctx) return;
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Monthly Revenue (RWF)',
                    data: [6000000, 7500000, 9200000, 10500000, 11200000, 12100000, 12800000, 13500000, 13900000, 14200000, 14350000, 14356000],
                    backgroundColor: '#4cc9f0'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return (value / 1000000) + 'M';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Initialize feature usage chart
 */
function initFeatureUsageChart() {
    const ctx = document.getElementById('feature-usage-chart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Market Insights', 'Regulatory Guidance', 'Dashboard', 'Reports', 'Data Export', 'Notifications'],
            datasets: [
                {
                    label: 'Free Users',
                    data: [80, 65, 90, 40, 30, 20],
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.2)',
                },
                {
                    label: 'Premium Users',
                    data: [70, 80, 95, 85, 90, 75],
                    borderColor: '#f8961e',
                    backgroundColor: 'rgba(248, 150, 30, 0.2)',
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });
}

/**
 * Initialize subscription distribution chart
 */
function initSubscriptionChart() {
    const ctx = document.getElementById('subscription-chart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Free', 'Premium (Monthly)', 'Premium (Annual)', 'Enterprise'],
            datasets: [
                {
                    data: [2786, 203, 165, 60],
                    backgroundColor: ['#adb5bd', '#4361ee', '#4895ef', '#3f37c9'],
                    hoverOffset: 4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

/**
 * Load users table with mock data
 */
function loadUsersTable() {
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add mock user data
    const users = generateMockUsers(25);
    users.forEach(user => {
        tableBody.appendChild(createUserTableRow(user));
    });
    
    // Set up pagination
    setupPagination(100, 25, 1);
}

/**
 * Generate mock users data
 * 
 * @param {number} count - Number of users to generate
 * @returns {Array} Array of user objects
 */
function generateMockUsers(count) {
    const plans = ['free', 'premium', 'premium', 'enterprise'];
    const statuses = ['active', 'active', 'active', 'active', 'inactive', 'pending'];
    const users = [];
    
    for (let i = 1; i <= count; i++) {
        const firstName = ['John', 'Alice', 'Samuel', 'Marie', 'Claude', 'Jean', 'Paul', 'Diane', 'Emmanuel', 'Christine'][Math.floor(Math.random() * 10)];
        const lastName = ['Uwimana', 'Mutesi', 'Kamikazi', 'Mugisha', 'Muhire', 'Rukundo', 'Tuyishime', 'Bizimana', 'Niyonzima', 'Hakizimana'][Math.floor(Math.random() * 10)];
        
        const user = {
            id: i,
            name: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
            avatar: `https://i.pravatar.cc/150?img=${i % 70}`,
            plan: plans[Math.floor(Math.random() * plans.length)],
            joinDate: new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
            lastLogin: new Date(2023, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
            status: statuses[Math.floor(Math.random() * statuses.length)]
        };
        
        users.push(user);
    }
    
    return users;
}

/**
 * Create a user table row element
 * 
 * @param {Object} user - User data object
 * @returns {HTMLTableRowElement} Table row element
 */
function createUserTableRow(user) {
    const tr = document.createElement('tr');
    
    tr.innerHTML = `
        <td>
            <input type="checkbox" class="user-checkbox" data-user-id="${user.id}">
        </td>
        <td>
            <div class="user-name">
                <img src="${user.avatar}" alt="${user.name}" class="user-avatar">
                ${user.name}
            </div>
        </td>
        <td>${user.email}</td>
        <td>
            <span class="user-plan plan-${user.plan}">${user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}</span>
        </td>
        <td>${user.joinDate}</td>
        <td>${user.lastLogin}</td>
        <td>
            <span class="user-status status-${user.status}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span>
        </td>
        <td>
            <div class="action-menu">
                <button class="action-btn edit-user" data-user-id="${user.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn delete-user" data-user-id="${user.id}">
                    <i class="fas fa-trash-alt"></i> Delete
                </button>
            </div>
        </td>
    `;
    
    return tr;
}

/**
 * Set up pagination for the table
 * 
 * @param {number} total - Total number of items
 * @param {number} perPage - Items per page
 * @param {number} currentPage - Current page number
 */
function setupPagination(total, perPage, currentPage) {
    const pageCount = Math.ceil(total / perPage);
    const pageNumbers = document.getElementById('page-numbers');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    
    if (!pageNumbers || !prevPageBtn || !nextPageBtn) return;
    
    // Clear existing page numbers
    pageNumbers.innerHTML = '';
    
    // Add page numbers
    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement('button');
        button.className = `page-number ${i === currentPage ? 'active' : ''}`;
        button.textContent = i;
        button.addEventListener('click', function() {
            navigateToPage(i);
        });
        
        pageNumbers.appendChild(button);
    }
    
    // Update prev/next buttons
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === pageCount;
}

/**
 * Navigate to a specific page
 * 
 * @param {number} page - Page number to navigate to
 */
function navigateToPage(page) {
    const pageButtons = document.querySelectorAll('.page-number');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    
    // Update active page button
    pageButtons.forEach(button => {
        button.classList.toggle('active', parseInt(button.textContent) === page);
    });
    
    // Update prev/next buttons
    if (prevPageBtn) {
        prevPageBtn.disabled = page === 1;
    }
    
    if (nextPageBtn) {
        nextPageBtn.disabled = page === pageButtons.length;
    }
    
    // In a real application, this would load the data for the new page
    // For now, just log a message
    console.log(`Navigated to page ${page}`);
}

/**
 * Get the current page number
 * 
 * @returns {number} Current page number
 */
function getCurrentPage() {
    const activePageButton = document.querySelector('.page-number.active');
    return activePageButton ? parseInt(activePageButton.textContent) : 1;
}

/**
 * Update the selected items count
 */
function updateSelectedCount() {
    const selectedCount = document.querySelectorAll('#users-table-body input[type="checkbox"]:checked').length;
    const countElement = document.querySelector('.selected-count');
    
    if (countElement) {
        countElement.textContent = `${selectedCount} users selected`;
    }
}