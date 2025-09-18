// services.js
function initializeServicesPage() {
    console.log('Initializing services page functionality...');

    const navItems = document.querySelectorAll('.nav-item');
    const serviceContents = document.querySelectorAll('.service-content');

    const initialService = document.querySelector('.service-content.active');
    if (initialService) {
        const initialServiceName = initialService.id;
        const initialNavItem = document.querySelector(`.nav-item[data-service="${initialServiceName}"]`);
        if (initialNavItem) {
            navItems.forEach(nav => nav.classList.remove('active')); // Clear all
            initialNavItem.classList.add('active'); // Set active
        }
    } else {
        // Fallback: If no service-content has 'active' class, activate the first nav-item
        if (navItems.length > 0) {
            navItems[0].classList.add('active');
            const firstServiceContent = document.getElementById(navItems[0].getAttribute('data-service'));
            if (firstServiceContent) {
                firstServiceContent.classList.add('active');
            }
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', function () {
            const serviceName = this.getAttribute('data-service');

            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));

            // Add active class to clicked item
            this.classList.add('active');

            // Hide all service content sections
            serviceContents.forEach(content => {
                content.classList.remove('active');
            });

            // Show the selected service content
            const targetContent = document.getElementById(serviceName);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    console.log('Services page functionality initialized.');
}

let isDropdownOpen = false;

function toggleDropdown() {
    const menu = document.getElementById('navMenu');
    const arrow = document.querySelector('.dropdown-arrow');
    const header = document.querySelector('.dropdown-header');

    isDropdownOpen = !isDropdownOpen;

    if (isDropdownOpen) {
        menu.classList.add('open');
        arrow.classList.add('open');
        header.classList.add('open');
    } else {
        menu.classList.remove('open');
        arrow.classList.remove('open');
        header.classList.remove('open');
    }
}

function showService(serviceId) {
    // Hide all service content
    const allContent = document.querySelectorAll('.service-content');
    allContent.forEach(content => content.classList.remove('active'));

    // Remove active class from all nav items
    const allNavItems = document.querySelectorAll('.nav-item');
    allNavItems.forEach(item => item.classList.remove('active'));

    // Show selected service content
    document.getElementById(serviceId).classList.add('active');

    // Add active class to selected nav item
    document.querySelector(`[data-service="${serviceId}"]`).classList.add('active');

    // Close dropdown on small screens after selection
    if (window.innerWidth < 600) {
        const menu = document.getElementById('navMenu');
        const arrow = document.querySelector('.dropdown-arrow');
        const header = document.querySelector('.dropdown-header');
        menu.classList.remove('open');
        arrow.classList.remove('open');
        header.classList.remove('open');
        isDropdownOpen = false;
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar.contains(event.target) && isDropdownOpen) {
        toggleDropdown();
    }
});

// Handle window resize
window.addEventListener('resize', function () {
    if (window.innerWidth >= 600) {
        // Reset dropdown state for larger screens
        const menu = document.getElementById('navMenu');
        const arrow = document.querySelector('.dropdown-arrow');
        const header = document.querySelector('.dropdown-header');
        menu.classList.remove('open');
        arrow.classList.remove('open');
        header.classList.remove('open');
        isDropdownOpen = false;
    }
});