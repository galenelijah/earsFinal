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
tm.addEventListener("click", async (e) => {
    e.preventDefault();
    clearActiveClass();
    document.querySelector(".training-modules").classList.add("active");

    try {
        // Load training-modules.html content
        const response = await fetch('/home/training-modules.html');
        if (!response.ok) throw new Error('Failed to load Training Modules page');
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
        
        // Add CSS file
        if (!document.querySelector('link[href="/css/training-modules.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/css/training-modules.css';
            document.head.appendChild(link);
        }
        
        // Initialize the training modules page
        const script = document.createElement('script');
        script.type = 'module';
        script.src = '/home/training-modules.js';
        document.body.appendChild(script);
    } catch (error) {
        console.error('Error loading Training Modules page:', error);
        const parent = document.querySelector(".main-content-area");
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = 'Failed to load Training Modules. Please try again later.';
        parent.appendChild(errorDiv);
    }
    
    logout();
    history.pushState({}, "", "courses");
});

/*
            <main class="content   course-content">
                <h1 class="posh1">Modules</h1>
                <div class="module_header"></div>
                <div class="module_card"></div>
                <h1 class="marginh1">Assessments</h1>
                <div class="quiz_header"></div>
                <div class="quiz_card"></div>
            </main>
            
*/
const showCourse = async (courseTitle) => {
    const info = await GetCourse(getUser(), courseTitle);
    console.log(info)
    const parent =  document.querySelector('.main-content-area');
    const oldContent = document.querySelector(".main-content-area main");
    if (oldContent) {
        parent.removeChild(oldContent);
    }   
    const content = document.createElement("main");
    content.classList.add("course-content");

    const moduleTitle = document.createElement("h1");
    moduleTitle.textContent = "Modules";
    moduleTitle.classList.add("posh1")
    const moduleHeader = document.createElement("div");
    moduleHeader.classList.add("module_header");
    content.appendChild(moduleTitle);
    content.appendChild(moduleHeader);

     const mLength = info.result.modules.length;
    for(let i = 0 ; i < mLength; i++){
        const mCard = document.createElement("div");
        const title = document.createElement("h4");
        mCard.classList.add("module_card");
        title.textContent = info.result.modules[i].title
        mCard.appendChild(title);
        content.appendChild(mCard);
    }
    const quizTitle = document.createElement("h1");
    quizTitle.textContent = "Assessments";
    quizTitle.classList.add("marginh1");
    const quizHeader = document.createElement("div");
    quizHeader.classList.add("quiz_header");
    content.appendChild(quizTitle);
    content.appendChild(quizHeader);

    const qLength = info.result.quizzes.length;
    for(let i = 0 ; i < qLength; i++){
        const qCard = document.createElement("div");
        const title = document.createElement("h4");
        const score = document.createElement("p");
        qCard.classList.add("quiz_card");
        title.textContent = info.result.modules[i].title;
        const nscore =info.result.quizzes[i].score;
        const maxScore = info.result.quizzes[i].maxScore;
        score.textContent = nscore > 0 ? `Score: ${nscore}/${maxScore}`: `Score: ${maxScore}/${maxScore}`
        qCard.appendChild(title);
        qCard.append(score);
        content.appendChild(qCard);
    }

    parent.appendChild(content);

}

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