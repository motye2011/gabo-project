/* ============================================================
   CHATBOT "PREGÚNTALE A GABO"
   Bot basado en reglas (sin servidor): detecta palabras clave
   y responde sobre la vida, las obras, el video del Nobel
   y el Centro Gabo. Incluye chips de sugerencias y efecto
   de "escribiendo…".
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

  /* ---------- Base de conocimiento ---------- */
  /* Cada regla: palabras clave (en minúscula, sin tildes) + respuesta.
     Se evalúan en orden; gana la primera que coincida. */
  const KB = [
    {
      keys: ["cien anos", "100 anos", "soledad", "buendia", "macondo"],
      reply:
        "📖 <strong>Cien años de soledad</strong> (1967) es su obra cumbre: la saga de siete generaciones " +
        "de la familia Buendía en Macondo, pueblo inspirado en Aracataca. Se ha traducido a más de 40 idiomas " +
        "y vendió decenas de millones de ejemplares. Es la novela central del realismo mágico. " +
        'Más info en la sección <a href="#obras">Obras</a>.'
    },
    {
      keys: ["coronel"],
      reply:
        "📖 <strong>El coronel no tiene quien le escriba</strong> (1961): un viejo coronel espera cada viernes, " +
        "con dignidad y hambre, la carta con la pensión de guerra que nunca llega. Gabo la escribió en París " +
        "mientras pasaba sus propias penurias económicas."
    },
    {
      keys: ["cronica", "muerte anunciada", "santiago nasar"],
      reply:
        "📖 <strong>Crónica de una muerte anunciada</strong> (1981): con pulso de reportero, Gabo reconstruye " +
        "el asesinato de Santiago Nasar, un crimen que todo el pueblo vio venir y nadie evitó. " +
        "Es el mejor ejemplo de su fusión entre periodismo y literatura."
    },
    {
      keys: ["colera", "amor en los tiempos", "florentino", "fermina"],
      reply:
        "📖 <strong>El amor en los tiempos del cólera</strong> (1985): Florentino Ariza espera más de medio " +
        "siglo por el amor de Fermina Daza. Inspirada en parte en el noviazgo de los padres de Gabo, " +
        "está ambientada en una ciudad caribeña que evoca a Cartagena."
    },
    {
      keys: ["putas tristes", "memoria de mis"],
      reply:
        "📖 <strong>Memoria de mis putas tristes</strong> (2004) fue su última novela publicada en vida: " +
        "una meditación sobre la vejez y el amor tardío."
    },
    {
      keys: ["vivir para contarla", "memorias", "autobiografia"],
      reply:
        "📖 <strong>Vivir para contarla</strong> (2002) son sus memorias: la infancia en Aracataca, " +
        "los años de periodismo y el nacimiento del escritor. De ahí viene su frase: " +
        "«La vida no es la que uno vivió, sino la que uno recuerda»."
    },
    {
      keys: ["obras", "libros", "novelas", "escribio", "bibliografia", "principales"],
      reply:
        "📚 Sus obras principales son:<br>" +
        "• <strong>La hojarasca</strong> (1955)<br>" +
        "• <strong>El coronel no tiene quien le escriba</strong> (1961)<br>" +
        "• <strong>Cien años de soledad</strong> (1967)<br>" +
        "• <strong>El otoño del patriarca</strong> (1975)<br>" +
        "• <strong>Crónica de una muerte anunciada</strong> (1981)<br>" +
        "• <strong>El amor en los tiempos del cólera</strong> (1985)<br>" +
        "• <strong>Noticia de un secuestro</strong> (1996)<br>" +
        "• <strong>Vivir para contarla</strong> (2002)<br>" +
        "• <strong>Memoria de mis putas tristes</strong> (2004)<br>" +
        "Pregúntame por cualquiera de ellas 🦋"
    },
    {
      keys: ["quien fue", "vida", "biografia", "nacio", "murio", "quien es gabo", "quien era"],
      reply:
        "👤 <strong>Gabriel García Márquez</strong> (Aracataca, 6 de marzo de 1927 — Ciudad de México, " +
        "17 de abril de 2014) fue periodista y novelista colombiano, padre del realismo mágico y " +
        "Premio Nobel de Literatura 1982. Creció con sus abuelos, cuyas historias inspiraron Macondo. " +
        'Puedes leer más en la sección <a href="#biografia">Biografía</a> o en la ' +
        '<a href="https://centrogabo.org/gabo/contemos-gabo/quien-fue-gabriel-garcia-marquez" target="_blank" rel="noopener">biografía del Centro Gabo</a>.'
    },
    {
      keys: ["nobel", "premio", "estocolmo", "1982"],
      reply:
        "🏅 Gabo recibió el <strong>Premio Nobel de Literatura en 1982</strong> por unir fantasía y realismo " +
        "en un mundo que refleja la vida y los conflictos de América Latina. En Estocolmo pronunció el " +
        "célebre discurso <em>«La soledad de América Latina»</em>."
    },
    {
      keys: ["video", "discurso", "ver", "youtube"],
      reply:
        '🎬 En la sección <a href="#video">Discurso Nobel</a> de esta página puedes ver el video completo ' +
        "de «La soledad de América Latina» (Estocolmo, 1982), uno de los discursos más recordados " +
        "en la historia del premio."
    },
    {
      keys: ["realismo magico", "realismo"],
      reply:
        "✨ El <strong>realismo mágico</strong> es un estilo donde lo fantástico se narra con la naturalidad " +
        "de lo cotidiano: lluvias de flores, ascensiones al cielo y mariposas amarillas conviven con la " +
        "historia real de América Latina. Gabo es su máximo exponente."
    },
    {
      keys: ["mariposa", "mauricio"],
      reply:
        "🦋 Las <strong>mariposas amarillas</strong> siguen a Mauricio Babilonia en «Cien años de soledad» " +
        "y se volvieron el símbolo universal de Gabo. Por eso vuelan en el inicio de esta página."
    },
    {
      keys: ["centro gabo", "fundacion", "cartagena"],
      reply:
        "🏛️ El <strong>Centro Gabo</strong> es una iniciativa de la Fundación Gabo en Cartagena de Indias " +
        "para descubrir, conservar y vivir su legado: biografía, cronología, entrevistas (Gabo Habla), " +
        "memoria colectiva y especiales multimedia. " +
        'Visítalo en <a href="https://centrogabo.org/" target="_blank" rel="noopener">centrogabo.org</a> ' +
        'o mira la sección <a href="#centro-gabo">Centro Gabo</a> de esta página.'
    },
    {
      keys: ["cursos", "formacion", "aprender", "taller", "virtual", "mochila", "septimus", "cronicando", "punto y aparte"],
      reply:
        "🎓 La <strong>formación virtual del Centro Gabo</strong> ofrece cursos gratuitos:<br>" +
        "• <strong>La mochila de Gabo</strong> — educación mediática y uso crítico de la IA<br>" +
        "• <strong>Cronicando con Gabo</strong> — periodismo escolar<br>" +
        "• <strong>Punto y aparte</strong> — investigación y contenidos multiformato<br>" +
        "• <strong>Septimus</strong> — análisis de textos y datos<br>" +
        'Todos con acceso libre en <a href="https://centrogabo.org/formacion-virtual/" target="_blank" rel="noopener">formación virtual</a>.'
    },
    {
      keys: ["juego", "jugar", "memoria de macondo"],
      reply:
        '🎮 ¡Claro! Sube a la sección <a href="#juego">Memoria de Macondo</a> y encuentra las parejas ' +
        "de obras y años. A ver en cuántos movimientos lo logras 😉"
    },
    {
      keys: ["periodismo", "periodista", "espectador", "heraldo"],
      reply:
        "📰 Antes que novelista, Gabo fue <strong>periodista</strong>: escribió en El Universal, El Heraldo " +
        "y El Espectador. Siempre dijo que el periodismo era «el mejor oficio del mundo», y en 1994 fundó " +
        "en Cartagena la Fundación para un Nuevo Periodismo Iberoamericano, hoy Fundación Gabo."
    },
    {
      keys: ["hola", "buenas", "hey", "saludos", "hi"],
      reply:
        "¡Hola! 🦋 Soy el bot de este sitio. Puedo contarte sobre la <strong>vida</strong> de Gabo, " +
        "sus <strong>obras principales</strong>, el <strong>video del Nobel</strong> y el " +
        "<strong>Centro Gabo</strong> con sus cursos gratuitos. ¿Qué quieres saber?"
    },
    {
      keys: ["gracias", "genial", "perfecto"],
      reply: "¡Con gusto! 🌼 Si quieres saber algo más de Gabo, aquí estoy."
    }
  ];

  const FALLBACK =
    "Mmm, esa no la tengo en mi Macondo 🤔. Prueba preguntarme por: " +
    "<em>obras principales</em>, <em>Cien años de soledad</em>, <em>su vida</em>, " +
    "<em>el Premio Nobel</em>, <em>el video del discurso</em> o <em>los cursos del Centro Gabo</em>.";

  const CHIPS = [
    "¿Quién fue Gabo?",
    "Obras principales",
    "Cien años de soledad",
    "Premio Nobel",
    "Video del discurso",
    "Cursos del Centro Gabo"
  ];

  /* ---------- Utilidades ---------- */
  // Quita tildes y pasa a minúsculas para comparar sin errores
  const normalize = (s) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  function answerFor(text) {
    const q = normalize(text);
    for (const rule of KB) {
      if (rule.keys.some((k) => q.includes(k))) return rule.reply;
    }
    return FALLBACK;
  }

  function addMessage(html, who) {
    const div = document.createElement("div");
    div.className = "chat-msg " + who; // "bot" o "user"
    div.innerHTML = html;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function botReply(text) {
    // Burbuja "escribiendo…" y respuesta con retraso natural
    const typing = addMessage('<span class="typing"><i></i><i></i><i></i></span>', "bot");
    setTimeout(() => {
      typing.innerHTML = answerFor(text);
      messages.scrollTop = messages.scrollHeight;
    }, 550 + Math.random() * 450);
  }

  function send(text) {
    if (!text.trim()) return;
    addMessage(text.replace(/</g, "&lt;"), "user");
    botReply(text);
  }

  /* ---------- Chips de sugerencias ---------- */
  CHIPS.forEach((label) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = label;
    b.addEventListener("click", () => send(label));
    chipsBox.appendChild(b);
  });

  /* ---------- Abrir / cerrar ---------- */
  let greeted = false;
  function openChat() {
    win.hidden = false;
    fab.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => win.classList.add("open"));
    if (!greeted) {
      greeted = true;
      setTimeout(() => {
        addMessage(
          "¡Hola! 🦋 Pregúntame por la <strong>vida</strong> de Gabo, sus <strong>obras</strong>, " +
          "el <strong>video del Nobel</strong> o el <strong>Centro Gabo</strong>. " +
          "También puedes tocar una sugerencia aquí abajo.",
          "bot"
        );
      }, 350);
    }
    input.focus();
  }
  function closeChat() {
    win.classList.remove("open");
    fab.setAttribute("aria-expanded", "false");
    setTimeout(() => { win.hidden = true; }, 300);
  }

  fab.addEventListener("click", () => (win.hidden ? openChat() : closeChat()));
  closeBtn.addEventListener("click", closeChat);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    send(input.value);
    input.value = "";
  });
})();
