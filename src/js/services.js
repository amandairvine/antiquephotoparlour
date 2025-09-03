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