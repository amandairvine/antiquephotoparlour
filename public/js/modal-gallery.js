console.log("✅ modal-gallery.js running");

// Function to enlarge image
function enlargeImage(imageSrc) {
    console.log("Enlarging image:", imageSrc);

    // Get all gallery images to enable navigation
    const galleryImages = Array.from(document.querySelectorAll("#modalGallery img"));
    const currentIndex = galleryImages.findIndex(img => img.src === imageSrc);

    // Hide the gallery modal completely
    const galleryModal = document.getElementById("themeModal");
    galleryModal.style.display = "none";

    // Create enlarged image overlay
    const overlay = document.createElement("div");
    overlay.id = "enlargedImageOverlay";
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(60, 4, 4, 0.91);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999999;
    `;

    // Container for image and navigation
    const container = document.createElement("div");
    container.style.cssText = `
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    `;

    const enlargedImg = document.createElement("img");
    enlargedImg.src = imageSrc;
    enlargedImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
        cursor: default;
    `;

    // Navigation arrows (only show if more than one image)
    let prevArrow, nextArrow;
    if (galleryImages.length > 1) {
        prevArrow = document.createElement("img");
        prevArrow.src = "../../img/buttons/slideshow-arrows/gold-flourish.png";
        prevArrow.style.cssText = `
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%) scaleX(-1);
            width: 8rem;
            height: auto;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.2s ease, transform 0.3s ease, filter 0.2s ease;
            z-index: 999999;
        `;

        nextArrow = document.createElement("img");
        nextArrow.src = "../../img/buttons/slideshow-arrows/gold-flourish.png";
        nextArrow.style.cssText = `
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            width: 8rem;
            height: auto;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.2s ease, transform 0.3s ease, filter 0.2s ease;
            z-index: 999999;
        `;

        // Hover effects
        [prevArrow, nextArrow].forEach(arrow => {
            arrow.addEventListener("mouseenter", () => {
                arrow.style.opacity = '1';
                if (arrow === prevArrow) {
                    arrow.style.transform = "translateY(-50%) scaleX(-1) scale(1.1)";
                    arrow.style.filter = "brightness(1.2)";
                } else {
                    arrow.style.transform = "translateY(-50%) scale(1.1)";
                    arrow.style.filter = "brightness(1.2)";
                }
            });

            arrow.addEventListener("mouseleave", () => {
                arrow.style.opacity = '0.8';
                if (arrow === prevArrow) {
                    arrow.style.transform = "translateY(-50%) scaleX(-1)";
                    arrow.style.filter = "none";
                } else {
                    arrow.style.transform = "translateY(-50%)";
                    arrow.style.filter = "none";
                }
            });

            // Click effects
            arrow.addEventListener("mousedown", () => {
                if (arrow === prevArrow) {
                    arrow.style.transform = "translateY(-50%) scaleX(-1) scale(0.95)";
                } else {
                    arrow.style.transform = "translateY(-50%) scale(0.95)";
                }
                arrow.style.filter = "brightness(0.8)";
            });

            arrow.addEventListener("mouseup", () => {
                if (arrow === prevArrow) {
                    arrow.style.transform = "translateY(-50%) scaleX(-1) scale(1.1)";
                } else {
                    arrow.style.transform = "translateY(-50%) scale(1.1)";
                }
                arrow.style.filter = "brightness(1.2)";
            });
        });

        container.appendChild(prevArrow);
        container.appendChild(nextArrow);
    }

    container.appendChild(enlargedImg);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    // Navigation functions
    let currentImageIndex = currentIndex;

    function updateImage() {
        enlargedImg.src = galleryImages[currentImageIndex].src;
    }

    function goToPrevious() {
        if (galleryImages.length > 1) {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            updateImage();
        }
    }

    function goToNext() {
        if (galleryImages.length > 1) {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            updateImage();
        }
    }

    function closeEnlargedView() {
        document.body.removeChild(overlay);
        document.removeEventListener("keydown", handleKeydown);
        galleryModal.style.display = "block";
    }

    // Event listeners
    if (prevArrow && nextArrow) {
        prevArrow.addEventListener("click", (e) => {
            e.stopPropagation();
            goToPrevious();
        });

        nextArrow.addEventListener("click", (e) => {
            e.stopPropagation();
            goToNext();
        });
    }

    // Close enlarged view when clicking on background
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay || e.target === container) {
            e.stopPropagation();
            closeEnlargedView();
        }
    });

    // Keyboard navigation and close
    const handleKeydown = (e) => {
        if (e.key === "Escape") {
            closeEnlargedView();
        } else if (e.key === "ArrowLeft") {
            goToPrevious();
        } else if (e.key === "ArrowRight") {
            goToNext();
        }
    };
    document.addEventListener("keydown", handleKeydown);
}

// Main click handler using event delegation
document.addEventListener("click", async e => {
    const modal = document.getElementById("themeModal");

    // Handle theme grid item clicks - open gallery
    const item = e.target.closest(".themes-grid-item");
    if (item) {
        const theme = item.dataset.theme;
        console.log("Clicked theme:", theme);

        const modalGallery = document.getElementById("modalGallery");
        modalGallery.innerHTML = ""; // Clear any existing images

        try {
            // Fetch the image data from the JSON file
            const response = await fetch("../data/images.json");
            if (!response.ok) {
                throw new Error("Failed to fetch image data.");
            }
            const galleryData = await response.json();

            // Find the array of image paths for the clicked theme
            const imageUrls = galleryData[theme];

            // If images are found, create and append them to the gallery
            if (imageUrls && imageUrls.length > 0) {
                imageUrls.forEach((src) => {
                    const img = document.createElement("img");
                    img.src = src;
                    img.style.cursor = "pointer";
                    modalGallery.appendChild(img);
                });
            } else {
                modalGallery.innerHTML = "<p>No images found for this theme.</p>";
            }
        } catch (error) {
            console.error("Error loading gallery images:", error);
            modalGallery.innerHTML = `<p>Error loading gallery. Please try again.</p>`;
        }

        // Move modal to body and show it
        document.body.appendChild(modal);
        modal.style.display = "block";
        modal.style.zIndex = "99999";
        return;
    }

    // Handle close button clicks
    if (e.target.matches(".close")) {
        modal.style.display = "none";
        return;
    }

    // Handle gallery image clicks - enlarge image
    if (e.target.matches("#modalGallery img")) {
        e.stopPropagation();
        console.log("Gallery image clicked:", e.target.src);
        enlargeImage(e.target.src);
        return;
    }

    // Handle modal background clicks - close gallery
    if (modal && modal.style.display === "block") {
        // Don't close if clicking on a theme grid item (handled above)
        const clickedThemeItem = e.target.closest(".themes-grid-item");
        if (clickedThemeItem) return;

        // Don't close if clicking on gallery images (handled above)
        const clickedImage = e.target.closest("#modalGallery img");
        if (clickedImage) return;

        // Don't close if clicking on the close button (handled above)
        if (e.target.matches(".close")) return;

        // Don't close if there's an enlarged image overlay open
        const enlargedOverlay = document.getElementById("enlargedImageOverlay");
        if (enlargedOverlay && enlargedOverlay.style.display === "flex") {
            return;
        }

        // Close the modal
        console.log("Closing modal - clicked on:", e.target, "closest modal-content:", e.target.closest(".modal-content"));
        modal.style.display = "none";
    }
});

