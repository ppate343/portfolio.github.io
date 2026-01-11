// ---------- Helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const THEME_KEY = "portfolio_theme";

// ---------- Theme + favicon toggle ----------
const favicon = $("#favicon");
const themeToggle = $("#themeToggle");
const html = document.documentElement;

const savedTheme = localStorage.getItem(THEME_KEY);

// Default to dark if nothing is saved
setTheme(savedTheme || "dark");

function setTheme(theme) {
  html.setAttribute("data-theme", theme);

  // Toggle icon
  const icon = theme === "dark" ? "☀" : "☾";
  themeToggle.querySelector(".toggle-icon").textContent = icon;

  // Swap favicon
  favicon.setAttribute(
    "href",
    theme === "dark" ? "favicon-dark.png" : "favicon.png"
  );

  localStorage.setItem(THEME_KEY, theme);
}

// Initialize theme
const saved = localStorage.getItem(THEME_KEY);
const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
setTheme(saved || (prefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  setTheme(next);
});

// ---------- Mobile nav ----------
const burger = $("#burger");
const navLinks = $("#navLinks");

burger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

$$(".nav-links a").forEach(a => {
  a.addEventListener("click", () => navLinks.classList.remove("open"));
});

// ---------- Reveal on scroll ----------
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("is-visible");
    });
  },
  { threshold: 0.12 }
);

$$(".reveal").forEach((el) => io.observe(el));

// ---------- Animated counters ----------
function animateCount(el, to) {
  const start = 0;
  const duration = 900;
  const t0 = performance.now();

  function tick(t) {
    const p = Math.min(1, (t - t0) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(start + (to - start) * eased);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const metricIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const to = Number(el.dataset.count || "0");
      animateCount(el, to);
      metricIO.unobserve(el);
    });
  },
  { threshold: 0.6 }
);

$$(".metric-num").forEach((el) => metricIO.observe(el));

// ---------- Skills pie charts (animate to % on reveal) ----------
function setPie(pieEl, pct) {

  pieEl.style.setProperty("--pct", pct);
}

const pieIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const card = e.target;
      const pct = Number(card.dataset.pct || "50");
      const pie = card.querySelector(".pie");

      // animate percentage
      let current = 0;
      const duration = 900;
      const t0 = performance.now();

      function tick(t) {
        const p = Math.min(1, (t - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        current = Math.round(pct * eased);
        setPie(pie, current);
        // keep label in sync
        pie.querySelector("strong").textContent = `${current}%`;
        if (p < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      pieIO.unobserve(card);
    });
  },
  { threshold: 0.35 }
);

$$(".skill-card").forEach((card) => {
  // start at 0 visually
  const pie = card.querySelector(".pie");
  setPie(pie, 0);
  pieIO.observe(card);
});

// ---------- Card spotlight (mouse position) ----------
$$(".card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 100;
    const my = ((e.clientY - r.top) / r.height) * 100;
    card.style.setProperty("--mx", `${mx}%`);
    card.style.setProperty("--my", `${my}%`);
  });
});

// ---------- Footer year ----------
$("#year").textContent = new Date().getFullYear();


// ---- Switchable blog images ----
document.querySelectorAll(".switchable").forEach((container) => {
  const images = container.querySelectorAll(".switch-img");
  const buttons = container.querySelectorAll(".switch-btn");

  buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      images.forEach((img) => img.classList.remove("active"));
      buttons.forEach((b) => b.classList.remove("active"));

      images[index].classList.add("active");
      btn.classList.add("active");
    });
  });
});

const SKILL_ICON_MAP = {
  // Frontend / Full stack
  "React": "js.png",
  "TypeScript": "js.png",
  "JavaScript": "js.png",
  "HTML": "html.png",
  "CSS": "css.png",
  "Angular": "angular.png",
  "Node.js": "node.png",
  "Express": "express.png",
  "NPM": "npm.png",

  // AWS / Infra
  "AWS": "ec2.png",
  "EC2": "ec2.png",
  "IAM": "iam.png",
  "Linux": "linux.png",
  "IAM": "iam.png",
  "ACM": "acm.png",

  // DevOps / Delivery
  "Git": "git.png",
  "CI/CD": "git.png",

  // Data / Backend
  "MongoDB": "mongo.png",
  "MySQL": "mysql.png",
  "Postgres": "postgres.png",

  // Product / Tools
  "Jira": "jira.png",
  "Confluence": "confluence.png",
  "Bitbucket": "bitbucket.svg",
  "Figma": "figma.png",
  "Canva": "canva.png",
  "Artlist.io": "artlist.png",
  "Capcut": "capcut.jpg"
};

