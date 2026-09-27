/* Availability poll for /femba-poll/ and /emba-poll/ (markup in
   _includes/availability-poll.html). Sends {class, email, slots} to the Google
   Apps Script web app set in _config.yml (availability_poll_endpoint; the script
   is _apps-script/availability-poll.gs). Nothing is read back, so students never
   see other responses or counts. */
(function () {
  // Must match DAYS and TIMES in _apps-script/availability-poll.gs.
  var DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var TIMES = ['5:00-6:00pm', '5:30-6:30pm', '6:00-7:00pm', '6:30-7:30pm', '7:00-8:00pm'];  // Pacific Time
  var EMAIL = /^[a-z0-9][a-z0-9._%+'-]*@anderson\.ucla\.edu$/;

  var poll = document.querySelector('.poll');
  var form = poll.querySelector('.poll__form');
  var grid = poll.querySelector('.poll__grid');
  var email = poll.querySelector('.poll__email');
  var emailError = poll.querySelector('.poll__error--email');
  var submit = poll.querySelector('.poll__submit');
  var submitError = poll.querySelector('.poll__error--submit');
  var endpoint = poll.getAttribute('data-endpoint');

  // One row per day, one column per time slot. Clicking a slot toggles it.
  var html = '<span></span>';
  TIMES.forEach(function (t) {
    html += '<span class="poll__time">' + t.replace('-', '–').replace('pm', '') + '</span>';
  });
  DAYS.forEach(function (d) {
    html += '<span class="poll__day">' + d + '</span>';
    TIMES.forEach(function (t) {
      html += '<button type="button" class="poll__slot" aria-pressed="false" data-slot="' + d + ' ' + t +
              '" aria-label="' + d + ' ' + t + '"></button>';
    });
  });
  grid.innerHTML = html;

  grid.addEventListener('click', function (e) {
    var slot = e.target.closest('.poll__slot');
    if (slot) slot.setAttribute('aria-pressed', slot.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
  });

  email.addEventListener('input', function () { emailError.hidden = true; });

  if (!endpoint) {
    poll.querySelector('.poll__closed').hidden = false;
    submit.disabled = true;
    return;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var address = email.value.trim().toLowerCase();
    emailError.hidden = EMAIL.test(address);
    if (!emailError.hidden) {
      email.focus();
      return;
    }

    var slots = [].map.call(grid.querySelectorAll('[aria-pressed="true"]'), function (b) {
      return b.getAttribute('data-slot');
    });
    if (!slots.length && !confirm('You have not selected any time slot. Submit anyway, meaning none of these times work for you?')) {
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Submitting…';
    submitError.hidden = true;
    // A plain-text body keeps this a "simple" cross-origin request, which Apps Script accepts.
    fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({ class: poll.getAttribute('data-class'), email: address, slots: slots })
    })
      .then(function (response) { return response.json(); })
      .then(function (result) {
        if (!result.ok) return fail(result.error);
        form.hidden = true;
        poll.querySelector('.poll__done').hidden = false;
        poll.scrollIntoView();
      })
      .catch(function () {
        fail('Could not reach the server. Please check your connection and try again.');
      });
  });

  function fail(message) {
    submitError.textContent = message;
    submitError.hidden = false;
    submit.disabled = false;
    submit.textContent = 'Submit';
  }
})();
