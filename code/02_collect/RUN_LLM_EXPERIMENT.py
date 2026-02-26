"""
Run the LLM experiment: send prompts to all registered models.

For each model in the registry (config.MODELS):
    For each condition in the experiment:
        For N runs (with temperature > 0 for variability):
            Send the prompt, record the response

Supports checkpoint/resume: saves results every 10 calls to a parquet file,
skips already-completed (model, condition, run_idx) tuples on resume.

Uses rate limiting and exponential backoff per provider.
Logs cost per call to data/intermediate/cost_log/.

Usage:
    python RUN_LLM_EXPERIMENT.py --pilot --dry-run    # Dry run pilot
    python RUN_LLM_EXPERIMENT.py --pilot               # Run pilot
    python RUN_LLM_EXPERIMENT.py --resume               # Resume interrupted run

Output:
    data/intermediate/llm_responses.parquet
"""

import sys
import argparse
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from config import (PATHS, MODELS, EXPERIMENT_PARAMS, DATA_FILES,
                    get_all_model_specs, load_api_key, ensure_dirs_exist)
from utils import (LLMAdapter, RateLimiter, call_with_retries,
                   is_dry_run, set_dry_run)


def main(pilot: bool = False, dry_run: bool = False, resume: bool = False):
    """Run the LLM experiment."""
    ensure_dirs_exist()
    if dry_run:
        set_dry_run(True)

    params = EXPERIMENT_PARAMS['pilot'] if pilot else EXPERIMENT_PARAMS
    n_runs = params['n_llm_runs_per_model_per_condition']
    conditions = EXPERIMENT_PARAMS['conditions']
    model_specs = get_all_model_specs()
    temperature = EXPERIMENT_PARAMS['temperature']
    max_tokens = EXPERIMENT_PARAMS['max_tokens']

    mode = "PILOT" if pilot else "FULL"
    print(f"LLM Experiment ({mode} mode)")
    print(f"  Models: {len(model_specs)}")
    print(f"  Conditions: {len(conditions)}")
    print(f"  Runs per model per condition: {n_runs}")
    print(f"  Total calls: {len(model_specs) * len(conditions) * n_runs}")
    print(f"  Temperature: {temperature}")

    # Check which keys are available
    available = []
    for spec in model_specs:
        key = load_api_key(spec['api_key_env'])
        status = "READY" if key else "NO KEY"
        print(f"  [{status}] {spec['provider']}/{spec['display_name']}")
        if key:
            available.append(spec)

    if not available:
        print("\nNo API keys configured. Set them in .env and try again.")
        return

    # TODO: Load prompt templates from DATA_FILES['llm_prompts']
    # TODO: Load checkpoint if --resume
    # TODO: For each model, condition, run_idx:
    #   - Skip if already in checkpoint
    #   - Call with retries
    #   - Append result to list
    #   - Save checkpoint every 10 calls
    # TODO: Save final results to intermediate/llm_responses.parquet

    print("\n  [NOT YET IMPLEMENTED]")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument('--pilot', action='store_true',
                        help='Run pilot (fewer runs per condition)')
    parser.add_argument('--dry-run', action='store_true',
                        help='Preview without making API calls')
    parser.add_argument('--resume', action='store_true',
                        help='Resume from last checkpoint')
    args = parser.parse_args()
    main(pilot=args.pilot, dry_run=args.dry_run, resume=args.resume)
