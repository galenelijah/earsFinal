import { initAccount, RegisterAccount } from "../Utilities/api.js";

const form = document.getElementById("register-form");
const email = document.getElementById("email");
const errorElement = document.getElementById("register-error");
const successElement = document.getElementById("register-success");

// Helper function to display messages
const showMessage = (message, isError = true) => {
    if (isError) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = "block";
            if (successElement) successElement.style.display = "none";
        } else {
            alert("Error: " + message);
        }
    } else {
        if (successElement) {
            successElement.textContent = message;
            successElement.style.display = "block";
            if (errorElement) errorElement.style.display = "none";
        } else {
            alert("Success: " + message);
        }
    }
};

// Helper to hide messages
const hideMessages = () => {
    if (errorElement) errorElement.style.display = "none";
    if (successElement) successElement.style.display = "none";
};

const emailValidity = () => {
    email.setCustomValidity(""); // reset before checking
    if (email.validity.valueMissing) return -1;
    if (email.validity.typeMismatch || email.validity.patternMismatch) return 0;
    return 1;
};

const send = async (data) => {
    // Show loading state - add a loading class to the submit button
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.textContent = "Registering...";
        submitButton.disabled = true;
    }

    try {
        const details = await RegisterAccount(data);
        const status = details.status;
        const text = details.text;

        if (status !== 200) {
            console.error("Status: " + status + "\nResponse: " + text);
            showMessage("Registration Failed: " + text, true);
        } else {
            console.log("Status: " + status + "\nResponse: " + text);
            
            // Initialize account information
            try {
                await initAccount(data);
                showMessage("Registration Successful! You can now login.", false);
                
                // Clear the form
                form.reset();
                
                // Redirect to login page after a short delay
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            } catch (initError) {
                console.error("Error initializing account:", initError);
                showMessage("Account created but profile initialization failed. Please try logging in.", true);
            }
        }
    } catch (error) {
        console.error("Registration error:", error);
        showMessage("An unexpected error occurred. Please try again.", true);
    } finally {
        // Reset button state
        if (submitButton) {
            submitButton.textContent = "Register";
            submitButton.disabled = false;
        }
    }
};

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent page refresh
    hideMessages(); // Clear any existing messages
    
    const data = {};
    const formData = new FormData(form);
    let res = emailValidity();
    
    if (res <= 0) {
        showMessage(res === -1 ? "Email is required" : "Please enter a valid email address", true);
        return;
    }
    
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    await send(data);
});

