/* ============================================================
   JUEGO: MEMORIA DE MACONDO
   Juego de parejas sobre las obras de Gabo.
   Cada obra tiene dos cartas: el TÍTULO y su AÑO + PISTA.
   Animaciones: volteo 3D en CSS, sacudida al fallar,
   pulso al acertar y lluvia de mariposas al ganar.
   ============================================================ */

(function memoryGame() {
  const board = document.getElementById("gameBoard");
  if (!board) return;

  const movesEl = document.getElementById("gameMoves");
  const pairsEl = document.getElementById("gamePairs");
  const timeEl = document.getElementById("gameTime");
  const winBox = document.getElementById("gameWin");
  const winText = document.getElementById("gameWinText");

  /* ---------- Datos: 6 obras = 12 cartas ---------- */
  const OBRAS = [
    { id: "hojarasca", titulo: "La hojarasca",                          pista: "1955 · Nace Macondo" },
    { id: "coronel",   titulo: "El coronel no tiene quien le escriba",  pista: "1961 · La carta que no llega" },
    { id: "cien",      titulo: "Cien años de soledad",                  pista: "1967 · Los Buendía" },
    { id: "cronica",   titulo: "Crónica de una muerte anunciada",       pista: "1981 · Un crimen anunciado" },
    { id: "colera",    titulo: "El amor en los tiempos del cólera",     pista: "1985 · Medio siglo de espera" },
    { id: "vivir",     titulo: "Vivir para contarla",                   pista: "2002 · Sus memorias" }
  ];

  let deck = [];        // cartas mezcladas
  let flipped = [];     // cartas volteadas en el turno actual (máx. 2)
  let matched = 0;      // parejas encontradas
  let moves = 0;
  let lock = false;     // bloquea clics mientras se resuelve un turno
  let timer = null, seconds = 0, started = false;

  /* ---------- Utilidades ---------- */
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    return m + ":" + String(s % 60).padStart(2, "0");
  }

  function startTimer() {
    if (started) return;
    started = true;
    timer = setInterval(() => {
      seconds++;
      timeEl.textContent = formatTime(seconds);
    }, 1000);
  }

  /* ---------- Construcción del tablero ---------- */
  function buildDeck() {
    deck = [];
    OBRAS.forEach((o) => {
      deck.push({ pair: o.id, face: o.titulo, kind: "titulo" });
      deck.push({ pair: o.id, face: o.pista,  kind: "pista"  });
    });
    shuffle(deck);
  }

  function render() {
    board.innerHTML = "";
    deck.forEach((card, i) => {
      const btn = document.createElement("button");
      btn.className = "mcard";
      btn.type = "button";
      btn.dataset.pair = card.pair;
      btn.dataset.index = i;
      btn.setAttribute("aria-label", "Carta oculta " + (i + 1));
      btn.style.animationDelay = (i * 45) + "ms"; // entrada escalonada
      btn.innerHTML =
        '<span class="mcard-inner">' +
        '  <span class="mcard-front" aria-hidden="true">🦋</span>' +
        '  <span class="mcard-back ' + card.kind + '">' + card.face + "</span>" +
        "</span>";
      btn.addEventListener("click", () => flip(btn));
      board.appendChild(btn);
    });
  }

  /* ---------- Lógica del juego ---------- */
  function flip(cardEl) {
    if (lock || cardEl.classList.contains("is-flipped") || cardEl.classList.contains("is-matched")) return;

    startTimer();
    cardEl.classList.add("is-flipped");
    flipped.push(cardEl);

    if (flipped.length < 2) return;

    // Turno completo
    moves++;
    movesEl.textContent = moves;
    const [a, b] = flipped;

    if (a.dataset.pair === b.dataset.pair) {
      // ¡Pareja!
      matched++;
      pairsEl.textContent = matched;
      a.classList.add("is-matched");
      b.classList.add("is-matched");
      flipped = [];
      if (matched === OBRAS.length) setTimeout(win, 650);
    } else {
      // Fallo: sacudida y se ocultan de nuevo
      lock = true;
      a.classList.add("shake");
      b.classList.add("shake");
      setTimeout(() => {
        a.classList.remove("is-flipped", "shake");
        b.classList.remove("is-flipped", "shake");
        flipped = [];
        lock = false;
      }, 900);
    }
  }

  function win() {
    clearInterval(timer);
    winText.textContent =
      "Encontraste las 6 parejas en " + moves + " movimientos y " + formatTime(seconds) + ".";
    winBox.hidden = false;
    requestAnimationFrame(() => winBox.classList.add("show"));
  }

  function reset() {
    clearInterval(timer);
    timer = null; seconds = 0; started = false;
    moves = 0; matched = 0; flipped = []; lock = false;
    movesEl.textContent = "0";
    pairsEl.textContent = "0";
    timeEl.textContent = "0:00";
    winBox.classList.remove("show");
    winBox.hidden = true;
    buildDeck();
    render();
  }

  document.getElementById("gameRestart").addEventListener("click", reset);
  document.getElementById("gamePlayAgain").addEventListener("click", reset);

  reset(); // primer tablero
})();
