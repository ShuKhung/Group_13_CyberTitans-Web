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

            // Specialization Data Fix
            const tagsInput = document.getElementById('input-tags');
            if (tagsInput) {
                tagsInput.value = user.tags || '';
                renderUserTags(user.tags || '');
            }

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

    // Load Professional Records
    loadExperiences();
}

function renderUserTags(tagsStr) {
    const wrapper = document.getElementById('tags-wrapper');
    if (!wrapper) return;

    const tags = tagsStr.split(',').filter(t => t.trim());
    const addBtn = wrapper.querySelector('button');

    // Clear current tags (except the Add button)
    wrapper.innerHTML = '';

    tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'px-3 py-1 bg-primary/20 text-primary border border-primary/30 text-[11px] font-mono flex items-center gap-2';
        span.innerHTML = `
            ${tag.trim()}
            <button type="button" onclick="removeUserTag('${tag.trim()}')" class="hover:text-white transition-colors">
                <span class="material-symbols-outlined text-[12px]">close</span>
            </button>
        `;
        wrapper.appendChild(span);
    });

    if (addBtn) wrapper.appendChild(addBtn);
}

function promptAddTag() {
    const tag = prompt("Enter new specialization tag (e.g. Java, Python, Security):");
    if (!tag || !tag.trim()) return;

    const input = document.getElementById('input-tags');
    const currentTags = input.value ? input.value.split(',').filter(t => t.trim()) : [];

    if (currentTags.includes(tag.trim())) return showToast("Tag already exists.", "error");

    currentTags.push(tag.trim());
    input.value = currentTags.join(',');
    renderUserTags(input.value);
}

function removeUserTag(tag) {
    const input = document.getElementById('input-tags');
    const currentTags = input.value.split(',').filter(t => t.trim() && t.trim() !== tag);
    input.value = currentTags.join(',');
    renderUserTags(input.value);
}

// --- EXPERIENCE MANAGEMENT PROTOCOL ---
let userExperiences = [];

