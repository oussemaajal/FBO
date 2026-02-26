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

Do humans and large language models differ in their susceptibility to information omission? When relevant information is selectively omitted from a decision scenario, do AI systems detect the omission or respond as if the information set is complete?

---

## Experiment Design

Two parallel experiments:

1. **Human experiment**: Participants recruited via Prolific, survey hosted on Google Forms. Each participant sees one condition (between-subjects).
2. **LLM experiment**: Same scenarios sent to multiple hosted LLM APIs (OpenAI, Anthropic, Google Gemini, Meta Llama, Mistral). Multiple runs per model (temperature > 0) to capture response variability.

### Conditions

| Condition | Description |
|-----------|-------------|
| `full_disclosure` | Complete information set, nothing omitted |
| `selective_omission` | Key information selectively removed |
| `control` | Baseline scenario without decision-relevant framing |

### Sample Sizes

| Component | Pilot | Full |
|-----------|-------|------|
| Humans per condition | 30 | 200 |
| LLM runs per model per condition | 10 | 30 |
| Total human participants | 90 | 600 |
| Total LLM calls (7 models x 3 conditions) | 210 | 630 |

---

## Key Files and Folders

| File | Purpose |
|------|---------|
| `code/config.py` | Paths, LLM model registry, Prolific config, experiment parameters |
| `code/utils.py` | LLM adapter, caching, rate limiting, Prolific/Forms clients, cost tracking |
| `code/01_design/` | Scenario definitions, survey creation, prompt templates |
| `code/02_collect/` | Prolific study management, LLM API calls, response fetching |
| `code/03_clean/` | Parse and standardize human + LLM responses |
| `code/04_analysis/` | Descriptives, human-vs-LLM comparison, cross-model analysis |
| `data/raw/scenarios/` | Scenario/vignette JSON definitions |
| `data/intermediate/api_cache/` | Cached LLM API responses |
| `data/clean/` | Analysis-ready merged datasets |
| `output/pilot/` | Pilot results (kept separate from main) |

---

## Variable Definitions

| Variable | Definition | Source |
|----------|------------|--------|
| `condition` | Experimental condition (full_disclosure, selective_omission, control) | Random assignment |
| `respondent_type` | `human` or `llm` | Study design |
| `model_id` | LLM model identifier (null for humans) | config.py MODELS |
| `provider` | LLM provider name (null for humans) | config.py MODELS |
| `response_*` | Response variables (Likert scales, free text, etc.) | Survey / LLM output |

---

## Key Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-02-16 | Project initialized with SOP-style structure | Consistency across RESEARCH projects |
| 2026-02-16 | 5 LLM providers (OpenAI, Anthropic, Google, Together/Llama, Mistral) | Broad coverage of major model families |
| 2026-02-16 | Temperature = 0.7 for LLM experiment | Need response variability across runs |
| 2026-02-16 | Google Forms for survey hosting (tentative) | Free, API-accessible; may switch to Qualtrics |

---

## Current Status

**Phase:** Project setup (infrastructure complete, experiment design pending)

**What's done:**
- Full directory structure
- config.py with model registry and experiment parameters
- utils.py with LLM adapter, caching, rate limiting, Prolific/Forms clients
- Stub scripts for all 4 pipeline stages
- run_all.py with --pilot, --dry-run, --stage flags

**What's next:**
- Design experiment scenarios (vignettes, conditions, questions)
- Implement BUILD_SCENARIOS.py
- Test LLM adapter with each provider
- Create pilot survey

---

## Notes for Claude

- **Start every session by reading `WORKLOG.md`**
- **End every session by updating THREE files:** WORKLOG.md, DAILYLOG.md, README.md
- LLM API calls cost real money -- always test with `FBO_DRY_RUN=true`
- API responses are cached in `data/intermediate/api_cache/`
- Use `--pilot` flag on all scripts for smaller-scale runs
- Check cost with: `python code/utils.py --cost-summary`
- Check API key status with: `python code/utils.py --check-keys`
- Experiment calls use temperature > 0 (not cached by default -- each is unique)
- Development/testing calls should use temperature = 0 (cached to save money)
- **Directory cleanup is MANDATORY at session end.** Before finishing, delete any temporary files created during the session. Use `python -c "..."` for quick tests instead of writing temp files. Never create files named `_ul` or with `_` prefix at project root -- they break OneDrive syncing and accumulate as clutter.
- **Do NOT use preview_screenshot.** Taking screenshots via preview tools causes crashes and stalls. When verifying survey UI changes, use text-based tools only: `preview_snapshot` (accessibility tree), `preview_inspect` (CSS/layout), `preview_console_logs` (errors), `preview_network` (requests). Oussema can see the browser himself -- describe what to look for instead of capturing screenshots.
