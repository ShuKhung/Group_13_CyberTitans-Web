async function loadOperativeData() {
    const savedUserStr = sessionStorage.getItem('cyber_user') || localStorage.getItem('cyber_user');
    const token = sessionStorage.getItem('cyber_token') || localStorage.getItem('cyber_token');
    if (!savedUserStr || !token) return;

    const currentUser = JSON.parse(savedUserStr);
    const nameInput = document.getElementById('input-name');
    if (!nameInput) return;

    // Pre-fill username immediately from stored session (no API needed)
    const usernameInput = document.getElementById('input-username');
    if (usernameInput) usernameInput.value = currentUser.username || '';

    try {
        const response = await fetch(`${API_BASE_URL}/team/members/${currentUser.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const user = await response.json();
            nameInput.value = user.name || '';
            if (document.getElementById('input-email')) document.getElementById('input-email').value = user.email || '';
            // Phone should contain actual phone number, not username
            const phoneInput = document.getElementById('input-phone');
            if (phoneInput) phoneInput.value = user.phone || '';
            if (document.getElementById('input-bio')) document.getElementById('input-bio').value = user.description || '';

            // Show actual role from DB
            const roleEl = document.getElementById('profile-role');
            if (roleEl) roleEl.innerText = user.role || currentUser.role || 'MENTEE';

            // Update avatar with name
            const avatarImg = document.getElementById('profile-avatar');
            if (avatarImg && user.name) {
                avatarImg.src = user.avatar || `https://ui-avatars.com/api/?background=111111&color=4dff88&name=${encodeURIComponent(user.name)}&bold=true`;
            }
        } else if (response.status === 403 || response.status === 401) { logout(); }
    } catch (error) { console.error("[SYSTEM] Error loading user data:", error); }
}

async function saveAccountProfile() {
    const savedUserStr = sessionStorage.getItem('cyber_user') || localStorage.getItem('cyber_user');
    const token = sessionStorage.getItem('cyber_token') || localStorage.getItem('cyber_token');
    if (!savedUserStr || !token) return showToast('Lỗi: Phiên đăng nhập hết hạn!', 'error');

    const currentUser = JSON.parse(savedUserStr);
    const payload = {
        name: document.getElementById('input-name').value, email: document.getElementById('input-email').value,
        phone: document.getElementById('input-phone').value, description: document.getElementById('input-bio').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/team/members/${currentUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            showToast('Protocol Uploaded! Data has been synchronized.', 'success');
            currentUser.name = payload.name;
            const storage = localStorage.getItem('cyber_user') ? localStorage : sessionStorage;
            storage.setItem('cyber_user', JSON.stringify(currentUser));
            applyLoginState(currentUser);
        } else { showToast('Lỗi: Không có quyền sửa.', 'error'); }
    } catch (error) { showToast('Lỗi Server.', 'error'); }
}

