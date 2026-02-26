"""
Merge human and LLM responses into a unified analysis dataset.

Combines human_parsed.parquet and llm_parsed.parquet with common schema:
    respondent_type (human | llm), model_id, condition, scenario_id,
    response variables, demographics (for humans)

Usage:
    python MERGE_RESPONSES.py                # Merge full dataset
    python MERGE_RESPONSES.py --pilot        # Merge pilot only
    python MERGE_RESPONSES.py --dry-run      # Preview without writing

Output:
    data/clean/all_responses.parquet
    data/clean/pilot_responses.parquet (if --pilot)
"""

import sys
import argparse
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from config import PATHS, DATA_FILES, ensure_dirs_exist


def main(pilot: bool = False, dry_run: bool = False):
    """Merge human and LLM responses."""
    ensure_dirs_exist()
    mode = "PILOT" if pilot else "FULL"
    print(f"Merging responses ({mode} mode)")

    # TODO: Load DATA_FILES['human_parsed']
    # TODO: Load DATA_FILES['llm_parsed']
    # TODO: Standardize columns across both sources
    # TODO: Add respondent_type column
    # TODO: Concatenate and save to DATA_FILES['all_responses']
    #        or DATA_FILES['pilot_responses'] if pilot

    print("  [NOT YET IMPLEMENTED]")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument('--pilot', action='store_true',
                        help='Merge pilot data only')
    parser.add_argument('--dry-run', action='store_true',
                        help='Preview without writing files')
    args = parser.parse_args()
    main(pilot=args.pilot, dry_run=args.dry_run)
