import { AccountInfo, GetCourse, GetCourseList } from "../Utilities/api.js";
import { logout } from "./logout.js";
import { modules, shome, sprofile, sprogress, ssupport } from "./static.js";


const getUser = () =>{
    return sessionStorage.getItem("user");
}    

const dashboard = document.querySelector(".dashboard button");
const profile = document.querySelector(".profile button");
const progress = document.querySelector(".progress button");
const tm = document.querySelector(".training-modules button");
const support = document.querySelector(".support button");

const clearActiveClass = ()=>{
    const links = document.querySelectorAll("li");
    links.forEach((el) =>{
        el.classList.remove("active");
    })
}
window.addEventListener("DOMContentLoaded", async (e) => {
    const path = window.location.pathname;
    console.log("DOMContentLoaded, path:", path);

    // Ensure sidebar buttons exist before trying to click them
    // This assumes dashboard.html always loads the full sidebar structure initially
    if (path === "/profile" || path.startsWith("/profile")) {
        if (profile) profile.click(); 
        else await updateDashboard(); // Fallback if profile button not found (e.g. direct nav to /profile)
    } else if (path === "/courses" || path.startsWith("/courses")) {
        if (tm) tm.click();
        else await updateDashboard(); 
    } else if (path === "/progress" || path.startsWith("/progress")) {
        if (progress) progress.click();
        else await updateDashboard(); 
    } else if (path === "/support" || path.startsWith("/support")) {
        if (support) support.click();
        else await updateDashboard(); 
    } else { // Default to dashboard for "/", "/dashboard", or any other path
        await updateDashboard();
    }
});

const updateDashboard = async () => {
    clearActiveClass();
    document.querySelector(".dashboard").classList.add("active");
    const content = document.querySelector(".main-content-area main");
    content.classList.remove("cardContainer");
    content.classList.remove("course-content")
    content.classList.add("content")
    content.innerHTML = shome;
    
    const userEmail = getUser();
    console.log("User from sessionStorage:", userEmail);
    const detailsObject = await AccountInfo(userEmail);
    console.log("AccountInfo detailsObject:", detailsObject);

    const mcompleted = document.querySelector("#modules-completed");
    const avg = document.querySelector("#average-score");

    if (detailsObject && detailsObject.result && typeof detailsObject.result === 'object') {
        const accountData = detailsObject.result;
        mcompleted.textContent = accountData.mcompleted !== undefined ? accountData.mcompleted : 'N/A';
        avg.textContent = accountData.avgscore !== undefined ? accountData.avgscore + "%" : "N/A%";
    } else {
        console.error("Failed to fetch or parse account info. Response:", detailsObject);
        mcompleted.textContent = 'N/A';
        avg.textContent = "N/A%";
    }
    // logout(); // Temporarily commented out - seems problematic here
    history.pushState({}, "", "dashboard");
}
dashboard.addEventListener("click", async (e) =>{
    e.preventDefault();
    updateDashboard();
})

profile.addEventListener("click", async (e) =>{
    e.preventDefault();
    clearActiveClass();
    document.querySelector(".profile").classList.add("active");
    
    // Fetch the Profile.html content
    try {
        const response = await fetch('/home/Profile.html');
        if (!response.ok) throw new Error('Failed to load Profile page');
        const html = await response.text();
        
        // Create a temporary div to parse the HTML
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        // Extract the main content
        const newContent = temp.querySelector('.main-content-area main');
        
        // Replace the existing content
        const parent = document.querySelector(".main-content-area");
        const oldContent = parent.querySelector("main");
        if (oldContent) {
            parent.removeChild(oldContent);
        }
        
        parent.appendChild(newContent);
        
        // Initialize the profile page
        const script = document.createElement('script');
        script.type = 'module';
        script.src = '/home/profile.js';
        document.body.appendChild(script);
    } catch (error) {
        console.error('Error loading Profile page:', error);
    }
    
    logout();
    history.pushState({}, "", "profile");
})


// tm.addEventListener("click", (e) => {
//     e.preventDefault();
//     clearActiveClass();
//     document.querySelector(".training-modules").classList.add("active");
//      const container = document.querySelector(".employee-dashboard-layout")
//      container.removeChild(document.querySelector('.main-content-area'));
//      const temp = document.createElement("div");
//      temp.classList.add("main-content-area")
//      temp.innerHTML = modules;
//      container.appendChild(temp);
//      logout();
// });
                /*<main class="content cardContainer">
                <div class="card">
                    <div class="card-content">
                        <h1>Title</h1>
                        <h2>Course Code</h2>
                        <h3>Description</h3>
                    </div>
                </div>
            </main>*/

