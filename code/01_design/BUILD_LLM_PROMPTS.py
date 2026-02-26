"""
Build LLM prompt templates from scenario definitions.

Reads scenarios.json and generates structured prompts for each model.
Prompts are designed to mirror the human survey experience: same vignette text,
same questions, formatted for LLM consumption.

Each prompt instructs the model to respond in a structured JSON format
for consistent parsing.

Usage:
    python BUILD_LLM_PROMPTS.py                # Build all prompts
    python BUILD_LLM_PROMPTS.py --pilot        # Build pilot subset
    python BUILD_LLM_PROMPTS.py --dry-run      # Preview without writing

Output:
    data/raw/scenarios/llm_prompts.json
"""

import sys
import argparse
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from config import PATHS, DATA_FILES, EXPERIMENT_PARAMS, ensure_dirs_exist


def main(pilot: bool = False, dry_run: bool = False):
    """Build LLM prompt templates."""
    ensure_dirs_exist()
    mode = "PILOT" if pilot else "FULL"
    print(f"Building LLM prompts ({mode} mode)")

    # TODO: Load scenario definitions from scenarios.json
    # TODO: Build system prompt (role, format instructions)
    # TODO: Build user prompts for each condition
    # TODO: Write to DATA_FILES['llm_prompts']

    print("  [NOT YET IMPLEMENTED]")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument('--pilot', action='store_true',
                        help='Build pilot subset only')
    parser.add_argument('--dry-run', action='store_true',
                        help='Preview without writing files')
    args = parser.parse_args()
    main(pilot=args.pilot, dry_run=args.dry_run)
