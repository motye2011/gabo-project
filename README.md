# La vida de Gabo — Gabriel García Márquez

Sitio homenaje a **Gabriel García Márquez** (Aracataca 1927 — Ciudad de México 2014), Premio Nobel de Literatura 1982 y padre del realismo mágico.

Construido con HTML semántico, CSS moderno (Grid, custom properties, animaciones) y JavaScript vanilla sin dependencias.

## Secciones
- **Hero** con mariposas amarillas en `<canvas>` (guiño a Mauricio Babilonia)
- **Biografía** — Gabo el irreverente, periodismo y Fundación
- **Línea de tiempo** — cronología 1927–2014
- **Obras** — 6 tarjetas con enlaces a Wikipedia
- **Cita** y **Video** — discurso Nobel «La soledad de América Latina» (1982)
- **Juego: Memoria de Macondo** — 6 parejas título ↔ año+pista, contador de movimientos y tiempo
- **Centro Gabo** — Cartagena: biografía, cronología, cursos gratuitos (La mochila de Gabo, Cronicando, Punto y aparte, Septimus)
- **Noticias** y footer

## Chatbot «Pregúntale a Gabo»
Bot 100% frontend basado en reglas. Detecta palabras clave (con normalización sin tildes) y responde sobre vida, obras, Nobel, realismo mágico, mariposas, Centro Gabo y cursos. Incluye chips de sugerencias y efecto «escribiendo…».

## Tecnologías
- HTML5 + CSS3 (variables, Grid, `color-mix`, `clamp`, animaciones)
- JS: IntersectionObserver (reveal), Canvas 2D, lógica de juego con volteo 3D
- Responsive: tablet 960px, móvil 640px, `prefers-reduced-motion`

## Estructura
```
index.html
css/responsive.css
js/main.js      → mariposas, reveal, contadores, menú, to-top
js/chatbot.js   → base de conocimiento KB + UI
js/game.js      → Memoria de Macondo (OBRAS 6 = 12 cartas)
```

## Ejecutar local
Abrir `index.html` en navegador (no requiere servidor).

## Créditos
Diseño y contenido inspirado en [Centro Gabo](https://centrogabo.org) — Fundación Gabo, Cartagena de Indias.
