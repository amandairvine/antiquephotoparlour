let isMobileView = false;
const breakpoint = 768;

// Function to attach event listeners
function setupNavbarListeners() {
  console.log("--- setupNavbarListeners function called ---");
  const container = document.querySelector(".secondary-nav .flex-container");
  if (!container) {
    console.warn("setupNavbarListeners: .secondary-nav .flex-container not found. Cannot attach click listeners.");
    return;
  }

  const moreDropdown = container.querySelector(".more-dropdown");
 const moreLink = moreDropdown ? moreDropdown.querySelector(".more-link") : null;
  const dropdownMenu = moreDropdown ? moreDropdown.querySelector(".dropdown-menu") : null;

  if (moreLink && dropdownMenu && moreDropdown) {
    console.log("Attaching click listeners for 'More' link and document.");

    // Click listener for the "More" link to toggle dropdown visibility
    moreLink.removeEventListener("click", toggleDropdown); 
    moreLink.addEventListener("click", toggleDropdown);

    document.removeEventListener("click", closeDropdownOnClickOutside); 
    document.addEventListener("click", closeDropdownOnClickOutside);

  } else {
    console.warn("Could not find 'More' link or dropdown menu elements to attach listeners in setupNavbarListeners.");
  }
}

// Helper functions for event listeners 
function toggleDropdown(event) {
  const moreDropdown = this.closest('.more-dropdown'); 
  const dropdownMenu = moreDropdown.querySelector(".dropdown-menu");

  console.log("More link clicked! Inside toggleDropdown.");
  event.preventDefault();

  if (window.getComputedStyle(moreDropdown).display !== 'none') {
    dropdownMenu.classList.toggle("show");
    console.log("Dropdown menu 'show' class toggled. Current state:", dropdownMenu.classList.contains("show") ? "visible" : "hidden");
  } else {
    console.log("More dropdown is not visible (CSS display: none), so not toggling.");
  }
}

function closeDropdownOnClickOutside(event) {
  const moreDropdown = document.querySelector(".more-dropdown"); 
  const dropdownMenu = moreDropdown.querySelector(".dropdown-menu");

  if (
    window.getComputedStyle(moreDropdown).display !== 'none' &&
    !moreDropdown.contains(event.target) &&
    dropdownMenu.classList.contains("show")
  ) {
    dropdownMenu.classList.remove("show");
    console.log("Clicked outside 'More' dropdown. Dropdown menu closed.");
  }
}

function adaptNavItems() {
  console.log("--- adaptNavItems function called ---");
  console.log("Current window width:", window.innerWidth);

  const container = document.querySelector(".secondary-nav .flex-container");
  if (!container) {
    console.warn("adaptNavItems: .secondary-nav .flex-container not found.");
    return;
  }

  const moreDropdown = container.querySelector(".more-dropdown");
  const dropdownMenu = moreDropdown.querySelector(".dropdown-menu");
  const movableItems = [...container.querySelectorAll(".move-to-dropdown")];

  const newIsMobileView = window.innerWidth < breakpoint;
  console.log("newIsMobileView:", newIsMobileView, "isMobileView (previous):", isMobileView);

  if (newIsMobileView !== isMobileView) {
    console.log("Breakpoint crossed! Transitioning to:", newIsMobileView ? "Mobile View" : "Desktop View");

    if (newIsMobileView) {
      console.log("Moving movable items into dropdown menu...");
      movableItems.forEach((item) => {
        dropdownMenu.appendChild(item);
        console.log("Moved:", item.textContent.trim());
      });
      dropdownMenu.classList.remove("show");
      console.log("Dropdown menu class 'show' removed (ensuring hidden).");
    } else {
      console.log("Moving movable items back to main navigation...");
      movableItems.forEach((item) => {
        container.insertBefore(item, moreDropdown);
        console.log("Moved back:", item.textContent.trim());
      });
      dropdownMenu.classList.remove("show");
      console.log("Dropdown menu class 'show' removed (ensuring hidden).");
    }
    isMobileView = newIsMobileView;
    console.log("isMobileView updated to:", isMobileView);
  } else {
    console.log("No breakpoint crossed. No DOM manipulation needed.");
  }
}

document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM loaded. Initializing navbar...");
  adaptNavItems(); 
  setupNavbarListeners(); 
});

window.addEventListener("resize", adaptNavItems);