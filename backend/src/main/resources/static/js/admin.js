let currentUsers = [];
let targetUserId = null;
let currentAction = '';

// Get token from both storage options
function getToken() {
    return localStorage.getItem('cyber_token') || sessionStorage.getItem('cyber_token') || '';
}

// Role color mapping matching the database
const ROLE_COLORS = {
    'SUPER ADMIN': 'text-error border-error/20 bg-error/5',
    'ADMIN': 'text-[#D4AF37] border-[#D4AF37]/20 bg-[#D4AF37]/5',
    'MENTOR': 'text-secondary border-secondary/20 bg-secondary/5',
    'MENTEE': 'text-primary border-primary/20 bg-primary/5',
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('admin-table')) {
        loadAdminData();
        setupSearch();
        setupConfirmBtn();
    }
});

function setupSearch() {
    // already handled by onkeyup inline
}

function setupConfirmBtn() {
    const btn = document.getElementById('admin-confirm-btn');
    if (btn) {
        btn.addEventListener('click', executeAdminAction);
    }
}

async function loadAdminData() {
    const tbody = document.getElementById('admin-table');
    try {
        const response = await fetch('/api/v1/admin/users', {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });

        if (!response.ok) {
            const errText = `HTTP ${response.status}: ${response.statusText}`;
            tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-12 text-center text-error font-mono text-xs">[ACCESS_DENIED] ${errText}</td></tr>`;
            return;
        }

        currentUsers = await response.json();
        renderAdminTable(currentUsers);
        updateStats(currentUsers);

    } catch (error) {
        console.error("Admin error:", error);
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-12 text-center text-error font-mono text-xs">[COMMS_FAILURE] Cannot connect to registry server. ${error.message}</td></tr>`;
        }
    }
}

function updateStats(users) {
    const total = users.length;
    const active = users.filter(u => u.enabled).length;
    const pending = users.filter(u => !u.enabled).length;
    const suspended = 0; // Could track separately if needed

    const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    el('stat-total', total);
    el('stat-active', active);
    el('stat-pending', pending);
    el('stat-suspended', suspended);

    const badge = document.getElementById('member-count-badge');
    if (badge) badge.textContent = `${total} OPERATIVES`;
}

function getRoleClass(role) {
    return ROLE_COLORS[role] || 'text-gray-400 border-gray-400/20 bg-gray-400/5';
}

