# Work Log

Reverse-chronological record of Claude sessions on this project.
Each entry captures what we were trying to accomplish, how far we got,
and where the next session should pick up.

---

## 2026-02-16 | Session 1: Project initialization

**Goal:** Set up the FBO project directory structure and infrastructure.

**What happened:**
1. Created full directory structure following Gentzkow-Shapiro pattern
   (code/01_design through 04_analysis, data/raw/intermediate/clean, output/)
2. Built `config.py` with:
   - PATHS dict for all directories
   - MODELS registry with 5 providers, 7 models (OpenAI GPT-4o/mini, Anthropic Sonnet 4/Haiku 3.5, Google Gemini 2.0 Flash/2.5 Pro, Together Llama 3.3 70B, Mistral Large)
   - PROLIFIC_CONFIG for Prolific API integration
   - EXPERIMENT_PARAMS with 3 conditions, pilot + full sample sizes
3. Built `utils.py` with full implementations:
   - LLMAdapter class (unified interface to all 5 providers)
   - Hash-based response caching (temperature=0 only by default)
   - RateLimiter with per-provider sliding window + exponential backoff
   - ProlificClient (create, publish, status, approve, demographics)
   - GoogleFormsClient (create form, add questions, get responses)
   - Cost tracking (per-call CSV log, summary reporting)
4. Created 12 stub scripts across 4 pipeline stages
5. Created run_all.py with --pilot, --dry-run, --stage, --list flags
6. Created all documentation files (CLAUDE.md, README.md, WORKLOG.md, DAILYLOG.md)
7. Updated RESEARCH/CLAUDE.md to include FBO in project routing

**Key files created:**
- `code/config.py` -- infrastructure backbone
- `code/utils.py` -- all shared utilities
- `run_all.py` -- pipeline orchestration
- 12 scripts in 01_design/, 02_collect/, 03_clean/, 04_analysis/

**Where this leaves the project:**
Infrastructure is complete. The LLM adapter, caching, rate limiting, and
Prolific/Forms clients are fully implemented and ready to use. All pipeline
scripts are stubs with proper imports and argparse -- ready to implement.

**Next session should probably:**
1. Oussema provides the Prolific API token to test integration
2. Design the actual experiment scenarios (vignettes, conditions, questions)
3. Implement BUILD_SCENARIOS.py to generate scenarios.json
4. Test the LLM adapter with a simple call to each available provider
5. Start building the pilot

---

## 2026-02-26 | Session 2: Major pivot -- human-only experiment + custom survey

**Goal:** Pivot from LLM+human experiment to human-only, and build the full survey
infrastructure from scratch.

**Context from Oussema:**
- Dropped the LLM arm entirely ("I don't think I need an LLM arm")
- Wants a professional, config-driven web survey (not Google Forms -- "too confusing")
- Survey hosted on GitHub Pages, data collected via Google Sheets + Apps Script
- Must include: attention checks, comprehension checks, timing tracking, trial
  randomization, AI/bot detection, accuracy-based bonus calculation, Prolific integration
- User wants to be able to edit experiment parameters locally in a single config file

**What happened:**

1. **Prolific credentials**: Found real API token was sitting in .env.template. Created
   proper .env file with real credentials, cleaned template to placeholders only.

