export function initializeHppPage() {
    // Function to hide local video and display the YouTube button fallback
    function loadYouTubePlayer(reason) {
        console.warn(`YouTube Button Fallback Triggered. Reason: ${reason}`);

        const localVideoContainer = document.getElementById('local-video');
        const youtubeButtonContainer = document.getElementById('youtube-button-fallback');

        // 1. Hide local video container
        if (localVideoContainer) {
            localVideoContainer.style.display = 'none';
            console.log("YouTube Button Fallback: Hidden local video container.");
        }

        // 2. Show the YouTube button container
        if (youtubeButtonContainer) {
            youtubeButtonContainer.style.display = 'flex';
            console.log("YouTube Button Fallback: Displayed fallback button.");
        } else {
            console.error("Video Error (E201): YouTube button container ('youtube-button-fallback') not found in HTML.");
        }
    }

    // --- Video Logic Initialization (Local Priority) ---

    const localVideoContainer = document.getElementById('local-video');
    const localVideoElement = localVideoContainer ? localVideoContainer.querySelector('video') : null;

    console.log('--- Video Element Check ---');
    console.log('Local Container Found:', localVideoContainer);
    console.log('Local Video Element Found:', localVideoElement);

    // Ensure the button is hidden by default
    const youtubeButtonContainer = document.getElementById('youtube-button-fallback');
    if (youtubeButtonContainer) {
        youtubeButtonContainer.style.display = 'none';
    }

    if (localVideoElement) {
        console.log("Attempting to load and play local video first...");

        let playbackSuccess = false; // New flag to track successful playback

        // E202: Standard Error Listener
        localVideoElement.addEventListener('error', function () {
            console.error("Video Error (E202): Local video playback failed (File error). Switching to YouTube button.");
            loadYouTubePlayer("Local video playback file error detected.");
        });

        console.log("DEBUG: About to call localVideoElement.play()");

        // Start Playback Attempt
        localVideoElement.play()
            .then(() => {
                playbackSuccess = true; // Set flag to true only on success
                console.log("Local video started successfully (Autoplay success).");
                if (localVideoContainer) localVideoContainer.style.display = 'block';
            })
            .catch(error => {
                // W203: Autoplay restriction. We still rely on the manual check below to handle the text/html case.
                console.warn("Video Warning (W203): Playback promise rejected (Autoplay blocked).", error);
                if (localVideoContainer) localVideoContainer.style.display = 'block';
            });

        // E205: Manual Playback Check (The definitive check for text/html failure)
        setTimeout(() => {
            console.log("DEBUG: setTimeout check executing.");

            // If playback was NOT successful after 500ms, force the fallback.
            // This captures both the autoplay block (W203) AND the silent server error.
            if (!playbackSuccess) {
                console.error("Video Error (E205): Video did not start successfully within 500ms. Triggering YouTube fallback.");
                loadYouTubePlayer("Manual check failed: Video playback was not confirmed.");
            }
        }, 500);

        console.log("DEBUG: Finished video setup block.");

    } else {
        // E204: Fallback for element not found
        console.error("Video Error (E204): Local video <video> tag not found. Immediate fallback to YouTube button.");
        loadYouTubePlayer("Local video element missing from HTML.");
    }

    // --- Dropdown Toggle ---
    const toggle = document.getElementById('howItWorksToggle');
    const content = document.getElementById('howItWorksContent');

    console.log('--- Dropdown Initialization Check ---');
    console.log('Toggle Element found:', toggle);
    console.log('Content Element found:', content);

    if (toggle && content) {
        console.log('Dropdown elements successfully found. Attaching listener...');

        toggle.addEventListener('click', function () {
            content.classList.toggle('open');
            console.log('Dropdown Clicked! Content classes:', content.classList);
        });

    } else {
        console.error('Dropdown Error: One or both elements not found. Check HTML IDs.');
    }
}