function renderAdminTable(users) {
    const tbody = document.getElementById('admin-table');
    if (!tbody) return;

    if (users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-12 text-center text-gray-600 font-mono text-xs">No operatives found in registry.</td></tr>`;
        return;
    }

    tbody.innerHTML = users.map(u => {
        const initials = (u.name || 'UN').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const roleClass = getRoleClass(u.role);
        const isActive = u.enabled;
        const coinDisplay = (u.coin || 0).toLocaleString();
        const isSuperAdmin = u.role === 'SUPER ADMIN';

        // SUPER ADMIN row — visible but read-only, no actions
        if (isSuperAdmin) {
            return `<tr class="border-b border-[#D4AF37]/20 bg-[#D4AF37]/[0.02] group" data-name="${(u.name || '').toLowerCase()}" data-username="${(u.username || '').toLowerCase()}">
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center font-mono text-[11px] font-bold text-[#D4AF37] flex-shrink-0">
                            ${initials}
                        </div>
                        <div>
                            <p class="text-sm font-bold text-white">${u.name || 'Unknown'}</p>
                            <p class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">@${u.username || 'N/A'}</p>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 hidden md:table-cell">
                    <span class="px-2 py-0.5 border font-mono text-[10px] tracking-widest uppercase ${roleClass}">
                        ${u.role || 'MENTEE'}
                    </span>
                </td>
                <td class="px-6 py-4 hidden lg:table-cell">
                    <span class="flex items-center gap-1 font-mono text-[11px] text-[#D4AF37]">
                        <span class="material-symbols-outlined text-[12px]">toll</span>
                        ${coinDisplay}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <span class="flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase ${isActive ? 'text-primary' : 'text-error'}">
                        <span class="w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? 'bg-primary animate-pulse' : 'bg-error'}"></span>
                        ${isActive ? 'Online' : 'Terminated'}
                    </span>
                </td>
                <td class="px-6 py-4 text-right">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-[9px] uppercase tracking-widest" title="Super Admin — protected account">
                        <span class="material-symbols-outlined text-[11px]">shield_lock</span>
                        PROTECTED
                    </span>
                </td>
            </tr>`;
        }

        // Normal user row — fully interactive
        return `<tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors group" data-name="${(u.name || '').toLowerCase()}" data-username="${(u.username || '').toLowerCase()}">
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center font-mono text-[11px] font-bold text-primary flex-shrink-0">
                        ${initials}
                    </div>
                    <div>
                        <p class="text-sm font-bold text-white">${u.name || 'Unknown'}</p>
                        <p class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">@${u.username || 'N/A'}</p>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 hidden md:table-cell">
                <span class="px-2 py-0.5 border font-mono text-[10px] tracking-widest uppercase ${roleClass}">
                    ${u.role || 'MENTEE'}
                </span>
            </td>
            <td class="px-6 py-4 hidden lg:table-cell">
                <span class="flex items-center gap-1 font-mono text-[11px] text-[#D4AF37]">
                    <span class="material-symbols-outlined text-[12px]">toll</span>
                    ${coinDisplay}
                </span>
            </td>
            <td class="px-6 py-4">
                <span class="flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase ${isActive ? 'text-primary' : 'text-error'}">
                    <span class="w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? 'bg-primary animate-pulse' : 'bg-error'}"></span>
                    ${isActive ? 'Online' : 'Terminated'}
                </span>
            </td>
            <td class="px-6 py-4 text-right">
                <div class="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="prepAdminAction(${u.id}, 'ECONOMY')" title="Adjust Coins" class="p-1.5 text-gray-500 hover:text-[#D4AF37] transition-colors rounded">
                        <span class="material-symbols-outlined text-base">toll</span>
                    </button>
                    <button onclick="prepAdminAction(${u.id}, 'PASSWORD')" title="Reset Password" class="p-1.5 text-gray-500 hover:text-white transition-colors rounded">
                        <span class="material-symbols-outlined text-base">lock_reset</span>
                    </button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function filterAdminTable(query) {
    const q = (query || '').toLowerCase();
    const roleFilter = document.getElementById('admin-role-filter')?.value || 'ALL';
    
    const filtered = currentUsers.filter(u => {
        const matchesName = (u.name || '').toLowerCase().includes(q) || (u.username || '').toLowerCase().includes(q);
        const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
        return matchesName && matchesRole;
    });
    
    renderAdminTable(filtered);
}

function exportAdminData() {
    if (currentUsers.length === 0) return showToast('No data to export.', 'error');
    const csv = ['Name,Username,Email,Role,Coins,Status',
        ...currentUsers.map(u => `"${u.name}","${u.username}","${u.email}","${u.role}",${u.coin},${u.enabled ? 'Active' : 'Suspended'}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'cybertitans-members.csv';
    a.click();
    showToast('Export complete.', 'success');
}

function prepAdminAction(userId, action) {
    targetUserId = userId;
    currentAction = action;
    const modal = document.getElementById('admin-action-modal');
    const title = document.getElementById('admin-modal-title');
    const content = document.getElementById('admin-modal-content');
    if (!modal) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    const user = currentUsers.find(u => u.id === userId);
    const userName = user ? `<span class="text-primary">${user.name}</span>` : '#' + userId;

    const inputClass = 'w-full bg-black border border-white/20 text-white font-mono text-sm px-4 py-3 outline-none focus:border-primary transition-colors mt-2';

    if (action === 'BAN') {
        title.textContent = 'TERMINATE ACCESS';
        content.innerHTML = `<p class="text-gray-400 text-sm leading-relaxed">You are about to revoke all system privileges for ${userName}. This operative will no longer be able to log in. This action is logged.</p>
            <div class="bg-error/10 border border-error/20 p-3 font-mono text-[10px] text-error uppercase tracking-widest">⚠ This action is immediate and permanent.</div>`;
    } else if (action === 'UNBAN') {
        title.textContent = 'RESTORE ACCESS';
        content.innerHTML = `<p class="text-gray-400 text-sm leading-relaxed">Restore system access for ${userName}. The operative will be able to log in again.</p>`;
    } else if (action === 'ECONOMY') {
        title.textContent = 'FINANCIAL OVERRIDE';
        content.innerHTML = `<p class="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Current balance: <span class="text-[#D4AF37]">${(user?.coin || 0).toLocaleString()} COINS</span></p>
            <label class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Adjust Amount (negative to deduct)</label>
            <input type="number" id="economy-amount" placeholder="e.g. 500 or -200" class="${inputClass}">`;
    } else if (action === 'PASSWORD') {
        title.textContent = 'SECURITY KEY RESET';
        content.innerHTML = `<p class="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Target: ${userName}</p>
            <label class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">New Password</label>
            <input type="text" id="reset-new-pass" placeholder="Enter new password" class="${inputClass}">`;
    }
}

function closeAdminModal() {
    const modal = document.getElementById('admin-action-modal');
    if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
    targetUserId = null;
    currentAction = '';
}

async function executeAdminAction() {
    if (!targetUserId || !currentAction) return;

    let url = `/api/v1/admin/users/${targetUserId}/`;
    let body = {};

    if (currentAction === 'BAN') url += 'ban';
    else if (currentAction === 'UNBAN') url += 'unban';
    else if (currentAction === 'ECONOMY') {
        url += 'economy';
        const val = document.getElementById('economy-amount')?.value;
        if (!val) return showToast('Amount is required.', 'error');
        body = { amount: parseInt(val) };
    } else if (currentAction === 'PASSWORD') {
        url += 'reset-password';
        const val = document.getElementById('reset-new-pass')?.value;
        if (!val) return showToast('Password is required.', 'error');
        body = { newPassword: val };
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(body)
        });

        const result = await response.json();

        if (response.ok) {
            showToast(result.message, 'success');
            closeAdminModal();
            loadAdminData(); // Refresh list
        } else {
            showToast(result.message || 'SYSTEM FAILURE', 'error');
        }
    } catch (e) {
        showToast('COMMS FAILURE: Operation aborted.', 'error');
    }
}