2. **Created full survey infrastructure** (7 new files):
   - `survey/index.html` -- HTML shell with honeypot field (CSS-hidden) and invisible
     AI detection instruction (offscreen text asking AI agents to type 'violet')
   - `survey/css/survey.css` -- Professional design system (~450 lines). Warm gradient
     background, white card, system font stack, custom-styled option cards, likert
     scales, trial cards with distinct disclosed/hidden value styling, page transitions,
     responsive breakpoint at 600px
   - `survey/js/engine.js` -- Core survey engine (~1060 lines). SurveyEngine class with
     full page lifecycle: URL param parsing, seeded condition assignment (hash of PID),
     page sequence building with trial block expansion, 8 page type renderers (welcome,
     consent, instructions, comprehension, trial, attention_check, questionnaire,
     debrief), 5 question type renderers (radio, number, text, likert, dropdown),
     min-time enforcement with countdown overlay, comprehension check with remedial
     flow, seeded trial randomization (mulberry32 PRNG), accuracy-based bonus
     calculation, full timing tracking, localStorage backup via DataStorage, data
     submission to Google Sheets endpoint
   - `survey/js/anti-bot.js` -- Bot/AI detection module (~240 lines). Tracks mouse
     movements (count + sampled positions), clicks, keyboard events + inter-keystroke
     intervals, scroll events, tab switches, paste events, blur time. Computes
     suspicious flags: honeypot_filled, ai_instruction_triggered, no_mouse_movement,
     low_interaction_density, regular_keystroke_timing, excessive_tab_switching,
     no_keyboard_events
   - `survey/js/storage.js` -- Data persistence (~80 lines). localStorage save/load/
     clear for mid-survey resume. POST to Google Apps Script with retry (3 attempts,
     exponential backoff)
   - `survey/js/config.js` -- Heavily documented placeholder config (~200 lines) with
     demo content showing every page type and question type. This is the single file
     Oussema edits to define the experiment.
   - `survey/backend/sheets-script.gs` -- Google Apps Script for data collection.
     Receives JSON POST, flattens nested objects, auto-creates headers, appends row.

3. **Updated Python backend** (3 files):
   - `code/config.py` -- Replaced 3 LLM conditions with 2 human conditions (clean/
     explicit), removed MODELS registry, added STIMULI_FULL (12 trials) and
     STIMULI_PILOT (4 trials) from experimental_design.md, added SURVEY_CONFIG and
     bonus parameters
   - `code/utils.py` -- Stripped all LLM code (~600 lines removed: LLMAdapter,
     RateLimiter, caching, cost tracking, GoogleFormsClient). Kept ProlificClient
     with new methods: pay_bonus(), pay_bonuses_from_csv(), pause_study(),
     list_studies(). Kept DuckDB utilities.
   - `code/02_collect/RUN_PROLIFIC_STUDY.py` -- Rewritten as full CLI tool with
     commands: create, list, publish, pause, status, submissions, approve, bonus

4. **Tested survey in browser**: Launched local dev server, walked through entire
   survey flow. Verified:
   - Welcome page (with/without Prolific URL params)
   - Consent page with checkbox validation
   - Instructions page with min-time enforcement
   - Comprehension check (numeric + radio questions)
   - Trial pages in BOTH conditions:
     - Clean: shows only disclosed numbers ("THE SENDER CHOSE TO SHOW YOU: 9")
     - Explicit: shows all N slots with "[Not shown]" markers for hidden ones
   - Attention check (radio)
   - Post-task questionnaire (radio, likert, dropdown)
   - Demographics page (dropdown)
   - Debrief with bonus display (GBP 0.40, with full transparency of guess/true/error)
   - Completion code display
   - Submission status (correctly shows "no endpoint" warning in dev mode)
   - Bot metrics capture (mouse, keyboard, scroll, paste, tab switches)
   - Mobile responsiveness (375px viewport)
   - Fixed auto-init bug: DOMContentLoaded fires before scripts at bottom of body
     execute, changed to check document.readyState

**Bug fixed:**
- engine.js auto-init: DOMContentLoaded listener was added after the event had
  already fired (scripts at bottom of body). Fixed by checking `document.readyState`
  and calling init immediately if DOM is already ready.

**Key design decisions:**
- Custom HTML/JS survey instead of Google Forms -- gives full control over trial
  rendering, randomization, comprehension branching, timing, and bonus calculation
- Config-driven architecture: engine.js is generic, all experiment content in config.js
- Seeded randomization using PID hash -- deterministic, reproducible, balanced
- Condition assignment via PID hash modulo -- no server-side assignment needed
- Accuracy bonus: random trial selected (seeded), bonus = max(0, 0.50 - 0.10 * error)
- Google Sheets as backend (free, reliable, no server maintenance)

