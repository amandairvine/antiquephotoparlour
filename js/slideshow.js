// slideshow.js
document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.slide');
  const slideshow = document.querySelector('.slideshow');
  let currentSlide = 0;
  let slideInterval;
  let isTransitioning = false;

  // Only proceed if slides exist
  if (!slides.length) {
    console.log('No slides found, slideshow not initialized');
    return;
  }

  console.log(`Slideshow initialized with ${slides.length} slides`);

  // Auto-advance slides
  function nextSlide() {
    if (isTransitioning) return;
    
    isTransitioning = true;
    
    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    
    // Move to next slide (loop back to 0 if at end)
    currentSlide = (currentSlide + 1) % slides.length;
    
    // Add active class to new slide
    slides[currentSlide].classList.add('active');
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      isTransitioning = false;
    }, 500); // Adjust timing based on your CSS transition duration
  }

  // Start auto-slideshow
  function startSlideshow() {
    slideInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
  }

  // Stop auto-slideshow
  function stopSlideshow() {
    if (slideInterval) {
      clearInterval(slideInterval);
    }
  }

  // Pause on hover
  if (slideshow) {
    slideshow.addEventListener('mouseenter', stopSlideshow);
    slideshow.addEventListener('mouseleave', startSlideshow);
  }

  // Handle visibility change (pause when tab is not active)
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      stopSlideshow();
    } else {
      startSlideshow();
    }
  });

  // Start the slideshow
  startSlideshow();

  // Optional: Add keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight') {
      stopSlideshow();
      nextSlide();
      startSlideshow();
    } else if (e.key === 'ArrowLeft') {
      stopSlideshow();
      
      if (isTransitioning) return;
      isTransitioning = true;
      
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      
      setTimeout(() => {
        isTransitioning = false;
      }, 500);
      
      startSlideshow();
    }
  });

  // Optional: Add navigation dots
  function createNavigationDots() {
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slideshow-dots';
    
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = index === 0 ? 'dot active' : 'dot';
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      
      dot.addEventListener('click', () => {
        if (isTransitioning || index === currentSlide) return;
        
        stopSlideshow();
        isTransitioning = true;
        
        // Update dots
        document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        
        // Update slides
        slides[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        
        setTimeout(() => {
          isTransitioning = false;
        }, 500);
        
        startSlideshow();
      });
      
      dotsContainer.appendChild(dot);
    });
    
    // Insert dots after slideshow
    if (slideshow && slideshow.parentNode) {
      slideshow.parentNode.insertBefore(dotsContainer, slideshow.nextSibling);
      
      // Update dots when slide changes
      const originalNextSlide = nextSlide;
      nextSlide = function() {
        originalNextSlide();
        document.querySelectorAll('.dot').forEach((dot, index) => {
          dot.classList.toggle('active', index === currentSlide);
        });
      };
    }
  }

  // Uncomment the line below if you want navigation dots
  // createNavigationDots();
});