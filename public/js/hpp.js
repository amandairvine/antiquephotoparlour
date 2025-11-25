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

        // Remove the playbackSuccess flag and the E205 setTimeout check.
        // Instead, rely on the video events for confirmation.

        let isPlaying = false; // New flag to confirm playback started

        // Listen for the 'playing' event for successful start
        localVideoElement.addEventListener('playing', function () {
            isPlaying = true; // Playback has successfully begun
            console.log("Local video confirmed playing.");
        });

        // E202: Standard Error Listener
        localVideoElement.addEventListener('error', function () {
            console.error("Video Error (E202): Local video playback failed (File error). Switching to YouTube button.");
            loadYouTubePlayer("Local video playback file error detected.");
        });

        console.log("DEBUG: About to call localVideoElement.play()");

        // Start Playback Attempt
        localVideoElement.play()
            .then(() => {
                // Note: The 'playing' event will fire a moment after this if successful
                console.log("Local video play() promise resolved (Autoplay was permitted).");
                if (localVideoContainer) localVideoContainer.style.display = 'block';
            })
            .catch(error => {
                // W203: Autoplay restriction. This is OK, as the 'playing' event will not fire until user interaction.
                console.warn("Video Warning (W203): Playback promise rejected (Autoplay blocked).", error);
                if (localVideoContainer) localVideoContainer.style.display = 'block';
            });

        // E205: Manual Playback Check (Modified)
        // Give it a bit more time, and check the 'isPlaying' flag
        setTimeout(() => {
            console.log("DEBUG: setTimeout check executing.");

            // If 'playing' event never fired after 2 seconds, assume failure/unrecoverable block.
            if (!isPlaying) {
                console.error("Video Error (E205): Video did not successfully fire 'playing' event. Triggering YouTube fallback.");
                loadYouTubePlayer("Manual check failed: Video playback was not confirmed.");
            }
        }, 2000); // Increased time to 2 seconds for a safer check

        console.log("DEBUG: Finished video setup block.");

    } else {
        // E204: Fallback for element not found
        console.error("Video Error (E204): Local video <video> tag not found. Immediate fallback to YouTube button.");
        loadYouTubePlayer("Local video element missing from HTML.");
    }

    // --- How It Works Dropdown Toggle ---

    let isDropdownOpen = false;

    function toggleHppDropdown() {
        const menu = document.getElementById('howItWorksMenu');
        const arrow = document.querySelector('#howItWorksToggle .dropdown-arrow');
        const header = document.getElementById('howItWorksToggle');

        if (!menu || !arrow || !header) {
            console.error('HPP Dropdown Error: One or more elements not found for toggle logic.');
            return;
        }

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

    const toggle = document.getElementById('howItWorksToggle');
    if (toggle) {
        toggle.addEventListener('click', toggleHppDropdown);
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function (event) {
        const toggleContainer = document.getElementById('howItWorksToggle');
        const menu = document.getElementById('howItWorksMenu');
        if (isDropdownOpen && toggleContainer && menu && !toggleContainer.contains(event.target) && !menu.contains(event.target)) {
            toggleHppDropdown(); // Toggle to close
        }
    });

    let isTipsDropdownOpen = false;

    function toggleTipsDropdown() {
        const menu = document.getElementById('tipsMenu');
        // Select the arrow within the tipsToggle header
        const arrow = document.querySelector('#tipsToggle .dropdown-arrow');
        const header = document.getElementById('tipsToggle');

        if (!menu || !arrow || !header) {
            console.error('Tips Dropdown Error: One or more elements not found for toggle logic.');
            return;
        }

        isTipsDropdownOpen = !isTipsDropdownOpen;

        if (isTipsDropdownOpen) {
            menu.classList.add('open');
            arrow.classList.add('open');
            header.classList.add('open');
        } else {
            menu.classList.remove('open');
            arrow.classList.remove('open');
            header.classList.remove('open');
        }
    }

    const tipsToggle = document.getElementById('tipsToggle');
    if (tipsToggle) {
        tipsToggle.addEventListener('click', toggleTipsDropdown);
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function (event) {
        const header = document.getElementById('tipsToggle');
        const menu = document.getElementById('tipsMenu');
        if (isTipsDropdownOpen && header && menu && !header.contains(event.target) && !menu.contains(event.target)) {
            toggleTipsDropdown();
        }
    });
}