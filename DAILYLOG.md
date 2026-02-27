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

---

## 2026-02-26 (continued, session 4)

**Within-subjects conversion: everyone sees both formats.**

The biggest structural change so far. Oussema decided that the between-subjects design
(participants see either clean or explicit) should become within-subjects: every participant
sees all 9 trials twice, once in each format, for 18 trials total. The "condition" is now
just the order -- clean_first or explicit_first -- which lets us test for order effects
while getting paired comparisons within each participant.

The motivation is straightforward. A between-subjects design requires large samples to
detect differences because you're comparing different people. A within-subjects design
uses each person as their own control: the same participant guesses the same trial under
both display formats, so any difference is cleanly attributable to the format change rather
than to individual variation in strategic reasoning ability. The cost is a longer survey
(roughly doubled), but the statistical gains are substantial.

The implementation required touching all four core files. In config.js, the single trial
block became two blocks with a transition page between them. The transition page explains
the format change with condition-specific text -- if you started with the clean format,
it tells you that Part 2 will show all slots with [Not shown] markers, and vice versa.
The instructions page was also redesigned: instead of showing only the format you'll use
(which made sense in between-subjects), it now shows both formats side by side so
participants understand what they'll encounter.

In engine.js, the buildPageSequence function was substantially rewritten. Each trial block
now generates two pages per trial instead of one: an N-intro splash page followed by the
actual trial page. The N-intro page is a new design element that shows, in large 96px font,
how many numbers the Sender received in that round. This addresses Oussema's concern that
participants -- especially in the clean condition where hidden numbers are invisible --
might not notice when N changes from 4 to 6 to 8 across trials. Making N its own prominent
page ensures it registers before the participant sees the disclosed numbers and slider.

The block structure also required new navigation logic. Block boundaries are tracked so
participants can't go back from Block 2 to Block 1 (which would let them revise Block 1
answers after seeing the alternative format). The transition page itself blocks backward
navigation and shows a "Begin Part 2" button instead of the usual "Next."

Data collection was updated to key trial guesses by the composite page ID (like "t1_b1"
or "t1_b2") rather than just the trial ID, since the same trial now appears twice. Each
entry records which block it belongs to and which display format was used, making the
analysis straightforward: for each trial, compare the guess under clean vs explicit format,
with block/order as controls.

The survey now has 46 pages total: 5 pre-trial pages (welcome, consent, two instructions,
comprehension), 18 Block 1 pages (9 N-intro + 9 trial), 1 transition page, 18 Block 2
pages, and 4 post-trial pages (attention, post-task questions, demographics, debrief).
The estimated duration went from 8-10 to 12-15 minutes.

Both conditions were tested locally and the survey was deployed to GitHub Pages. Ready for
Oussema to walk through and confirm the experience feels right before we run a pilot.

---

## 2026-02-27

**Instruction redesign: format-specific explanations that arrive just in time.**

Oussema walked through the within-subjects survey and had a crucial observation: showing
both display formats in the instructions at the very beginning was wrong. If a participant
is about to play Block 1 in the clean format, they should only learn what clean looks like.
The explicit format should be explained later, right before Block 2, when they actually need
it. Showing both upfront creates unnecessary cognitive load and might prime participants to
think about the format difference rather than just responding naturally.

This is a subtle but important point about experimental design. In a within-subjects study,
the transition between conditions is itself a moment worth controlling carefully. If both
formats are explained at the start, participants might approach Block 2 differently because
they've been mentally rehearsing the alternative format for the entire first half. By
explaining each format just in time, we keep the participant focused on what's in front of
them.

The instruction flow was restructured from 2 long pages into 5 shorter, focused ones.
"The Guessing Game" was split into three natural sections: who the Sender is (intro), how
the game works (the three steps plus a visual), and the Sender's incentives. The visual is
a pair of CSS-styled "playing cards" showing the numbers 4 and 6 -- a concrete image of what
it looks like for a Sender to receive their secret numbers. Then a format-specific page
explains exactly what the participant will see, using the same simple example: Sender gets
[4, 6], shows only the 6. Finally, a bonus page explains the incentive structure.

The example was also simplified. The old example used N=4 with numbers [1, 4, 5, 10] where
the Sender shows [10] -- effective but perhaps too extreme, with the disclosed number being
the maximum possible value. The new example uses N=2 with [4, 6], Sender shows [6]. This is
gentler and more representative of what participants will actually encounter in trials. The
arithmetic is trivial: (4+6)/2 = 5.00. And a single disclosed number "6" is less dramatic
than "10", which might have anchored participants differently during comprehension.

The transition page between blocks was also redesigned. Instead of just describing the format
change in words, it now shows the OTHER format with the same N=2 visual example. If you
started with clean (just seeing the 6), the transition shows you the explicit format (two
slots: 6 and [Not shown]). This ensures participants understand the new format before
encountering it in Block 2, without having to figure it out from the first trial.

