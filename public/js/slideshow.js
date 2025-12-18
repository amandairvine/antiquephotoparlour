export function initializeSlideshowDirectly() {
  const slides = document.querySelectorAll('.slide');
  const slideshow = document.querySelector('.slideshow');
  const prevButton = document.querySelector('.slideshow-nav-prev');
  const nextButton = document.querySelector('.slideshow-nav-next');
  const leftHoverZone = document.querySelector('.slideshow-hover-left');
  const rightHoverZone = document.querySelector('.slideshow-hover-right');

  let currentSlide = 0;
  let slideInterval;
  let isTransitioning = false;
  let touchStartX = 0;
  let touchEndX = 0;

  if (!slides.length) {
    console.log('❌ No slides found, slideshow not initialized');
    return;
  }

  if (slideshow) {
    slideshow.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    slideshow.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleGesture();
    }, {passive: true});
  }

  console.log(`🎬 Slideshow initialized with ${slides.length} slides`);

  slides.forEach(slide => {
    const computedStyle = window.getComputedStyle(slide);
    const backgroundImage = computedStyle.backgroundImage;
    if (backgroundImage && backgroundImage !== 'none') {
      slide.style.setProperty('--slide-bg-image', backgroundImage);
      slide.style.backgroundImage = '';

      const img = new Image();
      img.onload = function () {
        if (this.width > this.height) {
          slide.classList.add('landscape');
        } else {
          slide.classList.add('portrait');
        }
      };

      const urlMatch = backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
      if (urlMatch) {
        img.src = urlMatch[1];
      }
    }
  });

  function handleGesture() {
    const swipeThreshold = 50;
    const deltaX = touchEndX - touchStartX;

    if (Math.abs(deltaX) > swipeThreshold) {
      stopSlideshow();
      if (deltaX > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
      startSlideshow();
    }
  }

  function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
    setTimeout(() => {
      isTransitioning = false;
    }, 1000);
  }

  function prevSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    setTimeout(() => {
      isTransitioning = false;
    }, 1000);
  }

  function startSlideshow() {
    stopSlideshow();
    slideInterval = setInterval(nextSlide, 4000);
  }

  function stopSlideshow() {
    if (slideInterval) {
      clearInterval(slideInterval);
    }
  }

  if (slideshow && prevButton && nextButton) {
    slideshow.addEventListener('mouseenter', () => {
      prevButton.style.opacity = '1';
      prevButton.style.pointerEvents = 'auto';
      nextButton.style.opacity = '1';
      nextButton.style.pointerEvents = 'auto';
      stopSlideshow();
    });

    slideshow.addEventListener('mouseleave', () => {
      prevButton.style.opacity = '0';
      prevButton.style.pointerEvents = 'none';
      nextButton.style.opacity = '0';
      nextButton.style.pointerEvents = 'none';
      startSlideshow();
    });
  }

  if (leftHoverZone) {
    leftHoverZone.addEventListener('click', () => {
      stopSlideshow();
      prevSlide();
      startSlideshow();
    });
  }

  if (rightHoverZone) {
    rightHoverZone.addEventListener('click', () => {
      stopSlideshow();
      nextSlide();
      startSlideshow();
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', (e) => {
      e.stopPropagation();
      stopSlideshow();
      prevSlide();
      startSlideshow();
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', (e) => {
      e.stopPropagation();
      stopSlideshow();
      nextSlide();
      startSlideshow();
    });
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      stopSlideshow();
    } else {
      startSlideshow();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      stopSlideshow();
      nextSlide();
      startSlideshow();
    } else if (e.key === 'ArrowLeft') {
      stopSlideshow();
      prevSlide();
      startSlideshow();
    }
  });

  startSlideshow();
}