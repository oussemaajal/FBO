# Fooled by Omission (FBO)

**Author:** Oussema El Ajel

## Research Question

Do people suffer from "non-disclosure neglect" -- failing to mentally represent undisclosed information when a strategic sender selectively omits it?

## Experiment Design

A within-subjects online experiment recruited via Prolific with a custom-built web survey hosted on GitHub Pages.

### Display Formats (within-subjects)

Every participant sees both formats across two blocks of 9 trials each (18 trials total):

| Format | Description |
|--------|-------------|
| `clean` | Participants see only the disclosed numbers (no indication of how many were withheld) |
| `explicit` | All N slots shown -- disclosed numbers plus "[Not shown]" markers for hidden ones |

### Conditions (between-subjects: format order)

| Condition | Block 1 Format | Block 2 Format |
|-----------|---------------|----------------|
| `clean_first` | Clean | Explicit |
| `explicit_first` | Explicit | Clean |

Trial order within each block is fully randomized (seeded by PID), with a constraint that no two consecutive trials share the same k value.

### Sample Sizes

| Component | Pilot | Full |
|-----------|-------|------|
| Per condition | 40 | 120 |
| **Total participants** | **80** | **240** |

### Task

Participants play an "estimation game" against a strategic Sender who:
1. Receives N random numbers (each 1-10)
2. Wants the participant to overestimate the average
3. Chooses which numbers to reveal

The participant guesses the true average of ALL N numbers (including hidden ones).
Accuracy-based bonus: up to $2.00 per participant.

### Within-Subjects Variation

- N in {4, 6, 8} (set size)
- k in {1, 2, 3} (number disclosed)
- 9 trials per block x 2 blocks = 18 trials per participant
- N-intro splash page before each trial (inline, orange N for distinction)
- Disclosed values vary across trials (always top-k; 3 trials have low draws with disclosed <= 6)
- Trial order fully randomized per participant (seeded by PID)
- No-k-adjacency constraint: consecutive trials never share k value
- 3 trial attention checks (recall questions after randomly-selected trials)

## Current Status

**Phase:** Two-part study deployed, ready for pilot

**Architecture:** Two separate Prolific studies:
- **Part 1** (~5 min, $1.00): Visual instructions + comprehension quiz. Passers are added to a Prolific participant group via API.
- **Part 2** (~12 min, $2.50 + up to $2.00 bonus): Trials, posttask, demographics, debrief. Restricted to Part 1 passers via group allowlist.

**What's built:**
- **Two-part Prolific study flow** with automatic participant group enrollment
- Custom web survey engine (config-driven, generic, reusable)
- **Part 1**: 8 visual instruction pages with SVG character icons, card visuals, flow diagram, worked example, 4-question comprehension quiz
- **Part 2**: Welcome-back reminder, interactive slider tutorial, format explanation, 18 trials in 2 blocks, attention checks, posttask, demographics, debrief
- Within-subjects design: 18 trials (9 per format), counterbalanced order
- 2 conditions: clean_first vs explicit_first (format order)
- Fully random trial ordering with no-k-adjacency constraint
- Canvas-rendered digits (anti-AI: no text in DOM)
- Bot/AI detection (honeypot, invisible instruction, behavioral tracking)
- Min-time enforcement on all instruction pages
- Seeded trial randomization (deterministic per participant)
- Accuracy-based bonus calculation and display
- localStorage backup for mid-survey resume
- Google Sheets backend with Prolific API integration
- Prolific CLI tool with `create-two-part` command
- Deployed to GitHub Pages

**Live URLs:**
- Part 1: https://oussemaajal.github.io/FBO/?part=1
- Part 2: https://oussemaajal.github.io/FBO/?part=2

**What's next:**
1. Configure Google Apps Script properties (PROLIFIC_API_TOKEN, PROLIFIC_GROUP_ID)
2. Test end-to-end: Part 1 -> group enrollment -> Part 2 access
3. Run pilot (n=80, 40 per condition) via `create-two-part --pilot`
4. Build analysis pipeline for within-subjects 18-trial design

## Directory Structure

