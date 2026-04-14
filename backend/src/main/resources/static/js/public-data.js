async function buildTeam() {
    const adminGrid = document.getElementById('admin-grid');
    const mentorGrid = document.getElementById('mentor-grid');
    if (!adminGrid && !mentorGrid) return;

    try {
        const response = await fetch(`${API_BASE_URL}/team/members`);
        const teamData = await response.json();
        const defaultAvt = "https://ui-avatars.com/api/?background=random&color=fff&name=";

        // Grouping & Filtering
        const admins = teamData.filter(m => ["ADMIN", "SUPER ADMIN", "SUPERADMIN"].includes(m.role.toUpperCase()));
        const mentors = teamData.filter(m => m.role.toUpperCase() === "MENTOR");

        // Helper for rendering
        const renderCards = (members) => members.map(m => `
            <div class="hack-card p-6 border transition-all duration-300">
                <div class="scanner"></div>
                <img src="${m.avatar || (defaultAvt + encodeURIComponent(m.name))}" class="w-full aspect-square object-cover mb-4 grayscale hover:grayscale-0 transition-all"/>
                <div class="space-y-1">
                    <h4 class="text-white font-bold text-lg font-headline">${m.name}</h4>
                    <p class="text-primary font-mono text-xs uppercase tracking-widest">${m.role}</p>
                </div>
                <div class="mt-4 border-t border-white/10 pt-4 text-center">
                    <button onclick="openProfileModal(${m.id})" class="text-primary font-mono text-[10px] uppercase border border-primary/20 px-4 py-1 hover:bg-primary hover:text-black transition-all">VIEW PROFILE</button>
                </div>
            </div>`).join('');

        // Inject HTML and Toggle Sections
        if (adminGrid) {
            adminGrid.innerHTML = renderCards(admins);
            document.getElementById('admin-section').style.display = admins.length ? 'block' : 'none';
        }
        if (mentorGrid) {
            mentorGrid.innerHTML = renderCards(mentors);
            document.getElementById('mentor-section').style.display = mentors.length ? 'block' : 'none';
        }

    } catch (err) { console.error("Team error:", err); }
}

async function buildRanking() {
    const podiumContainer = document.getElementById('podium-container');
    const listContainer = document.getElementById('ranking-list-container');
    if (!podiumContainer || !listContainer) return;
    try {
        const response = await fetch(`${API_BASE_URL}/ranking`);
        const rankingData = await response.json();
        const layout = [
            { idx: 1, color: '#e5e7eb', shadow: 'rgba(229,231,235,0.4)', pad: 'pt-16 pb-4' },
            { idx: 0, color: '#fbbf24', shadow: 'rgba(251,191,36,0.5)', pad: 'pt-20 pb-6' },
            { idx: 2, color: '#f97316', shadow: 'rgba(249,115,22,0.4)', pad: 'pt-14 pb-4' }
        ];
        podiumContainer.innerHTML = layout.map(pos => {
            const u = rankingData[pos.idx];
            if (!u) return '';
            const initials = u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            return `
                <div class="flex flex-col items-center w-[30%] relative">
                    <div class="relative z-10 mb-[-40px]">
                        <div class="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 flex items-center justify-center font-bold text-2xl text-white bg-[#1a1a1a] shadow-[0_0_20px_${pos.shadow}]" style="border-color: ${pos.color}">${initials}</div>
                    </div>
                    <div class="w-full bg-[#0a0a0a] border-t-2 flex flex-col items-center px-2 ${pos.pad}" style="border-color: ${pos.color}">
                        <h3 class="text-white text-xs font-bold truncate w-full text-center">${u.name}</h3>
                        <p class="text-mono font-bold text-white mt-2">${u.point.toLocaleString()}</p>
                    </div>
                </div>`;
        }).join('');
        listContainer.innerHTML = rankingData.slice(3).map((u, i) => `
            <div class="flex items-center justify-between p-4 bg-[#111] border-l-2 border-white/5 hover:border-primary mb-2 group transition-all">
                <div class="flex items-center gap-4">
                    <span class="font-mono text-gray-500 w-8 text-center">${(i + 4).toString().padStart(2, '0')}</span>
                    <h4 class="text-white font-bold group-hover:text-primary">${u.name}</h4>
                </div>
                <div class="font-mono text-white">${u.point.toLocaleString()} <span class="text-gray-500 text-xs">PTS</span></div>
            </div>`).join('');
    } catch (err) { console.error("Ranking error:", err); }
}



let allPublications = [];
let currentOpenPubId = null;

async function buildPublications() {
    const container = document.getElementById('publications-grid');
    if (!container) return;

    try {
        const response = await fetch(`/api/publications`);
        allPublications = await response.json();
        renderPublications(allPublications);
        checkAdminForPublications();
    } catch (err) {
        console.error("Publications error:", err);
    }
}

