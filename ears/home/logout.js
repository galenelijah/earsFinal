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