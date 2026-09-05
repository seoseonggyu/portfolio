/*
  Shared icon + figure glyph library. Every illustration draws its
  visuals from here so that adding one new icon makes it available
  to all illustration types at once.
*/
window.Deck = window.Deck || {};

Deck.icons = {
  image: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/><circle cx="8.5" cy="9.5" r="1.5" fill="currentColor"/><path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"/></svg>',
  mountain: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 18L9 8l4 6 2-3 6 9H3z" fill="currentColor"/></svg>',
  text: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  card: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="7" width="18" height="4" rx="2" fill="currentColor"/></svg>',
  hexagon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8L5.7 21l1.7-7-5.4-4.7 7.1-.6L12 2z"/></svg>',
  cursor: '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4 2l14 8-6 1.5L10 18 4 2z"/></svg>',
  panel: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.6"/><circle cx="8" cy="12" r="1.4" fill="currentColor"/><circle cx="16" cy="12" r="1.4" fill="currentColor"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12l5 5L20 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.58 2 12.2c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.78.51-3.5-.7-3.72-1.34-.13-.32-.67-1.34-1.15-1.61-.39-.21-.95-.73-.01-.74.88-.01 1.51.82 1.72 1.16 1.01 1.71 2.63 1.23 3.27.94.1-.74.39-1.23.71-1.51-2.49-.29-5.11-1.28-5.11-5.66 0-1.25.44-2.27 1.16-3.07-.12-.29-.5-1.46.11-3.04 0 0 .95-.31 3.12 1.17a10.7 10.7 0 0 1 5.68 0c2.17-1.48 3.12-1.17 3.12-1.17.61 1.58.23 2.75.11 3.04.72.8 1.16 1.81 1.16 3.07 0 4.39-2.63 5.37-5.13 5.65.4.35.76 1.04.76 2.1 0 1.52-.01 2.75-.01 3.12 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.2C22 6.58 17.52 2 12 2z"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9.4" stroke="currentColor" stroke-width="1.6"/><path d="M10 8.5l6 3.5-6 3.5V8.5z" fill="currentColor"/></svg>',
  cube: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.5l8.5 4.9v9.2L12 21.5l-8.5-4.9V7.4L12 2.5z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M3.7 7.2L12 12l8.3-4.8M12 12v9.3" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
  wrench: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 4a5 5 0 0 0-6.6 6.2L3 15.6 5.4 18l5.4-5.4A5 5 0 0 0 15 4l-2.6 2.6-1.4-.4-.4-1.4L15 4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3l7 3v5c0 4.4-3 8-7 10-4-2-7-5.6-7-10V6l7-3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  plug: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 3v5M15 3v5M6 8h12v2a6 6 0 0 1-12 0V8zM12 16v5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  zoom: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="1.8"/><path d="M15.5 15.5L21 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10.5 7.5v6M7.5 10.5h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
};

/**
 * Shared "figure" glyph reused by every illustration that needs a
 * person silhouette. accentExpr is any valid CSS color expression,
 * e.g. "var(--accent-rose)".
 */
Deck.avatarSvg = function (accentExpr) {
  return '<svg viewBox="0 0 60 80" class="il-avatar__svg">' +
    '<path d="M12 78 C12 50 18 40 30 40 C42 40 48 50 48 78 Z" style="fill:' + accentExpr + '"/>' +
    '<circle cx="30" cy="18" r="14" style="fill:' + accentExpr + '"/>' +
    '<ellipse cx="24" cy="12" rx="6" ry="4" fill="rgba(255,255,255,.3)"/>' +
    '</svg>';
};
