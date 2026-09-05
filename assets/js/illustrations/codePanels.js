/*
  "codePanels" illustration — one or more editor-style cards showing a
  real code snippet. Used to make an architectural claim concrete: e.g.
  "새 도구/새 모델을 어트리뷰트만 붙여 등록한다" is shown as the actual
  registration code, not prose.

  Also exposes Deck.highlightCsharp(raw) — a tiny, dependency-free C#
  highlighter reused by other illustrations (featureShots) so every code
  block in the deck is colored the same way.

  props:
    panels: [{ file?, tag?, accent?, code }]   code = raw C# string
    columns: number                            defaults to panels.length (max 2)
*/
(function () {
  var KW = /\b(public|private|protected|internal|sealed|abstract|static|partial|class|record|struct|interface|enum|override|virtual|async|await|return|new|const|readonly|using|namespace|void|string|int|long|bool|double|float|var|this|is|not|null|true|false|get|set|foreach|for|while|in|if|else|yield|nullptr|auto|template|typename|uint8|uint16|uint32|uint64|int8|int16|int32|int64|size_t|break|continue)\b/g;
  var STR_OPEN = String.fromCharCode(1);
  var STR_CLOSE = String.fromCharCode(2);
  var RESTORE = new RegExp(STR_OPEN + '(\\d+)' + STR_CLOSE, 'g');

  // ── minimal, dependency-free C# highlighter ─────────────────────────
  // Line-based: pull off a trailing // comment, stash string literals
  // behind control-char sentinels (which no real code contains and the
  // keyword/type passes ignore), color keywords + Capitalized types,
  // then restore the strings. Real numeric literals are left untouched
  // because RESTORE only matches digits wrapped in the sentinels.
  Deck.highlightCsharp = Deck.highlightCsharp || function (raw) {
    return (raw || '').split('\n').map(function (line) {
      var s = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      var comment = '';
      var ci = s.indexOf('//');
      if (ci >= 0) { comment = s.slice(ci); s = s.slice(0, ci); }

      var strs = [];
      s = s.replace(/"[^"]*"/g, function (m) {
        strs.push(m);
        return STR_OPEN + (strs.length - 1) + STR_CLOSE;
      });

      s = s.replace(KW, '<span class="tok-kw">$1</span>');
      s = s.replace(/\b([A-Z][A-Za-z0-9_]*)\b/g, '<span class="tok-type">$1</span>');
      s = s.replace(RESTORE, function (_, i) {
        return '<span class="tok-str">' + strs[i] + '</span>';
      });

      if (comment) s += '<span class="tok-com">' + comment + '</span>';
      return s;
    }).join('\n');
  };

  function panelHtml(p) {
    var accent = p.accent || 'blue';
    var hl = Deck.highlightCsharp(p.code || '');
    return '<div class="il-code" style="--a:var(--accent-' + accent + ');--a-soft:var(--accent-' + accent + '-soft)">' +
      '<div class="il-code__bar">' +
        '<span class="il-code__dot"></span><span class="il-code__dot"></span><span class="il-code__dot"></span>' +
        (p.file ? '<span class="il-code__file">' + p.file + '</span>' : '') +
        (p.tag ? '<span class="il-code__tag">' + p.tag + '</span>' : '') +
      '</div>' +
      '<pre class="il-code__body"><code>' + hl + '</code></pre>' +
    '</div>';
  }

  function render(container, props) {
    var panels = props.panels || [];
    var cols = props.columns || Math.min(panels.length, 2) || 1;
    container.innerHTML = '<div class="il-code-panels stagger" style="--cols:' + cols + '">' +
      panels.map(panelHtml).join('') + '</div>';
  }

  Deck.registerIllustration('codePanels', render);
})();
