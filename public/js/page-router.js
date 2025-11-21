import { preloadImages, getThemeImages, getHeaderImages } from './image-preloader.js';
import("./modal-gallery.js").then(({ handleUrlHash }) => {
    console.log("✅ modal-gallery.js loaded.");
});

const routes = {
    'services': '/pages/services/services.html',
    'pricing': '/pages/pricing/pricing.html',
    'themes': '/pages/themes/themes.html',
    'frames': '/pages/frames/frames.html',
    'faq': '/pages/frequently-asked-questions/frequently-asked-questions.html',
    'contact': '/pages/contact/contact.html',
    'historical-pet-portraits': '/pages/historical-pet-portraits/historical-pet-portraits.html',
    'awards': '/pages/awards/awards.html'
};

let originalHomeContent = null;

// Preload general site images:
async function preloadGeneralImages() {
    const headerImages = getHeaderImages();
    preloadImages(headerImages);
}

preloadGeneralImages();

export function setupPageNavigation() {
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

export async function loadPage(pageName, updateHistory = true) {
    console.log(`Loading page: ${pageName}`);
    const contentContainer = document.querySelector('.content');

    if (!contentContainer) {
        console.error('Content container not found');
        return;
    }

    loadPageCSS(pageName);

    if (pageName === 'home') {
        if (originalHomeContent) {
            contentContainer.innerHTML = originalHomeContent;
        } else {
            originalHomeContent = contentContainer.innerHTML;
        }

        const slideshowResponse = await fetch('/pages/slideshow/slideshow.html');
        if (!slideshowResponse.ok) {
            console.error('Failed to fetch slideshow HTML:', slideshowResponse.statusText);
            return;
        }
        const slideshowHtml = await slideshowResponse.text();

        let slideshowContainer = document.getElementById('slideshow-container');
        if (!slideshowContainer) {
            await new Promise(resolve => setTimeout(resolve, 10));
            slideshowContainer = document.getElementById('slideshow-container');
        }

        if (slideshowContainer) {
            slideshowContainer.innerHTML = slideshowHtml;
            setTimeout(() => {
                const slides = document.querySelectorAll('.slide');
                if (slides.length > 0) {
                    import('./slideshow.js').then(({ initializeSlideshowDirectly }) => {
                        initializeSlideshowDirectly();
                    });
                } else {
                    console.warn('No slides found - slideshow cannot be initialized');
                }
            }, 100);
        } else {
            console.warn('Slideshow container not found - skipping slideshow initialization');
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

        if (pageName === 'themes') {
            const themeImagesToPreload = await getThemeImages();
            preloadImages(themeImagesToPreload);
        }

        const response = await fetch(route);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const pageContentToInject = doc.querySelector(`.${pageName}-container`);

        if (pageContentToInject) {
            contentContainer.innerHTML = pageContentToInject.outerHTML;
            if (updateHistory) {
                const pageTitle = getPageTitle(pageName);
                history.pushState({ page: pageName }, pageTitle, `#${pageName}`);
                document.title = pageTitle;
            }

            if (pageName === 'services') {
                const oldScript = document.getElementById('services-script');
                if (oldScript) oldScript.remove();
                const script = document.createElement('script');
                script.src = '../../js/services.js';
                script.id = 'services-script';
                document.body.appendChild(script);
            }
            if (pageName === 'faq') {
                import('./faq.js').then(({ initializeFaqPage }) => {
                    initializeFaqPage();
                }).catch(error => {
                    console.error('Failed to load faq.js:', error);
                });
            }
            if (pageName === 'frames') {
                import('./frames.js').then(({ initializeFramesPage }) => {
                    initializeFramesPage();
                }).catch(error => {
                    console.error('Failed to load frames.js:', error);
                });
            }
            if (pageName === 'awards') {
                import('./awards.js').then(({ initializeAwardsPage }) => {
                    initializeAwardsPage();
                }).catch(error => {
                    console.error('Failed to load awards.js:', error);
                });
            }
        } else {
            console.error(`No identifiable content container (${pageName}-container) found...`);
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

function extractPageName(href) {
    if (href.includes('services')) return 'services';
    if (href.includes('pricing')) return 'pricing';
    if (href.includes('themes')) return 'themes';
    if (href.includes('frames')) return 'frames';
    if (href.includes('frequently-asked-questions')) return 'faq';
    if (href.includes('contact')) return 'contact';
    if (href.includes('home')) return 'home';
    if (href.includes('historical-pet-portraits')) return 'historical-pet-portraits';
    if (href.includes('awards')) return 'awards';
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
}

function getPageTitle(pageName) {
    const titles = {
        'home': 'Antique Photo Parlour',
        'services': 'Services - Antique Photo Parlour',
        'pricing': 'Pricing - Antique Photo Parlour',
        'themes': 'Themes - Antique Photo Parlour',
        'frames': 'Frames - Antique Photo Parlour',
        'faq': 'FAQ - Antique Photo Parlour',
        'contact': 'Contact - Antique Photo Parlour',
        'historical-pet-portraits': 'Historical Pet Portraits - Antique Photo Parlour',
        'awards': 'Awards - Antique Photo Parlour'
    };
    return titles[pageName] || 'Antique Photo Parlour';
}