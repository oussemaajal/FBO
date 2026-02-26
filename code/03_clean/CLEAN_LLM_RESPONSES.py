"""
Clean and standardize LLM experiment responses.

Reads raw LLM response parquets from data/intermediate/.
Parses structured JSON responses from each model, extracts ratings/choices,
handles parsing failures gracefully.

Usage:
    python CLEAN_LLM_RESPONSES.py                # Clean all
    python CLEAN_LLM_RESPONSES.py --pilot        # Clean pilot only
    python CLEAN_LLM_RESPONSES.py --dry-run      # Preview without writing

Output:
    data/intermediate/llm_parsed.parquet
"""

import sys
import argparse
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from config import PATHS, DATA_FILES, ensure_dirs_exist


def main(pilot: bool = False, dry_run: bool = False):
    """Clean LLM responses."""
    ensure_dirs_exist()
    mode = "PILOT" if pilot else "FULL"
    print(f"Cleaning LLM responses ({mode} mode)")

    # TODO: Load raw LLM responses from intermediate/llm_responses.parquet
    # TODO: Parse structured JSON from response_text
    # TODO: Extract ratings, choices, free-text explanations
    # TODO: Flag parse failures
    # TODO: Save to DATA_FILES['llm_parsed']

    print("  [NOT YET IMPLEMENTED]")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument('--pilot', action='store_true',
                        help='Clean pilot data only')
    parser.add_argument('--dry-run', action='store_true',
                        help='Preview without writing files')
    args = parser.parse_args()
    main(pilot=args.pilot, dry_run=args.dry_run)
