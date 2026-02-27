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

---

## 2026-02-26 (continued)

**Pilot completed, design lessons absorbed, survey redesigned.**

The pilot ran with 10 Prolific participants and the infrastructure worked flawlessly --
every submission landed in the Google Sheet, condition assignment balanced out (6 clean,
4 explicit as expected with n=10 and hash-based assignment), comprehension checks had a
100% pass rate, and the bot detection metrics came back clean for every participant. The
data pipeline from Prolific to Google Sheets to analysis worked end-to-end without a
single manual intervention.

The results themselves were instructive for design rather than for hypothesis testing.
With n=10, we had no statistical power, but the patterns were telling. Both conditions
showed substantial sophistication -- most participants reported believing hidden numbers
were low and adjusting their guesses accordingly. The treatment difference was near zero.
An interesting N x condition interaction emerged (larger swings in the clean condition),
but interpreting that required care. Oussema made an important methodological point: we
should not frame results relative to true averages as if there's a "correct" amount of
adjustment. The only meaningful comparison is between conditions holding everything else
fixed -- how does the guess change when you switch from clean to explicit display?

Three design improvements came out of our discussion:

First, the number input was replaced with a slider. Asking participants to type a precise
decimal (like "4.73") is cognitively burdensome and not really what we care about. A
slider from 1 to 10 with 0.1 step size captures the same information with less friction.
It starts at 5.5 (the midpoint) and participants must drag it before they can advance --
a simple but important validation that prevents accidental submissions at the default.

Second, the stimulus set was redesigned as a 3x3 grid crossing N (4, 6, 8) with k (1, 2,
3). This enables two orthogonal comparisons: Test A holds the disclosure ratio roughly
constant while varying the absolute numbers (does seeing more disclosed numbers anchor you
more?), and Test B holds k fixed while increasing N (does knowing there are more hidden
numbers change your adjustment?). The pilot had only varied N with k=1, so we couldn't
separate these effects.

Third, the disclosed numbers themselves were rendered on HTML5 canvas elements with visual
noise -- random rotation, position jitter, background dots, subtle lines. The digit text
is clear to any human reader but completely invisible in the DOM. An AI agent or bot
reading the page source would see only `<canvas>` elements with no text content. This is a
lightweight anti-AI measure that doesn't degrade the human experience at all.

After implementing all this and deploying, Oussema caught that the instruction example used
the same values (showing a 9) as the actual trial stimuli, and that the disclosed values
were identical within each k level (always [8] for k=1, always [9,7] for k=2, etc.). Both
issues were fixed: the example now uses a Sender with [1, 4, 5, 10] showing only 10 (which
doesn't match any trial), and the disclosed values now vary naturally across all 9 trials
while remaining the top-k values in each set (consistent with strategic sender behavior).

The survey is now deployed and ready for review. The full stimulus grid has satisfying
variation: single disclosures of 7, 8, or 9; pairs like [9,6], [8,7], [10,7]; triples
like [10,7,6], [9,8,5], [8,7,6]. Each trial feels distinct to the participant, which
should reduce the mechanical feeling of doing the same task nine times.