async function openProfileModal(id) {
    const token = sessionStorage.getItem('cyber_token') || localStorage.getItem('cyber_token');
    const modal = document.getElementById('profile-modal');
    const modalContent = document.getElementById('profile-modal-content');
    const modalBody = document.getElementById('modal-body');

    if (!token) return showToast("Please log in to view profiles!", "error");

    modal.classList.remove('hidden');
    setTimeout(() => modalContent.classList.remove('translate-x-full'), 10);
    modalBody.innerHTML = '<p class="text-primary font-mono animate-pulse text-center mt-20">Establishing secure connection... Fetching operative data...</p>';

    try {
        const response = await fetch(`${API_BASE_URL}/team/members/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Data access denied.");
        const user = await response.json();

        const savedUserStr = sessionStorage.getItem('cyber_user') || localStorage.getItem('cyber_user');
        const currentUser = JSON.parse(savedUserStr);
        // Correctly handle viewing role parsing (could be from token or string)
        const viewerRole = (currentUser.role || '').toUpperCase();

        let actionButtonsHTML = '';

        if (currentUser.id === user.id) {
            actionButtonsHTML = `
                <button onclick="showPage('my-profile'); closeProfileModal();" class="w-full bg-secondary text-black font-bold font-mono tracking-widest py-3.5 hover:bg-white transition-all text-[11px]">
                    // EDIT MY TACTICAL DATA
                </button>`;
        }
        else {
            actionButtonsHTML = `
                <button onclick="handleMentorRequest(${user.id}, '${user.name.replace(/'/g, "\\'")}')" class="w-full bg-primary text-black font-bold font-mono tracking-widest py-3.5 hover:bg-white transition-all text-[11px] mb-2">
                    MENTOR REQUEST (500 COINS)
                </button>
                <button class="w-full bg-[#111] border border-white/10 text-white font-bold font-mono tracking-widest py-3.5 hover:border-primary transition-all text-[11px] mb-4">
                    MESSAGE
                </button>`;

            // Check for admin role
            if (viewerRole === 'ADMIN' || viewerRole === 'SUPER ADMIN' || viewerRole === 'SUPERADMIN' || viewerRole === '1' || viewerRole === '2') {
                actionButtonsHTML += `
                <button onclick="adminDeleteUser(${user.id})" class="w-full bg-red-600/10 border border-red-500/30 text-red-500 font-bold font-mono tracking-widest py-3.5 hover:bg-red-600/20 transition-all text-[11px]">
                    [ADMIN] TERMINATE OPERATIVE
                </button>`;
            }
        }

        // Configure Avatar and Initials
        let fallbackInitials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        // Since we explicitly want large font avatar with specific style if no avatar is provided, and the screenshot uses 2-letter
        const avatarUrl = user.avatar || `https://ui-avatars.com/api/?background=222&color=fff&name=${fallbackInitials}&size=256&font-size=0.4`;

        let socialLinksHTML = '';
        if (user.linkedin || user.facebook) {
            socialLinksHTML = `
            <div class="flex items-center gap-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest px-1">
                ${user.linkedin ? `<a href="${user.linkedin}" target="_blank" class="hover:text-white transition-colors flex items-center gap-1.5"><i class="fab fa-linkedin text-sm"></i> LINKEDIN</a>` : ''}
                ${user.facebook ? `<a href="${user.facebook}" target="_blank" class="hover:text-white transition-colors flex items-center gap-1.5"><i class="fab fa-facebook text-sm"></i> FACEBOOK</a>` : ''}
            </div>
            `;
        }

        let experiencesHTML = '<p class="text-gray-500 font-mono text-sm">No classified records found.</p>';
        if (user.experiences && user.experiences.length > 0) {
            experiencesHTML = user.experiences.map((exp, index) => {
                const isLast = index === user.experiences.length - 1;
                const isActive = !exp.endDate || exp.endDate.toUpperCase() === 'PRESENT';

                let coursesHTML = '';
                if (exp.courseInfo) {
                    let courses = exp.courseInfo.includes(';') ? exp.courseInfo.split(';') : exp.courseInfo.split(',');
                    let tags = courses.map(c => {
                        let text = c.includes('@#') ? c.split('@#')[0].trim() : c.trim();
                        return isActive ? `<span class="bg-[#222] text-white text-[10px] font-mono px-2.5 py-1 border border-white/10">${text}</span>` : `<span class="text-gray-500 font-mono text-[11px] mr-3">${text}</span>`;
                    }).join('');
                    coursesHTML = `
                        <div class="mt-4">
                            <p class="text-[10px] text-gray-500 font-bold uppercase mb-2 tracking-widest font-mono">ACTIVE COURSES</p>
                            <div class="flex flex-wrap gap-2">${tags}</div>
                        </div>`;
                }

                let terminalBlockHTML = '';
                if (exp.description && exp.description.trim().startsWith('>')) {
                    terminalBlockHTML = `
                    <div class="mt-6 bg-[#0a0a0a] border border-white/5 rounded-md overflow-hidden">
                        <div class="flex items-center gap-1.5 px-4 py-2 border-b border-white/5">
                            <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                            <span class="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                            <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                        </div>
                        <div class="p-4">
                            <pre class="text-[#4dff88] font-mono text-xs whitespace-pre-wrap leading-relaxed">${exp.description.trim()}</pre>
                        </div>
                    </div>`;
                }

                // If no terminal block found, but user description exists, we show briefing log
                let backupDesc = '';
                if (!terminalBlockHTML && exp.description) {
                    backupDesc = `<p class="mt-3 text-gray-400 font-mono text-xs">${exp.description}</p>`;
                }

                // Map NEU instead of full name if it's National Economics University... Wait, we just show what's in DB.
                // The DB for user 10 has "National Economics University (NEU)"
                // But screenshot says "NEU" for title. Let's just output the orgName.
                let displayOrgName = exp.organizationName;
                if (displayOrgName.includes('(NEU)')) {
                    displayOrgName = 'NEU';
                }

                return `
                    <div class="relative pl-8 mb-10">
                        ${!isLast ? `<div class="absolute left-[3px] top-4 bottom-[-40px] w-[1px] ${isActive ? 'bg-primary/30' : 'bg-white/10'}"></div>` : ''}
                        <div class="absolute left-0 top-1.5 w-2 h-2 ${isActive ? 'bg-primary' : 'bg-gray-500'}"></div>
                        <h3 class="text-xl font-bold text-white tracking-wide uppercase">${displayOrgName}</h3>
                        <p class="${isActive ? 'text-primary' : 'text-gray-400'} font-mono text-[10px] tracking-widest uppercase mt-1 font-bold">
                            ${exp.positionTitle} <span class="text-gray-500 mx-1">|</span> ${exp.startDate} - ${exp.endDate || 'PRESENT'}
                        </p>
                        ${coursesHTML}
                        ${backupDesc}
                        ${terminalBlockHTML}
                    </div>`;
            }).join('');
        }

        // Only show briefing notes if they exist and we didn't show terminal blocks
        let briefingNotesHTML = '';
        if (user.description && user.description.trim() !== '') {
            briefingNotesHTML = `
            <div class="mt-10 pt-6 border-t border-white/5">
                 <h4 class="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-4 font-bold">Briefing Notes</h4>
                 <p class="text-gray-400 text-sm leading-relaxed font-mono">${user.description}</p>
            </div>`;
        }

        // --- RENDER  ---
        modalBody.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 mt-4">
                <div class="space-y-6">
                    <div class="p-1 border border-white/10 bg-[#111] shadow-xl">
                        <img src="${avatarUrl}" class="w-full aspect-square object-cover" />
                    </div>
                    
                    ${socialLinksHTML}
                    
                    <div id="modal-actions-container" class="mt-4">
                        ${actionButtonsHTML}
                    </div>

                    <div class="bg-[#111] border-y border-r border-white/5 p-6 mt-6 relative overflow-hidden">
                        <div class="absolute left-0 top-0 bottom-0 w-[2px] bg-primary"></div>
                        <h4 class="text-primary font-mono text-[10px] tracking-[0.2em] uppercase mb-6 font-bold">TACTICAL DATA</h4>
                        <div class="space-y-5">
                            <div><p class="text-[9px] font-bold text-gray-500 uppercase mb-1 font-mono">PHONE</p><p class="text-white font-mono text-xs tracking-widest">${user.phone || 'CLASSIFIED'}</p></div>
                            <div><p class="text-[9px] font-bold text-gray-500 uppercase mb-1 font-mono">ADDRESS</p><p class="text-white font-mono text-xs tracking-wide">${user.address || 'UNKNOWN'}</p></div>
                            <div><p class="text-[9px] font-bold text-gray-500 uppercase mb-1 font-mono">EMAIL</p><p class="text-white font-mono text-xs break-all">${user.email || 'ENCRYPTED'}</p></div>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 class="text-4xl font-headline font-bold text-white mb-8 pb-4 border-b border-white/10 tracking-wide">Experience</h2>
                    <div class="space-y-2 mt-8">${experiencesHTML}</div>
                </div>
            </div>`;

    } catch (error) {
        modalBody.innerHTML = `<p class="text-red-500 font-mono text-center mt-20">CONNECTION TERMINATED. ${error.message}</p>`;
    }
}

function closeProfileModal() {
    const modalContent = document.getElementById('profile-modal-content');
    if (modalContent) modalContent.classList.add('translate-x-full');
    setTimeout(() => document.getElementById('profile-modal').classList.add('hidden'), 300);
}
async function adminDeleteUser(userId) {
    const confirmation = confirm("⚠️ WARNING: You are sure you want to expel this member from the system?");
    if (!confirmation) return;

    const token = sessionStorage.getItem('cyber_token') || localStorage.getItem('cyber_token');

    try {
        const response = await fetch(`${API_BASE_URL}/team/members/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            showToast("User deleted successfully!", "success");
            closeProfileModal();
            buildTeam();
        } else {
            const errorData = await response.json();
            showToast(`ERROR: ${errorData.message || 'Access denied.'}`, "error");
        }
    } catch (error) {
        showToast("SERVER ERROR: Cannot connect to the server.", "error");
    }
}
