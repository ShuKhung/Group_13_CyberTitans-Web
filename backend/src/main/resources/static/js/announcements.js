// announcements.js

document.addEventListener('DOMContentLoaded', () => {
    // If we're on the announcements page, load the announcements
    if (document.getElementById('ann-page-list')) {
        loadAnnouncementsPage('ALL');
    }
    
    // Always load the notification dropdown if it exists
    if (document.getElementById('notification-bell')) {
        loadNotificationDropdown();
    }
});

function toggleNotificationPanel() {
    const panel = document.getElementById('notification-panel');
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) {
        loadNotificationDropdown(); // refresh on open
    }
}

// Close panel when clicking outside
document.addEventListener('click', (event) => {
    const bell = document.getElementById('notification-bell');
    const panel = document.getElementById('notification-panel');
    if (bell && panel && !bell.contains(event.target) && !panel.contains(event.target)) {
        panel.classList.add('hidden');
    }
});

async function loadNotificationDropdown() {
    try {
        const [annRes, evtRes] = await Promise.all([
            fetch('/api/v1/announcements'),
            fetch('/api/v1/events').catch(() => null)
        ]);
        
        let allItems = [];
        
        if (annRes && annRes.ok) {
            const data = await annRes.json();
            allItems = allItems.concat(data);
        }
        
        if (evtRes && evtRes.ok) {
            const events = await evtRes.json();
            const eventAnns = events.map(e => {
                let parsedDate = new Date();
                if (e.eventDate) {
                    const dateStr = e.eventDate.split(' - ')[0]; 
                    const result = new Date(dateStr);
                    if (!isNaN(result)) parsedDate = result;
                }
                return {
                    id: 'evt-' + e.id,
                    title: e.title,
                    message: "Upcoming Event: " + e.description,
                    type: 'EVENT',
                    createdAt: parsedDate.toISOString(),
                    displayDate: e.eventDate,
                    isRead: false
                };
            });
            allItems = allItems.concat(eventAnns);
        }
        
        // Sort descending by date
        allItems.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        renderNotificationDropdown(allItems);
    } catch (err) {
        console.error('Error fetching notifications:', err);
    }
}

function renderNotificationDropdown(announcements) {
    const list = document.getElementById('notification-dropdown-list');
    const badge = document.getElementById('notification-badge');
    
    list.innerHTML = '';
    
    // Calculate unread count
    const unreadCount = announcements.filter(a => !a.isRead).length;
    if (unreadCount > 0) {
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }

    if (announcements.length === 0) {
        list.innerHTML = '<div class="text-center py-4 text-xs text-on-surface-variant font-mono">No new alerts.</div>';
        return;
    }

    // Limit to 5 most recent for dropdown
    const displayList = announcements.slice(0, 5);

    displayList.forEach(ann => {
        const item = document.createElement('div');
        item.className = `p-3 border-b border-outline-variant/10 text-left hover:bg-white/5 cursor-pointer transition-colors ${ann.isRead ? 'opacity-60' : ''}`;
        item.onclick = () => {
            if (!ann.isRead && typeof ann.id === 'number') markAsRead(ann.id);
            window.location.href = '/announcementEvents';
        };

        const typeColor = getTypeColor(ann.type);
        
        item.innerHTML = `
            <div class="flex items-center gap-2 mb-1">
                <span class="w-1.5 h-1.5 rounded-full ${!ann.isRead ? 'bg-primary animate-pulse' : 'bg-transparent'}"></span>
                <span class="text-[10px] font-mono tracking-widest ${typeColor}">${ann.type}</span>
                <span class="text-[10px] font-mono text-on-surface-variant ml-auto">${ann.displayDate || new Date(ann.createdAt).toLocaleDateString()}</span>
            </div>
            <h4 class="text-xs font-bold text-white pl-3">${ann.title}</h4>
            <p class="text-[10px] text-on-surface-variant pl-3 mt-1 truncate">${ann.message}</p>
        `;
        list.appendChild(item);
    });
}

