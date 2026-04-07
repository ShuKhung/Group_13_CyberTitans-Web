document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    console.log("[SYSTEM] Starting CyberTitans...");
    checkLoginState();

    if (typeof startCountdown === "function") startCountdown();
    if (typeof buildRanking === "function") buildRanking();
    if (typeof buildTeam === "function") buildTeam();
    if (typeof buildProjects === "function") buildProjects();
    if (typeof buildPublications === "function") buildPublications();
    if (typeof buildFaqAndPolicies === "function") buildFaqAndPolicies();

    const activePage = document.querySelector('.page.active');
    if (activePage && activePage.id === 'page-my-profile' && typeof loadOperativeData === "function") {
        loadOperativeData();
    }
}

// --- GLOBAL TOAST SYSTEM ---
let toastTimeout;

function startCountdown() {
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    let d = parseInt(daysEl.innerText) || 0;
    let h = parseInt(hoursEl.innerText) || 0;
    let m = parseInt(minsEl.innerText) || 0;
    let s = parseInt(secsEl.innerText) || 0;

    let totalSeconds = (d * 86400) + (h * 3600) + (m * 60) + s;

    setInterval(() => {
        if (totalSeconds <= 0) return;
        totalSeconds--;

        let rem = totalSeconds;
        const newD = Math.floor(rem / 86400); rem %= 86400;
        const newH = Math.floor(rem / 3600); rem %= 3600;
        const newM = Math.floor(rem / 60); rem %= 60;
        const newS = rem;

        daysEl.innerText = newD.toString().padStart(2, '0');
        hoursEl.innerText = newH.toString().padStart(2, '0');
        minsEl.innerText = newM.toString().padStart(2, '0');
        secsEl.innerText = newS.toString().padStart(2, '0');
    }, 1000);
}


function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    const toastDot = document.getElementById('toast-dot');

    if (!toast || !toastText) {
        alert(message);
        return;
    }

    toast.className = 'fixed bottom-5 right-5 z-[9999] bg-[#111] px-6 py-4 flex items-center gap-4 transition-transform duration-300 border show';
    toastText.textContent = message;

    if (type === 'error') {
        toast.classList.add('border-red-500', 'shadow-[0_0_15px_rgba(239,68,68,0.3)]', 'text-red-500');
        if (toastDot) toastDot.className = 'w-2 h-2 rounded-full animate-pulse bg-red-500';
    } else {
        toast.classList.add('border-primary/50', 'shadow-[0_0_15px_rgba(129,255,105,0.2)]', 'text-primary');
        if (toastDot) toastDot.className = 'w-2 h-2 rounded-full animate-pulse bg-primary';
    }

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// --- CORE MODAL CONTROLS ---
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('hidden');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
}

function handleBackdropClick(event, modalId) {
    if (event.target.id === modalId) closeModal(modalId);
}

// --- NAVIGATION SWITCHES ---
function switchToLogin() {
    closeModal('signup-modal');
    closeModal('otp-modal');
    closeModal('recovery-request-modal');
    closeModal('recovery-reset-modal');
    openModal('login-modal');
}

function switchToSignUp() {
    closeModal('login-modal');
    openModal('signup-modal');
}

function closeSignUpModal() {
    closeModal('signup-modal');
}

function switchToRecovery() {
    closeModal('login-modal');
    openModal('recovery-request-modal');
}

function closeRecoveryModal() {
    closeModal('recovery-request-modal');
    closeModal('recovery-reset-modal');
}

// Biến lưu trữ timer để tránh việc gõ chữ chồng chéo khi mở nhanh nhiều modal
let typewriterTimer;

function handleServiceClick(element) {
    // 1. Lấy dữ liệu từ Card (Thymeleaf đổ vào)
    const title = element.getAttribute('data-title') || "";
    const fullContent = element.getAttribute('data-content') || "";
    const btnTextFromDB = element.getAttribute('data-button') || "INQUIRE PROTECTION";
    const linkUrl = element.getAttribute('data-link');

    // 2. Trỏ đến các Element trong Modal
    const modal = document.getElementById('service-modal');
    const titleEl = document.getElementById('modal-service-title');
    const bodyEl = document.getElementById('modal-service-body');
    const btnTextEl = document.getElementById('modal-service-btn-text');
    const btnEl = document.getElementById('modal-service-btn');

    if (!modal || !titleEl || !bodyEl) return;

    // 3. Hiển thị Modal và đổi chữ trên nút
    modal.classList.remove('hidden');
    titleEl.innerText = title;
    if (btnTextEl) btnTextEl.innerText = btnTextFromDB;

    // 4. XỬ LÝ CHUYỂN TRANG BẰNG LINK URL TỪ DATABASE
    if (btnEl) {
        btnEl.onclick = function () {
            if (btnTextFromDB.toUpperCase() === 'CLOSE') {
                closeModal('service-modal');
            } else if (linkUrl && linkUrl !== 'null' && linkUrl.trim() !== '') {
                showToast("REDIRECTING...", "success");
                setTimeout(() => {
                    window.location.href = linkUrl;
                }, 600);
            } else {
                showToast("Request Transmitted!", "success");
                closeModal('service-modal');
            }
        };
    }

    // 5. Hiệu ứng gõ chữ (Typewriter)
    bodyEl.innerHTML = "";
    clearTimeout(typewriterTimer);
    let i = 0;
    function type() {
        if (i < fullContent.length) {
            bodyEl.innerHTML += fullContent.charAt(i);
            i++;
            typewriterTimer = setTimeout(type, 15);
        }
    }
    type();
}

// Hàm đóng Modal
function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('hidden');
        // Nếu đóng service-modal thì dừng luôn hiệu ứng gõ chữ
        if (id === 'service-modal') clearTimeout(typewriterTimer);
    }
}

// Đóng khi click vào vùng tối bên ngoài modal
function handleBackdropClick(event, id) {
    if (event.target.id === id) {
        closeModal(id);
    }
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('mobile-menu-icon');
    if (!menu || !icon) return;

    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        icon.innerText = 'close';
    } else {
        menu.classList.add('hidden');
        icon.innerText = 'menu';
    }
}
