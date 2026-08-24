/* ============================================================
   CHATBOT "PREGÚNTALE A VALORANT"
   Bot basado en reglas — responde sobre agentes, mapas, Spike
   Radianita, VCT y parallax responsive. Efecto escribiendo.
   ============================================================ */

(function chatbot() {
  const fab = document.getElementById("chatFab");
  const win = document.getElementById("chatWindow");
  const closeBtn = document.getElementById("chatClose");
  const messages = document.getElementById("chatMessages");
  const chipsBox = document.getElementById("chatChips");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  if (!fab || !win) return;

  const KB = [
    {
      keys: ["jett"],
      reply: '💨 <strong>Jett</strong> (Duelista): Dash, Updraft, Smoked y cuchillos. Entra primera, corta ángulos y escapa. <a href="#obras">Ver Agentes</a>.'
    },
    {
      keys: ["phoenix"],
      reply: '🔥 <strong>Phoenix</strong> (Duelista): destellos, muro de fuego, curación y ultimate que le devuelve a la vida si cae.'
    },
    {
      keys: ["sage"],
      reply: '❄️ <strong>Sage</strong> (Centinela): muro, ralentización, cura y <strong>Resurrección</strong>. Clave para retomar y sostener post-plant.'
    },
    {
      keys: ["sova"],
      reply: '🏹 <strong>Sova</strong> (Iniciador): dardo revelador, dron y ultimate que atraviesa paredes. Info = ronda ganada.'
    },
    {
      keys: ["reyna"],
      reply: '👁️ <strong>Reyna</strong> (Duelista): se alimenta de frags — ceguera, curación y invulnerabilidad. Mecánica pura.'
    },
    {
      keys: ["killjoy"],
      reply: '🤖 <strong>Killjoy</strong> (Centinela): torreta, alarmbot, granada y bloqueo. Castiga el rush con nanoenjambre.'
    },
    {
      keys: ["viper", "omen", "brimstone", "cypher", "raze", "breach", "astra", "yoru", "neon", "chamber", "fade", "harbor", "gekko", "deadlock", "iso", "clove"],
      reply: '🃏 Ese agente también está en el Protocolo. Pregúntame por <strong>Jett, Phoenix, Sage, Sova, Reyna o Killjoy</strong> — están en <a href="#obras">Agentes</a> y en el <a href="#juego">juego de memoria</a>.'
    },
    {
      keys: ["agentes", "personajes", "duelista", "centinela", "iniciador", "controlador", "rol"],
      reply:
        '🧩 <strong>Roles</strong>: <br>' +
        '• <strong>Duelista</strong> (Jett, Phoenix, Reyna, Raze, Yoru, Neon, Iso)<br>' +
        '• <strong>Iniciador</strong> (Sova, Breach, Skye, KAY/O, Fade, Gekko)<br>' +
        '• <strong>Controlador</strong> (Brimstone, Viper, Omen, Astra, Harbor)<br>' +
        '• <strong>Centinela</strong> (Sage, Cypher, Killjoy, Chamber, Deadlock)<br>' +
        'Todos en <a href="#obras">Agentes</a>.'
    },
    {
      keys: ["mapas", "bind", "haven", "ascent", "split", "icebox", "breeze", "fracture", "pearl", "lotus", "sunset", "abyss", "corrode"],
      reply: '🗺️ <strong>Mapas</strong>: Bind, Haven, Ascent, Sunset, Lotus, Pearl, Fracture, Icebox, Breeze, Abyss. Cada uno exige lineups, control de mid y post-plant.'
    },
    {
      keys: ["spike", "planta", "desactivar", "plantar"],
      reply: '💣 <strong>Spike</strong>: 5v5 a 13 rondas. Atacantes plantan en site, defensores desactivan (3.5s, mitad 1.75s). Gestiona economía y definitivas.'
    },
    {
      keys: ["radianita", "radiante", "omega", "alpha", "historia", "lore", "protocolo"],
      reply: '🌌 Tras el <strong>Primer Luz</strong> la Radianita dividió el mundo en <strong>Alpha y Omega</strong>. El Protocolo VALORANT recluta radiantes para evitar el robo de Radianita interdimensional.'
    },
    {
      keys: ["vct", "champions", "masters", "esports", "riot"],
      reply: '🏆 <strong>VCT</strong>: ligas Américas/EMEA/Pacífico → Masters → Champions. El top mundial. Info en <a href="#centro-gabo">VCT</a> y en <a href="https://valorantesports.com" target="_blank" rel="noopener">valorantesports.com</a>.'
    },
    {
      keys: ["rango", "hierro", "bronce", "plata", "oro", "platino", "diamante", "ascendente", "inmortal"],
      reply: '📈 <strong>Rangos</strong>: Hierro → Bronce → Plata → Oro → Platino → Diamante → Ascendente → Inmortal → Radiante. ¿En cuál estás?'
    },
    {
      keys: ["juego", "memoria", "cartas", "protocolo"],
      reply: '🎮 ¡A jugar! Ve a <a href="#juego">Memoria del Protocolo</a>: empareja la <strong>foto</strong> del agente con su <strong>nombre</strong> en el menor número de movimientos.'
    },
    {
      keys: ["video", "trailer", "cinematica", "duelo"],
      reply: '🎬 Mira la cinemática <a href="#video">DUELO</a> en esta página — Jett vs Phoenix y la Spike.'
    },
    {
      keys: ["hola", "buenas", "hey", "hi", "wenas"],
      reply: '¡Hey, agente! ◆ Soy el bot de Valorant. Pregúntame por <strong>agentes</strong>, <strong>mapas</strong>, <strong>Spike</strong>, <strong>radianita</strong> o <strong>VCT</strong>.'
    },
    { keys: ["gracias", "ty", "gg"], reply: '¡GG WP! ◆ ¿Otra ronda? Pregúntame por un agente.' }
  ];

  const FALLBACK =
    'No tengo ese callout 🤔. Prueba con: <em>agentes</em>, <em>Jett</em>, <em>mapas</em>, <em>Spike</em>, <em>VCT</em> o <em>historia</em>.';

  const CHIPS = ["Agentes", "Jett", "Spike", "Mapas", "VCT", "Historia Radianita"];

  const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  function answerFor(text) {
    const q = normalize(text);
    for (const rule of KB) if (rule.keys.some((k) => q.includes(k))) return rule.reply;
    return FALLBACK;
  }
  function addMessage(html, who) {
    const div = document.createElement("div");
    div.className = "chat-msg " + who;
    div.innerHTML = html;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }
  function botReply(text) {
    const typing = addMessage('<span class="typing"><i></i><i></i><i></i></span>', "bot");
    setTimeout(() => { typing.innerHTML = answerFor(text); messages.scrollTop = messages.scrollHeight; }, 550 + Math.random()*450);
  }
  function send(text){ if(!text.trim()) return; addMessage(text.replace(/</g,"&lt;"), "user"); botReply(text); }

  CHIPS.forEach((label)=>{ const b=document.createElement("button"); b.type="button"; b.className="chip"; b.textContent=label; b.addEventListener("click",()=>send(label)); chipsBox.appendChild(b); });

  let greeted=false;
  function openChat(){ win.hidden=false; fab.setAttribute("aria-expanded","true"); requestAnimationFrame(()=>win.classList.add("open")); if(!greeted){ greeted=true; setTimeout(()=>{ addMessage('¡Hola, agente! ◆ Pregúntame por <strong>agentes</strong>, <strong>mapas</strong>, la <strong>Spike</strong> o el <strong>VCT</strong>. También juega <a href="#juego">Memoria del Protocolo</a>.',"bot"); },350); } input.focus(); }
  function closeChat(){ win.classList.remove("open"); fab.setAttribute("aria-expanded","false"); setTimeout(()=>{ win.hidden=true; },300); }
  fab.addEventListener("click", ()=> win.hidden ? openChat() : closeChat());
  closeBtn.addEventListener("click", closeChat);
  form.addEventListener("submit", (e)=>{ e.preventDefault(); send(input.value); input.value=""; });
})();
