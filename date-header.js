(() => {
  const date = document.querySelector('.event-date');
  const home = document.querySelector('.hero-date-slot');
  const dock = document.querySelector('.header-date-slot');
  const header = document.querySelector('header');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let docked = false;
  let frame = 0;
  let animation;

  function update() {
    frame = 0;
    const shouldDock = home.getBoundingClientRect().top <= header.getBoundingClientRect().bottom + 8;
    if (shouldDock === docked) return;
    animation?.cancel();
    const before = date.getBoundingClientRect();
    (shouldDock ? dock : home).append(date);
    docked = shouldDock;
    const after = date.getBoundingClientRect();
    if (!reducedMotion.matches) {
      animation = date.animate([
        { transform: `translate(${before.left - after.left}px, ${before.top - after.top}px)` },
        { transform: 'translate(0, 0)' }
      ], { duration: 260, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  update();
})();
