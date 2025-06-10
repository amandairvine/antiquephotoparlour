// document.addEventListener('DOMContentLoaded', function () {
//   const slides = document.querySelectorAll('.slide');
//   const slideshow = document.querySelector('.slideshow');
//   let currentSlide = 0;
//   let slideInterval;
//   let isTransitioning = false;

//   // Only proceed if slides exist
//   if (!slides.length) {
//     console.log('No slides found, slideshow not initialized');
//     return;
//   }

//   console.log(`Slideshow initialized with ${slides.length} slides`);

//   // Function to go to previous slide
//   function prevSlide() {
//     if (isTransitioning) return;

//     stopSlideshow();
//     isTransitioning = true;

//     slides[currentSlide].classList.remove('active');
//     currentSlide = (currentSlide - 1 + slides.length) % slides.length;
//     slides[currentSlide].classList.add('active');

//     setTimeout(() => {
//       isTransitioning = false;
//     }, 500);

//     startSlideshow();
//   }


//   // Auto-advance slides
//   function nextSlide() {
//     if (isTransitioning) return;

//     isTransitioning = true;

//     // Remove active class from current slide
//     slides[currentSlide].classList.remove('active');

//     // Move to next slide (loop back to 0 if at end)
//     currentSlide = (currentSlide + 1) % slides.length;

//     // Add active class to new slide
//     slides[currentSlide].classList.add('active');

//     // Reset transition flag after animation completes
//     setTimeout(() => {
//       isTransitioning = false;
//     }, 500); // Adjust timing based on your CSS transition duration
//   }

//   // Start auto-slideshow
//   function startSlideshow() {
//     slideInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
//   }

//   // Stop auto-slideshow
//   function stopSlideshow() {
//     if (slideInterval) {
//       clearInterval(slideInterval);
//     }
//   }

//   // Pause on hover
//   if (slideshow) {
//     slideshow.addEventListener('mouseenter', stopSlideshow);
//     slideshow.addEventListener('mouseleave', startSlideshow);
//   }

//   // Handle visibility change (pause when tab is not active)
//   document.addEventListener('visibilitychange', function () {
//     if (document.hidden) {
//       stopSlideshow();
//     } else {
//       startSlideshow();
//     }
//   });

//   // Start the slideshow
//   startSlideshow();

//   // Optional: Add keyboard navigation
//   document.addEventListener('keydown', function (e) {
//     if (e.key === 'ArrowRight') {
//       stopSlideshow();
//       nextSlide();
//       startSlideshow();
//     } else if (e.key === 'ArrowLeft') {
//       stopSlideshow();

//       if (isTransitioning) return;
//       isTransitioning = true;

//       slides[currentSlide].classList.remove('active');
//       currentSlide = (currentSlide - 1 + slides.length) % slides.length;
//       slides[currentSlide].classList.add('active');

//       setTimeout(() => {
//         isTransitioning = false;
//       }, 500);

//       startSlideshow();
//     }
//   });

//   // Navigation button functionality
//   const prevButton = document.querySelector('.slideshow-nav-prev');
//   const nextButton = document.querySelector('.slideshow-nav-next');
//   const leftHoverZone = document.querySelector('.slideshow-hover-left');
//   const rightHoverZone = document.querySelector('.slideshow-hover-right');

//   // Function to go to previous slide
//   function prevSlide() {
//     if (isTransitioning) return;

//     stopSlideshow();
//     isTransitioning = true;

//     slides[currentSlide].classList.remove('active');
//     currentSlide = (currentSlide - 1 + slides.length) % slides.length;
//     slides[currentSlide].classList.add('active');

//     setTimeout(() => {
//       isTransitioning = false;
//     }, 500);

//     startSlideshow();
//   }

//   // Function to go to next slide manually
//   function manualNextSlide() {
//     if (isTransitioning) return;

//     stopSlideshow();
//     nextSlide();
//     startSlideshow();
//   }

//   // Add click effect helper function
//   function addClickEffect(button) {
//     button.classList.add('clicking');
//     setTimeout(() => {
//       button.classList.remove('clicking');
//     }, 150);
//   }

//   // Add click handlers for navigation buttons with click effects
//   if (prevButton) {
//     prevButton.addEventListener('click', (e) => {
//       addClickEffect(prevButton);
//       prevSlide();
//     });

//     prevButton.addEventListener('mousedown', () => {
//       addClickEffect(prevButton);
//     });
//   }

//   if (nextButton) {
//     nextButton.addEventListener('click', (e) => {
//       addClickEffect(nextButton);
//       manualNextSlide();
//     });

//     nextButton.addEventListener('mousedown', () => {
//       addClickEffect(nextButton);
//     });
//   }

//   // Add hover effects for showing/hiding buttons
//   if (leftHoverZone && prevButton) {
//     leftHoverZone.addEventListener('mouseenter', () => {
//       prevButton.style.opacity = '1';
//       prevButton.style.pointerEvents = 'auto';
//     });

//     leftHoverZone.addEventListener('mouseleave', () => {
//       prevButton.style.opacity = '0';
//       prevButton.style.pointerEvents = 'none';
//     });
//   }

//   if (rightHoverZone && nextButton) {
//     rightHoverZone.addEventListener('mouseenter', () => {
//       nextButton.style.opacity = '1';
//       nextButton.style.pointerEvents = 'auto';
//     });

//     rightHoverZone.addEventListener('mouseleave', () => {
//       nextButton.style.opacity = '0';
//       nextButton.style.pointerEvents = 'none';
//     });
//   }

// });