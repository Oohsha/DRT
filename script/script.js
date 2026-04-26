console.log("1. 자바스크립트 파일이 성공적으로 로드되었습니다!");

document.addEventListener('DOMContentLoaded', function () {

    console.log("2. HTML 문서 로딩이 완료되었습니다. 이제 버튼을 찾기 시작합니다.");

    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(10, 10, 10, 0.98)';
            } else {
                header.style.background = 'rgba(10, 10, 10, 0.95)';
            }
        });
    }

    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function () {
            const query = searchInput.value.trim();
            if (query) {
                console.log('검색어:', query);
            }
        });

        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }

    const API_BASE_URL = 'http://localhost:3000/api';

    const authModal = document.getElementById('auth-modal');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn'); // <-- 이 버튼을 찾습니다
    const closeModalBtn = document.getElementById('modal-close-btn');

    console.log("3. '회원가입' 버튼 요소를 찾습니다. 결과:", signupBtn);
    console.log("4. '로그인' 버튼 요소를 찾습니다. 결과:", loginBtn);


    const loginFormContainer = document.getElementById('login-form-container');
    const signupFormContainer = document.getElementById('signup-form-container');
    const showSignupLink = document.getElementById('show-signup-form');
    const showLoginLink = document.getElementById('show-login-form');

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    const loginAlert = document.getElementById('login-alert');
    const signupAlert = document.getElementById('signup-alert');

    const authLinks = document.getElementById('auth-links');
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout-btn');

    const openModal = (isLogin = true) => {
        if (authModal) authModal.style.display = 'flex';
        if (isLogin) {
            if (loginFormContainer) loginFormContainer.style.display = 'block';
            if (signupFormContainer) signupFormContainer.style.display = 'none';
        } else {
            if (loginFormContainer) loginFormContainer.style.display = 'none';
            if (signupFormContainer) signupFormContainer.style.display = 'block';
        }
    };
    const closeModal = () => { if (authModal) authModal.style.display = 'none'; };

    if (loginBtn) loginBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(true); });
    if (signupBtn) signupBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(false); });
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (showSignupLink) showSignupLink.addEventListener('click', () => openModal(false));
    if (showLoginLink) showLoginLink.addEventListener('click', () => openModal(true));

    const showAlert = (alertEl, message) => {
        if (alertEl) {
            alertEl.textContent = message;
            alertEl.style.display = 'block';
        }
    };
    const hideAlerts = () => {
        if (loginAlert) loginAlert.style.display = 'none';
        if (signupAlert) signupAlert.style.display = 'none';
    };

    const updateHeaderUI = () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (token && user) {
            if (authLinks) authLinks.style.display = 'none';
            if (userInfo) userInfo.style.display = 'flex';
            if (usernameDisplay) usernameDisplay.textContent = `${user.username}님`;
        } else {
            if (authLinks) authLinks.style.display = 'flex';
            if (userInfo) userInfo.style.display = 'none';
        }
    };

    if (signupForm) {
        console.log("A: 회원가입 폼(signup-form)을 찾았습니다.");

        signupForm.addEventListener('submit', async (e) => {
            console.log("B: 'submit' 이벤트가 감지되었습니다!");
            e.preventDefault();
            hideAlerts();

            const usernameInput = document.getElementById('signup-username');
            const emailInput = document.getElementById('signup-email');
            const passwordInput = document.getElementById('signup-password');

            const username = usernameInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;

            console.log("C: 폼 데이터를 가져왔습니다:", { username, email, password });

            try {
                const response = await fetch(`${API_BASE_URL}/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password }),
                });

                console.log("D: 백엔드로부터 응답을 받았습니다. 상태:", response.status);

                const data = await response.json();
                if (data.success) {
                    alert(data.message);
                    openModal(true);
                    if (loginForm) loginForm.reset();
                    if (signupForm) signupForm.reset();
                } else {
                    showAlert(signupAlert, data.message || '회원가입에 실패했습니다.');
                }
            } catch (err) {
                console.error("Fetch 에러 발생:", err);
                showAlert(signupAlert, '서버에 연결할 수 없거나 응답 처리 중 오류가 발생했습니다.');
            }
        });
    } else {
        console.error("회원가입 폼(signup-form)을 찾지 못했습니다! HTML의 id를 확인해주세요.");
    }

    // ... (if (loginForm) { ... } 이후 코드는 동일) ...

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideAlerts();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            try {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const data = await response.json();
                if (data.success) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    updateHeaderUI();
                    closeModal();
                } else {
                    showAlert(loginAlert, data.message || '로그인에 실패했습니다.');
                }
            } catch (err) {
                showAlert(loginAlert, '서버에 연결할 수 없습니다.');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            updateHeaderUI();
        });
    }

    updateHeaderUI();
});

// 소셜 링크 클릭 시 새 탭에서 열기
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        // 실제 소셜 미디어 URL로 변경 필요
        console.log('소셜 미디어 링크 클릭:', this.getAttribute('aria-label'));
    });
});

// 스크롤 시 footer 애니메이션
const footer = document.querySelector('footer');
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const footerObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

if (footer) {
    footer.style.opacity = '0';
    footer.style.transform = 'translateY(30px)';
    footer.style.transition = 'all 0.8s ease';
    footerObserver.observe(footer);
}

document.getElementById("hamburger").addEventListener("click", () => {
  document.querySelector("nav ul").classList.toggle("show");
});

