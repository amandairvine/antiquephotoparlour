// Frames Gallery:
export function initializeFramesPage() {
    console.log('Initializing frames page functionality...');

    // 1. Get ALL required elements
    const prevFrameViewer = document.getElementById('prev-frame-viewer'); // NEW
    const nextFrameViewer = document.getElementById('next-frame-viewer'); // NEW
    const frameOverlay = document.getElementById('current-frame-overlay');
    const prevButton = document.getElementById('prev-frame-btn');
    const nextButton = document.getElementById('next-frame-btn');
    const galleryItems = document.querySelectorAll('.frame-data-list .gallery-item');

    if (!frameOverlay || !prevFrameViewer || !nextFrameViewer || galleryItems.length === 0 || !prevButton || !nextButton) {
        // ... (error checks for new elements should be added here for robustness)
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

    // 5. NEW: Add click listeners to the side frames for quick navigation
    prevFrameViewer.addEventListener('click', () => {
        updateFrame(currentIndex - 1);
    });

    nextFrameViewer.addEventListener('click', () => {
        updateFrame(currentIndex + 1);
    });
}