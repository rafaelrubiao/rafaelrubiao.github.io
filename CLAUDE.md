# CLAUDE.md

## Author identity — read this first

The site owner's academic name is **Rafael Macedo-Rubião** (hyphenated surname;
changed from "Rafael M. Rubião" in September 2026). Use it everywhere his name
appears: page text, `_config.yml`, the CV, and citations of his own work, which
are written **Macedo-Rubião, R.** Never reintroduce "Rafael M. Rubião",
"Rubião, R. M.", or an unhyphenated "Macedo Rubião".

Deliberately unchanged (do not "fix" these): the GitHub handle and site URL
(`rafaelrubiao`), email addresses, and the CV filenames
`files/Rubiao_RafaelM_CV.{tex,pdf}` — kept stable so existing external links
and the local build workflow don't break.

## Site facts

- Jekyll site on the academicpages theme (fork of Minimal Mistakes). GitHub
  Pages serves **master**; work on feature branches and merge via PR.
  Merge your own PRs yourself (squash) once tested: the owner does not want to
  click merge. The owner's `.claude/settings.json` allows the GitHub merge tool.
- Content lives in `_pages/`: `about.md` (homepage, permalink `/`),
  `research.md`, `code.md`, `qualtrics-llm.md` (AI interview toolkit),
  `cv.md`. Custom styles in `_sass/_custom.scss` (imported from
  `assets/css/main.scss`); paper figures in `images/wp-*.png`.
- Availability polls: unlisted pages `/femba-midterm/` and `/emba-midterm/`
  (midterm TA sessions: 3-hour windows, Fri Oct 30 and Sat Oct 31, 9am-8pm PT;
  `_pages/{femba,emba}-midterm.html` → `_includes/availability-poll.html`,
  `assets/js/availability-poll.js`). Responses go to a Google Apps Script web
  app (`_apps-script/availability-poll.gs`, not published) that writes to the
  owner's private Google Sheet; its URL is `availability_poll_endpoint` in
  `_config.yml`. The slot list (DAYS × TIMES) is defined in both the .js and
  the .gs file and must stay identical. Changing them needs the owner to paste the
  new .gs and deploy a new version; the first submission then erases the old
  answers (headerOk_/setup). `/poll-results/`
  (`_pages/poll-results.html`, `assets/js/availability-poll-results.js`) shows
  the counts (never emails) to whoever types the password in the sheet's
  Settings tab (B1).
- Unlisted class games: plain HTML files under `games/` (e.g.
  `games/bertrand/index.html` → `/games/bertrand/`), shared by link only and
  never linked from the site. Each carries its own `noindex` tag; a
  `_config.yml` default keeps `games/` out of `sitemap.xml`. Styled after the
  MGMT 405 course site (navy/gold, Carlito + Source Sans 3). The Bertrand game
  has four game types (Simultaneous default, where Airbus always charges its
  Nash price; Leader = the original game logic, except that Airbus's prices
  are not rounded to whole dollars, since rounding let 290 or 294 beat the
  textbook 292; Follower; Collusion) and an algebra guide at
  `games/bertrand/solve/`, whose worked answers assume the default parameters
  (a=400, b=2, c=1, MC=232 for both firms): change the guide if those defaults
  change. A take-turns "Sequential" game was tried and removed: against a
  computer that reacts to the student's price, it is Stackelberg in disguise.
- Research page convention: Working Papers (figure beside abstract), then
  Work in Progress, then Policy and Other Writings — lists, modeled on
  jpchauvin.com/papers.
- CV: edit `files/Rubiao_RafaelM_CV.tex` (pdflatex), recompile, and commit the
  refreshed `files/Rubiao_RafaelM_CV.pdf` alongside it.
- Build: `bundle exec jekyll build` (on Ruby ≥ 3.3, pin `logger 1.5.x` in a
  side Gemfile if the build crashes in Jekyll's log adapter).
