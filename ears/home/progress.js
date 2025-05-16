// Progress data management
let moduleData = [];
let progressChart = null;
let scoreChart = null;

// Fetch progress data from the server
async function fetchProgressData() {
    try {
        const token = sessionStorage.getItem('token');
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await fetch('/api/users/progress', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch progress data');
        }

        moduleData = await response.json();
        updateUI();
    } catch (error) {
        console.error('Error fetching progress:', error);
        showError('Failed to load progress data. Please try again later.');
    }
}

// Update all UI elements with the latest data
function updateUI() {
    updateStatistics();
    updateCharts();
    updateTable();
}

// Update statistics cards
function updateStatistics() {
    const completedModules = moduleData.filter(module => module.status === 'completed');
    const totalModules = moduleData.length;
    const completionRate = totalModules ? (completedModules.length / totalModules * 100).toFixed(1) : 0;
    const averageScore = completedModules.length ? 
        (completedModules.reduce((sum, module) => sum + module.score, 0) / completedModules.length).toFixed(1) : 0;

    document.getElementById('completion-rate').textContent = `${completionRate}%`;
    document.getElementById('modules-completed').textContent = `${completedModules.length}/${totalModules}`;
    document.getElementById('average-score').textContent = `${averageScore}%`;
}

// Initialize and update charts
function updateCharts() {
    const ctx1 = document.getElementById('progressChart').getContext('2d');
    const ctx2 = document.getElementById('scoreChart').getContext('2d');

    // Destroy existing charts if they exist
    if (progressChart) progressChart.destroy();
    if (scoreChart) scoreChart.destroy();

    // Create progress chart
    progressChart = new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'In Progress', 'Not Started'],
            datasets: [{
                data: [
                    moduleData.filter(m => m.status === 'completed').length,
                    moduleData.filter(m => m.status === 'in-progress').length,
                    moduleData.filter(m => m.status === 'not-started').length
                ],
                backgroundColor: ['#2ecc71', '#3498db', '#95a5a6']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Module Completion Status'
                }
            }
        }
    });

    // Create score distribution chart
    const completedModules = moduleData.filter(m => m.status === 'completed');
    scoreChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: completedModules.map(m => m.name),
            datasets: [{
                label: 'Score (%)',
                data: completedModules.map(m => m.score),
                backgroundColor: '#3498db'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Module Scores'
                }
            }
        }
    });
}

// Update the progress table
function updateTable() {
    const tbody = document.getElementById('progress-table-body');
    const statusFilter = document.getElementById('status-filter').value;
    
    let filteredData = moduleData;
    if (statusFilter !== 'all') {
        filteredData = moduleData.filter(module => module.status === statusFilter);
    }

    tbody.innerHTML = filteredData.map(module => `
        <tr>
            <td>${module.name}</td>
            <td>
                <span class="status-badge ${module.status}">
                    ${module.status.replace('-', ' ')}
                </span>
            </td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${module.progress}%"></div>
                    <span>${module.progress}%</span>
                </div>
            </td>
            <td>${module.status === 'completed' ? `${module.score}%` : '-'}</td>
            <td>${new Date(module.lastActivity).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

// Generate and download progress report
function downloadReport() {
    const reportData = moduleData.map(module => ({
        'Module Name': module.name,
        'Status': module.status,
        'Progress': `${module.progress}%`,
        'Score': module.status === 'completed' ? `${module.score}%` : '-',
        'Last Activity': new Date(module.lastActivity).toLocaleDateString()
    }));

    const csv = [
        Object.keys(reportData[0]).join(','),
        ...reportData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'progress-report.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Show error message
function showError(message) {
    // You can implement this based on your UI design
    console.error(message);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchProgressData();
    
    // Add filter change listener
    document.getElementById('status-filter').addEventListener('change', updateTable);
    
    // Add download button listener
    document.getElementById('download-progress').addEventListener('click', downloadReport);
}); 