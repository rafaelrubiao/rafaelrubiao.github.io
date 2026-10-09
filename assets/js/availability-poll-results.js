/* Results page for the availability polls (/poll-results/; markup in
   _pages/poll-results.html). Sends the typed password to the Google Apps Script web
   app set in _config.yml (availability_poll_endpoint), which answers with the vote
   counts only if it matches the Settings tab of the Google Sheet. The script never
   sends emails, and the days and times come from it, so nothing here needs to
   change if the slots do. */
(function () {
  // Sequential blue ramp, light -> dark. Text is near-black on the first four steps
  // and white on the rest: at least 5:1 contrast on every step.
  var RAMP = ['#cde2fb', '#9ec5f4', '#6da7ec', '#3987e5', '#256abf', '#184f95', '#0d366b'];

  var page = document.querySelector('.poll');
  var endpoint = page.getAttribute('data-endpoint');
  var form = page.querySelector('.poll__login');
  var password = page.querySelector('.poll__password');
  var button = form.querySelector('.poll__submit');
  var error = page.querySelector('.poll__error');
  var results = page.querySelector('.poll__results');
  var refresh = page.querySelector('.poll__refresh');
  var tip = page.querySelector('.poll__tip');

  if (!endpoint) {
    page.querySelector('.poll__closed').hidden = false;
    button.disabled = true;
    return;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    load();
  });
  refresh.addEventListener('click', load);

  function load() {
    button.disabled = refresh.disabled = true;
    error.hidden = true;
    fetch(endpoint, { method: 'POST', body: JSON.stringify({ action: 'results', password: password.value }) })
      .then(function (response) { return response.json(); })
      .then(function (result) {
        if (!result.ok) return fail(result.error);
        render(result);
        form.hidden = true;
        results.hidden = false;
        button.disabled = refresh.disabled = false;
      })
      .catch(function () {
        fail('Could not reach the server. Please check your connection and try again.');
      });
  }

  function fail(message) {
    error.textContent = message;
    error.hidden = false;
    form.hidden = false;
    button.disabled = refresh.disabled = false;
  }

  // "9am-12pm" -> "9am–12pm"
  function time(t) {
    return t.replace('-', '–');
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function render(result) {
    var holder = results.querySelector('.poll__classes');
    holder.textContent = '';
    Object.keys(result.classes).forEach(function (cls) {
      var data = result.classes[cls];
      var max = Math.max.apply(null, data.counts.map(function (row) { return Math.max.apply(null, row); }));
      var section = el('section', 'poll__class');
      section.appendChild(el('h2', '', cls));
      section.appendChild(el('p', 'poll__hint', headline(result, data, max)));

      var table = el('table', 'poll__table');
      var head = table.createTHead().insertRow();
      head.appendChild(el('th'));
      result.days.forEach(function (d) { head.appendChild(el('th', '', d)); });
      var body = table.createTBody();
      result.times.forEach(function (t, j) {
        var row = body.insertRow();
        var label = el('th', '', time(t));
        label.scope = 'row';
        row.appendChild(label);
        result.days.forEach(function (d, i) {
          var n = data.counts[i][j];
          var cell = el('td', '', String(n));
          if (n > 0) {
            var step = Math.ceil(n / max * RAMP.length) - 1;
            cell.style.background = RAMP[step];
            cell.style.color = step < 4 ? '#111' : '#fff';
          }
          cell.tabIndex = 0;
          cell.setAttribute('data-tip', d + ', ' + time(t) +
            (data.respondents ? ' · ' + n + ' of ' + data.respondents + ' respondents (' +
              Math.round(100 * n / data.respondents) + '%)' : ''));
          row.appendChild(cell);
        });
      });
      section.appendChild(table);
      if (max > 0) section.appendChild(legend(max));
      holder.appendChild(section);
    });
    page.querySelector('.poll__asof').textContent =
      new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  // "12 respondents. Most available (9): Fri Oct 30 1pm–4pm, Sat Oct 31 10am–1pm"
  function headline(result, data, max) {
    if (!data.respondents) return 'No responses yet.';
    var text = data.respondents + (data.respondents === 1 ? ' respondent.' : ' respondents.');
    if (!max) return text + ' Nobody has selected a slot yet.';
    var best = [];
    result.days.forEach(function (d, i) {
      result.times.forEach(function (t, j) {
        if (data.counts[i][j] === max) best.push(d + ' ' + time(t));
      });
    });
    return text + ' Most available (' + max + '): ' + best.join(', ');
  }

  // 0 (white), then the ramp from 1 up to the class maximum.
  function legend(max) {
    var box = el('div', 'poll__legend');
    box.appendChild(el('span', '', '0'));
    box.appendChild(el('i', 'poll__legend-zero'));
    box.appendChild(el('span', '', '1'));
    RAMP.forEach(function (color) {
      var swatch = el('i');
      swatch.style.background = color;
      box.appendChild(swatch);
    });
    box.appendChild(el('span', '', max + (max === 1 ? ' student' : ' students')));
    return box;
  }

  // Hover or keyboard focus on a cell shows its slot, count and share of respondents.
  function show(e) {
    var cell = e.target.closest && e.target.closest('td[data-tip]');
    if (!cell) return;
    tip.textContent = cell.getAttribute('data-tip');
    tip.hidden = false;
    var box = cell.getBoundingClientRect();
    var left = Math.min(Math.max(8, box.left + box.width / 2 - tip.offsetWidth / 2), window.innerWidth - tip.offsetWidth - 8);
    tip.style.left = left + 'px';
    tip.style.top = (box.top - tip.offsetHeight - 6) + 'px';
  }
  function hide() {
    tip.hidden = true;
  }
  results.addEventListener('pointerover', show);
  results.addEventListener('focusin', show);
  results.addEventListener('pointerout', hide);
  results.addEventListener('focusout', hide);
  window.addEventListener('scroll', hide, { passive: true });
})();
