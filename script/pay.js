document.getElementById('paymentForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim() && field.type !== 'checkbox') {
                    field.style.borderColor = '#ff4757';
                    isValid = false;
                } else if (field.type === 'checkbox' && !field.checked) {
                    isValid = false;
                } else {
                    field.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }
            });
            
            if (!isValid) {
                alert('필수 항목을 모두 입력해주세요.');
                return;
            }

            const submitBtn = document.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = '결제 처리 중...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('결제가 완료되었습니다!\n주문번호: DRT' + Date.now());
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });

        function formatPhoneNumber(input) {
            let value = input.value.replace(/\D/g, '');
            if (value.length >= 11) {
                value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            } else if (value.length >= 7) {
                value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
            } else if (value.length >= 4) {
                value = value.replace(/(\d{3})(\d+)/, '$1-$2');
            }
            input.value = value;
        }
        
        document.getElementById('orderPhone').addEventListener('input', function() {
            formatPhoneNumber(this);
        });
        
        document.getElementById('recipientPhone').addEventListener('input', function() {
            formatPhoneNumber(this);
        });

        document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
            radio.addEventListener('change', function() {
                console.log('선택된 결제 방법:', this.value);
            });
        });