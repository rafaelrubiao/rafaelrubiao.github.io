---
layout: archive
title: "Code & Resources"
permalink: /code/
author_profile: true
---

Tools I build and reuse across projects — survey instruments, replication code, and
agent skills that automate the repetitive parts of empirical research. Everything here is
free to use; if something breaks or you want to adapt it, [email
me](mailto:rafael.rubiao.phd@anderson.ucla.edu).

## Skills

Packaged instructions that give an AI coding agent (Claude Code, and similar tools) a
reliable, repeatable procedure for a research task — so the work is done the same way
every time instead of being re-improvised in each conversation.

<!-- ─────────────────────────────────────────────────────────────────────────────
     TEMPLATE — copy this block for each skill. Fill in and delete the comment
     markers to publish it.

### <Skill name>

<One or two sentences: what it does, and the manual pain it removes.>

**Use it when:** <the trigger — the situation where you'd reach for it>
**Input → output:** <what you give it → what you get back>

[Repository](<url>) · [Download](<url>)

────────────────────────────────────────────────────────────────────────────── -->

### QSF Builder

Writes Qualtrics Survey Format (`.qsf`) files — the JSON that Qualtrics accepts under
**Survey → Import Survey**. The format is undocumented and unforgiving: several fields have
to agree with each other, and one mismatch makes the import fail without saying why. The
skill carries the structure the agent needs, so you upload a single file instead of adding
questions and pasting JavaScript one at a time in the editor.

It covers question types and validation, survey flow and branching, embedded data, display
and skip logic, question JavaScript (including calls to the OpenAI API from inside a
survey), and editing an existing `.qsf` without disturbing the rest of it.

**Use it when:** building a Qualtrics survey that would be slow to assemble by hand — many
questions, custom JavaScript, embedded data, display logic, or an API call from inside the
survey.
**Input → output:** a description of the survey, or an existing `.qsf` plus the changes you
want → a complete `.qsf` ready to import.

[Repository](https://github.com/rafaelrubiao/qsf-skill) · [Download](https://github.com/rafaelrubiao/qsf-skill/raw/main/SKILL.md)

## Packages

<!-- ─────────────────────────────────────────────────────────────────────────────
     TEMPLATE — copy this block for each package.

### <package-name> <span style="color: #7a8288;">— Stata / R / Python</span>

<What it does in one or two sentences.>

```
<install command>
```

[Repository](<url>) · [Documentation](<url>)

────────────────────────────────────────────────────────────────────────────── -->

*First entries coming shortly.*

## Research Resources

Survey instruments and companion material from my papers, packaged so other researchers can
reuse them.

### AI-Led Interview Toolkit

The AI-led interview module from [*Is Money Overrated? Misperceived Satisfaction from
Income*](https://www.nber.org/papers/w35423), packaged so it can be dropped into any
Qualtrics survey. The method moves beyond static, predefined survey instruments by combining
the flexibility of qualitative interviewing with the discipline of closed-ended survey
measurement.

A respondent describes, in their own words, a real decision they are facing. A large language
model, called in real time from inside the survey, asks up to three adaptive follow-up
questions — clarifying the situation, then probing the main upside, then the main downside.
It then generates a personalized binary choice with a one-sentence description of the
trade-off, which the respondent checks for accuracy. Later questions can use the generated
options in ordinary closed-ended outcome questions.

**What you get:** an importable `.qsf` containing only the interview module, an
implementation guide covering setup, customization and failure behavior, a data dictionary,
and the four interview prompts verbatim.
**What you need:** a Qualtrics account and an OpenAI API key. Basic use requires no
programming — you import the template once, paste in your key, and edit the prompts as plain
text in the Survey Flow.

The repository also includes `build_qsf.py`, the script that regenerates the template from
our fielded survey. It is there for reproducibility and is not needed to use the toolkit.

[Repository](https://github.com/rafaelrubiao/ai-interview-toolkit) · [Qualtrics template (.qsf)](https://github.com/rafaelrubiao/ai-interview-toolkit/raw/main/AI_Interview_Module.qsf) · [Implementation guide (PDF)](https://github.com/rafaelrubiao/ai-interview-toolkit/raw/main/guide/guide.pdf)

To pass messages between the survey and the model, the template adapts the
Qualtrics–JavaScript code of Costello, Pennycook, and Rand (2024), "Durably Reducing
Conspiracy Beliefs Through Dialogues with AI," *Science* 385(6714), eadq1814. The interview
protocol, prompts, and choice-generation step are our own.

## Replication Material

Code and data for my papers are posted alongside each paper. See the
[Research](/research/) page for links — including the [online
appendix](http://www.nber.org/data-appendix/w35423) and [pre-registration](https://www.socialscienceregistry.org/trials/18251)
for *Is Money Overrated?*

## Toolkit

Stata · Python · R · Git · LaTeX
