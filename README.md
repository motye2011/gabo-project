# VALORANT · Protocolo Omega

Sitio temático **VALORANT** (Riot Games, 2020) — shooter táctico 5v5. Rebrand completo desde La vida de Gabo a estilo Valorant: paleta rojo #ff4655 / oscuro #0f1923 / cream #ece8e1, botones angulares y tipografía Anton/Oswald.

Construido con HTML semántico, CSS moderno (Grid, custom properties, clamp, media queries por tipos de pantalla) y JS vanilla sin dependencias.

## Secciones
- **Hero VALORANT** — DEFY THE LIMITS, canvas táctico, stats 27 agentes / 11 mapas / 4 roles
- **Historia** — Radianita, Primer Luz, Alpha vs Omega, Spike
- **Actos del Protocolo** — timeline 2020 Ignición → 2025 Génesis Omega
- **Agentes** — 6 cards con iconos oficiales Valorant API: Jett, Phoenix, Sage, Sova, Reyna, Killjoy (Duelista/Centinela/Iniciador)
- **Cita** DEFY THE LIMITS y **Trailer DUELO** (YouTube IhhjcB2ZjIM)
- **Juego: Memoria del Protocolo** — 12 cartas, empareja FOTO oficial ↔ NOMBRE+ROL, HUD movimientos/parejas/tiempo, victoria SPIKE DESACTIVADA
- **VCT / Riot** — Champions, ligas internacionales, guía Radiante
- **Noticias** Abyss/Corrode, Masters Toronto, Agente 27

## Chatbot «Pregúntale a Valorant»
Bot 100% frontend. KB sobre Jett/Phoenix/Sage/Sova/Reyna/Killjoy, roles, mapas (Bind/Haven/Ascent...), Spike/plantar, radianita/Omega, VCT, rangos Hierro→Radiante. Chips sugeridos y efecto escribiendo.

## Responsive por tipos de pantalla (PDF + guías)
- Base mobile-first, fluid typography `clamp()`, contenedor `min(1140px,92vw)` con breakpoints xs 480 / sm 576 / md 768 / lg 992 / xl 1200 / 2xl 1440
- Imágenes adaptativas `picture/srcset` 480/768/1200w + `sizes`, retina 2dppx/3dppx (1px=4px), `aspect-ratio`
- Orientación `portrait/landscape` giroscopio, touch targets 44x44, `hover:hover` vs `hover:none`, container queries

## Tecnologías
- HTML + CSS (variables --noche #0f1923 --mariposa #ff4655, Grid, color-mix, clamp)
- JS: canvas Spike, IntersectionObserver reveal, contadores, juego 3D flip
- Estructura: `index.html`, `css/responsive.css`, `js/main.js`, `js/chatbot.js` (KB Valorant), `js/game.js` (foto↔nombre)

## Ejecutar local
Abrir `index.html` en navegador.

## Créditos
Datos agentes e iconos: [Valorant API](https://valorant-api.com) · Contenido inspirado en [playvalorant.com](https://playvalorant.com) · VCT [valorantesports.com](https://valorantesports.com)
