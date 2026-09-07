/*
  "featureShots" illustration — a vertical stack of feature rows. Each
  row pairs a short text block (icon + label + desc) with an optional
  piece of media: either a real screenshot that dissolves into the
  page (soft edge mask, no hard frame) or an inline code card, sitting
  side by side inside one bordered card.

  The text block carries the actual point — media is a supporting
  visual, capped in size so a low-resolution screenshot never gets
  blown up past its native detail. If an item has neither shot nor
  code, the row is text-only and the description takes the full width.

  props:
    items: [{
      icon, label, desc,
      shot?, shotFit? ("contain"|"cover"), shotAlt?,   // screenshot media (optional)
      code?, codeFile?, codeAccent?                     // OR code media (optional)
    }]
*/
(function () {
  function mediaHtml(item) {
    if (item.shot) {
      var fit = item.shotFit === 'cover' ? 'cover' : 'contain';
      var alt = item.shotAlt || item.label || '';
      return '<div class="il-fshots__media il-fshots__media--shot" ' +
          'data-zoom="' + item.shot + '" data-zoom-alt="' + alt + '" data-no-nav>' +
        '<img class="il-fshots__shot" src="' + item.shot + '" alt="' + alt + '" style="--fit:' + fit + '" ' +
          'onerror="this.parentNode.classList.add(\'il-fshots__media--broken\');this.parentNode.setAttribute(\'data-src\',this.src)" />' +
        '<div class="il-fshots__zoom">' + Deck.icons.zoom + '</div>' +
      '</div>';
    }
    if (item.code) {
      var hl = (Deck.highlightCsharp || function (x) { return x; })(item.code);
      return '<div class="il-fshots__media il-fshots__media--code">' +
        '<div class="il-code il-code--compact" style="--a:var(--accent-' + (item.codeAccent || 'blue') + ')">' +
          '<div class="il-code__bar">' +
            '<span class="il-code__dot"></span><span class="il-code__dot"></span><span class="il-code__dot"></span>' +
            (item.codeFile ? '<span class="il-code__file">' + item.codeFile + '</span>' : '') +
          '</div>' +
          '<pre class="il-code__body"><code>' + hl + '</code></pre>' +
        '</div>' +
      '</div>';
    }
    return '';
  }

  function render(container, props) {
    var items = props.items || [];
    var rows = items.map(function (item) {
      var media = mediaHtml(item);
      var textBlock =
        '<div class="il-fshots__text">' +
          '<div class="il-fshots__icon">' + (Deck.icons[item.icon] || Deck.icons.spark) + '</div>' +
          '<div class="il-fshots__label">' + (item.label || '') + '</div>' +
          (item.desc ? '<div class="il-fshots__desc">' + item.desc + '</div>' : '') +
        '</div>';

      if (!media) {
        return '<div class="il-fshots__row il-fshots__row--text-only">' + textBlock + '</div>';
      }

      return '<div class="il-fshots__row">' +
        textBlock +
        media +
      '</div>';
    }).join('');

    container.innerHTML = '<div class="il-fshots stagger">' + rows + '</div>';
  }

  Deck.registerIllustration('featureShots', render);
})();
