document.addEventListener('DOMContentLoaded', includeHTML);

function initializeApp() {
    console.log("[SYSTEM] Khởi động giao diện CyberTitans...");
    checkLoginState(); 
    
    if (typeof startCountdown === "function") startCountdown();
    buildRanking();
    buildTeam();
    buildProjects();
    buildPublications();
    buildFaqAndPolicies();

    const activePage = document.querySelector('.page.active');
    if (activePage && activePage.id === 'page-my-profile') {
        loadOperativeData();
    }
}