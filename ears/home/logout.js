// EARSSSS/ears/ears/home/logout.js

// Function to set up logout button functionality
const setupLogout = () => {
    const logoutButton = document.getElementById("logout-button");
    
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            // Clear the login flag
            sessionStorage.removeItem('isUserLoggedIn');
            // Also remove the "user" item if it's still used for other purposes
            sessionStorage.removeItem("user"); 
            
            // Redirect to the login page.
            window.location.href = "/auth/login.html"; // Using root-relative path
        });
    } else {
        console.error("Logout button on dashboard not found by ID 'logout-button'.");
    }
};

// Execute setup when script loads
setupLogout();

// Export the original function that public.js expects
export const logout = () => {
    // This is now a no-op function since the logout is handled directly
    // in the script above, but we keep it to maintain compatibility
    console.log("Legacy logout function called - functionality moved to setup");
};