function renderPublications(pubs) {
    const container = document.getElementById('publications-grid');
    if (!container) return;

    if (!Array.isArray(pubs) || pubs.length === 0) {
        container.innerHTML = '<p class="text-gray-500 font-mono text-sm col-span-full text-center py-10">NO INTELLIGENCE RECORDS FOUND.</p>';
        return;
    }

    // Category styling mappings
    const catStyles = {
        'WEB_DEV': 'text-blue-400 border-blue-400 bg-blue-400/5',
        'ALGORITHMS': 'text-yellow-400 border-yellow-400 bg-yellow-400/5',
        'AI_ML': 'text-pink-400 border-pink-400 bg-pink-400/5',
        'CTF_WRITEUP': 'text-purple-400 border-purple-400 bg-purple-400/5'
    };

    container.innerHTML = pubs.map(p => {
        const title = (p.title || '').replace(/"/g, '&quot;');
        const safeCat = p.category || 'RECORD';
        const style = catStyles[safeCat] || 'text-primary border-primary bg-primary/5';
        
        let dateStr = 'RECENT';
        if (p.createdAt) {
            const d = new Date(p.createdAt);
            dateStr = `${String(d.getDate()).padStart(2, '0')}.${d.toLocaleString('default', { month: 'short' }).toUpperCase()}.${d.getFullYear()}`;
        }
        
        const authorStr = p.originalAuthor || 'Unknown';
        const cyberwebTeam = ['ngo van quyen', 'le manh toan', 'xuan vu', 'van-quyen ngo'];
        const formatAuthor = (authors) => authors.split(',').map(a => {
            let t = a.trim();
            if (cyberwebTeam.some(m => t.toLowerCase().includes(m))) {
                return `<b class="text-[#8eff71]">${t}</b>`;
            }
            return t;
        }).join(', ');
        const displayAuthor = formatAuthor(authorStr);
        const initials = authorStr.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();

        return `
        <div onclick="openPublicationModal(this)" data-pub='${JSON.stringify(p).replace(/'/g, "&#39;")}' class="group bg-[#0a0a0a] border border-white/10 p-6 relative overflow-hidden hover:border-[#8eff71]/50 transition-all duration-300 cursor-pointer flex flex-col h-full">
            <div class="absolute top-0 left-[-100%] w-full h-[2px] bg-[#8eff71] group-hover:left-0 transition-all duration-500"></div>
            <div class="flex justify-between items-center mb-4">
                <span class="${style} font-mono text-[10px] tracking-widest uppercase border px-2 py-0.5">${safeCat}</span>
                <span class="text-gray-500 font-mono text-[10px] tracking-widest">${dateStr}</span>
            </div>
            <h3 class="text-white text-xl font-bold leading-tight mb-3 group-hover:text-[#8eff71] transition-colors">
                ${title}
            </h3>
            <p class="text-gray-400 text-sm mb-6 line-clamp-3">
                 Click to decrypt and read full briefing...
            </p>
            <div class="mt-auto flex items-end justify-between border-t border-white/5 pt-4 gap-4">
                <div class="flex items-start gap-2">
                    <div class="w-6 h-6 bg-[#222] rounded-full flex-shrink-0 flex items-center justify-center text-[10px] text-white font-bold border border-white/10 mt-0.5">${initials}</div>
                    <span class="text-gray-500 font-mono text-[10px] uppercase tracking-wider line-clamp-3 leading-tight">${displayAuthor}</span>
                </div>
                <span class="text-white font-mono text-[10px] uppercase tracking-widest group-hover:text-[#8eff71] flex items-center gap-1 transition-colors flex-shrink-0 mb-0.5">
                    DECRYPT <span class="material-symbols-outlined text-[12px]">arrow_forward</span>
                </span>
            </div>
        </div>`;
    }).join('');
}

function filterPublications(cat, btnElement) {
    // Update active button state
    document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('text-primary', 'border-primary');
        b.classList.add('text-gray-500', 'border-transparent');
    });
    btnElement.classList.remove('text-gray-500', 'border-transparent');
    btnElement.classList.add('text-primary', 'border-primary');

    if (cat === 'ALL') {
        renderPublications(allPublications);
    } else {
        const filtered = allPublications.filter(p => p.category === cat);
        renderPublications(filtered);
    }
}

