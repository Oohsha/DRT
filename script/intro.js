    let currentSlide = 0;
    const slides = document.getElementById('slides');
    const dotsContainer = document.getElementById('dots');
    const totalSlides = slides.children.length;

    // 도트 생성
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      if (i === 0) dot.classList.add('active');
      dot.onclick = () => goToSlide(i);
      dotsContainer.appendChild(dot);
    }

    function moveSlide(direction) {
      currentSlide += direction;
      if (currentSlide >= totalSlides) currentSlide = 0;
      if (currentSlide < 0) currentSlide = totalSlides - 1;
      updateSlider();
    }

    function goToSlide(index) {
      currentSlide = index;
      updateSlider();
    }

    function updateSlider() {
      slides.style.transform = `translateX(-${currentSlide * 100}%)`;

      // 도트 업데이트
      document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    document.querySelectorAll('.intro-card, .stat-item').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.6s ease-out';
      observer.observe(el);
    });
