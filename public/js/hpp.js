export function initializeHppPage() {
    // Function to hide YouTube and show the local video fallback
    function showLocalFallback() {
        document.getElementById('youtube-player').style.display = 'none';
        document.getElementById('local-video').style.display = 'block';

        // Optional: Start the local video playback
        const localVideoElement = document.querySelector('#local-video video');
        if (localVideoElement) {
            localVideoElement.play();
        }
        console.log("YouTube error detected. Switching to local MP4 fallback.");
    }

    setTimeout(() => {
        showLocalFallback(); 
    }, 5000);
}