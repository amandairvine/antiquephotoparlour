import("./modal-gallery.js").then(({ handleUrlHash }) => {
  console.log("✅ modal-gallery.js loaded and ready.");
  // Check the initial hash and handle it
  if (window.location.hash.startsWith("#themes/")) {
    handleUrlHash();
  }
});

document.addEventListener('DOMContentLoaded', function () {
  console.log('Content loader started');

  let currentPage = 'home';
  let originalHomContent = null;

  const routes = {
    'services': '/pages/services/services.html',
    'pricing': '/pages/pricing/pricing.html',
    'themes': '/pages/themes/themes.html',
    'frames': '/pages/frames/frames.html',
    'faq': '/pages/frequently-asked-questions/frequently-asked-questions.html',
    'contact': '/pages/contact/contact.html'
  };

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

        setupPageNavigation();

        if (typeof adaptNavItems === 'function') {
          adaptNavItems();
          console.log("adaptNavItems called after header content loaded (initial item placement).");
        } else {
          console.error("Error: adaptNavItems function not found.");
        }

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

  function setupPageNavigation() {
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (href && href.startsWith('../') && !href.includes('facebook') && !href.includes('instagram')) {
        e.preventDefault();
        const pageName = extractPageName(href);
        if (pageName) {
          loadPage(pageName);
        }
      }
    });

    window.addEventListener('popstate', function (e) {
      if (e.state && e.state.page) {
        loadPage(e.state.page, false);
      } else {
        loadPage('home', false);
      }
    });
  }

  function extractPageName(href) {
    if (href.includes('services')) return 'services';
    if (href.includes('pricing')) return 'pricing';
    if (href.includes('themes')) return 'themes';
    if (href.includes('frames')) return 'frames';
    if (href.includes('frequently-asked-questions')) return 'faq';
    if (href.includes('contact')) return 'contact';
    if (href.includes('home')) return 'home';
    return null;
  }

  function loadPageCSS(pageName) {
    const existingPageCSS = document.querySelector('link[id^="page-css-"]');
    if (existingPageCSS) {
      existingPageCSS.remove();
    }
    const cssPath = `/css/pages/${pageName}.css`;
    if (pageName === 'home') {
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssPath;
    link.id = `page-css-${pageName}`;
    link.onerror = () => {
      console.warn(`⚠️ No CSS file found for ${pageName} page (${cssPath})`);
    };
    document.head.appendChild(link);
    console.log(`✅ Loading CSS for ${pageName} page: ${cssPath}`);
  }

  async function loadPage(pageName, updateHistory = true) {
    console.log(`Loading page: ${pageName}`);
    const contentContainer = document.querySelector('.content');
    const slideshowContainer = document.getElementById('slideshow-container');

    if (!contentContainer) {
      console.error('Content container not found');
      return;
    }

    loadPageCSS(pageName);

    if (pageName === 'home') {
      console.log('Fetching slideshow HTML for the home page...');
      const slideshowResponse = await fetch('/pages/slideshow/slideshow.html');
      const slideshowHtml = await slideshowResponse.text();

      if (slideshowContainer) {
        slideshowContainer.innerHTML = slideshowHtml;
        console.log('✅ Slideshow HTML injected into container.');

        // Now that the slideshow HTML is in the DOM, call the initializer
        setTimeout(() => {
          console.log('Attempting to initialize slideshow...');
          initializeSlideshowDirectly();
        }, 100);
      } else {
        console.error('Slideshow container (#slideshow-container) not found in index.html');
      }

      currentPage = 'home';
      if (updateHistory) {
        history.pushState({ page: 'home' }, 'Home - Antique Photo Parlour', '/');
      }
      return;
    }

    const route = routes[pageName];
    if (!route) {
      console.error('Route not found for page:', pageName);
      return;
    }

    try {
      contentContainer.innerHTML = '<div class="loading">Loading...</div>';

      const response = await fetch(route);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const contentClassName = `${pageName}-container`;
      const pageContentToInject = doc.querySelector(`.${contentClassName}`);

      if (pageContentToInject) {
        contentContainer.innerHTML = pageContentToInject.outerHTML;
        currentPage = pageName;
        console.log(`Page ${pageName} loaded successfully`);

        if (updateHistory) {
          const pageTitle = getPageTitle(pageName);

          history.pushState({ page: pageName }, pageTitle, `#${pageName}`);
          document.title = pageTitle;
        }

        // *** CRITICAL ADDITION HERE ***
        // Check if the loaded page is 'services' and then load/re-initialize its script
        if (pageName === 'services') {
          // Remove any old services.js script if it was appended previously
          const oldScript = document.getElementById('services-script');
          if (oldScript) {
            oldScript.remove();
          }

          const script = document.createElement('script');
          script.src = '../../js/services.js';
          script.id = 'services-script'; // Give it an ID to easily remove later
          script.onload = () => {
            console.log('services.js loaded dynamically. Calling initializeServicesPage...');
            // This is where you call the function defined in services.js
            if (typeof initializeServicesPage === 'function') {
              initializeServicesPage();
            } else {
              console.error("Error: initializeServicesPage function not found after script load.");
            }
          };
          document.body.appendChild(script);
        }
      } else if (pageName === 'faq') {
        initializeFaqPage();
      } else if (pageName === 'themes') {
        if (window.location.hash.startsWith("#themes/")) {
          const hash = window.location.hash.substring(1);
          const [_, themeName] = hash.split("/");
          if (themeName) {
            handleUrlHash();
          }
        }

        if (updateHistory) {
          const pageTitle = getPageTitle(pageName);
          const currentHash = window.location.hash.substring(1);
          const [currentPageHash, themeNameHash] = currentHash.split("/");
          const newHash = themeNameHash && currentPageHash === pageName ?
            `${pageName}/${themeNameHash}` :
            pageName;
          history.pushState({ page: pageName }, pageTitle, `#${newHash}`);
          document.title = pageTitle;
        }
      } else {
        console.error(`No identifiable content container (${contentClassName}) found...`);
        if (doc.body) {
          contentContainer.innerHTML = doc.body.innerHTML;
        } else {
          throw new Error('No content found in loaded page to inject.');
        }
      }
    } catch (error) {
      console.error(`Error loading page ${pageName}:`, error);
      contentContainer.innerHTML = `
      <div class="error-message">
        <h2>Sorry, we couldn't load this page.</h2>
        <p>Please try again or <a href="#" onclick="location.reload()">refresh the page</a>.</p>
      </div>
    `;
    }
  }

  function getPageTitle(pageName) {
    const titles = {
      'home': 'Antique Photo Parlour',
      'services': 'Services - Antique Photo Parlour',
      'pricing': 'Pricing - Antique Photo Parlour',
      'themes': 'Themes - Antique Photo Parlour',
      'frames': 'Frames - Antique Photo Parlour',
      'faq': 'FAQ - Antique Photo Parlour',
      'contact': 'Contact - Antique Photo Parlour'
    };
    return titles[pageName] || 'Antique Photo Parlour';
  }

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

    slideshow.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    slideshow.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleGesture();
    });

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
      setTimeout(() => { isTransitioning = false; }, 2000);
    }

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

  window.loadPage = loadPage;

  // Handle initial page load based on hash
  if (location.hash) {
    const hash = location.hash.substring(1);
    const [pageName] = hash.split("/");

    if (routes[pageName]) {
      loadPage(pageName, false);
    }
  } else {
    loadPage("home", false);
  }

  // Listen for hash changes (when clicking nav links)
  window.addEventListener("hashchange", () => {
    const hash = location.hash.substring(1);
    const [pageName] = hash.split("/");

    if (routes[pageName]) {
      loadPage(pageName);
    }
  });

});