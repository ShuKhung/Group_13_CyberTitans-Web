document.addEventListener('DOMContentLoaded', includeHTML);

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

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    const toastDot = document.getElementById('toast-dot');
    
    // Nếu chưa load kịp HTML thì dùng hộp thoại cảnh báo của trình duyệt
    if (!toast || !toastText) {
        alert(message);
        return;
    }
    
    // 1. Reset trạng thái mặc định, xoá hidden và thêm class show
    toast.className = 'fixed bottom-5 right-5 z-[9999] bg-[#111] px-6 py-4 flex items-center gap-4 transition-transform duration-300 border show';
    toastText.textContent = message;
    
    // 2. Gắn màu sắc theo loại thông báo (Thành công / Lỗi)
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