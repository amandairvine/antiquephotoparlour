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
            // Note: The manifest must contain the correct, case-sensitive paths!
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

// Function to pull headers from the updated manifest
async function getHeaderImagesFromManifest() {
    const imagesByTheme = await fetchImageManifest();
    
    if (imagesByTheme.headers && Array.isArray(imagesByTheme.headers)) {
        console.log('✅ Found header images in manifest.');
        // This array should contain the complete, root-relative URLs
        return imagesByTheme.headers; 
    }
    
    // This fallback should no longer be hit once the JSON is updated
    console.warn('⚠️ Header images key missing from the manifest.');
    return []; 
}

// Export the new function
export { preloadImages, getThemeImages, getHeaderImagesFromManifest };