console.log("✅ modal-gallery.js running");

function enlargeImage(imageSrc) {
    console.log("Enlarging image:", imageSrc);
    const galleryImages = Array.from(document.querySelectorAll("#modalGallery img"));
    const currentIndex = galleryImages.findIndex(img => img.src.includes(imageSrc));
    const galleryModal = document.getElementById("themeModal");
    galleryModal.style.display = "none";
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
        if (e.target === overlay || e.target === container) {
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