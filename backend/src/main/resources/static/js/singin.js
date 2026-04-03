async function executeSignUp() {
    const name = document.getElementById('signup-name').value.trim();
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;

    if (!name || !username || !email || !password) {
        return showToast("SYSTEM ERROR: All fields must be populated.", "error");
    }

    const errName = document.getElementById('error-signup-name');
    const errEmail = document.getElementById('error-signup-email');

    if (errName) errName.classList.add('hidden');
    if (errEmail) errEmail.classList.add('hidden');

    let hasError = false;

    if (!/^[a-zA-Z\s\-À-ỹ]+$/.test(name)) {
        if (errName) {
            errName.textContent = 'Designation can only contain letters and hyphens.';
            errName.classList.remove('hidden');
        }
        hasError = true;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (errEmail) {
            errEmail.textContent = 'Invalid email format.';
            errEmail.classList.remove('hidden');
        }
        hasError = true;
    }

    if (hasError) return;

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
