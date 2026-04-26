        const API_BASE_URL = 'http://localhost:3000/api';
        function showAlert(message, type = 'error') {
            hideAlerts();
            const alertElement = document.getElementById(type === 'success' ? 'successAlert' : 'errorAlert');
            alertElement.textContent = message;
            alertElement.style.display = 'block';
            if (type === 'success') {
                setTimeout(() => {
                    alertElement.style.display = 'none';
                }, 5000);
            }
        }
        function hideAlerts() {
            document.getElementById('successAlert').style.display = 'none';
            document.getElementById('errorAlert').style.display = 'none';
        }
        function showFieldError(fieldName, message) {
            const field = document.getElementById(fieldName);
            const errorElement = document.getElementById(fieldName + 'Error');
            field.classList.add('error');
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }

        function hideFieldErrors() {
            const fields = ['name', 'email', 'subject', 'message'];
            fields.forEach(fieldName => {
                const field = document.getElementById(fieldName);
                const errorElement = document.getElementById(fieldName + 'Error');
                field.classList.remove('error');
                errorElement.style.display = 'none';
            });
        }

        function showLoading() {
            document.getElementById('loading').style.display = 'flex';
            document.getElementById('submitBtn').disabled = true;
            document.getElementById('submitBtn').textContent = '전송 중...';
        }

        function hideLoading() {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('submitBtn').disabled = false;
            document.getElementById('submitBtn').textContent = '메시지 전송';
        }

        function validateForm(data) {
            const errors = [];
            hideFieldErrors();

            if (!data.name || data.name.trim().length < 2) {
                showFieldError('name', '이름은 2자 이상 입력해주세요.');
                errors.push('이름 오류');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!data.email || !emailRegex.test(data.email)) {
                showFieldError('email', '올바른 이메일 주소를 입력해주세요.');
                errors.push('이메일 오류');
            }

            if (!data.subject || data.subject.trim().length < 5) {
                showFieldError('subject', '제목은 5자 이상 입력해주세요.');
                errors.push('제목 오류');
            }

            if (!data.message || data.message.trim().length < 10) {
                showFieldError('message', '메시지는 10자 이상 입력해주세요.');
                errors.push('메시지 오류');
            }

            return errors.length === 0;
        }

        async function handleSubmit(event) {
            event.preventDefault();
            hideAlerts();

            const formData = new FormData(event.target);
            const data = {
                name: formData.get('name').trim(),
                email: formData.get('email').trim(),
                subject: formData.get('subject').trim(),
                message: formData.get('message').trim()
            };

            if (!validateForm(data)) {
                return;
            }

            try {
                showLoading();

                const response = await fetch(`${API_BASE_URL}/contact`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    showAlert(result.message, 'success');
                    event.target.reset();
                    hideFieldErrors();
                } else {
                    if (result.errors && Array.isArray(result.errors)) {
                        showAlert(result.errors.join(', '));
                    } else {
                        showAlert(result.message || '전송 중 오류가 발생했습니다.');
                    }
                }

            } catch (error) {
                console.error('전송 오류:', error);
                showAlert('네트워크 오류가 발생했습니다. 인터넷 연결을 확인하고 다시 시도해주세요.');
            } finally {
                hideLoading();
            }
        }

        document.addEventListener('DOMContentLoaded', function () {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            const animatedElements = document.querySelectorAll('.contact-item, .map-container');
            animatedElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s ease';
                observer.observe(el);
            });

            const formFields = document.querySelectorAll('.form-control');
            formFields.forEach(field => {
                field.addEventListener('focus', function () {
                    this.classList.remove('error');
                    const errorElement = document.getElementById(this.id + 'Error');
                    if (errorElement) {
                        errorElement.style.display = 'none';
                    }
                });
            });

            checkServerStatus();
        });

        async function checkServerStatus() {
            try {
                const response = await fetch(`${API_BASE_URL}/health`);
                if (!response.ok) {
                    console.warn('서버 연결 상태를 확인할 수 없습니다.');
                }
            } catch (error) {
                console.warn('서버에 연결할 수 없습니다:', error.message);
            }
        }