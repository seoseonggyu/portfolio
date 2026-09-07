/*
  "flow" illustration — an ordered pipeline of stages (not a flat set).
  Use this instead of iconGrid when the items happen in sequence —
  e.g. a startup/init sequence where each stage hands off to the next.
  Visually distinct from the card-based types: circular numbered nodes
  on a single connecting track, with a signal animation traveling
  along it.

  props:
    steps: [{ icon, label, desc, accent }]   left-to-right order matters
*/
(function () {
  function render(container, props) {
    const steps = props.steps || [];

    const stepsHtml = steps.map(function (s, i) {
      const accent = s.accent || 'blue';
      return '<div class="il-flow__step" style="animation-delay:' + (i * 0.15).toFixed(2) + 's">' +
        '<div class="il-flow__step-index">STEP ' + (i + 1) + '</div>' +
        '<div class="il-flow__badge anim-pulse" style="--a:var(--accent-' + accent + ');animation-delay:' + (i * 0.4).toFixed(2) + 's">' +
          (Deck.icons[s.icon] || Deck.icons.spark) +
        '</div>' +
        '<div class="il-flow__label">' + (s.label || '') + '</div>' +
        (s.desc ? '<div class="il-flow__desc">' + s.desc + '</div>' : '') +
      '</div>';
    }).join('');

    container.innerHTML =
      '<div class="il-flow">' +
        '<div class="il-flow__row">' +
          '<div class="il-flow__track"><div class="il-flow__progress"></div></div>' +
          stepsHtml +
        '</div>' +
      '</div>';
  }

  Deck.registerIllustration('flow', render);
})();
