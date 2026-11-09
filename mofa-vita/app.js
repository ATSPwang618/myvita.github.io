'use strict';

// Content stays visible if JavaScript is unavailable.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  document.documentElement.classList.add('js');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}

const stars = document.querySelector('.stars');
if (!reducedMotion.matches) {
  for (let index = 0; index < 23; index++) {
    const star = document.createElement('span');
    star.className = 'star';
    star.style.cssText = `left:${(index * 37 + 11) % 100}%;top:${(index * 17 + 13) % 90}%;--duration:${5 + index % 7}s;animation-delay:-${index % 5}s`;
    stars.append(star);
  }
}

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() {
  mobileNav.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', '打开导航');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
  mobileNav.hidden = !open;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuToggle.focus(); }
});
window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const scenes = ['苍青之夜', '洋馆灯火', '魔法瞬间'];
const sceneButtons = [...document.querySelectorAll('.scene-button')];
const heroImages = [...document.querySelectorAll('.hero-image')];
let requestedScene = 0;
sceneButtons.forEach((button, index) => button.addEventListener('click', async () => {
  requestedScene = index;
  const target = heroImages[index];
  if (target.dataset.src) { target.src = target.dataset.src; delete target.dataset.src; }
  try { await target.decode(); } catch { return; }
  if (requestedScene !== index) return;
  heroImages.forEach((image, i) => image.classList.toggle('is-active', i === index));
  sceneButtons.forEach((item, i) => {
    item.classList.toggle('is-active', i === index);
    item.setAttribute('aria-pressed', String(i === index));
  });
  document.querySelector('.scene-label').textContent = `0${index + 1} / ${scenes[index]}`;
}));

const galleryItems = [...document.querySelectorAll('.gallery-item')];
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
let currentImage = 0;
let returnFocus;
function showImage(index) {
  currentImage = (index + galleryItems.length) % galleryItems.length;
  const original = galleryItems[currentImage].querySelector('img');
  lightboxImage.src = original.src;
  lightboxImage.alt = original.alt;
  document.querySelector('#lightbox-title').textContent = original.alt;
  document.querySelector('#lightbox-count').textContent = `0${currentImage + 1} / 0${galleryItems.length}`;
}
galleryItems.forEach((button, index) => button.addEventListener('click', () => {
  if (typeof lightbox.showModal !== 'function') { window.open(button.querySelector('img').src, '_blank', 'noopener'); return; }
  returnFocus = button;
  showImage(index);
  lightbox.showModal();
  document.body.classList.add('modal-open');
  document.querySelector('#lightbox-close').focus();
}));
document.querySelector('#lightbox-close').addEventListener('click', () => lightbox.close());
document.querySelector('#lightbox-prev').addEventListener('click', () => showImage(currentImage - 1));
document.querySelector('#lightbox-next').addEventListener('click', () => showImage(currentImage + 1));
lightbox.addEventListener('keydown', event => {
  if (event.key === 'Escape') { event.preventDefault(); lightbox.close(); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showImage(currentImage + 1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); showImage(currentImage - 1); }
});
lightbox.addEventListener('click', event => {
  const bounds = lightbox.getBoundingClientRect();
  if (event.target === lightbox && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) lightbox.close();
});
lightbox.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  returnFocus?.focus({ preventScroll: true });
});

const copyButton = document.querySelector('#copy-path');
const feedback = document.querySelector('#copy-feedback');
let feedbackTimer;
copyButton.addEventListener('click', async () => {
  const path = 'ux0:data/WitchontheHolyNight/assets/';
  clearTimeout(feedbackTimer);
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('clipboard unavailable');
    await navigator.clipboard.writeText(path);
    feedback.textContent = '已复制资源目录';
    copyButton.querySelector('span').textContent = '已复制';
  } catch {
    feedback.textContent = '请长按或选择上方路径，手动复制。';
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('.path-bar code'));
    const selection = window.getSelection();
    selection.removeAllRanges(); selection.addRange(range);
  }
  feedbackTimer = window.setTimeout(() => { feedback.textContent = ''; copyButton.querySelector('span').textContent = '复制路径'; }, 4500);
});
