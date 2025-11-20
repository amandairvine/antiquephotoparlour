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
  if (location.hash) {
    const hash = location.hash.substring(1);
    const [pageName] = hash.split("/");
    loadPage(pageName, false);
  } else {
    loadPage("home", false);
  }

  // Handle hash changes (when clicking nav links)
  window.addEventListener("hashchange", () => {
    const hash = location.hash.substring(1);
    const [pageName] = hash.split("/");
    loadPage(pageName);
    // Call the function again to update the active link
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => link.classList.remove('active'));
    document.querySelector(`.mobile-nav-link[href="#${pageName}"]`).classList.add('active');
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

    overlay.style.display = 'none';
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

      if (!isAlreadyActive) {
        targetElement.classList.add('active');
        overlay.style.display = 'block';
        document.body.classList.add('modal-open');
        console.log(`[Footer Collapse] Opening: ${buttonText} modal.`);

        // Add the outside click listener after a delay:
        setTimeout(() => {
          document.addEventListener('click', handleOutsideClick);
        }, 50);
      } else {
        console.log(`[Footer Collapse] Closing: ${buttonText} content (via button click).`);
      }
    });
  })
}