(() => {
  const titleEl = document.getElementById("skillsTitle");
  const descEl = document.getElementById("skillsDesc");
  const chipsEl = document.getElementById("skillsIcons");   
  const donutSegs = document.getElementById("donutSegs");
  const tip = document.getElementById("donutTip");
  const pills = document.querySelectorAll(".skill-pill");

  if (!titleEl || !descEl || !donutSegs || !tip || !pills.length) return;

  function renderChips(listStr) {
  if (!chipsEl) return;
  const items = (listStr || "").split(",").map(s => s.trim()).filter(Boolean);

  chipsEl.innerHTML = items.map(label => {
    const file = SKILL_ICON_MAP[label];

    const img = file
      ? `<img class="tech-icon" src="images/skills/${file}" alt="" loading="lazy">`
      : "";

    return `<span class="tech-chip" title="${label}">${img}${label}</span>`;
  }).join("");
}


  function renderDonut(listStr, weightsStr) {
  const labels = (listStr || "").split(",").map(s => s.trim()).filter(Boolean);
  const weights = (weightsStr || "")
    .split(",")
    .map(s => Number(s.trim()))
    .filter(n => Number.isFinite(n) && n > 0);

  donutSegs.innerHTML = "";

  // If no labels, nothing to draw
  if (!labels.length) return;

  // If weights provided: ONLY slice the weighted items (first N labels)
  const sliceLabels = weights.length > 0 ? labels.slice(0, weights.length) : labels;
  const sliceWeights = weights.length > 0 ? weights : Array(labels.length).fill(1);

  const sumW = sliceWeights.reduce((a, b) => a + b, 0);

  // Donut geometry
  const r = 42;
  const cx = 60, cy = 60;
  const C = 2 * Math.PI * r;

  // Gap between segments so they don't look like one ring
  const gap = 4.5;

  const base = getComputedStyle(document.documentElement)
    .getPropertyValue("--purple").trim() || "#4620f0";

  const donutBox = document.getElementById("skillsDonut");

  const showTip = (text, evt) => {
    tip.textContent = text;
    tip.classList.add("is-visible");

    const box = donutBox.getBoundingClientRect();
    tip.style.left = `${evt.clientX - box.left}px`;
    tip.style.top  = `${evt.clientY - box.top}px`;
    tip.style.transform = "translate(-50%, -130%)";
  };

  const hideTip = () => tip.classList.remove("is-visible");

  let acc = 0;

  sliceLabels.forEach((label, i) => {
    const segTotal = (C * sliceWeights[i]) / sumW;
    const segDraw = Math.max(1, segTotal - gap);
    const offset = -acc;

    const pct = Math.round((sliceWeights[i] / sumW) * 100);
    const tipText = `${label} • ${pct}%`;

    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("class", "donut-seg");
    c.setAttribute("cx", cx);
    c.setAttribute("cy", cy);
    c.setAttribute("r", r);
    c.setAttribute("stroke", base);
    c.setAttribute("stroke-dasharray", `${segDraw} ${C - segDraw}`);
    c.setAttribute("stroke-dashoffset", offset);

    c.addEventListener("mouseenter", (e) => showTip(tipText, e));
    c.addEventListener("mousemove", (e) => showTip(tipText, e));
    c.addEventListener("mouseleave", hideTip);

    donutSegs.appendChild(c);

    acc += segTotal;
  });
}



  function setSkill(btn) {
    const title = btn.getAttribute("data-title") || "Skill";
    const desc = btn.getAttribute("data-desc") || "";
    const icons = btn.getAttribute("data-icons") || "";
    const weights = btn.getAttribute("data-weights") || "";

    pills.forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    descEl.textContent = desc;

    renderDonut(icons, weights);
    renderChips(icons); 
  }


  pills.forEach(btn => btn.addEventListener("click", () => setSkill(btn)));

  const initial = document.querySelector(".skill-pill.is-active") || pills[0];
  setSkill(initial);
})();


(() => {
  const btn = document.querySelector(".to-top");
  if (!btn) return;

  const toggle = () => {
    const show = window.scrollY > 500;
    btn.classList.toggle("is-visible", show);
  };

  window.addEventListener("scroll", toggle, { passive: true });
  toggle();

  // Smooth scroll on click (keeps href for accessibility)
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    history.replaceState(null, "", "#top");
  });
})();
