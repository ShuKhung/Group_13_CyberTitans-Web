async function executeSignUp() {
    const name = document.getElementById('signup-name').value.trim();
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;

    if (!name || !username || !email || !password) {
        return showToast("SYSTEM ERROR: All fields must be populated.", "error");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                username: username,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            showToast(data.message, "success");
            // Clear fields for security
            document.getElementById('signup-name').value = '';
            document.getElementById('signup-username').value = '';
            document.getElementById('signup-email').value = '';
            document.getElementById('signup-password').value = '';
            
            // Automatically switch to login screen
            switchToLogin();
        } else {
            showToast(`REJECTED: ${data.message}`, "error");
        }
    } catch (error) {
        showToast("SERVER UNREACHABLE: Connection terminated.", "error");
    }
}

// Helper functions to switch between modals
function switchToSignUp() {
    // Assuming your login modal has id="login-modal"
    document.getElementById('login-modal').classList.add('hidden'); 
    document.getElementById('signup-modal').classList.remove('hidden');
}

function switchToLogin() {
    document.getElementById('signup-modal').classList.add('hidden');
    document.getElementById('login-modal').classList.remove('hidden');
}

function closeSignUpModal() {
    document.getElementById('signup-modal').classList.add('hidden');
}