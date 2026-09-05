/*
  "radialFan" illustration — one center figure fanning out to N
  panels, connected by converging lines. panelCount is a genuine
  template parameter: change it and the fan angle/spacing recomputes
  automatically. Mirrors the "1:10 동시 진행" slide.

  props:
    figureAccent: string   accent token, e.g. "gold"
    panelCount:   number   how many panels to fan out (default 8)
    panelIcon:    string   icon key from Deck.icons for each panel
    panelLabels:  string[] optional — text label per panel (e.g. app names);
                           when given, panels show the label instead of the icon
    ratioLabel:   string   caption shown under the figure
*/
(function () {
  function render(container, props) {
    const figureAccent = props.figureAccent || 'gold';
    const panelLabels = props.panelLabels || null;
    const panelCount = props.panelCount || (panelLabels ? panelLabels.length : 8);
    const panelIcon = props.panelIcon || 'panel';
    const ratioLabel = props.ratioLabel || '';

    const cx = 50, cy = 84, rx = 44, ry = 62;
    const startAngle = -172, endAngle = -8;

    let panelsHtml = '', linesHtml = '';
    for (let i = 0; i < panelCount; i++) {
      const t = panelCount === 1 ? 0.5 : i / (panelCount - 1);
      const angleDeg = startAngle + t * (endAngle - startAngle);
      const angleRad = angleDeg * Math.PI / 180;
      const x = cx + Math.cos(angleRad) * rx;
      const y = cy + Math.sin(angleRad) * ry * 0.62;
      const delay = (i * 0.16).toFixed(2);

      const isLabel = panelLabels && panelLabels[i];
      const inner = isLabel
        ? '<span class="il-fan-panel__txt">' + panelLabels[i] + '</span>'
        : (Deck.icons[panelIcon] || Deck.icons.panel);
      panelsHtml += '<div class="il-fan-panel' + (isLabel ? ' il-fan-panel--label' : '') +
        ' anim-float" style="left:' + x.toFixed(2) + '%;top:' + y.toFixed(2) + '%;--float-delay:' + delay + 's">' +
        inner + '</div>';
      linesHtml += '<line class="anim-dash" x1="' + cx + '" y1="' + (cy - 4) + '" x2="' + x.toFixed(2) + '" y2="' + y.toFixed(2) + '" />';
    }

    container.innerHTML =
      '<div class="il-radial" style="--a:var(--accent-' + figureAccent + ');--a-soft:var(--accent-' + figureAccent + '-soft)">' +
        '<svg class="il-radial__lines" viewBox="0 0 100 100" preserveAspectRatio="none">' + linesHtml + '</svg>' +
        panelsHtml +
        '<div class="il-radial__figure anim-breathe">' +
          '<div class="il-radial__halo anim-pulse"></div>' +
          Deck.avatarSvg('var(--a)') +
        '</div>' +
        (ratioLabel ? '<div class="il-radial__ratio">' + ratioLabel + '</div>' : '') +
      '</div>';
  }

  Deck.registerIllustration('radialFan', render);
})();