```
FBO/
+-- CLAUDE.md                    # AI assistant instructions
+-- WORKLOG.md                   # Session narrative (for Claude)
+-- DAILYLOG.md                  # Daily summary (for humans)
+-- README.md                    # This file
+-- .env                         # API credentials (not tracked)
+-- .env.template                # Credential template
|
+-- survey/                      # Web survey (deploy this to GitHub Pages)
|   +-- index.html               # HTML shell (honeypot + AI detection elements)
|   +-- css/survey.css           # Professional design system
|   +-- js/
|   |   +-- config.js            # ** EDIT THIS ** -- experiment configuration
|   |   +-- engine.js            # Survey engine (generic, config-driven)
|   |   +-- anti-bot.js          # Bot/AI detection module
|   |   +-- storage.js           # Data persistence (localStorage + Sheets)
|   +-- backend/
|       +-- sheets-script.gs     # Google Apps Script (paste into Sheets)
|
+-- code/
|   +-- config.py                # Paths, experiment params, trial stimuli
|   +-- utils.py                 # Prolific client, DuckDB utilities
|   +-- 01_design/               # Scenario & survey design
|   +-- 02_collect/              # Data collection
|   |   +-- RUN_PROLIFIC_STUDY.py  # CLI: create, publish, status, approve, bonus
|   +-- 03_clean/                # Data cleaning
|   +-- 04_analysis/             # Statistical analysis
|   +-- scratchpad/              # Exploratory scripts
|
+-- data/
|   +-- raw/prolific/            # Raw Prolific metadata
|   +-- raw/responses/           # Raw survey responses (from Sheets)
|   +-- intermediate/            # Processed data
|   +-- clean/                   # Analysis-ready datasets
|
+-- output/
|   +-- tables/                  # LaTeX tables, CSVs
|   +-- figures/                 # Plots and charts
|   +-- pilot/                   # Pilot-specific results
|
+-- docs/                        # IRB, pre-registration
+-- notes/                       # Experiment design, analysis memos
```

## Data Flow

```
Part 1: Participant clicks Prolific link
  --> GitHub Pages survey (?part=1&PROLIFIC_PID=X&STUDY_ID=Y&SESSION_ID=Z)
  --> Visual instructions + comprehension quiz
  --> JSON POST to Google Sheets Apps Script
  --> If passed: Apps Script adds PID to Prolific participant group via API
  --> Redirect to Prolific (PASS1FBO or FAIL1FBO code)

Part 2: Participant (group member) clicks Prolific link
  --> GitHub Pages survey (?part=2&PROLIFIC_PID=X&STUDY_ID=Y&SESSION_ID=Z)
  --> Engine assigns condition (hash of PID)
  --> Slider tutorial, then 18 trials + posttask + demographics
  --> Bonus calculated client-side, shown on debrief
  --> JSON POST to Google Sheets Apps Script
  --> Redirect to Prolific (PART2FBO code)

Post-collection:
  --> Download Google Sheet as CSV
  --> Python cleaning scripts merge with Prolific metadata
  --> Bonus CSV generated
  --> Paid via: python RUN_PROLIFIC_STUDY.py bonus STUDY_ID --csv bonuses.csv
```

## Quick Start

### Local testing
```bash
cd survey
python -m http.server 8080
# Part 1: http://localhost:8080/?part=1&dev=true&PROLIFIC_PID=TEST123
# Part 2: http://localhost:8080/?part=2&dev=true&PROLIFIC_PID=TEST123
```

### Prolific management
```bash
cd code/02_collect
python RUN_PROLIFIC_STUDY.py create-two-part --pilot --dry-run  # Preview two-part setup
python RUN_PROLIFIC_STUDY.py create-two-part --pilot             # Create group + both studies
python RUN_PROLIFIC_STUDY.py publish STUDY_ID                    # Publish a study
python RUN_PROLIFIC_STUDY.py status STUDY_ID                     # Check status
python RUN_PROLIFIC_STUDY.py approve STUDY_ID                    # Approve submissions
python RUN_PROLIFIC_STUDY.py bonus STUDY_ID --csv FILE           # Pay bonuses
```

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `PROLIFIC_API_TOKEN` | Prolific API token |
| `PROLIFIC_WORKSPACE_ID` | Prolific workspace ID |
| `PROLIFIC_PROJECT_ID` | Prolific project ID |

## Project Logs

| File | Audience | Purpose |
|------|----------|---------|
| WORKLOG.md | Claude (AI) | Detailed session-by-session narrative |
| DAILYLOG.md | Humans | Essay-style per-day research diary |
| CLAUDE.md | Claude (AI) | Project instructions and experiment design |
