/*
  Click-to-zoom lightbox. Any element with a `data-zoom="<image-src>"`
  attribute becomes clickable: clicking it opens the image full-screen
  over a dark scrim. Click anywhere / press Esc to close.

  Note: this is a live-HTML-only interaction. In the exported PDF the
  slides are static screenshots, so zoom does not carry over — only
  real hyperlinks (video/Repo links) survive as PDF link annotations.
*/
(function () {
  function ensureOverlay() {
    var o = document.getElementById('lightbox');
    if (o) return o;
    o = document.createElement('div');
    o.id = 'lightbox';
    o.className = 'lightbox';
    o.innerHTML =
      '<img class="lightbox__img" alt="" />' +
      '<button class="lightbox__close" type="button" aria-label="닫기">&times;</button>';
    document.body.appendChild(o);
    o.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
    return o;
  }

  function open(src, alt) {
    var o = ensureOverlay();
    var img = o.querySelector('.lightbox__img');
    img.src = src;
    img.alt = alt || '';
    o.classList.add('is-open');
    document.body.classList.add('lightbox-lock');
  }

  function close() {
    var o = document.getElementById('lightbox');
    if (!o) return;
    o.classList.remove('is-open');
    document.body.classList.remove('lightbox-lock');
  }

  // Capture phase so we intercept before the deck's slide-nav click handler.
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-zoom]');
    if (!t) return;
    e.preventDefault();
    e.stopPropagation();
    open(t.getAttribute('data-zoom'), t.getAttribute('data-zoom-alt') || t.getAttribute('alt'));
  }, true);
})();