**Where this leaves the project:**
Survey infrastructure is fully built and tested locally. The engine is generic and
reusable. The demo config shows every feature.

**What's needed before deployment:**
1. Oussema fills in config.js with actual experiment content (real instructions,
   comprehension questions, trial stimuli, post-task questions, demographics)
2. Set up Google Sheet + Apps Script (instructions in sheets-script.gs)
3. Configure the data endpoint URL in config.js
4. Deploy survey/ folder to GitHub Pages
5. Set the GitHub Pages URL in SURVEY_CONFIG in config.js and code/config.py
6. Create Prolific study pointing to the GitHub Pages URL
7. Test end-to-end: Prolific link -> survey -> submission -> Sheet row

---

## 2026-02-26 | Session 3: Pilot completed, survey redesign

**Goal:** Run pilot study, analyze results, redesign survey based on findings.

**What happened:**

1. **Deployed survey to GitHub Pages**: Set up gh-pages branch with survey files at
   root level. Configured Google Sheets data endpoint and Prolific completion code
   in config.js.

2. **Prolific pilot study (n=10)**: Created study 69a069767639e75a7bc2b117 on Prolific.
   Applied eligibility filters (US only, approval rate >= 95%) via Prolific API. The
   `eligibility_requirements` field was deprecated; used `filters` field instead.
   Study completed with all 10 participants.

3. **Pilot data analysis**: Downloaded data programmatically via Google Sheets CSV export
   (sheet ID: 1RHYjq2JekRCd3ZHEI6xq706j2WgES4Xg-YCa3E3iaUw). Found 16 rows total
   (10 real, 6 test/debug). Produced comprehensive pilot report at
   output/pilot/pilot_report.txt. Key findings: near-zero treatment effect (clean -0.09
   vs explicit +0.00 bias), but interesting N x condition pattern, and all participants
   showed substantial sophistication (most reported believing hidden numbers were low).

4. **Three-part survey redesign implemented:**

   a. **Slider input** (replaces number input): Range slider from 1.0-10.0, step 0.1,
      starting at midpoint 5.5. Live value display above slider. Must-touch validation
      (data-touched attribute prevents submission at default). Less cognitive burden than
      typing a precise decimal.

   b. **9-trial NxK stimulus grid**: 3x3 design with N in {4,6,8} and k in {1,2,3}.
      Enables two orthogonal tests:
      - Test A (anchoring to disclosure volume): hold k/N ratio ~constant, vary both
      - Test B (adjustment to omission): hold k fixed, increase N
      Initially all disclosed means were 8.0 (identical disclosed values within k level).

   c. **Canvas-rendered digits** (anti-AI): Numbers drawn on HTML5 canvas with random
      rotation, position jitter, background noise dots, and subtle noise lines. DOM
      contains only <canvas> elements with no text -- invisible to text-based AI/bots.
      Trial page digits stored in JS _pendingCanvases map (no data attributes); instruction
      page examples use data-d attributes (acceptable since surrounding text describes them).

5. **Stimulus variation (second iteration)**: Oussema flagged two issues:
   - Instruction example used same values (showing 9) as trial stimuli
   - All trials within each k level had identical disclosed values

   Redesigned: disclosed values now vary across all 9 trials. k=1 uses [8], [7], [9];
   k=2 uses [9,6], [8,7], [10,7]; k=3 uses [10,7,6], [9,8,5], [8,7,6]. All disclosed
   values are always the top-k in the full set (strategic sender). Instruction example
   changed to Sender with [1,4,5,10] showing only [10] (true avg 5.00) -- doesn't match
   any trial setup. Comprehension check updated to match. Canvas font size reduced for
   two-digit numbers (30px vs 36px for single digits).

**Deployment issues encountered and fixed:**
- First gh-pages deploy had stale files (git stash before checkout pulled pre-stash
  versions). Fixed by committing on main first, then pulling from committed state.
- .env file briefly leaked to gh-pages history; flagged to Oussema that Prolific API
  token should be regenerated.

