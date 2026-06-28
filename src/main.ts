import "./styles/main.css";

const $ = <T extends Element = Element>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);
const $$ = <T extends Element = Element>(sel: string, root: ParentNode = document) =>
  [...root.querySelectorAll<T>(sel)];

// ---------- Theme toggle ----------
const THEME_KEY = "portfolio_theme";
const themeToggle = $("#themeToggle");
const themeIcon = $("#themeIcon");
const html = document.documentElement;

function setTheme(theme: "dark" | "light") {
  html.setAttribute("data-theme", theme);
  if (themeIcon) themeIcon.textContent = theme === "dark" ? "☀" : "☾";
  localStorage.setItem(THEME_KEY, theme);
}

const saved = localStorage.getItem(THEME_KEY) as "dark" | "light" | null;
const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
setTheme(saved || (prefersDark ? "dark" : "light"));

themeToggle?.addEventListener("click", () => {
  setTheme(html.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

// ---------- Mobile nav ----------
const burger = $("#burger");
const navLinks = $("#navLinks");
if (burger && navLinks) {
  burger.addEventListener("click", () => navLinks.classList.toggle("open"));
  $$(".nav-links a", navLinks).forEach((a) =>
    a.addEventListener("click", () => navLinks.classList.remove("open"))
  );
}

// ---------- Hero cycling text ----------
const cycleEl = $("#heroCycle");
const cycleItems = [
  "AI/ML automation tools",
  "cloud-native SaaS platforms",
  "healthcare data integrations",
  "fintech workflow systems",
  "FHIR-based data exchange",
];

function cycleText(el: Element | null, items: string[], intervalMs: number) {
  if (!el) return;
  let i = 0;
  (el as HTMLElement).style.transition = "opacity .4s, transform .4s";
  setInterval(() => {
    (el as HTMLElement).style.opacity = "0";
    (el as HTMLElement).style.transform = "translateY(6px)";
    setTimeout(() => {
      i = (i + 1) % items.length;
      el.textContent = items[i];
      (el as HTMLElement).style.opacity = "1";
      (el as HTMLElement).style.transform = "translateY(0)";
    }, 300);
  }, intervalMs);
}

cycleText(cycleEl, cycleItems, 2600);

// ---------- Reveal on scroll ----------
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-visible"); }),
  { threshold: 0.1 }
);
$$(".reveal").forEach((el) => io.observe(el));

// ---------- Animated counters ----------
function animateCount(el: HTMLElement, to: number) {
  const duration = 900;
  const t0 = performance.now();
  function tick(t: number) {
    const p = Math.min(1, (t - t0) / duration);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))).toString();
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const metricIO = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    animateCount(e.target as HTMLElement, Number((e.target as HTMLElement).dataset.count || "0"));
    metricIO.unobserve(e.target);
  }),
  { threshold: 0.6 }
);
$$(".metric-num").forEach((el) => metricIO.observe(el));

// ---------- Back to top ----------
const toTop = $(".to-top");
if (toTop) {
  const toggle = () => toTop.classList.toggle("is-visible", window.scrollY > 500);
  window.addEventListener("scroll", toggle, { passive: true });
  toggle();
  toTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ---------- Card cursor glow ----------
$$<HTMLElement>(".card, .exp-item").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  });
});

// ---------- Hero card tilt ----------
const tiltCard = $<HTMLElement>("#tiltCard");
if (tiltCard) {
  tiltCard.addEventListener("mousemove", (e) => {
    const rect = tiltCard.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltCard.style.transform = `rotateY(${px * 10}deg) rotateX(${py * -10}deg)`;
    tiltCard.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    tiltCard.style.setProperty("--my", `${e.clientY - rect.top}px`);
  });
  tiltCard.addEventListener("mouseleave", () => {
    tiltCard.style.transform = "rotateY(0deg) rotateX(0deg)";
  });
}

// ---------- Footer year ----------
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear().toString();