async function loadExperiences() {
    const token = sessionStorage.getItem('cyber_token') || localStorage.getItem('cyber_token');
    const listEl = document.getElementById('experience-list');
    if (!listEl || !token) return;

    try {
        const response = await fetch(`${API_BASE_URL}/experience/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            userExperiences = await response.json();
            renderExperienceList();
        }
    } catch (error) { console.error("[SYSTEM] Error loading experiences:", error); }
}

function renderExperienceList() {
    const listEl = document.getElementById('experience-list');
    if (userExperiences.length === 0) {
        listEl.innerHTML = '<p class="text-[10px] font-mono text-on-surface-variant/40 uppercase tracking-widest italic">No professional records found. Initialize your history to optimize your profile.</p>';
        return;
    }

    listEl.innerHTML = userExperiences.map(exp => `
        <div class="bg-white/5 border border-white/10 p-5 group hover:border-primary/40 transition-all">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h4 class="text-white font-bold text-lg">${exp.organizationName}</h4>
                    <p class="text-primary font-mono text-[10px] uppercase tracking-widest mt-1">${exp.positionTitle}</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="openExperienceModal(${exp.id})" class="p-2 bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10">
                        <span class="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button onclick="deleteExperience(${exp.id})" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all border border-red-500/20">
                        <span class="material-symbols-outlined text-sm">delete</span>
                    </button>
                </div>
            </div>
            <div class="flex items-center gap-2 text-[10px] font-mono text-on-surface-variant mb-4 uppercase">
                <span class="material-symbols-outlined text-xs">calendar_today</span>
                ${exp.startDate} — ${exp.endDate || 'PRESENT'}
                <span class="mx-2 text-white/10">|</span>
                <span class="${exp.type === 'PROJECT' ? 'text-tertiary' : 'text-secondary'} font-bold">${exp.type}</span>
            </div>
            <div class="flex flex-wrap gap-2">
                ${(exp.tags || '').split(',').filter(t => t.trim()).map(tag => `
                    <span class="px-2 py-0.5 bg-black border border-white/10 text-[9px] font-mono text-on-surface-variant">${tag.trim()}</span>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function openExperienceModal(id = null) {
    const modal = document.getElementById('experience-modal');
    const title = document.getElementById('exp-modal-title');
    const idInput = document.getElementById('exp-id');

    // Clear fields
    idInput.value = id || '';
    document.getElementById('exp-org').value = '';
    document.getElementById('exp-title').value = '';
    document.getElementById('exp-start').value = '';
    document.getElementById('exp-end').value = '';
    document.getElementById('exp-type').value = 'JOB';
    document.getElementById('exp-tags').value = '';

    if (id) {
        title.innerText = "// EDIT RECORD";
        const exp = userExperiences.find(e => e.id === id);
        if (exp) {
            document.getElementById('exp-org').value = exp.organizationName || '';
            document.getElementById('exp-title').value = exp.positionTitle || '';
            document.getElementById('exp-start').value = exp.startDate || '';
            document.getElementById('exp-end').value = exp.endDate || '';
            document.getElementById('exp-type').value = exp.type || 'JOB';
            document.getElementById('exp-tags').value = exp.tags || '';
        }
    } else {
        title.innerText = "// ADD RECORD";
    }

    modal.classList.remove('hidden');
}

function closeExperienceModal() {
    document.getElementById('experience-modal').classList.add('hidden');
}

async function saveExperience() {
    const token = sessionStorage.getItem('cyber_token') || localStorage.getItem('cyber_token');
    const id = document.getElementById('exp-id').value;

    const payload = {
        organizationName: document.getElementById('exp-org').value,
        positionTitle: document.getElementById('exp-title').value,
        startDate: document.getElementById('exp-start').value,
        endDate: document.getElementById('exp-end').value,
        type: document.getElementById('exp-type').value,
        tags: document.getElementById('exp-tags').value
    };

    if (!payload.organizationName || !payload.positionTitle || !payload.startDate) {
        return showToast("Critical fields missing: Name, Title, and Start Date are required.", "error");
    }

    try {
        const url = id ? `${API_BASE_URL}/experience/${id}` : `${API_BASE_URL}/experience`;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showToast("Record synchronized successfully.", "success");
            closeExperienceModal();
            loadExperiences(); // Refresh list
        } else {
            showToast("Failed to synchronize record.", "error");
        }
    } catch (error) { showToast("Server connection error.", "error"); }
}

async function deleteExperience(id) {
    if (!confirm("⚠️ WARNING: Permanent deletion initiated. Are you sure?")) return;

    const token = sessionStorage.getItem('cyber_token') || localStorage.getItem('cyber_token');
    try {
        const response = await fetch(`${API_BASE_URL}/experience/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            showToast("Record terminated and deleted.", "success");
            loadExperiences();
        } else {
            showToast("Deletion failed.", "error");
        }
    } catch (error) { showToast("Server connection error.", "error"); }
}

async function saveAccountProfile() {
    const savedUserStr = sessionStorage.getItem('cyber_user') || localStorage.getItem('cyber_user');
    const token = sessionStorage.getItem('cyber_token') || localStorage.getItem('cyber_token');
    if (!savedUserStr || !token) return showToast('Lỗi: Phiên đăng nhập hết hạn!', 'error');

    const currentUser = JSON.parse(savedUserStr);

    // Validation
    const nameInput = document.getElementById('input-name');
    const emailInput = document.getElementById('input-email');
    const phoneInput = document.getElementById('input-phone');

    const errName = document.getElementById('error-input-name');
    const errEmail = document.getElementById('error-input-email');
    const errPhone = document.getElementById('error-input-phone');

    if (errName) errName.classList.add('hidden');
    if (errEmail) errEmail.classList.add('hidden');
    if (errPhone) errPhone.classList.add('hidden');

    let hasError = false;

    if (!/^[a-zA-Z\s\-À-ỹ]+$/.test(nameInput.value.trim())) {
        if (errName) {
            errName.textContent = 'Invalid full name.';
            errName.classList.remove('hidden');
        }
        hasError = true;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
        if (errEmail) {
            errEmail.textContent = 'Invalid email format.';
            errEmail.classList.remove('hidden');
        }
        hasError = true;
    }

    if (!/^\d+$/.test(phoneInput.value.trim())) {
        if (errPhone) {
            errPhone.textContent = 'Phone must contain only numbers.';
            errPhone.classList.remove('hidden');
        }
        hasError = true;
    }

    if (hasError) return;

    const payload = {
        name: nameInput.value, email: emailInput.value,
        phone: phoneInput.value, description: document.getElementById('input-bio').value,
        tags: document.getElementById('input-tags').value
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

// --- PASSWORD UPDATE PROTOCOL ---
async function submitChangePassword() {
    const oldPass = document.getElementById('old-pass').value;
    const newPass = document.getElementById('new-pass').value;
    const savedUserStr = sessionStorage.getItem('cyber_user') || localStorage.getItem('cyber_user');

    if (!savedUserStr) return showToast("Session expired. Please log in again.", "error");
    if (!oldPass || !newPass) return showToast("Both current and new keys are required.", "error");

    const currentUser = JSON.parse(savedUserStr);

    try {
        const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: currentUser.username,
                oldPassword: oldPass,
                newPassword: newPass
            })
        });

        const data = await response.json();

        if (response.ok) {
            showToast("Security key synchronization successful.", "success");
            closePassModal();
            // Clear inputs
            document.getElementById('old-pass').value = '';
            document.getElementById('new-pass').value = '';
        } else {
            showToast(`SYNC DENIED: ${data.message}`, "error");
        }
    } catch (error) {
        showToast("SIGNAL LOST: Server unreachable.", "error");
    }
}