**Current stimulus grid (final):**

| ID | N | k | Disclosed    | Hidden            | True Avg |
|----|---|---|-------------|-------------------|----------|
| t1 | 4 | 1 | [8]         | [4, 3, 1]         | 4.00     |
| t2 | 4 | 2 | [9, 6]      | [3, 2]            | 5.00     |
| t3 | 4 | 3 | [10, 7, 6]  | [1]               | 6.00     |
| t4 | 6 | 1 | [7]         | [5, 4, 3, 2, 1]   | 3.67     |
| t5 | 6 | 2 | [8, 7]      | [5, 3, 2, 1]      | 4.33     |
| t6 | 6 | 3 | [9, 8, 5]   | [3, 2, 1]         | 4.67     |
| t7 | 8 | 1 | [9]         | [6,5,4,3,2,1,1]   | 3.88     |
| t8 | 8 | 2 | [10, 7]     | [5,4,3,2,1,1]     | 4.13     |
| t9 | 8 | 3 | [8, 7, 6]   | [5,3,2,2,1]       | 4.25     |

**Key design principle from Oussema:** Do not interpret results relative to true
averages as a normative benchmark. The right comparison is always between conditions
holding trials fixed -- how does the guess change when the display format changes?
We don't know what participants "should" guess.

**Where this leaves the project:**
Survey redesign complete and deployed to gh-pages. All changes verified locally
(slider, canvas rendering, 9 trials, varied disclosed values, new example). Ready
for Oussema to review live at https://oussemaajal.github.io/FBO/

**Next session should probably:**
1. Oussema reviews the live survey and gives feedback
2. Run full pilot (n=80) or move to full study (n=240)
3. Build analysis pipeline for 9-trial NxK design

---

## 2026-02-26 | Session 4: Within-subjects conversion + N-intro pages

**Goal:** Convert the experiment from between-subjects to within-subjects with
counterbalanced order, and add N-intro splash pages before each trial.

**Context from Oussema:**
- "For the same participant, they go through both the clean and explicit situations,
  but it's just a group go through clean then explicit and the other group goes through
  it the other way around (and those are different conditions)."
- "The number of secret numbers in both conditions (but especially in the clean condition)
  is very unclear, so I'd recommend that we state the number of secret numbers the sender
  gets on its own page that says, the sender got N secret numbers (the N in big font)."
- When asked about trial count (9 split vs 18 total), chose 18 trials (all 9 x both formats).

**What happened:**

1. **config.js changes:**
   - Conditions: `["clean", "explicit"]` -> `["clean_first", "explicit_first"]`
   - Single trial_block replaced with two trial_blocks (block: 1 and block: 2) with
     identical 9-trial stimulus grids. Each block gets independently seeded randomization.
   - New transition page between blocks: explains the format change with condition-specific
     text (uses `<!--if:clean_first-->` / `<!--if:explicit_first-->` templates).
   - Instructions page 2 redesigned: shows BOTH format examples (Format A: Numbers only,
     Format B: All slots visible) instead of condition-specific ones. All participants see
     both since they'll experience both formats.
   - Time estimates updated: "8-10 minutes" -> "12-15 minutes" (welcome + consent pages).
   - Version bumped to "0.2.0-within".

