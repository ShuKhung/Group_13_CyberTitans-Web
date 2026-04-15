let currentUsers = [];
let currentProjects = [];
let currentActiveProjects = [];
let currentDeleteRequests = [];
let targetId = null;
let currentAction = '';
let activeTab = 'users';

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
        switchAdminTab('users'); // Initial load
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

// --- TAB MANAGEMENT ---

const ALL_TABS = ['users', 'projects', 'active-projects', 'delete-requests'];

function switchAdminTab(tab) {
    activeTab = tab;
    const pathIndicator = document.getElementById('admin-path-indicator');
    const mainTitle = document.getElementById('admin-main-title');
    const mainSubtitle = document.getElementById('admin-main-subtitle');
    const headerActions = document.getElementById('admin-header-actions');
    const tableTitle = document.getElementById('admin-table-title');
    const roleFilter = document.getElementById('filter-role-wrap');

    // Reset all tab buttons
    ALL_TABS.forEach(t => {
        const btn = document.getElementById(`tab-${t}`);
        if (btn) {
            btn.classList.add('border-transparent', 'text-gray-500');
            btn.classList.remove('border-primary', 'text-primary');
        }
    });
    // Activate current tab
    const activeBtn = document.getElementById(`tab-${tab}`);
    if (activeBtn) {
        activeBtn.classList.add('border-primary', 'text-primary');
        activeBtn.classList.remove('border-transparent', 'text-gray-500');
    }

    if (tab === 'users') {
        pathIndicator.textContent = 'CONTROL_CENTER';
        mainTitle.textContent = 'Member Management';
        mainSubtitle.textContent = 'Real-time operative registry. All changes are permanent.';
        tableTitle.textContent = 'Member Registry';
        if (roleFilter) roleFilter.style.display = '';
        if (headerActions) headerActions.style.display = 'flex';
        updateTableHeaders('users');
        loadAdminData();
    } else if (tab === 'projects') {
        pathIndicator.textContent = 'PROJECT_APPROVAL';
        mainTitle.textContent = 'Project Requests';
        mainSubtitle.textContent = 'Validation required for public deployment.';
        tableTitle.textContent = 'Pending Requests';
        if (roleFilter) roleFilter.style.display = 'none';
        if (headerActions) headerActions.style.display = 'none';
        updateTableHeaders('projects');
        loadPendingProjects();
    } else if (tab === 'active-projects') {
        pathIndicator.textContent = 'PROJECT_MANAGEMENT';
        mainTitle.textContent = 'Active Projects';
        mainSubtitle.textContent = 'Manage live projects. Request deletion requires Super Admin approval.';
        tableTitle.textContent = 'Active Registry';
        if (roleFilter) roleFilter.style.display = 'none';
        if (headerActions) headerActions.style.display = 'none';
        updateTableHeaders('active-projects');
        loadActiveProjects();
    } else if (tab === 'delete-requests') {
        pathIndicator.textContent = 'DELETION_QUEUE';
        mainTitle.textContent = 'Deletion Requests';
        mainSubtitle.textContent = 'Super Admin authorization required to permanently purge projects.';
        tableTitle.textContent = 'Pending Deletions';
        if (roleFilter) roleFilter.style.display = 'none';
        if (headerActions) headerActions.style.display = 'none';
        updateTableHeaders('delete-requests');
        loadDeleteRequests();
    }
}