async function loadAnnouncementsPage(type) {
    try {
        const url = type === 'ALL' ? '/api/v1/announcements' : `/api/v1/announcements?type=${type}`;
        
        const fetchPromises = [fetch(url)];
        if (type === 'ALL' || type === 'EVENT') {
            fetchPromises.push(fetch('/api/v1/events').catch(() => null));
        }

        const responses = await Promise.all(fetchPromises);
        let allItems = [];

        if (responses[0] && responses[0].ok) {
            const data = await responses[0].json();
            allItems = allItems.concat(data);
        }

        if (responses.length > 1 && responses[1] && responses[1].ok) {
            const events = await responses[1].json();
            const eventAnns = events.map(e => {
                let parsedDate = new Date();
                if (e.eventDate) {
                    const dateStr = e.eventDate.split(' - ')[0]; 
                    const result = new Date(dateStr);
                    if (!isNaN(result)) parsedDate = result;
                }
                return {
                    id: 'evt-' + e.id,
                    title: e.title,
                    message: "Upcoming Event: " + e.description,
                    type: 'EVENT',
                    createdAt: parsedDate.toISOString(),
                    displayDate: e.eventDate,
                    isRead: false
                };
            });
            allItems = allItems.concat(eventAnns);
        }

        // Sort descending by date
        allItems.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        renderAnnouncementsPage(allItems);
    } catch (err) {
        console.error('Error fetching announcements page:', err);
    }
}

function renderAnnouncementsPage(announcements) {
    const list = document.getElementById('ann-page-list');
    list.innerHTML = '';
    
    if (announcements.length === 0) {
        list.innerHTML = '<div class="text-center py-10 text-on-surface-variant font-mono text-sm border border-outline-variant/30 bg-surface-container">SYSTEM.EMPTY_STATE: No records found.</div>';
        return;
    }

    announcements.forEach(ann => {
        const block = document.createElement('div');
        const borderColor = ann.isRead ? 'border-outline-variant/30' : 'border-primary/50';
        const typeColor = getTypeColor(ann.type);
        
        block.className = `p-5 bg-surface-container border-l-2 ${borderColor} hover:bg-surface-container-high transition-colors cursor-pointer`;
        block.onclick = () => {
            if (!ann.isRead) markAsRead(ann.id, true);
        };
        
        block.innerHTML = `
            <div class="flex flex-wrap items-center justify-between gap-4 mb-2">
                <div class="flex items-center gap-3">
                    <span class="font-mono text-[10px] px-2 py-0.5 border ${typeColor} uppercase tracking-widest">${ann.type}</span>
                    ${!ann.isRead ? '<span class="font-mono text-[10px] text-black bg-primary px-1 font-bold">NEW</span>' : ''}
                </div>
                <div class="font-mono text-xs text-on-surface-variant">${ann.displayDate || new Date(ann.createdAt).toLocaleString()}</div>
            </div>
            <h3 class="text-lg font-bold text-white mb-2">${ann.title}</h3>
            <p class="text-sm text-on-surface-variant">${ann.message}</p>
        `;
        list.appendChild(block);
    });
}

async function markAsRead(id, refreshPage = false) {
    try {
        await fetch(`/api/v1/announcements/${id}/mark-read`, { method: 'PUT' });
        loadNotificationDropdown();
        if (refreshPage) {
            const activeTypeBtn = document.querySelector('#ann-filter-bar button.text-primary') || document.querySelector('#ann-filter-bar button');
            const type = activeTypeBtn ? activeTypeBtn.innerText.trim() : 'ALL';
            loadAnnouncementsPage(type);
        }
    } catch (err) {
        console.error('Error marking as read:', err);
    }
}

async function markAllAnnouncementsRead() {
    try {
        await fetch('/api/v1/announcements/mark-all-read', { method: 'PUT' });
        loadNotificationDropdown();
        if (document.getElementById('ann-page-list')) {
            const activeTypeBtn = document.querySelector('#ann-filter-bar button.text-primary');
            const type = activeTypeBtn ? activeTypeBtn.innerText.trim() : 'ALL';
            loadAnnouncementsPage(type);
        }
    } catch (err) {
        console.error('Error marking all as read:', err);
    }
}

function filterAnnouncements(type, buttonElement) {
    // Update button styles
    const buttons = document.querySelectorAll('#ann-filter-bar button');
    buttons.forEach(btn => {
        btn.classList.remove('text-primary', 'border-primary');
        btn.classList.add('text-gray-500', 'border-transparent', 'hover:border-white/30');
    });
    
    buttonElement.classList.add('text-primary', 'border-primary');
    buttonElement.classList.remove('text-gray-500', 'border-transparent', 'hover:border-white/30');
    
    loadAnnouncementsPage(type);
}

function getTypeColor(type) {
    switch(type) {
        case 'EVENT': return 'text-tertiary border-tertiary/30';
        case 'SYSTEM': return 'text-error border-error/30';
        case 'MENTOR': return 'text-secondary border-secondary/30';
        case 'INFO': 
        default: return 'text-primary border-primary/30';
    }
}
