/* ==========================================================================
   MANU VILLA — main script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader && preloader.classList.add('done'), 350);
  });
  // fallback in case 'load' is slow / video buffering
  setTimeout(() => preloader && preloader.classList.add('done'), 2500);

  /* ---------- AOS init ---------- */
  if (window.AOS) {
    AOS.init({
      duration: 800,
      once: true,
      offset: 60,
      easing: 'ease-out-cubic'
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar: glass-on-scroll + active link ---------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], .hero[id]');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    let current = 'home';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinksWrap = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const isOpen = navLinksWrap.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinksWrap.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinksWrap.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Parallax hero content on scroll ---------- */
  const heroContent = document.querySelector('.hero-content');
  const heroVideo = document.querySelector('.hero-video');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      if (heroContent) heroContent.style.transform = `translateY(${y * 0.25}px)`;
      if (heroVideo) heroVideo.style.transform = `translate(-50%, calc(-50% + ${y * 0.12}px))`;
    }
  }, { passive: true });

  /* ---------- Gallery: auto-load every image in /images ---------- */
  const masonry = document.getElementById('masonryGallery');
  const galleryImages = []; // populated as images resolve, used by lightbox

  // Candidate filenames — drop any image with these names into /images
  // and it will appear automatically. Covers common naming patterns.
  const candidates = [];
  const extensions = ['jpg', 'jpeg', 'png', 'webp'];
  for (let i = 1; i <= 30; i++) {
    extensions.forEach(ext => candidates.push(`images/gallery-${i}.${ext}`));
  }
  // also try a few generic / user-friendly names
  ['farm', 'view', 'sunset', 'garden', 'villa', 'dining', 'bonfire', 'pool', 'exterior', 'interior']
    .forEach(name => extensions.forEach(ext => candidates.push(`images/${name}.${ext}`)));

  let loadedCount = 0;
  let checkedCount = 0;
  const seen = new Set();

  function addToMasonry(src) {
    if (seen.has(src)) return;
    seen.add(src);
    loadedCount++;

    const item = document.createElement('div');
    item.className = 'masonry-item';
    item.setAttribute('data-aos', 'fade-up');
    item.setAttribute('data-aos-delay', String((loadedCount % 6) * 60));

    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Manu Villa homestay photo';
    img.loading = 'lazy';

    item.appendChild(img);
    masonry.appendChild(item);

    const idx = galleryImages.length;
    galleryImages.push(src);
    item.addEventListener('click', () => openLightbox(idx));

    if (window.AOS) AOS.refreshHard();
  }

  function finalizeGallery() {
    if (loadedCount === 0) {
      masonry.innerHTML = `
        <div class="gallery-empty">
          <p><strong>No photos found yet.</strong></p>
          <p>Add images to the <code>/images</code> folder (e.g. <code>gallery-1.jpg</code>, <code>gallery-2.jpg</code> …) and they'll appear here automatically.</p>
        </div>`;
    }
  }

  candidates.forEach(src => {
    const testImg = new Image();
    testImg.onload = () => {
      addToMasonry(src);
      checkedCount++;
      if (checkedCount === candidates.length) finalizeGallery();
    };
    testImg.onerror = () => {
      checkedCount++;
      if (checkedCount === candidates.length) finalizeGallery();
    };
    testImg.src = src;
  });

  // Safety net: if nothing resolves within 4s, show the empty state anyway
  setTimeout(() => { if (loadedCount === 0) finalizeGallery(); }, 4000);

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = galleryImages[currentIndex];
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function showDelta(delta) {
    if (!galleryImages.length) return;
    currentIndex = (currentIndex + delta + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIndex];
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showDelta(-1));
  lightboxNext.addEventListener('click', () => showDelta(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showDelta(-1);
    if (e.key === 'ArrowRight') showDelta(1);
  });

});
