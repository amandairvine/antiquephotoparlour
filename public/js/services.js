// services.js
let slideTimers = {};
let isTransitioning = {};

export function initializeServicesPage() {
    const navItems = document.querySelectorAll('.nav-item');
    const serviceContents = document.querySelectorAll('.service-content');
    const dropdownTrigger = document.querySelector('.dropdown-header');

    if (dropdownTrigger) {
        dropdownTrigger.addEventListener('click', toggleDropdown);
    }

    const initialService = document.querySelector('.service-content.active');
    if (initialService) {
        const initialServiceName = initialService.id;
        const initialNavItem = document.querySelector(`.nav-item[data-service="${initialServiceName}"]`);
        if (initialNavItem) {
            navItems.forEach(nav => nav.classList.remove('active'));
            initialNavItem.classList.add('active');
        }

        // Initialize Slideshow
        showSlides(initialServiceName);

        // Start Autoplay
        startAutoSlide(initialServiceName);
    } else {
        // Fallback: If no service-content has 'active' class, activate the first nav-item
        if (navItems.length > 0) {
            navItems[0].classList.add('active');
            const firstServiceContent = document.getElementById(navItems[0].getAttribute('data-service'));
            if (firstServiceContent) {
                firstServiceContent.classList.add('active');
            }

            // Initialize the slideshow for the fallback service
            const firstServiceId = navItems[0].getAttribute('data-service');
            showSlides(firstServiceId);
            startAutoSlide(firstServiceId);
        }
    }

    // Setup navigation buttons and touch support for each service
    serviceContents.forEach(content => {
        const serviceId = content.id;
        const prevButton = content.querySelector('.service-slideshow-nav-prev');
        const nextButton = content.querySelector('.service-slideshow-nav-next');
        const leftHoverZone = content.querySelector('.service-slideshow-hover-left');
        const rightHoverZone = content.querySelector('.service-slideshow-hover-right');
        let touchStartX = 0;
        let touchEndX = 0;

        // Function to show both buttons
        const showButtons = () => {
            if (prevButton) {
                prevButton.style.opacity = '1';
                prevButton.style.pointerEvents = 'auto';
            }
            if (nextButton) {
                nextButton.style.opacity = '1';
                nextButton.style.pointerEvents = 'auto';
            }
            stopAutoSlide(serviceId);
        };

        // Function to hide both buttons
        const hideButtons = () => {
            if (prevButton) {
                prevButton.style.opacity = '0';
                prevButton.style.pointerEvents = 'none';
            }
            if (nextButton) {
                nextButton.style.opacity = '0';
                nextButton.style.pointerEvents = 'none';
            }
            startAutoSlide(serviceId);
        };

        // Previous button
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                plusSlides(-1, serviceId);
            });
        }

        // Next button
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                plusSlides(1, serviceId);
            });
        }

        // Left hover zone
        if (leftHoverZone) {
            leftHoverZone.addEventListener('mouseenter', showButtons);

            leftHoverZone.addEventListener('mouseleave', (e) => {
                // Only hide if not moving to either button or right zone
                if (!prevButton?.contains(e.relatedTarget) &&
                    !nextButton?.contains(e.relatedTarget) &&
                    !rightHoverZone?.contains(e.relatedTarget)) {
                    hideButtons();
                }
            });

            leftHoverZone.addEventListener('click', () => {
                stopAutoSlide(serviceId);
                plusSlides(-1, serviceId);
                startAutoSlide(serviceId);
            });
        }

        // Right hover zone
        if (rightHoverZone) {
            rightHoverZone.addEventListener('mouseenter', showButtons);

            rightHoverZone.addEventListener('mouseleave', (e) => {
                // Only hide if not moving to either button or left zone
                if (!prevButton?.contains(e.relatedTarget) &&
                    !nextButton?.contains(e.relatedTarget) &&
                    !leftHoverZone?.contains(e.relatedTarget)) {
                    hideButtons();
                }
            });

            rightHoverZone.addEventListener('click', () => {
                stopAutoSlide(serviceId);
                plusSlides(1, serviceId);
                startAutoSlide(serviceId);
            });
        }

        // Keep buttons visible when hovering over them
        if (prevButton) {
            prevButton.addEventListener('mouseenter', showButtons);

            prevButton.addEventListener('mouseleave', (e) => {
                // Only hide if not moving to either hover zone or other button
                if (!leftHoverZone?.contains(e.relatedTarget) &&
                    !rightHoverZone?.contains(e.relatedTarget) &&
                    !nextButton?.contains(e.relatedTarget)) {
                    hideButtons();
                }
            });
        }

        if (nextButton) {
            nextButton.addEventListener('mouseenter', showButtons);

            nextButton.addEventListener('mouseleave', (e) => {
                // Only hide if not moving to either hover zone or other button
                if (!leftHoverZone?.contains(e.relatedTarget) &&
                    !rightHoverZone?.contains(e.relatedTarget) &&
                    !prevButton?.contains(e.relatedTarget)) {
                    hideButtons();
                }
            });
        }

        // Touch/swipe support for mobile
        content.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        content.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const deltaX = touchEndX - touchStartX;
            const swipeThreshold = 50;

            if (Math.abs(deltaX) > swipeThreshold) {
                stopAutoSlide(serviceId);
                plusSlides(deltaX > 0 ? -1 : 1, serviceId);
                startAutoSlide(serviceId);
            }
        });
    });

    // Nav item click handlers
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
                stopAutoSlide(content.id);
            });

            // Show the selected service content
            const targetContent = document.getElementById(serviceName);
            if (targetContent) {
                targetContent.classList.add('active');

                // Reset slide index and display the first slide
                slideIndex[serviceName] = 1;
                showSlides(serviceName);
                startAutoSlide(serviceName);
            }

            // Close dropdown after selection
            if (isDropdownOpen) {
                toggleDropdown();
            }
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        const activeService = document.querySelector('.service-content.active');
        if (!activeService) return;

        const serviceId = activeService.id;

        if (e.key === 'ArrowRight') {
            stopAutoSlide(serviceId);
            plusSlides(1, serviceId);
            startAutoSlide(serviceId);
        } else if (e.key === 'ArrowLeft') {
            stopAutoSlide(serviceId);
            plusSlides(-1, serviceId);
            startAutoSlide(serviceId);
        }
    });

    // Visibility change handler - pause when tab is hidden
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            // Stop all active slideshows
            Object.keys(slideTimers).forEach(serviceId => stopAutoSlide(serviceId));
        } else {
            // Restart slideshow for active service
            const activeService = document.querySelector('.service-content.active');
            if (activeService) {
                startAutoSlide(activeService.id);
            }
        }
    });
}

