/*
  "iconGrid" illustration — generic labeled-card grid. Useful for
  tech-stack, feature-list, or role-breakdown chapters.

  props:
    items:   [{ icon, label, desc? }]   icon = key from Deck.icons
    columns: number                     defaults to items.length (max 4)
*/
(function () {
  function render(container, props) {
    const items = props.items || [];
    const cols = props.columns || Math.min(items.length, 4) || 1;

    const cardsHtml = items.map(function (item, i) {
      return '<div class="il-icongrid__card anim-float" style="--float-delay:' + (i * 0.25).toFixed(2) + 's;--float-range:-4px">' +
        '<div class="il-icongrid__icon">' + (Deck.icons[item.icon] || Deck.icons.spark) + '</div>' +
        '<div class="il-icongrid__label">' + (item.label || '') + '</div>' +
        (item.desc ? '<div class="il-icongrid__desc">' + item.desc + '</div>' : '') +
        '</div>';
    }).join('');

    container.innerHTML = '<div class="il-icongrid stagger" style="--cols:' + cols + '">' + cardsHtml + '</div>';
  }

  Deck.registerIllustration('iconGrid', render);
})();
