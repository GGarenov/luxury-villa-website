(() => {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("nav-toggle");
  const panel = document.getElementById("nav-menu");
  const linkSelector = '.nav__link[href^="#"]';

  if (!nav || !toggle || !panel) return;

  const setOpen = (open) => {
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  const closeMenu = () => setOpen(false);

  const isMobileNav = () => window.matchMedia("(max-width: 959px)").matches;

  toggle.addEventListener("click", () => {
    setOpen(!document.body.classList.contains("nav-open"));
  });

  const closeOnNavigate = () => {
    if (isMobileNav()) closeMenu();
  };

  panel.querySelectorAll(linkSelector).forEach((anchor) => {
    anchor.addEventListener("click", closeOnNavigate);
  });

  nav.querySelectorAll(".nav__cta").forEach((cta) => {
    cta.addEventListener("click", closeOnNavigate);
  });

  const brand = nav.querySelector(".nav__brand");
  const brandHref = brand?.getAttribute("href");
  if (brand && brandHref?.startsWith("#")) {
    brand.addEventListener("click", closeOnNavigate);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
      closeMenu();
      toggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 960px)").matches) {
      closeMenu();
    }
  });
})();

(() => {
  const root = document.querySelector("[data-hero-slider]");
  if (!root) return;

  const slides = [...root.querySelectorAll("[data-hero-slide]")];
  const prevBtn = root.querySelector("[data-hero-prev]");
  const nextBtn = root.querySelector("[data-hero-next]");
  const dotsContainer = root.querySelector("[data-hero-dots]");

  if (!slides.length || !prevBtn || !nextBtn || !dotsContainer) return;

  const autoplayMs = 6500;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let index = 0;
  let timerId = null;

  const go = (nextIndex) => {
    const i = ((nextIndex % slides.length) + slides.length) % slides.length;
    slides.forEach((slide, j) => {
      const active = j === i;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
    });
    root.querySelectorAll(".hero-slider__dot").forEach((dot, j) => {
      dot.classList.toggle("is-active", j === i);
      dot.setAttribute("aria-current", j === i ? "true" : "false");
    });
    index = i;
  };

  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "hero-slider__dot";
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.setAttribute("aria-current", i === 0 ? "true" : "false");
    if (i === 0) dot.classList.add("is-active");
    dot.addEventListener("click", () => {
      go(i);
      restartAutoplay();
    });
    dotsContainer.appendChild(dot);
  });

  const stopAutoplay = () => {
    if (timerId != null) {
      clearInterval(timerId);
      timerId = null;
    }
  };

  const startAutoplay = () => {
    if (reduceMotion.matches || slides.length < 2) return;
    stopAutoplay();
    timerId = window.setInterval(next, autoplayMs);
  };

  const restartAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  prevBtn.addEventListener("click", () => {
    prev();
    restartAutoplay();
  });

  nextBtn.addEventListener("click", () => {
    next();
    restartAutoplay();
  });

  if (slides.length < 2) {
    prevBtn.hidden = true;
    nextBtn.hidden = true;
    dotsContainer.hidden = true;
  } else {
    root.addEventListener("mouseenter", stopAutoplay);
    root.addEventListener("mouseleave", startAutoplay);
    root.addEventListener("focusin", stopAutoplay);
    root.addEventListener("focusout", (e) => {
      if (!e.relatedTarget || !root.contains(e.relatedTarget)) {
        startAutoplay();
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });

    reduceMotion.addEventListener("change", () => {
      if (reduceMotion.matches) stopAutoplay();
      else startAutoplay();
    });

    startAutoplay();
  }

  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
      restartAutoplay();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
      restartAutoplay();
    }
  });
})();

(() => {
  const root = document.getElementById("villa-lightbox");
  if (!root) return;

  const img = root.querySelector(".lightbox__img");
  const closeBtn = root.querySelector(".lightbox__close");
  const closeTargets = root.querySelectorAll("[data-lightbox-close]");
  const triggers = document.querySelectorAll(".villa__photo-trigger");

  if (!img || !closeBtn || !triggers.length) return;

  let lastFocus = null;

  const isOpen = () => !root.hasAttribute("hidden");

  const open = (trigger) => {
    const thumb = trigger.querySelector("img");
    if (!thumb?.src) return;
    lastFocus = document.activeElement;
    img.src = thumb.currentSrc || thumb.src;
    img.alt = thumb.alt || "";
    root.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  };

  const close = () => {
    if (!isOpen()) return;
    root.setAttribute("hidden", "");
    img.removeAttribute("src");
    img.alt = "";
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
    lastFocus = null;
  };

  triggers.forEach((btn) => {
    btn.addEventListener("click", () => open(btn));
  });

  closeTargets.forEach((el) => {
    el.addEventListener("click", () => close());
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) {
      e.preventDefault();
      close();
    }
  });
})();
