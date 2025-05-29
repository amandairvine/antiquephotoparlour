document.addEventListener('DOMContentLoaded', function() {
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
        
        // Load slideshow JavaScript after content is loaded
        const script = document.createElement('script');
        script.src = '../../js/slideshow.js';
        script.onload = function() {
          console.log('Slideshow script loaded successfully');
        };
        script.onerror = function() {
          console.error('Failed to load slideshow script');
        };
        document.head.appendChild(script);
      } else {
        console.error('Slideshow container not found');
      }
    })
    .catch(error => {
      console.error('Error loading slideshow:', error);
    });

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