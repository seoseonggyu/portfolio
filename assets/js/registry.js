/*
  Illustration registry — the "template specialization" dispatch
  table. Every illustration type implements the same interface:

      function render(container: HTMLElement, props: object): void

  and registers itself under a string tag via Deck.registerIllustration.
  Slide data then just points at a tag + props; the engine never
  needs to know how any specific illustration is drawn.
*/
window.Deck = window.Deck || {};
Deck.illustrations = {};

Deck.registerIllustration = function (type, renderFn) {
  Deck.illustrations[type] = renderFn;
};

Deck.renderIllustration = function (container, type, props) {
  const renderFn = Deck.illustrations[type];
  if (!renderFn) {
    console.warn('[Deck] Unknown illustration type: "' + type + '"');
    container.innerHTML = '<div class="il-fallback">일러스트 타입 "' + type + '" 을(를) 찾을 수 없습니다.</div>';
    return;
  }
  renderFn(container, props || {});
};
