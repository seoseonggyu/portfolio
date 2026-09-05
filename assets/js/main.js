/*
  Bootstrap. Flattens window.DECK_CHAPTERS (one array pushed per
  data/chapters/chapter-*.data.js file, in <script> include order)
  into a single slide list and wires it into the engine. Which HTML
  entry point you open controls which chapter files got included —
  this file never needs to change when you add/edit chapters.
*/
document.addEventListener('DOMContentLoaded', function () {
  const chapters = window.DECK_CHAPTERS || [];
  const slides = [].concat.apply([], chapters);
  const data = { meta: window.DECK_META || {}, slides: slides };

  if (!slides.length) {
    document.getElementById('slideRoot').innerHTML =
      '<div class="il-fallback">data/chapters/*.data.js 에 슬라이드를 추가하세요.</div>';
    return;
  }

  const engine = new Deck.Engine(document.getElementById('deck'), data);
  window.deckEngine = engine; // exposed for console debugging
  engine.init();
});
