const protocols = [
    { title: 'Member Conduct', desc: 'All members must provide accurate information, treat others with respect, and use the platform only for legitimate club learning activities.' },
    { title: 'Data Security', desc: 'All member data is securely stored. Passwords are hashed using BCrypt. Authentication uses zero-trust JWT token controls.' },
    { title: 'Account Termination', desc: 'Administrators reserve the right to suspend any account that violates terms, engages in misconduct, or is inactive without notice.' },
    { title: 'Portfolio & Data', desc: 'Portfolio data is generated from verified system records. All project contributions and CTF results are validated by administrators.' }
];

const faqs = [
    { q: 'What is CyberTitans?', a: 'CyberTitans is an elite cybersecurity club and professional network connecting cryptographers, engineers, and digital architects to learn and grow together.' },
    { q: 'How do I join the club?', a: 'Click "Join" in the navigation, create a Recruit account with your basic details, and complete your profile for admin verification.' },
    { q: 'What is the Operative tier?', a: 'Operative members get enhanced privileges including access to private repositories, CTF practice labs, and internal mentorship channels.' },
    { q: 'Can I request a mentor?', a: 'Yes. Authorized members (Operative and Master tiers) can use Cyber Coins to submit 1-on-1 mentor guidance requests.' },
    { q: 'How is member data protected?', a: 'All data is end-to-end encrypted. We never share or sell personal information to any third parties whatsoever.' },
    { q: 'What is the Master tier for?', a: 'The Master tier grants ultimate system access, Gold-level advisory tools, and deep-net clearance for top-tier members.' },
    { q: 'Are events available online?', a: 'Yes. All of our technical workshops and training sessions are recorded and streamed for our Operative members to review.' }
];

function initKnowledgeBase() {
    const policyContainer = document.getElementById('policy-container');
    const faqList = document.getElementById('faq-list');

    if (!policyContainer || !faqList) {
        setTimeout(initKnowledgeBase, 100);
        return;
    }

    policyContainer.innerHTML = protocols.map(p => `
    <div class="hack-card p-6">
      <div class="scanner"></div>
      <h3 class="font-headline font-bold text-lg text-primary mb-2 uppercase tracking-wider">${p.title}</h3>
      <p class="text-on-surface-variant text-sm font-body leading-relaxed">${p.desc}</p>
    </div>
  `).join('');


    faqList.innerHTML = faqs.map((item, i) => `
    <div class="faq-item bg-surface-container-low border border-outline-variant/10 overflow-hidden mb-2" id="faq-item-${i}">
      <button onclick="toggleFaq(${i})" class="w-full flex items-center justify-between px-6 py-5 text-left group hover:bg-surface-container-high transition-colors">
        <h3 class="font-headline font-bold text-base transition-colors uppercase tracking-tight group-hover:text-primary">${item.q}</h3>
        <span id="faq-icon-${i}" class="material-symbols-outlined text-on-surface-variant faq-icon">add</span>
      </button>
      <div id="faq-answer-${i}" class="faq-answer">
        <div class="px-6 pb-6 pt-2 text-on-surface-variant text-sm leading-relaxed border-t border-outline-variant/10 font-body">${item.a}</div>
      </div>
    </div>
  `).join('');
}

function toggleFaq(i) {
    const item = document.getElementById(`faq-item-${i}`);
    const ans = document.getElementById(`faq-answer-${i}`);
    const icon = document.getElementById(`faq-icon-${i}`);

    const isOpen = ans.classList.contains('open');

    document.querySelectorAll('.faq-answer').forEach(el => el.classList.remove('open'));
    document.querySelectorAll('.faq-item').forEach(el => {
        el.classList.remove('active');
        el.style.borderColor = 'rgba(72, 72, 71, 0.1)';
    });
    document.querySelectorAll('.faq-icon').forEach(el => el.textContent = 'add');

    if (!isOpen) {
        ans.classList.add('open');
        item.classList.add('active');
        item.style.borderColor = '#8eff71';
        icon.textContent = 'remove';
    }
}


document.addEventListener('DOMContentLoaded', initKnowledgeBase);