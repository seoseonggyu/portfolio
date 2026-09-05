/*
  "photo" illustration — a real image (screenshot, gameplay capture,
  team photo, etc.) framed consistently with the rest of the deck,
  with a slow idle Ken Burns drift instead of a static drop-in.

  Optionally doubles as a clickable video thumbnail: pass `link` and
  it renders a play-button overlay and opens that URL in a new tab.

  props:
    src:     string   image path, e.g. "assets/img/my-shot.png" or a URL
    alt:     string   accessibility text (also used if the image 404s)
    caption: string   small caption shown under the frame (optional)
    fit:     "cover" | "contain"   defaults to "cover"
    link:    string   optional — makes the frame a thumbnail link (e.g. a YouTube demo)
*/
(function () {
  function render(container, props) {
    const src = props.src || '';
    const alt = props.alt || '';
    const caption = props.caption || '';
    const fit = props.fit === 'contain' ? 'contain' : 'cover';
    const link = props.link || '';

    const frame = document.createElement(link ? 'a' : 'div');
    frame.className = 'il-photo__frame';
    if (link) {
      frame.href = link;
      frame.target = '_blank';
      frame.rel = 'noopener';
      frame.setAttribute('data-no-nav', '');
    } else if (src) {
      // No external link → the frame itself zooms open on click.
      frame.classList.add('il-photo__frame--zoom');
      frame.setAttribute('data-zoom', src);
      frame.setAttribute('data-zoom-alt', alt);
      frame.setAttribute('data-no-nav', '');
    }

    const img = document.createElement('img');
    img.className = 'il-photo__img anim-kenburns';
    img.src = src;
    img.alt = alt;
    img.style.setProperty('--fit', fit);
    img.onerror = function () {
      frame.classList.add('il-photo__frame--broken');
      frame.innerHTML = '<div class="il-photo__fallback">이미지를 불러올 수 없습니다' +
        (alt ? ': ' + alt : '') + '<br><span>' + src + '</span></div>';
    };
    frame.appendChild(img);

    if (link) {
      const scrim = document.createElement('div');
      scrim.className = 'il-photo__scrim';
      frame.appendChild(scrim);

      const play = document.createElement('div');
      play.className = 'il-photo__play anim-pulse';
      play.innerHTML = Deck.icons.play;
      frame.appendChild(play);
    } else if (src) {
      const badge = document.createElement('div');
      badge.className = 'il-photo__zoom';
      badge.innerHTML = Deck.icons.zoom + '<span>확대</span>';
      frame.appendChild(badge);
    }

    container.innerHTML = '<div class="il-photo"></div>';
    const root = container.querySelector('.il-photo');
    root.appendChild(frame);

    if (caption) {
      const cap = document.createElement('div');
      cap.className = 'il-photo__caption';
      cap.textContent = caption;
      root.appendChild(cap);
    }
  }

  Deck.registerIllustration('photo', render);
})();
