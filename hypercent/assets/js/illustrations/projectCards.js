/*
  "projectCards" illustration — a compact grid of small project cards.
  Use for a "기타 프로젝트" chapter where each project needs only a line
  or two (제목 · 장르 · 기술 · 기간), not a full slide.

  props:
    projects: [{ title, genre, tech, period, team, accent, thumb?, link:{label,url} }]
    // thumb: optional screenshot path shown at the card top; clicking it zooms.
*/
(function () {
  function render(container, props) {
    const projects = props.projects || [];

    const cards = projects.map(function (p, i) {
      const accent = p.accent || 'blue';
      const meta = [];
      if (p.genre) meta.push(p.genre);
      if (p.period) meta.push(p.period);
      if (p.team) meta.push(p.team);

      const linkHtml = (p.link && p.link.url)
        ? '<a class="il-pcard__link" href="' + p.link.url + '" target="_blank" rel="noopener" data-no-nav>' +
            Deck.icons[p.link.icon || 'play'] + '<span>' + (p.link.label || '영상') + '</span>' +
            '<span class="il-pcard__url">' + Deck.formatUrl(p.link.url) + '</span></a>'
        : '';

      const thumbHtml = p.thumb
        ? '<div class="il-pcard__thumb" data-zoom="' + p.thumb + '" data-zoom-alt="' + (p.title || '') + '" data-no-nav>' +
            '<img src="' + p.thumb + '" alt="' + (p.title || '') + '" loading="lazy" ' +
              'onerror="this.parentNode.classList.add(\'il-pcard__thumb--broken\')" />' +
            '<div class="il-pcard__zoom">' + Deck.icons.zoom + '</div>' +
          '</div>'
        : '';

      return '<div class="il-pcard anim-float" style="--a:var(--accent-' + accent + ');--float-delay:' + (i * 0.2).toFixed(2) + 's">' +
        thumbHtml +
        '<div class="il-pcard__title">' + (p.title || '') + '</div>' +
        (meta.length ? '<div class="il-pcard__meta">' + meta.join(' · ') + '</div>' : '') +
        (p.tech ? '<div class="il-pcard__tech">' + p.tech + '</div>' : '') +
        linkHtml +
      '</div>';
    }).join('');

    container.innerHTML = '<div class="il-pcards">' + cards + '</div>';
  }

  Deck.registerIllustration('projectCards', render);
})();
