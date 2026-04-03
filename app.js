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
  const triggers = document.querySelectorAll(
    ".villa__photo-trigger, .amenities__photo-trigger"
  );

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

// ==================== PHOTO TOUR (GALLERY) ====================

const P = (dir, file) => `./assets/images/${dir}/${file}`;

const galleryRooms = [
  {
    id: "exterior",
    label: "Exterior",
    summary: "Private entrance · Parking · Landscaped grounds",
    layout: "split",
    images: [
      "front_1.jpg",
      "front_2.jpg",
      "front_3.jpg",
      "front_4.jpg",
      "front_5.jpg",
      "front_6.jpg",
      "front_7.jpg",
      "front_8.jpg",
      "front_9.jpg",
      "front_10.jpg",
      "front_11.jpg",
      "front_12.jpg",
      "front_13.jpg",
      "front_14.jpg",
      "front_15.jpg",
      "front_16.jpg",
      "front17.jpg",
    ].map((f) => P("front_house", f)),
  },
  {
    id: "kitchen-living",
    label: "Kitchen & living",
    summary: "Open-plan kitchen · Dining · Natural light",
    layout: "split",
    images: ["mix1.jpg", "mix2.jpg", "mix3.jpg", "mix4.jpg", "mix5.jpg", "mix6.jpg", "mix7.jpg"].map(
      (f) => P("kitchen_living_room", f)
    ),
  },
  {
    id: "living",
    label: "Living room",
    summary: "Comfortable seating · Views · Relaxed atmosphere",
    images: ["living_room1.jpg", "living_room2.jpg", "living_room3.jpg"].map((f) =>
      P("living_room", f)
    ),
  },
  {
    id: "living-second",
    label: "Second living",
    summary: "Additional lounge space · Quiet corners",
    layout: "split",
    images: [
      "second_living_room_1.jpg",
      "second_living_room_2.jpg",
      "second_living_room_3.jpg",
      "second_living_room_4.jpg",
    ].map((f) => P("living_room_2", f)),
  },
  {
    id: "living-original",
    label: "Living (original)",
    summary: "Original living character · Bright interiors",
    images: [
      "living_room_original1.jpg",
      "living_room_original2.jpg",
      "living_room_original3.jpg",
      "living_room_original4.jpg",
      "living_room_original5.jpg",
      "living_room_original6.jpg",
      "living_room_original7.jpg",
      "living_room_original8.jpg",
      "living_room_original9.jpg",
      "living_room_original10.jpg",
      "living_room_original11.jpg",
      "living_room_original12.jpg",
      "living_room_original13.jpg",
    ].map((f) => P("living_room_original", f)),
  },
  {
    id: "bedroom-1",
    label: "Bedroom 1",
    summary: "En-suite · Quality bedding · Storage",
    images: ["bedroom_1.jpg", "bedroom_2.jpg", "bedroom_3.jpg"].map((f) => P("bedroom1", f)),
  },
  {
    id: "bedroom-2",
    label: "Bedroom 2",
    summary: "En-suite · Calm tones · Natural light",
    images: ["second_bedroom_1.jpg", "second_bedroom_2.jpg", "second_bedroom_3.jpg"].map((f) =>
      P("bedroom2", f)
    ),
  },
  {
    id: "bedroom-3",
    label: "Bedroom 3",
    summary: "En-suite · Restful space",
    images: ["third_bedroom_1.jpg", "third_bedroom_2.jpg", "third_bedroom_3.jpg"].map((f) =>
      P("bedroom3", f)
    ),
  },
  {
    id: "bathroom-1",
    label: "Bathroom 1",
    summary: "Modern fixtures · Walk-in shower",
    images: ["bathroom1.jpg", "bathroom2.jpg", "bathroom3.jpg"].map((f) => P("bathroom1", f)),
  },
  {
    id: "bathroom-2",
    label: "Bathroom 2",
    summary: "Premium finishes · Thoughtful layout",
    images: ["second_bathroom_1.jpg", "second_bathroom_2.jpg"].map((f) => P("bathroom2", f)),
  },
  {
    id: "bathroom-3",
    label: "Bathroom 3",
    summary: "Spa-like details · Quality fittings",
    images: [
      "third_bathroom_1.jpg",
      "third_bathroom_2.jpg",
      "third_bathroom_3.jpg",
      "third_bathroom_4.jpg",
    ].map((f) => P("bathroom_3", f)),
  },
  {
    id: "pool",
    label: "Pool & outdoor",
    summary: "Private pool · Sun terrace · Loungers",
    layout: "split",
    images: [
      "swimming_pool_1.jpg",
      "swimming_pool_2.jpg",
      "swimming_pool_3.jpg",
      "swimming_pool_4.jpg",
      "swimming_pool_5.jpg",
    ].map((f) => P("swimming_pool", f)),
  },
];

