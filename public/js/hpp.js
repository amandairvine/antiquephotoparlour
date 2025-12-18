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

    const hppHeaderWrapper = document.querySelector('.hpp-header-wrapper');

    // --- State Variables for all dropdowns ---
    let isDropdownOpen = false;
    let isTipsDropdownOpen = false;
    let isContentDropdownOpen = false;
    let isTipsContentDropdownOpen = false;

    // --- Helper Function for Dropdown ---
    function updateHeaderWrapperClass(isHPPDropdownOpen) {
        if (!hppHeaderWrapper) {
            console.error('HPP Dropdown Error: .hpp-header-wrapper element not found.');
            return;
        }

        if (isHPPDropdownOpen) {
            hppHeaderWrapper.classList.add('dropdown-open');
        } else {
            // Check all three dropdown states before removing the class
            if (!isDropdownOpen && !isTipsDropdownOpen && !isContentDropdownOpen) {
                hppHeaderWrapper.classList.remove('dropdown-open');
            }
        }
    }

    // ------------------------------------------------------------------
    // --- 1. How It Works Dropdown Toggle (#howItWorksToggle) ---
    // ------------------------------------------------------------------

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

        // Update the wrapper class state
        updateHeaderWrapperClass(isDropdownOpen || isTipsDropdownOpen || isContentDropdownOpen);
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

    // ------------------------------------------------------------------
    // --- 2. Tips & Tricks Dropdown Toggle (#tipsToggle) ---
    // ------------------------------------------------------------------

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

        // Update the wrapper class state
        updateHeaderWrapperClass(isDropdownOpen || isTipsDropdownOpen || isContentDropdownOpen);
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

    // ------------------------------------------------------------------
    // --- 3. Content Area Dropdown Toggle (#howItWorksToggleContent) ---
    // ------------------------------------------------------------------

    function toggleContentDropdown() {
        const menu = document.getElementById('howItWorksMenuContent');
        const arrow = document.querySelector('#howItWorksToggleContent .dropdown-arrow');
        const header = document.getElementById('howItWorksToggleContent');

        if (!menu || !arrow || !header) {
            console.error('Content Dropdown Error: One or more elements not found for toggle logic.');
            return;
        }

        isContentDropdownOpen = !isContentDropdownOpen;

        if (isContentDropdownOpen) {
            menu.classList.add('open');
            arrow.classList.add('open');
            header.classList.add('open');
        } else {
            menu.classList.remove('open');
            arrow.classList.remove('open');
            header.classList.remove('open');
        }

        // Update the wrapper class state with all three dropdown states
        updateHeaderWrapperClass(isDropdownOpen || isTipsDropdownOpen || isContentDropdownOpen);
    }

    const contentToggle = document.getElementById('howItWorksToggleContent');
    if (contentToggle) {
        contentToggle.addEventListener('click', toggleContentDropdown);
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function (event) {
        const toggleContainer = document.getElementById('howItWorksToggleContent');
        const menu = document.getElementById('howItWorksMenuContent');
        if (isContentDropdownOpen && toggleContainer && menu && !toggleContainer.contains(event.target) && !menu.contains(event.target)) {
            toggleContentDropdown(); // Toggle to close
        }
    });

    // --------------------------------------------------------------------------
    // --- 4. Content Area Tips & Tricks Dropdown Toggle (#tipsContentToggle) ---
    // --------------------------------------------------------------------------

    function toggleContentTipsDropdown(event) {

        event.stopPropagation();

        const menu = document.getElementById('tipsContentMenu');
        // Select the arrow within the tipsToggle header
        const arrow = document.querySelector('#tipsContentToggle .dropdown-arrow');
        const header = document.getElementById('tipsContentToggle');

        if (!menu || !arrow || !header) {
            console.error('Tips Content Dropdown Error: One or more elements not found for toggle logic.');
            return;
        }

        isTipsContentDropdownOpen = !isTipsContentDropdownOpen;

        if (isTipsContentDropdownOpen) {
            menu.classList.add('open');
            arrow.classList.add('open');
            header.classList.add('open');
        } else {
            menu.classList.remove('open');
            arrow.classList.remove('open');
            header.classList.remove('open');
        }

        // Update the wrapper class state
        updateHeaderWrapperClass(isDropdownOpen || isTipsDropdownOpen || isContentDropdownOpen || isTipsContentDropdownOpen);
    }

    const tipsContentToggle = document.getElementById('tipsContentToggle');
    if (tipsContentToggle) {
        tipsContentToggle.addEventListener('click', toggleContentTipsDropdown);
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function (event) {
        const header = document.getElementById('tipsContentToggle');
        const menu = document.getElementById('tipsContentMenu');
        if (isTipsContentDropdownOpen && header && menu && !header.contains(event.target) && !menu.contains(event.target)) {
            toggleContentTipsDropdown();
        }
    });

    // ------------------------------------------------------------------
    // --- 5. Screen Size Management Function for Dropdown ---
    // ------------------------------------------------------------------

    function manageLargeScreenDropdownState() {
        const xlWidth = 1440;
        const xlHeight = 1110;
        const largeWidth = 1024;
        const largeHeight = 1010;

        const menu = document.getElementById('howItWorksMenuContent');
        const arrow = document.querySelector('#howItWorksToggleContent .dropdown-arrow');
        const header = document.getElementById('howItWorksToggleContent');

        if (!menu || !arrow || !header) {
            console.error("Screen Manager Error: Required DOM elements for 'How It Works' dropdown not found.");
            return;
        }

        // Width is >= 1024px AND Width is < 1440px AND Height is >= 1010px
        const widthIsInRange = window.innerWidth >= largeWidth && window.innerWidth < xlWidth;
        const heightIsSufficient = window.innerHeight >= largeHeight;

        const shouldBeOpen = widthIsInRange && heightIsSufficient;

        // CLOSING: Dropdown will automatically close if the Height drops below 1110px
        const shouldBeClosed = window.innerHeight < xlHeight;

        if (shouldBeOpen && !shouldBeClosed) {
            // OPEN LOGIC: If dimensions are large enough AND the screen isn't too short
            if (!isContentDropdownOpen) {
                console.log(`PASS: Screen is within range [${largeWidth}px - ${xlWidth}px) and height >= ${largeHeight}px. Forcing dropdown OPEN.`);
                isContentDropdownOpen = true;
                menu.classList.add('open');
                arrow.classList.add('open');
                header.classList.add('open');
                updateHeaderWrapperClass(isDropdownOpen || isTipsDropdownOpen || isContentDropdownOpen);
            }

        } else if (shouldBeClosed || !shouldBeOpen) {
            // CLOSE LOGIC: If height condition fails OR if the dimensions are outside the opening range
            if (isContentDropdownOpen) {

                let reason = shouldBeClosed
                    ? `Screen height (${window.innerHeight}px) is below ${xlHeight}px.`
                    : `Screen dimensions (${window.innerWidth}x${window.innerHeight}) are outside the auto-open range.`;

                console.log(`FAIL: ${reason} Forcing dropdown CLOSE.`);
                isContentDropdownOpen = false;
                menu.classList.remove('open');
                arrow.classList.remove('open');
                header.classList.remove('open');
                updateHeaderWrapperClass(isDropdownOpen || isTipsDropdownOpen || isContentDropdownOpen);
            }
        }
    }

    manageLargeScreenDropdownState();

    window.addEventListener('resize', manageLargeScreenDropdownState);
}