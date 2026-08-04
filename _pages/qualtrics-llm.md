---
layout: archive
title: "AI-Led Interview Toolkit for Qualtrics"
permalink: /code/qualtrics-llm/
author_profile: true
---

An interview led by a large language model, run inside an ordinary Qualtrics survey. This is
the module we built for [*Is Money Overrated? Misperceived Satisfaction from
Income*](https://www.nber.org/papers/w35423) (Perez-Truglia and Rubião, NBER Working Paper
No. 35423), packaged so it can be dropped into someone else's survey.

[Repository](https://github.com/rafaelrubiao/ai-interview-toolkit) · [Qualtrics template (.qsf)](https://github.com/rafaelrubiao/ai-interview-toolkit/raw/main/AI_Interview_Module.qsf) · [Implementation guide (PDF)](https://github.com/rafaelrubiao/ai-interview-toolkit/raw/main/guide/guide.pdf)
{: .paper-links}

## What is in the toolkit

**`AI_Interview_Module.qsf`** — a minimal importable Qualtrics survey containing only the
interview module: the situation question, three conversation rounds, decision generation, the
validation step, and two example outcome questions. It contains no credentials; the OpenAI key
is the placeholder `YOUR_OPENAI_API_KEY`.

**The implementation guide** — setup, customization, what happens when things fail, a data
dictionary, and the four interview prompts reproduced verbatim. It is written for researchers
who are comfortable with Qualtrics but have not worked with language models before.

**The prompts** — the four system prompts as plain text files, so you can read or edit them
without opening the survey.

**`build_qsf.py`** — the script that regenerates the template from our fielded survey. It is
there for reproducibility and is not needed to use the toolkit.

## What you need

A Qualtrics account that allows JavaScript on questions (most academic licenses do), an
OpenAI API key, and a small budget for API calls.

Basic use requires no programming. You import the template once, paste your key into a single
field in the Survey Flow, and edit the interview prompts as plain text. The model name and all
four prompts are Survey Flow embedded-data fields, so changing the interview does not mean
touching any JavaScript.

## Building your own

If you want to construct a Qualtrics survey like this from scratch rather than adapt ours, the
[QSF Builder](/code/#qsf-builder) skill writes `.qsf` files directly — including the question
JavaScript for API calls, embedded data, and display logic.

## Citation and credits

If you use the module, please cite the paper it comes from:

> Perez-Truglia, Ricardo, and Rafael M. Rubião. "Is Money Overrated? Misperceived Satisfaction
> from Income." *NBER Working Paper No. 35423*, July 2026.

To pass messages between the survey and the model, the template adapts the
Qualtrics–JavaScript code of Costello, Pennycook, and Rand (2024), "Durably Reducing
Conspiracy Beliefs Through Dialogues with AI," *Science* 385(6714), eadq1814. The interview
protocol, prompts, and choice-generation step are our own.

The toolkit is released under the MIT License. That covers our protocol, prompts, guide, and
build script; it does not extend to the adapted JavaScript, which remains under whatever terms
that work carries.