(() => {
  const navEl = document.getElementById("gallery-category-nav");
  const sectionsEl = document.getElementById("gallery-sections");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const lightboxCounter = document.getElementById("lightboxCounter");
  const lightboxMeta = document.getElementById("lightboxMeta");

  if (
    !navEl ||
    !sectionsEl ||
    !lightbox ||
    !lightboxImg ||
    !lightboxClose ||
    !lightboxPrev ||
    !lightboxNext ||
    !lightboxCounter ||
    !lightboxMeta
  ) {
    return;
  }

  const flatGallery = galleryRooms.flatMap((r) =>
    r.images.map((src) => ({ src, label: r.label }))
  );

  let lbIndex = 0;
  let lastFocus = null;

  const isGalleryOpen = () => !lightbox.hasAttribute("hidden");

  const updateLightbox = () => {
    const item = flatGallery[lbIndex];
    if (!item) return;
    lightboxImg.src = item.src;
    lightboxImg.alt = `${item.label} — photo ${lbIndex + 1}`;
    lightboxCounter.textContent = `${lbIndex + 1} / ${flatGallery.length}`;
    lightboxMeta.textContent = item.label;
    const multi = flatGallery.length > 1;
    lightboxPrev.hidden = !multi;
    lightboxNext.hidden = !multi;
  };

  const openLightbox = (index) => {
    lbIndex = ((index % flatGallery.length) + flatGallery.length) % flatGallery.length;
    lastFocus = document.activeElement;
    updateLightbox();
    lightbox.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  };

  const closeLightbox = () => {
    if (!isGalleryOpen()) return;
    lightbox.setAttribute("hidden", "");
    lightboxImg.removeAttribute("src");
    lightboxImg.alt = "";
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
    lastFocus = null;
  };

  const step = (delta) => {
    if (flatGallery.length < 2) return;
    lbIndex =
      (lbIndex + delta + flatGallery.length) % flatGallery.length;
    updateLightbox();
  };

  const createPhotoButton = (src, roomLabel, globalIdx, extraClass) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `photo-tour__cell${extraClass ? ` ${extraClass}` : ""}`;
    btn.dataset.globalIndex = String(globalIdx);
    btn.setAttribute("aria-label", `Open full size: ${roomLabel}`);
    const img = document.createElement("img");
    img.src = src;
    img.alt = `${roomLabel} — photo`;
    img.loading = "lazy";
    img.decoding = "async";
    btn.appendChild(img);
    btn.addEventListener("click", () => openLightbox(globalIdx));
    return btn;
  };

  const renderGallery = () => {
    navEl.innerHTML = "";
    sectionsEl.innerHTML = "";

    let globalIndex = 0;

    galleryRooms.forEach((room) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "photo-tour__chip";
      chip.setAttribute("aria-label", `Scroll to ${room.label}`);
      const thumbWrap = document.createElement("div");
      thumbWrap.className = "photo-tour__chip-thumb";
      const thumb = document.createElement("img");
      thumb.src = room.images[0];
      thumb.alt = "";
      thumb.loading = "lazy";
      thumbWrap.appendChild(thumb);
      const lab = document.createElement("span");
      lab.className = "photo-tour__chip-label";
      lab.textContent = room.label;
      chip.appendChild(thumbWrap);
      chip.appendChild(lab);
      chip.addEventListener("click", () => {
        document.getElementById(`gallery-${room.id}`)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
      navEl.appendChild(chip);

      const section = document.createElement("section");
      section.id = `gallery-${room.id}`;
      section.className = "photo-tour__section";

      const head = document.createElement("header");
      head.className = "photo-tour__section-head";
      const h3 = document.createElement("h3");
      h3.className = "photo-tour__section-title";
      h3.textContent = room.label;
      const sum = document.createElement("p");
      sum.className = "photo-tour__section-summary";
      sum.textContent = room.summary;
      head.appendChild(h3);
      head.appendChild(sum);
      section.appendChild(head);

      const useSplit =
        room.layout === "split" && room.images.length >= 3;

      if (useSplit) {
        const split = document.createElement("div");
        split.className = "photo-tour__split";
        const tall = createPhotoButton(
          room.images[0],
          room.label,
          globalIndex++,
          "photo-tour__cell--tall"
        );
        const stack = document.createElement("div");
        stack.className = "photo-tour__stack";
        stack.appendChild(
          createPhotoButton(room.images[1], room.label, globalIndex++)
        );
        stack.appendChild(
          createPhotoButton(room.images[2], room.label, globalIndex++)
        );
        split.appendChild(tall);
        split.appendChild(stack);
        section.appendChild(split);

        if (room.images.length > 3) {
          const grid = document.createElement("div");
          grid.className = "photo-tour__grid";
          for (let i = 3; i < room.images.length; i++) {
            grid.appendChild(
              createPhotoButton(room.images[i], room.label, globalIndex++)
            );
          }
          section.appendChild(grid);
        }
      } else {
        const grid = document.createElement("div");
        grid.className = "photo-tour__grid";
        room.images.forEach((src) => {
          grid.appendChild(createPhotoButton(src, room.label, globalIndex++));
        });
        section.appendChild(grid);
      }

      sectionsEl.appendChild(section);
    });
  };

  renderGallery();

  lightboxClose.addEventListener("click", closeLightbox);
  document.querySelectorAll("[data-gallery-lightbox-close]").forEach((el) => {
    el.addEventListener("click", closeLightbox);
  });

  lightboxPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    step(-1);
  });

  lightboxNext.addEventListener("click", (e) => {
    e.stopPropagation();
    step(1);
  });

  document.addEventListener(
    "keydown",
    (e) => {
      if (!isGalleryOpen()) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      }
    },
    true
  );
})();
