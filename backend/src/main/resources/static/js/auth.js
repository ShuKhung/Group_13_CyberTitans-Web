function checkLoginState() {
    const sessionData = sessionStorage.getItem('cyber_user');
    const localData = localStorage.getItem('cyber_user');
    const savedUser = sessionData || localData;
    if (savedUser) applyLoginState(JSON.parse(savedUser));
}

function applyLoginState(userData) {
    isLoggedIn = true;
    const navGuest = document.getElementById('nav-guest');
    const navUser = document.getElementById('nav-user');
    const mobileNavGuest = document.getElementById('mobile-nav-guest');
    const mobileNavUser = document.getElementById('mobile-nav-user');
    
    // Desktop Nav Sync
    if (navGuest) { navGuest.classList.add('hidden'); navGuest.classList.remove('md:flex'); }
    if (navUser) { navUser.classList.remove('hidden'); navUser.classList.add('md:flex'); }

    // Mobile Nav Sync
    if (mobileNavGuest) mobileNavGuest.classList.add('hidden');
    if (mobileNavUser) mobileNavUser.classList.remove('hidden');
    
    if (navUser || mobileNavUser) {
        // Set name in both locations
        const nameSpans = document.querySelectorAll('#nav-user span.truncate, #mobile-nav-user-name');
        nameSpans.forEach(s => s.textContent = userData.name || 'OPERATIVE');

        // Set coins in both locations
        const coinDisplays = document.querySelectorAll('#nav-coin-display, #mobile-nav-coin-display');
        coinDisplays.forEach(display => {
            if (display.id === 'nav-coin-display') {
                const startCoin = parseInt(display.textContent.replace(/,/g, '')) || 0;
                const endCoin = userData.coin || 0;
                if (startCoin !== endCoin && typeof animateCoinValue === 'function') animateCoinValue('nav-coin-display', startCoin, endCoin, 1500); 
                else display.textContent = endCoin.toLocaleString();
            } else {
                display.textContent = (userData.coin || 0).toLocaleString();
            }
        });

        // Set avatar initials in both locations
        const initialsEls = document.querySelectorAll('#nav-avatar-initials, #mobile-nav-avatar-initials');
        if (userData.name) {
            const initials = userData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            initialsEls.forEach(el => el.textContent = initials);
        }
    }
}

async function doLogin() {
    const userEl = document.getElementById('login-user');
    const passEl = document.getElementById('login-pass');
    const keepPersistentEl = document.getElementById('keep-persistent');
    
    if (!userEl.value || !passEl.value) return showToast('Vui lòng nhập đủ thông tin!', 'error');

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: userEl.value, password: passEl.value })
        });

        if (response.ok) {
            const userData = await response.json();
            localStorage.removeItem('cyber_user'); localStorage.removeItem('cyber_token');
            sessionStorage.removeItem('cyber_user'); sessionStorage.removeItem('cyber_token');

            const storage = keepPersistentEl && keepPersistentEl.checked ? localStorage : sessionStorage;
            storage.setItem('cyber_user', JSON.stringify(userData));
            storage.setItem('cyber_token', userData.token);
            
            closeModal('login-modal');
            showToast(`ACCESS GRANTED. Welcome, ${userData.name}!`, 'success');
            userEl.value = ''; passEl.value = '';
            
            // Reload page after brief delay so Thymeleaf re-renders with cookie (shows Admin Panel etc.)
            setTimeout(() => window.location.reload(), 800);
        } else {
            showToast('ACCESS DENIED: Wrong credentials.', 'error');
        }
    } catch (err) { showToast('SERVER ERROR: Connection error.', 'error'); }
}

async function logout() {
    // 1. Clear client-side storage
    localStorage.removeItem('cyber_user'); localStorage.removeItem('cyber_token');
    sessionStorage.removeItem('cyber_user'); sessionStorage.removeItem('cyber_token');
    // 2. Try to clear the HttpOnly cookie via JS (works if not HttpOnly)
    document.cookie = 'cyber_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    // 3. Call server to clear HttpOnly cookie properly
    try {
        await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
    } catch (e) { /* ignore */ }
    isLoggedIn = false;
    window.location.href = '/home';
}

// --- RECOVERY PROTOCOL ---
async function requestRecoveryOtp() {
    const username = document.getElementById('recovery-username').value.trim();
    const email = document.getElementById('recovery-email').value.trim();

    if (!username || !email) return showToast("SYSTEM ERROR: Identifier and Comms Link required.", "error");

    try {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password-request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email })
        });

        const data = await response.json();

        if (response.ok) {
            showToast(data.message, "success");
            recoveryTargetUsername = username; 
            closeModal('recovery-request-modal');
            openModal('recovery-reset-modal');
        } else {
            showToast(`DENIED: ${data.message}`, "error");
        }
    } catch (error) { showToast("SERVER UNREACHABLE: Connection terminated.", "error"); }
}

async function executePasswordReset() {
    const otpCode = document.getElementById('recovery-otp').value.trim();
    const newPassword = document.getElementById('recovery-new-pass').value;

    if (otpCode.length !== 6 || !newPassword) return showToast("SYSTEM ERROR: Invalid code format or missing pass-key.", "error");

    try {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password-reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: recoveryTargetUsername, code: otpCode, newPassword: newPassword })
        });

        const data = await response.json();

        if (response.ok) {
            showToast("OVERRIDE SUCCESSFUL: You may now login.", "success");
            recoveryTargetUsername = "";
            document.getElementById('recovery-otp').value = "";
            document.getElementById('recovery-new-pass').value = "";
            closeRecoveryModal();
            openModal('login-modal');
        } else {
            showToast(`DENIED: ${data.message}`, "error");
        }
    } catch (error) { showToast("SERVER UNREACHABLE: Connection terminated.", "error"); }
}
