// Get elements
const galleryItems = document.querySelectorAll('.gallery-item img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-content');
const closeBtn = document.querySelector('.close');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const filterButtons = document.querySelectorAll('.filters button');
const slideshowSound = document.getElementById('slideshowSound');

let currentIndex = 0;
let slideshowInterval = null;

// Open lightbox and start slideshow & sound
function openLightbox(index) {
  currentIndex = index;
  updateLightboxImage();
  lightbox.style.display = 'block';
  startSlideshow();
  playSound();
}

// Close lightbox and stop slideshow & sound
function closeLightbox() {
  lightbox.style.display = 'none';
  stopSlideshow();
  stopSound();
}

// Show previous image
function showPrev() {
  currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
  updateLightboxImage();
}

// Show next image
function showNext() {
  currentIndex = (currentIndex + 1) % galleryItems.length;
  updateLightboxImage();
}

// Update lightbox image
function updateLightboxImage() {
  lightboxImg.src = galleryItems[currentIndex].src;
}

// Start automatic slideshow
function startSlideshow() {
  slideshowInterval = setInterval(showNext, 3000);
}

// Stop slideshow
function stopSlideshow() {
  clearInterval(slideshowInterval);
}

// Reset slideshow after manual navigation
function resetSlideshow() {
  stopSlideshow();
  startSlideshow();
}

// Play soothing sound
function playSound() {
  slideshowSound.currentTime = 0; // start from the beginning
  slideshowSound.play();
}

// Stop soothing sound
function stopSound() {
  slideshowSound.pause();
  slideshowSound.currentTime = 0; // reset to beginning
}

// Event listeners
galleryItems.forEach((img, index) => {
  img.addEventListener('click', () => openLightbox(index));
});

closeBtn.addEventListener('click', closeLightbox);
prevBtn.addEventListener('click', () => {
  showPrev();
  resetSlideshow();
});
nextBtn.addEventListener('click', () => {
  showNext();
  resetSlideshow();
});

// Filter functionality
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.filters button.active').classList.remove('active');
    button.classList.add('active');

    const filter = button.getAttribute('data-filter');
    document.querySelectorAll('.gallery-item').forEach(item => {
      if (filter === 'all' || item.getAttribute('data-category') === filter) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
});
