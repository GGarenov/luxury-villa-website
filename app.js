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
