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
