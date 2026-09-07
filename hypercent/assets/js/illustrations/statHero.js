/*
  "statHero" illustration — one big number/stat with pulsing rings.
  Useful for results/achievements chapters ("30만 다운로드" 등).

  props:
    value: string   the headline figure, e.g. "300K+"
    label: string   supporting caption
    rings: number   how many concentric pulse rings (default 3)
*/
(function () {
  function render(container, props) {
    const value = props.value || '';
    const label = props.label || '';
    const rings = props.rings || 3;

    let ringsHtml = '';
    for (let i = 0; i < rings; i++) {
      const size = 120 + i * 70;
      ringsHtml += '<div class="il-stathero__ring anim-pulse" style="width:' + size + 'px;height:' + size + 'px;animation-delay:' + (i * 0.4).toFixed(2) + 's"></div>';
    }

    container.innerHTML =
      '<div class="il-stathero">' +
        ringsHtml +
        '<div class="il-stathero__core stagger">' +
          '<div class="il-stathero__value">' + value + '</div>' +
          '<div class="il-stathero__label">' + label + '</div>' +
        '</div>' +
      '</div>';
  }

  Deck.registerIllustration('statHero', render);
})();
