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
document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const displayName = document.getElementById('display-name');
    const displayEmail = document.getElementById('display-email');
    const displayGender = document.getElementById('display-gender');
    const displayAddress = document.getElementById('display-address');
    const displayRole = document.getElementById('display-role');
    const profileAvatar = document.getElementById('profile-avatar');
    const editBtn = document.getElementById('edit-profile-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const profileForm = document.getElementById('profile-form');
    const profileHeader = document.querySelector('.profile-header');
    const profileDetails = document.querySelector('.profile-details');
    const changePasswordBtn = document.getElementById('change-password-btn');
    const passwordModal = document.getElementById('password-modal');
    const closePasswordModal = document.getElementById('close-password-modal');
    const passwordForm = document.getElementById('password-form');

    // Store user data for easy access
    let userData = {};

    // Fetch and display user profile
    async function fetchUserProfile() {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                showMessage('Not authenticated. Please log in again.', true);
                return;
            }
            const response = await fetch('/api/user/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch profile data');
            const data = await response.json();
            userData = data;
            // Display mode
            displayName.textContent = data.name || '-';
            displayEmail.textContent = data.email || '-';
            displayGender.textContent = data.gender || '-';
            displayAddress.textContent = data.address || '-';
            displayRole.textContent = data.role || 'Employee';
            if (data.avatarUrl) profileAvatar.src = data.avatarUrl;
            // Edit form
            document.getElementById('name').value = data.name || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('gender').value = data.gender || '';
            document.getElementById('address').value = data.address || '';
            // Hide form, show display
            profileForm.style.display = 'none';
            profileHeader.style.display = '';
            profileDetails.style.display = '';
        } catch (error) {
            console.error('Error fetching profile:', error);
            showMessage('Error loading profile data. Please try again.', true);
        }
    }

    // Edit Profile
    editBtn.addEventListener('click', () => {
        profileForm.style.display = '';
        profileHeader.style.display = 'none';
        profileDetails.style.display = 'none';
    });

    // Cancel Edit
    cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        profileForm.style.display = 'none';
        profileHeader.style.display = '';
        profileDetails.style.display = '';
        // Reset form fields to original values
        document.getElementById('name').value = userData.name || '';
        document.getElementById('email').value = userData.email || '';
        document.getElementById('gender').value = userData.gender || '';
        document.getElementById('address').value = userData.address || '';
    });

    // Save Profile
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(profileForm);
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
                    email: formData.get('email'),
                    gender: formData.get('gender'),
                    address: formData.get('address')
                })
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update profile');
            }
            showMessage('Profile updated successfully!');
            await fetchUserProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
            showMessage(error.message || 'Error updating profile. Please try again.', true);
        }
    });

    // Change Password Modal
    changePasswordBtn.addEventListener('click', () => {
        passwordModal.style.display = 'block';
    });
    closePasswordModal.addEventListener('click', () => {
        passwordModal.style.display = 'none';
        passwordForm.reset();
    });
    window.onclick = function(event) {
        if (event.target === passwordModal) {
            passwordModal.style.display = 'none';
            passwordForm.reset();
        }
    };
    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // UI only: Validate and show feedback
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        if (newPassword !== confirmPassword) {
            showMessage('New passwords do not match.', true);
            return;
        }
        // Here you would send a request to update the password if backend supports it
        showMessage('Password updated (UI only, not saved).');
        passwordModal.style.display = 'none';
        passwordForm.reset();
    });

    // Initial load
    fetchUserProfile();
}); 