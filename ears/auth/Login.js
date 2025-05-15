import { CheckLogin } from "../Utilities/api.js";

const form = document.getElementById("login-form");
const messageElement = document.getElementById("login-error"); // Get the message element
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitButton = form.querySelector('button[type="submit"]');

// Helper function to display messages
const showMessage = (message, isError = false) => {
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.style.color = isError ? "#c0392b" : "#27ae60";
        messageElement.style.display = "block";
    } else {
        // Fallback to alert if the element isn't found for some reason
        alert(message);
    }
};

// Helper function to validate email format
const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate inputs as the user types
emailInput.addEventListener('input', () => {
    if (emailInput.value.trim() === '') {
        emailInput.setCustomValidity('Email is required');
    } else if (!isEmailValid(emailInput.value)) {
        emailInput.setCustomValidity('Please enter a valid email address');
    } else {
        emailInput.setCustomValidity('');
    }
});

passwordInput.addEventListener('input', () => {
    if (passwordInput.value.trim() === '') {
        passwordInput.setCustomValidity('Password is required');
    } else if (passwordInput.value.length < 7) {
        passwordInput.setCustomValidity('Password must be at least 7 characters');
    } else {
        passwordInput.setCustomValidity('');
    }
});

const data = {};

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent page refresh
    
    if (messageElement) messageElement.style.display = "none"; // Hide previous messages

    // Basic client-side validation
    if (emailInput.value.trim() === '') {
        showMessage('Email is required', true);
        emailInput.focus();
        return;
    }

    if (!isEmailValid(emailInput.value)) {
        showMessage('Please enter a valid email address', true);
        emailInput.focus();
        return;
    }

    if (passwordInput.value.trim() === '') {
        showMessage('Password is required', true);
        passwordInput.focus();
        return;
    }

    if (passwordInput.value.length < 7) {
        showMessage('Password must be at least 7 characters', true);
        passwordInput.focus();
        return;
    }

    const formData = new FormData(form);
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Show loading state
    if (submitButton) {
        submitButton.textContent = "Logging in...";
        submitButton.disabled = true;
    }

    try {
        const details = await CheckLogin(data);
        const status = details.status;
        const text = details.text;

        if (status !== 200) { // Covers all non-200 statuses as errors
            console.error("Status: " + status + "\nResponse: " + text);
            showMessage("Login Failed: " + text, true);
        } else { // Success
            console.log("Status: " + status + "\nResponse: " + text);
            showMessage("Login Successful! Redirecting...", false); // Success message

            sessionStorage.setItem("user", data.email);
            sessionStorage.setItem('isUserLoggedIn', 'true');

            setTimeout(() => {
                window.location.href = "../home/dashboard.html";
            }, 1500); // Slightly shorter redirect time
        }
    } catch (error) {
        console.error("Login error:", error);
        showMessage("An unexpected error occurred. Please try again.", true);
    } finally {
        // Reset button state if not redirecting (error case)
        if (status !== 200 && submitButton) {
            submitButton.textContent = "Login";
            submitButton.disabled = false;
        }
    }
});


