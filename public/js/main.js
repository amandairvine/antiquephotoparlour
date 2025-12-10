import { setupPageNavigation, loadPage } from './page-router.js';
import("./modal-gallery.js").then(({ handleUrlHash }) => {
  console.log("✅ modal-gallery.js loaded and ready.");
  if (window.location.hash.startsWith("#themes/")) {
    handleUrlHash();
  }
});

let closeModalHandler;

document.addEventListener('DOMContentLoaded', function () {
  console.log('Main script loaded');

  // Load header and footer
  fetch('../../header/header.html').then(response => response.text()).then(html => {
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
      headerContainer.innerHTML = html;
      console.log("Header content loaded.");
      setupPageNavigation();

      const hamburgerMenu = document.querySelector('.hamburger-menu');
      const mobileMenu = document.querySelector('.mobile-menu');
      const closeBtn = document.querySelector('.close-btn');

      console.log('Hamburger Menu Element:', hamburgerMenu);
      console.log('Mobile Menu Element:', mobileMenu);
      console.log('Close Button Element:', closeBtn);

      if (hamburgerMenu && mobileMenu && closeBtn) {
        hamburgerMenu.addEventListener('click', function () {
          console.log('Hamburger menu clicked!');
          mobileMenu.classList.toggle('show');
          document.body.classList.toggle('menu-open');
        });

        closeBtn.addEventListener('click', function () {
          console.log('Close button clicked!');
          mobileMenu.classList.remove('show');
          document.body.classList.remove('menu-open');
        });
      }

      function setActiveMobileLink() {
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        const currentHash = window.location.hash || '#home';

        mobileLinks.forEach(link => {
          if (link.getAttribute('href') === currentHash) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }

      // Call the function on initial page load
      setActiveMobileLink();

      const menuMediaQuery = window.matchMedia('(min-width: 660px)');

      const handleMobileMenuCleanup = (e) => {
        if (e.matches) {
          // Screen width is 660px or larger
          if (mobileMenu && mobileMenu.classList.contains('show')) {
            mobileMenu.classList.remove('show');
            document.body.classList.remove('menu-open');
            console.log('[Resize Listener] Mobile menu state cleared due to screen width > 660px.');
          }
        }
      };

      // Add listener for changes to the media query
      menuMediaQuery.addEventListener('change', handleMobileMenuCleanup);

      // Run the check once on load 
      handleMobileMenuCleanup(menuMediaQuery);

    }
  });

  fetch('../../footer/footer.html').then(response => response.text()).then(html => {
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
      footerContainer.innerHTML = html;
      console.log('Footer loaded.');

      setupFooterCollapse();
    }
  });

  // Handle initial page load
  const initialHash = location.hash;
  if (initialHash) {
    const hash = initialHash.substring(1);
    const [pageName] = hash.split("/");
    loadPage(pageName, false);
  } else {
    loadPage("home", false);
  }

  // Handle hash changes (when clicking nav links)
  window.addEventListener("hashchange", () => {
    const hash = location.hash.substring(1);

    // Check if the hash is empty or only contains the page separator
    let pageName = 'home'; // Default to 'home'
    if (hash && hash !== '/') {
      [pageName] = hash.split("/");
    }

    loadPage(pageName);

    // Remove 'active' from all links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.classList.remove('active');
    });

    // Find the target link based on the pageName we are loading
    const targetLink = document.querySelector(`.mobile-nav-link[href="#${pageName}"]`);

    // Proceed if the link element exists
    if (targetLink) {
      targetLink.classList.add('active');
    } else {
      // Handle case where link is not found
      console.warn(`Mobile navigation link not found for page: ${pageName}`);
    }
  });
});

function setupFooterCollapse() {
  const buttons = document.querySelectorAll('.footer-collapse-btn');

  // Create overlay element once:
  let overlay = document.querySelector('.modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.classList.add('modal-overlay');
    document.body.appendChild(overlay);
  }

  const closeModal = () => {
    // Find all active footer content elements and remove the 'active' class:
    document.querySelectorAll('.footer-content.active').forEach(content => {
      content.classList.remove('active');
    });

    overlay.classList.remove('active');
    document.body.classList.remove('modal-open');
    console.log('[Footer Collapse] Modal closed.');

    // Remove old document click listener to prevent multiple bindings:
    document.removeEventListener('click', handleOutsideClick);
  }

  // Outside click handler function:
  const handleOutsideClick = (event) => {
    // If the click is not on a button and not inside an active content area, close the modal:
    const isButtonClick = Array.from(buttons).some(button => button.contains(event.target));
    const isInsideContent = document.querySelector('.footer-content.active')?.contains(event.target);

    if (!isButtonClick && !isInsideContent) {
      closeModal();
    }
  }

  // Click handler for the overlay itself (closes the modal when clicking outside):
  overlay.addEventListener('click', (event) => {
    // Prevent closing if the click was directly on the modal itself:
    if (event.target === overlay) {
      closeModal();
    }
  })

  const checkViewportDimensions = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const isModalOpen = document.body.classList.contains('modal-open');

    // Define the height threshold based on the current width
    let heightThreshold = null;

    if (windowWidth >= 320 && windowWidth <= 659) {
      heightThreshold = 700;
    } else if (windowWidth >= 660 && windowWidth <= 1023) {
      heightThreshold = 700;
    } else if (windowWidth >= 1024 && windowWidth <= 1439) {
      heightThreshold = 800;
    } else if (windowWidth >= 1440 && windowWidth <= 1919) {
      heightThreshold = 800;
    } else if (windowWidth >= 1920) {
      heightThreshold = 800;
    }

    // Check if the current dimensions meet a "close" condition
    const shouldCloseModal = heightThreshold !== null && windowHeight >= heightThreshold;

    if (shouldCloseModal && isModalOpen) {
      closeModal();
      console.log(`[Resize Check] Modal and content state cleared. Current dimensions: ${windowWidth}x${windowHeight} (Close Threshold: ${heightThreshold}px).`);
    }

    return shouldCloseModal; // Return for use in the button click handler
  }

  // 1. Attach the listener for window resize events
  window.addEventListener('resize', checkViewportDimensions);

  // 2. Run the check once on initial setup/load
  checkViewportDimensions();

  buttons.forEach(button => {
    button.addEventListener('click', (event) => {

      // Prevent button click from immediately propagating to the document or overlay:
      event.stopPropagation();

      // Click confirmation message:
      const buttonText = button.textContent.trim();
      console.log(`[Footer Collapse] Button clicked: ${buttonText}`);

      const targetClass = button.getAttribute('data-target');
      const targetElement = document.querySelector(`.${targetClass}`);

      if (!targetElement) {
        console.error(`Error: Collapse target element with class "${targetClass}" not found.`);
        return;
      }

      // Check current status before making changes:
      const isAlreadyActive = targetElement.classList.contains('active');

      // Close modal first to ensure single modal behaviour:
      closeModal();

      // Check height before opening the modal
      const shouldCloseModal = checkViewportDimensions();

      if (!isAlreadyActive && !shouldCloseModal) {
        targetElement.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('modal-open');
        console.log(`[Footer Collapse] Opening: ${buttonText} modal.`);

        // Add the outside click listener after a delay:
        setTimeout(() => {
          document.addEventListener('click', handleOutsideClick);
        }, 50);
      } else if (shouldCloseModal) {
        console.log(`[Footer Collapse] Prevented opening: ${buttonText} modal due to screen dimensions.`);
      }
      else {
        console.log(`[Footer Collapse] Closing: ${buttonText} content (via button click).`);
      }
    });
  })
}