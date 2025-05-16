import { GetCourse, UpdateModuleProgress, MarkModuleComplete } from "../Utilities/api.js";
import { logout } from "./logout.js";

// Get current module ID from URL
const getModuleId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('moduleId');
};

// Get current course title from URL
const getCourseTitle = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('courseTitle');
};

// Get user from session storage
const getUser = () => {
    return sessionStorage.getItem("user");
};

// Initialize module view
const initializeModule = async () => {
    const moduleId = getModuleId();
    const courseTitle = getCourseTitle();
    const user = getUser();

    if (!moduleId || !courseTitle || !user) {
        showError("Missing required information. Please return to the course page.");
        return;
    }

    try {
        const courseResponse = await GetCourse(user, courseTitle);
        if (!courseResponse || !courseResponse.result) {
            throw new Error("Failed to load course details");
        }

        const course = courseResponse.result;
        const currentModule = course.modules.find(m => m.id === moduleId);
        
        if (!currentModule) {
            throw new Error("Module not found");
        }

        // Update module title and meta information
        document.getElementById("module-title").textContent = currentModule.title;
        document.getElementById("module-number").textContent = `Module ${course.modules.indexOf(currentModule) + 1} of ${course.modules.length}`;
        
        if (currentModule.status) {
            const statusElement = document.getElementById("module-status");
            statusElement.textContent = currentModule.status;
            statusElement.className = `module-status status-${currentModule.status.toLowerCase().replace(/\s+/g, '-')}`;
        }

        // Update progress bar if available
        if (currentModule.progress !== undefined) {
            document.getElementById("module-progress").style.width = `${currentModule.progress}%`;
            document.querySelector(".progress-text").textContent = `${currentModule.progress}% Complete`;
        }

        // Display module content
        const contentDisplay = document.getElementById("module-content-display");
        if (currentModule.content) {
            contentDisplay.innerHTML = `
                <div class="module-content">
                    ${currentModule.content}
                </div>
            `;

            // Initialize progress tracking
            trackProgress(moduleId);
        } else {
            contentDisplay.innerHTML = '<p class="no-content">No content available for this module.</p>';
        }

        // Show/hide action buttons based on module state
        const markCompleteButton = document.getElementById("mark-complete");
        const takeQuizLink = document.getElementById("take-quiz-link");
        const quizStatus = document.getElementById("quiz-status");

        if (currentModule.status === "completed") {
            markCompleteButton.style.display = "none";
            if (currentModule.quiz) {
                takeQuizLink.style.display = "inline-block";
                takeQuizLink.href = `/quiz.html?moduleId=${moduleId}&courseTitle=${encodeURIComponent(courseTitle)}`;
                quizStatus.textContent = currentModule.quizScore ? `Quiz Score: ${currentModule.quizScore}%` : "";
            }
        } else {
            if (currentModule.progress === 100) {
                markCompleteButton.style.display = "inline-block";
            }
            markCompleteButton.addEventListener("click", () => markModuleComplete(moduleId, courseTitle));
        }

        // Setup navigation
        setupModuleNavigation(course.modules, moduleId, courseTitle);

    } catch (error) {
        console.error("Error loading module:", error);
        showError(error.message);
    }
};

