console.log("✅ modal-gallery.js running");

function enlargeImage(imageSrc) {
    console.log("Enlarging image:", imageSrc);
    const galleryImages = Array.from(document.querySelectorAll("#modal-gallery img"));
    const currentIndex = galleryImages.findIndex(img => img.src.includes(imageSrc));
    const galleryModal = document.getElementById("theme-modal");

    galleryModal.style.display = "none";

    const overlay = document.createElement("div");
    overlay.id = "enlarged-img-overlay";

    overlay.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    const overlayContent = document.createElement("div");
    overlayContent.id = "overlay-content";

    const enlargedImageWrapper = document.createElement("div");
    enlargedImageWrapper.className = "enlarged-img-wrapper";

    const enlargedImageHeader = document.createElement("div");
    enlargedImageHeader.className = "enlarged-img-header";

    const closeContentContainer = document.createElement("div");
    closeContentContainer.className = "close-content-container";

    const galleryLogoContainer = document.createElement("div");
    galleryLogoContainer.className = "gallery-logo-container";

    const galleryLogo = document.createElement("img");
    galleryLogo.src = "../../img/logo/logo.webp";
    galleryLogo.className = "gallery-logo";

    const closeBtnWrapper = document.createElement("div");
    closeBtnWrapper.className = "close-btn-wrapper";

    const closeBtn = document.createElement("img");
    closeBtn.src = "../../img/assets/x.webp";
    closeBtn.className = "close-enlarged-btn";

    closeBtnWrapper.addEventListener("click", (e) => {
        e.stopPropagation();
        closeEnlargedView();
    });

    closeBtnWrapper.appendChild(closeBtn);
    galleryLogoContainer.appendChild(galleryLogo);
    closeContentContainer.appendChild(galleryLogoContainer);
    closeContentContainer.appendChild(closeBtnWrapper);
    enlargedImageHeader.appendChild(closeContentContainer);

    const container = document.createElement("div");
    container.className = "enlarged-image-container";

    const enlargedImg = document.createElement("img");
    enlargedImg.src = imageSrc;
    enlargedImg.className = "enlarged-img";

    let prevArrow, nextArrow;
    if (galleryImages.length > 1) {
        prevArrow = document.createElement("img");
        prevArrow.src = "../../img/assets/slideshow-arrows/gold-flourish.webp";
        prevArrow.className = "arrow-common prevArrow";
        
        nextArrow = document.createElement("img");
        nextArrow.src = "../../img/assets/slideshow-arrows/gold-flourish.webp";
        nextArrow.className = "arrow-common nextArrow";

        container.appendChild(prevArrow);
        container.appendChild(nextArrow);
    }

    enlargedImageWrapper.appendChild(enlargedImg);
    container.appendChild(enlargedImageWrapper);
    overlayContent.appendChild(enlargedImageHeader);
    overlayContent.appendChild(container);
    overlay.appendChild(overlayContent);
    document.body.appendChild(overlay);

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
        if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
        }

        document.removeEventListener("keydown", handleKeydown);
        galleryModal.style.display = "block";
    }

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

    overlay.addEventListener("click", (e) => {
        const isImage = e.target.classList.contains("enlarged-img");
        const isArrow = e.target.classList.contains("arrow-common");
        const isCloseBtn = e.target.closest(".close-btn-wrapper");

        if (!isImage && !isArrow && !isCloseBtn) {
            e.stopPropagation();
            closeEnlargedView();
        }
    });

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

function closeThemeModal() {
    const modal = document.getElementById("theme-modal");

    if (modal && modal.style.display === "block") {
        modal.style.display = "none";
        history.pushState(null, '', '#themes');
    }
}

export async function handleUrlHash() {
    const hash = window.location.hash;

    if (hash.startsWith("#themes/")) {
        const theme = hash.replace("#themes/", "");
        console.log("Opening theme from hash:", theme);
        const modal = document.getElementById("theme-modal");
        const modalGallery = document.getElementById("modal-gallery");

        if (!modalGallery || !modal) {
            console.warn("Gallery elements not found in the DOM.");
            return;
        }

        modalGallery.innerHTML = "";

        if (theme === "pirates") {
            const seasonalNoteContainer = document.createElement("div");
            seasonalNoteContainer.className = "seasonal-container";
            const seasonalNote = document.createElement("p");
            seasonalNote.className = "seasonal-notice";
            seasonalNote.innerHTML = "Please note: <br class='note-br'>Our pirates sail south for the winter.<br>Please contact us for availability.";
            modalGallery.appendChild(seasonalNoteContainer);
            seasonalNoteContainer.appendChild(seasonalNote);
        }

        if (theme === "winter-wonderland") {
            const seasonalNoteContainer = document.createElement("div");
            seasonalNoteContainer.className = "seasonal-container";
            const seasonalNote = document.createElement("p");
            seasonalNote.className = "seasonal-notice";
            seasonalNote.innerHTML = "Please note: <br class='note-br'>This theme is only available <br class='mobile-br'>during the winter season.<br>Please contact us for details.";
            modalGallery.appendChild(seasonalNoteContainer);
            seasonalNoteContainer.appendChild(seasonalNote);
        }

        try {
            const response = await fetch("../data/images.json");

            if (!response.ok) {
                throw new Error("Failed to fetch image data.");
            }

            const galleryData = await response.json();
            const imageUrls = galleryData[theme];

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

        document.body.appendChild(modal);
        modal.style.display = "block";
        modal.style.zIndex = "99999";
    }
}

document.addEventListener("click", async e => {
    const modal = document.getElementById("theme-modal");
    const item = e.target.closest(".themes-grid-item");

    if (item) {
        if (!modal) return;
        const theme = item.dataset.theme;
        console.log("Clicked theme:", theme);
        history.pushState(null, '', `#themes/${theme}`);
        handleUrlHash();
        return;
    }

    if (e.target.matches(".close")) {
        closeThemeModal();
        return;
    }

    if (e.target.matches("#modal-gallery img")) {
        e.stopPropagation();
        console.log("Gallery image clicked:", e.target.src);
        enlargeImage(e.target.src);
        return;
    }

    if (modal && modal.style.display === "block") {
        const clickedThemeItem = e.target.closest(".themes-grid-item");

        if (clickedThemeItem) return;

        const clickedImage = e.target.closest("#modal-gallery img");

        if (clickedImage) return;

        if (e.target.matches(".close")) return;

        const enlargedOverlay = document.getElementById("enlarged-img-overlay");

        if (enlargedOverlay && enlargedOverlay.style.display === "flex") {
            return;
        }

        console.log("Closing modal - clicked on:", e.target, "closest modal-content:", e.target.closest(".modal-content"));
        modal.style.display = "none";
        history.pushState(null, '', '#themes');
    }
});

window.addEventListener('hashchange', handleUrlHash);

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        const enlargedOverlay = document.getElementById("enlarged-img-overlay");

        if (!enlargedOverlay) {
            closeThemeModal();
        }
    }
});