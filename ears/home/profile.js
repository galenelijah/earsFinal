// Function to show a message to the user
function showMessage(message, isError = false) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = `message ${isError ? 'error-message' : 'success-message'}`;
    messageElement.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}

// Function to fetch user profile data
async function fetchUserProfile() {
    try {
        const token = sessionStorage.getItem('token');
        if (!token) {
            showMessage('Not authenticated. Please log in again.', true);
            return;
        }

        const response = await fetch('/api/user/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        
        // Update form fields with user data
        document.getElementById('name').value = data.name || '';
        document.getElementById('email').value = data.email || '';
    } catch (error) {
        console.error('Error fetching profile:', error);
        showMessage('Error loading profile data. Please try again.', true);
    }
}

// Function to update user profile
async function updateProfile(formData) {
    try {
        const token = sessionStorage.getItem('token');
        if (!token) {
            showMessage('Not authenticated. Please log in again.', true);
            return;
        }

        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formData.get('name'),
                email: formData.get('email')
            })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to update profile');
        }

        showMessage('Profile updated successfully!');
    } catch (error) {
        console.error('Error updating profile:', error);
        showMessage(error.message || 'Error updating profile. Please try again.', true);
    }
}

// Event listener for form submission
document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await updateProfile(formData);
});

// Load profile data when the page loads
document.addEventListener('DOMContentLoaded', fetchUserProfile); 