2. **engine.js changes (~13 modifications):**
   - New `getDisplayFormat(block)`: Maps (condition, block) -> 'clean' or 'explicit'.
     clean_first + block 1 = clean, clean_first + block 2 = explicit (and vice versa).
   - `buildPageSequence()` rewrite: For each trial_block, reads `page.block`, computes
     displayFormat via getDisplayFormat(), uses block-specific seed for shuffling
     (`hashString(pid + '_trials_block' + block)`). Inserts TWO pages per trial:
     trial_intro (N-intro splash) + trial page. Records block boundary indices. Also
     handles new 'transition' page type as a block boundary.
   - New `renderTrialIntro(page)`: Shows "Round X of 9 -- Part Y" subtitle + centered
     N in large font (96px) with labels "In this round, the Sender received / [N] / numbers".
   - New `renderTransition(page)`: Processes condition templates same as renderInstructions.
   - `renderPage()` updated: Added 'trial_intro' and 'transition' cases to page type switch.
     Back button hidden at block boundaries and on transition pages. Next button shows
     "Begin Part 2" on transition pages.
   - `renderTrial()` updated: Uses `page.displayFormat` instead of `this.condition` to
     decide clean vs explicit rendering. Canvas IDs include block suffix (`_b1` / `_b2`)
     for uniqueness. Subtitle shows "Part X".
   - `collectPageData()` updated: Trial guesses keyed by `page.id` (e.g., `t1_b1`) instead
     of `page.trial.id`. Each entry includes `trialId`, `block`, `displayFormat` fields.
   - `getAllData()` updated: Adds `block1Format` and `block2Format` to submitted data.
   - `prevPage()` updated: Checks blockBoundaryIndices, refuses to go back past boundaries.
   - Constructor: Added `this.blockBoundaryIndices = []`.

3. **survey.css changes:**
   - New `.n-intro-display`, `.n-intro-number` (96px font, 800 weight, primary-dark color),
     `.n-intro-label` (18px, secondary color) styles.
   - Responsive rule: `.n-intro-number` -> 72px at max-width 600px.

4. **config.py changes:**
   - `'conditions': ['clean', 'explicit']` -> `['clean_first', 'explicit_first']`
   - Updated comments to reflect within-subjects design.

5. **Verified locally with both conditions:**
   - PID "alice" -> clean_first: Block 1 = clean format, Block 2 = explicit format
   - PID "bob" -> explicit_first: Block 1 = explicit format, Block 2 = clean format
   - 46 total pages (welcome, consent, 2 instructions, comprehension, 18 Block 1 pages,
     transition, 18 Block 2 pages, attention, posttask, demographics, debrief)
   - N-intro pages display correctly with large N
   - Transition page shows correct condition-specific text
   - Block boundaries enforced (no back button at block starts or transition)
   - 18 trial guesses in data payload with correct block/displayFormat metadata
   - Bonus calculation works with 18 entries
   - No console errors

6. **Deployed to gh-pages**: Committed on main, copied files to gh-pages, pushed both.

**Page structure (46 pages):**
```
welcome -> consent -> instructions_1 -> instructions_2 -> comprehension
-> [9x (trial_intro + trial)] Block 1  (18 pages)
-> transition
-> [9x (trial_intro + trial)] Block 2  (18 pages)
-> attention_check -> posttask -> demographics -> debrief
```

**Data payload structure:**
- `condition`: "clean_first" or "explicit_first"
- `block1Format`: "clean" or "explicit"
- `block2Format`: "explicit" or "clean"
- `trialGuesses`: 18 entries keyed by page.id (e.g., "t1_b1"), each with:
  `{guess, trueAverage, N, k, disclosed, trialId, block, displayFormat}`

**Where this leaves the project:**
Within-subjects survey deployed to gh-pages. Ready for Oussema to review at
https://oussemaajal.github.io/FBO/

**Next session should probably:**
1. Oussema reviews the live within-subjects survey
2. Run full pilot (n=80) or move to full study (n=240)
3. Build analysis pipeline for within-subjects 18-trial design
4. Consider whether the N-intro page text/styling needs adjustment

---

## 2026-02-27 | Session 5: Instruction redesign -- format-specific explanations

**Goal:** Redesign instruction flow per Oussema's feedback: don't show both formats
upfront, explain each format only right before the block that uses it.

**Context from Oussema:**
- "the explanation of the two different formats shouldn't be done like that, each
  format should be explained when that format is about to be shown in the game"
- "break up the 'The Guessing Game' slide into three separate ones"
- "include a picture in the one that explains what the sender gets"
- "don't use extreme numbers, use the example where there are 2 secret numbers:
  4 and 6, and the sender chooses to show only the 6"

**What happened:**

