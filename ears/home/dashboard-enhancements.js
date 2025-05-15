/**
 * EARS Dashboard UI/UX Enhancements
 * This file contains UI/UX improvements for the dashboard.
 */

// Execute when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Apply loading indicators for all API requests
    setupLoadingIndicators();
    
    // Improve responsiveness of sidebar
    enhanceSidebar();
    
    // Fix logout button functionality
    enhanceLogoutButton();
    
    // Improve card animations
    enhanceCardAnimations();
});

/**
 * Sets up loading indicators for all fetch requests in the app
 */
function setupLoadingIndicators() {
    // Create a loading indicator element
    const loadingIndicator = document.createElement('div');
    loadingIndicator.classList.add('global-loading-indicator');
    loadingIndicator.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Loading...</p>
    `;
    document.body.appendChild(loadingIndicator);
    
    // Store original fetch function
    const originalFetch = window.fetch;
    
    // Override fetch to show/hide loading indicator
    window.fetch = function() {
        // Show the loading indicator
        loadingIndicator.classList.add('active');
        
        // Call the original fetch with all arguments
        return originalFetch.apply(this, arguments)
            .then(response => {
                // Hide loading indicator on success
                loadingIndicator.classList.remove('active');
                return response;
            })
            .catch(error => {
                // Hide loading indicator on error
                loadingIndicator.classList.remove('active');
                throw error;
            });
    };
    
    // Add CSS for the loading indicator
    const style = document.createElement('style');
    style.textContent = `
        .global-loading-indicator {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
        }
        
        .global-loading-indicator.active {
            opacity: 1;
            visibility: visible;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        .global-loading-indicator p {
            color: white;
            margin-top: 10px;
            font-size: 18px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Enhances the sidebar behavior and responsiveness
 */
function enhanceSidebar() {
    // Make sidebar collapsible on mobile
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    
    // Add a toggle button for mobile
    const toggleButton = document.createElement('button');
    toggleButton.classList.add('sidebar-toggle');
    toggleButton.innerHTML = '☰';
    toggleButton.setAttribute('aria-label', 'Toggle navigation menu');
    document.querySelector('.main-header').prepend(toggleButton);
    
    // Add toggle functionality
    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            e.target !== toggleButton) {
            sidebar.classList.remove('active');
        }
    });
    
    // Add CSS for the toggle button and mobile sidebar
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
                transition: transform 0.3s ease;
                position: fixed;
                z-index: 1000;
                top: 0;
                left: 0;
                height: 100%;
                width: 250px;
            }
            
            .sidebar.active {
                transform: translateX(0);
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
            }
            
            .sidebar-toggle {
                display: block;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #333;
                margin-right: 10px;
            }
            
            .main-content-area {
                margin-left: 0;
            }
        }
        
        @media (min-width: 769px) {
            .sidebar-toggle {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Enhances logout button to show confirmation before logging out
 */
function enhanceLogoutButton() {
    const logoutButton = document.getElementById('logout-button');
    if (!logoutButton) return;
    
    // Replace the existing event listener with a confirmation dialog
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Create confirmation dialog
        const confirmation = document.createElement('div');
        confirmation.classList.add('logout-confirmation');
        confirmation.innerHTML = `
            <div class="logout-dialog">
                <h3>Log Out</h3>
                <p>Are you sure you want to log out?</p>
                <div class="logout-actions">
                    <button id="confirm-logout">Yes, Log Out</button>
                    <button id="cancel-logout">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(confirmation);
        
        // Add event listeners for the buttons
        document.getElementById('confirm-logout').addEventListener('click', () => {
            // Perform the actual logout
            sessionStorage.removeItem('isUserLoggedIn');
            sessionStorage.removeItem('user');
            window.location.href = '/auth/login.html';
        });
        
        document.getElementById('cancel-logout').addEventListener('click', () => {
            document.body.removeChild(confirmation);
        });
        
        // Add styles for the confirmation dialog
        const style = document.createElement('style');
        style.textContent = `
            .logout-confirmation {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            }
            
            .logout-dialog {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                max-width: 400px;
                width: 90%;
            }
            
            .logout-dialog h3 {
                margin-top: 0;
                color: #2c3e50;
            }
            
            .logout-actions {
                display: flex;
                justify-content: flex-end;
                margin-top: 20px;
            }
            
            .logout-actions button {
                padding: 8px 16px;
                margin-left: 10px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            
            #confirm-logout {
                background-color: #e74c3c;
                color: white;
            }
            
            #cancel-logout {
                background-color: #f1f1f1;
                color: #333;
            }
        `;
        document.head.appendChild(style);
    }, true);
}

/**
 * Enhances card animations throughout the dashboard
 */
function enhanceCardAnimations() {
    // Add styles for card animations
    const style = document.createElement('style');
    style.textContent = `
        .card, .module-card, .module_card, .quiz_card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card:hover, .module-card:hover, .module_card:hover, .quiz_card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        /* Add animation for new content */
        .content {
            animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
}

// Export functions to make them available to other modules if needed
export {
    setupLoadingIndicators,
    enhanceSidebar,
    enhanceLogoutButton,
    enhanceCardAnimations
}; 