/**
 * profile-modal-enhanced.js
 * ─────────────────────────────────────────────────────────────────
 * Overrides the original openProfileModal() defined in profile.js
 * with an enhanced version that renders the "Member Profile" panel
 * matching the detailed design (avatar, social links, course labels,
 * terminal-style description).
 *
 * Loaded AFTER profile.js so it safely replaces the function reference.
 * No existing source files are modified.
 * ─────────────────────────────────────────────────────────────────
 */

/* ── SVG icons (inline, no external dependency) ───────────── */
const PM_ICON_LINKEDIN = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;
const PM_ICON_FACEBOOK = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`;

/* ── Terminal-style description renderer ──────────────────── */
function renderTerminalDescription(description) {
    if (!description || description.trim() === '') return '';

    // Check if description uses the "> key: value" format
    const hasTrigger = /^>\s*\w+[\w\s]*:/m.test(description);

    if (hasTrigger) {
        const lines = description.split('\n').filter(l => l.trim() !== '');
        const linesHTML = lines.map(line => {
            const match = line.match(/^(>\s*)([\w\s]+)(:)(.*)$/);
            if (match) {
                return `<span class="pm-terminal-line"><span class="pm-terminal-key">${match[1]}${match[2]}${match[3]}</span><span class="pm-terminal-value">${match[4]}</span></span>`;
            }
            return `<span class="pm-terminal-line">${line}</span>`;
        }).join('');

        return `
            <div class="pm-terminal">
                <div class="pm-terminal-body">${linesHTML}</div>
            </div>`;
    }

    // Plain text fallback
    return `
        <div class="pm-briefing-section">
            <p class="pm-briefing-label">Briefing Notes</p>
            <p class="pm-briefing-text">${description}</p>
        </div>`;
}

/* ── Experience items renderer ────────────────────────────── */
function renderExperiences(experiences) {
    if (!experiences || experiences.length === 0) {
        return `<p class="pm-empty">No classified records found.</p>`;
    }

    return experiences.map((exp, index) => {
        const isLast   = index === experiences.length - 1;
        const isActive = !exp.endDate || exp.endDate.toUpperCase() === 'PRESENT';
        const stateClass = isActive ? 'active' : 'past';

        let coursesHTML = '';
        if (exp.courseInfo) {
            const sep     = exp.courseInfo.includes(';') ? ';' : ',';
            const courses = exp.courseInfo.split(sep);
            const tags    = courses.map(c => {
                const text = c.includes('@#') ? c.split('@#')[0].trim() : c.trim();
                return isActive
                    ? `<span class="pm-tag-active">${text}</span>`
                    : `<span class="pm-tag-past">${text}</span>`;
            }).join('');

            const courseLabelText = isActive ? 'ACTIVE COURSES' : 'COMPLETED COURSES';
            coursesHTML = `
                <div class="pm-courses-block">
                    <p class="pm-courses-label">${courseLabelText}</p>
                    <div class="pm-courses-tags">${tags}</div>
                </div>`;
        }

        return `
            <div class="pm-exp-item ${stateClass}${isLast ? ' last' : ''}">
                <div class="pm-exp-dot"></div>
                <h3 class="pm-exp-org">${exp.organizationName}</h3>
                <p class="pm-exp-meta">
                    ${exp.positionTitle}
                    <span class="pm-exp-meta-sep">|</span>
                    ${exp.startDate} - ${exp.endDate || 'PRESENT'}
                </p>
                ${coursesHTML}
            </div>`;
    }).join('');
}

/* ── Social Links renderer ────────────────────────────────── */
function renderSocialLinks(user) {
    const links = [];

    if (user.linkedin) {
        links.push(`<a href="${user.linkedin}" target="_blank" rel="noopener" class="pm-social-link">
            ${PM_ICON_LINKEDIN} LINKEDIN
        </a>`);
    }
    if (user.facebook) {
        links.push(`<a href="${user.facebook}" target="_blank" rel="noopener" class="pm-social-link">
            ${PM_ICON_FACEBOOK} FACEBOOK
        </a>`);
    }

    return links.length > 0
        ? `<div class="pm-social-links">${links.join('')}</div>`
        : '';
}

/* ── Action buttons renderer ──────────────────────────────── */
function renderActionButtons(user, currentUser) {
    if (currentUser.id === user.id) {
        return `
            <button onclick="showPage('my-profile'); closeProfileModal();"
                    class="pm-btn pm-btn-ghost" style="margin-top:0.5rem">
                // EDIT MY TACTICAL DATA
            </button>`;
    }

    let html = `
        <button onclick="handleMentorRequest(${user.id}, '${user.name}')"
                class="pm-btn pm-btn-primary">
            MENTOR REQUEST (500 COINS)
        </button>
        <button class="pm-btn pm-btn-ghost">MESSAGE</button>`;

    const role = currentUser.role;
    if (role === 'ADMIN' || role === 'SUPER ADMIN') {
        html += `
            <button onclick="adminDeleteUser(${user.id})"
                    class="pm-btn pm-btn-danger">
                [ADMIN] TERMINATE OPERATIVE
            </button>`;
    }

    return html;
}

/* ── Main override ────────────────────────────────────────── */
async function openProfileModal(id) {
    const token = sessionStorage.getItem('cyber_token') || localStorage.getItem('cyber_token');
    const modal        = document.getElementById('profile-modal');
    const modalContent = document.getElementById('profile-modal-content');
    const modalBody    = document.getElementById('modal-body');

    if (!token) return showToast("Please log in to view profiles!", "error");

    modal.classList.remove('hidden');
    setTimeout(() => modalContent.classList.remove('translate-x-full'), 10);
    modalBody.innerHTML = `
        <p class="pm-empty" style="text-align:center;margin-top:5rem;animation:pulse 1.5s ease-in-out infinite;color:#8eff71">
            Establishing secure connection... Fetching operative data...
        </p>`;

    try {
        const response = await fetch(`${API_BASE_URL}/team/members/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Data access denied.");

        const user = await response.json();

        const savedUserStr = sessionStorage.getItem('cyber_user') || localStorage.getItem('cyber_user');
        const currentUser  = JSON.parse(savedUserStr);

        const defaultAvt = "https://ui-avatars.com/api/?background=222&color=fff&name=";
        const avatarUrl  = user.avatar || (defaultAvt + encodeURIComponent(user.name));

        const socialHTML      = renderSocialLinks(user);
        const actionBtnsHTML  = renderActionButtons(user, currentUser);
        const experiencesHTML = renderExperiences(user.experiences);
        const descHTML        = renderTerminalDescription(user.description);

        /* ── Briefing notes (plain text) always shown below terminal ── */
        const hasTrigger = user.description && /^>\s*\w+[\w\s]*:/m.test(user.description);
        const briefingHTML = (!hasTrigger && user.description) ? '' : (user.description ? '' : `
            <div class="pm-briefing-section">
                <p class="pm-briefing-label">Briefing Notes</p>
                <p class="pm-briefing-text">No additional logs found.</p>
            </div>`);

        modalBody.innerHTML = `
            <!-- Header: "Member Profile: Name" -->
            <div class="pm-header">
                <p class="pm-header-title">Member Profile: <span>${user.name || 'Unknown'}</span></p>
            </div>

            <!-- Two-column grid -->
            <div class="pm-grid" style="display:grid; grid-template-columns: 1fr 2fr; gap: 3rem; margin-top: 0.5rem;">

                <!-- ── Left Column ─────────── -->
                <div style="display:flex; flex-direction:column; gap:0;">

                    <!-- Avatar -->
                    <div class="pm-avatar-wrapper">
                        <img src="${avatarUrl}"
                             onerror="this.onerror=null; this.src='${defaultAvt + encodeURIComponent(user.name)}';"
                             alt="${user.name}" />
                    </div>

                    <!-- Social Links -->
                    ${socialHTML}

                    <!-- Action Buttons -->
                    <div class="pm-actions">
                        ${actionBtnsHTML}
                    </div>

                    <!-- Tactical Data -->
                    <div class="pm-tactical">
                        <h4 class="pm-tactical-heading">TACTICAL DATA</h4>
                        <div class="pm-tactical-item">
                            <p class="pm-tactical-label">PHONE</p>
                            <p class="pm-tactical-value">${user.phone || 'CLASSIFIED'}</p>
                        </div>
                        <div class="pm-tactical-item">
                            <p class="pm-tactical-label">ADDRESS</p>
                            <p class="pm-tactical-value">${user.address || 'UNKNOWN LOCATION'}</p>
                        </div>
                        <div class="pm-tactical-item">
                            <p class="pm-tactical-label">EMAIL</p>
                            <p class="pm-tactical-value">${user.email || 'ENCRYPTED'}</p>
                        </div>
                    </div>
                </div>

                <!-- ── Right Column ────────── -->
                <div>
                    <h2 class="pm-section-title">Experience</h2>
                    <div style="margin-bottom: 1rem;">
                        ${experiencesHTML}
                    </div>
                    ${descHTML}
                    ${briefingHTML}
                </div>
            </div>`;

    } catch (error) {
        modalBody.innerHTML = `<p class="pm-empty" style="color:#ef4444; text-align:center; margin-top:5rem;">CONNECTION TERMINATED. ${error.message}</p>`;
    }
}
