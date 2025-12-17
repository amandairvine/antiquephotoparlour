console.log("✅ modal-gallery.js running");

function enlargeImage(imageSrc) {
    console.log("Enlarging image:", imageSrc);
    const galleryImages = Array.from(document.querySelectorAll("#modalGallery img"));
    const currentIndex = galleryImages.findIndex(img => img.src.includes(imageSrc));
    const galleryModal = document.getElementById("themeModal");
    galleryModal.style.display = "none";
    const overlay = document.createElement("div");
    overlay.id = "enlargedImageOverlay";

    const overlayContent = document.createElement("div");
    overlayContent.id = "overlayContent";

    const enlargedImageWrapper = document.createElement("div");
    enlargedImageWrapper.className = "enlarged-img-wrapper";

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

    // close-btn-wrapper
    closeBtnWrapper.appendChild(closeBtn);

    // gallery-logo-container
    galleryLogoContainer.appendChild(galleryLogo);

    // .close-content-container
    closeContentContainer.appendChild(galleryLogoContainer);
    closeContentContainer.appendChild(closeBtnWrapper);

    const container = document.createElement("div");
    container.className = "enlargedImageContainer";

    const enlargedImg = document.createElement("img");
    enlargedImg.src = imageSrc;
    enlargedImg.className = "enlargedImg";

    let prevArrow, nextArrow;
    if (galleryImages.length > 1) {
        prevArrow = document.createElement("img");
        prevArrow.src = "../../img/assets/slideshow-arrows/gold-flourish.webp";
        nextArrow = document.createElement("img");
        nextArrow.src = "../../img/assets/slideshow-arrows/gold-flourish.webp";
        prevArrow.className = "arrow-common prevArrow";
        nextArrow = document.createElement("img");
        nextArrow.src = "../../img/assets/slideshow-arrows/gold-flourish.webp";
        nextArrow.className = "arrow-common nextArrow";

        container.appendChild(prevArrow);
        container.appendChild(nextArrow);
    }

    // .enlarged-img-wrapper
    enlargedImageWrapper.appendChild(enlargedImg);

    // .enlargedImageContainer
    container.appendChild(enlargedImageWrapper);
    
    // #overlayContent
    overlayContent.appendChild(closeContentContainer);
    overlayContent.appendChild(container);

    // .enlargedImageOverlay
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
        document.body.removeChild(overlay);
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
        if (e.target === overlay || e.target === container || e.target === overlayContent) {
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
async function handleUrlHash() {
    const hash = window.location.hash;
    if (hash.startsWith("#themes/")) {
        const theme = hash.replace("#themes/", "");
        console.log("Opening theme from hash:", theme);
        const modal = document.getElementById("themeModal");
        const modalGallery = document.getElementById("modalGallery");
        modalGallery.innerHTML = "";
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
    const modal = document.getElementById("themeModal");
    const item = e.target.closest(".themes-grid-item");
    if (item) {
        const theme = item.dataset.theme;
        console.log("Clicked theme:", theme);
        history.pushState(null, '', `#themes/${theme}`);
        handleUrlHash();
        return;
    }
    if (e.target.matches(".close")) {
        modal.style.display = "none";
        history.pushState(null, '', '#themes');
        return;
    }
    if (e.target.matches("#modalGallery img")) {
        e.stopPropagation();
        console.log("Gallery image clicked:", e.target.src);
        enlargeImage(e.target.src);
        return;
    }
    if (modal && modal.style.display === "block") {
        const clickedThemeItem = e.target.closest(".themes-grid-item");
        if (clickedThemeItem) return;
        const clickedImage = e.target.closest("#modalGallery img");
        if (clickedImage) return;
        if (e.target.matches(".close")) return;
        const enlargedOverlay = document.getElementById("enlargedImageOverlay");
        if (enlargedOverlay && enlargedOverlay.style.display === "flex") {
            return;
        }
        console.log("Closing modal - clicked on:", e.target, "closest modal-content:", e.target.closest(".modal-content"));
        modal.style.display = "none";
        history.pushState(null, '', '#themes');
    }
});
window.addEventListener('hashchange', handleUrlHash);