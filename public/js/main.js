import { setupPageNavigation, loadPage } from './page-router.js';
import("./modal-gallery.js").then(({ handleUrlHash }) => {
  console.log("✅ modal-gallery.js loaded and ready.");
  if (window.location.hash.startsWith("#themes/")) {
    handleUrlHash();
  }
});

document.addEventListener('DOMContentLoaded', function () {
  console.log('Main script loaded');

  // Load header and footer as before
  fetch('../../header/header.html').then(response => response.text()).then(html => {
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
      headerContainer.innerHTML = html;
      console.log("Header content loaded.");
      setupPageNavigation(); // Set up navigation after header is in the DOM
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
  });
});