1. **survey.css changes:**
   - New `.sender-visual`, `.sender-number-cards`, `.sender-number-card` styles:
     playing card aesthetic (72x88px white cards, blue border, rounded corners, subtle
     shadow). `.card-hidden` variant for hidden number cards (grey border, muted text).
   - Responsive: cards shrink to 60x74px on mobile.

2. **config.js changes -- Instruction pages split into 5:**
   - `instructions_1a` ("The Guessing Game"): Just the intro -- who the Sender is,
     that Senders are real human participants from an earlier session. minTime: 15s.
   - `instructions_1b` ("How the Game Works"): 3 steps + sender number card visual
     showing two cards with "4" and "6". The visual uses CSS-styled divs (not canvas).
     minTime: 20s.
   - `instructions_1c` ("The Sender's Goal"): Incentives -- Sender gets paid based on
     your guess, has incentive to make you overestimate. minTime: 15s.
   - `instructions_format` ("What You Will See"): Condition-specific format explanation.
     Uses `<!--if:clean_first-->` / `<!--if:explicit_first-->` templates. Shows the N=2
     example (Sender gets [4,6], shows only [6]) in whichever format comes first.
     Clean shows just the canvas "6"; explicit shows 2 slots with "6" and "[Not shown]".
     minTime: 20s.
   - `instructions_bonus` ("Your Bonus"): Bonus explanation + key takeaway box. minTime: 10s.

3. **config.js changes -- Comprehension check updated:**
   - Old: "A Sender has 4 numbers: 1, 4, 5, 10. They show you only: 10."
   - New: "A Sender has 2 numbers: 4 and 6. They show you only: 6."
   - Answer options: [6.00, 5.00, 4.00, 5.50], correct: 5.00
   - Remedial text updated to reference N=2 example.
   - Q2: "Why might the Sender have shown only the 6?" (was "the 10")

4. **config.js changes -- Transition page redesigned:**
   - Now shows the OTHER format with the same N=2 visual example.
   - For clean_first: transition shows explicit format (2 slots with 6 + [Not shown])
   - For explicit_first: transition shows clean format (just the canvas 6)
   - Includes canvas digit rendering via data-d attributes. minTime: 15s (was 10s).

5. **No engine.js changes needed**: The existing renderInstructions() and
   renderTransition() already support condition templates and canvas data-d attributes.

6. **Verified locally with both conditions:**
   - PID "alice" (clean_first): Format page shows clean format, transition shows explicit
   - PID "bob" (explicit_first): Format page shows explicit format, transition shows clean
   - 49 total pages (was 46; net +3 from splitting 2 instruction pages into 5)
   - Comprehension check uses N=2, [4,6], correct answer 5.00
   - Sender number card visual renders on instructions_1b
   - Canvas digits render correctly on format and transition pages
   - No console errors

7. **Deployed to gh-pages**: Committed on main, copied to gh-pages, pushed both.

**New instruction flow (49 pages):**
```
welcome -> consent
-> instructions_1a: "The Guessing Game" (intro: who the Sender is)
-> instructions_1b: "How the Game Works" (3 steps + sender card visual)
-> instructions_1c: "The Sender's Goal" (incentives)
-> instructions_format: Format explanation + example (condition-specific)
-> instructions_bonus: Bonus + key takeaway
-> comprehension (N=2, [4,6], showing [6])
-> [9x (trial_intro + trial)] Block 1  (18 pages)
-> transition: explain OTHER format with same N=2 example
-> [9x (trial_intro + trial)] Block 2  (18 pages)
-> attention_check -> posttask -> demographics -> debrief
```

**Where this leaves the project:**
Instruction redesign complete and deployed to gh-pages. Each format is now explained
only right before its block. Simpler N=2 example used consistently throughout.

**Next session should probably:**
1. Oussema reviews the live survey at https://oussemaajal.github.io/FBO/
2. Run full pilot (n=80) or proceed to full study (n=240)
3. Build analysis pipeline for within-subjects 18-trial design
