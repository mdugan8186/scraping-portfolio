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

// === Smooth scroll + stable scroll-spy ===
const sections = Array.from(document.querySelectorAll("main section[id]"));
const navLinks = Array.from(
  document.querySelectorAll('.site-nav a[href^="#"]')
);
const headerEl = document.querySelector(".site-header");

function headerOffset() {
  return (headerEl?.offsetHeight || 0) + 8; // small buffer below sticky header
}

// Robust: match by hash only (handles "#id", "./#id", "/index.html#id")
function setActive(id) {
  navLinks.forEach((a) => {
    const href = a.getAttribute("href") || "";
    const hashIndex = href.indexOf("#");
    const targetId = hashIndex >= 0 ? href.slice(hashIndex + 1) : "";
    const match = targetId === id;
    if (match) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

let ticking = false;
let suppressSpy = false;

function updateActiveFromScroll() {
  // Robust bottom check (accounts for mobile address bar/UI)
  const doc = document.documentElement;
  const body = document.body;
  const scrollY = window.pageYOffset || doc.scrollTop || body.scrollTop || 0;
  const viewport = window.innerHeight || doc.clientHeight;
  const scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight);

  const atBottom = Math.ceil(scrollY + viewport) >= scrollHeight - 2;
  if (atBottom) {
    const last = sections[sections.length - 1];
    if (last) setActive(last.id);
    return;
  }

  const y = scrollY + headerOffset() + viewport * 0.35;
  let current = sections[0]?.id;
  for (const sec of sections) {
    if (sec.offsetTop <= y) current = sec.id;
    else break;
  }
  if (current) setActive(current);
}

window.addEventListener(
  "scroll",
  () => {
    if (suppressSpy) return;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveFromScroll();
        ticking = false;
      });
      ticking = true;
    }
  },
  { passive: true }
);

window.addEventListener("resize", () => updateActiveFromScroll());

// Sync highlight on hash navigation and initial load
window.addEventListener("hashchange", () => {
  const id = location.hash.slice(1);
  if (id) setActive(id);
});
window.addEventListener("load", () => {
  const id = location.hash.slice(1);
  if (id) setActive(id);
  else updateActiveFromScroll();
});

// Smooth scroll with suppression to avoid flicker while scrolling
function updateActiveFromScroll() {
  // Robust bottom check (accounts for mobile address bar/UI)
  const doc = document.documentElement;
  const body = document.body;
  const scrollY = window.pageYOffset || doc.scrollTop || body.scrollTop || 0;
  const viewport = window.innerHeight || doc.clientHeight;
  const scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight);

  const atBottom = Math.ceil(scrollY + viewport) >= scrollHeight - 2;
  if (atBottom) {
    const last = sections[sections.length - 1];
    if (last) setActive(last.id);
    return;
  }

  const y = scrollY + headerOffset() + viewport * 0.35;
  let current = sections[0]?.id;
  for (const sec of sections) {
    if (sec.offsetTop <= y) current = sec.id;
    else break;
  }
  if (current) setActive(current);
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
