# CLAUDE.md -- Fooled by Omission (FBO) Research Project

---

## Communication Guidelines

- Refer to the user as **Oussema**
- This is a solo project (no co-authors yet)

---

## Estimation Philosophy

**Design before results.** During estimation and analysis:

- Do NOT express concern or excitement about point estimates
- Do NOT interpret results as "good" or "bad" until the design is intentional
- Focus entirely on whether the specification is correct
- Results are meaningless until we're confident the "experiment" is designed on purpose
- Objectivity means being attached to getting the design right, not to any particular finding

---

## Research Question

Do people suffer from "non-disclosure neglect" -- failing to mentally represent undisclosed information when a strategic sender selectively omits it? When relevant information is selectively omitted, do receivers process the disclosed signals as the complete picture, rather than as a selected subset?

---

## Experiment Design

**Human-only experiment** (no LLM arm). Participants recruited via Prolific complete a custom web survey hosted on GitHub Pages.

### The Game

Two players: a Sender and a Receiver (the participant).
- The Sender receives N random numbers (each 1-10)
- The Sender wants the participant to overestimate the average
- The Sender chooses which numbers to reveal
- The participant guesses the true average of ALL N numbers (including hidden ones)
- Accuracy-based bonus: up to GBP 0.50 per participant

### Conditions (between-subjects)

| Condition | Description |
|-----------|-------------|
| `clean` | Participant sees only the disclosed numbers (no indication of how many were withheld) |
| `explicit` | All N slots shown -- disclosed numbers plus "[Not shown]" markers for hidden ones |

### Within-Subjects Variation

- N in {2, 4, 6, 8} (total number of signals)
- Disclosure fraction varies across trials
- 12 trials (full) or 4 trials (pilot) per participant, randomized order

### Sample Sizes

| Component | Pilot | Full |
|-----------|-------|------|
| Per condition | 40 | 120 |
| **Total participants** | **80** | **240** |

---

## Key Files and Folders

| File | Purpose |
|------|---------|
| `survey/` | **Web survey** (deploy to GitHub Pages) |
| `survey/js/config.js` | **EDIT THIS** -- all experiment content (instructions, trials, questions) |
| `survey/js/engine.js` | Generic survey engine (config-driven, ~1060 lines) |
| `survey/js/anti-bot.js` | Bot/AI detection module |
| `survey/js/storage.js` | Data persistence (localStorage + Google Sheets POST) |
| `survey/css/survey.css` | Professional design system |
| `survey/backend/sheets-script.gs` | Google Apps Script for Sheets backend |
| `code/config.py` | Paths, Prolific config, experiment parameters, pre-generated stimuli |
| `code/utils.py` | Prolific client, DuckDB utilities |
| `code/02_collect/RUN_PROLIFIC_STUDY.py` | CLI: create, publish, status, approve, bonus |
| `code/03_clean/` | Data cleaning scripts |
| `code/04_analysis/` | Statistical analysis scripts |
| `notes/experimental_design.md` | Full experiment design document (pitch, design, predictions, power analysis) |
| `notes/theory_framework.md` | Theoretical framework |
| `data/` | Data directory (not tracked in git) |
| `output/` | Results directory (not tracked in git) |

---

## Variable Definitions

| Variable | Definition | Source |
|----------|------------|--------|
| `condition` | Display format: `clean` or `explicit` | Hash of Prolific PID (between-subjects) |
| `guess` | Participant's estimate of Sender's average | Survey response |
| `bias` | guess - true_average (overestimation measure) | Computed |
| `N` | Total number of Sender's signals | Trial parameter |
| `k` | Number of disclosed signals | Trial parameter |
| `disclosed_mean` | Average of disclosed values | Trial parameter |
| `true_average` | True average of all N values | Trial parameter |

---

## Key Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-02-16 | Project initialized with Gentzkow-Shapiro structure | Consistency across RESEARCH projects |
| 2026-02-26 | Dropped LLM arm -- human-only experiment | Cleaner research question, simpler design |
| 2026-02-26 | Custom HTML/JS survey instead of Google Forms | Full control over trial rendering, randomization, timing, bonus calculation |
| 2026-02-26 | Config-driven survey architecture | Single file (config.js) defines all experiment content; engine.js is generic |
| 2026-02-26 | Seeded randomization via PID hash | Deterministic, reproducible, balanced condition assignment without server |
| 2026-02-26 | Google Sheets as data backend | Free, reliable, no server maintenance needed |

---

## Current Status

**Phase:** Survey infrastructure complete, experiment content pending

**What's built:**
- Custom web survey engine (config-driven, generic, reusable)
- Professional UI with responsive design
- Bot/AI detection (honeypot, invisible instruction, behavioral tracking)
- Comprehension checks with remedial flow
- Min-time enforcement on instruction pages
- Seeded trial randomization (deterministic per participant)
- Accuracy-based bonus calculation and display
- localStorage backup for mid-survey resume
- Google Sheets backend (Apps Script)
- Prolific CLI tool for study management
- Git repo on GitHub (private)

**What's next:**
1. Fill in experiment content in `survey/js/config.js`
2. Set up Google Sheet + Apps Script backend
3. Deploy survey to GitHub Pages
4. Run pilot study (80 participants, ~$120)

---

## Notes for Claude

- **Start every session by reading `WORKLOG.md`**
- **End every session by updating THREE files:** WORKLOG.md, DAILYLOG.md, README.md
- Use `--pilot` flag on all scripts for smaller-scale runs
- **Directory cleanup is MANDATORY at session end.** Before finishing, delete any temporary files created during the session. Use `python -c "..."` for quick tests instead of writing temp files. Never create files named `_ul` or with `_` prefix at project root -- they break OneDrive syncing and accumulate as clutter.
- **Do NOT use preview_screenshot.** Taking screenshots via preview tools causes crashes and stalls. When verifying survey UI changes, use text-based tools only: `preview_snapshot` (accessibility tree), `preview_inspect` (CSS/layout), `preview_console_logs` (errors), `preview_network` (requests). Oussema can see the browser himself -- describe what to look for instead of capturing screenshots.