function startAutoSlide(serviceId) {
    // Clear any existing timer for this service
    stopAutoSlide(serviceId);

    // Start a new timer that advances the slide every 4 seconds (matching slideshow.js)
    slideTimers[serviceId] = setInterval(() => {
        plusSlides(1, serviceId);
    }, 4000);
}

function stopAutoSlide(serviceId) {
    if (slideTimers[serviceId]) {
        clearInterval(slideTimers[serviceId]);
        delete slideTimers[serviceId];
    }
}

// Handle window resize
window.addEventListener('resize', function () {
    if (window.innerWidth >= 600) {
        // Reset dropdown state for larger screens
        const menu = document.getElementById('navMenu');
        const arrow = document.querySelector('.dropdown-arrow');
        const header = document.querySelector('.dropdown-header');
        if (menu) menu.classList.remove('open');
        if (arrow) arrow.classList.remove('open');
        if (header) header.classList.remove('open');
        isDropdownOpen = false;
    }
});

// Variable to track the current slide index for each service gallery
let slideIndex = {
    'themes': 1,
    'pet-photos': 1,
    'historical-pet': 1,
    'award-winning': 1
};

// Function to control which slide is visible in a specific service gallery
function showSlides(serviceId) {
    let serviceContent = document.getElementById(serviceId);
    if (!serviceContent) return;

    let slides = serviceContent.querySelectorAll('.service-slide');
    if (slides.length === 0) return;

    if (slideIndex[serviceId] > slides.length) {
        slideIndex[serviceId] = 1;
    }
    if (slideIndex[serviceId] < 1) {
        slideIndex[serviceId] = slides.length;
    }

    // Hide all slides by removing active class
    slides.forEach(slide => slide.classList.remove('active'));

    // Show the current slide
    const currentSlide = slides[slideIndex[serviceId] - 1];
    currentSlide.classList.add('active');
}

// Function called by the Prev/Next buttons
function plusSlides(n, serviceId) {
    // Prevent rapid clicking during transitions
    if (isTransitioning[serviceId]) return;
    isTransitioning[serviceId] = true;

    slideIndex[serviceId] += n;
    showSlides(serviceId);
    startAutoSlide(serviceId);

    // Reset transition lock after 1 second
    setTimeout(() => {
        isTransitioning[serviceId] = false;
    }, 1000);
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

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && !sidebar.contains(event.target) && isDropdownOpen) {
        toggleDropdown();
    }
});