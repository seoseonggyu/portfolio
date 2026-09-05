/*
  "compare" illustration — two entities side by side, one fed a
  scattered set of sources, the other gated behind a single
  read-only channel. Mirrors the "전부 본 에이전트 vs 격리된 비평가" slide.

  props:
    left:  { label, accent, icons: string[] }   icons = keys from Deck.icons
    right: { label, accent, readonly?: bool }
    annotation: string                          small caption near the middle
    connectorLabel: string                       badge shown on the right panel
*/
(function () {
  const ICON_POS = [
    { x: 16, y: 14 }, { x: 4, y: 44 }, { x: 34, y: 4 }, { x: 2, y: 74 }, { x: 28, y: 70 }
  ];

  function render(container, props) {
    const left = Object.assign({ label: '', accent: 'rose', icons: [] }, props.left);
    const right = Object.assign({ label: '', accent: 'green' }, props.right);
    const annotation = props.annotation || '';
    const connectorLabel = props.connectorLabel || 'READ ONLY';

    const icons = (left.icons || []).slice(0, ICON_POS.length);
    const cx = 55, cy = 66;

    const cardsHtml = icons.map(function (name, i) {
      const p = ICON_POS[i];
      return '<div class="il-icon-card anim-float" style="left:' + p.x + '%;top:' + p.y + '%;--float-delay:' +
        (i * 0.35).toFixed(2) + 's">' + (Deck.icons[name] || Deck.icons.spark) + '</div>';
    }).join('');

    const linesHtml = icons.map(function (_, i) {
      const p = ICON_POS[i];
      return '<line class="il-connector anim-dash" x1="' + (p.x + 3) + '" y1="' + (p.y + 3) + '" x2="' + cx + '" y2="' + cy + '" />';
    }).join('');

    const cursorHtml = annotation
      ? Deck.icons.cursor.replace('<svg', '<svg class="il-annotation__cursor anim-float"')
      : '';

    container.innerHTML =
      '<div class="il-compare">' +
        '<div class="il-compare__side">' +
          '<div class="il-compare__icons">' + cardsHtml + '</div>' +
          '<svg class="il-compare__lines" viewBox="0 0 100 100" preserveAspectRatio="none" style="color:var(--accent-' + left.accent + ')">' + linesHtml + '</svg>' +
          '<div class="il-avatar anim-breathe">' + Deck.avatarSvg('var(--accent-' + left.accent + ')') + '</div>' +
          '<div class="il-compare__label">' + left.label + '</div>' +
        '</div>' +
        '<div class="il-compare__mid">' +
          '<div class="il-annotation">' + annotation + cursorHtml + '</div>' +
        '</div>' +
        '<div class="il-compare__side">' +
          '<div class="il-readonly-row">' +
            '<div class="il-icon-card anim-float">' + Deck.icons.text + '</div>' +
            '<div class="il-arrow anim-pulse" style="color:var(--accent-' + right.accent + ')"></div>' +
            '<div class="il-panel">' +
              (right.readonly ? '<span class="il-panel__badge">' + connectorLabel + '</span>' : '') +
              '<div class="il-avatar anim-breathe">' + Deck.avatarSvg('var(--accent-' + right.accent + ')') + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="il-compare__label">' + right.label + '</div>' +
        '</div>' +
      '</div>';
  }

  Deck.registerIllustration('compare', render);
})();
