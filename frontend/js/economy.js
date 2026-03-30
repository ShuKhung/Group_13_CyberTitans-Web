async function purchaseTier(tierName, coinsAmount) {
    const savedUserStr = sessionStorage.getItem('cyber_user') || localStorage.getItem('cyber_user');
    const token = sessionStorage.getItem('cyber_token') || localStorage.getItem('cyber_token'); 

    if (!savedUserStr || !token) {
        showToast('Please log in to make transactions!', 'error');
        openModal('login-modal'); return;
    }

    const currentUser = JSON.parse(savedUserStr);
    if (coinsAmount === 0) return showToast(`You are already at level ${tierName}.`, 'success');

    showToast(`Connecting...`, 'success');
    const newCoinBalance = (currentUser.coin || 0) + coinsAmount;
    const payload = {
        name: currentUser.name, email: currentUser.email,
        phone: currentUser.phone, description: currentUser.description,
        role: tierName, coin: newCoinBalance
    };

    try {
        const response = await fetch(`${API_BASE_URL}/team/members/${currentUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            currentUser.coin = newCoinBalance; currentUser.role = tierName;
            const storage = localStorage.getItem('cyber_user') ? localStorage : sessionStorage;
            storage.setItem('cyber_user', JSON.stringify(currentUser));
            showToast(`TRANSACTION SUCCESSFUL!`, 'success');
            applyLoginState(currentUser); 
        } else { showToast('Connection denied.', 'error'); }
    } catch (error) { showToast('Connection failed.', 'error'); }
}

async function handleMentorRequest(mentorId, mentorName) {
    const savedUserStr = sessionStorage.getItem('cyber_user') || localStorage.getItem('cyber_user');
    const token = sessionStorage.getItem('cyber_token') || localStorage.getItem('cyber_token'); 

    if (!savedUserStr || !token) return showToast('Please log in!', 'error');

    const currentUser = JSON.parse(savedUserStr);
    const MENTOR_COST = 500; 

    if (!currentUser.coin || currentUser.coin < MENTOR_COST) return showToast(`Not enough ${MENTOR_COST} Coins!`, 'error');

    try {
        showToast(`Connecting to ${mentorName}...`, 'success');
        const response = await fetch(`${API_BASE_URL}/team/members/${mentorId}/request-mentor`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ menteeId: currentUser.id })
        });

        if (response.ok) {
            const data = await response.json();
            currentUser.coin = data.remainingCoins;
            const storage = localStorage.getItem('cyber_user') ? localStorage : sessionStorage;
            storage.setItem('cyber_user', JSON.stringify(currentUser));

            applyLoginState(currentUser); 
            showToast(`GIAO DỊCH THÀNH CÔNG! Trừ ${MENTOR_COST} Coins.`, 'success');

            setTimeout(() => { showToast(`[SYSTEM] ${mentorName} has received your request!`, 'success'); }, 3000);
        } else {
            const errorData = await response.json();
            showToast(`LỖI: ${errorData.message}`, 'error');
        }
    } catch (error) { showToast('Connection failed.', 'error'); }
}