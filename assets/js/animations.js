(function () {
  (function initHero() {
    const hero = document.querySelector("[data-video-hero]");
    const videoLayer = document.querySelector("[data-hero-video-layer]");
    const titleLayer = document.querySelector("[data-hero-title-layer]");
    if (!hero || !videoLayer || !titleLayer) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pendingFrame = null;

    function reset() {
      if (pendingFrame !== null) {
        cancelAnimationFrame(pendingFrame);
        pendingFrame = null;
      }
      videoLayer.style.removeProperty("opacity");
      titleLayer.style.removeProperty("opacity");
    }

    function update() {
      pendingFrame = null;
      if (reducedMotion.matches) return;
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
      const eased = progress * progress * (3 - 2 * progress);
      const titleProgress = Math.min(1, progress / 0.75);
      const titleEased = titleProgress * titleProgress * (3 - 2 * titleProgress);
      videoLayer.style.opacity = String(1 - eased);
      titleLayer.style.opacity = String(1 - titleEased);
    }

    function schedule() {
      if (!reducedMotion.matches && pendingFrame === null) {
        pendingFrame = requestAnimationFrame(update);
      }
    }

    function preferenceChanged() {
      if (reducedMotion.matches) reset();
      else schedule();
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pageshow", schedule);
    if (reducedMotion.addEventListener) {
      reducedMotion.addEventListener("change", preferenceChanged);
    } else {
      reducedMotion.addListener(preferenceChanged);
    }
    schedule();
  })();

  var nodes = document.querySelectorAll(".animate-on-scroll");
  if (!nodes.length || !("IntersectionObserver" in window)) {
    nodes.forEach(function (el) {
      el.classList.remove("opacity-0", "translate-y-8");
      el.classList.add("opacity-100", "translate-y-0");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.remove("opacity-0", "translate-y-8");
        el.classList.add("opacity-100", "translate-y-0", "duration-1000", "ease-out");
        observer.unobserve(el);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  nodes.forEach(function (el) {
    observer.observe(el);
  });
})();
