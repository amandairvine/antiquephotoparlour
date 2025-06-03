document.addEventListener('DOMContentLoaded', function () {
  console.log('Content loader started');

  // Load header
  fetch('../../header/header.html')
    .then(response => {
      console.log('Header response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      const headerContainer = document.getElementById('header-container');
      if (headerContainer) {
        headerContainer.innerHTML = html;
        console.log('Header loaded successfully');
      } else {
        console.error('Header container not found');
      }
    })
    .catch(error => {
      console.error('Error loading header:', error);
    });

  // Load slideshow
  fetch('../home/slideshow/slideshow.html')
    .then(response => {
      console.log('Slideshow response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      console.log('Slideshow HTML loaded, length:', html.length);
      const slideshowContainer = document.getElementById('slideshow-container');
      if (slideshowContainer) {
        slideshowContainer.innerHTML = html;
        console.log('Slideshow content inserted');

        // Wait for DOM to update, then initialize directly
        setTimeout(() => {
          const slides = document.querySelectorAll('.slide');
          console.log('Found slides:', slides.length);

          if (slides.length > 0) {
            initializeSlideshowDirectly();
          } else {
            console.error('No slides found after loading content');
          }
        }, 100);

      } else {
        console.error('Slideshow container not found');
      }
    })
    .catch(error => {
      console.error('Error loading slideshow:', error);
    });

  function initializeSlideshowDirectly() {
    const slides = document.querySelectorAll('.slide');
    const slideshow = document.querySelector('.slideshow');
    const prevButton = document.querySelector('.slideshow-nav-prev');
    const nextButton = document.querySelector('.slideshow-nav-next');
    const leftHoverZone = document.querySelector('.slideshow-hover-left');
    const rightHoverZone = document.querySelector('.slideshow-hover-right');

    let currentSlide = 0;
    let slideInterval;
    let isTransitioning = false;

    if (!slides.length) {
      console.log('No slides found, slideshow not initialized');
      return;
    }

    console.log(`Slideshow initialized with ${slides.length} slides`);

    function nextSlide() {
      if (isTransitioning) return;
      isTransitioning = true;
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
      console.log('Moved to slide:', currentSlide);
      setTimeout(() => { isTransitioning = false; }, 500);
    }

    function prevSlide() {
      if (isTransitioning) return;
      isTransitioning = true;
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      console.log('Moved to slide:', currentSlide);
      setTimeout(() => { isTransitioning = false; }, 500);
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

    // --- MODIFICATIONS START HERE ---

    // Control arrow visibility based on hovering over the *entire* slideshow
    if (slideshow && prevButton && nextButton) {
      slideshow.addEventListener('mouseenter', () => {
        prevButton.style.opacity = '1';
        prevButton.style.pointerEvents = 'auto';
        nextButton.style.opacity = '1';
        nextButton.style.pointerEvents = 'auto';
        stopSlideshow(); // Stop slideshow on hover
      });

      slideshow.addEventListener('mouseleave', () => {
        prevButton.style.opacity = '0';
        prevButton.style.pointerEvents = 'none';
        nextButton.style.opacity = '0';
        nextButton.style.pointerEvents = 'none';
        startSlideshow(); // Resume slideshow when mouse leaves
      });
    }

    // Left side click events (hover zone only for click now)
    if (leftHoverZone) {
      leftHoverZone.addEventListener('click', () => {
        stopSlideshow();
        prevSlide();
        startSlideshow();
      });
    }

    // Right side click events (hover zone only for click now)
    if (rightHoverZone) {
      rightHoverZone.addEventListener('click', () => {
        stopSlideshow();
        nextSlide();
        startSlideshow();
      });
    }

    // Button click events (these will still work when buttons are visible)
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

    // Handle visibility change
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopSlideshow();
      } else {
        startSlideshow();
      }
    });

    // Keyboard navigation
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

    // Start the slideshow initially
    startSlideshow();
  }

  // Updated slideshow loading with direct initialization
  function loadSlideshowWithDirectInit() {
    fetch('../home/slideshow/slideshow.html')
      .then(response => {
        console.log('Slideshow response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        console.log('Slideshow HTML loaded, length:', html.length);
        const slideshowContainer = document.getElementById('slideshow-container');
        if (slideshowContainer) {
          slideshowContainer.innerHTML = html;
          console.log('Slideshow content inserted');

          // Wait for DOM to update, then initialize directly
          setTimeout(() => {
            initializeSlideshowDirectly();
          }, 100);

        } else {
          console.error('Slideshow container not found');
        }
      })
      .catch(error => {
        console.error('Error loading slideshow:', error);
      });
  }

  // Load footer (includes info-panel and copyright)
  fetch('../../footer/footer.html')
    .then(response => {
      console.log('Footer response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      const footerContainer = document.getElementById('footer-container');
      if (footerContainer) {
        footerContainer.innerHTML = html;
        console.log('Footer loaded successfully');
      } else {
        console.error('Footer container not found');
      }
    })
    .catch(error => {
      console.error('Error loading footer:', error);
    });
});

// Initialize slideshow after DOM and content is loaded
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded, waiting for slideshow content...');

  function checkAndInitialize() {
    const slides = document.querySelectorAll('.slide');
    const slideshowContainer = document.getElementById('slideshow-container');

    if (slides.length > 0) {
      console.log('Slides found, initializing slideshow...');
      initializeSlideshowDirectly();
    } else if (slideshowContainer && slideshowContainer.innerHTML.trim() === '') {
      // Slideshow container exists but is empty, wait a bit more
      console.log('Slideshow container empty, waiting...');
      setTimeout(checkAndInitialize, 200);
    } else if (slideshowContainer) {
      // Container has content but no slides found yet, wait a bit more
      console.log('Slideshow container has content, checking for slides...');
      setTimeout(checkAndInitialize, 200);
    }
  }

  checkAndInitialize();
});
