/** @OnlyCurrentDoc */

/*
 * Backend for the availability polls at rafaelrubiao.github.io/femba-poll/ and
 * /emba-poll/. The poll pages send each response here and this script writes it
 * to the Google Sheet it is attached to. The poll pages never get anything back
 * except "recorded" or an error, so students cannot see other responses or counts.
 * The password-protected page rafaelrubiao.github.io/poll-results/ shows the
 * counts (never emails).
 *
 * One-time setup, signed in to your personal Google account:
 *   1. Create a blank Google Sheet (sheets.new) and name it, e.g. "MBA availability poll".
 *   2. In the sheet: Extensions > Apps Script. Delete everything in the code file,
 *      paste this WHOLE file (it ends with the function colLetter_) and save.
 *   3. Check that the function menu next to Run says `setup`, then click Run.
 *      Approve the permissions. If Google says it hasn't verified the app, click
 *      Advanced > Go to (project name) (unsafe); it is your own script. This creates
 *      the tabs Summary, FEMBA, EMBA, Log and Settings.
 *   4. In the Settings tab, type a password in cell B1. You will type it on the
 *      results page. (Empty B1 = results page switched off.)
 *   5. Deploy > New deployment > gear icon > Web app.
 *      Execute as: Me. Who has access: Anyone (not "Anyone with Google account",
 *      which would make students sign in). Click Deploy. Use a personal Gmail
 *      account: a university account may not offer "Anyone".
 *   6. Copy the Web app URL (it ends in /exec) into availability_poll_endpoint
 *      in _config.yml.
 *
 * What is where in the sheet:
 *   Summary      number of students available in each slot, per class (formulas)
 *   FEMBA, EMBA  one row per email; 1 = available, 0 = not. A second submission
 *                from the same email replaces the row: only the latest one counts.
 *   Log          every submission received, in order; never overwritten
 *   Settings     the results-page password (B1)
 *
 * In the FEMBA and EMBA tabs, don't accept Sheets' offer to convert the emails to
 * "people chips" (a resubmission would then get a second row), and don't insert
 * rows right under the header (Summary would skip them; run setup again to fix).
 *
 * After replacing the code with a new version of this file, publish it under the
 * same URL: Deploy > Manage deployments > pencil icon > Version: New version >
 * Deploy (Implantar > Gerenciar implantações > lápis > Versão: Nova versão > Implantar).
 */

const CLASSES = ['FEMBA', 'EMBA'];

// Must match DAYS and TIMES in assets/js/availability-poll.js.
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIMES = ['5:00-6:00pm', '5:30-6:30pm', '6:00-7:00pm', '6:30-7:30pm', '7:00-8:00pm'];  // Pacific Time

const SLOTS = DAYS.flatMap(d => TIMES.map(t => d + ' ' + t));  // "Mon 5:00-6:00pm", ..., "Sun 7:00-8:00pm"
const HEADER = ['Email', 'Last submitted', 'Submissions'].concat(SLOTS);

// Anderson address; the first character is a letter or digit so that Sheets can
// never read the value as a formula.
const EMAIL = /^[a-z0-9][a-z0-9._%+'-]*@anderson\.ucla\.edu$/;


// Creates the tabs. Safe to run again: responses and the password are kept and
// only Summary (formulas only) is rebuilt. It is first in the file so that it is
// the function the editor's Run button picks.
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone('America/Los_Angeles');

  CLASSES.forEach(cls => {
    if (ss.getSheetByName(cls)) return;
    const sheet = ss.insertSheet(cls);
    sheet.appendRow(HEADER);
    sheet.setFrozenRows(1);
    sheet.setFrozenColumns(1);
    sheet.getRange('B:B').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  });

  if (!ss.getSheetByName('Log')) {
    const log = ss.insertSheet('Log');
    log.appendRow(['Received', 'Class', 'Email', 'Number of slots', 'Slots']);
    log.setFrozenRows(1);
    log.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  }

  if (!ss.getSheetByName('Settings')) {
    const settings = ss.insertSheet('Settings');
    settings.getRange('A1').setValue('Results password').setFontWeight('bold');
    settings.getRange('B1').setNumberFormat('@');  // keep what is typed as text, e.g. 0123
    settings.getRange('A3').setValue('Type a password in B1; you enter it at rafaelrubiao.github.io/poll-results/ to see the counts. Leave B1 empty to switch that page off.');
  }

  // Summary: for each class, respondents and a times-by-days grid of counts.
  // Each count is the sum of that slot's column in the class tab.
  const summary = ss.getSheetByName('Summary') || ss.insertSheet('Summary', 0);
  summary.clear();
  summary.getRange('A1').setValue('Number of students available in each slot (latest response per email). All times pm, Pacific Time.');
  const rules = [];
  CLASSES.forEach((cls, k) => {
    const top = 3 + k * (TIMES.length + 4);  // FEMBA block starts in row 3, EMBA in row 12
    summary.getRange(top, 1, 1, 3).setValues([[cls, 'Respondents', '=COUNTA(' + cls + '!A2:A)']]);
    const grid = [[''].concat(DAYS)].concat(TIMES.map(t => [t].concat(DAYS.map(d => {
      const col = colLetter_(HEADER.indexOf(d + ' ' + t) + 1);
      return '=SUM(' + cls + '!' + col + '2:' + col + ')';
    }))));
    summary.getRange(top + 1, 1, grid.length, grid[0].length).setValues(grid);
    summary.getRange(top, 1, 2, grid[0].length).setFontWeight('bold');
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .setGradientMinpoint('#ffffff')
      .setGradientMaxpoint('#57bb8a')
      .setRanges([summary.getRange(top + 2, 2, TIMES.length, DAYS.length)])
      .build());
  });
  summary.setConditionalFormatRules(rules);
}


