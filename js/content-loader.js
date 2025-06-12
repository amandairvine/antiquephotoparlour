// content-loader.js

document.addEventListener('DOMContentLoaded', function () {
  console.log('Content loader started');

  // Load Header
  fetch('../../header/header.html')
    .then(response => {
      console.log('Header response status:', response.status);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.text();
    })
    .then(html => {
      const headerContainer = document.getElementById('header-container');
      if (headerContainer) {
        headerContainer.innerHTML = html;
        console.log("Header content loaded into #header-container.");

        // 1. Call adaptNavItems to place items correctly based on initial screen size
        if (typeof adaptNavItems === 'function') {
          adaptNavItems();
          console.log("adaptNavItems called after header content loaded (initial item placement).");
        } else {
          console.error("Error: adaptNavItems function not found.");
        }

        // 2. Call setupNavbarListeners to attach click events to the new DOM elements
        if (typeof setupNavbarListeners === 'function') {
          setupNavbarListeners();
          console.log("setupNavbarListeners called to attach click events.");
        } else {
          console.error("Error: setupNavbarListeners function not found.");
        }

      } else {
        console.warn("#header-container not found in the DOM.");
      }
    })
    .catch(error => console.error('Error loading header content:', error));


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

  // Load footer
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

  // --- Slideshow Initialization ---
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
    let touchStartX = 0;
    let touchEndX = 0;

    if (!slides.length) {
      console.log('No slides found, slideshow not initialized');
      return;
    }

    console.log(`Slideshow initialized with ${slides.length} slides`);

    // Convert inline background-image styles and detect orientation
    slides.forEach(slide => {
      const computedStyle = window.getComputedStyle(slide);
      const backgroundImage = computedStyle.backgroundImage;
      if (backgroundImage && backgroundImage !== 'none') {
        slide.style.setProperty('--slide-bg-image', backgroundImage);
        slide.style.backgroundImage = '';

        // Create a temporary image to detect orientation
        const img = new Image();
        img.onload = function () {
          if (this.width > this.height) {
            slide.classList.add('landscape');
            console.log('Added landscape class to slide');
          } else {
            slide.classList.add('portrait');
            console.log('Added portrait class to slide');
          }
        };

        // Extract URL from the background-image string
        const urlMatch = backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
        if (urlMatch) {
          img.src = urlMatch[1];
        }

        console.log(`Set --slide-bg-image for slide:`, backgroundImage);
      }

      slideshow.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      });

      slideshow.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleGesture();
      });

      function handleGesture() {
        const swipeThreshold = 50; 
        const deltaX = touchEndX - touchStartX;

        if (Math.abs(deltaX) > swipeThreshold) {
          stopSlideshow();
          if (deltaX > 0) {
            prevSlide(); // Swipe right
          } else {
            nextSlide(); // Swipe left
          }
          startSlideshow();
        }
      }
    });

    function nextSlide() {
      if (isTransitioning) return;
      isTransitioning = true;
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
      setTimeout(() => { isTransitioning = false; }, 2000);
    }

    function prevSlide() {
      if (isTransitioning) return;
      isTransitioning = true;
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      setTimeout(() => { isTransitioning = false; }, 500);
    }

    // function startSlideshow() {
    //   stopSlideshow();
    //   slideInterval = setInterval(nextSlide, 4000);
    // }

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
});