function openPublicationModal(element) {
    const pub = JSON.parse(element.getAttribute('data-pub'));
    currentOpenPubId = pub.id;
    
    document.getElementById('modal-pub-title').innerText = pub.title || 'No Title';
    document.getElementById('modal-pub-author').innerText = pub.originalAuthor || 'Unknown';
    document.getElementById('modal-pub-category').innerText = pub.category || 'RECORD';
    
    const initials = (pub.originalAuthor || 'Un').split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
    document.getElementById('modal-pub-author-initials').innerText = initials;
    
    if (pub.createdAt) {
        const d = new Date(pub.createdAt);
        document.getElementById('modal-pub-date').innerText = `${String(d.getDate()).padStart(2, '0')}.${d.toLocaleString('default', { month: 'short' }).toUpperCase()}.${d.getFullYear()}`;
    }

    document.getElementById('modal-pub-content').innerHTML = pub.abstractText || "Classified or no abstract available.";

    const linkBtn = document.getElementById('modal-pub-link');
    const sessionStr = sessionStorage.getItem('cyber_user') || localStorage.getItem('cyber_user');
    
    if (pub.publicationUrl && pub.publicationUrl !== 'null' && pub.publicationUrl !== '') {
        if (!sessionStr) {
            linkBtn.href = "#";
            linkBtn.onclick = (e) => {
                e.preventDefault();
                closePublicationModal();
                document.getElementById('signup-modal').classList.remove('hidden');
                document.getElementById('signup-modal').classList.add('flex');
            };
        } else {
            linkBtn.onclick = null;
            linkBtn.href = pub.publicationUrl;
        }
        linkBtn.style.display = 'flex';
    } else {
        linkBtn.style.display = 'none';
        linkBtn.onclick = null;
    }

    const modal = document.getElementById('publication-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closePublicationModal() {
    const modal = document.getElementById('publication-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    currentOpenPubId = null;
}

function checkAdminForPublications() {
    let sessionStr = sessionStorage.getItem('cyber_user') || localStorage.getItem('cyber_user');
    if (sessionStr) {
        try {
            const user = JSON.parse(sessionStr);
            const r1 = String(user.role || '').replace(/\s+/g, '').toUpperCase();
            const r2 = String(user.roleEntity?.name || '').replace(/\s+/g, '').toUpperCase();
            
            if (r1 === 'ADMIN' || r1 === 'SUPERADMIN' || r1 === '1' || r1 === '2' || r2 === 'ADMIN' || r2 === 'SUPERADMIN') {
                document.getElementById('admin-actions-container').classList.remove('hidden');
                document.getElementById('btn-edit-pub').classList.remove('hidden');
                document.getElementById('btn-delete-pub').classList.remove('hidden');
            }
        } catch (e) { console.error('Parse chunk error', e) }
    }
}

function openPublicationForm(pubToEdit = null) {
    const formPanel = document.getElementById('publication-form-modal');
    const form = document.getElementById('publication-form');
    form.reset();

    if (pubToEdit) {
        document.getElementById('pub-form-title').innerText = 'Edit Publication';
        document.getElementById('pub-id').value = pubToEdit.id;
        document.getElementById('pub-title').value = pubToEdit.title || '';
        document.getElementById('pub-author').value = pubToEdit.originalAuthor || '';
        document.getElementById('pub-category').value = pubToEdit.category || 'WEB_DEV';
        document.getElementById('pub-url').value = pubToEdit.publicationUrl || '';
        document.getElementById('pub-date').value = pubToEdit.createdAt || '';
        document.getElementById('pub-content').value = pubToEdit.abstractText || '';
    } else {
        document.getElementById('pub-form-title').innerText = 'Create Publication';
        document.getElementById('pub-id').value = '';
    }

    formPanel.classList.remove('hidden');
    formPanel.classList.add('flex');
}

function closePublicationForm() {
    const formPanel = document.getElementById('publication-form-modal');
    formPanel.classList.add('hidden');
    formPanel.classList.remove('flex');
}

async function submitPublicationForm() {
    const id = document.getElementById('pub-id').value;
    const isEdit = !!id;
    
    let userId = 1; // Default
    let sessionStr = sessionStorage.getItem('cyber_user') || localStorage.getItem('cyber_user');
    if (sessionStr) {
        try {
            userId = JSON.parse(sessionStr).id || 1;
        } catch(e) {}
    }

    const pubData = {
        title: document.getElementById('pub-title').value,
        originalAuthor: document.getElementById('pub-author').value,
        category: document.getElementById('pub-category').value,
        publicationUrl: document.getElementById('pub-url').value,
        createdAt: document.getElementById('pub-date').value || null,
        abstractText: document.getElementById('pub-content').value,
        userId: userId
    };

    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/api/publications/${id}` : `/api/publications`;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pubData)
        });

        if (response.ok) {
            closePublicationForm();
            if (isEdit) closePublicationModal();
            buildPublications();
        } else {
            alert('Error saving publication');
        }
    } catch (err) {
        console.error('Error submitting form', err);
    }
}

function editCurrentPublication() {
    if (!currentOpenPubId) return;
    const pubToEdit = allPublications.find(p => p.id === currentOpenPubId);
    if (pubToEdit) {
        openPublicationForm(pubToEdit);
    }
}

async function deleteCurrentPublication() {
    if (!currentOpenPubId) return;
    
    // Instead of browser confirm, open custom modal
    document.getElementById('delete-confirm-modal').classList.remove('hidden');
}

function closeDeleteConfirmModal() {
    document.getElementById('delete-confirm-modal').classList.add('hidden');
}

async function executeDeleteRecord() {
    if (!currentOpenPubId) return;
    
    closeDeleteConfirmModal();
    try {
        const response = await fetch(`/api/publications/${currentOpenPubId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            closePublicationModal();
            buildPublications();
        } else {
            alert('Error deleting publication');
        }
    } catch (err) {
        console.error('Error deleting', err);
    }
}

function buildProjects() { }
function buildFaqAndPolicies() { }
function toggleFaq(index) {
    const ans = document.getElementById(`faq-answer-${index}`);
    const icon = document.getElementById(`faq-icon-${index}`);
    ans.classList.toggle('hidden');
    icon.textContent = ans.classList.contains('hidden') ? '+' : '-';
}
