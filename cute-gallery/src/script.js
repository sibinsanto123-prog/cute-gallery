const gallery = document.getElementById('gallery');
const videoThumbs = Array.from(document.querySelectorAll('.video-thumb'));
const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lbImage');
const lbVideo = document.getElementById('lbVideo');
const lbCaption = document.getElementById('lbCaption');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
const audioToggle = document.getElementById('audioToggle');
const bgAudio = document.getElementById('bgAudio');

let images = Array.from(gallery.querySelectorAll('img'));
let current = 0;
let activeVideo = false;
let videoPausedAudio = false;

function openLightbox(index) {
  activeVideo = false;
  current = index;
  const img = images[current];
  lbVideo.classList.add('hidden');
  lbVideo.pause();
  lbImage.classList.remove('hidden');
  lbImage.src = img.src;
  lbImage.alt = img.alt || '';
  lbCaption.textContent = img.closest('figure')?.querySelector('figcaption')?.textContent || '';
  lightbox.classList.remove('hidden');
  lightbox.setAttribute('aria-hidden', 'false');
}

function openVideoLightbox(src, poster, pauseBgAudio = false) {
  activeVideo = true;
  lbImage.classList.add('hidden');
  lbVideo.classList.remove('hidden');
  lbVideo.src = src;
  if (poster) lbVideo.poster = poster;
  lbCaption.textContent = '🎬 Video';
  lightbox.classList.remove('hidden');
  lightbox.setAttribute('aria-hidden', 'false');
  if (pauseBgAudio) pauseBackgroundAudio();
  lbVideo.play().catch(() => {});
}

function closeLightbox() {
  lightbox.classList.add('hidden');
  lightbox.setAttribute('aria-hidden', 'true');
  if (activeVideo && lbVideo) {
    lbVideo.pause();
    lbVideo.currentTime = 0;
  }
  if (videoPausedAudio && bgAudio) {
    bgAudio.play().then(() => {
      if (audioToggle) audioToggle.textContent = '⏸ Pause';
    }).catch(() => {});
    videoPausedAudio = false;
  }
  activeVideo = false;
}

function showNext() {
  current = (current + 1) % images.length;
  openLightbox(current);
}

function showPrev() {
  current = (current - 1 + images.length) % images.length;
  openLightbox(current);
}

images.forEach((img, idx) => {
  img.addEventListener('click', () => openLightbox(idx));
});

videoThumbs.forEach((thumb) => {
  thumb.addEventListener('click', () => {
    const src = thumb.dataset.src;
    const poster = thumb.dataset.poster;
    const pauseBgAudio = thumb.dataset.pauseBg === 'true';
    if (src) openVideoLightbox(src, poster, pauseBgAudio);
  });
});

lbClose.addEventListener('click', closeLightbox);
lbNext.addEventListener('click', showNext);
lbPrev.addEventListener('click', showPrev);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

if (lbImage) {
  lbImage.addEventListener('click', () => {
    setTimeout(() => closeLightbox(), 80);
  });
}

if (lbVideo) {
  lbVideo.addEventListener('click', () => {
    if (lbVideo.paused) lbVideo.play().catch(() => {});
    else lbVideo.pause();
  });
}

let touchStartX = 0;
let touchStartY = 0;
lightbox.addEventListener('touchstart', (e) => {
  if (!e.touches || e.touches.length === 0) return;
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});
lightbox.addEventListener('touchend', (e) => {
  if (touchStartX === 0 && touchStartY === 0) return;
  const touch = e.changedTouches[0];
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0) showNext(); else showPrev();
  }
  touchStartX = 0;
  touchStartY = 0;
});

function pauseBackgroundAudio() {
  if (bgAudio && !bgAudio.paused) {
    videoPausedAudio = true;
    bgAudio.pause();
    if (audioToggle) audioToggle.textContent = '▶ Play';
  } else {
    videoPausedAudio = false;
  }
}

if (audioToggle && bgAudio) {
  bgAudio.play().then(() => {
    audioToggle.textContent = '⏸ Pause';
  }).catch(() => {
    audioToggle.textContent = bgAudio.paused ? '▶ Play' : '⏸ Pause';
  });

  audioToggle.addEventListener('click', () => {
    if (bgAudio.paused) {
      bgAudio.play().catch(() => {});
      audioToggle.textContent = '⏸ Pause';
    } else {
      bgAudio.pause();
      audioToggle.textContent = '▶ Play';
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (lightbox.classList.contains('hidden')) return;
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'Escape') closeLightbox();
});

export function refreshGallery() {
  images = Array.from(gallery.querySelectorAll('img'));
  images.forEach((img, idx) => {
    img.dataset.index = idx;
    img.onclick = () => openLightbox(idx);
  });
}

window.cuteGallery = { openLightbox, closeLightbox, showNext, showPrev, refreshGallery };

;(function setupFloatingHearts() {
  const container = document.getElementById('floatingHearts');
  if (!container) return;
  const colors = ['#ff7ab6', '#ff9ac2', '#ffd1e8', '#ffb3d9', '#ffdfec', '#ff6f91'];

  function createHeart() {
    const el = document.createElement('div');
    el.className = 'heart';
    el.textContent = '❤';
    const size = Math.floor(Math.random() * 36) + 20;
    el.style.fontSize = size + 'px';
    el.style.left = Math.random() * 100 + '%';
    el.style.color = colors[Math.floor(Math.random() * colors.length)];
    el.style.animationDuration = (Math.random() * 8 + 6) + 's';
    el.style.opacity = (Math.random() * 0.35 + 0.75).toString();
    container.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  setInterval(createHeart, 600);
})();