// Reverted Training Modules click listener
tm.addEventListener("click", async (e) => {
    e.preventDefault();
    clearActiveClass();
    document.querySelector(".training-modules").classList.add("active");

    const mainContentArea = document.querySelector(".main-content-area");
    const oldMainElement = mainContentArea.querySelector("main");
    if (oldMainElement) {
        mainContentArea.removeChild(oldMainElement);
    }

    const newMainElement = document.createElement("main");
    newMainElement.classList.add("content", "cardContainer"); // Ensure styling for cards

    try {
        const coursesResponse = await GetCourseList();
        if (coursesResponse && coursesResponse.result && Array.isArray(coursesResponse.result)) {
            if (coursesResponse.result.length === 0) {
                newMainElement.innerHTML = "<p>No training modules available at the moment.</p>";
            } else {
                coursesResponse.result.forEach(course => {
                    const card = document.createElement("div");
                    card.classList.add("card"); // Class for styling individual course cards

                    const cardContent = document.createElement("div");
                    cardContent.classList.add("card-content");

                    const title = document.createElement("h1");
                    title.textContent = course.title;

                    // Add more course details if available and desired, e.g., description
                    // const description = document.createElement("p");
                    // description.textContent = course.description || "No description available.";
                    // cardContent.appendChild(description);

                    cardContent.appendChild(title);
                    card.appendChild(cardContent);

                    card.addEventListener("click", () => {
                        showCourse(course.title);
                    });
                    newMainElement.appendChild(card);
                });
            }
        } else {
            console.error("Failed to load courses or invalid format:", coursesResponse);
            newMainElement.innerHTML = "<p>Error loading training modules. Please try again.</p>";
             if (coursesResponse && coursesResponse.error) {
                newMainElement.innerHTML += `<p>Details: ${coursesResponse.error}</p>`;
            }
        }
    } catch (error) {
        console.error("Error in Training Modules click listener:", error);
        newMainElement.innerHTML = "<p>An unexpected error occurred. Please try again.</p>";
    }

    mainContentArea.appendChild(newMainElement);
    logout(); // This matches the previous behavior, review if logout button needs re-init
    history.pushState({}, "", "/home/courses"); // New absolute path
});

