(() => {
  'use strict';
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('.nav');
  if (menu && nav) {
    const close = () => {
      nav.classList.remove('is-open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'メニューを開く');
    };
    menu.addEventListener('click', () => {
      const opening = menu.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('is-open', opening);
      menu.setAttribute('aria-expanded', String(opening));
      menu.setAttribute('aria-label', opening ? 'メニューを閉じる' : 'メニューを開く');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        close();
        menu.focus();
      }
    });
    document.addEventListener('pointerdown', event => {
      if (!nav.contains(event.target) && !menu.contains(event.target)) close();
    });
    window.matchMedia('(min-width: 851px)').addEventListener('change', event => {
      if (event.matches) close();
    });
  }

  const root = document.querySelector('.hero-carousel');
  if (!root) return;
  const track = root.querySelector('.hero-track');
  const slides = [...root.querySelectorAll('.hero-slide')];
  const dots = [...root.querySelectorAll('.carousel-dots button')];
  const counter = document.querySelector('.hero-current');
  const progress = document.querySelector('.progress-line i');
  const status = root.querySelector('.carousel-status');
  if (!track || !slides.length) return;
  let current = 0;
  const update = (announce = false) => {
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((slide, i) => {
      slide.setAttribute('aria-hidden', String(i !== current));
      slide.setAttribute('aria-label', `${i + 1} / ${slides.length}`);
    });
    dots.forEach((dot, i) => {
      if (i === current) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    if (counter) counter.textContent = String(current + 1).padStart(2, '0');
    if (progress) progress.style.transform = `translateX(${current * 100}%)`;
    if (status && announce) status.textContent = `${slides.length}枚中${current + 1}枚目の建築イメージ`;
  };
  const go = index => {
    current = (index + slides.length) % slides.length;
    update(true);
  };
  root.querySelector('.prev')?.addEventListener('click', () => go(current - 1));
  root.querySelector('.next')?.addEventListener('click', () => go(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => go(i)));
  root.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      go(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let startX = null;
  root.addEventListener('touchstart', event => {
    startX = event.changedTouches[0].clientX;
  }, { passive: true });
  root.addEventListener('touchend', event => {
    if (startX === null) return;
    const distance = event.changedTouches[0].clientX - startX;
    if (Math.abs(distance) > 45) go(current + (distance < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });
  update();
})();
