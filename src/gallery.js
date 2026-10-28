export function getSlideIndex(index, change, count) {
  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError('A gallery must contain at least one photo.');
  }
  if (!Number.isInteger(index) || !Number.isInteger(change)) {
    throw new TypeError('Gallery positions and changes must be integers.');
  }
  return ((index + change) % count + count) % count;
}

export function initialiseGallery() {
  const gallery = document.querySelector('.photo-carousel');
  if (!gallery) return;

  const slides = [...gallery.querySelectorAll('.photo-slide')];
  const viewport = gallery.querySelector('.photo-viewport');
  const controls = gallery.querySelector('.gallery-controls');
  const dots = gallery.querySelector('.gallery-dots');
  const status = gallery.querySelector('.gallery-status');
  const previous = gallery.querySelector('[data-gallery-previous]');
  const next = gallery.querySelector('[data-gallery-next]');
  const error = gallery.querySelector('.gallery-error');

  if (!slides.length || !viewport || !controls || !dots || !status || !previous || !next || !error) {
    throw new Error('The photo gallery is missing required elements.');
  }

  let current = 0;
  const dotButtons = slides.map((slide, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-dot';
    button.setAttribute('aria-label', `Show photo ${index + 1} of ${slides.length}`);
    button.addEventListener('click', () => showSlide(index));
    dots.append(button);
    const image = slide.querySelector('img');
    image.addEventListener('error', () => {
      if (current === index) error.hidden = false;
    });
    image.addEventListener('load', () => {
      if (current === index) error.hidden = true;
    });
    return button;
  });

  function showSlide(index) {
    current = getSlideIndex(index, 0, slides.length);
    slides.forEach((slide, position) => {
      slide.hidden = position !== current;
      dotButtons[position].setAttribute('aria-current', String(position === current));
    });
    status.textContent = `Photo ${current + 1} of ${slides.length}`;
    const image = slides[current].querySelector('img');
    error.hidden = !(image.complete && image.naturalWidth === 0);
  }

  previous.addEventListener('click', () => showSlide(current - 1));
  next.addEventListener('click', () => showSlide(current + 1));
  viewport.addEventListener('keydown', (event) => {
    const positions = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: slides.length - 1 };
    if (Object.hasOwn(positions, event.key)) {
      event.preventDefault();
      showSlide(positions[event.key]);
    }
  });

  let touchStart = null;
  viewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch') touchStart = { x: event.clientX, y: event.clientY };
  });
  viewport.addEventListener('pointerup', (event) => {
    if (event.pointerType !== 'touch' || !touchStart) return;
    const distance = event.clientX - touchStart.x;
    const verticalDistance = event.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(distance) > 45 && Math.abs(distance) > Math.abs(verticalDistance)) {
      showSlide(current + (distance < 0 ? 1 : -1));
    }
  });
  viewport.addEventListener('pointercancel', () => { touchStart = null; });

  showSlide(0);
  controls.hidden = slides.length < 2;
}