// Mark module as complete
const markModuleComplete = async (moduleId, courseTitle) => {
    try {
        const user = getUser();
        if (!user) {
            throw new Error("User not found");
        }

        const response = await MarkModuleComplete(user, moduleId);
        if (!response || !response.result) {
            throw new Error("Failed to mark module as complete");
        }

        // Refresh the module view
        await initializeModule();

        // Show success message
        const contentDisplay = document.getElementById("module-content-display");
        contentDisplay.innerHTML = `
            <div class="success-message">
                <h2>Module Completed!</h2>
                <p>Congratulations! You have completed this module.</p>
                <div class="module-navigation">
                    <button onclick="window.location.href='/home/public.html#courses/${encodeURIComponent(courseTitle)}'" class="nav-button">
                        Back to Course
                    </button>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Error marking module as complete:", error);
        showError("Failed to mark module as complete");
    }
};

// Update module progress
const updateProgress = async (moduleId, progress) => {
    try {
        const user = getUser();
        if (!user) {
            throw new Error("User not found");
        }

        const response = await UpdateModuleProgress(user, moduleId, progress);
        if (!response || !response.result) {
            throw new Error("Failed to update progress");
        }

        // Update progress bar
        document.getElementById("module-progress").style.width = `${progress}%`;
        document.querySelector(".progress-text").textContent = `${progress}% Complete`;

        // Show complete button if progress is 100%
        const markCompleteButton = document.getElementById("mark-complete");
        if (progress === 100 && markCompleteButton) {
            markCompleteButton.style.display = "inline-block";
        }
    } catch (error) {
        console.error("Error updating progress:", error);
        // Don't show error to user, just log it
    }
};

// Track module progress based on scroll position
const trackProgress = (moduleId) => {
    const contentDisplay = document.getElementById("module-content-display");
    let lastProgress = 0;

    const calculateProgress = () => {
        const scrollHeight = contentDisplay.scrollHeight - contentDisplay.clientHeight;
        if (scrollHeight <= 0) return 100; // If content fits without scrolling

        const scrollPosition = contentDisplay.scrollTop;
        const progress = Math.min(Math.round((scrollPosition / scrollHeight) * 100), 100);

        // Only update if progress has changed significantly (by 5% or more)
        if (Math.abs(progress - lastProgress) >= 5) {
            lastProgress = progress;
            updateProgress(moduleId, progress);
        }
    };

    // Add scroll event listener
    contentDisplay.addEventListener("scroll", () => {
        requestAnimationFrame(calculateProgress);
    });

    // Calculate initial progress
    calculateProgress();
};

// Setup module navigation
const setupModuleNavigation = (modules, currentModuleId, courseTitle) => {
    const currentIndex = modules.findIndex(m => m.id === currentModuleId);
    const prevButton = document.getElementById("prev-module");
    const nextButton = document.getElementById("next-module");
    const backButton = document.getElementById("back-to-course");

    // Previous module
    if (currentIndex > 0) {
        prevButton.disabled = false;
        prevButton.addEventListener("click", () => {
            const prevModule = modules[currentIndex - 1];
            window.location.href = `/home/Modules.html?moduleId=${prevModule.id}&courseTitle=${encodeURIComponent(courseTitle)}`;
        });
    }

    // Next module
    if (currentIndex < modules.length - 1) {
        nextButton.disabled = false;
        nextButton.addEventListener("click", () => {
            const nextModule = modules[currentIndex + 1];
            window.location.href = `/home/Modules.html?moduleId=${nextModule.id}&courseTitle=${encodeURIComponent(courseTitle)}`;
        });
    }

    // Back to course
    backButton.addEventListener("click", () => {
        window.location.href = `/home/public.html#courses/${encodeURIComponent(courseTitle)}`;
    });
};

// Show error message
const showError = (message) => {
    const contentDisplay = document.getElementById("module-content-display");
    contentDisplay.innerHTML = `
        <div class="error-message">
            <h2>Error</h2>
            <p>${message}</p>
            <button class="back-button" onclick="window.history.back()">Go Back</button>
        </div>
    `;
};

// Initialize sidebar navigation
const initializeSidebar = () => {
    const buttons = document.querySelectorAll(".sidebar-nav button");
    buttons.forEach(button => {
        button.addEventListener("click", (e) => {
            const action = e.currentTarget.parentElement.className;
            switch (action) {
                case "dashboard":
                    window.location.href = "/home/public.html";
                    break;
                case "training-modules":
                    window.location.href = "/home/public.html#courses";
                    break;
                case "profile":
                    window.location.href = "/home/Profile.html";
                    break;
                case "progress":
                    window.location.href = "/home/Progress.html";
                    break;
                case "support":
                    window.location.href = "/home/Support.html";
                    break;
            }
        });
    });
};

// Initialize logout button
const initializeLogout = () => {
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }
};

// Initialize everything when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    initializeModule();
    initializeSidebar();
    initializeLogout();
}); 