/*
  "twoPath" illustration — a fork with no middle ground: two peaks,
  each reachable by a curved path from a center figure. Mirrors the
  "기술 vs 제품" slide.

  props:
    options: [{ label, icon, accent }, { label, icon, accent }]
*/
(function () {
  function render(container, props) {
    const opts = props.options || [];
    const o0 = Object.assign({ label: '', icon: 'hexagon', accent: 'blue' }, opts[0]);
    const o1 = Object.assign({ label: '', icon: 'star', accent: 'gold' }, opts[1]);

    let twinkles = '';
    for (let i = 0; i < 6; i++) {
      const x = (6 + Math.random() * 88).toFixed(1);
      const y = (4 + Math.random() * 30).toFixed(1);
      twinkles += '<div class="il-twinkle anim-twinkle" style="left:' + x + '%;top:' + y + '%;animation-delay:' + (i * 0.4).toFixed(2) + 's"></div>';
    }

    container.innerHTML =
      '<div class="il-twopath">' +
        twinkles +
        '<svg class="il-twopath__curve" viewBox="0 0 100 55" preserveAspectRatio="none">' +
          '<path class="anim-dash" d="M50,52 C38,34 26,22 16,12" style="color:var(--accent-' + o0.accent + ')" />' +
          '<path class="anim-dash" d="M50,52 C62,34 74,22 84,12" style="color:var(--accent-' + o1.accent + ')" />' +
        '</svg>' +
        '<div class="il-twopath__peak">' +
          '<div class="il-peak-label">' + o0.label + '</div>' +
          '<div class="il-peak-glow anim-pulse" style="--a:var(--accent-' + o0.accent + ');--a-soft:var(--accent-' + o0.accent + '-soft)">' + (Deck.icons[o0.icon] || Deck.icons.hexagon) + '</div>' +
          '<div class="il-mountain" style="--a-soft:var(--accent-' + o0.accent + '-soft)"></div>' +
        '</div>' +
        '<div class="il-twopath__figure anim-breathe">' +
          '<div class="il-figure-glow"></div>' +
          Deck.avatarSvg('var(--accent-neutral)') +
        '</div>' +
        '<div class="il-twopath__peak">' +
          '<div class="il-peak-label">' + o1.label + '</div>' +
          '<div class="il-peak-glow anim-pulse" style="--a:var(--accent-' + o1.accent + ');--a-soft:var(--accent-' + o1.accent + '-soft)">' + (Deck.icons[o1.icon] || Deck.icons.star) + '</div>' +
          '<div class="il-mountain" style="--a-soft:var(--accent-' + o1.accent + '-soft)"></div>' +
        '</div>' +
      '</div>';
  }

  Deck.registerIllustration('twoPath', render);
})();
