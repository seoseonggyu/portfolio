/*
  "schematic" illustration — an architecture/dataflow diagram drawn as
  one or more horizontal lanes, each a pipeline of stages joined by
  labeled arrows. Built to schematize a problem→solution story so a
  first-time reader sees *why* a structure was built the way it was:
  put the naive approach in a "문제" lane and the redesign in a "해결"
  lane, stacked, and the transformation reads at a glance.

  Mirrors the hand-drawn box-and-arrow / grouped-lane diagrams the
  server portfolio used (IO threads → queue → processor → worker
  strands), but themed to the deck's tokens.

  props:
    lanes: [{
      label?, accent?, tag?,          // left rail: title + verdict chip
      stages: [ stage, ... ]
    }]
    footnote?: string

  stage:
    { kind?: 'box'|'group'|'cycle', title?, accent?, icon?,
      label?, sub?, emphasis?,        // kind:'box'
      groupLabel?, items?[{label,sub,accent}],   // kind:'group'
      connector?, connectorAccent?,   // label on the arrow AFTER this stage
      terminal? }                     // no trailing arrow even if not last
*/
(function () {
  function boxInner(s) {
    var icon = s.icon ? '<span class="il-schem__ic">' + (Deck.icons[s.icon] || '') + '</span>' : '';
    return icon +
      '<span class="il-schem__box-label">' + (s.label || '') + '</span>' +
      (s.sub ? '<span class="il-schem__box-sub">' + s.sub + '</span>' : '');
  }

  function stageHtml(s) {
    var accent = s.accent || 'neutral';
    var av = '--a:var(--accent-' + accent + ');--a-soft:var(--accent-' + accent + '-soft)';
    var title = s.title ? '<div class="il-schem__cap">' + s.title + '</div>' : '';
    var body;

    if (s.kind === 'group') {
      var items = (s.items || []).map(function (it) {
        var ia = it.accent || accent;
        return '<div class="il-schem__chip" style="--a:var(--accent-' + ia + ');--a-soft:var(--accent-' + ia + '-soft)">' +
          '<span class="il-schem__chip-label">' + (it.label || '') + '</span>' +
          (it.sub ? '<span class="il-schem__chip-sub">' + it.sub + '</span>' : '') +
        '</div>';
      }).join('');
      body =
        '<div class="il-schem__group" style="' + av + '">' +
          (s.groupLabel ? '<div class="il-schem__group-label">' + s.groupLabel + '</div>' : '') +
          '<div class="il-schem__group-items">' + items + '</div>' +
        '</div>';
    } else if (s.kind === 'cycle') {
      // two-node circular-wait glyph for the deadlock story
      var a = (s.items && s.items[0]) ? s.items[0].label : 'A';
      var b = (s.items && s.items[1]) ? s.items[1].label : 'B';
      body =
        '<div class="il-schem__cycle" style="' + av + '">' +
          '<svg viewBox="0 0 260 150" class="il-schem__cycle-svg" preserveAspectRatio="xMidYMid meet">' +
            '<defs><marker id="schemArrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">' +
              '<path d="M0 0L9 4.5L0 9z" fill="currentColor"/></marker></defs>' +
            '<path d="M78 44 A90 90 0 0 1 182 44" fill="none" stroke="currentColor" stroke-width="3" marker-end="url(#schemArrow)"/>' +
            '<path d="M182 106 A90 90 0 0 1 78 106" fill="none" stroke="currentColor" stroke-width="3" marker-end="url(#schemArrow)"/>' +
          '</svg>' +
          '<div class="il-schem__cycle-node il-schem__cycle-node--l">' + a + '</div>' +
          '<div class="il-schem__cycle-node il-schem__cycle-node--r">' + b + '</div>' +
          (s.sub ? '<div class="il-schem__cycle-tag">' + s.sub + '</div>' : '') +
        '</div>';
    } else {
      body = '<div class="il-schem__box' + (s.emphasis ? ' is-emph' : '') + '" style="' + av + '">' +
        boxInner(s) + '</div>';
    }

    return '<div class="il-schem__stage">' + title + body + '</div>';
  }

  function arrowHtml(connector, accent) {
    var av = accent ? 'color:var(--accent-' + accent + ')' : '';
    return '<div class="il-schem__arrow">' +
      (connector ? '<span class="il-schem__arrow-label">' + connector + '</span>' : '') +
      '<span class="il-schem__arrow-line" style="' + av + '"></span>' +
    '</div>';
  }

  function laneHtml(lane) {
    var accent = lane.accent || 'neutral';
    var stages = lane.stages || [];
    var flow = '';
    stages.forEach(function (s, i) {
      flow += stageHtml(s);
      var last = i === stages.length - 1;
      if (!last && !s.terminal) flow += arrowHtml(s.connector, s.connectorAccent);
    });

    var rail = (lane.label || lane.tag)
      ? '<div class="il-schem__rail" style="--a:var(--accent-' + accent + ');--a-soft:var(--accent-' + accent + '-soft)">' +
          (lane.label ? '<div class="il-schem__rail-label">' + lane.label + '</div>' : '') +
          (lane.tag ? '<div class="il-schem__rail-tag">' + lane.tag + '</div>' : '') +
        '</div>'
      : '';

    return '<div class="il-schem__lane">' + rail + '<div class="il-schem__flow">' + flow + '</div></div>';
  }

  function render(container, props) {
    var lanes = props.lanes || [];
    container.innerHTML =
      '<div class="il-schem stagger">' +
        lanes.map(laneHtml).join('') +
        (props.footnote ? '<div class="il-schem__foot">' + props.footnote + '</div>' : '') +
      '</div>';
  }

  Deck.registerIllustration('schematic', render);
})();