function updateTableHeaders(type) {
    const head = document.getElementById('admin-table-head');
    if (!head) return;

    if (type === 'users') {
        head.innerHTML = `
            <th class="px-6 py-4 text-left text-[10px] font-mono text-gray-500 uppercase tracking-widest">Operative</th>
            <th class="px-6 py-4 text-left text-[10px] font-mono text-gray-500 uppercase tracking-widest hidden md:table-cell">Clearance</th>
            <th class="px-6 py-4 text-left text-[10px] font-mono text-gray-500 uppercase tracking-widest hidden lg:table-cell">Coins</th>
            <th class="px-6 py-4 text-left text-[10px] font-mono text-gray-500 uppercase tracking-widest">Status</th>
            <th class="px-6 py-4 text-right text-[10px] font-mono text-gray-500 uppercase tracking-widest">Actions</th>
        `;
    } else if (type === 'projects') {
        head.innerHTML = `
            <th class="px-6 py-4 text-left text-[10px] font-mono text-gray-500 uppercase tracking-widest">Project/Team</th>
            <th class="px-6 py-4 text-left text-[10px] font-mono text-gray-500 uppercase tracking-widest hidden md:table-cell">Tech Stack</th>
            <th class="px-6 py-4 text-left text-[10px] font-mono text-gray-500 uppercase tracking-widest hidden lg:table-cell">Submission Date</th>
            <th class="px-6 py-4 text-left text-[10px] font-mono text-gray-500 uppercase tracking-widest">Status</th>
            <th class="px-6 py-4 text-right text-[10px] font-mono text-gray-500 uppercase tracking-widest">Validation</th>
        `;
    } else if (type === 'active-projects') {
        head.innerHTML = `
            <th class="px-6 py-4 text-left text-[10px] font-mono text-gray-500 uppercase tracking-widest">Project/Team</th>
            <th class="px-6 py-4 text-left text-[10px] font-mono text-gray-500 uppercase tracking-widest hidden md:table-cell">Tech Stack</th>
            <th class="px-6 py-4 text-left text-[10px] font-mono text-gray-500 uppercase tracking-widest hidden lg:table-cell">Views</th>
            <th class="px-6 py-4 text-left text-[10px] font-mono text-gray-500 uppercase tracking-widest">Rating</th>
            <th class="px-6 py-4 text-right text-[10px] font-mono text-gray-500 uppercase tracking-widest">Actions</th>
        `;
    } else if (type === 'delete-requests') {
        head.innerHTML = `
            <th class="px-6 py-4 text-left text-[10px] font-mono text-gray-500 uppercase tracking-widest">Project/Team</th>
            <th class="px-6 py-4 text-left text-[10px] font-mono text-gray-500 uppercase tracking-widest hidden md:table-cell">Tech Stack</th>
            <th class="px-6 py-4 text-left text-[10px] font-mono text-gray-500 uppercase tracking-widest hidden lg:table-cell">Requested At</th>
            <th class="px-6 py-4 text-left text-[10px] font-mono text-gray-500 uppercase tracking-widest">Status</th>
            <th class="px-6 py-4 text-right text-[10px] font-mono text-gray-500 uppercase tracking-widest">Authorization</th>
        `;
    }
}

// --- DATA LOADING ---

