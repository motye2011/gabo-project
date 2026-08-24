/* ============================================================
   LA VIDA DE GABO — JavaScript
   1. Mariposas amarillas en el hero (canvas)
   2. Animaciones de aparición al hacer scroll (IntersectionObserver)
   3. Contadores animados en las estadísticas
   4. Menú hamburguesa en móvil
   5. Botón "volver arriba"
   ============================================================ */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 1. Mariposas amarillas (el guiño a Mauricio Babilonia) ---------- */
(function butterflies() {
  const canvas = document.getElementById("butterflies");
  if (!canvas || reducedMotion) return;

  const ctx = canvas.getContext("2d");
  let width, height, flock = [];

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  }

  function makeButterfly() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: 5 + Math.random() * 8,          // tamaño del ala
      angle: Math.random() * Math.PI * 2,   // dirección de vuelo
      speed: 0.25 + Math.random() * 0.55,
      flap: Math.random() * Math.PI * 2,    // fase del aleteo
      flapSpeed: 0.12 + Math.random() * 0.12,
      drift: (Math.random() - 0.5) * 0.02,  // giro suave
      alpha: 0.5 + Math.random() * 0.5
    };
  }

  function draw(b) {
    const wing = Math.abs(Math.sin(b.flap)); // 0 = alas cerradas, 1 = abiertas
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.angle + Math.PI / 2);
    ctx.globalAlpha = b.alpha;
    ctx.fillStyle = "#f2c14e";

    // Ala izquierda y derecha (elipses que se pliegan con el aleteo)
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(
        side * b.size * 0.55 * wing, 0,
        b.size * 0.6 * Math.max(wing, 0.25), b.size,
        side * 0.5, 0, Math.PI * 2
      );
      ctx.fill();
    }

    // Cuerpo
    ctx.globalAlpha = b.alpha * 0.9;
    ctx.fillStyle = "#b58a2a";
    ctx.beginPath();
    ctx.ellipse(0, 0, b.size * 0.14, b.size * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function step() {
    ctx.clearRect(0, 0, width, height);
    for (const b of flock) {
      b.flap += b.flapSpeed;
      b.angle += b.drift + Math.sin(b.flap * 0.3) * 0.01;
      b.x += Math.cos(b.angle) * b.speed;
      b.y += Math.sin(b.angle) * b.speed - 0.08; // tienden a subir

      // Reaparecen por el lado contrario al salir
      if (b.x < -20) b.x = width + 20;
      if (b.x > width + 20) b.x = -20;
      if (b.y < -20) b.y = height + 20;
      if (b.y > height + 20) b.y = -20;

      draw(b);
    }
    requestAnimationFrame(step);
  }

  resize();
  const count = Math.min(26, Math.max(10, Math.floor(width / 60)));
  flock = Array.from({ length: count }, makeButterfly);
  window.addEventListener("resize", resize);
  step();
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
