// === Mobile nav toggle ===
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.getElementById("site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav.toggleAttribute("data-open");
  });

  // Close the menu when a link is clicked (mobile UX)
  siteNav.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    navToggle.setAttribute("aria-expanded", "false");
    siteNav.removeAttribute("data-open");
  });
}

// === Smooth scroll (progressive enhancement) ===
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const id = link.getAttribute("href");
  const target = document.querySelector(id);
  if (!target) return;

  e.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
});

// === Active section highlighting ===
const sections = Array.from(document.querySelectorAll("main section[id]"));
const navLinks = Array.from(
  document.querySelectorAll('.site-nav a[href^="#"]')
);

function setActive(id) {
  navLinks.forEach((a) => {
    const match = a.getAttribute("href") === `#${id}`;
    a.setAttribute("aria-current", match ? "page" : null);
  });
}

if ("IntersectionObserver" in window && sections.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { root: null, rootMargin: "0px 0px -60% 0px", threshold: 0.1 }
  );

  sections.forEach((s) => io.observe(s));
} else {
  // Fallback: on scroll, pick the nearest section
  window.addEventListener("scroll", () => {
    let current = sections[0]?.id;
    const fromTop = window.scrollY + 100;
    sections.forEach((sec) => {
      if (sec.offsetTop <= fromTop) current = sec.id;
    });
    if (current) setActive(current);
  });
}

// === Back-to-top button ===
const backToTop = document.querySelector(".back-to-top");

if (backToTop) {
  const toggleBtn = () => {
    if (window.scrollY > 600) backToTop.hidden = false;
    else backToTop.hidden = true;
  };

  window.addEventListener("scroll", toggleBtn, { passive: true });
  toggleBtn();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