// Runs when a poll page submits a response, or when the results page asks for counts.
function doPost(e) {
  if (!e) throw new Error('doPost runs when someone submits the poll. To create the tabs, choose setup next to Run instead.');
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.action === 'results') return results_(data.password);

    const cls = String(data.class);
    const email = String(data.email).trim().toLowerCase();

    if (!CLASSES.includes(cls)) {
      return reply_({ ok: false, error: 'Unknown class.' });
    }
    if (!EMAIL.test(email)) {
      return reply_({ ok: false, error: 'Please use your Anderson email (ending in @anderson.ucla.edu).' });
    }
    if (!Array.isArray(data.slots) || !data.slots.every(s => SLOTS.includes(s))) {
      return reply_({ ok: false, error: 'Unrecognized time slot. Please reload the page and try again.' });
    }
    const chosen = SLOTS.filter(s => data.slots.includes(s));  // page order, no duplicates

    // One submission at a time, so two students never write to the same row.
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(60000)) {
      return reply_({ ok: false, error: 'Many people are submitting right now. Please wait a minute and press Submit again.' });
    }
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      if (!ss.getSheetByName('Log')) setup();
      const now = new Date();

      ss.getSheetByName('Log').appendRow([now, cls, email, chosen.length, chosen.join(', ')]);

      const sheet = ss.getSheetByName(cls);
      const emails = sheet.getRange(1, 1, sheet.getLastRow(), 1).getValues().map(r => r[0]);
      const row = emails.indexOf(email) + 1;  // 0 if this email has not answered before
      const count = row > 1 ? (Number(sheet.getRange(row, 3).getValue()) || 0) + 1 : 1;
      const record = [email, now, count].concat(SLOTS.map(s => chosen.includes(s) ? 1 : 0));
      if (row > 1) {
        sheet.getRange(row, 1, 1, record.length).setValues([record]);
      } else {
        sheet.appendRow(record);
      }
      SpreadsheetApp.flush();  // finish the writes before the next submission reads the sheet
    } finally {
      lock.releaseLock();
    }
    return reply_({ ok: true });
  } catch (err) {
    console.error(err);  // details in the Apps Script editor under Executions
    return reply_({ ok: false, error: 'Something went wrong on the server. Please press the button again.' });
  }
}


// Counts for the results page, only if the password matches Settings!B1. Never
// returns emails. The numbers are the Summary tab's: respondents = non-empty
// emails, count = sum of the slot's column.
function results_(password) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const settings = ss.getSheetByName('Settings');
  const expected = settings ? settings.getRange('B1').getDisplayValue().trim() : '';  // exactly what B1 shows
  if (!expected) {
    return reply_({ ok: false, error: 'No results password is set. Type one in cell B1 of the Settings tab of the Google Sheet.' });
  }
  if (typeof password !== 'string' || password.trim() !== expected) {
    Utilities.sleep(1000);  // slows down guessing
    return reply_({ ok: false, error: 'Wrong password.' });
  }

  const classes = {};
  CLASSES.forEach(cls => {
    const sheet = ss.getSheetByName(cls);
    const n = sheet.getLastRow() - 1;
    const rows = n > 0 ? sheet.getRange(2, 1, n, HEADER.length).getValues() : [];
    classes[cls] = {
      respondents: rows.filter(r => r[0] !== '').length,
      counts: DAYS.map(d => TIMES.map(t => {
        const col = HEADER.indexOf(d + ' ' + t);
        return rows.reduce((sum, r) => sum + (typeof r[col] === 'number' ? r[col] : 0), 0);
      })),
    };
  });
  return reply_({ ok: true, days: DAYS, times: TIMES, classes: classes });
}


// Opening the web-app URL in a browser shows this; handy to check the deployment.
function doGet() {
  return ContentService.createTextOutput('The availability poll is running. Responses are visible only to the poll owner.');
}


function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}


// Column number to letters: 1 -> A, 26 -> Z, 27 -> AA.
function colLetter_(n) {
  let s = '';
  for (; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + (n - 1) % 26) + s;
  return s;
}