function closePassModal() {
    closeModal('password-modal');
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
        const viewerRole = currentUser.role;

        let actionButtonsHTML = '';

        if (currentUser.id === user.id) {
            actionButtonsHTML = `
                <button onclick="showPage('my-profile'); closeProfileModal();" class="w-full bg-secondary text-black font-bold font-mono tracking-widest py-3.5 hover:bg-white transition-all text-[11px]">
                    // EDIT MY TACTICAL DATA
                </button>`;
        }
        else {
            actionButtonsHTML = `
                <button onclick="handleMentorRequest(${user.id}, '${user.name}')" class="w-full bg-primary text-black font-bold font-mono tracking-widest py-3.5 hover:bg-white transition-all text-[11px] mb-2">
                    MENTOR REQUEST (500 COINS)
                </button>
                <button class="w-full bg-[#111] border border-white/10 text-white font-bold font-mono tracking-widest py-3.5 hover:border-primary transition-all text-[11px]">
                    MESSAGE
                </button>`;

        }

        const defaultAvt = "https://ui-avatars.com/api/?background=222&color=fff&name=";
        const avatarUrl = user.avatar || (defaultAvt + user.name);

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
                        return isActive ? `<span class="bg-[#222] text-white text-[10px] px-2 py-1 border border-white/10">${text}</span>` : `<span class="text-gray-500 text-[11px] mr-3">${text}</span>`;
                    }).join('');
                    coursesHTML = `<div class="mt-3 flex flex-wrap gap-2">${tags}</div>`;
                }

                return `
                    <div class="relative pl-8 mb-10">
                        ${!isLast ? `<div class="absolute left-[3px] top-4 bottom-[-40px] w-[1px] ${isActive ? 'bg-primary/30' : 'bg-white/10'}"></div>` : ''}
                        <div class="absolute left-0 top-1.5 w-2 h-2 ${isActive ? 'bg-primary' : 'bg-gray-500'}"></div>
                        <h3 class="text-lg font-bold text-white leading-tight">${exp.organizationName}</h3>
                        <p class="${isActive ? 'text-primary' : 'text-gray-400'} font-mono text-[10px] tracking-widest uppercase mt-1">
                            ${exp.positionTitle} <span class="text-gray-600 mx-1">|</span> ${exp.startDate} - ${exp.endDate || 'PRESENT'}
                        </p>
                        ${coursesHTML}
                    </div>`;
            }).join('');
        }

        // --- RENDER  ---
        modalBody.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 mt-4">
                <div class="space-y-6">
                    <div class="p-1 border border-white/10 bg-[#111] shadow-2xl">
                        <img src="${avatarUrl}" class="w-full aspect-square object-cover grayscale" />
                    </div>
                    
                    <div id="modal-actions-container">
                        ${actionButtonsHTML}
                    </div>

                    <div class="bg-[#111] border-y border-r border-white/5 p-6 mt-6 relative overflow-hidden">
                        <div class="absolute left-0 top-0 bottom-0 w-[3px] bg-primary"></div>
                        <h4 class="text-primary font-mono text-[10px] tracking-[0.2em] uppercase mb-6 font-bold">TACTICAL DATA</h4>
                        <div class="space-y-5">
                            <div><p class="text-[9px] font-bold text-gray-500 uppercase mb-1">PHONE</p><p class="text-white font-mono text-xs tracking-widest">${user.phone || 'CLASSIFIED'}</p></div>
                            <div><p class="text-[9px] font-bold text-gray-500 uppercase mb-1">ADDRESS</p><p class="text-white font-mono text-xs tracking-wide">${user.address || 'UNKNOWN'}</p></div>
                            <div><p class="text-[9px] font-bold text-gray-500 uppercase mb-1">EMAIL</p><p class="text-white font-mono text-xs break-all">${user.email || 'ENCRYPTED'}</p></div>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 class="text-3xl font-bold text-white mb-8 pb-4 border-b border-white/10">Experience</h2>
                    <div class="space-y-2">${experiencesHTML}</div>
                    <div class="mt-10 pt-6 border-t border-white/5">
                         <h4 class="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-4">Briefing Notes</h4>
                         <p class="text-gray-400 text-sm leading-relaxed font-mono">${user.description || 'No additional logs found.'}</p>
                    </div>
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