// Restored showCourse function
const showCourse = async (courseTitle) => {
    clearActiveClass();
    document.querySelector(".training-modules").classList.add("active");

    const mainContentArea = document.querySelector('.main-content-area');
    const oldMainElement = mainContentArea.querySelector("main");
    if (oldMainElement) {
        mainContentArea.removeChild(oldMainElement);
    }

    const newMainElement = document.createElement("main");
    newMainElement.classList.add("content", "course-content");

    // Add loading state
    const loadingElement = document.createElement("div");
    loadingElement.classList.add("loading-indicator");
    loadingElement.textContent = "Loading course details...";
    newMainElement.appendChild(loadingElement);
    mainContentArea.appendChild(newMainElement);

    try {
        const userEmail = getUser();
        const courseDetailsResponse = await GetCourse(userEmail, courseTitle);
        
        // Enhanced error handling for GetCourse response
        if (!courseDetailsResponse) {
            console.error("GetCourse returned undefined or null response");
            throw new Error("Failed to load course details: No response from server.");
        }
        if (courseDetailsResponse.error) {
            console.error("Error from GetCourse API:", courseDetailsResponse.error);
            throw new Error(`Failed to load course details: ${courseDetailsResponse.error}`);
        }
        if (!courseDetailsResponse.result) {
            console.error("GetCourse response missing 'result' field:", courseDetailsResponse);
            throw new Error("Failed to load course details: Invalid data format from server.");
        }

        // Remove loading indicator
        newMainElement.removeChild(loadingElement);

        const courseData = courseDetailsResponse.result;

        // Course Header Section
        const courseHeader = document.createElement("div");
        courseHeader.classList.add("course-header");

        const headerTitle = document.createElement("h1");
        headerTitle.textContent = courseData.title || courseTitle;
        headerTitle.classList.add("course-main-title");
        courseHeader.appendChild(headerTitle);

        if (courseData.description) {
            const description = document.createElement("p");
            description.textContent = courseData.description;
            description.classList.add("course-description");
            courseHeader.appendChild(description);
        }

        newMainElement.appendChild(courseHeader);

        // Modules Section
        const modulesSection = document.createElement("div");
        modulesSection.classList.add("modules-section");

        const modulesTitle = document.createElement("h2");
        modulesTitle.textContent = "Course Modules";
        modulesTitle.classList.add("posh1");
        modulesSection.appendChild(modulesTitle);

        const modulesGridContainer = document.createElement("div");
        modulesGridContainer.classList.add("modules-grid-container");

        if (courseData.modules && Array.isArray(courseData.modules) && courseData.modules.length > 0) {
            courseData.modules.forEach((module, index) => {
                const moduleCard = document.createElement("div");
                moduleCard.classList.add("module_card");

                const moduleHeader = document.createElement("div");
                moduleHeader.classList.add("module-header");

                const moduleNumber = document.createElement("span");
                moduleNumber.textContent = `Module ${index + 1}`;
                moduleNumber.classList.add("module-number");
                moduleHeader.appendChild(moduleNumber);

                const moduleTitle = document.createElement("h4");
                moduleTitle.textContent = module.title;
                moduleHeader.appendChild(moduleTitle);

                moduleCard.appendChild(moduleHeader);

                if (module.description) {
                    const moduleDesc = document.createElement("p");
                    moduleDesc.textContent = module.description;
                    moduleDesc.classList.add("module-description");
                    moduleCard.appendChild(moduleDesc);
                }

                // Add status indicator if available
                if (module.status) {
                    const statusIndicator = document.createElement("div");
                    statusIndicator.classList.add("module-status");
                    statusIndicator.classList.add(`status-${module.status.toLowerCase().replace(/\s+/g, '-')}`);
                    statusIndicator.textContent = module.status;
                    moduleCard.appendChild(statusIndicator);
                }

                moduleCard.addEventListener("click", () => {
                    window.location.href = `/home/Modules.html?moduleId=${module.id}&courseTitle=${encodeURIComponent(courseTitle)}`;
                });

                modulesGridContainer.appendChild(moduleCard);
            });
        } else {
            const noModulesMessage = document.createElement("div");
            noModulesMessage.classList.add("no-modules-message");
            noModulesMessage.textContent = "No modules are currently available for this course.";
            modulesGridContainer.appendChild(noModulesMessage);
        }

        modulesSection.appendChild(modulesGridContainer);
        newMainElement.appendChild(modulesSection);

        // Add back button
        const backButton = document.createElement("button");
        backButton.classList.add("back-button");
        backButton.textContent = "Back to Courses";
        backButton.addEventListener("click", (e) => {
            e.preventDefault();
            tm.click(); // Reuse the training modules click handler
        });
        newMainElement.appendChild(backButton);

    } catch (error) {
        console.error("Error loading course details:", error);
        newMainElement.innerHTML = `
            <div class="error-message">
                <h2>Error Loading Course</h2>
                <p>Failed to load course details. Please try again later.</p>
                <button class="back-button">Back to Courses</button>
            </div>
        `;
        const backButton = newMainElement.querySelector(".back-button");
        if (backButton) {
            backButton.addEventListener("click", (e) => {
                e.preventDefault();
                tm.click();
            });
        }
    }

    // Update URL to reflect current course
    history.pushState({}, "", `/home/courses/${encodeURIComponent(courseTitle)}`);
    logout();
};

progress.addEventListener("click", async (e) => {
    e.preventDefault();
    clearActiveClass();
    document.querySelector(".progress").classList.add("active");
    
    // Fetch the Progress.html content
    try {
        const response = await fetch('/home/Progress.html');
        if (!response.ok) throw new Error('Failed to load Progress page');
        const html = await response.text();
        
        // Create a temporary div to parse the HTML
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        // Extract the main content
        const newContent = temp.querySelector('.main-content-area main');
        
        // Replace the existing content
        const parent = document.querySelector(".main-content-area");
        const oldContent = parent.querySelector("main");
        if (oldContent) {
            parent.removeChild(oldContent);
        }
        
        parent.appendChild(newContent);
        
        // Initialize the progress page
        const script = document.createElement('script');
        script.type = 'module';
        script.src = '/home/progress.js';
        document.body.appendChild(script);
    } catch (error) {
        console.error('Error loading Progress page:', error);
    }
    
    logout();
    history.pushState({}, "", "progress");
});

support.addEventListener("click", async (e) => {
    e.preventDefault();
    clearActiveClass();
    document.querySelector(".support").classList.add("active");
    const parent = document.querySelector(".main-content-area");
    const tempContent = document.querySelector(".main-content-area main");
    if (tempContent) {
        parent.removeChild(tempContent);
    }

    const content = document.createElement("main");
    content.classList.add("content");
    content.innerHTML = ssupport;
    parent.appendChild(content);
    logout();
    history.pushState({}, "", "support");
});