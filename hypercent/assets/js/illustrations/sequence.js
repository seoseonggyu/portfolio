/*
  "sequence" illustration — a simplified UML sequence diagram: participant
  lifelines across the top, numbered call arrows stepping down between
  them, with an approximate activation bar per participant (span from its
  first to its last appearance). Use this instead of "flow" when you want
  to show which real components talk to which, not just an abstract
  step-by-step pipeline.

  Each call renders two lines: the real function/method name (prominent)
  and a plain-language description underneath (muted). Mark engine-native
  calls (an overridden engine virtual, not code you wrote) with
  `native: true` — they render muted/italic with an "(Engine)" tag instead
  of the accent-colored treatment, so it's honest about the boundary
  between framework and your own code.

  props:
    participants: [{ id, label }]                            left-to-right order
    calls: [{ from: id, to: id, fn, label, native? }]         top-to-bottom order
      fn      real function/method name, e.g. "InitGame()"
      label   short plain-language description shown under fn
      native  true = engine-provided virtual you overrode, not new code
*/
(function () {
  function render(container, props) {
    const participants = props.participants || [];
    const calls = props.calls || [];
    const n = participants.length;

    if (n < 2 || !calls.length) {
      container.innerHTML = '<div class="il-fallback">sequence: participants(2개 이상) / calls 가 필요합니다.</div>';
      return;
    }

    const idxOf = {};
    participants.forEach(function (p, i) { idxOf[p.id] = i; });

    const xFor = function (i) { return n === 1 ? 50 : 4 + (i / (n - 1)) * 92; };

    const topPad = 18;
    const bottomPad = 4;
    const rowGap = (100 - topPad - bottomPad) / calls.length;

    const firstRow = new Array(n).fill(null);
    const lastRow = new Array(n).fill(null);
    calls.forEach(function (c, row) {
      [idxOf[c.from], idxOf[c.to]].forEach(function (i) {
        if (i === undefined) return;
        if (firstRow[i] === null) firstRow[i] = row;
        lastRow[i] = row;
      });
    });

    let headersHtml = '';
    let lifelinesSvg = '';
    let activationsHtml = '';
    participants.forEach(function (p, i) {
      const x = xFor(i);
      headersHtml += '<div class="il-seq__header" style="left:' + x + '%">' + p.label + '</div>';
      lifelinesSvg += '<line class="il-seq__lifeline" x1="' + x + '" y1="' + topPad + '" x2="' + x + '" y2="97" />';

      if (firstRow[i] !== null) {
        const y1 = topPad + firstRow[i] * rowGap;
        const y2 = topPad + lastRow[i] * rowGap + rowGap * 0.45;
        activationsHtml += '<div class="il-seq__activation" style="left:' + x + '%;top:' + y1 + '%;height:' + Math.max(y2 - y1, 3) + '%"></div>';
      }
    });

    let callsSvg = '';
    let labelsHtml = '';
    let arrowsHtml = '';
    calls.forEach(function (c, row) {
      const fi = idxOf[c.from];
      const ti = idxOf[c.to];
      const x1 = xFor(fi);
      const x2 = xFor(ti);
      const y = topPad + row * rowGap + rowGap * 0.45;
      const pointsRight = x2 >= x1;

      callsSvg += '<line class="il-seq__call anim-dash" x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '" />';

      const arrowClass = pointsRight ? 'il-seq__arrow il-seq__arrow--right' : 'il-seq__arrow il-seq__arrow--left';
      const arrowLeft = pointsRight ? 'calc(' + x2 + '% - 6px)' : x2 + '%';
      arrowsHtml += '<div class="' + arrowClass + '" style="left:' + arrowLeft + ';top:' + y + '%"></div>';

      const midX = (x1 + x2) / 2;
      const fnClass = c.native ? 'il-seq__fn il-seq__fn--native' : 'il-seq__fn';
      const fnText = (row + 1) + '. ' + (c.fn || '');
      const nativeTag = c.native ? ' <span class="il-seq__native-tag">(Engine)</span>' : '';
      labelsHtml += '<div class="il-seq__label" style="left:' + midX + '%;top:' + y + '%">' +
        '<div class="' + fnClass + '">' + fnText + nativeTag + '</div>' +
        (c.label ? '<div class="il-seq__desc">' + c.label + '</div>' : '') +
        '</div>';
    });

    container.innerHTML =
      '<div class="il-seq">' +
        headersHtml +
        '<svg class="il-seq__svg" viewBox="0 0 100 100" preserveAspectRatio="none">' +
          '<g>' + lifelinesSvg + '</g>' +
          '<g style="color:var(--slide-accent)">' + callsSvg + '</g>' +
        '</svg>' +
        '<div class="il-seq__activations">' + activationsHtml + '</div>' +
        '<div class="il-seq__arrows">' + arrowsHtml + '</div>' +
        '<div class="il-seq__labels">' + labelsHtml + '</div>' +
      '</div>';
  }

  Deck.registerIllustration('sequence', render);
})();
