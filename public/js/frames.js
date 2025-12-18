// Frames Gallery:
export function initializeFramesPage() {
    console.log('Initializing frames page functionality...');

    // 1. Get ALL required elements
    const prevFrameViewer = document.getElementById('prev-frame-viewer');
    const nextFrameViewer = document.getElementById('next-frame-viewer');
    const frameOverlay = document.getElementById('current-frame-overlay');
    const prevButton = document.getElementById('prev-frame-btn');
    const nextButton = document.getElementById('next-frame-btn');
    const galleryItems = document.querySelectorAll('.frame-data-list .gallery-item');

    const missingElements = [];
    if (!frameOverlay) missingElements.push('current-frame-overlay');
    if (!prevFrameViewer) missingElements.push('prev-frame-viewer');
    if (!nextFrameViewer) missingElements.push('next-frame-viewer');
    if (!prevButton) missingElements.push('prev-frame-btn');
    if (!nextButton) missingElements.push('next-frame-btn');
    if (galleryItems.length === 0) missingElements.push('Gallery items (.frame-data-list .gallery-item)');

    if (missingElements.length > 0) {
        console.error('INITIALIZATION FAILED: The following required elements are missing:', missingElements);
        return;
    }

    let currentIndex = 0;
    const totalFrames = galleryItems.length;

    // Helper function to calculate index with wrap-around
    function getIndex(offset) {
        return (currentIndex + offset + totalFrames) % totalFrames;
    }

    function updateFrame(index) {
        currentIndex = getIndex(index - currentIndex); // Update currentIndex based on input index

        // 1. Calculate indices for all three views
        const prevIndex = getIndex(-1);
        const nextIndex = getIndex(1);

        // 2. Get all three URLs
        const currentFrameUrl = galleryItems[currentIndex].getAttribute('data-frame-url');
        const prevFrameUrl = galleryItems[prevIndex].getAttribute('data-frame-url');
        const nextFrameUrl = galleryItems[nextIndex].getAttribute('data-frame-url');

        if (!currentFrameUrl) {
            console.error('DATA ERROR: Current frame URL missing at index ' + currentIndex);
            return;
        }

        if (!prevFrameUrl) {
            console.warn('DATA WARNING: Previous frame URL missing at index ' + prevIndex + '. Image may not update.');
        }
        if (!nextFrameUrl) {
            console.warn('DATA WARNING: Next frame URL missing at index ' + nextIndex + '. Image may not update.');
        }

        // 3. Update the three images
        frameOverlay.src = currentFrameUrl;
        prevFrameViewer.src = prevFrameUrl;
        nextFrameViewer.src = nextFrameUrl;

        console.log('Frames updated. Current Index: ' + currentIndex);
    }

    // Initialize the view
    updateFrame(currentIndex);

    // 4. Attach click listeners to buttons
    prevButton.addEventListener('click', () => {
        updateFrame(currentIndex - 1);
    });

    nextButton.addEventListener('click', () => {
        updateFrame(currentIndex + 1);
    });

    // 5. Add click listeners to the side frames for quick navigation
    prevFrameViewer.addEventListener('click', () => {
        updateFrame(currentIndex - 1);
    });

    nextFrameViewer.addEventListener('click', () => {
        updateFrame(currentIndex + 1);
    });
}