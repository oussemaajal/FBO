# Daily Progress Log

What was worked on, what we learned, and what's next.
For detailed technical notes, see `WORKLOG.md`.

---

## 2026-02-16

**Project initialized.** Created FBO directory structure mirroring SOP.
Built config.py (paths + LLM model registry for 5 providers/7 models + Prolific
config + experiment parameters), utils.py (LLM adapter with full implementations
for OpenAI/Anthropic/Google/Together/Mistral, response caching, rate limiting,
Prolific client, Google Forms client, cost tracking), run_all.py, 12 stub scripts
across 4 stages, all documentation files.

---

## 2026-02-26

**Major pivot and full survey build.** Today was a big day for this project. The
original plan called for both a human experiment and an LLM experiment, with Google
Forms hosting the human survey. Both of those decisions got scrapped, and the project
is much better for it.

First, the LLM arm was dropped. The core research question -- whether people suffer
from "non-disclosure neglect" when a strategic sender selectively omits information --
is fundamentally about human cognition. Adding LLMs felt like feature creep that would
dilute the contribution rather than strengthen it. We can always add an LLM comparison
later as a follow-up.

Second, Google Forms was replaced with a custom-built web survey. The trigger was
practical -- the Google Cloud platform was confusing and the Forms API surprisingly
limited for what we needed. But the switch turned out to be a significant upgrade.
A custom survey gives us things that would have been impossible or hacky in Forms:
condition-specific trial rendering (showing "[Not shown]" markers in the Explicit
condition vs just the disclosed numbers in Clean), seeded trial randomization using
the participant's Prolific ID, comprehension checks with remedial feedback loops,
minimum reading times on instruction pages, client-side bonus calculation shown on
the debrief page, and silent bot/AI detection running in the background.

The survey engine is designed to be completely config-driven. There is a single file
(config.js) where you define the entire experiment: pages, questions, trials, conditions,
bonus parameters, completion codes. The engine itself (engine.js) is generic -- it reads
the config and renders the appropriate page types. This means the same infrastructure
can be reused for future experiments with zero code changes.

For bot detection, we implemented several complementary techniques: a CSS-hidden
honeypot input field (bots that scrape the DOM and fill all fields will trigger it),
an invisible instruction that tells AI agents to type a specific word in a hidden
verification field, and passive behavioral tracking of mouse movements, keyboard
timing patterns, scroll events, tab switches, and paste events. None of this blocks
the participant -- it just gets submitted alongside their responses for post-hoc
analysis.

The two experimental conditions render beautifully. In the Clean condition, participants
see "The Sender chose to show you: 9" -- just the disclosed numbers, with no indication
of how many were withheld. In the Explicit condition, all N slots are visible: "Number 1:
9, Number 2: [Not shown], Number 3: [Not shown]..." making the omission visually salient.
This is the core manipulation -- whether participants spontaneously represent the missing
information or only process what's in front of them.

The debrief page shows participants their accuracy-based bonus with full transparency:
"GBP 0.40 -- Your guess: 5.5 | True average: 6.50 | Error: 1.00". This is important
both for incentive compatibility and for participant satisfaction.

On the Python side, we stripped out about 600 lines of LLM-related code (the adapter,
rate limiter, caching system, cost tracking, Google Forms client) and simplified the
config to two conditions with pre-generated trial stimuli. The Prolific CLI tool
(RUN_PROLIFIC_STUDY.py) was rewritten with proper subcommands for the full study
management lifecycle.

Everything was tested locally -- both conditions, all page types, mobile viewport,
bonus calculation, bot metrics collection. One bug caught and fixed: the survey engine's
auto-initialization was failing because DOMContentLoaded fires before scripts loaded at
the bottom of the body element get to register their listener.

Next steps: fill in the actual experiment content in config.js, set up the Google Sheets
backend, deploy to GitHub Pages, and run a pilot.
