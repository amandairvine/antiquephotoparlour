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

  fetch('/header/header.html')
    .then(response => response.text())
    .then(html => {
      const headerContainer = document.getElementById('header-container');
      if (headerContainer) {
        headerContainer.innerHTML = html;
        console.log("Header content loaded.");

        setupPageNavigation();

        const initialHash = window.location.hash.substring(1);
        if (initialHash && routes[initialHash.split('/')[0]]) {
          console.log(`Loading page from initial hash: ${initialHash}`);
          loadPage(initialHash.split('/')[0], false);
        } else {
          console.log('No specific hash, loading home page.');
          loadHomePage();
        }
      }
    })
    .catch(error => console.error('Error loading header content:', error));

  fetch('/footer/footer.html')
    .then(response => response.text())
    .then(html => {
      const footerContainer = document.getElementById('footer-container');
      if (footerContainer) {
        footerContainer.innerHTML = html;
        console.log('Footer loaded successfully');
      }
    })
    .catch(error => console.error('Error loading footer:', error));

  function loadHomePage() {
    // ... (rest of the loadHomePage function remains the same)
  }

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
    console.log('Loading page:', pageName);
    const contentContainer = document.querySelector('.content');

    if (!contentContainer) {
      console.error('Content container not found');
      return;
    }
    
    // Clear any existing scripts from the body before loading new ones
    const oldScripts = document.querySelectorAll('script[id$="-script"]');
    oldScripts.forEach(script => script.remove());

    loadPageCSS(pageName);

    if (pageName === 'home') {
      if (originalHomContent) {
        contentContainer.innerHTML = originalHomContent;
        currentPage = 'home';
        setTimeout(() => {
          initializeSlideshowDirectly();
        }, 100);
      } else {
        loadHomePage();
      }

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
          const currentHash = window.location.hash.substring(1);
          const [currentPageHash, themeNameHash] = currentHash.split("/");
          const newHash = themeNameHash && currentPageHash === pageName ?
            `${pageName}/${themeNameHash}` :
            pageName;
          history.pushState({ page: pageName }, pageTitle, `#${newHash}`);
          document.title = pageTitle;
        }

        // Call functions based on pageName
        if (pageName === 'services') {
          initializeServicesPage();
        } else if (pageName === 'faq') {
          initializeFaqPage();
        } else if (pageName === 'themes') {
          // This ensures handleUrlHash() is called AFTER the themes content is injected
          if (window.location.hash.startsWith("#themes/")) {
            const hash = window.location.hash.substring(1);
            const [_, themeName] = hash.split("/");
            if (themeName) {
              handleUrlHash();
            }
          }
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
    // ... (rest of the slideshow functions remain the same)
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