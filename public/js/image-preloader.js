const PRELOAD_BATCH_SIZE = 5;

async function fetchImageManifest() {
    try {
        const response = await fetch('/data/images.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch images.json: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('✅ Image manifest loaded.');
        return data;
    } catch (error) {
        console.error('❌ Error fetching image manifest:', error);
        return {};
    }
}

function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            resolve();
        };
        img.onerror = () => {
            console.warn(`⚠️ Failed to preload image: ${url}`);
            reject();
        };
    });
}

async function preloadImages(imageUrls) {
    const allPromises = [];
    console.log(`🚀 Starting to preload ${imageUrls.length} images...`);

    for (let i = 0; i < imageUrls.length; i += PRELOAD_BATCH_SIZE) {
        const batch = imageUrls.slice(i, i + PRELOAD_BATCH_SIZE);
        const batchPromises = batch.map(url => preloadImage(url));
        allPromises.push(...batchPromises);
        await Promise.all(batchPromises).catch(() => { });
    }

    await Promise.allSettled(allPromises);
    console.log('✅ All images finished preloading.');
}

async function getThemeImages() {
    const imagesByTheme = await fetchImageManifest();
    const themes = ['victorian', 'dressy-western', 'cowboys-and-cowgirls', 'showgirls-and-outlaws', 'roaring-20s', 'pirates', 'wedding', 'civil-war', 'native-american', 'mounties', 'steampunk', 'mix-and-match', 'kids', 'pets', 'winter-wonderland'];
    let allImageUrls = [];

    themes.forEach(theme => {
        if (imagesByTheme[theme]) {
            allImageUrls.push(...imagesByTheme[theme]);
        }
    });

    const uniqueUrls = [...new Set(allImageUrls)].filter(url => !url.toLowerCase().includes('-main.jpg'));
    return uniqueUrls;
}

// Return an array of header image URLs
function getHeaderImages() {
    const headerFileNames = [
        '../img/logo/logo',
        '../img/assets/view-your-photos-text',
        '../img/headers/services-headers/services',
        '../img/headers/services-headers/award-winning',
        '../img/headers/services-headers/choose-a-theme',
        '../img/headers/services-headers/historical-pet-portraits',
        '../img/headers/services-headers/pet-photography',
        '../img/headers/prices-headers/pricing',
        '../img/headers/prices-headers/sitting-fee',
        '../img/headers/prices-headers/additional-options',
        '../img/headers/prices-headers/people-number/one-person',
        '../img/headers/prices-headers/people-number/two-people',
        '../img/headers/prices-headers/people-number/three-people',
        '../img/headers/prices-headers/people-number/four-people',
        '../img/headers/themes-headers/themes',
        '../img/headers/themes-headers/civil-war',
        '../img/headers/themes-headers/cowboys-and-cowgirls',
        '../img/headers/themes-headers/dressy-western',
        '../img/headers/themes-headers/kids',
        '../img/headers/themes-headers/mix-and-match',
        '../img/headers/themes-headers/mounties',
        '../img/headers/themes-headers/native-american',
        '../img/headers/themes-headers/pets',
        '../img/headers/themes-headers/pirates',
        '../img/headers/themes-headers/roaring-20s',
        '../img/headers/themes-headers/showgirls-and-outlaws',
        '../img/headers/themes-headers/steampunk',
        '../img/headers/themes-headers/victorian',
        '../img/headers/themes-headers/wedding',
        '../img/headers/themes-headers/winter-wonderland',
        '../img/headers/faq-headers/faq',
        '../img/headers/faq-headers/question-headers/accessibility',
        '../img/headers/faq-headers/question-headers/appointment-bookings',
        '../img/headers/faq-headers/question-headers/babies',
        '../img/headers/faq-headers/question-headers/bookings-and-number-of-people',
        '../img/headers/faq-headers/question-headers/hair-and-makeup',
        '../img/headers/faq-headers/question-headers/no-outfit-sitting',
        '../img/headers/faq-headers/question-headers/outfit-sizing',
        '../img/headers/faq-headers/question-headers/people',
        '../img/headers/faq-headers/question-headers/planning-your-visit',
        '../img/headers/faq-headers/question-headers/sitting-expectations',
        '../img/headers/faq-headers/question-headers/studio-pets',
        '../img/headers/contact-headers/contact',
    ];

    // Map over the array to standardize each path
    const standardizedHeaders = headerFileNames.map(path => {
        return path.toLowerCase() + '.png';
    });

    return standardizedHeaders;
}

// Export the new function
export { preloadImages, getThemeImages, getHeaderImages };