The survey now has 49 pages (up from 46). No engine.js changes were needed -- the existing
condition template system and canvas rendering handled everything. Deployed to GitHub Pages
and ready for Oussema to review.

**Iterative refinements: the devil is in the sequencing.**

Oussema reviewed the survey and spotted three issues that all relate to the same theme: how
the sequence of information affects participant behavior.

First, the N-intro pages (which announce "the Sender received N secret numbers" before each
trial) were displaying the N value in a stacked, three-line layout with the same blue color
used for disclosed numbers. This was asking for confusion -- a participant might see a big
blue "4" and think it's a disclosed value, not the set size. The fix was simple: put
everything on one line ("In this round, the Sender received 4 secret numbers") and color the
number orange instead of blue. The inline layout makes the sentence read naturally, and the
orange creates a visual category distinct from the blue of disclosed values.

Second, a more fundamental design question: should all participants see set sizes in the same
order? In the original design, trial order within each block was fully randomized. But this
ignores a potential order effect. If you see N=4 first (small sets, few hidden numbers), you
might develop certain expectations that carry over differently than if you started with N=8
(large sets, many hidden numbers). The solution was to expand the design from 2 conditions to
4, creating a 2x2: format order (clean_first vs explicit_first) crossed with N order
(ascending 4,6,8 vs descending 8,6,4). Within each N level, the three trials (k=1,2,3) are
still shuffled with a seeded PRNG, but the N levels themselves follow a fixed progression.
This gives us clean identification of any order effects while keeping the within-N-level
variety that prevents participants from predicting what's next.

Third, and most subtle: when trials are sorted by N level, you get boundaries where one
N-group ends and the next begins. If the last trial of N=4 happens to be k=2 (showing [9,6])
and the first trial of N=6 is also k=2 (showing [8,7]), the participant sees two consecutive
trials with the same number of disclosed values and very similar numbers. This might signal
"the game changed -- same disclosure, bigger set -- I should adjust my answer." The participant
should be responding to each trial fresh, not building a narrative about how consecutive trials
relate. The fix ensures that at every N-level boundary, the k value differs, by checking after
the within-group shuffle and swapping if needed.

Finally, Oussema raised a concern about the stimulus values themselves. All 9 trials had high
disclosed values (7-10) because the strategic sender always shows the top-k from a set of
numbers that happened to include high values. But if every disclosed number is obviously above
the midpoint, participants might just anchor on 5 (the unconditional average of 1-10) regardless
of what they see. The fix was to redesign 3 of the 9 trials so the sender's underlying draw is
lower -- disclosed values of [6,5], [5], and [5,4] instead of the original [9,6], [7], and
[10,7]. The sender is still strategic (showing top-k), but now participants encounter trials
where the highest available number is only 5 or 6. This breaks the "everything shown is high"
pattern and forces genuine engagement with each trial's specific numbers.

**Attention checks that don't nudge.**

A persistent challenge in survey design is verifying that participants are paying attention without
inadvertently changing what they pay attention to. Traditional attention checks ("select Strongly
Agree for this question") are intrusive and train participants to look for traps. The checks we
added are different: after 3 randomly-selected trials (one from each third of the experiment),
participants answer recall questions about the round they just completed. How many secret numbers
did the Sender have? How many did they show you? What was the highest number shown?

These are facts that were displayed prominently on the trial page. A participant who was actually
reading and engaging will know the answers immediately. A participant who was clicking through
randomly will struggle. Crucially, none of the questions mention averages, hidden numbers, or
the display format -- so answering them doesn't nudge participants toward any particular guessing
strategy. The checks are pure recall of objective, on-screen information.

The three checks are seeded-randomly placed (deterministic per participant) so we can't be accused
of cherry-picking which trials get checked, and the results are recorded with per-question
correctness flags for analysis.

**Simplifying the design: two conditions, not four.**

After implementing the 2x2 design (format order x N-order), we reconsidered. Oussema wanted the
trial order to be genuinely random rather than following a fixed ascending or descending N pattern.
A fixed progression (always seeing N=4 first, then N=6, then N=8) could create a narrative in
participants' minds about the game getting harder or more complex, which isn't the experience we
want. A random mix -- where you might see N=8, then N=4, then N=6 -- keeps each trial feeling
fresh and independent.

This naturally eliminated the N-order dimension from the design, bringing us back to 2 conditions
(clean_first vs explicit_first) with 120 participants each. The trial ordering uses a constrained
random shuffle: a seeded PRNG generates a random permutation, then a greedy algorithm ensures no
two consecutive trials share the same k value (number disclosed). If the greedy fix fails, it
retries with a different seed, up to 10 attempts. In practice it always succeeds on the first or
second try -- the constraint is mild with 9 trials and only 3 possible k values.

The survey is now 52 pages (49 base + 3 attention checks), takes about 12-15 minutes, and is
deployed to GitHub Pages. Ready for Oussema's final review before launching the pilot.
