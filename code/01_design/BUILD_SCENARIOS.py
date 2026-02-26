"""
Build experiment scenario definitions.

Generates the JSON file defining all conditions, vignettes, and question sets.
Each scenario has: condition (full_disclosure | selective_omission | control),
a vignette text, and associated questions.

Usage:
    python BUILD_SCENARIOS.py                # Build full scenario set
    python BUILD_SCENARIOS.py --pilot        # Build pilot subset
    python BUILD_SCENARIOS.py --dry-run      # Preview without writing

Output:
    data/raw/scenarios/scenarios.json
"""

import sys
import argparse
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from config import PATHS, DATA_FILES, EXPERIMENT_PARAMS, ensure_dirs_exist


def main(pilot: bool = False, dry_run: bool = False):
    """Build scenario definitions."""
    ensure_dirs_exist()
    params = EXPERIMENT_PARAMS['pilot'] if pilot else EXPERIMENT_PARAMS
    mode = "PILOT" if pilot else "FULL"

    print(f"Building scenarios ({mode} mode)")
    print(f"  Conditions: {EXPERIMENT_PARAMS['conditions']}")

    # TODO: Define scenario structure
    # TODO: Generate vignettes for each condition
    # TODO: Write to DATA_FILES['scenario_definitions']

    print("  [NOT YET IMPLEMENTED]")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument('--pilot', action='store_true',
                        help='Generate pilot subset only')
    parser.add_argument('--dry-run', action='store_true',
                        help='Preview without writing files')
    args = parser.parse_args()
    main(pilot=args.pilot, dry_run=args.dry_run)
