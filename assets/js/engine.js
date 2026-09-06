/*
  Deck engine — turns data (window.DECK_DATA) into rendered slides.
  Nothing here is content-specific: page counts, accents, and
  illustration choices are all read from the data object, never
  hardcoded.
*/
window.Deck = window.Deck || {};

Deck.Engine = function (rootEl, data) {
  this.root = rootEl;
  this.data = data;
  this.slides = data.slides || [];
  this.current = 0;

  this.counterEl = document.getElementById('deckCounter');
  this.progressEl = document.getElementById('deckProgress');
  this.brandEl = document.getElementById('deckBrand');
  this.slideRoot = document.getElementById('slideRoot');
  this.prevBtn = document.getElementById('navPrev');
  this.nextBtn = document.getElementById('navNext');

  if (this.brandEl && data.meta && data.meta.brandLabel) {
    this.brandEl.textContent = data.meta.brandLabel;
  }

  this._bindNav();
  this._bindPointerParallax();
};

Deck.Engine.prototype._bindNav = function () {
  const self = this;

  window.addEventListener('keydown', function (e) {
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].indexOf(e.key) !== -1) {
      self.next(); e.preventDefault();
    } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].indexOf(e.key) !== -1) {
      self.prev(); e.preventDefault();
    } else if (e.key === 'Home') {
      self.goTo(0);
    } else if (e.key === 'End') {
      self.goTo(self.slides.length - 1);
    }
  });

  this.nextBtn.addEventListener('click', function () { self.next(); });
  this.prevBtn.addEventListener('click', function () { self.prev(); });

  this.slideRoot.addEventListener('click', function (e) {
    if (e.target.closest('a,button,[data-no-nav]')) return;
    const rect = self.root.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    if (ratio > 0.66) self.next();
    else if (ratio < 0.34) self.prev();
  });

  let touchStartX = null;
  this.root.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  this.root.addEventListener('touchend', function (e) {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { dx < 0 ? self.next() : self.prev(); }
    touchStartX = null;
  }, { passive: true });

  window.addEventListener('hashchange', function () {
    const idx = parseInt(location.hash.replace('#', ''), 10) - 1;
    if (!isNaN(idx) && idx !== self.current) self.goTo(idx, { skipHash: true });
  });
};

Deck.Engine.prototype._bindPointerParallax = function () {
  const self = this;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  this.root.addEventListener('mousemove', function (e) {
    const rect = self.root.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const my = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    self.slideRoot.style.setProperty('--mx', mx.toFixed(3));
    self.slideRoot.style.setProperty('--my', my.toFixed(3));
  });
};

Deck.Engine.prototype.init = function () {
  const raw = parseInt((location.hash || '').replace('#', ''), 10) - 1;
  const startIdx = isNaN(raw) ? 0 : Math.min(Math.max(raw, 0), this.slides.length - 1);
  this.goTo(startIdx, { instant: true });
};

Deck.Engine.prototype.next = function () { this.goTo(this.current + 1); };
Deck.Engine.prototype.prev = function () { this.goTo(this.current - 1); };

Deck.Engine.prototype.goTo = function (index, opts) {
  opts = opts || {};
  if (index < 0 || index >= this.slides.length) return;

  this.current = index;
  const slide = this.slides[index];
  this._renderSlide(slide, index);

  const total = this.slides.length;
  this.counterEl.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
  this.progressEl.style.width = ((index + 1) / total) * 100 + '%';
  this.prevBtn.disabled = index === 0;
  this.nextBtn.disabled = index === total - 1;

  if (!opts.skipHash) history.replaceState(null, '', '#' + (index + 1));
};

Deck.Engine.prototype._accentToken = function (name) {
  return name || 'neutral';
};

/**
 * Renders the bordered info table shown above a chapter's one-line
 * summary — a generic ordered list of { label, value, url? } rows, so
 * a chapter can show Repo/기간 or, when useful, richer rows like
 * 게임 장르/사용 도구/개발 인원 without touching engine code.
 */
Deck.Engine.prototype._renderChapterMeta = function (meta) {
  if (!meta || !meta.length) return '';

  const rows = meta.map(function (item) {
    const value = item.url
      ? '<a class="slide__meta-value-link" href="' + item.url + '" target="_blank" rel="noopener" data-no-nav>' + Deck.formatUrl(item.url) + '</a>'
      : item.value;
    return '<div class="slide__meta-row">' +
      '<div class="slide__meta-label">' + item.label + '</div>' +
      '<div class="slide__meta-value">' + value + '</div>' +
    '</div>';
  }).join('');

  return '<div class="slide__meta-table stagger">' + rows + '</div>';
};

/**
 * Renders an optional row of call-to-action links (e.g. a demo video)
 * shown right under a content slide's title. A link with a missing or
 * placeholder ("#") url is rendered as a muted "예정" chip instead of a
 * live anchor, so a slide can ship before its URL is known.
 */
