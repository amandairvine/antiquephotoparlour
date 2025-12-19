import { preloadImages, getThemeImages, getHeaderImagesFromManifest } from './image-preloader.js';

const PAGE_CONFIG = {
    'home': {
        title: 'Antique Photo Parlour',
        route: null,
        css: null
    },
    'services': {
        title: 'Services - Antique Photo Parlour',
        route: '/pages/services/services.html',
        css: '/css/pages/services.css',
        init: () => import('./services.js').then(m => m.initializeServicesPage())
    },
    'pricing': {
        title: 'Pricing - Antique Photo Parlour',
        route: '/pages/pricing/pricing.html',
        css: '/css/pages/pricing.css'
    },
    'themes': {
        title: 'Themes - Antique Photo Parlour',
        route: '/pages/themes/themes.html',
        css: ['/css/pages/themes.css', '/css/pages/modal-gallery.css'],
        preload: getThemeImages,
        init: () => import('./modal-gallery.js').then(m => m.initializeThemesGallery())
    },
    'frames': {
        title: 'Frames - Antique Photo Parlour',
        route: '/pages/frames/frames.html',
        css: '/css/pages/frames.css',
        init: () => import('./frames.js').then(m => m.initializeFramesPage())
    },
    'faq': {
        title: 'FAQ - Antique Photo Parlour',
        route: '/pages/frequently-asked-questions/frequently-asked-questions.html',
        css: '/css/pages/faq.css',
        init: () => import('./faq.js').then(m => m.initializeFaqPage())
    },
    'contact': {
        title: 'Contact - Antique Photo Parlour',
        route: '/pages/contact/contact.html',
        css: '/css/pages/contact.css'
    },
    'historical-pet-portraits': {
        title: 'Historical Pet Portraits - Antique Photo Parlour',
        route: '/pages/historical-pet-portraits/historical-pet-portraits.html',
        css: '/css/pages/historical-pet-portraits.css',
        init: () => import('./hpp.js').then(m => m.initializeHppPage())
    },
    'awards': {
        title: 'Awards - Antique Photo Parlour',
        route: '/pages/awards/awards.html',
        css: '/css/pages/awards.css',
        init: () => import('./awards.js').then(m => m.initializeAwardsPage())
    },
    'coming-soon': {
        title: 'Coming Soon - Antique Photo Parlour',
        route: '/pages/coming-soon/coming-soon.html',
        css: '/css/pages/coming-soon.css'
    }
};

let currentPage = null;

export function getCurrentPage() {
    return currentPage;
}

// Preload header images on startup
preloadImages(getHeaderImagesFromManifest());

export function setupPageNavigation() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link || link.href.includes('facebook') || link.href.includes('instagram')) return;

        const href = link.getAttribute('href');

        // 1. Check if it's a hash link (ex. #pricing)
        if (href.startsWith('#')) {
            const targetHash = href.replace('#', '');
            if (PAGE_CONFIG[targetHash]) {
                e.preventDefault();
                loadPage(targetHash);
                window.location.hash = `#${targetHash}`;
                return;
            }
            return;
        }

        // 2. Check if it's a path link (ex. ../contact/contact.html)
        const pageName = extractPageName(href);
        if (pageName) {
            e.preventDefault();
            window.location.hash = `#${pageName}`;
            loadPage(pageName);
        }
    });

    window.addEventListener('popstate', () => {
        const pageFromHash = window.location.hash.replace('#', '') || 'home';
        loadPage(pageFromHash, false);
    });
}

export async function loadPage(pageName, updateHistory = true) {
    const basePageName = pageName.split('/')[0];

    const contentContainer = document.querySelector('.content');
    if (!contentContainer) {
        console.error('Content container not found');
        return;
    }

    if (currentPage === basePageName && currentPage !== null) {
        if (pageName.includes('/')) {
            import('./modal-gallery.js').then(m => m.handleUrlHash());
        }
        return;
    }

    const config = PAGE_CONFIG[basePageName];

    if (!config) {
        console.error(`No config found for: ${basePageName}`);
        if (updateHistory) {
            window.location.hash = '#home';
        } else {
            loadPage('home', false);
        }
        return;
    }

    currentPage = pageName;

    if (updateHistory) {
        history.replaceState({ page: pageName }, config.title);
        document.title = config.title;
    }

    // Handle home page
    if (pageName === 'home') {
        loadCSS(null); // Clear all page CSS for home
        await loadHomePage(contentContainer);
        return;
    }

    // Load CSS for other pages
    loadCSS(config.css);

    // Handle other pages
    try {
        contentContainer.innerHTML = '<div class="spinner"></div>';

        // Preload images if needed
        if (config.preload) {
            const images = await config.preload();
            preloadImages(images);
        }

        // Fetch and inject content
        const response = await fetch(config.route);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const pageContainer = doc.querySelector(`.${basePageName}-container`);

        if (!pageContainer) {
            throw new Error(`Container .${basePageName}-container not found in loaded page`);
        }

        contentContainer.innerHTML = pageContainer.outerHTML;

        // Initialize page-specific JS
        if (config.init) {
            await config.init().catch(err => console.error(`Failed to initialize ${pageName}:`, err));
        }

        // 3. Initialize and then handle the sub-route modal
        if (config.init) {
            await config.init();
        }

        if (pageName.includes('/')) {
            import('./modal-gallery.js').then(m => m.handleUrlHash());
        }

    } catch (error) {
        console.error(`Error loading ${pageName}:`, error);
        contentContainer.innerHTML = `
            <div class="error-message">
                <h2>Sorry, we couldn't load this page.</h2>
                <p>Please try again or <a href="#" onclick="location.reload()">refresh the page</a>.</p>
            </div>
        `;
    }
}

async function loadHomePage(container) {
    container.innerHTML = originalHomeContent;

    // Load slideshow
    try {
        const response = await fetch('/pages/slideshow/slideshow.html');
        if (!response.ok) throw new Error('Slideshow fetch failed');

        const slideshowHtml = await response.text();
        const slideshowContainer = document.getElementById('slideshow-container');

        if (slideshowContainer) {
            slideshowContainer.innerHTML = slideshowHtml;

            await new Promise(resolve => setTimeout(resolve, 100));

            if (document.querySelectorAll('.slide').length > 0) {
                import('./slideshow.js')
                    .then(m => m.initializeSlideshowDirectly())
                    .catch(err => console.error('Slideshow init failed:', err));
            }
        }
    } catch (error) {
        console.warn('Could not load slideshow:', error);
    }
}

function loadCSS(css) {
    // Always remove existing page CSS first
    document.querySelectorAll('link[id^="page-css-"]').forEach(link => link.remove());

    // If no CSS needed (home page), we're done
    if (!css) return;

    const cssFiles = Array.isArray(css) ? css : [css];

    cssFiles.forEach(path => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = path;
        link.id = `page-css-${path.split('/').pop().replace('.css', '')}`;
        link.onerror = () => console.warn(`⚠️ CSS not found: ${path}`);
        document.head.appendChild(link);
    });
}

function extractPageName(href) {
    // Extract page name from href path
    for (const page in PAGE_CONFIG) {
        if (href.includes(page) || href.includes(PAGE_CONFIG[page].route?.split('/').pop()?.replace('.html', ''))) {
            return page;
        }
    }
    return null;
}

export function handleInitialLoad() {
    const pageFromHash = window.location.hash.replace('#', '') || 'home';
    loadPage(pageFromHash, false);
}

let originalHomeContent = '';

export function cacheInitialHomeContent() {
    const content = document.querySelector('.content');
    if (content) {
        originalHomeContent = content.innerHTML;
    }
}