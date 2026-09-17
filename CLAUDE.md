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
- Content lives in `_pages/`: `about.md` (homepage, permalink `/`),
  `research.md`, `code.md`, `qualtrics-llm.md` (AI interview toolkit),
  `cv.md`. Custom styles in `_sass/_custom.scss` (imported from
  `assets/css/main.scss`); paper figures in `images/wp-*.png`.
- Research page convention: Working Papers (figure beside abstract), then
  Work in Progress, then Policy and Other Writings — lists, modeled on
  jpchauvin.com/papers.
- CV: edit `files/Rubiao_RafaelM_CV.tex` (pdflatex), recompile, and commit the
  refreshed `files/Rubiao_RafaelM_CV.pdf` alongside it.
- Build: `bundle exec jekyll build` (on Ruby ≥ 3.3, pin `logger 1.5.x` in a
  side Gemfile if the build crashes in Jekyll's log adapter).
