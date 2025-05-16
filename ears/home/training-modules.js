import { GetCourse, GetCourseList } from "../Utilities/api.js";

let currentModules = [];
let filteredModules = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadModules();
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('module-search');
    searchInput.addEventListener('input', handleSearch);

    // Filter functionality
    const statusFilter = document.getElementById('status-filter');
    statusFilter.addEventListener('change', handleFilter);

    // Back button
    const backButton = document.getElementById('back-to-modules');
    backButton.addEventListener('click', showModulesList);
}

// Show loading state
function showLoading(container, message = 'Loading...') {
    container.innerHTML = `
        <div class="module-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>${message}</p>
        </div>
    `;
}

// Load modules from the API
async function loadModules() {
    const grid = document.getElementById('modules-grid');
    showLoading(grid, 'Loading modules...');

    try {
        // Check if user is logged in
        const user = sessionStorage.getItem('user');
        console.log('Current user:', user);
        
        if (!user) {
            throw new Error('User not authenticated');
        }

        console.log('Calling GetCourseList...');
        const response = await GetCourseList();
        console.log('GetCourseList response:', response);

        if (!response) {
            throw new Error('No response from GetCourseList');
        }

        // Handle empty but valid response
        if (response.result && Array.isArray(response.result) && response.result.length === 0) {
            grid.innerHTML = `
                <div class="info-message">
                    <i class="fas fa-info-circle"></i>
                    <p>No training modules are currently available.</p>
                    <p class="sub-text">Please check back later or contact support if you believe this is an error.</p>
                </div>
            `;
            return;
        }

        if (!response.result) {
            if (response.error) {
                throw new Error(`API Error: ${response.error}`);
            }
            throw new Error('Failed to fetch modules');
        }

        console.log('Processing modules:', response.result);
        currentModules = response.result.map(course => {
            const progress = calculateProgress(course);
            const status = determineStatus(course);
            console.log(`Module ${course.title}: progress=${progress}, status=${status}`);
            return {
                ...course,
                progress,
                status
            };
        });

        filteredModules = [...currentModules];
        console.log('Rendering modules:', currentModules);
        renderModules(currentModules);
    } catch (error) {
        console.error('Error in loadModules:', error);
        grid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${error.message === 'User not authenticated' ? 
                    'Please log in to view modules.' : 
                    `Failed to load modules: ${error.message}`}</p>
                <div class="error-details">
                    <p>Troubleshooting steps:</p>
                    <ol>
                        <li>Check your internet connection</li>
                        <li>Try refreshing the page</li>
                        <li>Log out and log back in</li>
                        <li>If the problem persists, contact support</li>
                    </ol>
                </div>
                ${error.message === 'User not authenticated' ? 
                    '<button onclick="window.location.href=\'/\'">Go to Login</button>' : 
                    '<button onclick="loadModules()">Retry Loading</button>'}
            </div>
        `;
    }
}

// Calculate progress for a course
function calculateProgress(course) {
    if (!course.modules || course.modules.length === 0) return 0;
    const completedModules = course.modules.filter(module => module.completed).length;
    return Math.round((completedModules / course.modules.length) * 100);
}

// Determine the status of a course
function determineStatus(course) {
    const progress = calculateProgress(course);
    if (progress === 100) return 'completed';
    if (progress > 0) return 'in-progress';
    return 'not-started';
}

// Render modules to the grid
function renderModules(modules) {
    const grid = document.getElementById('modules-grid');
    
    if (modules.length === 0) {
        grid.innerHTML = '<div class="no-modules">No modules found</div>';
        return;
    }

    grid.innerHTML = modules.map(module => `
        <div class="module-card ${module.status}" data-module-id="${module.id}">
            <div class="module-card-content">
                <h3>${module.title}</h3>
                <div class="module-info">
                    <div class="progress-indicator">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${module.progress}%"></div>
                        </div>
                        <span class="progress-text">${module.progress}% Complete</span>
                    </div>
                    <span class="status-badge ${module.status}">
                        ${module.status.replace('-', ' ')}
                    </span>
                </div>
                <div class="module-actions">
                    <button class="btn-primary" onclick="viewModule('${module.id}')">
                        ${module.status === 'not-started' ? 'Start Module' : 'Continue Module'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Add click handlers for module cards
    document.querySelectorAll('.module-card').forEach(card => {
        card.addEventListener('click', () => viewModule(card.dataset.moduleId));
    });
}

// Handle module search
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;
    
    filteredModules = currentModules.filter(module => {
        const matchesSearch = module.title.toLowerCase().includes(searchTerm);
        const matchesFilter = statusFilter === 'all' || module.status === statusFilter;
        return matchesSearch && matchesFilter;
    });
    
    renderModules(filteredModules);
}

// Handle status filter
function handleFilter(event) {
    const filterValue = event.target.value;
    const searchTerm = document.getElementById('module-search').value.toLowerCase();
    
    filteredModules = currentModules.filter(module => {
        const matchesSearch = module.title.toLowerCase().includes(searchTerm);
        const matchesFilter = filterValue === 'all' || module.status === filterValue;
        return matchesSearch && matchesFilter;
    });
    
    renderModules(filteredModules);
}

// View module details
async function viewModule(moduleId) {
    const moduleDetails = document.getElementById('module-details');
    const moduleContent = moduleDetails.querySelector('.module-content');
    
    try {
        const module = currentModules.find(m => m.id === moduleId);
        if (!module) throw new Error('Module not found');

        // Show loading state
        showLoading(moduleContent, 'Loading module details...');
        moduleDetails.style.display = 'block';
        document.querySelector('.modules-container').style.display = 'none';

        const user = sessionStorage.getItem('user');
        if (!user) {
            throw new Error('User not authenticated');
        }

        const moduleData = await GetCourse(user, module.title);
        if (!moduleData || !moduleData.result) {
            throw new Error('Failed to load module details');
        }
        
        // Update UI with module details
        document.getElementById('module-title').textContent = module.title;
        document.getElementById('module-progress').style.width = `${module.progress}%`;
        document.querySelector('#module-progress + .progress-text').textContent = `${module.progress}% Complete`;

        // Render lessons with error handling
        const lessonsList = document.getElementById('lessons-list');
        if (Array.isArray(moduleData.result.modules)) {
            lessonsList.innerHTML = moduleData.result.modules.map((lesson, index) => `
                <div class="lesson-item ${lesson.completed ? 'completed' : ''}" 
                     role="button" 
                     tabindex="0" 
                     onclick="window.location.href='/lesson/${lesson.id}'">
                    <span class="lesson-number">${index + 1}</span>
                    <span class="lesson-title">${lesson.title}</span>
                    <span class="lesson-status">
                        ${lesson.completed ? 
                            '<i class="fas fa-check-circle"></i> Completed' : 
                            '<i class="fas fa-circle"></i> Not Started'}
                    </span>
                </div>
            `).join('');
        } else {
            lessonsList.innerHTML = '<div class="error-message">No lessons available</div>';
        }

        // Render assessments with error handling
        const assessmentsList = document.getElementById('assessments-list');
        if (Array.isArray(moduleData.result.quizzes)) {
            assessmentsList.innerHTML = moduleData.result.quizzes.map((quiz, index) => `
                <div class="assessment-item" 
                     role="button" 
                     tabindex="0" 
                     onclick="window.location.href='/assessment/${quiz.id}'">
                    <span class="assessment-title">Assessment ${index + 1}</span>
                    <span class="assessment-score">
                        ${quiz.score > 0 ? 
                            `Score: ${quiz.score}/${quiz.maxScore}` : 
                            'Not Attempted'}
                    </span>
                </div>
            `).join('');
        } else {
            assessmentsList.innerHTML = '<div class="error-message">No assessments available</div>';
        }

    } catch (error) {
        console.error('Error loading module details:', error);
        moduleContent.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${error.message === 'User not authenticated' ? 
                    'Please log in to view module details.' : 
                    'Failed to load module details. Please try again.'}</p>
                <button onclick="showModulesList()">Back to Modules</button>
            </div>
        `;
    }
}

// Show modules list
function showModulesList() {
    document.querySelector('.modules-container').style.display = 'block';
    document.getElementById('module-details').style.display = 'none';
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const container = document.querySelector('.modules-container');
    container.insertBefore(errorDiv, container.firstChild);
    
    setTimeout(() => errorDiv.remove(), 5000);
} 