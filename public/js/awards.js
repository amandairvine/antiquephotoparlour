// Awards Gallery:
export function initializeAwardsPage() {
    console.log('Initializing awards page functionality...');

    // 1. Get ALL required elements
    const prevAwardViewer = document.getElementById('prev-award-viewer');
    const nextAwardViewer = document.getElementById('next-award-viewer');
    const awardOverlay = document.getElementById('current-award-overlay');
    const prevButton = document.getElementById('prev-award-btn');
    const nextButton = document.getElementById('next-award-btn');
    const galleryItems = document.querySelectorAll('.award-data-list .gallery-item');

    const missingElements = [];
    if (!awardOverlay) missingElements.push('current-award-overlay');
    if (!prevAwardViewer) missingElements.push('prev-award-viewer');
    if (!nextAwardViewer) missingElements.push('next-award-viewer');
    if (!prevButton) missingElements.push('prev-award-btn');
    if (!nextButton) missingElements.push('next-award-btn');
    if (galleryItems.length === 0) missingElements.push('Gallery items (.award-data-list .gallery-item)');

    if (missingElements.length > 0) {
        console.error('INITIALIZATION FAILED: The following required elements are missing:', missingElements);
        return;
    }

    let currentIndex = 0;
    const totalAwards = galleryItems.length;

    // Helper function to calculate index with wrap-around
    function getIndex(offset) {
        return (currentIndex + offset + totalAwards) % totalAwards;
    }

    function updateAward(index) {
        currentIndex = getIndex(index - currentIndex); // Update currentIndex based on input index

        // 1. Calculate indices for all three views
        const prevIndex = getIndex(-1);
        const nextIndex = getIndex(1);

        // 2. Get all three URLs
        const currentAwardUrl = galleryItems[currentIndex].getAttribute('data-award-url');
        const prevAwardUrl = galleryItems[prevIndex].getAttribute('data-award-url');
        const nextAwardUrl = galleryItems[nextIndex].getAttribute('data-award-url');

        if (!currentAwardUrl) {
            console.error('DATA ERROR: Current award URL missing at index ' + currentIndex);
            return;
        }

        if (!prevAwardUrl) {
            console.warn('DATA WARNING: Previous award URL missing at index ' + prevIndex + '. Image may not update.');
        }
        if (!nextAwardUrl) {
            console.warn('DATA WARNING: Next award URL missing at index ' + nextIndex + '. Image may not update.');
        }

        // 3. Update the three images
        awardOverlay.src = currentAwardUrl;
        prevAwardViewer.src = prevAwardUrl;
        nextAwardViewer.src = nextAwardUrl;

        console.log('Awards updated. Current Index: ' + currentIndex);
    }

    // Initialize the view
    updateAward(currentIndex);

    // 4. Attach click listeners to buttons
    prevButton.addEventListener('click', () => {
        updateAward(currentIndex - 1);
    });

    nextButton.addEventListener('click', () => {
        updateAward(currentIndex + 1);
    });

    // 5. NEW: Add click listeners to the side awards for quick navigation
    prevAwardViewer.addEventListener('click', () => {
        updateAward(currentIndex - 1);
    });

    nextAwardViewer.addEventListener('click', () => {
        updateAward(currentIndex + 1);
    });
}