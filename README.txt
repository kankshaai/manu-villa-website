MANU VILLA — Website Setup Notes
=================================

FOLDER STRUCTURE
  index.html
  style.css
  script.js
  images/
  videos/hero.mp4

1) HERO VIDEO
   Place your video at:  videos/hero.mp4
   - Landscape, ideally 1920x1080 or larger, under ~15MB for fast loading.
   - It will autoplay, loop, and mute automatically.
   - Optional: add a poster frame at images/hero-poster.jpg (shown while the
     video loads on slow connections).

2) GALLERY IMAGES (auto-loading, no code changes needed)
   Drop photos into the /images folder using ANY of these filenames and they
   will appear in the masonry gallery automatically:
     gallery-1.jpg, gallery-2.jpg, gallery-3.jpg ... up to gallery-30.jpg
   (jpg, jpeg, png and webp are all supported — e.g. gallery-1.webp works too)

   You can add as few or as many as you like — the site only displays the
   ones that actually exist.

3) ABOUT SECTION PHOTO
   Add a portrait-oriented image at:  images/about-1.jpg
   (This is the framed photo next to the "50+ Trees" badge.)

4) FAVICON (optional)
   Add a square logo at: images/favicon.png

5) SOCIAL PREVIEW IMAGE (optional)
   images/gallery-1.jpg is reused as the link-preview image (og:image) when
   the site is shared on WhatsApp/Facebook/etc. — make sure it exists once
   you add gallery photos.

That's it — no build step, no npm install. Just open index.html in a browser,
or upload the whole folder to any static web host (Netlify, Vercel, GitHub
Pages, or your own hosting).
