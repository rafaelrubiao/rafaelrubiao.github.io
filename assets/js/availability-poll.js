/* Availability poll for /femba-midterm/ and /emba-midterm/ (markup in
   _includes/availability-poll.html). Sends {class, email, slots} to the Google
   Apps Script web app set in _config.yml (availability_poll_endpoint; the script
   is _apps-script/availability-poll.gs). Nothing is read back, so students never
   see other responses or counts. */
(function () {
  // Must match DAYS and TIMES in _apps-script/availability-poll.gs.
  var DAYS = ['Fri Oct 30', 'Sat Oct 31'];
  var TIMES = ['9am-12pm', '10am-1pm', '11am-2pm', '12-3pm', '1-4pm', '2-5pm', '3-6pm', '4-7pm', '5-8pm'];  // 3-hour windows, Pacific Time
  var EMAIL = /^[a-z0-9][a-z0-9._%+'-]*@anderson\.ucla\.edu$/;

  var poll = document.querySelector('.poll');
  var form = poll.querySelector('.poll__form');
  var grid = poll.querySelector('.poll__grid');
  var email = poll.querySelector('.poll__email');
  var emailError = poll.querySelector('.poll__error--email');
  var submit = poll.querySelector('.poll__submit');
  var submitError = poll.querySelector('.poll__error--submit');
  var endpoint = poll.getAttribute('data-endpoint');

  // One column per day, one row per time window. Clicking a slot toggles it.
  var html = '<span></span>';
  DAYS.forEach(function (d) {
    html += '<span class="poll__day">' + d + '</span>';
  });
  TIMES.forEach(function (t) {
    html += '<span class="poll__time">' + t.replace('-', '–') + '</span>';
    DAYS.forEach(function (d) {
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
        // Also reached when Google saved the answer but its confirmation got lost;
        // submitting again is harmless because only the latest answer counts.
        fail('Your answer may not have been saved. Please press Submit again; only your latest answer counts.');
      });
  });

  function fail(message) {
    submitError.textContent = message;
    submitError.hidden = false;
    submit.disabled = false;
    submit.textContent = 'Submit';
  }
})();
