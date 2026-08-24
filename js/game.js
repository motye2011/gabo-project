/* ============================================================
   JUEGO: MEMORIA VALORANT
   Parejas Agente FOTO ↔ NOMBRE+ROL.
   Una carta muestra el retrato oficial, su gemela el nombre.
   ============================================================ */

(function memoryGame() {
  const board = document.getElementById("gameBoard");
  if (!board) return;

  const movesEl = document.getElementById("gameMoves");
  const pairsEl = document.getElementById("gamePairs");
  const timeEl = document.getElementById("gameTime");
  const winBox = document.getElementById("gameWin");
  const winText = document.getElementById("gameWinText");

  /* ---------- Datos: 6 agentes = 12 cartas FOTO ↔ NOMBRE ---------- */
  const OBRAS = [
    { id: "jett",     nombre: "Jett",     rol: "Duelista",   img: "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png" },
    { id: "phoenix",  nombre: "Phoenix",  rol: "Duelista",   img: "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/displayicon.png" },
    { id: "sage",     nombre: "Sage",     rol: "Centinela",  img: "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/displayicon.png" },
    { id: "sova",     nombre: "Sova",     rol: "Iniciador",  img: "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/displayicon.png" },
    { id: "reyna",    nombre: "Reyna",    rol: "Duelista",   img: "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/displayicon.png" },
    { id: "killjoy",  nombre: "Killjoy",  rol: "Centinela",  img: "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/displayicon.png" }
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
      // Carta FOTO: img oficial
      deck.push({ pair: o.id, face: '<img src="' + o.img + '" alt="' + o.nombre + '" loading="lazy" width="80" height="80">', kind: "foto" });
      // Carta NOMBRE: nombre + rol
      deck.push({ pair: o.id, face: '<strong>' + o.nombre + '</strong><br><span style="font-size:0.78em;opacity:0.9">' + o.rol + '</span>', kind: "nombre" });
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
      btn.setAttribute("aria-label", "Carta oculta " + (i + 1) + " — encuentra el agente");
      btn.style.animationDelay = (i * 45) + "ms";
      const frontIcon = '<span class="mcard-front" aria-hidden="true"><span style="font-weight:900;letter-spacing:0.06em;">V</span></span>';
      btn.innerHTML =
        '<span class="mcard-inner">' +
        frontIcon +
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
      "¡Protocolo completado! Emparejaste los 6 agentes en " + moves + " movimientos y " + formatTime(seconds) + ". GG!";
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
