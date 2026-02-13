const heartsContainer = document.querySelector('.hearts');
const galleryImages = Array.from(document.querySelectorAll('.gallery-grid img'));
const photoUpload = document.querySelector('#photo-upload');
const PLACEHOLDER_SRC =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="%23f5b7d2" offset="0"/><stop stop-color="%23b784db" offset="1"/></linearGradient></defs><rect width="800" height="600" fill="url(%23g)"/><text x="50%" y="48%" text-anchor="middle" font-family="Poppins, Arial" font-size="42" fill="white">Add your photo</text><text x="50%" y="58%" text-anchor="middle" font-family="Poppins, Arial" font-size="24" fill="white">using Choose 4 photos</text></svg>';

function createHeart() {
  const heart = document.createElement('span');
  heart.className = 'heart';
  heart.textContent = '❤';
  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.fontSize = `${12 + Math.random() * 22}px`;
  heart.style.animationDuration = `${5 + Math.random() * 6}s`;
  heartsContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 11000);
}

function saveGallery(imageDataUrls) {
  localStorage.setItem('valentineGallery', JSON.stringify(imageDataUrls));
}

function loadSavedGallery() {
  try {
    const saved = JSON.parse(localStorage.getItem('valentineGallery') || '[]');
    if (!Array.isArray(saved)) {
      return;
    }

    saved.slice(0, galleryImages.length).forEach((src, index) => {
      if (typeof src === 'string' && src.startsWith('data:image/')) {
        galleryImages[index].src = src;
      }
    });
  } catch {
    localStorage.removeItem('valentineGallery');
  }
}

function setFallbackOnError(imageElement) {
  imageElement.addEventListener('error', () => {
    imageElement.src = PLACEHOLDER_SRC;
  });
}

function handlePhotoUpload(event) {
  const selectedFiles = Array.from(event.target.files || []).slice(0, galleryImages.length);
  if (!selectedFiles.length) {
    return;
  }

  const dataUrls = [];

  selectedFiles.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const result = String(loadEvent.target?.result || '');
      if (!result.startsWith('data:image/')) {
        return;
      }

      galleryImages[index].src = result;
      dataUrls[index] = result;

      if (dataUrls.filter(Boolean).length === selectedFiles.length) {
        saveGallery(dataUrls);
      }
    };
    reader.readAsDataURL(file);
  });
}

galleryImages.forEach(setFallbackOnError);
loadSavedGallery();
photoUpload.addEventListener('change', handlePhotoUpload);
setInterval(createHeart, 350);

// audio autoplay handling: browsers require a user gesture before playing sound
const audioElement = document.querySelector('audio');
if (audioElement) {
  // try to play immediately; if it fails, wait for user interaction
  audioElement.play().catch(() => {
    const startPlayback = () => {
      audioElement.play().catch(() => {});
      window.removeEventListener('click', startPlayback);
      window.removeEventListener('keydown', startPlayback);
    };
    window.addEventListener('click', startPlayback, {once: true});
    window.addEventListener('keydown', startPlayback, {once: true});
  });
}
