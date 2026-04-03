document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('events-grid-container');
    const filterBtns = document.querySelectorAll('.filter-btn');
    let allEvents = [];

    // Helper func to get color by type
    const getTypeColor = (type) => {
        const t = (type || '').toUpperCase();
        if (t === 'HACKATHON') return '#D4AF37'; // gold
        if (t === 'WORKSHOP') return '#60a5fa'; // blue
        if (t === 'CTF') return '#c084fc'; // purple
        if (t === 'SEMINAR') return '#4ade80'; // green
        return '#ffffff';
    };

    const renderEvents = (events) => {
        container.innerHTML = '';
        if (events.length === 0) {
            container.innerHTML = '<div class="col-span-full text-center text-on-surface-variant py-10 font-mono text-sm">No events found.</div>';
            return;
        }

        events.forEach(ev => {
            const color = getTypeColor(ev.eventType);
            const card = document.createElement('div');
            card.className = `bg-surface-container border border-white/5 hover:border-white/20 transition-all duration-300 p-6 flex flex-col group relative overflow-hidden`;
            
            card.innerHTML = `
                <div class="absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity" style="background-color: ${color}"></div>
                
                <div class="mb-4">
                    <span class="inline-block px-2 py-0.5 border text-[10px] font-mono tracking-widest uppercase mb-4" style="color: ${color}; border-color: ${color}40; background: ${color}10">
                        ${ev.eventType}
                    </span>
                    <h3 class="text-lg font-headline font-bold text-white mb-3 transition-colors leading-snug group-hover:text-shadow" style="--tw-text-opacity:1; caret-color: ${color};">${ev.title}</h3>
                    <p class="text-on-surface-variant text-xs leading-relaxed mb-6 flex-grow">${ev.description}</p>
                </div>
                
                <div class="mt-auto space-y-2 mb-6">
                    <div class="flex items-center gap-2 text-on-surface-variant text-xs font-mono">
                        <span class="material-symbols-outlined text-[14px]" style="color: ${color}">calendar_today</span>
                        <span>${ev.eventDate}</span>
                    </div>
                    <div class="flex items-center gap-2 text-on-surface-variant text-xs font-mono">
                        <span class="material-symbols-outlined text-[14px]" style="color: ${color}">location_on</span>
                        <span>${ev.location}</span>
                    </div>
                    <div class="flex items-center gap-2 text-on-surface-variant text-xs font-mono">
                        <span class="material-symbols-outlined text-[14px]" style="color: ${color}">group</span>
                        <span>Capacity: ${ev.capacity}</span>
                    </div>
                </div>
                
                <button class="w-full py-2.5 border border-white/20 text-white font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all mt-auto"
                    onmouseover="this.style.backgroundColor='${color}'; this.style.color='#000'; this.style.borderColor='transparent';"
                    onmouseout="this.style.backgroundColor='transparent'; this.style.color='#fff'; this.style.borderColor='rgba(255,255,255,0.2)';">
                    JOIN EVENT
                </button>
            `;
            container.appendChild(card);
        });
    };

    fetch('/api/v1/events')
        .then(response => response.json())
        .then(data => {
            allEvents = data;
            renderEvents(allEvents);
        })
        .catch(error => {
            console.error('Error fetching events:', error);
            container.innerHTML = '<div class="col-span-full text-center text-error py-10 font-mono text-sm">Failed to load events.</div>';
        });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('text-primary', 'border-b-2', 'border-primary');
                b.classList.add('hover:text-white', 'pb-2');
            });
            btn.classList.add('text-primary', 'border-b-2', 'border-primary');
            btn.classList.remove('hover:text-white', 'pb-2');
            btn.classList.add('pb-2'); // ensure pb-2 is there if it was removed

            const filter = btn.dataset.filter;
            if (filter === 'ALL') {
                renderEvents(allEvents);
            } else {
                const filtered = allEvents.filter(ev => (ev.eventType || '').toUpperCase() === filter);
                renderEvents(filtered);
            }
        });
    });
});