Deck.Engine.prototype._renderLinks = function (links) {
  if (!links || !links.length) return '';

  const items = links.map(function (link) {
    const icon = (link.icon && Deck.icons[link.icon]) ? Deck.icons[link.icon] : Deck.icons.play;
    const label = link.label || '링크';
    const hasUrl = link.url && link.url !== '#';

    if (hasUrl) {
      return '<a class="slide__link" href="' + link.url + '" target="_blank" rel="noopener" data-no-nav>' +
        icon + '<span>' + label + '</span>' +
        '<span class="slide__link-url">' + Deck.formatUrl(link.url) + '</span></a>';
    }
    return '<span class="slide__link slide__link--pending">' + icon +
      '<span>' + label + ' <em>(링크 추가 예정)</em></span></span>';
  }).join('');

  return '<div class="slide__links stagger">' + items + '</div>';
};

Deck.Engine.prototype._renderSegments = function (segments) {
  if (!segments) return '';
  return segments.map(function (seg) {
    return seg.emphasis ? '<span class="em">' + seg.text + '</span>' : seg.text;
  }).join('');
};

/**
 * Renders a { label, value } row list shared by the "profile" front
 * matter layout's PROFILE / CONTACTS / Skills sections.
 */
Deck.Engine.prototype._renderProfileRows = function (rows) {
  if (!rows || !rows.length) return '';
  return rows.map(function (row) {
    return '<div class="slide__profile-row">' +
      '<div class="slide__profile-label">' + row.label + '</div>' +
      '<div class="slide__profile-value">' + row.value + '</div>' +
    '</div>';
  }).join('');
};

Deck.Engine.prototype._renderSlide = function (slide, index) {
  this.slideRoot.classList.remove('slide-enter');
  void this.slideRoot.offsetWidth; // reflow, restarts entrance animation

  const accentToken = this._accentToken(slide.accent);
  this.slideRoot.style.setProperty('--slide-accent', 'var(--accent-' + accentToken + ')');
  this.slideRoot.style.setProperty('--slide-accent-soft', 'var(--accent-' + accentToken + '-soft)');

  if (slide.layout === 'cover') {
    this.slideRoot.innerHTML =
      '<section class="slide slide--cover stagger">' +
        '<div class="slide__chapter-index">CHAPTER ' + (slide.chapterNumber || String(index + 1).padStart(2, '0')) + '</div>' +
        '<h1 class="slide__chapter-title">' + (slide.chapterTitle || '') + '</h1>' +
        this._renderChapterMeta(slide.meta) +
        (slide.summary ? '<p class="slide__chapter-summary">' + slide.summary + '</p>' : '') +
        (slide.chapterSubtitle ? '<p class="slide__chapter-subtitle">' + slide.chapterSubtitle + '</p>' : '') +
      '</section>';
  } else if (slide.layout === 'title') {
    this.slideRoot.innerHTML =
      '<section class="slide slide--title stagger">' +
        '<div class="slide__title-word">' + (slide.titleText || '') + '</div>' +
        '<div class="slide__title-name">' + (slide.name || '') + '</div>' +
      '</section>';
  } else if (slide.layout === 'toc') {
    const items = (slide.items || []).map(function (item) {
      return '<a class="slide__toc-item" href="' + item.href + '" data-no-nav>' + item.label + '</a>';
    }).join('');
    this.slideRoot.innerHTML =
      '<section class="slide slide--toc stagger">' +
        '<h1 class="slide__toc-title">' + (slide.title || 'CONTENTS') + '</h1>' +
        '<nav class="slide__toc-list">' + items + '</nav>' +
      '</section>';
  } else if (slide.layout === 'profile') {
    this.slideRoot.innerHTML =
      '<section class="slide slide--profile stagger">' +
        '<h1 class="slide__profile-title">' + (slide.title || '소개') + '</h1>' +
        '<div class="slide__profile-body">' +
          '<div class="slide__profile-photo"><img src="' + slide.photo.src + '" alt="' + (slide.photo.alt || '') + '" /></div>' +
          '<div class="slide__profile-col">' +
            '<h2 class="slide__profile-heading">PROFILE</h2>' +
            this._renderProfileRows(slide.profile) +
            '<h2 class="slide__profile-heading slide__profile-heading--mt">CONTACTS</h2>' +
            this._renderProfileRows(slide.contacts) +
          '</div>' +
          '<div class="slide__profile-divider"></div>' +
          '<div class="slide__profile-col">' +
            '<h2 class="slide__profile-heading">Skills</h2>' +
            this._renderProfileRows(slide.skills) +
          '</div>' +
        '</div>' +
      '</section>';
  } else {
    this.slideRoot.innerHTML =
      '<section class="slide slide--content">' +
        '<div class="slide__eyebrow stagger"><span class="slide__eyebrow-dot"></span>' + (slide.eyebrow || '') + '</div>' +
        '<h1 class="slide__title stagger">' + this._renderSegments(slide.title) + '</h1>' +
        this._renderLinks(slide.links) +
        '<div class="slide__stage-illustration"></div>' +
        (slide.caption ? '<div class="slide__caption-bar stagger">' + this._renderSegments(slide.caption) + '</div>' : '') +
      '</section>';

    const illustrationEl = this.slideRoot.querySelector('.slide__stage-illustration');
    if (slide.illustration) {
      Deck.renderIllustration(illustrationEl, slide.illustration.type, slide.illustration.props);
    }
  }

  requestAnimationFrame(() => this.slideRoot.classList.add('slide-enter'));
};
