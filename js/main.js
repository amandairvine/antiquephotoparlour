// Slideshow:

let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

showSlide(currentSlide);

setInterval(nextSlide, 5000);

// Curtains:

document.addEventListener('DOMContentLoaded', () => {
  const curtainContainer = document.getElementById('curtainEffect');

  if (curtainContainer) {
      // Add 'open' class on mouse enter
      curtainContainer.addEventListener('mouseenter', () => {
          curtainContainer.classList.add('open');
      });

      // Remove 'open' class on mouse leave
      curtainContainer.addEventListener('mouseleave', () => {
          curtainContainer.classList.remove('open');
      });

      // Optional: Add focus/blur for keyboard accessibility
      curtainContainer.setAttribute('tabindex', '0'); // Make it focusable

      curtainContainer.addEventListener('focus', () => {
          curtainContainer.classList.add('open');
      });

      curtainContainer.addEventListener('blur', () => {
           curtainContainer.classList.remove('open');
      });
  } else {
      console.error("Element with ID 'curtainEffect' not found.");
  }
});