async function loadAdminData() {
    const tbody = document.getElementById('admin-table');
    try {
        const response = await fetch('/api/v1/admin/users', {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (!response.ok) throw new Error(response.statusText);
        currentUsers = await response.json();
        renderAdminTable(currentUsers);
        updateStats(currentUsers, 'users');
    } catch (error) {
        console.error("Admin error:", error);
        tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-12 text-center text-error font-mono text-xs">[COMMS_FAILURE] ${error.message}</td></tr>`;
    }
}

async function loadPendingProjects() {
    const tbody = document.getElementById('admin-table');
    tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-12 text-center text-gray-600 font-mono text-xs">Scanning for pending data...</td></tr>`;
    try {
        const response = await fetch('/api/v1/admin/projects/pending', {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (!response.ok) throw new Error(response.statusText);
        currentProjects = await response.json();
        renderProjectApprovalTable(currentProjects);
        updateStats(currentProjects, 'projects');
    } catch (error) {
        console.error("Project error:", error);
        tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-12 text-center text-error font-mono text-xs">[COMMS_FAILURE] ${error.message}</td></tr>`;
    }
}

async function loadActiveProjects() {
    const tbody = document.getElementById('admin-table');
    tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-12 text-center text-gray-600 font-mono text-xs">Loading active projects...</td></tr>`;
    try {
        const response = await fetch('/api/v1/admin/projects/active', {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (!response.ok) throw new Error(response.statusText);
        currentActiveProjects = await response.json();
        renderActiveProjectsTable(currentActiveProjects);
        updateStats(currentActiveProjects, 'active-projects');
    } catch (error) {
        console.error("Active projects error:", error);
        tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-12 text-center text-error font-mono text-xs">[COMMS_FAILURE] ${error.message}</td></tr>`;
    }
}

async function loadDeleteRequests() {
    const tbody = document.getElementById('admin-table');
    tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-12 text-center text-gray-600 font-mono text-xs">Scanning deletion queue...</td></tr>`;
    try {
        const response = await fetch('/api/v1/super-admin/projects/pending-delete', {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (!response.ok) throw new Error(response.statusText);
        currentDeleteRequests = await response.json();
        renderDeleteRequestsTable(currentDeleteRequests);
        updateStats(currentDeleteRequests, 'delete-requests');
    } catch (error) {
        console.error("Delete requests error:", error);
        tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-12 text-center text-error font-mono text-xs">[COMMS_FAILURE] ${error.message}</td></tr>`;
    }
}

// --- STATS ---

function updateStats(items, type) {
    const total = items.length;
    const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    const badge = document.getElementById('member-count-badge');

    if (type === 'users') {
        const active = items.filter(u => u.enabled).length;
        const pending = items.filter(u => !u.enabled).length;
        el('stat-total', total);
        el('stat-active', active);
        el('stat-pending', pending);
        el('stat-suspended', 0);
        if (badge) badge.textContent = `${total} OPERATIVES`;
    } else if (type === 'projects') {
        el('stat-total', total);
        el('stat-active', '—');
        el('stat-pending', total);
        el('stat-suspended', '—');
        if (badge) badge.textContent = `${total} REQUESTS`;
    } else if (type === 'active-projects') {
        el('stat-total', total);
        el('stat-active', total);
        el('stat-pending', '—');
        el('stat-suspended', '—');
        if (badge) badge.textContent = `${total} ACTIVE`;
    } else if (type === 'delete-requests') {
        el('stat-total', total);
        el('stat-active', '—');
        el('stat-pending', total);
        el('stat-suspended', '—');
        if (badge) badge.textContent = `${total} PENDING`;
    }
}

// --- RENDERERS ---

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

function renderProjectApprovalTable(projects) {
    const tbody = document.getElementById('admin-table');
    if (!tbody) return;

    if (projects.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-12 text-center text-gray-600 font-mono text-xs">No pending project requests detected.</td></tr>`;
        return;
    }

    tbody.innerHTML = projects.map(p => {
        const date = p.submittedAt ? new Date(p.submittedAt).toLocaleDateString() : 'N/A';
        const techStack = p.techStack ? p.techStack.split(',').slice(0, 3).join(', ') : 'N/A';

        return `<tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center font-mono text-[11px] font-bold text-primary flex-shrink-0">
                        PR
                    </div>
                    <div>
                        <p class="text-sm font-bold text-white">${p.name || 'Untitled'}</p>
                        <p class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">TEAM: ${p.teamId || 'N/A'}</p>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 hidden md:table-cell">
                <span class="text-[10px] font-mono text-gray-400 uppercase tracking-widest">${techStack}</span>
            </td>
            <td class="px-6 py-4 hidden lg:table-cell">
                <span class="text-[10px] font-mono text-gray-500 tracking-widest">${date}</span>
            </td>
            <td class="px-6 py-4">
                <span class="flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase text-[#D4AF37]">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
                    Reviewing
                </span>
            </td>
            <td class="px-6 py-4 text-right">
                <div class="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="prepAdminAction(${p.id}, 'APPROVE_PROJECT')" title="Approve Project" class="px-3 py-1 bg-primary/10 border border-primary/30 text-primary font-mono text-[9px] uppercase hover:bg-primary hover:text-black transition-all">
                        Approve
                    </button>
                    <button onclick="prepAdminAction(${p.id}, 'REJECT_PROJECT')" title="Reject Project" class="px-3 py-1 bg-error/10 border border-error/30 text-error font-mono text-[9px] uppercase hover:bg-error hover:text-white transition-all">
                        Reject
                    </button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function renderActiveProjectsTable(projects) {
    const tbody = document.getElementById('admin-table');
    if (!tbody) return;

    if (projects.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-12 text-center text-gray-600 font-mono text-xs">No active projects in registry.</td></tr>`;
        return;
    }

    tbody.innerHTML = projects.map(p => {
        const techStack = p.techStack ? p.techStack.split(',').slice(0, 3).join(', ') : 'N/A';
        const views = (p.views || 0).toLocaleString();
        const rating = p.ratingAvg ? p.ratingAvg.toFixed(1) : '0.0';

        return `<tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-primary/10 border border-primary/30 flex items-center justify-center font-mono text-[11px] font-bold text-primary flex-shrink-0">
                        <span class="material-symbols-outlined text-[16px]">deployed_code</span>
                    </div>
                    <div>
                        <p class="text-sm font-bold text-white">${p.name || 'Untitled'}</p>
                        <p class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">TEAM: ${p.teamId || 'N/A'}</p>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 hidden md:table-cell">
                <span class="text-[10px] font-mono text-gray-400 uppercase tracking-widest">${techStack}</span>
            </td>
            <td class="px-6 py-4 hidden lg:table-cell">
                <span class="flex items-center gap-1 font-mono text-[11px] text-gray-400">
                    <span class="material-symbols-outlined text-[12px]">visibility</span>
                    ${views}
                </span>
            </td>
            <td class="px-6 py-4">
                <span class="flex items-center gap-1 font-mono text-[11px] text-[#D4AF37]">
                    <span class="material-symbols-outlined text-[12px]">star</span>
                    ${rating}
                </span>
            </td>
            <td class="px-6 py-4 text-right">
                <div class="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="prepAdminAction(${p.id}, 'REQUEST_DELETE')" title="Request Deletion" class="px-3 py-1 bg-error/10 border border-error/30 text-error font-mono text-[9px] uppercase hover:bg-error hover:text-white transition-all flex items-center gap-1">
                        <span class="material-symbols-outlined text-[12px]">delete</span>
                        Request Delete
                    </button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function renderDeleteRequestsTable(requests) {
    const tbody = document.getElementById('admin-table');
    if (!tbody) return;

    if (requests.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-12 text-center text-gray-600 font-mono text-xs">No deletion requests in queue. All projects are secure.</td></tr>`;
        return;
    }

    tbody.innerHTML = requests.map(p => {
        const techStack = p.techStack ? p.techStack.split(',').slice(0, 3).join(', ') : 'N/A';
        const requestedAt = p.requestedAt ? new Date(p.requestedAt).toLocaleDateString() : 'N/A';

        return `<tr class="border-b border-error/10 hover:bg-error/[0.02] transition-colors group">
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-error/10 border border-error/30 flex items-center justify-center font-mono text-[11px] font-bold text-error flex-shrink-0">
                        <span class="material-symbols-outlined text-[16px]">warning</span>
                    </div>
                    <div>
                        <p class="text-sm font-bold text-white">${p.name || 'Untitled'}</p>
                        <p class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">TEAM: ${p.teamId || 'N/A'}</p>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 hidden md:table-cell">
                <span class="text-[10px] font-mono text-gray-400 uppercase tracking-widest">${techStack}</span>
            </td>
            <td class="px-6 py-4 hidden lg:table-cell">
                <span class="text-[10px] font-mono text-gray-500 tracking-widest">${requestedAt}</span>
            </td>
            <td class="px-6 py-4">
                <span class="flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase text-error">
                    <span class="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
                    Pending Delete
                </span>
            </td>
            <td class="px-6 py-4 text-right">
                <div class="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="prepAdminAction(${p.id}, 'CONFIRM_DELETE')" title="Confirm Permanent Deletion" class="px-3 py-1 bg-error/10 border border-error/30 text-error font-mono text-[9px] uppercase hover:bg-error hover:text-white transition-all">
                        Confirm Delete
                    </button>
                    <button onclick="prepAdminAction(${p.id}, 'CANCEL_DELETE')" title="Cancel Deletion" class="px-3 py-1 bg-primary/10 border border-primary/30 text-primary font-mono text-[9px] uppercase hover:bg-primary hover:text-black transition-all">
                        Cancel
                    </button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

// --- FILTERS ---

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

// --- MODAL & ACTIONS ---

function prepAdminAction(id, action) {
    targetId = id;
    currentAction = action;
    const modal = document.getElementById('admin-action-modal');
    const title = document.getElementById('admin-modal-title');
    const content = document.getElementById('admin-modal-content');
    if (!modal) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    const user = currentUsers.find(u => u.id === id);
    const userName = user ? `<span class="text-primary">${user.name}</span>` : '#' + id;

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
    } else if (action === 'APPROVE_PROJECT') {
        const project = currentProjects.find(p => p.id === id);
        title.textContent = 'AUTHORIZE DEPLOYMENT';
        content.innerHTML = `<p class="text-gray-400 text-sm leading-relaxed">Confirming validation for <span class="text-primary font-bold">${project?.name}</span>. This project will be moved to the active registry and made visible on the public terminal.</p>
            <div class="bg-primary/10 border border-primary/20 p-3 font-mono text-[10px] text-primary uppercase tracking-widest">System-wide visibility enabled upon execution.</div>`;
    } else if (action === 'REJECT_PROJECT') {
        const project = currentProjects.find(p => p.id === id);
        title.textContent = 'REJECT SUBMISSION';
        content.innerHTML = `<p class="text-gray-400 text-sm leading-relaxed">Archiving submission for <span class="text-error font-bold">${project?.name}</span>. The requester will be notified of the rejection.</p>`;
    } else if (action === 'REQUEST_DELETE') {
        const project = currentActiveProjects.find(p => p.id === id);
        title.textContent = 'REQUEST DELETION';
        content.innerHTML = `<p class="text-gray-400 text-sm leading-relaxed">You are requesting deletion of <span class="text-error font-bold">${project?.name}</span>. This will submit a deletion request to the <span class="text-[#D4AF37]">Super Admin</span> for final authorization.</p>
            <div class="bg-[#D4AF37]/10 border border-[#D4AF37]/20 p-3 font-mono text-[10px] text-[#D4AF37] uppercase tracking-widest">⚠ Project will remain active until Super Admin confirms.</div>`;
    } else if (action === 'CONFIRM_DELETE') {
        const project = currentDeleteRequests.find(p => p.id === id);
        title.textContent = 'CONFIRM PERMANENT DELETION';
        content.innerHTML = `<p class="text-gray-400 text-sm leading-relaxed">You are about to <span class="text-error font-bold">permanently delete</span> project <span class="text-error font-bold">${project?.name}</span>. This action cannot be undone. All project data, files, and records will be purged from the system.</p>
            <div class="bg-error/10 border border-error/20 p-3 font-mono text-[10px] text-error uppercase tracking-widest">⚠ IRREVERSIBLE — ALL DATA WILL BE LOST.</div>`;
    } else if (action === 'CANCEL_DELETE') {
        const project = currentDeleteRequests.find(p => p.id === id);
        title.textContent = 'CANCEL DELETION REQUEST';
        content.innerHTML = `<p class="text-gray-400 text-sm leading-relaxed">Cancelling the deletion request for <span class="text-primary font-bold">${project?.name}</span>. The project will be restored to active status.</p>`;
    }
}

function closeAdminModal() {
    const modal = document.getElementById('admin-action-modal');
    if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
    targetId = null;
    currentAction = '';
}

async function executeAdminAction() {
    if (!targetId || !currentAction) return;

    let url = '';
    let body = {};

    if (currentAction === 'BAN' || currentAction === 'UNBAN' || currentAction === 'ECONOMY' || currentAction === 'PASSWORD') {
        url = `/api/v1/admin/users/${targetId}/`;
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
    } else if (currentAction === 'APPROVE_PROJECT') {
        url = `/api/v1/admin/projects/${targetId}/approve`;
    } else if (currentAction === 'REJECT_PROJECT') {
        url = `/api/v1/admin/projects/${targetId}/reject`;
    } else if (currentAction === 'REQUEST_DELETE') {
        url = `/api/v1/admin/projects/${targetId}/request-delete`;
    } else if (currentAction === 'CONFIRM_DELETE') {
        url = `/api/v1/super-admin/projects/${targetId}/confirm-delete`;
    } else if (currentAction === 'CANCEL_DELETE') {
        url = `/api/v1/super-admin/projects/${targetId}/cancel-delete`;
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
            // Reload the appropriate tab
            if (activeTab === 'users') loadAdminData();
            else if (activeTab === 'projects') loadPendingProjects();
            else if (activeTab === 'active-projects') loadActiveProjects();
            else if (activeTab === 'delete-requests') loadDeleteRequests();
        } else {
            showToast(result.message || 'SYSTEM FAILURE', 'error');
        }
    } catch (e) {
        showToast('COMMS FAILURE: Operation aborted.', 'error');
    }
}
