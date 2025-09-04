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
    background: rgba(0, 0, 0, 0.95);
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
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
    cursor: default;
  `;
  
  // Navigation arrows (only show if more than one image)
  let prevArrow, nextArrow;
  if (galleryImages.length > 1) {
    prevArrow = document.createElement("button");
    prevArrow.innerHTML = "❮";
    prevArrow.style.cssText = `
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid rgba(255, 255, 255, 0.3);
      color: white;
      font-size: 24px;
      padding: 10px 15px;
      cursor: pointer;
      border-radius: 50%;
      backdrop-filter: blur(5px);
      transition: all 0.2s ease;
      z-index: 999999;
    `;
    
    nextArrow = document.createElement("button");
    nextArrow.innerHTML = "❯";
    nextArrow.style.cssText = `
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid rgba(255, 255, 255, 0.3);
      color: white;
      font-size: 24px;
      padding: 10px 15px;
      cursor: pointer;
      border-radius: 50%;
      backdrop-filter: blur(5px);
      transition: all 0.2s ease;
      z-index: 999999;
    `;
    
    // Hover effects
    [prevArrow, nextArrow].forEach(arrow => {
      arrow.addEventListener("mouseenter", () => {
        arrow.style.background = "rgba(255, 255, 255, 0.2)";
        arrow.style.transform = arrow === prevArrow ? "translateY(-50%) scale(1.1)" : "translateY(-50%) scale(1.1)";
      });
      arrow.addEventListener("mouseleave", () => {
        arrow.style.background = "rgba(255, 255, 255, 0.1)";
        arrow.style.transform = "translateY(-50%) scale(1)";
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
    // Show the gallery modal again
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
      e.stopPropagation(); // Prevent the click from bubbling up
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
document.addEventListener("click", e => {
  const modal = document.getElementById("themeModal");
  
  // Handle theme grid item clicks - open gallery
  const item = e.target.closest(".themes-grid-item");
  if (item) {
    const theme = item.dataset.theme;
    console.log("Clicked theme:", theme);

    const modalGallery = document.getElementById("modalGallery");

    // gallery mapping
    const galleries = {
      victorian: [
        "../../img/themes/victorian.jpg",
        "../../img/themes/victorian.jpg",
      ]
      // *** add more themes
    };

    modalGallery.innerHTML = "";
    galleries[theme]?.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      img.style.cursor = "pointer";
      modalGallery.appendChild(img);
    });

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
    if (enlargedOverlay) return;
    
    // Close the modal
    console.log("Closing modal - clicked on:", e.target, "closest modal-content:", e.target.closest(".modal-content"));
    modal.style.display = "none";
  }
});