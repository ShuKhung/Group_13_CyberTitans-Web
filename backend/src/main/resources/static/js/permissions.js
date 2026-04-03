function getToken() {
    return localStorage.getItem('cyber_token') || sessionStorage.getItem('cyber_token') || '';
}

// Match DB role names exactly: SUPER ADMIN, ADMIN, MENTOR, MENTEE
const ALL_ROLES = ['MENTEE', 'MENTOR', 'ADMIN', 'SUPER ADMIN'];

const ROLE_COLORS = {
    'SUPER ADMIN': 'text-error border-error/20 bg-error/5',
    'ADMIN': 'text-[#D4AF37] border-[#D4AF37]/20 bg-[#D4AF37]/5',
    'MENTOR': 'text-secondary border-secondary/20 bg-secondary/5',
    'MENTEE': 'text-primary border-primary/20 bg-primary/5',
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('perm-table-body')) {
        loadPermissionsData();
        loadSystemLogs();
    }
});

async function loadPermissionsData() {
    const tbody = document.getElementById('perm-table-body');
    try {
        const response = await fetch('/api/v1/admin/users', {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });

        if (!response.ok) {
            if (tbody) tbody.innerHTML = `<tr><td colspan="3" class="px-6 py-12 text-center text-error font-mono text-xs">[DENIED] HTTP ${response.status}</td></tr>`;
            return;
        }

        const users = await response.json();
        renderPermissionsTable(users);
    } catch (error) {
        console.error("Permissions error:", error);
        if (tbody) tbody.innerHTML = `<tr><td colspan="3" class="px-6 py-12 text-center text-error font-mono text-xs">[COMMS_FAILURE] ${error.message}</td></tr>`;
    }
}

function renderPermissionsTable(users) {
    const tbody = document.getElementById('perm-table-body');
    if (!tbody) return;

    tbody.innerHTML = users.map(u => {
        const initials = (u.name || 'UN').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const roleClass = ROLE_COLORS[u.role] || 'text-gray-400 border-gray-400/20 bg-gray-400/5';

        const roleOptions = ALL_ROLES.map(r =>
            `<option value="${r}" ${r === u.role ? 'selected' : ''}>${r}</option>`
        ).join('');

        const isLocked = (u.role === 'SUPER ADMIN');
        
        return `<tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors ${isLocked ? 'opacity-80' : ''}">
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center font-mono text-[11px] font-bold text-primary flex-shrink-0">
                        ${initials}
                    </div>
                    <div>
                        <p class="text-sm font-bold text-white">${u.name || 'Unknown'}</p>
                        <p class="text-[10px] font-mono text-gray-500 uppercase">@${u.username || 'N/A'}</p>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4">
                <span class="px-2 py-0.5 border font-mono text-[10px] tracking-widest uppercase ${roleClass}">${u.role || 'MENTEE'}</span>
            </td>
            <td class="px-6 py-4 text-right">
                <select ${isLocked ? 'disabled' : ''} 
                        onchange="updateUserRole(${u.id}, this.value, this)"
                        class="bg-[#0a0a0a] border border-white/20 text-white font-mono text-[10px] px-3 py-2 outline-none focus:border-primary hover:border-white/40 transition-colors ${isLocked ? 'cursor-not-allowed opacity-50 grayscale' : 'cursor-pointer'}">
                    ${roleOptions}
                </select>
            </td>
        </tr>`;
    }).join('');
}

async function updateUserRole(userId, newRole, selectEl) {
    if (!confirm(`Re-assign Operative #${userId} to role "${newRole}"?\nThis action is permanent and logged.`)) {
        // Reset to previous value by reloading
        loadPermissionsData();
        return;
    }

    try {
        const response = await fetch(`/api/v1/super-admin/users/${userId}/role`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            // Send the exact DB role name (no ROLE_ prefix)
            body: JSON.stringify({ roleName: newRole })
        });

        const result = await response.json();
        if (response.ok) {
            showToast(`${result.message}`, 'success');
            loadPermissionsData(); // Refresh to show updated roles
        } else {
            showToast(result.message || 'OVERRIDE FAILED', 'error');
            loadPermissionsData(); // Reset select
        }
    } catch (e) {
        showToast('COMMS FAILURE: Data packet lost.', 'error');
        loadPermissionsData();
    }
}

async function loadSystemLogs() {
    const logBox = document.getElementById('system-logs');
    if (!logBox) return;

    try {
        const response = await fetch('/api/v1/super-admin/system-logs', {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });

        if (response.ok) {
            const data = await response.json();
            logBox.innerHTML = '';
            const lines = data.logs.split('\n');
            const now = new Date();
            lines.forEach((line, i) => {
                setTimeout(() => {
                    const p = document.createElement('p');
                    const time = new Date(now.getTime() - (lines.length - i) * 3000);
                    p.innerHTML = `<span class="text-gray-600">[${time.toLocaleTimeString()}]</span> <span class="text-error/80">${line}</span>`;
                    logBox.appendChild(p);
                    logBox.scrollTop = logBox.scrollHeight;
                }, i * 100);
            });
        }
    } catch (e) {
        if (logBox) logBox.innerHTML = '<p class="text-error/50">[ERROR] Unable to connect to audit log server.</p>';
    }
}
