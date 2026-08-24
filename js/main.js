/* ============================================================
   VALORANT — JavaScript
   1. Iconos Valorant flotantes en el hero (efecto táctico)
   2. Animaciones de aparición al hacer scroll (IntersectionObserver)
   3. Contadores animados en las estadísticas
   4. Menú hamburguesa en móvil
   5. Botón "volver arriba"
   ============================================================ */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 1. Iconos Valorant flotantes (reemplaza mariposas) ---------- */
(function valorantIcons() {
  const container = document.querySelector(".valorant-hero-icons");
  if (!container || reducedMotion) return;
  const icons = container.querySelectorAll(".v-icon");
  icons.forEach((el, i) => {
    const x = 10 + Math.random() * 80; // % left
    const delay = Math.random() * 6;
    const duration = 7 + Math.random() * 6;
    const size = 14 + Math.random() * 18;
    el.style.left = x + "%";
    el.style.top = (20 + Math.random() * 60) + "%";
    el.style.fontSize = size + "px";
    el.style.animationDelay = delay + "s";
    el.style.animationDuration = duration + "s";
    el.style.opacity = 0.08 + Math.random() * 0.12;
    // parallax leve al mover mouse
    el.dataset.parallax = (0.5 + Math.random() * 0.8).toFixed(2);
  });
  // parallax con mousemove
  const hero = document.querySelector(".hero");
  if (!hero) return;
  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    icons.forEach((el) => {
      const p = parseFloat(el.dataset.parallax);
      el.style.transform = `translate3d(${cx * 18 * p}px, ${cy * 18 * p}px, 0) rotate(${cx * 8}deg)`;
    });
  });
})();

/* ---------- 2. Aparición al hacer scroll ---------- */
(function scrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target); // solo anima una vez
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
})();

/* ---------- 3. Contadores animados ---------- */
(function counters() {
  const nums = document.querySelectorAll(".stat-num[data-count]");
  if (!nums.length) return;

  function animate(el) {
    const target = parseInt(el.dataset.count, 10);
    if (reducedMotion) { el.textContent = target; return; }

    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cúbico
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  nums.forEach((el) => observer.observe(el));
})();

/* ---------- 4. Menú hamburguesa ---------- */
(function mobileMenu() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Cierra el menú al elegir un enlace
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
})();

/* ---------- 5. Botón "volver arriba" ---------- */
(function toTop() {
  const btn = document.getElementById("toTop");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 600);
  }, { passive: true });
})();
