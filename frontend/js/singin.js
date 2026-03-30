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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showToast(data.message, "success");
            pendingVerificationUsername = username;
            
            closeModal('signup-modal');
            openModal('otp-modal');
        } else {
            showToast(`REJECTED: ${data.message}`, "error");
        }
    } catch (error) {
        showToast("SERVER UNREACHABLE: Connection terminated.", "error");
    }
}

async function executeOtpVerification() {
    const otpCode = document.getElementById('otp-input').value.trim();

    if (otpCode.length !== 6) {
        return showToast("SYSTEM ERROR: Invalid code format. Must be 6 digits.", "error");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: pendingVerificationUsername,
                code: otpCode
            })
        });

        const data = await response.json();

        if (response.ok) {
            showToast("ACCESS GRANTED: Account activated successfully.", "success");
            pendingVerificationUsername = "";
            document.getElementById('otp-input').value = "";
            
            closeModal('otp-modal');
            openModal('login-modal');
        } else {
            showToast(`DENIED: ${data.message}`, "error");
        }
    } catch (error) {
        showToast("SERVER UNREACHABLE: Connection terminated.", "error");
    }
}