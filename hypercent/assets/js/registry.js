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

/*
  URL을 슬라이드에 글자로 보여줄 때 쓰는 표기 — 프로토콜과 www를 뗀다.

  이 주소 글자는 평소 CSS로 숨겨져 있고, 내보내기 스크립트가 <html>에
  `is-export`를 붙일 때만 보인다. 웹에서는 클릭하면 되니 군더더기지만,
  제출용 PDF는 링크 주석을 못 싣는 경우가 있어(업로더가 링크 든 PDF를
  거부하기도 한다) 주소가 눈에 보여야 심사자가 따라갈 수 있다.
*/
Deck.formatUrl = function (url) {
  return String(url || '')
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
};
