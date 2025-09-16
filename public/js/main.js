import { setupPageNavigation, loadPage } from './page-router.js';
import("./modal-gallery.js").then(({ handleUrlHash }) => {
  console.log("✅ modal-gallery.js loaded and ready.");
  if (window.location.hash.startsWith("#themes/")) {
    handleUrlHash();
  }
});

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

    }
  });

  fetch('../../footer/footer.html').then(response => response.text()).then(html => {
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
      footerContainer.innerHTML = html;
      console.log('Footer loaded.');
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