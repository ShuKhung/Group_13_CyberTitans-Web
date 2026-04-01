async function buildTeam() {
    const container = document.getElementById('team-grid-container');
    if (!container) return;
    try {
        const response = await fetch(`${API_BASE_URL}/team/members`);
        const teamData = await response.json();
        const defaultAvt = "https://ui-avatars.com/api/?background=random&color=fff&name=";
        container.innerHTML = teamData.map(m => `
            <div class="hack-card p-6 border transition-all duration-300">
                <div class="scanner"></div>
                <img src="${m.avatar || (defaultAvt + m.name)}" class="w-full aspect-square object-cover mb-4 grayscale hover:grayscale-0 transition-all"/>
                <div class="space-y-1">
                    <h4 class="text-white font-bold text-lg font-headline">${m.name}</h4>
                    <p class="text-primary font-mono text-xs uppercase tracking-widest">${m.role}</p>
                </div>
                <div class="mt-4 border-t border-white/10 pt-4 text-center">
                    <button onclick="openProfileModal(${m.id})" class="text-primary font-mono text-[10px] uppercase border border-primary/20 px-4 py-1 hover:bg-primary hover:text-black transition-all">VIEW PROFILE</button>
                </div>
            </div>`).join('');
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

document.addEventListener("DOMContentLoaded", function() {
    buildTeam();
    buildRanking();
    buildPublications(); 
});

async function buildPublications() {
    const container = document.getElementById('publications-grid');
    if (!container) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/publications`); 
        const publications = await response.json();
        
        container.innerHTML = publications.map(p => {
            const safeTitle = p.title ? p.title.replace(/'/g, "\\'") : '';
            const safeAuthors = p.authors ? p.authors.replace(/'/g, "\\'") : '';
            const safeAbstract = p.abstractText ? p.abstractText.replace(/'/g, "\\'") : '';
            const safeLink = p.publicationUrl ? p.publicationUrl.replace(/'/g, "\\'") : '';
            
            const publishDate = p.publishDate || 'RECENT';

            return `
            <div onclick="openPublicationModal('${safeTitle}', '${safeAuthors}', '${safeAbstract}', '${safeLink}')" class="group bg-[#0a0a0a] border border-white/10 p-6 relative overflow-hidden hover:border-primary/50 transition-all duration-300 cursor-pointer flex flex-col h-full">
                <div class="absolute top-0 left-[-100%] w-full h-[2px] bg-primary group-hover:left-0 transition-all duration-500"></div>
                <div class="flex justify-between items-center mb-4">
                    <span class="text-primary font-mono text-[10px] tracking-widest uppercase border border-primary/20 px-2 py-0.5 bg-primary/5">INTELLIGENCE</span>
                    <span class="text-gray-500 font-mono text-[10px] tracking-widest">${publishDate}</span>
                </div>
                <h3 class="text-white text-xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors">
                    ${p.title}
                </h3>
                <p class="text-gray-400 text-sm mb-6 line-clamp-3">
                    ${p.abstractText}
                </p>
                <div class="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                    <div class="flex items-center gap-2">
                        <span class="text-gray-500 font-mono text-[10px] uppercase tracking-wider">${p.authors}</span>
                    </div>
                    <span class="text-white font-mono text-[10px] uppercase tracking-widest group-hover:text-primary flex items-center gap-1 transition-colors">
                        DECRYPT <i class="fas fa-arrow-right"></i>
                    </span>
                </div>
            </div>`;
        }).join('');
    } catch (err) { 
        console.error("Publications error:", err); 
    }
}

function openPublicationModal(title, authors, abstract, link) {
    document.getElementById('modal-pub-title').innerText = title || 'No Title';
    document.getElementById('modal-pub-authors').innerText = authors || 'Unknown';
    document.getElementById('modal-pub-abstract').innerText = abstract || "Classified or no abstract available.";
    
    const linkBtn = document.getElementById('modal-pub-link');
    if (link && link !== 'null' && link !== '') {
        linkBtn.href = link;
        linkBtn.style.display = 'flex';
    } else {
        linkBtn.style.display = 'none';
    }

    const modal = document.getElementById('publication-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closePublicationModal() {
    const modal = document.getElementById('publication-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function buildProjects() {} 
function buildFaqAndPolicies() {} 
function toggleFaq(index) {
    const ans = document.getElementById(`faq-answer-${index}`);
    const icon = document.getElementById(`faq-icon-${index}`);
    ans.classList.toggle('hidden');
    icon.textContent = ans.classList.contains('hidden') ? '+' : '-';
}
